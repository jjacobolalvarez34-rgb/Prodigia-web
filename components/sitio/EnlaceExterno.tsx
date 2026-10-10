import type { ComponentProps } from "react";

import { es } from "@/contenido/es";

type Props = Omit<ComponentProps<"a">, "href" | "target" | "rel"> & {
  /** `null` o vacío = no configurado: no se renderiza nada (nunca un enlace roto). */
  href: string | null | undefined;
};

// Único componente para enlaces que salen del sitio: siempre en pestaña nueva
// y con rel="noopener noreferrer" (SEGURIDAD_Y_DESPLIEGUE.md §3).
export default function EnlaceExterno({ href, children, ...props }: Props) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {es.sitio.accesibilidad.pestanaNueva}</span>
    </a>
  );
}
