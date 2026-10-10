import { config } from "@/contenido/config";
import type { MundoSlug } from "@/contenido/tipos";

/** URL pública de este sitio (metadatos, Open Graph, sitemap). */
export const urlSitio = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

/** Enlace a la web de Prodigia, que siempre lleva prefijo de idioma (/es/…). */
export function urlWeb(ruta: `/${string}` | "" = "") {
  return `${config.webProdigia}/${config.idiomaWeb}${ruta}`;
}

/** Demo jugable sin cuenta de un mundo (las 15 rutas existen en calibra). */
export function urlDemo(slug: MundoSlug = config.mundoDemo) {
  return urlWeb(`/demo/${slug}`);
}

export function urlDocentes() {
  return urlWeb("/docentes");
}

export function urlPrivacidadWeb() {
  return urlWeb("/privacidad");
}

/** Ancla a una sección del acto 4, válida desde cualquier página del sitio. */
export function urlSeccion(id: string) {
  return `/#${id}`;
}
