import type { RangoSlug, SeccionId } from "../tipos";

// Textos del sitio (acto 4), encabezado, menú, pie y estados.
// CONTENIDO.md §4 y §7; DISENO.md §6 y §7. Todo sale de FICHA_PRODIGIA.md:
// nada de cifras de jugadores, reseñas ni funciones apagadas o planeadas.

const nav: readonly { id: SeccionId; etiqueta: string }[] = [
  { id: "como-se-juega", etiqueta: "Cómo se juega" },
  { id: "mundos", etiqueta: "Mundos" },
  { id: "aprender", etiqueta: "Aprender" },
  { id: "competir", etiqueta: "Competir" },
  { id: "pro", etiqueta: "Pro" },
  { id: "colegios", etiqueta: "Colegios" },
  { id: "apoya", etiqueta: "Apoya" },
];

const rangos = {
  bronce: "Bronce",
  plata: "Plata",
  oro: "Oro",
  platino: "Platino",
  diamante: "Diamante",
  prodigio: "Prodigio",
} satisfies Record<RangoSlug, string>;

// Opiniones reales con permiso de quien las escribió (encargo §2). Hoy no hay
// ninguna (PENDIENTES.md §3): la sección muestra su estado vacío.
const opiniones: readonly { texto: string; autor: string }[] = [];

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

  comoSeJuega: {
    etiqueta: "Cómo se juega",
    titulo: "Partidas cortas que se adaptan a ti.",
    sprint: {
      titulo: "Sprint",
      numero: "10",
      unidad: "preguntas",
      texto: "10 preguntas contra el reloj. Al final, un resumen con aciertos, experiencia, nivel del mundo, racha y logros.",
    },
    dificultad: {
      titulo: "La dificultad se ajusta sola",
      texto: "Del 1 al 10, sube y baja según cómo te va.",
      escala: "Escala de dificultad del 1 al 10",
    },
    zen: {
      titulo: "Modo Zen",
      marca: "sin reloj",
      texto: "10 preguntas sin reloj. Eliges tema y dificultad, con pistas gratis.",
    },
    retos: {
      titulo: "Retos",
      texto: "El diario mezcla preguntas de tus mundos; el semanal es más largo. Cada uno con su ranking y su racha.",
      diario: { numero: "5", etiqueta: "el diario" },
      semanal: { numero: "45", etiqueta: "el semanal" },
    },
    nota: "Un diagnóstico corto al entrar a cada mundo te ubica en tu nivel.",
  },

  mundos: {
    etiqueta: "Los mundos",
    titulo: "15 mundos. Una ciudad para cada uno.",
    bajada: "Elige dos gratis para siempre. Los demás se desbloquean con Chispas, la moneda que ganas jugando.",
    filtro: {
      etiqueta: "Filtrar mundos por tramo",
      todos: "Todos",
      mostrando: (n: number) => (n === 1 ? "Mostrando 1 mundo" : `Mostrando ${n} mundos`),
    },
    tarjeta: {
      modos: (n: number) => `Ver sus ${n} modos`,
      probar: "Probar demo",
      probarDe: (nombre: string) => `Probar la demo de ${nombre} sin cuenta`,
    },
    detalles: {
      titulo: "Lo que se nota al jugar",
      lista: [
        "Las fórmulas se ven como en un libro.",
        "Muchas preguntas traen su dibujo: circuitos, esqueleto, pentagrama, mapas reales, gráficos, cartas, código y diagramas.",
        "Las preguntas se generan, así que casi nunca se repiten.",
        "En Codia, las respuestas se comprueban ejecutando el código de verdad.",
      ],
    },
  },

  aprender: {
    etiqueta: "Aprender",
    titulo: "Aprende desde cero. Practica jugando.",
    numero: "630",
    unidad: "lecciones",
    idiomas: "en español y en inglés",
    tecnicas: {
      titulo: "Técnicas",
      insignia: "Gratis",
      texto: "Trucos y métodos cortos de cada mundo.",
    },
    clases: {
      titulo: "Clases",
      insignia: "La primera de cada mundo, gratis",
      texto:
        "Cursos que enseñan el tema desde cero, en orden, con ejemplos resueltos paso a paso y un mini quiz entre lección y lección. El resto de las Clases es parte de Pro.",
    },
  },

  competir: {
    etiqueta: "Competir y social",
    titulo: "Duelos en vivo contra personas reales.",
    rankeds: {
      titulo: "Rankeds",
      texto:
        "Duelos en vivo con ELO, en series al mejor de 3, en un mundo o en «todas las ciudades». Durante el duelo ves cómo va tu rival. Se abren desde el nivel de cuenta 5.",
    },
    rangosTitulo: "Seis rangos según tu ELO",
    eloDesde: (elo: number) => `desde ${elo}`,
    rangos,
    lista: [
      { titulo: "Duelos amistosos", texto: "Retos a tus amigos que no tocan tu ELO." },
      { titulo: "Liga semanal y rankings", texto: "Un ranking general y uno por cada mundo." },
      {
        titulo: "Clanes",
        texto: "Roles, guerras de clanes, misiones y el Mundo del Clan: una ciudad que crece de Asentamiento a Prodigio.",
      },
      { titulo: "Amigos y chat", texto: "Busca amigos, mira quién está en línea y escríbele por chat privado." },
    ],
  },

  progreso: {
    etiqueta: "Progreso y estilo",
    titulo: "Cada partida enciende algo.",
    constelacion: {
      titulo: "Constelaciones",
      texto: "Cada ciudad tiene en su cielo una constelación de 7 estrellas. Cada partida enciende estrellas y, al completarla, se revela su premio.",
      dibujo: "Constelación de 7 estrellas",
    },
    racha: {
      titulo: "Racha diaria",
      texto: "Juega cada día y cumple la meta de experiencia del día para mantenerla.",
    },
    placa: {
      titulo: "Tu placa de jugador",
      texto: "Avatar, marco, fondo, título, fuente y animación del nombre, y tu ciudad favorita.",
      ejemplo: "Ejemplo",
      nombre: "Tu nombre",
      tituloJugador: "Tu título",
    },
    cosmeticos: {
      antes: "Más de",
      numero: "200",
      texto: "cosméticos: marcos, fondos, estelas, efectos y sonidos de acierto, y emotes para los duelos.",
    },
    justo: "Los títulos se ganan jugando y nunca se compran. Nada pagado da ventaja en partidas, duelos ni rankings.",
  },

  plataformas: {
    etiqueta: "Plataformas",
    titulo: "Una cuenta. El mismo progreso.",
    web: {
      titulo: "Web",
      texto: "En cualquier navegador, instalable como aplicación, en español y en inglés.",
      boton: "Abrir Prodigia",
    },
    android: {
      titulo: "Android",
      insignia: "Próximamente en Google Play",
      texto: "La app para Android está en camino, con la misma cuenta y el mismo progreso.",
    },
  },

  pro: {
    etiqueta: "Prodigia Pro",
    insignia: "Muy pronto",
    titulo: "Pro llega muy pronto.",
    bajada: "Esto es lo que incluye:",
    lista: [
      "Todos los mundos abiertos mientras dure la suscripción.",
      "Todas las Clases.",
      "Estadísticas avanzadas.",
      "Cosméticos exclusivos.",
      "Al terminar, lo que conseguiste y tu progreso se quedan.",
    ],
  },

  colegios: {
    etiqueta: "Colegios y docentes",
    titulo: "Un panel para docentes.",
    texto: "Grupos de alumnos y su progreso, en un panel para profesores. El plan para colegios es un producto aparte del público general.",
    boton: "Prodigia para colegios",
  },

  opiniones: {
    etiqueta: "Opiniones",
    titulo: "Lo que cuentan quienes ya juegan.",
    lista: opiniones,
    vacio: {
      titulo: "Sé de los primeros en contarnos qué te parece.",
      texto: "Prueba un mundo sin cuenta y escríbenos.",
      probar: "Prueba sin cuenta",
      escribir: "Escríbenos",
    },
  },

  desarrollo: {
    etiqueta: "El desarrollo",
    titulo: "Construido a la vista.",
    texto: (firma: string) =>
      `Cada edificio es un día de trabajo en el código de Prodigia; su altura, cuántos cambios se guardaron ese día. ${firma} lo construye junto a Claude Code, mundo por mundo.`,
    vacio: "El registro de actividad se publicará pronto.",
    estadisticas: {
      total: "cambios guardados",
      diaMasActivo: (fecha: string) => `cambios el ${fecha}, el día más activo`,
      racha: "días seguidos, la racha más larga",
      rango: (desde: string, hasta: string) => `Del ${desde} al ${hasta}.`,
    },
  },

  apoya: {
    etiqueta: "Apoya",
    titulo: "Apoya el proyecto.",
    bajada: "Prodigia crece con cada persona que la prueba.",
    jugar: { titulo: "Juega un mundo", texto: "Prueba una demo sin crear cuenta." },
    seguir: { titulo: "Síguenos en Instagram" },
    compartir: {
      titulo: "Compártelo",
      texto: "Con alguien que esté estudiando.",
      copiado: "Enlace copiado",
      mensaje: "Prodigia: estudia jugando en 15 mundos.",
    },
    escribir: { titulo: "Cuéntanos qué mejorar" },
    donar: {
      boton: "Donar",
      aclaracion: "La donación se hace en una plataforma externa. Este sitio no procesa pagos ni guarda datos de tarjetas.",
    },
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
