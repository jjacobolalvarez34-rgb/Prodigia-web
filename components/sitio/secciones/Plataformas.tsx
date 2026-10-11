import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { IconoNavegador, IconoTelefono } from "@/components/sitio/iconos";
import { buttonVariants } from "@/components/ui/button";
import { es } from "@/contenido/es";
import { urlWeb } from "@/lib/url";
import { cn } from "@/lib/utils";

import { claseIcono, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// Plataformas (ficha §9): la web con su enlace real y Android «próximamente»,
// sin botón de descarga (la app aún no está en Google Play).
export default function Plataformas() {
  const t = es.sitio.plataformas;

  return (
    <Seccion id="plataformas" etiqueta={t.etiqueta} titulo={t.titulo} lado="izq">
      <ul className="grid gap-4 sm:grid-cols-2">
        <li data-revelar className={cn(claseTarjeta, "flex flex-col")}>
          <span className={claseIcono}>
            <IconoNavegador className="size-5" />
          </span>
          <h3 className="mt-4 text-subtitulo font-semibold">{t.web.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.web.texto}</p>
          <div className="mt-auto pt-6">
            <EnlaceExterno href={urlWeb()} className={buttonVariants()}>
              {t.web.boton}
            </EnlaceExterno>
          </div>
        </li>
        <li data-revelar className={cn(claseTarjeta, "flex flex-col")}>
          <span className={claseIcono}>
            <IconoTelefono className="size-5" />
          </span>
          <h3 className="mt-4 text-subtitulo font-semibold">{t.android.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.android.texto}</p>
          <div className="mt-auto pt-6">
            {/* Insignia, no botón: no se puede descargar todavía. */}
            <p className="inline-flex min-h-11 items-center rounded-full border border-dashed border-texto-2/50 px-4 text-sm font-medium text-texto-2">
              {t.android.insignia}
            </p>
          </div>
        </li>
      </ul>
    </Seccion>
  );
}
