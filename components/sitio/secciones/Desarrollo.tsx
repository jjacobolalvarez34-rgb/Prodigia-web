import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { estadisticas, fechaCorta, fechaLarga, leerActividad } from "@/lib/actividad";
import { cn } from "@/lib/utils";

import { claseNumero, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// El desarrollo (DISENO.md §6.4): actividad real del repo de Prodigia
// (datos/actividad.json). Sin datos, estado vacío; nunca datos de muestra.
export default function Desarrollo() {
  const t = es.sitio.desarrollo;
  const actividad = leerActividad();

  return (
    <Seccion id="desarrollo" etiqueta={t.etiqueta} titulo={t.titulo} bajada={t.texto(config.autor.firma)} lado="izq">
      {actividad ? (
        <Estadisticas actividad={actividad} />
      ) : (
        <p data-revelar className={cn(claseTarjeta, "border-dashed bg-transparent text-texto-2")}>
          {t.vacio}
        </p>
      )}
    </Seccion>
  );
}

function Estadisticas({ actividad }: { actividad: NonNullable<ReturnType<typeof leerActividad>> }) {
  const t = es.sitio.desarrollo.estadisticas;
  const datos = estadisticas(actividad);
  const filas = [
    { numero: datos.total, texto: t.total },
    { numero: datos.diaMasActivo.cambios, texto: t.diaMasActivo(fechaCorta(datos.diaMasActivo.fecha)) },
    { numero: datos.rachaMasLarga, texto: t.racha },
  ];

  return (
    <div data-revelar>
      <dl className="grid gap-4 sm:grid-cols-3">
        {filas.map((fila) => (
          <div key={fila.texto} className={cn(claseTarjeta, "flex flex-col-reverse justify-end")}>
            <dt className="mt-3 text-texto-2">{fila.texto}</dt>
            <dd className={cn(claseNumero, "text-[clamp(2.75rem,6vw,3.5rem)]")}>{fila.numero}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-mono text-etiqueta text-texto-2">{t.rango(fechaLarga(actividad.desde), fechaLarga(actividad.hasta))}</p>
    </div>
  );
}
