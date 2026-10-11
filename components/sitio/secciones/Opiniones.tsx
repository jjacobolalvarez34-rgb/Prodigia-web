import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { IconoComillas } from "@/components/sitio/iconos";
import { buttonVariants } from "@/components/ui/button";
import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { urlDemo } from "@/lib/url";
import { cn } from "@/lib/utils";

import { claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// Opiniones (encargo §2): solo opiniones reales con permiso. Mientras no haya,
// estado vacío digno: invitar a probar y a escribir. Nada inventado.
export default function Opiniones() {
  const t = es.sitio.opiniones;
  const correo = config.contacto.correo;
  const instagram = config.redes.instagram;

  if (t.lista.length > 0) {
    return (
      <Seccion id="opiniones" etiqueta={t.etiqueta} titulo={t.titulo} lado="der">
        <ul className="grid gap-4 sm:grid-cols-2">
          {t.lista.map((opinion) => (
            <li key={opinion.texto} data-revelar className={claseTarjeta}>
              <figure>
                <blockquote className="text-lg">{opinion.texto}</blockquote>
                <figcaption className="mt-4 text-texto-2">{opinion.autor}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Seccion>
    );
  }

  return (
    <Seccion id="opiniones" etiqueta={t.etiqueta} titulo={t.vacio.titulo} lado="der">
      <div data-revelar className={cn(claseTarjeta, "border-dashed bg-transparent")}>
        <IconoComillas className="size-8 text-violeta-neon" />
        <p className="mt-4 text-cuerpo">{t.vacio.texto}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <EnlaceExterno href={urlDemo()} className={buttonVariants()}>
            {t.vacio.probar}
          </EnlaceExterno>
          {correo ? (
            <a href={`mailto:${correo}`} className={buttonVariants({ variant: "secundario" })}>
              {t.vacio.escribir}
            </a>
          ) : (
            <EnlaceExterno href={instagram?.url} className={buttonVariants({ variant: "secundario" })}>
              {t.vacio.escribir}
            </EnlaceExterno>
          )}
        </div>
      </div>
    </Seccion>
  );
}
