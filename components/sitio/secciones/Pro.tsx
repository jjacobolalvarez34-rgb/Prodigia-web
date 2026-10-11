import { IconoCheck } from "@/components/sitio/iconos";
import { es } from "@/contenido/es";

import { claseInsignia } from "./estilos";
import Seccion from "./Seccion";

// Pro (ficha §10): qué incluye, con «Muy pronto». Sin precio ni botón de
// compra: el cobro todavía no está encendido.
export default function Pro() {
  const t = es.sitio.pro;
  const insignia = <span className={`${claseInsignia} border-oro/50 text-oro`}>{t.insignia}</span>;

  return (
    <Seccion id="pro" etiqueta={t.etiqueta} titulo={t.titulo} lado="der" junto={insignia}>
      <div
        data-revelar
        className="rounded-bloque bg-[linear-gradient(120deg,var(--color-violeta),var(--color-oro-claro))] p-px"
      >
        <div className="rounded-[27px] bg-sup-1 p-6 sm:p-8">
          <p className="text-texto-2">{t.bajada}</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {t.lista.map((item) => (
              <li key={item} className="flex gap-3">
                <IconoCheck className="mt-0.5 size-5 shrink-0 text-oro" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Seccion>
  );
}
