import { IconoCheck } from "@/components/sitio/iconos";
import { es } from "@/contenido/es";

import { claseEtiqueta } from "./estilos";
import RejillaMundos from "./RejillaMundos";
import Seccion from "./Seccion";

// Los mundos (DISENO.md §6.3 fila 3): rejilla explorable a todo el ancho; el
// logo viajero se oculta aquí.
export default function LosMundos() {
  const t = es.sitio.mundos;

  return (
    <Seccion id="mundos" etiqueta={t.etiqueta} titulo={t.titulo} bajada={t.bajada} lado="oculto">
      <RejillaMundos />
      <div data-revelar className="mt-14">
        <h3 className={claseEtiqueta}>{t.detalles.titulo}</h3>
        <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {t.detalles.lista.map((detalle) => (
            <li key={detalle} className="flex gap-3 text-texto-2">
              <IconoCheck className="mt-0.5 size-5 shrink-0 text-acierto" />
              <span>{detalle}</span>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
