// Tipos del contenido. Los datos que no dependen del idioma (colores, glifos,
// enlaces) viven en contenido/*.ts; los textos, en contenido/<idioma>/*.ts.
// Para sumar inglés: crear contenido/en/ con la misma forma que contenido/es/
// (el tipo Contenido lo exige) y elegir el diccionario por idioma.

import type { es } from "./es";

export type MundoSlug =
  | "numeria"
  | "enigmia"
  | "geografia"
  | "quimia"
  | "anatomia"
  | "melodia"
  | "trigonometria"
  | "historia"
  | "calculia"
  | "circuitia"
  | "estadistica"
  | "naipia"
  | "codia"
  | "dinamia"
  | "vitalia";

export type TramoId = "numeros" | "logica-codigo" | "ciencias" | "vida" | "mundo-cultura";

/** Datos fijos de un mundo (de mobile/src/tema.ts). */
export interface MundoDatos {
  slug: MundoSlug;
  /** Color base: fondos y degradados. Nunca como color de texto (algunos no llegan a 4.5:1). */
  base: string;
  /** Versión neón: la que se usa para texto y luces. */
  neon: string;
  glifos: readonly string[];
}

/** Textos de un mundo en un idioma (ficha §2 y CONTENIDO.md §2). */
export interface MundoTextos {
  nombre: string;
  tema: string;
  linea: string;
  modos: readonly string[];
}

export type Mundo = MundoDatos & MundoTextos;

export interface TramoDatos {
  id: TramoId;
  mundos: readonly MundoSlug[];
}

export type SeccionId =
  | "inicio"
  | "como-se-juega"
  | "mundos"
  | "aprender"
  | "competir"
  | "progreso"
  | "plataformas"
  | "pro"
  | "colegios"
  | "opiniones"
  | "desarrollo"
  | "apoya";

export type RangoSlug = "bronce" | "plata" | "oro" | "platino" | "diamante" | "prodigio";

/** Rango de Rankeds (calibra/src/types/database.ts, RANGOS_ELO). */
export interface RangoDatos {
  slug: RangoSlug;
  /** ELO mínimo del rango. */
  min: number;
  color: string;
  degradado?: readonly [string, string];
}

export interface Red {
  url: string;
  usuario: string;
}

/** Enlaces externos y datos de contacto. `null` = no configurado: no se muestra. */
export interface Config {
  webProdigia: string;
  /** La web exige prefijo de idioma (calibra/src/i18n/routing.ts: localePrefix "always"). */
  idiomaWeb: "es" | "en";
  mundoDemo: MundoSlug;
  redes: {
    instagram: Red | null;
    tiktok: Red | null;
    youtube: Red | null;
    x: Red | null;
    facebook: Red | null;
  };
  donaciones: string | null;
  contacto: { correo: string | null };
  autor: { firma: string; apodos: readonly string[] };
  googlePlay: string | null;
}

/** Forma de un diccionario de idioma: la que tenga contenido/es. */
export type Contenido = typeof es;
