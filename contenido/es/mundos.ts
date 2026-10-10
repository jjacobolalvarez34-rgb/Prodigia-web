import type { MundoSlug, MundoTextos, TramoId } from "../tipos";

// Tema y modos: FICHA_PRODIGIA.md §2. Línea corta: CONTENIDO.md §2.
// Naipia se presenta como memoria y cálculo mental (ficha §13): nunca casinos
// ni apuestas.
const textos = {
  numeria: {
    nombre: "Numeria",
    tema: "Cálculo mental",
    linea: "De las cuatro operaciones al álgebra, a tu ritmo.",
    modos: ["Aritmética", "Geometría", "Fracciones", "Decimales y porcentajes", "Potencias y raíces", "Álgebra"],
  },
  enigmia: {
    nombre: "Enigmia",
    tema: "Lógica",
    linea: "Memoria, patrones y acertijos de deducción.",
    modos: ["Memoria", "Patrones", "Deducción", "Pensamiento computacional", "Mezcla"],
  },
  geografia: {
    nombre: "Geografía",
    tema: "Países y mapas",
    linea: "Encuentra cada país en el mapa real, continente por continente.",
    modos: ["América", "Europa", "África", "Asia y Oceanía", "Desde el nivel 8: ciudades, ríos y lugares"],
  },
  quimia: {
    nombre: "Quimia",
    tema: "Química",
    linea: "Elementos, fórmulas, tabla periódica y química orgánica.",
    modos: ["Símbolos y elementos", "Fórmulas y compuestos", "Tabla periódica", "Nomenclatura", "Química orgánica"],
  },
  anatomia: {
    nombre: "Anatomía",
    tema: "Cuerpo humano",
    linea: "Toca el hueso en el esqueleto y recorre el cuerpo por sistemas.",
    modos: ["Sistema óseo", "Sistema muscular", "Órganos", "Sistema nervioso"],
  },
  melodia: {
    nombre: "Melodía",
    tema: "Música",
    linea: "Lee el pentagrama y nombra la nota que suena.",
    modos: ["Fundamentos", "Lectura en pentagrama", "Alteraciones", "Escalas", "Acordes", "Oído absoluto", "Tempo y compás"],
  },
  trigonometria: {
    nombre: "Trigonometría",
    tema: "Ángulos",
    linea: "Razones, círculo unitario, identidades y triángulos.",
    modos: ["Razones básicas", "Círculo unitario", "Identidades", "Leyes de seno y coseno"],
  },
  historia: {
    nombre: "Historia",
    tema: "El pasado",
    linea: "Cronología, personajes y las causas de lo que pasó.",
    modos: ["Cronología", "Personajes", "Causa y efecto", "Fechas exactas"],
  },
  calculia: {
    nombre: "Calculia",
    tema: "Cálculo",
    linea: "Derivadas, integrales, series y ecuaciones diferenciales.",
    modos: ["Derivadas", "Integrales", "Series", "Multivariable y ecuaciones diferenciales"],
  },
  circuitia: {
    nombre: "Circuitia",
    tema: "Electricidad",
    linea: "Cada pregunta dibuja su circuito.",
    modos: ["En serie", "En paralelo", "Mixtos", "Análisis cualitativo"],
  },
  estadistica: {
    nombre: "Estadística",
    tema: "Datos",
    linea: "Promedios, dispersión, probabilidad y gráficos.",
    modos: ["Tendencia central", "Dispersión", "Probabilidad y combinatoria", "Análisis de datos", "Lectura de gráficos"],
  },
  naipia: {
    nombre: "Naipia",
    tema: "Memoria de cartas",
    linea: "Sistemas de conteo como deporte mental de memoria y cálculo.",
    modos: ["Hi-Lo", "KO", "Hi-Opt II", "Omega II", "Conteo verdadero"],
  },
  codia: {
    nombre: "Codia",
    tema: "Programación",
    linea: "Python, Java, JavaScript y TypeScript, con código que se ejecuta de verdad.",
    modos: ["Sintaxis", "Salida del código", "Encuentra el error", "Estructuras y complejidad"],
  },
  dinamia: {
    nombre: "Dinamia",
    tema: "Física",
    linea: "Movimiento, fuerzas, energía, calor y fluidos.",
    modos: ["Cinemática", "Vectores", "Leyes de Newton", "Trabajo y energía", "Termodinámica", "Fluidos"],
  },
  vitalia: {
    nombre: "Vitalia",
    tema: "Biología",
    linea: "De la célula a la ecología, pasando por la genética.",
    modos: ["La célula", "Procesos celulares", "Genética", "Sistemas del cuerpo", "Reinos y clasificación", "Ecología"],
  },
} satisfies Record<MundoSlug, MundoTextos>;

const tramos = {
  numeros: "Números",
  "logica-codigo": "Lógica y código",
  ciencias: "Ciencias",
  vida: "La vida",
  "mundo-cultura": "El mundo y la cultura",
} satisfies Record<TramoId, string>;

export const mundos = { textos, tramos };
