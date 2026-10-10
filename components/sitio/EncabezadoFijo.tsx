"use client";

import { useSyncExternalStore, type ReactNode } from "react";

function suscribirScroll(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

// Contenedor fijo del encabezado: transparente arriba; fondo al 80 % con
// desenfoque leve solo cuando la página ya se desplazó (DISENO.md §6.1).
export default function EncabezadoFijo({ children }: { children: ReactNode }) {
  const conScroll = useSyncExternalStore(
    suscribirScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      data-con-scroll={conScroll || undefined}
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color] duration-300 ease-entrar data-con-scroll:border-borde/60 data-con-scroll:bg-fondo/80 data-con-scroll:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
