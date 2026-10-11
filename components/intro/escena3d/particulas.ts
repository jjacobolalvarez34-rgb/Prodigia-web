import * as THREE from "three";

// Partículas de la escena 3D con el presupuesto de DISENO.md §5:
// - Estrellas lejanas: 900 (móvil 400), titileo lento desfasado, dos tamaños.
// - Rastro del trazo: tinta dorada (máx. 120 / 60 vivas) y polvo violeta del
//   anillo (400 / 180), en un solo sistema: nunca más de dos sistemas a la vez.
// Nunca tapan el texto: dentro de la zona de texto su opacidad baja al 30 %.

function aleatorio(semilla: number) {
  let s = semilla;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const VERTICE_ESTRELLAS = /* glsl */ `
attribute float aTam;
attribute float aFase;
attribute float aBrillo;
attribute vec3 aColor;
uniform float uTiempo;
uniform float uPixel;
varying float vAlfa;
varying vec3 vColor;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aTam * uPixel;
  float periodo = 3.0 + aFase * 4.0;
  vAlfa = aBrillo * (0.6 + 0.4 * sin(uTiempo * 6.2832 / periodo + aFase * 6.2832));
  vColor = aColor;
}
`;

// Atenuación en la zona de texto: gl_FragCoord está en píxeles del lienzo
// (desde abajo); uZona en px CSS desde arriba.
const ZONA = /* glsl */ `
uniform float uPixel;
uniform vec2 uLienzo;
uniform vec4 uZona;
float atenuar() {
  vec2 f = vec2(gl_FragCoord.x, uLienzo.y - gl_FragCoord.y) / uPixel;
  bool dentro = f.x > uZona.x && f.x < uZona.x + uZona.z && f.y > uZona.y && f.y < uZona.y + uZona.w;
  return dentro ? 0.3 : 1.0;
}
`;

const FRAGMENTO_ESTRELLAS = /* glsl */ `
${ZONA}
varying float vAlfa;
varying vec3 vColor;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = vAlfa * smoothstep(0.5, 0.05, d) * atenuar();
  gl_FragColor = vec4(vColor, a);
}
`;

const VERTICE_RASTRO = /* glsl */ `
attribute float aTam;
attribute float aAlfa;
attribute vec3 aColor;
uniform float uPixel;
uniform float uEscalaTam;
varying float vAlfa;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aTam * uPixel * uEscalaTam / max(0.5, -mv.z);
  vAlfa = aAlfa;
  vColor = aColor;
}
`;

const FRAGMENTO_RASTRO = /* glsl */ `
${ZONA}
varying float vAlfa;
varying vec3 vColor;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = vAlfa * smoothstep(0.5, 0.0, d) * atenuar();
  gl_FragColor = vec4(vColor, a);
}
`;

function uniformesZona() {
  return {
    uPixel: { value: 1 },
    uLienzo: { value: new THREE.Vector2(1, 1) },
    uZona: { value: new THREE.Vector4(0, 0, 0, 0) },
  };
}

export function crearEstrellas(cantidad: number) {
  const azar = aleatorio(9001);
  const posicion = new Float32Array(cantidad * 3);
  const tam = new Float32Array(cantidad);
  const fase = new Float32Array(cantidad);
  const brillo = new Float32Array(cantidad);
  const color = new Float32Array(cantidad * 3);
  for (let i = 0; i < cantidad; i++) {
    // En una cáscara lejana alrededor del anillo.
    const u = azar() * 2 - 1;
    const t = azar() * Math.PI * 2;
    const r = 120 + azar() * 60;
    const s = Math.sqrt(1 - u * u);
    posicion.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
    tam[i] = azar() < 0.85 ? 1.4 : 2.4;
    fase[i] = azar();
    brillo[i] = 0.3 + azar() * 0.6;
    const lila = azar() < 0.25;
    color.set(lila ? [0.73, 0.66, 1] : [0.96, 0.96, 0.98], i * 3);
  }
  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute("position", new THREE.BufferAttribute(posicion, 3));
  geometria.setAttribute("aTam", new THREE.BufferAttribute(tam, 1));
  geometria.setAttribute("aFase", new THREE.BufferAttribute(fase, 1));
  geometria.setAttribute("aBrillo", new THREE.BufferAttribute(brillo, 1));
  geometria.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTICE_ESTRELLAS,
    fragmentShader: FRAGMENTO_ESTRELLAS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTiempo: { value: 0 }, ...uniformesZona() },
  });
  const puntos = new THREE.Points(geometria, material);
  puntos.frustumCulled = false;
  return { puntos, material };
}

interface Particula {
  vida: number;
  edad: number;
  vx: number;
  vy: number;
  vz: number;
  tinta: boolean;
}

const ORO = [1, 0.77, 0.24];
const ORO_CLARO = [1, 0.9, 0.64];
const VIOLETA = [0.61, 0.52, 1];

export function crearRastro(maxTinta: number, maxPolvo: number) {
  const capacidad = maxTinta + maxPolvo;
  const posicion = new Float32Array(capacidad * 3);
  const tam = new Float32Array(capacidad);
  const alfa = new Float32Array(capacidad);
  const color = new Float32Array(capacidad * 3);
  const datos: (Particula | null)[] = Array.from({ length: capacidad }, () => null);
  let tintaViva = 0;
  let polvoVivo = 0;

  const geometria = new THREE.BufferGeometry();
  const atributoPosicion = new THREE.BufferAttribute(posicion, 3).setUsage(THREE.DynamicDrawUsage);
  const atributoAlfa = new THREE.BufferAttribute(alfa, 1).setUsage(THREE.DynamicDrawUsage);
  const atributoTam = new THREE.BufferAttribute(tam, 1).setUsage(THREE.DynamicDrawUsage);
  const atributoColor = new THREE.BufferAttribute(color, 3).setUsage(THREE.DynamicDrawUsage);
  geometria.setAttribute("position", atributoPosicion);
  geometria.setAttribute("aAlfa", atributoAlfa);
  geometria.setAttribute("aTam", atributoTam);
  geometria.setAttribute("aColor", atributoColor);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTICE_RASTRO,
    fragmentShader: FRAGMENTO_RASTRO,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uEscalaTam: { value: 40 }, ...uniformesZona() },
  });
  const puntos = new THREE.Points(geometria, material);
  puntos.frustumCulled = false;

  function libre() {
    return datos.findIndex((d) => d === null);
  }

  function emitir(x: number, y: number, z: number, tinta: boolean) {
    if (tinta ? tintaViva >= maxTinta : polvoVivo >= maxPolvo) return;
    const i = libre();
    if (i < 0) return;
    const rapidez = tinta ? 0.6 : 0.25;
    datos[i] = {
      vida: tinta ? 0.6 + Math.random() * 0.4 : 1.5 + Math.random() * 1,
      edad: 0,
      vx: (Math.random() - 0.5) * rapidez,
      vy: tinta ? -0.2 - Math.random() * 0.5 : (Math.random() - 0.3) * rapidez,
      vz: (Math.random() - 0.5) * rapidez,
      tinta,
    };
    posicion.set([x, y, z], i * 3);
    tam[i] = tinta ? 0.9 + Math.random() * 0.9 : 0.5 + Math.random() * 0.6;
    const c = tinta ? (Math.random() < 0.7 ? ORO : ORO_CLARO) : VIOLETA;
    color.set(c, i * 3);
    if (tinta) tintaViva++;
    else polvoVivo++;
  }

  function actualizar(dt: number) {
    for (let i = 0; i < capacidad; i++) {
      const d = datos[i];
      if (!d) {
        alfa[i] = 0;
        continue;
      }
      d.edad += dt;
      if (d.edad >= d.vida) {
        datos[i] = null;
        alfa[i] = 0;
        if (d.tinta) tintaViva--;
        else polvoVivo--;
        continue;
      }
      // La tinta cae; el polvo flota y se asienta.
      const frena = d.tinta ? 0.98 : 0.95;
      d.vx *= frena;
      d.vz *= frena;
      d.vy = d.tinta ? d.vy - 0.9 * dt : d.vy * frena;
      posicion[i * 3] += d.vx * dt;
      posicion[i * 3 + 1] += d.vy * dt;
      posicion[i * 3 + 2] += d.vz * dt;
      const t = d.edad / d.vida;
      alfa[i] = d.tinta ? 1 - t : 0.3 * Math.sin(Math.PI * t);
    }
    atributoPosicion.needsUpdate = true;
    atributoAlfa.needsUpdate = true;
    atributoTam.needsUpdate = true;
    atributoColor.needsUpdate = true;
  }

  return { puntos, material, emitir, actualizar };
}
