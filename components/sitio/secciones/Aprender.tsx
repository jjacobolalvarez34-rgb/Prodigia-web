import { IconoBombilla, IconoLibro } from "@/components/sitio/iconos";
import { es } from "@/contenido/es";
import { cn } from "@/lib/utils";

import { claseIcono, claseInsignia, claseNumero, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// Aprender (ficha §3): técnicas gratis, clases (la primera gratis) y el número
// protagonista: 630 lecciones en español y en inglés.
export default function Aprender() {
  const t = es.sitio.aprender;
  const tarjetas = [
    { ...t.tecnicas, Icono: IconoBombilla },
    { ...t.clases, Icono: IconoLibro },
  ];

  return (
    <Seccion id="aprender" etiqueta={t.etiqueta} titulo={t.titulo} lado="der">
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center">
        <p data-revelar className="flex flex-col">
          <span className={cn(claseNumero, "text-[clamp(5rem,14vw,8.5rem)]")}>{t.numero}</span>
          <span className="mt-3 text-subtitulo font-semibold">{t.unidad}</span>
          <span className="text-texto-2">{t.idiomas}</span>
        </p>
        <ul className="grid gap-4">
          {tarjetas.map(({ titulo, insignia, texto, Icono }) => (
            <li key={titulo} data-revelar className={claseTarjeta}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={claseIcono}>
                  <Icono className="size-5" />
                </span>
                <h3 className="text-subtitulo font-semibold">{titulo}</h3>
                <span className={claseInsignia}>{insignia}</span>
              </div>
              <p className="mt-4 text-texto-2">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
