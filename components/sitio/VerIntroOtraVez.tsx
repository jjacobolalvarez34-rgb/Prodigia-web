"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { olvidarIntro } from "@/lib/sesion-intro";

// «Ver la intro otra vez» (DISENO.md §3): borra la marca de sesión y sube al
// principio de la página de inicio.
export default function VerIntroOtraVez({ etiqueta, className }: { etiqueta: string; className?: string }) {
  const ruta = usePathname();

  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        olvidarIntro();
        if (ruta === "/") {
          e.preventDefault();
          window.history.replaceState(null, "", "/");
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }}
    >
      {etiqueta}
    </Link>
  );
}
