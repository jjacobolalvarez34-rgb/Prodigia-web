import type { ReactNode } from "react";

import type { SeccionId } from "@/contenido/tipos";
import { cn } from "@/lib/utils";

import { claseEtiqueta } from "./estilos";

/** Lado donde va el logo viajero (Fase 4); el contenido ocupa el lado opuesto. */
export type LadoLogo = "izq" | "der" | "oculto";

interface Props {
  id: SeccionId;
  etiqueta: string;
  titulo: string;
  bajada?: string;
  lado: LadoLogo;
  /** Algo junto a la etiqueta (por ejemplo, la insignia «Muy pronto»). */
  junto?: ReactNode;
  children: ReactNode;
}

// Contenedor de cada sección del acto 4 (DISENO.md §6.2-6.3): rejilla de 12
// columnas desde 1024px con el contenido en 8 columnas del lado opuesto al
// logo, para que el logo nunca tape contenido. En «Los mundos» el logo se
// oculta y la rejilla usa todo el ancho. Una sola idea por sección.
export default function Seccion({ id, etiqueta, titulo, bajada, lado, junto, children }: Props) {
  const idTitulo = `${id}-titulo`;

  return (
    <section id={id} aria-labelledby={idTitulo} data-logo={lado} className="seccion-sitio py-[clamp(96px,14vh,160px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div
          className={cn(
            lado === "der" && "lg:col-span-8",
            lado === "izq" && "lg:col-span-8 lg:col-start-5",
            lado === "oculto" && "lg:col-span-12",
          )}
        >
          <header data-revelar className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className={claseEtiqueta}>{etiqueta}</p>
              {junto}
            </div>
            <h2 id={idTitulo} className="mt-3 text-titulo font-bold">
              {titulo}
            </h2>
            {bajada && <p className="mt-4 max-w-[60ch] text-cuerpo text-texto-2">{bajada}</p>}
          </header>
          <div className="mt-10 sm:mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}
