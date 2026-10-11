import * as THREE from "three";

import { MUNDO_POR_SLUG } from "@/contenido/mundos";
import { CIUDADES_EN_ANILLO, dentroDe, ventanaTramo } from "@/lib/progreso-intro";

import { SUELO, rgb } from "./anillo";

// Las 15 ciudades sobre el suelo del anillo (entre los dos rebordes), así se
// ven durante todo el recorrido. Cada ciudad: un racimo de edificios finos
// con una torre central, ventanas de neón de su color (y algunas cálidas) que
// se prenden en cascada (600 ms) y titilan despacio, balizas en los techos de
// las torres y un resplandor de su color en el suelo. Idea fuerza de la ficha:
// «cada mundo es una ciudad que se enciende de noche». Todo instanciado: dos
// draw calls para las 15 ciudades.

export const EDIFICIOS_POR_CIUDAD = 36;

interface Edificio {
  ciudad: number;
  /** Retraso de encendido dentro de la ciudad (0 → 1). */
  orden: number;
}

function aleatorio(semilla: number) {
  let s = semilla;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const VERTICE_EDIFICIOS = /* glsl */ `
attribute vec3 aColor;
attribute vec3 aEscala;
attribute float aLuz;
attribute float aAparece;
attribute float aSemilla;
attribute float aTorre;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vColor;
varying vec3 vEscala;
varying float vLuz;
varying float vSemilla;
varying float vAparece;
varying float vTorre;

void main() {
  // Sube desde el suelo: la altura crece con aAparece y la base también (en 0
  // el edificio no existe, no queda una sombra plana).
  vec3 p = position + vec3(0.0, 0.5, 0.0);
  p.y *= aAparece;
  p.xz *= min(1.0, aAparece * 3.0);
  vLocal = p;
  vNormalLocal = normal;
  vColor = aColor;
  vEscala = aEscala;
  vLuz = aLuz;
  vSemilla = aSemilla;
  vAparece = aAparece;
  vTorre = aTorre;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(p, 1.0);
}
`;

const FRAGMENTO_EDIFICIOS = /* glsl */ `
uniform float uTiempo;
uniform float uOpacidad;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vColor;
varying vec3 vEscala;
varying float vLuz;
varying float vSemilla;
varying float vAparece;
varying float vTorre;

float azar(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Banda suavizada entre a y b (sin dientes ni parpadeo al moverse).
float banda(float x, float a, float b) {
  float w = fwidth(x);
  return smoothstep(a - w, a + w, x) * (1.0 - smoothstep(b - w, b + w, x));
}

void main() {
  if (vAparece < 0.02) discard;
  float lateral = 1.0 - step(0.5, abs(vNormalLocal.y));
  // Cuerpo oscuro, un poco más claro arriba, con un tinte de su ciudad.
  vec3 cuerpo = mix(vec3(0.025, 0.03, 0.065), vec3(0.08, 0.08, 0.16), vLocal.y) + vColor * 0.05;
  // Ventanas: grilla en unidades del mundo sobre las caras laterales.
  vec2 uv = abs(vNormalLocal.x) > 0.5 ? vec2(vLocal.z * vEscala.z, vLocal.y * vEscala.y) : vec2(vLocal.x * vEscala.x, vLocal.y * vEscala.y);
  vec2 g = uv / vec2(0.06, 0.07);
  vec2 celda = floor(g);
  vec2 f = fract(g);
  float ventana = banda(f.x, 0.22, 0.78) * banda(f.y, 0.28, 0.76) * lateral;
  float h = azar(celda + vSemilla * 17.0);
  float umbral = vLuz * (0.5 + 0.25 * sin(uTiempo * 0.35 + h * 40.0));
  float encendida = 1.0 - smoothstep(umbral - 0.04, umbral, h);
  vec3 tonoVentana = mix(vColor, vec3(1.0, 0.9, 0.72), step(0.88, azar(celda.yx + vSemilla)));
  vec3 color = cuerpo + tonoVentana * ventana * encendida * 1.45;
  // Baliza en el techo de las torres.
  float techo = step(0.5, vNormalLocal.y);
  color += vColor * techo * vTorre * vLuz * (1.1 + 0.6 * sin(uTiempo * 2.2 + vSemilla));
  gl_FragColor = vec4(color, uOpacidad);
}
`;

// Resplandor de cada ciudad en la pared (aditivo).
const VERTICE_RESPLANDOR = /* glsl */ `
attribute vec3 aColor;
attribute float aIntensidad;
varying vec2 vUv;
varying vec3 vColor;
varying float vIntensidad;
void main() {
  vUv = uv;
  vColor = aColor;
  vIntensidad = aIntensidad;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
}
`;

const FRAGMENTO_RESPLANDOR = /* glsl */ `
uniform float uOpacidad;
varying vec2 vUv;
varying vec3 vColor;
varying float vIntensidad;
void main() {
  vec2 c = (vUv - 0.5) * vec2(1.0, 1.6);
  float a = pow(max(0.0, 1.0 - length(c) * 2.0), 2.2) * vIntensidad * uOpacidad;
  gl_FragColor = vec4(vColor, a * 0.9);
}
`;

export function crearCiudades() {
  const n = CIUDADES_EN_ANILLO.length;
  const total = n * EDIFICIOS_POR_CIUDAD;
  const geometria = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTICE_EDIFICIOS,
    fragmentShader: FRAGMENTO_EDIFICIOS,
    transparent: true,
    uniforms: { uTiempo: { value: 0 }, uOpacidad: { value: 1 } },
  });
  const malla = new THREE.InstancedMesh(geometria, material, total);
  malla.frustumCulled = false;

  const color = new Float32Array(total * 3);
  const escala = new Float32Array(total * 3);
  const luz = new Float32Array(total);
  const aparece = new Float32Array(total);
  const semilla = new Float32Array(total);
  const torre = new Float32Array(total);
  const edificios: Edificio[] = [];

  const azar = aleatorio(15151515);
  // Distribución con más densidad al centro de la ciudad (suma de dos azares).
  const centrado = () => (azar() + azar() - 1) / 2;
  const matriz = new THREE.Matrix4();
  const radioMedio = (SUELO.desde + SUELO.hasta) / 2;
  const semiancho = (SUELO.hasta - SUELO.desde) / 2 - 0.12;
  let i = 0;
  CIUDADES_EN_ANILLO.forEach((ciudad, c) => {
    const tono = rgb(MUNDO_POR_SLUG[ciudad.slug].neon);
    for (let k = 0; k < EDIFICIOS_POR_CIUDAD; k++) {
      const esTorre = k === 0 ? 1 : azar() < 0.12 ? 1 : 0;
      const dispersion = esTorre && k === 0 ? 0.15 : 1;
      const angulo = ((ciudad.angulo + centrado() * 10 * dispersion) * Math.PI) / 180;
      const desvio = centrado() * semiancho * 2 * dispersion;
      const ancho = esTorre ? 0.17 + azar() * 0.1 : 0.12 + azar() * 0.2;
      const fondo = esTorre ? 0.17 + azar() * 0.1 : 0.12 + azar() * 0.2;
      // Más altos cerca del centro de la ciudad, como un skyline.
      const cercania = 1 - Math.min(1, Math.abs(desvio) / semiancho);
      const alto = esTorre ? (k === 0 ? 1.55 : 1.05) + azar() * 0.45 : 0.22 + (0.3 + 0.7 * cercania) * azar() ** 1.4;
      const cs = Math.cos(angulo);
      const sn = Math.sin(angulo);
      // Base del edificio en el suelo; su «arriba» es +Y.
      const tangente = new THREE.Vector3(-sn, 0, cs);
      const arriba = new THREE.Vector3(0, 1, 0);
      const adentro = new THREE.Vector3(-cs, 0, -sn);
      matriz.makeBasis(tangente.multiplyScalar(ancho), arriba.multiplyScalar(alto), adentro.multiplyScalar(fondo));
      const radio = radioMedio + desvio;
      matriz.setPosition(radio * cs, SUELO.altura, radio * sn);
      malla.setMatrixAt(i, matriz);
      color.set([tono.x, tono.y, tono.z], i * 3);
      escala.set([ancho, alto, fondo], i * 3);
      semilla[i] = azar() * 100;
      torre[i] = esTorre;
      edificios.push({ ciudad: c, orden: azar() });
      i++;
    }
  });
  malla.instanceMatrix.needsUpdate = true;
  geometria.setAttribute("aColor", new THREE.InstancedBufferAttribute(color, 3));
  geometria.setAttribute("aEscala", new THREE.InstancedBufferAttribute(escala, 3));
  geometria.setAttribute("aSemilla", new THREE.InstancedBufferAttribute(semilla, 1));
  geometria.setAttribute("aTorre", new THREE.InstancedBufferAttribute(torre, 1));
  const atributoLuz = new THREE.InstancedBufferAttribute(luz, 1).setUsage(THREE.DynamicDrawUsage);
  const atributoAparece = new THREE.InstancedBufferAttribute(aparece, 1).setUsage(THREE.DynamicDrawUsage);
  geometria.setAttribute("aLuz", atributoLuz);
  geometria.setAttribute("aAparece", atributoAparece);

  // ── Resplandores en la pared, uno por ciudad ──
  const geometriaResplandor = new THREE.PlaneGeometry(1, 1);
  const materialResplandor = new THREE.ShaderMaterial({
    vertexShader: VERTICE_RESPLANDOR,
    fragmentShader: FRAGMENTO_RESPLANDOR,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uOpacidad: { value: 1 } },
  });
  const resplandores = new THREE.InstancedMesh(geometriaResplandor, materialResplandor, n);
  resplandores.frustumCulled = false;
  const colorResplandor = new Float32Array(n * 3);
  const intensidad = new Float32Array(n);
  CIUDADES_EN_ANILLO.forEach((ciudad, c) => {
    const tono = rgb(MUNDO_POR_SLUG[ciudad.slug].neon);
    const angulo = (ciudad.angulo * Math.PI) / 180;
    const cs = Math.cos(angulo);
    const sn = Math.sin(angulo);
    // Plano horizontal sobre el suelo, apenas por encima.
    const tangente = new THREE.Vector3(-sn, 0, cs).multiplyScalar(2.4);
    const afuera = new THREE.Vector3(cs, 0, sn).multiplyScalar((SUELO.hasta - SUELO.desde) * 1.15);
    const arriba = new THREE.Vector3(0, 1, 0);
    matriz.makeBasis(tangente, afuera, arriba);
    matriz.setPosition(radioMedio * cs, SUELO.altura + 0.01, radioMedio * sn);
    resplandores.setMatrixAt(c, matriz);
    colorResplandor.set([tono.x, tono.y, tono.z], c * 3);
  });
  resplandores.instanceMatrix.needsUpdate = true;
  geometriaResplandor.setAttribute("aColor", new THREE.InstancedBufferAttribute(colorResplandor, 3));
  const atributoIntensidad = new THREE.InstancedBufferAttribute(intensidad, 1).setUsage(THREE.DynamicDrawUsage);
  geometriaResplandor.setAttribute("aIntensidad", atributoIntensidad);

  const grupo = new THREE.Group();
  grupo.add(resplandores, malla);

  /** Estado de cada edificio para un progreso dado (mismas reglas que el 2D). */
  function actualizar(p: number, tiempo: number, opacidad: number) {
    const encendidoCiudad = new Float32Array(n);
    edificios.forEach((edificio, j) => {
      const ciudad = CIUDADES_EN_ANILLO[edificio.ciudad];
      const sube = dentroDe(p, [ciudad.progreso - 0.006, ciudad.progreso + 0.004]);
      const enciende = dentroDe(p, [ciudad.progreso + edificio.orden * 0.01, ciudad.progreso + 0.004 + edificio.orden * 0.01]);
      const brillo = p > ventanaTramo(ciudad.tramo)[1] ? 0.6 : 1;
      // Se apagan una a una al revés del trazado, y en 3D más rápido que en 2D:
      // tienen que irse antes de que la banda se aplane (los edificios quedarían
      // flotando sobre el aro).
      const inicioApagado = 0.8 + (n - 1 - edificio.ciudad) * 0.0022;
      const apagado = dentroDe(p, [inicioApagado, inicioApagado + 0.01]);
      aparece[j] = sube * sube * (3 - 2 * sube) * (1 - apagado);
      luz[j] = enciende * brillo * (1 - apagado);
      encendidoCiudad[edificio.ciudad] = Math.max(encendidoCiudad[edificio.ciudad], luz[j]);
    });
    for (let c = 0; c < n; c++) intensidad[c] = encendidoCiudad[c];
    atributoLuz.needsUpdate = true;
    atributoAparece.needsUpdate = true;
    atributoIntensidad.needsUpdate = true;
    material.uniforms.uTiempo.value = tiempo;
    material.uniforms.uOpacidad.value = opacidad;
    materialResplandor.uniforms.uOpacidad.value = opacidad;
  }

  function destruir() {
    geometria.dispose();
    material.dispose();
    geometriaResplandor.dispose();
    materialResplandor.dispose();
  }

  return { grupo, actualizar, destruir };
}
