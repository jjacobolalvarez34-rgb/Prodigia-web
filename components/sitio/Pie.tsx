import Link from "next/link";

import Logo from "@/components/marca/Logo";
import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { urlDemo, urlDocentes, urlWeb } from "@/lib/url";

import EnlaceExterno from "./EnlaceExterno";
import VerIntroOtraVez from "./VerIntroOtraVez";

const claseEnlace = "inline-flex min-h-11 items-center text-texto-2 transition-colors hover:text-texto";
const claseTitulo = "font-display text-etiqueta font-semibold tracking-[0.18em] text-texto-2 uppercase";

// Pie (DISENO.md §6.3 fila 13; CONTENIDO.md §4 «Pie»).
export default function Pie() {
  const t = es.sitio.pie;
  const instagram = config.redes.instagram;
  const correo = config.contacto.correo;

  return (
    <footer className="border-t border-borde/60 bg-fondo-hondo/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="font-display text-xl font-semibold tracking-tight">{es.sitio.inicio.nombre}</span>
          </div>
          <p className="mt-4 max-w-xs text-texto-2">{t.lema}</p>
        </div>

        <nav aria-labelledby="pie-enlaces">
          <h2 id="pie-enlaces" className={claseTitulo}>
            {t.tituloEnlaces}
          </h2>
          <ul className="mt-3">
            <li>
              <EnlaceExterno href={urlWeb()} className={claseEnlace}>
                {t.web}
              </EnlaceExterno>
            </li>
            <li>
              <EnlaceExterno href={urlDemo()} className={claseEnlace}>
                {t.demo}
              </EnlaceExterno>
            </li>
            <li>
              <EnlaceExterno href={urlDocentes()} className={claseEnlace}>
                {t.colegios}
              </EnlaceExterno>
            </li>
            <li>
              <Link href="/privacidad" className={claseEnlace}>
                {t.privacidad}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={claseTitulo}>{t.tituloContacto}</h2>
          <ul className="mt-3">
            {instagram && (
              <li>
                <EnlaceExterno href={instagram.url} className={`${claseEnlace} gap-2`}>
                  {t.instagram} <span className="font-mono text-etiqueta">{instagram.usuario}</span>
                </EnlaceExterno>
              </li>
            )}
            {correo && (
              <li>
                <a href={`mailto:${correo}`} className={`${claseEnlace} break-all`}>
                  <span className="sr-only">{t.correo}: </span>
                  {correo}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-borde/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-etiqueta text-texto-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t.firma(config.autor.firma)}</p>
          <VerIntroOtraVez etiqueta={t.verIntro} className={claseEnlace} />
        </div>
      </div>
    </footer>
  );
}
