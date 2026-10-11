import { MUNDO_POR_SLUG } from "@/contenido/mundos";
import { ARO, CIUDADES_EN_ANILLO, puntoDelAro } from "@/lib/progreso-intro";

// Anillo 2D (modo ligero y modo quieto): es el mismo aro del logo (r=34, trazo
// 14, en un viewBox de 100) dibujado en grande y en perspectiva con CSS 3D. El
// volumen sale de capas finas apiladas en profundidad (más oscuras hacia
// atrás); arriba, filos de neón en los dos bordes como en la escena 3D; las
// ciudades son luces de su color con núcleo nítido; la punta del trazo brilla
// en dorado mientras escribe. Al final se aplana y se encoge hasta ser,
// exactamente, el logo de #inicio. Decorativo: aria-hidden.
const CAPAS = 18;
const LARGO_ARCO = ARO.largoTrazo / ARO.circunferencia;
const BORDE_EXTERIOR = ARO.radio + ARO.grosor / 2;
const BORDE_INTERIOR = ARO.radio - ARO.grosor / 2;

// De violeta medio a casi fondo, hacia atrás.
function colorCapa(k: number) {
  const t = k / CAPAS;
  const de = [0x5a, 0x3e, 0xd6];
  const a = [0x16, 0x11, 0x3c];
  const c = de.map((v, i) => Math.round(v + (a[i] - v) * t ** 0.8));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function Trazo({ color, radio = ARO.radio, grosor = ARO.grosor, opacidad }: { color: string; radio?: number; grosor?: number; opacidad?: number }) {
  return (
    <circle
      data-trazo
      cx="50"
      cy="50"
      r={radio}
      fill="none"
      stroke={color}
      strokeWidth={grosor}
      strokeOpacity={opacidad}
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
          {/* Filos de neón (resplandor ancho y tenue + línea fina y clara). */}
          <g className="anillo-filos">
            <Trazo color="#9B85FF" radio={BORDE_EXTERIOR - 0.6} grosor={2.4} opacidad={0.28} />
            <Trazo color="#D9CFFF" radio={BORDE_EXTERIOR - 0.6} grosor={0.7} />
            <Trazo color="#9B85FF" radio={BORDE_INTERIOR + 0.6} grosor={2.4} opacidad={0.22} />
            <Trazo color="#D9CFFF" radio={BORDE_INTERIOR + 0.6} grosor={0.6} />
          </g>
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
                <circle className="halo" r="4.2" />
                <circle className="punto" r="2" />
                <circle className="nucleo" r="0.9" />
              </g>
            );
          })}
          {/* Tinta fresca en la punta del trazo (la mueve EscenaIntro). */}
          <g data-cabeza className="anillo-cabeza" opacity="0">
            <circle r="5" fill="#FFB627" fillOpacity="0.28" />
            <circle r="2.6" fill="#FFC53D" fillOpacity="0.7" />
            <circle r="1.2" fill="#FFF3D1" />
          </g>
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
