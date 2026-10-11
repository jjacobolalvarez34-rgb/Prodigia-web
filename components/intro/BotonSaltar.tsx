"use client";

import { saltarIntro } from "@/lib/intro-eventos";
import { useEnIntro } from "@/lib/posicion-intro";

// «Saltar intro» (DISENO.md §3): pequeño, gris, abajo a la derecha, en el HTML
// desde el segundo 0. Sin JavaScript es un enlace a #inicio y funciona igual.
// Con JavaScript salta al estado final sin animación. Se va al llegar a #inicio
// y vuelve si se sube a la intro.
export default function BotonSaltar({ etiqueta }: { etiqueta: string }) {
  const enIntro = useEnIntro();

  return (
    <a
      href="#inicio"
      className="boton-saltar"
      data-oculto={enIntro ? undefined : ""}
      onClick={(evento) => {
        evento.preventDefault();
        saltarIntro();
      }}
    >
      {etiqueta}
      <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true" focusable="false">
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
