import type { RangoDatos } from "./tipos";

// Mismos rangos, ELO mínimo y colores que RANGOS_ELO en
// calibra/src/types/database.ts. Los nombres están en contenido/es/sitio.ts.
export const RANGOS: readonly RangoDatos[] = [
  { slug: "bronce", min: 0, color: "#B08D57" },
  { slug: "plata", min: 900, color: "#B8C4D9" },
  { slug: "oro", min: 1100, color: "#E8B34D" },
  { slug: "platino", min: 1300, color: "#5FBFA8" },
  { slug: "diamante", min: 1500, color: "#5DC8F5" },
  { slug: "prodigio", min: 1700, color: "#FFC53D", degradado: ["#A794FF", "#FFC53D"] },
];
