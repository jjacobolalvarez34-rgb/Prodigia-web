"use client";

import { marcarIntroVista, olvidarIntro } from "./sesion-intro";

// Eventos de la intro entre componentes que no comparten estado de React:
// el botón Saltar, el pie («Ver la intro otra vez») y EscenaIntro, que es quien
// maneja el ScrollTrigger.
export const EVENTO_SALTAR = "prodigia:saltar-intro";
export const EVENTO_VER = "prodigia:ver-intro";

/**
 * Salta directo al momento final (logo quieto, destello terminado) y al sitio:
 * scroll a #inicio sin animación, marca la sesión y mueve el foco al título de
 * #inicio para teclado y lectores de pantalla (DISENO.md §3).
 */
export function saltarIntro({ enfocar = true }: { enfocar?: boolean } = {}) {
  const ancla = document.getElementById("inicio");
  if (!ancla) return;
  window.scrollTo({ top: ancla.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  marcarIntroVista();
  window.dispatchEvent(new Event(EVENTO_SALTAR));
  if (enfocar) document.getElementById("inicio-titulo")?.focus({ preventScroll: true });
}

/** «Ver la intro otra vez»: borra la marca de sesión y vuelve al principio. */
export function verIntroOtraVez() {
  olvidarIntro();
  window.history.replaceState(null, "", "/");
  window.scrollTo({ top: 0, behavior: "instant" });
  window.dispatchEvent(new Event(EVENTO_VER));
}
