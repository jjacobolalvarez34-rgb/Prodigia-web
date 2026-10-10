import type { Metadata } from "next";

import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { urlPrivacidadWeb } from "@/lib/url";

const t = es.legal.privacidad;

export const metadata: Metadata = {
  title: t.titulo,
  alternates: { canonical: "/privacidad" },
};

const claseEnlace = "underline decoration-violeta/60 underline-offset-4 transition-colors hover:decoration-violeta";

// Aviso de privacidad sencillo (CONTENIDO.md §5).
export default function Privacidad() {
  const correo = config.contacto.correo;

  return (
    <article className="mx-auto max-w-[65ch] px-4 pt-32 pb-24 sm:px-6">
      <h1 className="text-titulo font-bold">{t.titulo}</h1>
      <p className="mt-3 text-etiqueta text-texto-2">{t.actualizado}</p>

      {t.secciones.map((seccion) => (
        <section key={seccion.titulo} className="mt-12">
          <h2 className="text-subtitulo font-semibold">{seccion.titulo}</h2>
          {seccion.parrafos.map((parrafo) => (
            <p key={parrafo} className="mt-4 text-cuerpo">
              {parrafo}
            </p>
          ))}
        </section>
      ))}

      <p className="mt-4 text-cuerpo">
        <EnlaceExterno href={urlPrivacidadWeb()} className={claseEnlace}>
          {t.privacidadWeb}
        </EnlaceExterno>
      </p>

      <section className="mt-12">
        <h2 className="text-subtitulo font-semibold">{t.responsable.titulo}</h2>
        <p className="mt-4 text-cuerpo">{t.responsable.texto(config.autor.firma)}</p>
        {correo && (
          <p className="mt-2 text-cuerpo">
            {t.responsable.contacto}{" "}
            <a href={`mailto:${correo}`} className={`${claseEnlace} break-all`}>
              {correo}
            </a>
          </p>
        )}
      </section>
    </article>
  );
}
