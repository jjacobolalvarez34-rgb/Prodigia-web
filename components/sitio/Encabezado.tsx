import Link from "next/link";

import Logo from "@/components/marca/Logo";
import { buttonVariants } from "@/components/ui/button";
import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { urlSeccion, urlWeb } from "@/lib/url";

import EncabezadoFijo from "./EncabezadoFijo";
import EnlaceExterno from "./EnlaceExterno";
import MenuMovil from "./MenuMovil";

// Encabezado fijo (DISENO.md §6.1): logo a la izquierda, secciones al centro
// desde 1024px, «Abrir Prodigia» a la derecha y menú a pantalla completa en
// móvil y tablet.
export default function Encabezado() {
  const t = es.sitio;
  const enlaces = t.nav.map((n) => ({ href: urlSeccion(n.id), etiqueta: n.etiqueta }));
  const instagram = config.redes.instagram;

  return (
    <EncabezadoFijo>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={urlSeccion("inicio")}
          aria-label={t.accesibilidad.irAlInicio}
          className="-ml-2 flex min-h-11 items-center gap-2.5 rounded-full px-2"
        >
          <Logo size={28} />
          <span className="font-display text-lg font-semibold tracking-tight">{t.inicio.nombre}</span>
        </Link>

        <nav aria-label={t.accesibilidad.navPrincipal} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-texto-2 transition-colors hover:text-texto"
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <EnlaceExterno
            href={urlWeb()}
            className={buttonVariants({
              className:
                "hidden h-10 min-h-10 px-4 text-sm transition-[opacity,visibility,box-shadow] sm:inline-flex group-data-[inicio]/encabezado:invisible group-data-[inicio]/encabezado:opacity-0",
            })}
          >
            {t.encabezado.abrirProdigia}
          </EnlaceExterno>
          <MenuMovil
            enlaces={enlaces}
            cta={{ href: urlWeb(), etiqueta: t.encabezado.abrirProdigia }}
            instagram={instagram && { ...instagram, etiqueta: t.pie.instagram }}
            textos={{ ...t.menu, irAlInicio: t.accesibilidad.irAlInicio, nombre: t.inicio.nombre }}
          />
        </div>
      </div>
    </EncabezadoFijo>
  );
}
