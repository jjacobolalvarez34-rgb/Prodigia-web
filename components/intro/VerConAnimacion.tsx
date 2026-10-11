"use client";

import { elegirMovimiento } from "@/lib/sesion-intro";

// Solo en el modo quieto (el sistema pide reducir el movimiento): explica por
// qué la intro se ve quieta y deja elegir la versión animada. Por defecto se
// respeta el ajuste; esto es una elección explícita de la persona.
export default function VerConAnimacion({ aviso, etiqueta }: { aviso: string; etiqueta: string }) {
  return (
    <div className="solo-quieto mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-chip border border-borde bg-sup-1/80 px-4 py-3 text-sm text-texto-2">
      <p>{aviso}</p>
      <button
        type="button"
        onClick={() => {
          elegirMovimiento(true);
          window.location.reload();
        }}
        className="inline-flex min-h-11 items-center rounded-full border border-violeta/50 px-4 font-medium text-texto transition-colors hover:border-violeta hover:bg-sup-2"
      >
        {etiqueta}
      </button>
    </div>
  );
}
