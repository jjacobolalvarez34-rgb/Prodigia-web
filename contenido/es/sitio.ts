import type { SeccionId } from "../tipos";

// Textos del sitio (acto 4), encabezado, menú, pie y estados.
// CONTENIDO.md §4 y §7; DISENO.md §6 y §7. Los textos de cada sección del
// acto 4 se suman en la Fase 2.

const nav: readonly { id: SeccionId; etiqueta: string }[] = [
  { id: "como-se-juega", etiqueta: "Cómo se juega" },
  { id: "mundos", etiqueta: "Mundos" },
  { id: "aprender", etiqueta: "Aprender" },
  { id: "competir", etiqueta: "Competir" },
  { id: "pro", etiqueta: "Pro" },
  { id: "colegios", etiqueta: "Colegios" },
  { id: "apoya", etiqueta: "Apoya" },
];

export const sitio = {
  meta: {
    titulo: "Prodigia — Estudia jugando en 15 mundos",
    plantillaTitulo: "%s · Prodigia",
    descripcion:
      "Prodigia es una app para estudiar jugando: 15 mundos, partidas cortas que se adaptan a tu nivel, lecciones desde cero y duelos con rangos. Pruébala sin cuenta.",
  },

  accesibilidad: {
    irAlContenido: "Ir al contenido",
    pestanaNueva: "(se abre en una pestaña nueva)",
    navPrincipal: "Secciones",
    irAlInicio: "Prodigia, ir al inicio",
  },

  nav,

  encabezado: {
    abrirProdigia: "Abrir Prodigia",
  },

  menu: {
    abrir: "Abrir menú",
    cerrar: "Cerrar menú",
    titulo: "Menú",
  },

  inicio: {
    nombre: "Prodigia",
    lema: "Entrena tu cabeza jugando.",
    abrir: "Abrir Prodigia",
    probar: "Prueba sin cuenta",
  },

  pie: {
    lema: "Entrena tu cabeza jugando.",
    tituloEnlaces: "Enlaces",
    web: "Web de Prodigia",
    demo: "Prueba sin cuenta",
    colegios: "Colegios y docentes",
    privacidad: "Privacidad",
    tituloContacto: "Contacto",
    instagram: "Instagram",
    correo: "Correo",
    verIntro: "Ver la intro otra vez",
    firma: (firma: string) => `Hecho por ${firma}, con Claude Code.`,
  },

  estados: {
    noEncontrada: {
      titulo: "Esta página no existe",
      texto: "La chispa se escapó del anillo y no encontró esta dirección.",
      volver: "Volver al inicio",
    },
    error: {
      titulo: "Algo salió mal",
      texto: "No pudimos mostrar esta parte del sitio. Puedes intentarlo de nuevo.",
      reintentar: "Reintentar",
      volver: "Volver al inicio",
    },
    cargando: "Cargando",
    sinJs: {
      texto: "Estás viendo Prodigia sin JavaScript. Todo el contenido se puede leer; solo la intro animada lo necesita.",
    },
  },
};
