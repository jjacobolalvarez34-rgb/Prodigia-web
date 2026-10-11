import * as THREE from "three";

import { MUNDO_POR_SLUG } from "@/contenido/mundos";
import { CIUDADES_EN_ANILLO, dentroDe, ventanaTramo } from "@/lib/progreso-intro";

import { GROSOR_BANDA, MEDIA_ALTURA_BANDA, RADIO, rgb } from "./anillo";

// Las 15 ciudades como edificios instanciados (un solo InstancedMesh) sobre la
// cara interior de la banda, apuntando al centro del anillo, como en un
// mundo-anillo. Cada ciudad se enciende al paso de la pluma: los edificios
// suben desde la pared y las ventanas de neón de su color se prenden en
// cascada (600 ms) y titilan despacio (idea fuerza de la ficha: «cada mundo es
// una ciudad que se enciende de noche»). Al llegar el logo, se apagan una a una
// al revés del trazado.

export const EDIFICIOS_POR_CIUDAD = 14;

interface Edificio {
  ciudad: number;
  /** Retraso de encendido dentro de la ciudad (0 → 1). */
  orden: number;
}

function aleatorio(semilla: number) {
  let s = semilla;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const VERTICE = /* glsl */ `
attribute vec3 aColor;
attribute vec3 aEscala;
attribute float aLuz;
attribute float aAparece;
attribute float aSemilla;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vColor;
varying vec3 vEscala;
varying float vLuz;
varying float vSemilla;
varying float vAparece;

void main() {
  // Sube desde la pared: la altura crece con aAparece y la base también
  // (en 0 el edificio no existe, no queda una sombra plana).
  vec3 p = position + vec3(0.0, 0.5, 0.0);
  p.y *= aAparece;
  p.xz *= min(1.0, aAparece * 3.0);
  vAparece = aAparece;
  vLocal = p;
  vNormalLocal = normal;
  vColor = aColor;
  vEscala = aEscala;
  vLuz = aLuz;
  vSemilla = aSemilla;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(p, 1.0);
}
`;

const FRAGMENTO = /* glsl */ `
uniform float uTiempo;
uniform float uOpacidad;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vColor;
varying vec3 vEscala;
varying float vLuz;
varying float vSemilla;
varying float vAparece;

float azar(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  if (vAparece < 0.02) discard;
  vec3 cuerpo = vec3(0.07, 0.08, 0.15) + vColor * 0.08;
  float lateral = 1.0 - step(0.5, abs(vNormalLocal.y));
  // Ventanas en las caras laterales: una grilla en unidades del mundo.
  vec2 uv = abs(vNormalLocal.x) > 0.5 ? vec2(vLocal.z * vEscala.z, vLocal.y * vEscala.y) : vec2(vLocal.x * vEscala.x, vLocal.y * vEscala.y);
  vec2 tam = vec2(0.17, 0.2);
  vec2 celda = floor(uv / tam);
  vec2 f = fract(uv / tam);
  float ventana = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.78) * lateral;
  float h = azar(celda + vSemilla * 17.0);
  // Se prenden en cascada con vLuz y titilan despacio.
  float umbral = vLuz * (0.62 + 0.22 * sin(uTiempo * 0.35 + h * 40.0));
  float encendida = step(h, umbral);
  vec3 color = cuerpo + vColor * ventana * encendida * 1.25;
  // El techo (hacia el centro del anillo) recibe un brillo leve de su color.
  color += vColor * (1.0 - lateral) * step(0.0, vNormalLocal.y) * 0.18 * vLuz;
  gl_FragColor = vec4(color, uOpacidad);
}
`;

export function crearCiudades() {
  const total = CIUDADES_EN_ANILLO.length * EDIFICIOS_POR_CIUDAD;
  const geometria = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
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
  const edificios: Edificio[] = [];

  const azar = aleatorio(15151515);
  const matriz = new THREE.Matrix4();
  const radioPared = RADIO - GROSOR_BANDA;
  let i = 0;
  CIUDADES_EN_ANILLO.forEach((ciudad, c) => {
    const tono = rgb(MUNDO_POR_SLUG[ciudad.slug].neon);
    for (let k = 0; k < EDIFICIOS_POR_CIUDAD; k++) {
      // Repartidos ±2.6° a lo largo del arco y a lo ancho de la banda.
      const angulo = ((ciudad.angulo + (azar() - 0.5) * 6) * Math.PI) / 180;
      const y = (azar() - 0.5) * MEDIA_ALTURA_BANDA * 1.55;
      const ancho = 0.32 + azar() * 0.3;
      const fondo = 0.32 + azar() * 0.3;
      const alto = 0.4 + azar() ** 1.5 * 1.3;
      const cs = Math.cos(angulo);
      const sn = Math.sin(angulo);
      // Base del edificio en la pared interior; su «arriba» apunta al centro.
      const tangente = new THREE.Vector3(-sn, 0, cs);
      const adentro = new THREE.Vector3(-cs, 0, -sn);
      const eje = new THREE.Vector3(0, -1, 0);
      matriz.makeBasis(tangente.multiplyScalar(ancho), adentro.multiplyScalar(alto), eje.multiplyScalar(fondo));
      matriz.setPosition(radioPared * cs, y, radioPared * sn);
      malla.setMatrixAt(i, matriz);
      color.set([tono.x, tono.y, tono.z], i * 3);
      escala.set([ancho, alto, fondo], i * 3);
      semilla[i] = azar() * 100;
      edificios.push({ ciudad: c, orden: azar() });
      i++;
    }
  });
  malla.instanceMatrix.needsUpdate = true;
  geometria.setAttribute("aColor", new THREE.InstancedBufferAttribute(color, 3));
  geometria.setAttribute("aEscala", new THREE.InstancedBufferAttribute(escala, 3));
  const atributoLuz = new THREE.InstancedBufferAttribute(luz, 1);
  const atributoAparece = new THREE.InstancedBufferAttribute(aparece, 1);
  atributoLuz.setUsage(THREE.DynamicDrawUsage);
  atributoAparece.setUsage(THREE.DynamicDrawUsage);
  geometria.setAttribute("aLuz", atributoLuz);
  geometria.setAttribute("aAparece", atributoAparece);
  geometria.setAttribute("aSemilla", new THREE.InstancedBufferAttribute(semilla, 1));

  const n = CIUDADES_EN_ANILLO.length;

  /** Estado de cada edificio para un progreso dado (mismas reglas que el 2D). */
  function actualizar(p: number, tiempo: number) {
    edificios.forEach((edificio, j) => {
      const ciudad = CIUDADES_EN_ANILLO[edificio.ciudad];
      const sube = dentroDe(p, [ciudad.progreso - 0.006, ciudad.progreso + 0.004]);
      const enciende = dentroDe(p, [ciudad.progreso + edificio.orden * 0.01, ciudad.progreso + 0.004 + edificio.orden * 0.01]);
      const brillo = p > ventanaTramo(ciudad.tramo)[1] ? 0.6 : 1;
      const inicioApagado = 0.81 + (n - 1 - edificio.ciudad) * 0.0045;
      const apagado = dentroDe(p, [inicioApagado, inicioApagado + 0.012]);
      aparece[j] = sube * sube * (3 - 2 * sube) * (1 - apagado);
      luz[j] = enciende * brillo * (1 - apagado);
    });
    atributoLuz.needsUpdate = true;
    atributoAparece.needsUpdate = true;
    material.uniforms.uTiempo.value = tiempo;
  }

  return { malla, actualizar, material };
}
