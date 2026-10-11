import { es } from "@/contenido/es";
import { cn } from "@/lib/utils";

import { claseNumero, claseTarjeta } from "./estilos";
import Seccion from "./Seccion";

// Diez barras de altura creciente: la capa encendida se recorta con clip-path
// y, al entrar en pantalla, sube y baja antes de quedarse en el 6 (globals.css,
// .escala). Con reduced-motion queda directamente en su estado final.
function EscalaDificultad({ etiqueta }: { etiqueta: string }) {
  const barras = Array.from({ length: 10 }, (_, i) => i);
  const fila = (encendida: boolean) => (
    <div className={cn("absolute inset-0 flex items-end gap-1.5", encendida && "escala-luz")}>
      {barras.map((i) => (
        <span
          key={i}
          className={cn(
            "flex-1 rounded-t-[4px]",
            encendida ? "bg-[linear-gradient(180deg,var(--color-oro-claro),var(--color-violeta))]" : "bg-sup-3",
          )}
          style={{ height: `${22 + i * 8.6}%` }}
        />
      ))}
    </div>
  );

  return (
    <div data-revelar className="escala" role="img" aria-label={etiqueta}>
      <div className="relative h-24">
        {fila(false)}
        {fila(true)}
      </div>
      <div className="mt-2 flex justify-between font-mono text-etiqueta text-texto-2" aria-hidden="true">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

// Esfera de reloj sin manecillas: el Modo Zen no tiene reloj.
function RelojSinManecillas() {
  const marcas = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 96 96" className="size-24" aria-hidden="true" focusable="false">
      <circle cx="48" cy="48" r="44" fill="none" stroke="var(--color-borde)" strokeWidth="2" />
      {marcas.map((grados) => (
        <line
          key={grados}
          x1="48"
          y1="9"
          x2="48"
          y2={grados % 90 === 0 ? 17 : 14}
          stroke={grados % 90 === 0 ? "var(--color-violeta-neon)" : "var(--color-texto-2)"}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${grados} 48 48)`}
        />
      ))}
      <circle cx="48" cy="48" r="3" fill="var(--color-acierto)" />
    </svg>
  );
}

export default function ComoSeJuega() {
  const t = es.sitio.comoSeJuega;

  return (
    <Seccion id="como-se-juega" etiqueta={t.etiqueta} titulo={t.titulo} lado="der">
      <ul className="grid gap-4 sm:grid-cols-2">
        <li data-revelar className={claseTarjeta}>
          <p className="flex items-baseline gap-3">
            <span className={cn(claseNumero, "text-[clamp(4rem,10vw,5.5rem)]")}>{t.sprint.numero}</span>
            <span className="text-texto-2">{t.sprint.unidad}</span>
          </p>
          <h3 className="mt-6 text-subtitulo font-semibold">{t.sprint.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.sprint.texto}</p>
        </li>

        <li data-revelar className={claseTarjeta} style={{ "--retraso": "80ms" } as React.CSSProperties}>
          <EscalaDificultad etiqueta={t.dificultad.escala} />
          <h3 className="mt-6 text-subtitulo font-semibold">{t.dificultad.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.dificultad.texto}</p>
        </li>

        <li data-revelar className={claseTarjeta}>
          <div className="flex items-center gap-4">
            <RelojSinManecillas />
            <span className="font-mono text-etiqueta tracking-[0.2em] text-acierto uppercase">{t.zen.marca}</span>
          </div>
          <h3 className="mt-6 text-subtitulo font-semibold">{t.zen.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.zen.texto}</p>
        </li>

        <li data-revelar className={claseTarjeta} style={{ "--retraso": "80ms" } as React.CSSProperties}>
          <dl className="flex items-end gap-8">
            {[t.retos.diario, t.retos.semanal].map((reto) => (
              <div key={reto.etiqueta} className="flex flex-col-reverse">
                <dt className="mt-2 text-texto-2">{reto.etiqueta}</dt>
                <dd className={cn(claseNumero, "text-[clamp(3.25rem,8vw,4.5rem)]")}>{reto.numero}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-6 text-subtitulo font-semibold">{t.retos.titulo}</h3>
          <p className="mt-2 text-texto-2">{t.retos.texto}</p>
        </li>
      </ul>
      <p data-revelar className="mt-8 max-w-[60ch] border-l-2 border-violeta pl-4 text-texto-2">
        {t.nota}
      </p>
    </Seccion>
  );
}
