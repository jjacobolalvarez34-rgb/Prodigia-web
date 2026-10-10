import Link from "next/link";

import Logo from "@/components/marca/Logo";
import { buttonVariants } from "@/components/ui/button";
import { es } from "@/contenido/es";

// 404 (DISENO.md §7): el aro del logo sin chispa — la chispa se escapó.
export default function NoEncontrada() {
  const t = es.sitio.estados.noEncontrada;

  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24 pb-16 text-center">
      <div className="flex flex-col items-center">
        <Logo size={128} conChispa={false} className="size-24 md:size-32" />
        <p className="mt-8 font-mono text-etiqueta tracking-[0.3em] text-texto-2">404</p>
        <h1 className="mt-2 text-titulo font-bold">{t.titulo}</h1>
        <p className="mt-4 max-w-md text-cuerpo text-texto-2">{t.texto}</p>
        <Link href="/" className={buttonVariants({ size: "lg", className: "mt-10" })}>
          {t.volver}
        </Link>
      </div>
    </section>
  );
}
