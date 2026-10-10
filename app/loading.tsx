import Pluma from "@/components/marca/Pluma";
import { es } from "@/contenido/es";

// Carga de marca (DISENO.md §4): la pluma dibujándose sola. Con
// reduced-motion queda quieta (app/globals.css, .pluma-trazo).
export default function Cargando() {
  return (
    <div role="status" className="grid min-h-svh place-items-center">
      <Pluma variante="trazo" className="h-36 w-auto md:h-44" />
      <span className="sr-only">{es.sitio.estados.cargando}</span>
    </div>
  );
}
