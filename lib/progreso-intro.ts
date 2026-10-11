// Mapa único del progreso de la intro (0 → 1), compartido por los textos, el
// anillo 2D y la escena 3D (DISENO.md §2, ARQUITECTURA.md decisión D3). Así las
// tres versiones nunca se desincronizan.

import { TRAMOS } from "@/contenido/tramos";
import type { MundoSlug } from "@/contenido/tipos";

/** Altura de la pista de scroll de la intro (en svh). */
export const ALTURA_PISTA = { escritorio: 1400, movil: 1150 } as const;

/** Momentos de la intro sobre el progreso 0 → 1. */
export const MOMENTOS = {
  despegue: [0, 0.07],
  queEs: [0.07, 0.15],
  ciudades: [0.15, 0.63],
  universo: [0.63, 0.72],
  autor: [0.72, 0.81],
  logo: [0.81, 0.93],
  destello: [0.93, 1],
} as const;

export type Momento = keyof typeof MOMENTOS;

/** Desde aquí se considera que la intro ya se vio (sesión). */
export const PROGRESO_VISTA = 0.97;

// ── Geometría del anillo = el aro del logo (calibra/src/components/Logo.tsx) ──
// Círculo r=34 en un viewBox de 100, trazo 14, dasharray 158.6/55: el arco
// visible va de 35.66° a 302.93° (en sentido horario, 0° = las 3 en punto, y
// hacia abajo) y deja la apertura centrada en ~349°, donde está la chispa.
export const ARO = {
  radio: 34,
  grosor: 14,
  circunferencia: 2 * Math.PI * 34,
  largoTrazo: 158.6,
  anguloInicio: 35.66,
  anguloArco: 267.27,
  /** Centro de la chispa en unidades del logo (translate(82 44)). */
  chispa: { x: 82, y: 44 },
} as const;

/** Fracción del arco ya trazada para un progreso dado (0 → 1). */
export function avanceAnillo(p: number) {
  const [inicio] = MOMENTOS.queEs;
  const [, fin] = MOMENTOS.ciudades;
  return limitar((p - inicio) / (fin - inicio));
}

/** Ventana de progreso de cada tramo de ciudades (5 iguales). */
export function ventanaTramo(indice: number): [number, number] {
  const [inicio, fin] = MOMENTOS.ciudades;
  const largo = (fin - inicio) / TRAMOS.length;
  return [inicio + largo * indice, inicio + largo * (indice + 1)];
}

export interface CiudadEnAnillo {
  slug: MundoSlug;
  tramo: number;
  /** Progreso en el que la pluma pasa por la ciudad y se enciende. */
  progreso: number;
  /** Fracción del arco (0 → 1) donde está la ciudad. */
  fraccion: number;
  /** Ángulo en grados (convención del logo: 0° a la derecha, horario). */
  angulo: number;
}

/** Las 15 ciudades repartidas a lo largo del arco, en el orden de los tramos. */
export const CIUDADES_EN_ANILLO: readonly CiudadEnAnillo[] = TRAMOS.flatMap((tramo, i) => {
  const [inicio, fin] = ventanaTramo(i);
  return tramo.mundos.map((slug, j) => {
    const progreso = inicio + ((j + 0.55) / tramo.mundos.length) * (fin - inicio);
    const fraccion = avanceAnillo(progreso);
    return { slug, tramo: i, progreso, fraccion, angulo: ARO.anguloInicio + fraccion * ARO.anguloArco };
  });
});

/** Punto del aro (unidades del logo, viewBox 100) para un ángulo en grados. */
export function puntoDelAro(angulo: number, radio: number = ARO.radio) {
  const rad = (angulo * Math.PI) / 180;
  return { x: 50 + radio * Math.cos(rad), y: 50 + radio * Math.sin(rad) };
}

export function limitar(valor: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, valor));
}

/** Progreso local (0 → 1) dentro de un momento. */
export function dentroDe(p: number, [inicio, fin]: readonly [number, number]) {
  return limitar((p - inicio) / (fin - inicio));
}
