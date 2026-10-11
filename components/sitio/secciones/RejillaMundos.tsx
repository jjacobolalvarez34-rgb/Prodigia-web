"use client";

import { useState } from "react";

import EnlaceExterno from "@/components/sitio/EnlaceExterno";
import { IconoFlecha, IconoFlechaAbajo } from "@/components/sitio/iconos";
import { es } from "@/contenido/es";
import { MUNDO_POR_SLUG } from "@/contenido/mundos";
import type { Mundo, TramoId } from "@/contenido/tipos";
import { TRAMOS } from "@/contenido/tramos";
import { urlDemo } from "@/lib/url";
import { cn } from "@/lib/utils";

// Los 15 mundos en el orden de los tramos del anillo, para que el filtro y la
// intro cuenten lo mismo.
const MUNDOS_POR_TRAMO = TRAMOS.flatMap((tramo) => tramo.mundos.map((slug) => ({ mundo: MUNDO_POR_SLUG[slug], tramo: tramo.id })));

// Selector de variación U+FE0E: pide la forma de texto del glifo.
const TEXTO = String.fromCharCode(0xfe0e);

// Posición de cada glifo flotante (quietos: «nada se mueve mientras se lee»).
const POSICION_GLIFOS = [
  "right-[7%] top-[9%] text-[3.25rem] -rotate-6",
  "right-[30%] top-[24%] text-[1.75rem] rotate-12",
  "right-[9%] top-[38%] text-[2.25rem] rotate-6",
  "right-[26%] top-[4%] text-[1.5rem] -rotate-12",
];

function TarjetaMundo({ mundo, oculta }: { mundo: Mundo; oculta: boolean }) {
  const t = es.sitio.mundos.tarjeta;

  return (
    <li
      hidden={oculta}
      className="tarjeta-mundo relative isolate flex flex-col overflow-hidden rounded-tarjeta border border-white/10 p-6 text-white"
      style={{ "--c": mundo.base, "--n": mundo.neon } as React.CSSProperties}
    >
      <div aria-hidden="true" className="glifos-texto pointer-events-none absolute inset-0 -z-10 font-display leading-none select-none">
        {mundo.glifos.map((glifo, i) => (
          <span key={glifo} className={cn("absolute text-(--n) opacity-30", POSICION_GLIFOS[i])}>
            {glifo.length === 1 ? glifo + TEXTO : glifo}
          </span>
        ))}
      </div>

      <p className="font-display text-etiqueta font-semibold tracking-[0.16em] text-white/85 uppercase">{mundo.tema}</p>
      <h3 className="mt-2 font-display text-[1.75rem] leading-tight font-bold tracking-tight">{mundo.nombre}</h3>
      <p className="mt-2 max-w-[30ch] text-[0.9375rem] text-white/85">{mundo.linea}</p>

      <details className="group mt-4">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-full text-sm font-medium text-white/90 hover:text-white [&::-webkit-details-marker]:hidden">
          {t.modos(mundo.modos.length)}
          <IconoFlechaAbajo className="size-4 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {mundo.modos.map((modo) => (
            <li key={modo} className="rounded-full bg-fondo-hondo/55 px-2.5 py-1 text-etiqueta text-white/90">
              {modo}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-auto pt-6">
        <EnlaceExterno
          href={urlDemo(mundo.slug)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-fondo-hondo/65 px-4 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-fondo-hondo/85"
        >
          {t.probar}
          <span className="sr-only"> — {mundo.nombre}</span>
          <IconoFlecha className="size-4" />
        </EnlaceExterno>
      </div>
    </li>
  );
}

export default function RejillaMundos() {
  const t = es.sitio.mundos;
  const [tramo, setTramo] = useState<TramoId | "todos">("todos");
  const visibles = MUNDOS_POR_TRAMO.filter((m) => tramo === "todos" || m.tramo === tramo).length;
  const opciones: { id: TramoId | "todos"; nombre: string }[] = [
    { id: "todos", nombre: t.filtro.todos },
    ...TRAMOS.map((x) => ({ id: x.id, nombre: es.mundos.tramos[x.id] })),
  ];

  return (
    <div>
      {/* Sin JavaScript el filtro no sirve: se oculta y se ven los 15. */}
      <div role="group" aria-label={t.filtro.etiqueta} className="solo-js flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            aria-pressed={tramo === opcion.id}
            onClick={() => setTramo(opcion.id)}
            className="min-h-11 rounded-full border border-borde bg-sup-1 px-4 text-sm font-medium text-texto-2 transition-colors hover:border-violeta/60 hover:text-texto aria-pressed:border-texto aria-pressed:bg-texto aria-pressed:text-fondo"
          >
            {opcion.nombre}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {t.filtro.mostrando(visibles)}
      </p>

      <ul data-revelar className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MUNDOS_POR_TRAMO.map(({ mundo, tramo: suTramo }) => (
          <TarjetaMundo key={mundo.slug} mundo={mundo} oculta={tramo !== "todos" && suTramo !== tramo} />
        ))}
      </ul>
    </div>
  );
}
