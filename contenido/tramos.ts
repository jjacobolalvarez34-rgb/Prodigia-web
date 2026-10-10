import type { MundoSlug, TramoDatos, TramoId } from "./tipos";

// Agrupación de los 15 mundos en 5 tramos del anillo (CONTENIDO.md §3,
// aprobada por el dueño). Es una agrupación de esta página: no existe en la app.
// Los títulos están en contenido/es/mundos.ts.
export const TRAMOS: readonly TramoDatos[] = [
  { id: "numeros", mundos: ["numeria", "calculia", "trigonometria", "estadistica"] },
  { id: "logica-codigo", mundos: ["enigmia", "codia", "naipia"] },
  { id: "ciencias", mundos: ["quimia", "dinamia", "circuitia"] },
  { id: "vida", mundos: ["anatomia", "vitalia"] },
  { id: "mundo-cultura", mundos: ["geografia", "historia", "melodia"] },
];

export function tramoDe(slug: MundoSlug): TramoId {
  const tramo = TRAMOS.find((t) => t.mundos.includes(slug));
  if (!tramo) throw new Error(`El mundo ${slug} no está en ningún tramo`);
  return tramo.id;
}
