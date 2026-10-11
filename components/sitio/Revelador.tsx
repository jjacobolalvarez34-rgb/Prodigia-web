"use client";

import { useEffect } from "react";

// Un solo IntersectionObserver para todo el acto 4: marca con data-visible los
// elementos [data-revelar] cuando entran en pantalla y el CSS hace el resto
// (app/globals.css). Sin JavaScript nada se oculta: el CSS solo esconde lo que
// se va a revelar cuando <html> tiene data-js (lo pone el script inicial).
export default function Revelador() {
  useEffect(() => {
    const elementos = document.querySelectorAll("[data-revelar]:not([data-visible])");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.setAttribute("data-visible", ""));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.setAttribute("data-visible", "");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  return null;
}
