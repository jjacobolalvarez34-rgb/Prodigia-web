import { MUNDO_POR_SLUG } from "@/contenido/mundos";
import { ARO, CIUDADES_EN_ANILLO, puntoDelAro } from "@/lib/progreso-intro";

// Anillo 2D: es el mismo aro del logo (r=34, trazo 14, en un viewBox de 100)
// dibujado en grande y en perspectiva con CSS 3D. El volumen sale de capas
// apiladas en profundidad (más oscuras hacia atrás); las ciudades son luces de
// su color sobre la cara de arriba. Al final se aplana y se encoge hasta ser,
// exactamente, el logo de #inicio. Decorativo: aria-hidden.
const CAPAS = 12;
const LARGO_ARCO = ARO.largoTrazo / ARO.circunferencia;

// De violeta medio a casi fondo, hacia atrás.
function colorCapa(k: number) {
  const t = k / CAPAS;
  const de = [0x4a, 0x31, 0xb8];
  const a = [0x1a, 0x14, 0x48];
  const c = de.map((v, i) => Math.round(v + (a[i]! - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function Trazo({ color }: { color: string }) {
  return (
    <circle
      data-trazo
      cx="50"
      cy="50"
      r={ARO.radio}
      fill="none"
      stroke={color}
      strokeWidth={ARO.grosor}
      pathLength={1}
      strokeDasharray={`${LARGO_ARCO} 1`}
      transform={`rotate(${ARO.anguloInicio} 50 50)`}
    />
  );
}

export default function Anillo2D() {
  return (
    <div className="intro-anillo order-3" aria-hidden="true">
      <div className="anillo-giro">
        {Array.from({ length: CAPAS }, (_, i) => CAPAS - i).map((k) => (
          <svg key={k} viewBox="0 0 100 100" className="anillo-capa" style={{ "--k": k } as React.CSSProperties}>
            <Trazo color={colorCapa(k)} />
          </svg>
        ))}
        <svg viewBox="0 0 100 100" className="anillo-cara">
          <defs>
            <linearGradient id="anillo-chispa-degradado" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A794FF" />
              <stop offset="50%" stopColor="#E4CBA0" />
              <stop offset="100%" stopColor="#FFC53D" />
            </linearGradient>
            <path id="anillo-brazo" d="M0,0 C-10,-9 -5,-27 0.5,-36 C4,-24 7,-8 0,0 Z" />
          </defs>
          <Trazo color="#6C4CF1" />
          {CIUDADES_EN_ANILLO.map((ciudad) => {
            const { x, y } = puntoDelAro(ciudad.angulo);
            return (
              <g
                key={ciudad.slug}
                data-ciudad-punto={ciudad.slug}
                className="anillo-ciudad"
                transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
                style={{ "--c": MUNDO_POR_SLUG[ciudad.slug].neon } as React.CSSProperties}
              >
                <circle className="halo" r="5.2" />
                <circle className="punto" r="2.1" />
              </g>
            );
          })}
          {/* La chispa: aparece cuando la pluma se posa en la apertura. */}
          <g transform={`translate(${ARO.chispa.x} ${ARO.chispa.y}) rotate(14)`} fill="url(#anillo-chispa-degradado)">
            <g data-chispa transform="scale(0)">
              <use href="#anillo-brazo" />
              <use href="#anillo-brazo" transform="rotate(180) scale(0.33)" />
              <use href="#anillo-brazo" transform="rotate(84) scale(0.2)" />
              <use href="#anillo-brazo" transform="rotate(268) scale(0.15)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
