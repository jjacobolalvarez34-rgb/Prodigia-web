import { es } from "./es";
import type { Mundo, MundoDatos, MundoSlug } from "./tipos";

// Mismo orden, colores y glifos que mobile/src/tema.ts (MUNDOS) del proyecto
// original. Los textos de cada mundo están en contenido/es/mundos.ts.
export const MUNDOS_DATOS: readonly MundoDatos[] = [
  { slug: "numeria", base: "#6C4CF1", neon: "#9B85FF", glifos: ["+", "−", "×", "÷"] },
  { slug: "enigmia", base: "#0E9F6E", neon: "#2FD89B", glifos: ["?", "◆", "▲"] },
  { slug: "geografia", base: "#1E7A8C", neon: "#3FC1D6", glifos: ["◎", "⌖", "✈"] },
  { slug: "quimia", base: "#C026D3", neon: "#E36BF2", glifos: ["⚛", "⬡", "H₂O"] },
  { slug: "anatomia", base: "#8B2942", neon: "#E0607E", glifos: ["♥", "✚"] },
  { slug: "melodia", base: "#B8860B", neon: "#F2C14E", glifos: ["♪", "♫", "♬"] },
  { slug: "trigonometria", base: "#84CC16", neon: "#A8E84A", glifos: ["△", "θ", "π"] },
  { slug: "historia", base: "#A0522D", neon: "#E08A5C", glifos: ["⌛", "⚔", "♜"] },
  { slug: "calculia", base: "#4338CA", neon: "#8A83FF", glifos: ["∫", "∂", "Σ"] },
  { slug: "circuitia", base: "#F59E0B", neon: "#FFC247", glifos: ["Ω", "⏚", "⚡"] },
  { slug: "estadistica", base: "#0D9488", neon: "#2DD4BF", glifos: ["σ", "x̄", "%"] },
  { slug: "naipia", base: "#B91C1C", neon: "#F25C5C", glifos: ["♠", "♥", "♦", "♣"] },
  { slug: "codia", base: "#06B6D4", neon: "#4FE0F5", glifos: ["{", "}", "<", "/>"] },
  { slug: "dinamia", base: "#2563EB", neon: "#60A5FA", glifos: ["⇀", "g", "ΣF", "Δt"] },
  { slug: "vitalia", base: "#16A34A", neon: "#4ADE80", glifos: ["✿", "◉", "ADN", "❦"] },
];

/** Los 15 mundos con sus textos en el idioma del sitio. */
export const MUNDOS: readonly Mundo[] = MUNDOS_DATOS.map((m) => ({ ...m, ...es.mundos.textos[m.slug] }));

export const MUNDO_POR_SLUG = Object.fromEntries(MUNDOS.map((m) => [m.slug, m])) as Record<MundoSlug, Mundo>;
