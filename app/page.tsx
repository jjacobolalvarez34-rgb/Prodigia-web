import Intro from "@/components/intro/Intro";
import Revelador from "@/components/sitio/Revelador";
import Aprender from "@/components/sitio/secciones/Aprender";
import Apoya from "@/components/sitio/secciones/Apoya";
import Colegios from "@/components/sitio/secciones/Colegios";
import ComoSeJuega from "@/components/sitio/secciones/ComoSeJuega";
import Competir from "@/components/sitio/secciones/Competir";
import Desarrollo from "@/components/sitio/secciones/Desarrollo";
import LosMundos from "@/components/sitio/secciones/LosMundos";
import Opiniones from "@/components/sitio/secciones/Opiniones";
import Plataformas from "@/components/sitio/secciones/Plataformas";
import Pro from "@/components/sitio/secciones/Pro";
import Progreso from "@/components/sitio/secciones/Progreso";

// Intro (actos 1-3, termina en #inicio) y el sitio (acto 4) en el orden del
// encargo (DISENO.md §6.3). El sitio funciona entero aunque la intro no se vea.
export default function PaginaInicio() {
  return (
    <>
      <Intro />
      <ComoSeJuega />
      <LosMundos />
      <Aprender />
      <Competir />
      <Progreso />
      <Plataformas />
      <Pro />
      <Colegios />
      <Opiniones />
      <Desarrollo />
      <Apoya />
      <Revelador />
    </>
  );
}
