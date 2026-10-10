import { useId } from "react";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** "trazo": el contorno se dibuja solo en bucle (pantalla de carga). */
  variante?: "llena" | "trazo";
}

// Pluma aprobada por el dueño (docs/propuestas/pluma.svg, PENDIENTES.md §3).
// Sale del «brazo cometa» de la chispa del logo, escalado x2.2 / y4.4: en el
// acto 3 se encoge y se convierte en el brazo largo de la chispa. La punta que
// escribe es el extremo inferior del cálamo (0.4, 42).
export default function Pluma({ className, variante = "llena" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const oro = `pluma-oro-${id}`;
  const brillo = `punta-brillo-${id}`;
  const trazo = variante === "trazo";

  return (
    <svg viewBox="-60 -175 120 230" className={cn("overflow-visible", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={oro} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B87800" />
          <stop offset="35%" stopColor="#FFB627" />
          <stop offset="80%" stopColor="#FFC53D" />
          <stop offset="100%" stopColor="#FFE7A3" />
        </linearGradient>
        <radialGradient id={brillo}>
          <stop offset="0%" stopColor="#FFE7A3" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFB627" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="rotate(-18)">
        {/* Barbas (vexilo): brazo cometa del logo, escalado. */}
        <path
          d="M0,0 C-22,-39.6 -11,-118.8 1.1,-158.4 C8.8,-105.6 15.4,-35.2 0,0 Z"
          fill={`url(#${oro})`}
          pathLength={1}
          className={trazo ? "pluma-trazo" : undefined}
          stroke={trazo ? "#FFC53D" : undefined}
          strokeWidth={trazo ? 2 : undefined}
          strokeLinejoin="round"
        />
        {/* Muescas: rompen el contorno para que se lea pluma y no hoja. */}
        <path d="M-19.5,-66 L-7,-58 L-18.5,-55 Z" fill="#090C14" />
        <path d="M-16,-98 L-5,-90 L-14.5,-87.5 Z" fill="#090C14" />
        <path d="M13.5,-48 L3.5,-41 L13,-38.5 Z" fill="#090C14" />
        {/* Raquis (eje central). */}
        <path
          d="M0.4,8 C0.5,-40 0.8,-100 1.1,-150"
          fill="none"
          stroke="#7A4E00"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Cálamo: la parte que escribe. */}
        <path d="M-2.4,-2 L2.4,-2 L0.4,42 Z" fill="#FFB627" />
        {/* Punta encendida (de aquí nace la tinta). */}
        <circle cx="0.4" cy="42" r="6" fill={`url(#${brillo})`} />
      </g>
    </svg>
  );
}
