import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
  // El aro puede teñirse con el color de una sección o mundo (violeta por
  // defecto), como en la web.
  colorAro?: string;
  // Sin chispa: el aro solo (la página 404, donde «la chispa se escapó»).
  conChispa?: boolean;
  "data-logo-final"?: boolean;
}

// Port fiel de calibra/src/components/Logo.tsx: mismos paths, dasharray,
// rotaciones y degradado. Única diferencia: los ids del <defs> son únicos por
// instancia (useId), porque en esta página conviven varios logos y un id
// repetido dentro de un elemento oculto deja sin degradado a los demás.
//
// Anillo flat #6C4CF1 con una apertura de la que brota una chispa ASIMÉTRICA
// de 4 puntas en degradado violeta→dorado: un brazo largo tipo cometa, un
// brazo corto de contrapeso en la dirección opuesta y dos protuberancias
// chicas perpendiculares, de tamaño y ángulo distintos, para que no haya
// ningún eje de simetría. La apertura del anillo está centrada en el ángulo
// donde se apoya la chispa (translate(82 44) visto desde el centro, 50 50).
export default function Logo({ size = 32, className, colorAro = "#6C4CF1", conChispa = true, ...resto }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const degradado = `prodigia-star-gradient-${id}`;
  const brazo = `prodigia-spark-arm-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false" {...resto}>
      <defs>
        {/* Parada intermedia cálida neutra: interpolar directo entre A794FF y
            FFC53D pasa por un rosa apagado que la marca pide evitar. */}
        <linearGradient id={degradado} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A794FF" />
          <stop offset="50%" stopColor="#E4CBA0" />
          <stop offset="100%" stopColor="#FFC53D" />
        </linearGradient>

        {/* Brazo «cometa» compartido por las 4 puntas de la chispa. */}
        <path id={brazo} d="M0,0 C-10,-9 -5,-27 0.5,-36 C4,-24 7,-8 0,0 Z" />
      </defs>

      {/* Extremos sin stroke-linecap: el arco termina en corte radial. La
          apertura (el 55 del dasharray) queda centrada en ~349° gracias al
          rotate(82). */}
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke={colorAro}
        strokeWidth="14"
        strokeDasharray="158.6 55"
        strokeDashoffset="27.5"
        transform="rotate(82 50 50)"
        className="[transition:stroke_.3s_ease]"
      />

      {/* Largo (escala 1), corto de contrapeso (0.33) y dos protuberancias
          (84°/0.2 y 268°/0.15). */}
      {conChispa && (
        <g transform="translate(82 44) rotate(14)" fill={`url(#${degradado})`}>
          <use href={`#${brazo}`} />
          <use href={`#${brazo}`} transform="rotate(180) scale(0.33)" />
          <use href={`#${brazo}`} transform="rotate(84) scale(0.2)" />
          <use href={`#${brazo}`} transform="rotate(268) scale(0.15)" />
        </g>
      )}
    </svg>
  );
}
