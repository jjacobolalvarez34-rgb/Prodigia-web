"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { verIntroOtraVez } from "@/lib/intro-eventos";
import { elegirMovimiento, olvidarIntro } from "@/lib/sesion-intro";

// «Volver a la versión quieta»: solo aparece si la persona eligió la intro
// animada aunque su sistema pide reducir el movimiento (globals.css,
// .solo-eleccion). Deshace esa elección.
export function VolverAQuieta({ etiqueta, className }: { etiqueta: string; className?: string }) {
  return (
    <button
      type="button"
      className={`solo-eleccion ${className ?? ""}`}
      onClick={() => {
        elegirMovimiento(false);
        window.location.reload();
      }}
    >
      {etiqueta}
    </button>
  );
}

// «Ver la intro otra vez» (DISENO.md §3): borra la marca de sesión y sube al
// principio de la página de inicio.
export default function VerIntroOtraVez({ etiqueta, className }: { etiqueta: string; className?: string }) {
  const ruta = usePathname();

  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        if (ruta === "/") {
          e.preventDefault();
          verIntroOtraVez();
        } else {
          olvidarIntro();
        }
      }}
    >
      {etiqueta}
    </Link>
  );
}
