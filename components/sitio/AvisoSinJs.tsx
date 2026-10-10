import { es } from "@/contenido/es";
import { urlDemo, urlSeccion, urlWeb } from "@/lib/url";

import EnlaceExterno from "./EnlaceExterno";

// Aviso para navegadores sin JavaScript (encargo §6). Todo el contenido es HTML
// real, así que se lee igual; aquí van los enlaces esenciales, porque sin JS el
// menú móvil no se abre.
export default function AvisoSinJs() {
  const t = es.sitio;
  const clase = "underline decoration-violeta/60 underline-offset-4 hover:decoration-violeta";

  return (
    <noscript>
      <div className="relative z-30 mt-16 border-b border-borde bg-sup-1 px-4 py-4 text-sm text-texto sm:px-6">
        <p className="mx-auto max-w-7xl">{t.estados.sinJs.texto}</p>
        <ul className="mx-auto mt-2 flex max-w-7xl flex-wrap gap-x-4 gap-y-1 text-texto-2">
          <li>
            <EnlaceExterno href={urlWeb()} className={clase}>
              {t.encabezado.abrirProdigia}
            </EnlaceExterno>
          </li>
          <li>
            <EnlaceExterno href={urlDemo()} className={clase}>
              {t.inicio.probar}
            </EnlaceExterno>
          </li>
          {t.nav.map((n) => (
            <li key={n.id}>
              <a href={urlSeccion(n.id)} className={clase}>
                {n.etiqueta}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </noscript>
  );
}
