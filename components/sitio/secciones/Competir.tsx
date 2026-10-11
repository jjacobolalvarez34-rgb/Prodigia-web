import { IconoChat, IconoEscudo, IconoEspadas, IconoTrofeo } from "@/components/sitio/iconos";
import { es } from "@/contenido/es";
import { RANGOS } from "@/contenido/rangos";

import { claseEtiqueta, claseIcono, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

const ICONOS = [IconoEspadas, IconoTrofeo, IconoEscudo, IconoChat];

// Competir y social (ficha §5 y §6): Rankeds con ELO, la escalera de rangos con
// sus colores reales y lo social. En móvil la escalera es una lista de barras
// horizontales; desde 640px, columnas que suben (globals.css, .escalera).
export default function Competir() {
  const t = es.sitio.competir;

  return (
    <Seccion id="competir" etiqueta={t.etiqueta} titulo={t.titulo} lado="izq">
      <div data-revelar className={claseTarjeta}>
        <div className="flex items-center gap-3">
          <span className={claseIcono}>
            <IconoEspadas className="size-5" />
          </span>
          <h3 className="text-subtitulo font-semibold">{t.rankeds.titulo}</h3>
        </div>
        <p className="mt-4 max-w-[60ch] text-texto-2">{t.rankeds.texto}</p>

        <h4 className={`${claseEtiqueta} mt-8`}>{t.rangosTitulo}</h4>
        <ol data-revelar className="escalera mt-5">
          {RANGOS.map((rango, i) => (
            <li
              key={rango.slug}
              className="escalera-peldano"
              style={
                {
                  "--i": i,
                  "--alto": `${34 + i * 13}%`,
                  "--color": rango.degradado ? `linear-gradient(0deg, ${rango.degradado[0]}, ${rango.degradado[1]})` : rango.color,
                } as React.CSSProperties
              }
            >
              <span className="escalera-barra" aria-hidden="true" />
              <span className="escalera-texto">
                <span
                  className={
                    rango.degradado
                      ? "bg-[linear-gradient(90deg,#A794FF,#FFC53D)] bg-clip-text font-display font-bold text-transparent"
                      : "font-display font-semibold"
                  }
                  style={rango.degradado ? undefined : { color: rango.color }}
                >
                  {t.rangos[rango.slug]}
                </span>
                <span className="font-mono text-etiqueta text-texto-2">{t.eloDesde(rango.min)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {t.lista.map((item, i) => {
          const Icono = ICONOS[i] ?? IconoEspadas;
          return (
            <li key={item.titulo} data-revelar className={claseTarjeta}>
              <span className={claseIcono}>
                <Icono className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.titulo}</h3>
              <p className="mt-1.5 text-texto-2">{item.texto}</p>
            </li>
          );
        })}
      </ul>
    </Seccion>
  );
}
