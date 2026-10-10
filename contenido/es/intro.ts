// Textos de la intro (actos 1 a 3). CONTENIDO.md §1. Se usan en la Fase 3.

export const intro = {
  // Frase A, elegida por el dueño (PENDIENTES.md §3, respuesta 10).
  frase: {
    antes: "¿Alguna vez soñaste con que aprender fuera ",
    resaltada: "divertido",
    despues: "?",
  },
  deslizar: "Desliza para continuar",

  queEs: {
    titulo: "Prodigia es una app para estudiar jugando.",
    parrafos: [
      "Quince mundos, de la matemática a la música y de la historia a la programación. Partidas cortas que se adaptan a tu nivel, lecciones para aprender desde cero y un lado competitivo con duelos en vivo, rangos, ligas y clanes.",
      "No es una app infantil: es para cualquier persona que quiera aprender o mantenerse ágil.",
    ],
  },
  puente: "Cada mundo es una ciudad que se enciende de noche.",

  cierre: {
    titulo: "Un universo en expansión.",
    // «en el teléfono» = la web en el navegador del móvil (funciona hoy); no se nombra Google Play.
    texto: "Quince ciudades encendidas, con una sola cuenta para recorrerlas en la web y en el teléfono.",
  },

  // Borrador de CONTENIDO.md §1, pendiente de revisión del dueño (PENDIENTES.md §4).
  // Los números salen de datos/actividad.json en el build (Fase 4), no se fijan aquí.
  autor: {
    titulo: "Quién lo hace",
    parrafos: (firma: string, datos: { lecciones: number; mundos: number; cambios: number; desde: string }) => [
      `Prodigia la hace ${firma}, estudiante de matemática pura.`,
      `Es un proyecto de una sola persona con una idea fija: que estudiar se sienta como jugar. Para llevarla del cuaderno a la pantalla, ${firma} programa junto a Claude Code, una inteligencia artificial que le ayuda a escribir, revisar y probar el código.`,
      `Lo que empezó como una idea hoy es un anillo de ${datos.mundos} ciudades y ${datos.lecciones} lecciones, construido a la vista: desde el ${datos.desde} lleva ${datos.cambios} cambios guardados en su código.`,
    ],
  },

  logo: {
    nombre: "Prodigia",
    lema: "Entrena tu cabeza jugando.",
    seguir: "Sigue bajando",
  },

  saltar: "Saltar intro",
  verOtraVez: "Ver la intro otra vez",
};
