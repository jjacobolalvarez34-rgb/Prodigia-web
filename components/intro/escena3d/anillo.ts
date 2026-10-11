import * as THREE from "three";

import { ARO } from "@/lib/progreso-intro";

// Anillo 3D con volumen (DISENO.md §2.2): una banda tipo Halo con cara
// interior (donde están las ciudades), cara exterior y dos paredes, que se
// traza con el scroll (drawRange) y al final se aplana en el aro del logo.
//
// La forma no está en la geometría: cada vértice solo sabe su ángulo (fracción
// del arco), su esquina del perfil y su cara; el shader calcula la posición con
// uniformes (radios y media altura). Así la banda puede convertirse en el aro
// plano del logo sin rehacer la geometría (decisión D6, ampliada).
//
// Convención: el anillo está en el plano XZ; el ángulo del logo α (horario en
// pantalla, 0° = derecha) va a (cos α, 0, sin α). Visto desde arriba, con la
// pantalla «arriba» = −Z, el aro queda igual que en Logo.tsx.

export const SEGMENTOS = 256;
/** Radio exterior (unidades del mundo) = r 41 del logo (34 + 14/2). */
export const RADIO = 10;
/** El aro del logo: interior 27/41 del exterior. */
export const RADIO_INTERIOR_LOGO = (RADIO * (ARO.radio - ARO.grosor / 2)) / (ARO.radio + ARO.grosor / 2);
/** Banda tipo Halo: grosor de la pared y media altura. */
export const GROSOR_BANDA = 0.55;
export const MEDIA_ALTURA_BANDA = 1.45;

const INDICES_TAPAS = 12;
const INDICES_POR_SEGMENTO = 24;

// Esquinas del perfil: A=(interior, abajo) B=(exterior, abajo) C=(exterior,
// arriba) D=(interior, arriba). Caras: 0 abajo, 1 afuera, 2 arriba, 3 adentro,
// 4 tapa del comienzo, 5 tapa del final (sigue al trazo).
const CARAS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

export function crearGeometriaAnillo() {
  const angulo: number[] = [];
  const esquina: number[] = [];
  const cara: number[] = [];
  const indices: number[] = [];
  const vertice = (a: number, e: number, c: number) => {
    angulo.push(a);
    esquina.push(e);
    cara.push(c);
    return angulo.length - 1;
  };

  // Tapas primero: así siempre entran en el drawRange.
  for (const [c, a] of [
    [4, 0],
    [5, 1],
  ]) {
    const v = [0, 1, 2, 3].map((e) => vertice(a, e, c));
    indices.push(v[0], v[1], v[2], v[0], v[2], v[3]);
  }

  // Caras laterales: dos vértices por cara y por paso del arco.
  const inicioCara: number[] = [];
  for (let f = 0; f < 4; f++) {
    inicioCara.push(angulo.length);
    for (let i = 0; i <= SEGMENTOS; i++) {
      vertice(i / SEGMENTOS, CARAS[f][0], f);
      vertice(i / SEGMENTOS, CARAS[f][1], f);
    }
  }
  // Índices ordenados por paso del arco (y dentro, por cara): el drawRange
  // avanza a lo largo del aro en las cuatro caras a la vez.
  for (let i = 0; i < SEGMENTOS; i++) {
    for (let f = 0; f < 4; f++) {
      const a = inicioCara[f] + i * 2;
      const b = a + 2;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }

  const geometria = new THREE.BufferGeometry();
  // Posición ficticia: la real la calcula el shader.
  geometria.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(angulo.length * 3), 3));
  geometria.setAttribute("aAngulo", new THREE.Float32BufferAttribute(angulo, 1));
  geometria.setAttribute("aEsquina", new THREE.Float32BufferAttribute(esquina, 1));
  geometria.setAttribute("aCara", new THREE.Float32BufferAttribute(cara, 1));
  geometria.setIndex(indices);
  geometria.setDrawRange(0, INDICES_TAPAS);
  return geometria;
}

/** Cuántos índices dibujar para una fracción trazada del arco. */
export function indicesParaFraccion(fraccion: number) {
  return INDICES_TAPAS + Math.ceil(Math.min(1, Math.max(0, fraccion)) * SEGMENTOS) * INDICES_POR_SEGMENTO;
}

const VERTICE = /* glsl */ `
attribute float aAngulo;
attribute float aEsquina;
attribute float aCara;
uniform float uInicio;
uniform float uArco;
uniform float uFin;
uniform float uRadioInterior;
uniform float uRadioExterior;
uniform float uMediaAltura;
varying vec3 vNormal;
varying vec3 vMundo;
varying float vCara;
varying float vAltura;

void main() {
  float fraccion = aCara > 4.5 ? uFin : aAngulo;
  float ang = uInicio + fraccion * uArco;
  float c = cos(ang);
  float s = sin(ang);
  bool interior = aEsquina < 0.5 || aEsquina > 2.5;
  float r = interior ? uRadioInterior : uRadioExterior;
  float y = aEsquina < 1.5 ? -uMediaAltura : uMediaAltura;
  vec3 posicion = vec3(r * c, y, r * s);

  vec3 n;
  if (aCara < 0.5) n = vec3(0.0, -1.0, 0.0);
  else if (aCara < 1.5) n = vec3(c, 0.0, s);
  else if (aCara < 2.5) n = vec3(0.0, 1.0, 0.0);
  else if (aCara < 3.5) n = vec3(-c, 0.0, -s);
  else if (aCara < 4.5) n = vec3(s, 0.0, -c);
  else n = vec3(-s, 0.0, c);

  vec4 mundo = modelMatrix * vec4(posicion, 1.0);
  vMundo = mundo.xyz;
  vNormal = normalize(mat3(modelMatrix) * n);
  vCara = aCara;
  vAltura = uMediaAltura > 0.0001 ? y / uMediaAltura : 1.0;
  gl_Position = projectionMatrix * viewMatrix * mundo;
}
`;

const FRAGMENTO = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorLogo;
uniform vec3 uLuz;
uniform vec3 uCamara;
uniform float uPlano;
uniform float uOpacidad;
varying vec3 vNormal;
varying vec3 vMundo;
varying float vCara;
varying float vAltura;

void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(uCamara - vMundo);
  float difusa = max(dot(n, normalize(uLuz)), 0.0);
  float borde = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  // Tono por cara: arriba la más clara; adentro, más oscura (ahí brillan las
  // ciudades) con un degradado hacia el centro de la banda.
  float tono = vCara < 0.5 ? 0.42 : vCara < 1.5 ? 0.62 : vCara < 2.5 ? 1.0 : vCara < 3.5 ? 0.5 + 0.12 * (1.0 - abs(vAltura)) : 0.75;
  vec3 color = uColor * (0.38 + 0.72 * difusa) * tono + vec3(0.61, 0.52, 1.0) * borde * 0.3;
  // Al final, la cara de arriba es exactamente el violeta plano del logo.
  color = mix(color, uColorLogo, uPlano);
  gl_FragColor = vec4(color, uOpacidad);
}
`;

/** Color en sRGB 0-1 (el lienzo trabaja sin conversión de color: flat + linear). */
export function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function crearMaterialAnillo() {
  return new THREE.ShaderMaterial({
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uInicio: { value: (ARO.anguloInicio * Math.PI) / 180 },
      uArco: { value: (ARO.anguloArco * Math.PI) / 180 },
      uFin: { value: 0 },
      uRadioInterior: { value: RADIO - GROSOR_BANDA },
      uRadioExterior: { value: RADIO },
      uMediaAltura: { value: MEDIA_ALTURA_BANDA },
      uColor: { value: rgb("#7C5CFF") },
      uColorLogo: { value: rgb("#6C4CF1") },
      uLuz: { value: new THREE.Vector3(-0.4, 1, 0.55) },
      uCamara: { value: new THREE.Vector3() },
      uPlano: { value: 0 },
      uOpacidad: { value: 1 },
    },
  });
}
