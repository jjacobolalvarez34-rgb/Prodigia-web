import Pluma from "@/components/marca/Pluma";
import Inicio from "@/components/sitio/secciones/Inicio";
import { es } from "@/contenido/es";

import Anillo2D from "./Anillo2D";
import BotonSaltar from "./BotonSaltar";
import EscenaIntro from "./EscenaIntro";
import TextosIntro from "./TextosIntro";

// La intro (actos 1 a 3): una pista de scroll con un único escenario sticky.
// Todo su texto es HTML real; el canvas, el anillo y la pluma son decoración.
// Termina en #inicio (el ancla del final), donde empieza el sitio.
// Sin esperas (no es async): ver la nota de lib/script-inicial.ts.
export default function Intro() {
  const t = es.intro;

  return (
    <div id="intro" className="intro">
      <BotonSaltar etiqueta={t.saltar} />
      <div className="intro-escenario">
        <div className="intro-capa3d" aria-hidden="true" />
        <canvas className="intro-lienzo" aria-hidden="true" />
        <Anillo2D />
        {/* Explosión del logo (acto 3) y aura que queda detrás del logo. */}
        <div className="intro-aura" aria-hidden="true" />
        <div className="intro-rayos" aria-hidden="true" />
        <div className="intro-destello" aria-hidden="true" />
        <div className="intro-onda" aria-hidden="true" />
        <div className="intro-onda intro-onda-violeta" aria-hidden="true" />
        <div className="intro-onda" aria-hidden="true" />
        <div className="intro-fogonazo" aria-hidden="true" />
        <div className="intro-velo" aria-hidden="true" />
        <TextosIntro />
        <div className="intro-pluma" aria-hidden="true">
          <Pluma className="block h-auto w-full" />
        </div>
        <div className="intro-final order-7">
          <Inicio nivelTitulo={2} conSeguir />
        </div>
        <div className="intro-carga">
          <Pluma variante="trazo" className="h-9 w-auto" />
          <span className="sr-only">{t.cargando3d}</span>
        </div>
      </div>
      <div id="inicio" className="intro-ancla" />
      <EscenaIntro />
    </div>
  );
}
