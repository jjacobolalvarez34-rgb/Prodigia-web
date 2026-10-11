"use client";

import { useState, type ReactNode } from "react";

import { es } from "@/contenido/es";

// «Compártelo»: usa el panel nativo de compartir si existe; si no, copia el
// enlace del sitio y lo avisa (también a lectores de pantalla).
export default function BotonCompartir({ className, children }: { className?: string; children: ReactNode }) {
  const t = es.sitio.apoya.compartir;
  const [copiado, setCopiado] = useState(false);

  const compartir = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: es.sitio.inicio.nombre, text: t.mensaje, url });
        return;
      } catch (error) {
        // Si la persona cerró el panel, no se hace nada más.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sin portapapeles disponible: no hay nada más que hacer.
    }
  };

  return (
    <button type="button" onClick={compartir} className={className}>
      {children}
      <span aria-live="polite" className="text-etiqueta font-medium text-acierto">
        {copiado ? t.copiado : ""}
      </span>
    </button>
  );
}
