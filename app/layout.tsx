import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { connection } from "next/server";
import type { ReactNode } from "react";

import AvisoSinJs from "@/components/sitio/AvisoSinJs";
import Encabezado from "@/components/sitio/Encabezado";
import Pie from "@/components/sitio/Pie";
import { es } from "@/contenido/es";
import { urlSitio } from "@/lib/url";
import { cn } from "@/lib/utils";

import "./globals.css";

// Fuentes autoalojadas en el build: sin peticiones a Google en el navegador,
// compatible con font-src 'self'.
const display = Space_Grotesk({ subsets: ["latin"], variable: "--fuente-display", display: "swap" });
const cuerpo = Inter({ subsets: ["latin"], variable: "--fuente-cuerpo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--fuente-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: urlSitio,
  title: { default: es.sitio.meta.titulo, template: es.sitio.meta.plantillaTitulo },
  description: es.sitio.meta.descripcion,
  applicationName: es.sitio.inicio.nombre,
};

export const viewport: Viewport = {
  themeColor: "#090C14",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // La CSP lleva un nonce por petición (proxy.ts) y Next solo puede ponerlo en
  // sus scripts si la página se renderiza por petición, no en el build.
  await connection();

  return (
    <html lang="es" data-scroll-behavior="smooth" className={cn(display.variable, cuerpo.variable, mono.variable)}>
      <body className="bg-fondo font-cuerpo text-texto antialiased">
        <div id="raiz" className="relative isolate flex min-h-dvh flex-col">
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-sup-2 focus:px-4 focus:py-2.5 focus:text-sm"
          >
            {es.sitio.accesibilidad.irAlContenido}
          </a>
          <div aria-hidden="true" className="cielo pointer-events-none fixed inset-0 -z-10" />
          <Encabezado />
          <AvisoSinJs />
          <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Pie />
        </div>
      </body>
    </html>
  );
}
