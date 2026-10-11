"use client";

import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore, type ReactNode } from "react";

function suscribirScroll(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

// ¿Está #inicio a la vista? Se guarda fuera de React y lo actualiza un
// IntersectionObserver; `null` = todavía no se midió.
let inicioVisible: boolean | null = null;

// Contenedor fijo del encabezado: transparente arriba; fondo al 80 % con
// desenfoque leve solo cuando la página ya se desplazó (DISENO.md §6.1).
// Marca data-inicio mientras #inicio está a la vista: ahí ya está el mismo
// «Abrir Prodigia» con degradado, y el degradado va una vez por pantalla.
export default function EncabezadoFijo({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  const conScroll = useSyncExternalStore(
    suscribirScroll,
    () => window.scrollY > 8,
    () => false,
  );

  const suscribirInicio = useCallback(
    (avisar: () => void) => {
      const inicio = ruta === "/" ? document.getElementById("inicio") : null;
      if (!inicio) {
        inicioVisible = false;
        avisar();
        return () => {};
      }
      const caja = inicio.getBoundingClientRect();
      inicioVisible = caja.bottom > window.innerHeight * 0.35 && caja.top < window.innerHeight * 0.65;
      avisar();
      const observador = new IntersectionObserver(
        ([entrada]) => {
          inicioVisible = entrada?.isIntersecting ?? false;
          avisar();
        },
        { rootMargin: "-35% 0px -35% 0px" },
      );
      observador.observe(inicio);
      return () => observador.disconnect();
    },
    [ruta],
  );
  const enInicio = useSyncExternalStore(
    suscribirInicio,
    () => inicioVisible ?? ruta === "/",
    () => ruta === "/",
  );

  return (
    <header
      data-con-scroll={conScroll || undefined}
      data-inicio={enInicio || undefined}
      className="group/encabezado fixed inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color] duration-300 ease-entrar data-con-scroll:border-borde/60 data-con-scroll:bg-fondo/80 data-con-scroll:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
