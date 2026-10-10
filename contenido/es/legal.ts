// Aviso de privacidad (CONTENIDO.md §5). Este sitio no recoge datos
// personales; basta con identificar a quien responde y un canal de contacto.
// Cuando exista la empresa registrada, se añaden su razón social y su NIT.

export const legal = {
  privacidad: {
    titulo: "Privacidad",
    actualizado: "Última actualización: 10 de octubre de 2026.",
    secciones: [
      {
        titulo: "Qué datos recoge este sitio",
        parrafos: [
          "Este sitio presenta Prodigia. No tiene cuentas, formularios ni cookies, y no usa herramientas de seguimiento ni analítica de terceros. No recogemos datos personales.",
          "Solo guarda en tu navegador, durante la sesión, si ya viste la intro, para no repetírtela. Ese dato no sale de tu navegador y se borra al cerrar la pestaña.",
        ],
      },
      {
        titulo: "Enlaces a otros sitios",
        parrafos: [
          "Los enlaces llevan a la web de Prodigia y a otras plataformas, como Instagram, que tienen sus propias políticas.",
        ],
      },
    ],
    privacidadWeb: "Aviso de privacidad de la web de Prodigia",
    responsable: {
      titulo: "Responsable",
      texto: (firma: string) => `Responsable del sitio: ${firma}, creador de Prodigia.`,
      contacto: "Contacto:",
    },
  },
};
