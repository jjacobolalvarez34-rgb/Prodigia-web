// Clases compartidas por las secciones del acto 4 (DISENO.md §1.3 y §6.3).

/** Tarjeta base: superficie 1, borde de 1px, radio de tarjeta. Sin desenfoque. */
export const claseTarjeta = "rounded-tarjeta border border-borde bg-sup-1/85 p-6 sm:p-7";

/** Etiqueta pequeña en mayúsculas espaciadas (sobre los títulos). */
export const claseEtiqueta = "font-display text-etiqueta font-semibold tracking-[0.18em] text-texto-2 uppercase";

/** Número protagonista: mono, con el degradado de la chispa del logo. */
export const claseNumero =
  "bg-[linear-gradient(120deg,#A794FF,#E4CBA0,#FFC53D)] bg-clip-text font-mono font-bold leading-none tracking-tight text-transparent";

/** Píldora informativa (no interactiva). */
export const claseInsignia =
  "inline-flex items-center gap-1.5 rounded-full border border-borde bg-sup-2 px-3 py-1 text-etiqueta font-medium text-texto";

/** Círculo de icono dentro de una tarjeta. */
export const claseIcono = "grid size-11 shrink-0 place-items-center rounded-full bg-sup-3 text-violeta-neon";
