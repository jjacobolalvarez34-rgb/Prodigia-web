import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { IconoCompartir, IconoCorazon, IconoCorreo, IconoInstagram, IconoJugar } from "@/components/sitio/iconos";
import { buttonVariants } from "@/components/ui/button";
import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { urlDemo } from "@/lib/url";
import { cn } from "@/lib/utils";

import BotonCompartir from "./BotonCompartir";
import { claseIcono } from "./estilos";
import Seccion from "./Seccion";

const claseForma =
  "group flex h-full w-full flex-col items-start gap-3 rounded-tarjeta border border-borde bg-sup-1/85 p-6 text-left transition-colors hover:border-violeta/60 hover:bg-sup-2";

function Contenido({ Icono, titulo, texto }: { Icono: typeof IconoJugar; titulo: string; texto: string }) {
  return (
    <>
      <span className={cn(claseIcono, "transition-colors group-hover:text-oro")}>
        <Icono className="size-5" />
      </span>
      <span className="text-lg font-semibold">{titulo}</span>
      <span className="text-texto-2">{texto}</span>
    </>
  );
}

// Apoya el proyecto: hoy sin donaciones (config.donaciones = null), así que son
// formas reales de ayudar sin dinero. El botón de donar aparece solo si algún
// día se configura una plataforma externa.
export default function Apoya() {
  const t = es.sitio.apoya;
  const instagram = config.redes.instagram;
  const correo = config.contacto.correo;

  return (
    <Seccion id="apoya" etiqueta={t.etiqueta} titulo={t.titulo} bajada={t.bajada} lado="der">
      <ul className="grid gap-4 sm:grid-cols-2">
        <li data-revelar>
          <EnlaceExterno href={urlDemo()} className={claseForma}>
            <Contenido Icono={IconoJugar} titulo={t.jugar.titulo} texto={t.jugar.texto} />
          </EnlaceExterno>
        </li>
        {instagram && (
          <li data-revelar>
            <EnlaceExterno href={instagram.url} className={claseForma}>
              <Contenido Icono={IconoInstagram} titulo={t.seguir.titulo} texto={instagram.usuario} />
            </EnlaceExterno>
          </li>
        )}
        <li data-revelar>
          <BotonCompartir className={claseForma}>
            <Contenido Icono={IconoCompartir} titulo={t.compartir.titulo} texto={t.compartir.texto} />
          </BotonCompartir>
        </li>
        {correo && (
          <li data-revelar>
            <a href={`mailto:${correo}`} className={claseForma}>
              <Contenido Icono={IconoCorreo} titulo={t.escribir.titulo} texto={correo} />
            </a>
          </li>
        )}
      </ul>

      {config.donaciones && (
        <div data-revelar className="mt-8 flex flex-col gap-3">
          <EnlaceExterno href={config.donaciones} className={buttonVariants({ className: "self-start" })}>
            <IconoCorazon className="size-5" />
            {t.donar.boton}
          </EnlaceExterno>
          <p className="text-etiqueta text-texto-2">{t.donar.aclaracion}</p>
        </div>
      )}
    </Seccion>
  );
}
