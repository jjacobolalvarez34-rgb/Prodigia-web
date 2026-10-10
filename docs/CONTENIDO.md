# Contenido — textos y datos de la página

> Estado: borrador para aprobar. Fecha: 2026-10-10.
> **Fuente de verdad: `FICHA_PRODIGIA.md`.** Si otro documento la contradice, gana la ficha.
> Español neutro con tuteo, **sin voseo** («juegas», «elige», «prueba»). Sin español peninsular.
> `[PENDIENTE: …]` = dato que tiene que dar el dueño del proyecto. No se inventa.

---

## 0. Reglas que no se rompen (ficha §13 + encargo §3)

1. **La Trastienda no aparece en ningún lado.** Tampoco «Monedas», ruleta ni «doble o nada».
2. **Naipia** = memoria y cálculo mental, deporte mental. Nunca casinos, apuestas ni blackjack.
3. **No se promete como disponible** lo apagado o planeado: cobro de Pro, Cometas, anuncios, eventos/temporadas, app en Google Play, prueba gratis de 7 días, +25 % de Chispas.
4. **No es una app infantil.** Se habla a cualquier persona que quiera aprender.
5. **Nada inventado:** ni reseñas, ni nombres, ni cifras de jugadores, ni estrellas.
6. Números con cifras: «10 preguntas», «15 mundos», «630 lecciones». CTA de 3 palabras como máximo.

### Contradicciones detectadas entre fuentes (gana la ficha)

| Tema | Documentos viejos | Ficha (2026-10-10) | Se usa |
|---|---|---|---|
| Cantidad de mundos | 8 (SLOGANS, BRAND) / 13 (brief de Instagram) | **15** | 15 |
| Duración del sprint | «10 preguntas en 60 segundos» (brief) | «10 preguntas contra el reloj» | «contra el reloj» (sin cifra de segundos) |
| Feed social | «desactivado, no publicitar» (VOZ-TONO) | existe | No se destaca; se mencionan amigos, chat y clanes |
| Pro «sin anuncios» | — | listado como beneficio | **No se usa** (confirmado por el dueño): los anuncios están apagados, decirlo insinúa que hoy hay anuncios. |
| Pro «10.000 Chispas al mes» | brief | no aparece | No se usa |
| Logo | brief: «Logo principal@2x.png» es el logo | esos PNG son de **Mamut S.A.S.** | El logo de Prodigia es el de `Logo.tsx` (aro + chispa) |

---

## 1. Intro

### Acto 1 — La frase de la pluma (elegir una)

| | Frase | Apoyo en `SLOGANS.md` |
|---|---|---|
| **A** (la del encargo) | ¿Alguna vez soñaste con que aprender fuera divertido? | — |
| **B** | ¿Y si aprender se sintiera como jugar? | Marca 20 «La práctica que no se siente como práctica», Aprendizaje 1 «Aprende jugando» |
| **C** | Aprender nunca había tenido tan buena jugada. | Marca 26 (textual) |

**Elegida: A** (confirmado por el dueño). B y C quedan como respaldo.
Debajo: **«Desliza para continuar»**.

### Acto 2 — Qué es Prodigia (ficha §1)

> **Prodigia es una app para estudiar jugando.**
> Quince mundos, de la matemática a la música y de la historia a la programación. Partidas cortas que se adaptan a tu nivel, lecciones para aprender desde cero y un lado competitivo con duelos en vivo, rangos, ligas y clanes.
> No es una app infantil: es para cualquier persona que quiera aprender o mantenerse ágil.

Línea puente antes de las ciudades: **«Cada mundo es una ciudad que se enciende de noche.»** (ficha §1, idea fuerza)

### Acto 2 — Los tramos y sus ciudades

Ver §3 (tabla de tramos) y §2 (línea de cada mundo).

### Acto 2 — Cierre del anillo

> **Un universo en expansión.**
> Quince ciudades encendidas, con una sola cuenta para recorrerlas en la web y en el teléfono.

(«en el teléfono» se refiere a la web en el navegador del móvil, que sí funciona hoy; no se nombra Google Play aquí.)

### Acto 2 — Quién lo hace y cómo se construye

Lo que dio el dueño: es **estudiante de matemática pura** y usa **Claude Code** para hacer realidad sus ideas. Firma: **Jacobo** (nombre real, sin apellido); apodos posibles: «Akito» o «Neutrón». La firma vive en `contenido/config.ts` (`autor.firma`) para cambiarla sin tocar componentes.

Borrador (solo con datos verificables; los números salen del repo y de la ficha):

> **Quién lo hace**
> Prodigia la hace **Jacobo**, estudiante de matemática pura.
> Es un proyecto de una sola persona con una idea fija: que estudiar se sienta como jugar. Para llevarla del cuaderno a la pantalla, Jacobo programa junto a **Claude Code**, una inteligencia artificial que le ayuda a escribir, revisar y probar el código.
> Lo que empezó como una idea hoy es un anillo de **15 ciudades** y **630 lecciones**, construido a la vista: desde el 17 de agosto de 2026 lleva **212 cambios** guardados en su código.
> — Jacobo

Notas:
- No se dice cuál fue el primer mundo: los documentos del proyecto no lo confirman.
- «212 cambios» se recalcula en el build desde `datos/actividad.json` (no queda fijo en el texto).
- **No se menciona «Mamut S.A.S.»**: no hay NIT, así que la sociedad no consta como registrada. Decir «S.A.S.» sin estarlo sería inexacto. Si más adelante se registra, se añade en el pie y en Privacidad.

### Acto 3 — Bajo el logo

> **Prodigia**
> Entrena tu cabeza jugando.

(Frase de marca que usa la web, según el brief de Instagram §1, ya en neutro.)

Botón de la esquina: **«Saltar intro»**. En el pie: **«Ver la intro otra vez»**.

---

## 2. Los 15 mundos

Datos de `mobile/src/tema.ts` (color base, neón, glifos) y de la ficha §2 (tema y modos). La «línea» es nueva y está escrita a partir de los modos reales.

| # | Mundo | Tema | Base | Neón | Glifos | Línea corta | Modos (ficha §2) |
|---|---|---|---|---|---|---|---|
| 1 | Numeria | Cálculo mental | `#6C4CF1` | `#9B85FF` | + − × ÷ | De las cuatro operaciones al álgebra, a tu ritmo. | Aritmética, Geometría, Fracciones, Decimales y porcentajes, Potencias y raíces, Álgebra |
| 2 | Enigmia | Lógica | `#0E9F6E` | `#2FD89B` | ? ◆ ▲ | Memoria, patrones y acertijos de deducción. | Memoria, Patrones, Deducción, Pensamiento computacional, Mezcla |
| 3 | Geografía | Países y mapas | `#1E7A8C` | `#3FC1D6` | ◎ ⌖ ✈ | Encuentra cada país en el mapa real, continente por continente. | Por continente (América, Europa, África, Asia y Oceanía); desde nivel 8, ciudades, ríos y lugares |
| 4 | Quimia | Química | `#C026D3` | `#E36BF2` | ⚛ ⬡ H₂O | Elementos, fórmulas, tabla periódica y química orgánica. | Símbolos y elementos, Fórmulas y compuestos, Tabla periódica, Nomenclatura, Química orgánica |
| 5 | Anatomía | Cuerpo humano | `#8B2942` | `#E0607E` | ♥ ✚ | Toca el hueso en el esqueleto y recorre el cuerpo por sistemas. | Sistema óseo, Sistema muscular, Órganos, Sistema nervioso (16 formatos de pregunta) |
| 6 | Melodía | Música | `#B8860B` | `#F2C14E` | ♪ ♫ ♬ | Lee el pentagrama y nombra la nota que suena. | Fundamentos, Lectura en pentagrama, Alteraciones, Escalas, Acordes, Oído absoluto, Tempo y compás |
| 7 | Trigonometría | Ángulos | `#84CC16` | `#A8E84A` | △ θ π | Razones, círculo unitario, identidades y triángulos. | Razones básicas, Círculo unitario, Identidades, Leyes de seno y coseno |
| 8 | Historia | El pasado | `#A0522D` | `#E08A5C` | ⌛ ⚔ ♜ | Cronología, personajes y las causas de lo que pasó. | Cronología, Personajes, Causa y efecto, Fechas exactas |
| 9 | Calculia | Cálculo | `#4338CA` | `#8A83FF` | ∫ ∂ Σ | Derivadas, integrales, series y ecuaciones diferenciales. | Derivadas, Integrales, Series, Multivariable y ecuaciones diferenciales |
| 10 | Circuitia | Electricidad | `#F59E0B` | `#FFC247` | Ω ⏚ ⚡ | Cada pregunta dibuja su circuito. | En serie, en paralelo, mixtos y análisis cualitativo |
| 11 | Estadística | Datos | `#0D9488` | `#2DD4BF` | σ x̄ % | Promedios, dispersión, probabilidad y gráficos. | Tendencia central, Dispersión, Probabilidad y combinatoria, Análisis de datos, Lectura de gráficos |
| 12 | Naipia | Memoria de cartas | `#B91C1C` | `#F25C5C` | ♠ ♥ ♦ ♣ | Sistemas de conteo como deporte mental de memoria y cálculo. | Hi-Lo, KO, Hi-Opt II, Omega II, Conteo verdadero |
| 13 | Codia | Programación | `#06B6D4` | `#4FE0F5` | { } < /> | Python, Java, JavaScript y TypeScript, con código que se ejecuta de verdad. | Sintaxis, Salida del código, Encuentra el error, Estructuras y complejidad |
| 14 | Dinamia | Física | `#2563EB` | `#60A5FA` | ⇀ g ΣF Δt | Movimiento, fuerzas, energía, calor y fluidos. | Cinemática, Vectores, Leyes de Newton, Trabajo y energía, Termodinámica, Fluidos |
| 15 | Vitalia | Biología | `#16A34A` | `#4ADE80` | ✿ ◉ ADN ❦ | De la célula a la ecología, pasando por la genética. | La célula, Procesos celulares, Genética, Sistemas del cuerpo, Reinos y clasificación, Ecología |

Demo de cada mundo: `<URL web>/es/demo/<slug>` (las 15 rutas existen en `calibra/src/app/[locale]/demo/`).

Detalles para «Los mundos» (ficha §2): las fórmulas se ven como en un libro (LaTeX); muchas preguntas traen su dibujo (circuitos, esqueleto, pentagrama, mapas reales, gráficos, cartas, código, diagramas); las preguntas se generan, así que casi nunca se repiten; en Codia las respuestas se comprueban ejecutando el código.

---

## 3. Tramos del anillo (propuesta editorial)

| Tramo | Título en pantalla | Mundos |
|---|---|---|
| 1 | Números | Numeria · Calculia · Trigonometría · Estadística |
| 2 | Lógica y código | Enigmia · Codia · Naipia |
| 3 | Ciencias | Quimia · Dinamia · Circuitia |
| 4 | La vida | Anatomía · Vitalia |
| 5 | El mundo y la cultura | Geografía · Historia · Melodía |

Agrupar evita 15 paradas seguidas (el encargo lo pide). Es una agrupación de esta página, no existe en la app. **Aprobada por el dueño.**

---

## 4. Acto 4 — textos por sección

### Inicio (`#inicio`)
- **Prodigia** · «Entrena tu cabeza jugando.»
- CTA: **«Abrir Prodigia»** → web · **«Prueba sin cuenta»** → `/es/demo/numeria` (o selector de mundo).

### Cómo se juega (ficha §4)
- **Sprint:** 10 preguntas contra el reloj. Al final, un resumen con aciertos, experiencia, nivel del mundo, racha y logros.
- **La dificultad se ajusta sola:** del 1 al 10, sube y baja según cómo te va.
- **Modo Zen:** 10 preguntas sin reloj. Eliges tema y dificultad, con pistas gratis.
- **Retos:** el diario (5 preguntas de tus mundos) y el semanal (45), cada uno con su ranking y su racha.
- Nota: un diagnóstico corto al entrar a cada mundo te ubica en tu nivel.

### Los mundos (ficha §2)
- Título: «15 mundos. Una ciudad para cada uno.»
- Bajada: «Elige dos gratis para siempre. Los demás se desbloquean con Chispas, la moneda que ganas jugando.»
- Tarjetas: ver §2. Botón: **«Probar demo»**.

### Aprender (ficha §3)
- **Técnicas (gratis):** trucos y métodos cortos de cada mundo.
- **Clases:** cursos que enseñan el tema desde cero, en orden, con ejemplos resueltos paso a paso y un mini quiz entre lección y lección. La primera de cada mundo es gratis; el resto es parte de Pro.
- Número protagonista: **630 lecciones**, en español y en inglés.

### Competir y social (ficha §5 y §6)
- **Rankeds:** duelos en vivo contra jugadores reales, con ELO. Series al mejor de 3, en un mundo o en «todas las ciudades». Se abren desde el nivel de cuenta 5.
- **Rangos:** Bronce `#B08D57` · Plata `#B8C4D9` · Oro `#E8B34D` · Platino `#5FBFA8` · Diamante `#5DC8F5` · **Prodigio** `#FFC53D` (nombre en degradado `#A794FF → #FFC53D`).
- **Duelos amistosos y retos a amigos**, que no tocan el ELO. **Liga semanal** y rankings general y por mundo.
- **Clanes:** roles, guerras de clanes, misiones y el Mundo del Clan, una ciudad que crece de Asentamiento a Prodigio.
- **Amigos y chat.**

### Progreso y estilo (ficha §7 y §8)
- **Constelaciones:** cada ciudad tiene en su cielo 7 estrellas; cada partida enciende estrellas, y al completarla se revela su premio.
- **Racha diaria** con meta de experiencia del día.
- **Placa de jugador:** avatar, marco, fondo, título, fuente y animación del nombre.
- **Más de 200 cosméticos:** marcos, fondos, estelas, efectos y sonidos de acierto, emotes.
- **Los títulos se ganan jugando y nunca se compran.** Nada pagado da ventaja en partidas, duelos ni rankings (ficha §11).

### Plataformas (ficha §9)
- **Web:** en cualquier navegador, instalable como aplicación, en español e inglés. Botón **«Abrir Prodigia»**.
- **Android:** insignia **«Próximamente en Google Play»** (sin enlace, sin botón de descarga). Texto: «La app para Android está en camino, con la misma cuenta y el mismo progreso.»

### Pro (ficha §10) — etiqueta «Muy pronto»
- Todos los mundos abiertos mientras dure la suscripción.
- Todas las Clases.
- Estadísticas avanzadas.
- Cosméticos exclusivos.
- Al terminar, lo que conseguiste y tu progreso se quedan.
- **Sin precio como oferta y sin botón de compra.**

### Colegios y docentes (ficha §12)
- «Un panel para docentes: grupos de alumnos y su progreso.» Botón **«Prodigia para colegios»** → `/es/docentes`.

### Opiniones (regla del encargo)
- Estado vacío: **«Sé de los primeros en contarnos qué te parece.»** + «Prueba un mundo sin cuenta y escríbenos.» Botones: demo y contacto (si está configurado).
- Hoy no hay opiniones reales → se usa el estado vacío. Cuando alguien escriba (por Instagram o correo) y dé permiso para publicar su comentario y su nombre o apodo, se agrega en `contenido/es/sitio.ts`.

### El desarrollo
- Título: «Construido a la vista.»
- Skyline con datos reales del repo (212 commits del 17-08-2026 al 10-10-2026 a la fecha de este plan; se recalcula con `npm run actividad`).
- Texto: «Cada edificio es un día de trabajo en el código de Prodigia; su altura, cuántos cambios se guardaron ese día. Jacobo lo construye junto a Claude Code, mundo por mundo.»
- Estadísticas en mono: total de cambios · día más activo · racha más larga de días seguidos.

### Apoya el proyecto (sin donaciones por ahora)
No hay plataforma de donaciones → **no hay botón de donar** (`config.donaciones = null`). La sección se convierte en formas reales de ayudar, sin dinero:
- Título: «Apoya el proyecto.»
- «Prodigia crece con cada persona que lo prueba.»
  - **Juega un mundo** → demo.
  - **Síguenos en Instagram** → @prodigia.app.
  - **Compártelo** con alguien que esté estudiando.
  - **Cuéntanos qué mejorar** → prodigia.oficial@gmail.com.
- Si algún día hay plataforma de donaciones: se pone el enlace en `config.donaciones`, aparece el botón y la aclaración fija «La donación se hace en una plataforma externa. Este sitio no procesa pagos ni guarda datos de tarjetas.»

### Pie
- Redes: **Instagram @prodigia.app** → `https://www.instagram.com/prodigia.app/`.
- Contacto: **prodigia.oficial@gmail.com** (como texto visible + enlace `mailto:`).
- Enlaces: Web de Prodigia · Demo · Colegios · Privacidad · Ver la intro otra vez.
- Firma: «Hecho por Jacobo, con Claude Code.»

---

## 5. Privacidad (borrador)

> Este sitio presenta Prodigia. No tiene cuentas, formularios ni cookies, y no usa herramientas de seguimiento ni analítica de terceros. No recogemos datos personales.
> Los enlaces llevan a la web de Prodigia y a otras plataformas (redes, donaciones), que tienen sus propias políticas.
> Responsable del sitio: Jacobo, creador de Prodigia. Contacto: prodigia.oficial@gmail.com.

(`REVISION_ANTES_DE_PLAY_STORE.md` recuerda que la Ley 1581 de 2012 de Colombia pide identificar al responsable y un canal de contacto. Este sitio no recoge datos personales, así que basta con quién responde y el correo. Cuando exista la empresa registrada, se añaden su razón social y su NIT; un domicilio no hace falta para este sitio.)

---

## 6. Valores de `contenido/config.ts`

```ts
export const config = {
  webProdigia: "https://prodigia-sandy.vercel.app", // demos: /es/demo/<mundo>, docentes: /es/docentes
  redes: {
    instagram: "https://www.instagram.com/prodigia.app/", // @prodigia.app
    tiktok: null, youtube: null, x: null, facebook: null,  // null = no se muestra
  },
  donaciones: null,                      // sin plataforma: no hay botón de donar
  contacto: { correo: "prodigia.oficial@gmail.com" },
  autor: { firma: "Jacobo", apodos: ["Akito", "Neutrón"] }, // cambiar firma aquí
  googlePlay: null,                      // «Próximamente», sin enlace
} as const;
```

## 7. SEO

- Título: «Prodigia — Estudia jugando en 15 mundos»
- Descripción: «Prodigia es una app para estudiar jugando: 15 mundos, partidas cortas que se adaptan a tu nivel, lecciones desde cero y duelos con rangos. Pruébala sin cuenta.»
- Imagen social: logo real sobre fondo `#090C14` con el anillo y estrellas, 1200×630.
