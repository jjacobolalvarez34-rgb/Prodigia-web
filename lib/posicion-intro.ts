"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function suscribir(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  window.addEventListener("resize", avisar);
  return () => {
    window.removeEventListener("scroll", avisar);
    window.removeEventListener("resize", avisar);
  };
}

/** ¿El scroll todavía no llegó a #inicio (el final de la intro)? */
function antesDelInicio() {
  const ancla = document.getElementById("inicio");
  return ancla ? ancla.getBoundingClientRect().top > 4 : false;
}

/**
 * true mientras se está en la intro (antes de #inicio). Lo usan el encabezado
 * (aparece al llegar a #inicio) y el botón «Saltar intro» (se va al llegar).
 */
export function useEnIntro() {
  const ruta = usePathname();
  return useSyncExternalStore(suscribir, antesDelInicio, () => ruta === "/");
}
