import Pluma from "@/components/marca/Pluma";
import VerConAnimacion from "@/components/intro/VerConAnimacion";
import { IconoFlechaAbajo } from "@/components/sitio/iconos";
import { config } from "@/contenido/config";
import { es } from "@/contenido/es";
import { MUNDO_POR_SLUG, MUNDOS } from "@/contenido/mundos";
import { TRAMOS } from "@/contenido/tramos";
import { fechaLarga, leerActividad } from "@/lib/actividad";
import { ventanaTramo } from "@/lib/progreso-intro";

// Todo el texto de la intro como HTML real (encargo §4): se lee sin JavaScript,
// con lector de pantalla y en buscadores. El canvas y el anillo son decoración.
// Cada bloque lleva data-momento; en modo animado EscenaIntro decide cuándo se
// ve. En modo quieto (y sin JS) se apilan en este orden, con el anillo entre
// «Qué es» y las ciudades (clases order-*).

// «divertido» en el degradado de la chispa (#A794FF → #E4CBA0 → #FFC53D), una
// letra a la vez: cada letra se revela por separado al paso de la pluma.
function colorChispa(t: number) {
  const tramos: [number, number, number][] = [
    [0xa7, 0x94, 0xff],
    [0xe4, 0xcb, 0xa0],
    [0xff, 0xc5, 0x3d],
  ];
  const x = Math.min(0.9999, Math.max(0, t)) * 2;
  const i = Math.floor(x);
  const f = x - i;
  const [a, b] = [tramos[i], tramos[i + 1]];
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function Frase() {
  const t = es.intro.frase;
  const completa = t.antes + t.resaltada + t.despues;
  // Palabras que no se cortan por dentro; cada letra es un <span data-letra>
  // (en línea, para no perder el ajuste entre letras).
  const palabras = [
    ...t.antes
      .trim()
      .split(" ")
      .map((texto) => ({ texto, resaltada: false })),
    { texto: t.resaltada + t.despues, resaltada: true },
  ];

  return (
    <h1 className="intro-frase">
      <span className="sr-only">{completa}</span>
      <span aria-hidden="true">
        {palabras.map((palabra, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="whitespace-nowrap">
              {[...palabra.texto].map((letra, j) => {
                const esResaltada = palabra.resaltada && j < t.resaltada.length;
                const color = esResaltada ? colorChispa(j / (t.resaltada.length - 1)) : undefined;
                return (
                  <span key={j} data-letra style={color ? { color } : undefined}>
                    {letra}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}

export default function TextosIntro() {
  const t = es.intro;
  const actividad = leerActividad();
  const claseTitulo = "font-display text-[clamp(1.75rem,1.25rem+1.9vw,2.75rem)] leading-[1.1] font-bold tracking-tight";

  return (
    <div className="intro-textos">
      <div data-momento="frase" className="intro-bloque intro-bloque-frase order-1">
        <VerConAnimacion aviso={t.movimiento.aviso} etiqueta={t.movimiento.activar} />
        <Frase />
        <Pluma className="intro-pluma-quieta mt-6" />
        <p className="intro-deslizar mt-8 inline-flex items-center gap-2 text-etiqueta text-texto-2">
          {t.deslizar}
          <IconoFlechaAbajo className="size-4 motion-safe:animate-bounce" />
        </p>
      </div>

      <div data-momento="que-es" className="intro-bloque order-2">
        <h2 className={claseTitulo}>{t.queEs.titulo}</h2>
        {t.queEs.parrafos.map((parrafo) => (
          <p key={parrafo} className="mt-4 text-texto-2">
            {parrafo}
          </p>
        ))}
        <p className="mt-6 border-l-2 border-oro pl-4 font-display text-lg font-semibold text-texto">{t.puente}</p>
      </div>

      <h2 className="sr-only order-4">{t.ciudadesTitulo}</h2>
      {TRAMOS.map((tramo, i) => (
        <div key={tramo.id} data-momento={`tramo-${i}`} data-ventana={ventanaTramo(i).join(",")} className="intro-bloque order-4">
          <h3 className="font-display text-etiqueta font-semibold tracking-[0.2em] text-texto-2 uppercase">
            {es.mundos.tramos[tramo.id]}
          </h3>
          <ul className="mt-4 grid gap-3 lg:gap-4">
            {tramo.mundos.map((slug) => {
              const mundo = MUNDO_POR_SLUG[slug];
              return (
                <li key={slug} data-ciudad={slug} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="intro-ciudad-glifo grid size-9 shrink-0 place-items-center rounded-full border font-display text-sm lg:size-10 lg:text-base"
                    style={{ color: mundo.neon, borderColor: `${mundo.neon}55`, background: `${mundo.base}26` }}
                  >
                    {mundo.glifo}
                  </span>
                  <div className="min-w-0">
                    <p className="leading-snug">
                      <strong className="font-display text-lg font-bold" style={{ color: mundo.neon }}>
                        {mundo.nombre}
                      </strong>{" "}
                      <span className="text-sm text-texto-2">· {mundo.tema}</span>
                    </p>
                    <p className="text-sm text-texto/85 lg:text-[0.9375rem]">{mundo.linea}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div data-momento="universo" className="intro-bloque order-5">
        <h2 className={claseTitulo}>{t.cierre.titulo}</h2>
        <p className="mt-4 text-texto-2">{t.cierre.texto}</p>
      </div>

      <div data-momento="autor" className="intro-bloque order-6">
        <h2 className={claseTitulo}>{t.autor.titulo}</h2>
        {t.autor.parrafos(config.autor.firma).map((parrafo) => (
          <p key={parrafo} className="mt-4 text-texto-2">
            {parrafo}
          </p>
        ))}
        {actividad && (
          <p className="mt-4 text-texto-2">
            {t.autor.obra({
              mundos: MUNDOS.length,
              lecciones: es.sitio.aprender.numero,
              cambios: actividad.total,
              desde: fechaLarga(actividad.desde),
            })}
          </p>
        )}
        <p className="mt-4 font-display font-semibold text-texto">{t.autor.firma(config.autor.firma)}</p>
      </div>
    </div>
  );
}
