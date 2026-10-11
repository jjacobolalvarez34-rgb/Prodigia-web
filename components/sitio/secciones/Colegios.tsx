import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { IconoGrupo } from "@/components/sitio/iconos";
import { buttonVariants } from "@/components/ui/button";
import { es } from "@/contenido/es";
import { urlDocentes } from "@/lib/url";
import { cn } from "@/lib/utils";

import { claseIcono, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// Colegios y docentes (ficha §12): el panel de profesor y el enlace a /docentes.
export default function Colegios() {
  const t = es.sitio.colegios;

  return (
    <Seccion id="colegios" etiqueta={t.etiqueta} titulo={t.titulo} lado="izq">
      <div data-revelar className={cn(claseTarjeta, "flex flex-col gap-6 sm:flex-row sm:items-center")}>
        <span className={cn(claseIcono, "size-14")}>
          <IconoGrupo className="size-6" />
        </span>
        <p className="flex-1 text-texto-2">{t.texto}</p>
        <EnlaceExterno href={urlDocentes()} className={buttonVariants({ className: "self-start sm:self-center" })}>
          {t.boton}
        </EnlaceExterno>
      </div>
    </Seccion>
  );
}
