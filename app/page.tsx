import Revelador from "@/components/sitio/Revelador";
import Aprender from "@/components/sitio/secciones/Aprender";
import Apoya from "@/components/sitio/secciones/Apoya";
import Colegios from "@/components/sitio/secciones/Colegios";
import ComoSeJuega from "@/components/sitio/secciones/ComoSeJuega";
import Competir from "@/components/sitio/secciones/Competir";
import Desarrollo from "@/components/sitio/secciones/Desarrollo";
import Inicio from "@/components/sitio/secciones/Inicio";
import LosMundos from "@/components/sitio/secciones/LosMundos";
import Opiniones from "@/components/sitio/secciones/Opiniones";
import Plataformas from "@/components/sitio/secciones/Plataformas";
import Pro from "@/components/sitio/secciones/Pro";
import Progreso from "@/components/sitio/secciones/Progreso";

// Acto 4: el sitio, en el orden del encargo (DISENO.md §6.3). Funciona entero
// sin la intro; la intro (actos 1-3) se monta arriba en la Fase 3.
export default function PaginaInicio() {
  return (
    <>
      <Inicio />
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
