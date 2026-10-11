import * as THREE from "three";

import { ARO } from "@/lib/progreso-intro";

// Anillo 3D con volumen (DISENO.md §2.2): un mundo-anillo visto desde arriba
// en perspectiva. Su perfil (el corte) es una losa con un suelo ancho entre dos
// rebordes, el de afuera y el de adentro; las ciudades viven sobre el suelo, así
// que se ven durante todo el recorrido. Se traza con el scroll (drawRange) y al
// final se aplana en el aro del logo, que es exactamente ese suelo.
//
// La forma no está en la geometría: cada vértice solo sabe su fracción del
// arco, su punto del perfil y su cara; el shader calcula la posición con un
// perfil de 8 puntos que llega por uniforme (radio, altura). Así la losa se
// vuelve el aro plano del logo sin rehacer la geometría (decisión D6, ampliada).
//
// Convención: el anillo está en el plano XZ; el ángulo del logo α (horario en
// pantalla, 0° = derecha) va a (cos α, 0, sin α). Visto desde arriba, con la
// pantalla «arriba» = −Z, el aro queda igual que en Logo.tsx.

export const SEGMENTOS = 256;
/** Radio exterior (unidades del mundo) = r 41 del logo (34 + 14/2). */
export const RADIO = 10;
/** El aro del logo: interior 27/41 del exterior. */
export const RADIO_INTERIOR_LOGO = (RADIO * (ARO.radio - ARO.grosor / 2)) / (ARO.radio + ARO.grosor / 2);

/** Medidas del perfil mientras se traza (unidades del mundo). */
export const PERFIL = {
  interior: 7.1,
  /** Media altura de la losa: el suelo está en +losa. */
  losa: 0.32,
  /** Altura y ancho de los rebordes sobre el suelo. */
  reborde: 0.34,
  anchoReborde: 0.26,
} as const;

/** Altura del suelo (donde se apoyan las ciudades) y ancho útil. */
export const SUELO = {
  altura: PERFIL.losa,
  desde: PERFIL.interior + PERFIL.anchoReborde,
  hasta: RADIO - PERFIL.anchoReborde,
} as const;

const PUNTOS = 8;
// Puntos del perfil (r, y): A abajo-adentro, B abajo-afuera, C tope del reborde
// de afuera, D su lado interno, E suelo-afuera, F suelo-adentro, G tope del
// reborde de adentro, H arriba-adentro. Caras: de cada punto al siguiente.
// 0 abajo · 1 pared de afuera · 2 tope de afuera · 3 lado interno de afuera ·
// 4 suelo · 5 lado interno de adentro · 6 tope de adentro · 7 pared de adentro.
// Tapas: 8 la del comienzo, 9 la del final (sigue al trazo).
const TRIANGULOS_TAPA = [
  [0, 1, 4],
  [0, 4, 5],
  [1, 2, 3],
  [1, 3, 4],
  [0, 5, 6],
  [0, 6, 7],
];
const INDICES_TAPAS = TRIANGULOS_TAPA.length * 3 * 2;
const INDICES_POR_SEGMENTO = PUNTOS * 6;

/** Perfil (8 puntos r, y) para una mezcla k entre la losa (0) y el aro plano del logo (1). */
export function perfil(k: number, salida: THREE.Vector2[]) {
  const m = (a: number, b: number) => a + (b - a) * k;
  const interior = m(PERFIL.interior, RADIO_INTERIOR_LOGO);
  const losa = m(PERFIL.losa, 0.03);
  const reborde = m(PERFIL.reborde, 0);
  const ancho = m(PERFIL.anchoReborde, 0);
  const puntos: [number, number][] = [
    [interior, -losa],
    [RADIO, -losa],
    [RADIO, losa + reborde],
    [RADIO - ancho, losa + reborde],
    [RADIO - ancho, losa],
    [interior + ancho, losa],
    [interior + ancho, losa + reborde],
    [interior, losa + reborde],
  ];
  puntos.forEach(([r, y], i) => salida[i].set(r, y));
  return salida;
}

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
    [8, 0],
    [9, 1],
  ]) {
    const v = Array.from({ length: PUNTOS }, (_, e) => vertice(a, e, c));
    for (const [x, y, z] of TRIANGULOS_TAPA) indices.push(v[x], v[y], v[z]);
  }

  // Caras laterales: dos vértices por cara y por paso del arco.
  const inicioCara: number[] = [];
  for (let f = 0; f < PUNTOS; f++) {
    inicioCara.push(angulo.length);
    for (let i = 0; i <= SEGMENTOS; i++) {
      vertice(i / SEGMENTOS, f, f);
      vertice(i / SEGMENTOS, (f + 1) % PUNTOS, f);
    }
  }
  // Índices ordenados por paso del arco (y dentro, por cara): el drawRange
  // avanza a lo largo del aro en todas las caras a la vez.
  for (let i = 0; i < SEGMENTOS; i++) {
    for (let f = 0; f < PUNTOS; f++) {
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
uniform vec2 uPerfil[8];
varying vec3 vNormal;
varying vec3 vMundo;
varying vec3 vLocal;
varying float vCara;
varying float vFraccion;

void main() {
  float fraccion = aCara > 8.5 ? uFin : aAngulo;
  float ang = uInicio + fraccion * uArco;
  float c = cos(ang);
  float s = sin(ang);
  int e = int(aEsquina + 0.5);
  vec2 p = uPerfil[e];
  vec3 posicion = vec3(p.x * c, p.y, p.x * s);

  vec3 n;
  if (aCara < 7.5) {
    int f = int(aCara + 0.5);
    vec2 d = uPerfil[f == 7 ? 0 : f + 1] - uPerfil[f];
    vec2 n2 = length(d) > 0.00001 ? normalize(vec2(d.y, -d.x)) : vec2(0.0, 1.0);
    n = vec3(n2.x * c, n2.y, n2.x * s);
  } else if (aCara < 8.5) {
    n = vec3(s, 0.0, -c);
  } else {
    n = vec3(-s, 0.0, c);
  }

  vec4 mundo = modelMatrix * vec4(posicion, 1.0);
  vMundo = mundo.xyz;
  vLocal = posicion;
  vNormal = normalize(mat3(modelMatrix) * n);
  vCara = aCara;
  vFraccion = fraccion;
  gl_Position = projectionMatrix * viewMatrix * mundo;
}
`;

// Material: violeta con luz principal, brillo especular y de contorno; paneles
// con costuras; filos de luz en los topes de los rebordes; luces de navegación
// en la pared de afuera; el suelo oscuro, de noche, donde brillan las ciudades.
// La punta del trazo brilla en dorado (tinta fresca). Al final todo se apaga
// hasta el violeta plano del logo.
const FRAGMENTO = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorLogo;
uniform vec3 uLuz;
uniform vec3 uCamara;
uniform float uPlano;
uniform float uOpacidad;
uniform float uFin;
uniform float uCabeza;
uniform float uDetalle;
uniform float uTiempo;
uniform vec2 uPerfil[8];
varying vec3 vNormal;
varying vec3 vMundo;
varying vec3 vLocal;
varying float vCara;
varying float vFraccion;

// 1 sobre una línea (cerca de un entero de x), con borde suavizado.
float rejilla(float x, float grosor) {
  float d = abs(fract(x + 0.5) - 0.5);
  float w = fwidth(x) * 1.2;
  return 1.0 - smoothstep(grosor, grosor + w, d);
}

// 1 cerca de 0, con borde suavizado.
float linea(float x, float grosor) {
  float w = fwidth(x) * 1.2;
  return 1.0 - smoothstep(grosor, grosor + w, abs(x));
}

void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(uCamara - vMundo);
  vec3 l = normalize(uLuz);
  vec3 h = normalize(l + v);
  float difusa = max(dot(n, l), 0.0);
  float especular = pow(max(dot(n, h), 0.0), 40.0);
  float contorno = pow(1.0 - max(dot(n, v), 0.0), 2.5);

  float r = length(vLocal.xz);
  float paneles = vFraccion * 72.0;
  float abajo = uPerfil[0].y;
  float tope = uPerfil[2].y;
  float alturaPared = clamp((vLocal.y - abajo) / max(0.0001, tope - abajo), 0.0, 1.0);
  vec3 base;
  vec3 luz = vec3(0.0);
  float enCabeza = 0.0;

  if (vCara < 0.5) {
    base = uColor * 0.2;
  } else if (vCara < 1.5 || (vCara > 6.5 && vCara < 7.5)) {
    // Paredes (afuera y adentro): degradado, costuras y luces de navegación.
    base = mix(uColor * 0.28, uColor * 0.9, alturaPared);
    base *= 1.0 - 0.4 * rejilla(paneles, 0.012);
    float franja = linea(alturaPared - 0.42, 0.07);
    float puntos = rejilla(paneles * 3.0, 0.09);
    float parpadeo = 0.6 + 0.4 * sin(uTiempo * 1.7 + floor(paneles * 3.0) * 1.3);
    float intensidad = vCara < 1.5 ? 1.1 : 0.55;
    luz += vec3(0.78, 0.74, 1.0) * franja * puntos * parpadeo * intensidad;
    enCabeza = vCara < 1.5 ? smoothstep(0.75, 1.0, alturaPared) : 0.0;
  } else if ((vCara > 1.5 && vCara < 2.5) || (vCara > 5.5 && vCara < 6.5)) {
    // Topes de los rebordes: la parte más clara, con filos de luz.
    base = uColor * 1.12;
    base *= 1.0 - 0.25 * rejilla(paneles, 0.01);
    float r0 = vCara < 2.5 ? uPerfil[3].x : uPerfil[6].x;
    float r1 = vCara < 2.5 ? uPerfil[2].x : uPerfil[7].x;
    luz += vec3(0.84, 0.77, 1.0) * (linea(r - r0, 0.025) + linea(r - r1, 0.025)) * 0.9;
    enCabeza = vCara < 2.5 ? 1.0 : 0.4;
  } else if (vCara > 3.5 && vCara < 4.5) {
    // Suelo: donde viven las ciudades, de noche. Sendas tenues entre paneles.
    float t = (r - uPerfil[5].x) / max(0.0001, uPerfil[4].x - uPerfil[5].x);
    base = mix(vec3(0.06, 0.05, 0.15), vec3(0.11, 0.08, 0.26), t);
    base *= 1.0 - 0.3 * rejilla(paneles, 0.008);
    luz += uColor * 0.18 * rejilla(t * 3.0, 0.02);
  } else if (vCara < 7.5) {
    // Lados internos de los rebordes.
    base = uColor * 0.45;
  } else {
    // Tapas.
    base = uColor * 0.6;
  }

  vec3 color = base * (0.3 + 0.82 * difusa) + vec3(1.0) * especular * 0.2 + vec3(0.55, 0.45, 1.0) * contorno * 0.28;
  color += luz * uDetalle;
  // Tinta fresca: brillo dorado en la punta del trazo, sobre los topes y el
  // filo de afuera (en las tapas y el suelo se volvía un bloque de luz).
  float cabeza = smoothstep(0.022, 0.0, uFin - vFraccion) * step(vFraccion, uFin + 0.0001) * uCabeza * enCabeza;
  color += vec3(1.0, 0.68, 0.2) * cabeza * 1.2;
  // Al final, exactamente el violeta plano del logo.
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
  const puntos = perfil(
    0,
    Array.from({ length: PUNTOS }, () => new THREE.Vector2()),
  );
  return new THREE.ShaderMaterial({
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uInicio: { value: (ARO.anguloInicio * Math.PI) / 180 },
      uArco: { value: (ARO.anguloArco * Math.PI) / 180 },
      uFin: { value: 0 },
      uPerfil: { value: puntos },
      uColor: { value: rgb("#7C5CFF") },
      uColorLogo: { value: rgb("#6C4CF1") },
      uLuz: { value: new THREE.Vector3(-0.45, 1, 0.6) },
      uCamara: { value: new THREE.Vector3() },
      uPlano: { value: 0 },
      uOpacidad: { value: 1 },
      uCabeza: { value: 0 },
      uDetalle: { value: 1 },
      uTiempo: { value: 0 },
    },
  });
}
