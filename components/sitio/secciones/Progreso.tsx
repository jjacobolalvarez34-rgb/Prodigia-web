import Logo from "@/components/marca/Logo";
import { IconoEscudo, IconoLlama } from "@/components/sitio/iconos";
import { es } from "@/contenido/es";
import { MUNDO_POR_SLUG } from "@/contenido/mundos";
import { cn } from "@/lib/utils";

import { claseIcono, claseInsignia, claseNumero, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// Siete estrellas unidas como una constelación. Al entrar en pantalla, las
// líneas se trazan y las estrellas se encienden una a una (globals.css,
// .constelacion). Con reduced-motion o sin JS se ve encendida.
const ESTRELLAS = [
  [22, 118],
  [64, 98],
  [104, 106],
  [144, 82],
  [156, 40],
  [206, 30],
  [222, 78],
] as const;
const TRAZO = "M22 118 L64 98 L104 106 L144 82 L156 40 L206 30 L222 78 L144 82";

function Constelacion({ etiqueta }: { etiqueta: string }) {
  return (
    <svg viewBox="0 0 244 140" className="constelacion w-full max-w-sm" role="img" aria-label={etiqueta} data-revelar>
      <path d={TRAZO} pathLength={1} className="constelacion-linea" fill="none" strokeWidth="1.5" strokeLinejoin="round" />
      {ESTRELLAS.map(([x, y], i) => (
        <g key={i} className="constelacion-estrella" style={{ "--i": i } as React.CSSProperties}>
          <circle cx={x} cy={y} r={i === 6 ? 14 : 10} className="constelacion-halo" />
          <circle cx={x} cy={y} r={i === 6 ? 5.5 : 4} className="constelacion-punto" />
        </g>
      ))}
    </svg>
  );
}

// Placa de ejemplo, claramente ilustrativa: sin nombre real ni cifras.
function PlacaEjemplo() {
  const t = es.sitio.progreso.placa;
  const ciudad = MUNDO_POR_SLUG.numeria;

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-borde bg-[linear-gradient(120deg,#1E2542,#12172A)] p-4">
      <span className="absolute top-3 right-3 rounded-full border border-borde px-2 py-0.5 font-mono text-[0.75rem] text-texto-2">
        {t.ejemplo}
      </span>
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[conic-gradient(#A794FF,#E4CBA0,#FFC53D,#A794FF)] p-[3px]">
          <span className="grid size-full place-items-center rounded-full bg-sup-2">
            <Logo size={30} />
          </span>
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{t.nombre}</p>
          <p className="text-sm text-oro">{t.tituloJugador}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-etiqueta text-texto-2">
            <span aria-hidden="true" style={{ color: ciudad.neon }}>
              {ciudad.glifos[3]}
            </span>
            {ciudad.nombre}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Progreso() {
  const t = es.sitio.progreso;

  return (
    <Seccion id="progreso" etiqueta={t.etiqueta} titulo={t.titulo} lado="der">
      <div className="grid gap-4 md:grid-cols-2">
        <div data-revelar className={cn(claseTarjeta, "md:row-span-2")}>
          <Constelacion etiqueta={t.constelacion.dibujo} />
          <h3 className="mt-6 text-subtitulo font-semibold">{t.constelacion.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.constelacion.texto}</p>
        </div>

        <div data-revelar className={claseTarjeta}>
          <div className="flex items-center gap-3">
            <span className={cn(claseIcono, "text-racha")}>
              <IconoLlama className="size-5" />
            </span>
            <h3 className="text-lg font-semibold">{t.racha.titulo}</h3>
          </div>
          <p className="mt-3 text-texto-2">{t.racha.texto}</p>
        </div>

        <div data-revelar className={claseTarjeta}>
          <h3 className="text-lg font-semibold">{t.placa.titulo}</h3>
          <p className="mt-1.5 mb-4 text-texto-2">{t.placa.texto}</p>
          <PlacaEjemplo />
        </div>
      </div>

      <div data-revelar className={cn(claseTarjeta, "mt-4 flex flex-col gap-4 sm:flex-row sm:items-center")}>
        <p className="flex shrink-0 items-baseline gap-2">
          <span className="text-texto-2">{t.cosmeticos.antes}</span>
          <span className={cn(claseNumero, "text-[clamp(3rem,7vw,4rem)]")}>{t.cosmeticos.numero}</span>
        </p>
        <p className="text-texto-2">{t.cosmeticos.texto}</p>
      </div>

      <p data-revelar className={cn(claseInsignia, "mt-6 rounded-[16px] px-4 py-3 text-sm leading-relaxed")}>
        <IconoEscudo className="size-5 shrink-0 text-acierto" />
        {t.justo}
      </p>
    </Seccion>
  );
}
