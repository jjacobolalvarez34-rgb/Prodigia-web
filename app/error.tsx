"use client";

import Link from "next/link";

import Logo from "@/components/marca/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { es } from "@/contenido/es";

// Error de ruta (DISENO.md §7): aro quieto, «Reintentar» y «Volver al inicio».
// En Next 16.3 el límite de error recibe `retry` (vuelve a pedir el contenido).
export default function ErrorDeRuta({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = es.sitio.estados.error;

  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24 pb-16 text-center">
      <div className="flex flex-col items-center">
        <Logo size={128} className="size-24 md:size-32" />
        <h1 className="mt-8 text-titulo font-bold">{t.titulo}</h1>
        <p className="mt-4 max-w-md text-cuerpo text-texto-2">{t.texto}</p>
        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button size="lg" onClick={() => retry()}>
            {t.reintentar}
          </Button>
          <Link href="/" className={buttonVariants({ variant: "secundario", size: "lg" })}>
            {t.volver}
          </Link>
        </div>
      </div>
    </section>
  );
}
