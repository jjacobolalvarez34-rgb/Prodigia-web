import Logo from "@/components/marca/Logo";
import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { IconoFlechaAbajo } from "@/components/sitio/iconos";
import { buttonVariants } from "@/components/ui/button";
import { es } from "@/contenido/es";
import { urlDemo, urlWeb } from "@/lib/url";

// El momento final de la intro y el principio del sitio (DISENO.md §2, progreso
// 1.00): logo al centro, nombre, lema y dos CTA. Vive dentro de la intro: en
// modo animado es el último cuadro del escenario; en modo quieto, el último
// bloque. El ancla #inicio la pone la intro (components/intro/Intro.tsx).
// data-logo-final y data-final-texto los usa la intro para aparecer el logo y
// los textos en el momento justo.
export default function Inicio({ nivelTitulo = 1, conSeguir = false }: { nivelTitulo?: 1 | 2; conSeguir?: boolean }) {
  const t = es.sitio.inicio;
  const Titulo = nivelTitulo === 1 ? "h1" : "h2";

  return (
    <section aria-labelledby="inicio-titulo" data-logo="centro" className="grid min-h-svh place-items-center px-4 pt-24 pb-16">
      <div className="flex flex-col items-center text-center">
        <Logo size={160} className="size-28 md:size-40" data-logo-final />
        <Titulo id="inicio-titulo" tabIndex={-1} className="mt-6 text-display font-bold outline-none" data-final-texto>
          {t.nombre}
        </Titulo>
        <p className="mt-3 text-subtitulo text-texto-2" data-final-texto>
          {t.lema}
        </p>
        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center" data-final-texto>
          <EnlaceExterno href={urlWeb()} className={buttonVariants({ size: "lg" })}>
            {t.abrir}
          </EnlaceExterno>
          <EnlaceExterno href={urlDemo()} className={buttonVariants({ variant: "secundario", size: "lg" })}>
            {t.probar}
          </EnlaceExterno>
        </div>
        {conSeguir && (
          <p className="mt-12 inline-flex items-center gap-2 text-etiqueta text-texto-2" data-final-texto>
            {es.intro.logo.seguir}
            <IconoFlechaAbajo className="size-4 motion-safe:animate-bounce" />
          </p>
        )}
      </div>
    </section>
  );
}
