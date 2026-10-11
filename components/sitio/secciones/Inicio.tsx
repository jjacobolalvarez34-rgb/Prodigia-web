import Logo from "@/components/marca/Logo";
import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { buttonVariants } from "@/components/ui/button";
import { es } from "@/contenido/es";
import { urlDemo, urlWeb } from "@/lib/url";

// #inicio: el punto donde termina la intro y empieza el sitio (DISENO.md §2,
// progreso 1.00). Logo al centro, nombre, lema y dos CTA.
// Hasta la Fase 3 el <h1> de la página es «Prodigia»; con la intro, el <h1>
// pasa a ser la frase de la pluma y este título, un <h2>.
export default function Inicio({ nivelTitulo = 1 }: { nivelTitulo?: 1 | 2 }) {
  const t = es.sitio.inicio;
  const Titulo = nivelTitulo === 1 ? "h1" : "h2";

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      data-logo="centro"
      className="grid min-h-svh place-items-center px-4 pt-24 pb-16"
    >
      <div className="flex flex-col items-center text-center">
        <Logo size={160} className="size-28 md:size-40" />
        <Titulo id="inicio-titulo" className="mt-6 text-display font-bold">
          {t.nombre}
        </Titulo>
        <p className="mt-3 text-subtitulo text-texto-2">{t.lema}</p>
        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <EnlaceExterno href={urlWeb()} className={buttonVariants({ size: "lg" })}>
            {t.abrir}
          </EnlaceExterno>
          <EnlaceExterno href={urlDemo()} className={buttonVariants({ variant: "secundario", size: "lg" })}>
            {t.probar}
          </EnlaceExterno>
        </div>
      </div>
    </section>
  );
}
