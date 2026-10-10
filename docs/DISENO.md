# Diseño — Página de presentación de Prodigia

> Estado: plan. Fecha: 2026-10-10.
> Marca: `calibra/docs/marketing/BRAND.md`, `VOZ-TONO.md`, `mobile/src/tema.ts` («Noche de Prodigia»).
> Guía de UI consultada: skill `ui-ux-pro-max` (patrón «Immersive/Interactive Experience»: salto visible, caídas sin 3D y sin movimiento, estado final preservado). Sus colores y fuentes genéricos **no** se usan: manda la marca real.

**Regla de oro (BRAND.md):** si no parece Prodigia, no es Prodigia. Nada de estética «startup SaaS», fotos de stock, glassmorphism excesivo ni gradientes genéricos.

**Regla de este sitio: un foco a la vez.** En cada momento de la intro hay **una** cosa en movimiento protagonista y **un** bloque de texto. Las partículas acompañan, nunca compiten.

---

## 1. Tokens

### 1.1 Color (modo noche; el sitio es solo oscuro)

| Token | Valor | Uso |
|---|---|---|
| `--fondo` | `#090C14` | Fondo general |
| `--fondo-hondo` | `#05070D` | Viñeta y profundidad del espacio |
| `--sup-1` / `--sup-2` / `--sup-3` | `#12172A` / `#171D34` / `#1E2542` | Tarjetas, menú, pie |
| `--borde` | `#232B47` | Bordes de 1px |
| `--texto` | `#F4F6FB` | Texto principal |
| `--texto-2` | `#8892B0` | Texto secundario, botón Saltar |
| `--violeta` | `#7C5CFF` (neón `#9B85FF`, base `#6C4CF1`) | Primario, aro del logo |
| `--oro` | `#FFB627` (claro `#FFC53D`, labio `#B87800`) | Pluma, logros, resaltes |
| `--acierto` | `#3DDC97` | Detalles puntuales |
| `--racha` | `#FF8A3D` | Sección de rachas |
| Degradado de chispa | `#A794FF → #E4CBA0 → #FFC53D` | Solo la chispa/pluma del logo (la parada crema evita el rosa apagado) |
| Degradado de marca | `linear-gradient(120deg, #7C5CFF, #FFC53D)` | CTA principal, una vez por pantalla |

Colores de mundo: base y neón de `mobile/src/tema.ts` (ver `CONTENIDO.md §2`). **Un solo color de mundo protagonista por bloque.**

Contraste: todo texto sobre `#090C14`/`#12172A` cumple 4.5:1 (`#8892B0` sobre `#090C14` ≈ 6:1). Los colores base de mundo oscuros (`#8B2942`, `#A0522D`, `#4338CA`) **no** se usan como color de texto: para texto se usa su versión neón.

### 1.2 Tipografía

| Rol | Fuente | Detalle |
|---|---|---|
| Títulos, CTA, frase de la pluma | **Space Grotesk** 600/700 | `tracking-tight`, `text-wrap: balance` |
| Cuerpo | **Inter** 400/500 | 16–18px, interlineado 1.6, máx. 65ch |
| Números (10, 15, 630, ELO) | **JetBrains Mono** 500/700 | Un número protagonista por bloque |

Escala (fluida con `clamp`): display 40→88px · h2 30→56px · h3 20→28px · cuerpo 16→18px · pequeño 13–14px. Nunca texto de cuerpo < 14px; el botón Saltar usa 13px (es una etiqueta, no lectura).

### 1.3 Forma y movimiento

- Radios: chip 12px · botón 16px (`rounded-full` en píldoras) · tarjeta 20px · bloque grande 28px.
- Duraciones de UI: 150–300ms; salida más rápida que la entrada. Curvas: `power2.out` (entrar), `power2.in` (salir), `expo.out` (destello).
- Todo lo que dependa del scroll usa `scrub: 0.8` (atado al scroll, sin saltos).
- Solo se animan `transform` y `opacity` (y `stroke-dashoffset` en SVG).

---

## 2. La intro: pista de scroll y reparto en pantalla

La intro es una pista alta con un escenario sticky (ver `ARQUITECTURA.md §5`). Altura: **900svh** en escritorio, **760svh** en móvil (menos scroll con el pulgar). El progreso 0→1 se reparte así:

| Progreso | Acto · momento | Foco en movimiento | Texto en pantalla |
|---|---|---|---|
| (por tiempo, al cargar) | **1 · La pluma escribe** | Pluma escribiendo | La frase + «Desliza para continuar» |
| 0.00 – 0.07 | 1 → 2 · La pluma levanta vuelo | Pluma saliendo hacia arriba y en diagonal | La frase se desvanece |
| 0.07 – 0.15 | 2 · Arranca el anillo | Primer tramo del aro | **Qué es Prodigia** |
| 0.15 – 0.63 | 2 · Cinco tramos de ciudades | Cada ciudad se enciende al paso de la pluma | Nombre del tramo + sus 2–4 mundos |
| 0.63 – 0.72 | 2 · Anillo completo | La cámara se aleja; el anillo gira lento | **«Un universo en expansión»** |
| 0.72 – 0.81 | 2 · Quién lo hace | El anillo queda de fondo, atenuado al 40 % | Texto del autor (pendiente) |
| 0.81 – 0.93 | 3 · El logo | La pluma se posa en la apertura y se encoge en la chispa; el anillo se aplana al aro del logo | — |
| 0.93 – 1.00 | 3 · Destello | Destello y onda; queda el logo al centro | Lema corto bajo el logo + «Sigue bajando» |
| **1.00 = `#inicio`** | 4 · Empieza el sitio | Logo quieto al centro | Encabezado aparece |

### 2.1 Acto 1 — La pluma

- Fondo `#090C14` con estrellas sutiles (§5) y dos nebulosas violeta muy tenues (radial `#7C5CFF` al 8–10 % de opacidad, desenfocadas, quietas).
- La pluma (`docs/propuestas/pluma.svg`, pendiente de aprobación) aparece al centro con un leve balanceo (±3°, 4s, `sine.inOut`).
- **La frase se escribe por tiempo** (no por scroll) al cargar: la pluma recorre la línea de base y la frase se revela con una máscara que avanza con su punta. De la punta salen gotas de tinta dorada (§5). Duración total ≈ 3.2s (≈ 60ms por carácter, con pausa de 200ms en la coma/salto).
- La frase va en Space Grotesk 600, display, color `--texto`, con la palabra **«divertido»** en el degradado de chispa. Centrada, máx. 18ch por línea (2 líneas en escritorio, 3 en móvil).
- «Desliza para continuar»: 13px, `--texto-2`, con una flecha que baja suavemente (1.6s). Aparece al terminar la frase.
- Accesibilidad: la frase es un `<h1>` real desde el principio; la máscara es solo visual.

**Reparto:** frase en el tercio central; pluma a la derecha de la última letra escrita; «Desliza» a 10svh del borde inferior; botón Saltar abajo a la derecha. Nada más.

### 2.2 Acto 2 — El anillo

**Forma.** No es un círculo plano ni una esfera: es un **mundo-anillo con volumen** (estilo Halo): una banda ancha con cara interior (donde están las ciudades), cara exterior y dos paredes laterales, vista en perspectiva inclinada (~62°). El anillo **deja la apertura del logo** (≈ 93° sin trazar, igual que el `dasharray 158.6 / 55` de `Logo.tsx`), porque al final se convierte en el aro del logo.

**Cámara.** Empieza lejos y alta, viendo el anillo de canto. Mientras se traza, la cámara sigue a la pluma desde atrás y arriba, a una distancia fija, con un leve balanceo. En «universo en expansión» se aleja hasta ver el anillo entero. Se mueve por una curva suave (Catmull-Rom); nunca gira más de 25° por cada 100svh de scroll (evita mareo).

**Reparto en escritorio (≥1024px):**
```
┌───────────────────────────────────────────────┐
│ [columna de texto 36ch]      [anillo + pluma] │
│  izquierda, centrada          ocupa ~60 % a   │
│  verticalmente                la derecha      │
│                                               │
│                                 [Saltar intro]│
└───────────────────────────────────────────────┘
```
**Reparto en móvil (<768px):** anillo en el 55 % superior; texto en una tarjeta en el 40 % inferior sobre un velo (`#090C14` → transparente) para que nunca se lea sobre las ciudades. Etiquetas de ciudad: solo un punto de color sobre el anillo; el nombre va en la tarjeta.

**Los 15 mundos en 5 tramos** (propuesta editorial; ver `CONTENIDO.md §3`):

| Tramo | Mundos |
|---|---|
| Números | Numeria · Calculia · Trigonometría · Estadística |
| Lógica y código | Enigmia · Codia · Naipia |
| Ciencias | Quimia · Dinamia · Circuitia |
| La vida | Anatomía · Vitalia |
| El mundo y la cultura | Geografía · Historia · Melodía |

En cada tramo:
1. Aparece el **nombre del tramo** (h3, `--texto-2`, mayúsculas espaciadas pequeñas).
2. La pluma pasa por cada ciudad: la ciudad **se enciende** (ventanas de neón de su color que se prenden en cascada, 600ms) y su etiqueta entra en la lista: glifo + **nombre** (en su neón) + tema + una línea.
3. Las etiquetas del tramo anterior salen antes de que entren las nuevas. **Máximo 4 etiquetas en pantalla.** Las ciudades ya encendidas quedan encendidas en el anillo, pero bajan a 60 % de brillo para no competir.

### 2.3 Acto 3 — El logo

1. La pluma vuela hasta la apertura del anillo, gira y **se encoge hasta ser el brazo largo de la chispa**; aparecen los otros tres brazos (corto, y las dos protuberancias).
2. La cámara se coloca de frente: el anillo con volumen se aplana en el aro plano del logo (mismo violeta `#6C4CF1`, la apertura queda donde está la chispa).
3. **Destello:** pulso de luz desde la chispa (blanco cálido → oro), onda circular que se expande y se desvanece (600ms), estallido de partículas (§5). Las ciudades del anillo se apagan una a una en sentido contrario al trazado (como si su luz fuera absorbida por el logo).
4. Queda el **logo al centro**, a 160px (escritorio) / 112px (móvil), con el nombre **Prodigia** debajo y un lema corto. Ese punto es `#inicio`.

### 2.4 Caídas

- **Ligero (2D):** misma coreografía con SVG: el anillo es una elipse con dos trazos (borde interior y exterior) y relleno de banda; se dibuja con `stroke-dashoffset`; ciudades = puntos con halo de su color; estrellas en canvas 2D. Sin cámara (solo una leve escala del grupo).
- **Quieto (reduced-motion):** la pista sticky desaparece. Cada momento es un bloque normal de altura natural que aparece con fundido de 300ms. Se muestra el anillo 2D ya completo, con las 15 ciudades encendidas, y el logo en su estado final. Sin destello, sin estrellas en movimiento.

---

## 3. Botón «Saltar intro» (pedido del usuario)

- **Dónde:** esquina **inferior derecha**, fijo (`bottom: max(16px, env(safe-area-inset-bottom))`, `right: 16px`).
- **Aspecto:** pequeño y gris, discreto: 13px, `--texto-2` al 80 %, fondo `#12172A` al 60 %, borde 1px `--borde`, `rounded-full`, padding 6×12px. Texto: «Saltar intro» + flecha `→` en SVG. Hover/foco: texto `--texto`, borde `--violeta` al 50 %; anillo de foco visible.
- **Área táctil:** aunque se ve pequeño, su área de toque es de al menos 44×44px (pseudo-elemento invisible).
- **Desde el segundo 0:** viene en el HTML del servidor. Sin JavaScript es un enlace normal `href="#inicio"` y funciona igual.
- **Qué hace:** salta **directo al momento final** (logo quieto al centro, destello ya terminado) y al sitio: coloca el scroll en `#inicio` sin animación, deja todas las líneas de tiempo en su estado final, marca `prodigia:intro-vista` en `sessionStorage` y mueve el foco al logo/encabezado para teclado y lectores de pantalla.
- **Cuándo desaparece:** al llegar a `#inicio` (por scroll o por el botón) se desvanece en 200ms. Si la persona vuelve a subir a la intro, reaparece.
- **Volver a verla:** en el pie, un enlace pequeño «Ver la intro otra vez» borra la marca de sesión y sube al principio.
- **Ya vista en la sesión:** al recargar, la página arranca en `#inicio` (antes del primer pintado, sin parpadeo). La intro sigue arriba por si se quiere subir.

---

## 4. Carga de marca

- **Pantalla de carga** (`app/loading.tsx` y mientras llega el chunk 3D): la pluma dibujándose sola sobre `#090C14` (trazo del contorno con `stroke-dashoffset`, 1.4s en bucle), sin texto salvo «Cargando» para lectores de pantalla. Con reduced-motion: pluma quieta.
- No bloquea: el HTML de la intro ya está y es legible; la carga solo cubre el lienzo mientras llega el 3D.

---

## 5. Partículas: presupuesto «sin saturación»

Regla: **las partículas nunca tapan texto** (máscara de exclusión sobre la columna de texto: opacidad × 0.3 en esa zona) y **nunca hay más de dos sistemas activos a la vez.**

| Sistema | Cuándo | Escritorio | Móvil | Detalle |
|---|---|---|---|---|
| Estrellas lejanas | Toda la intro | 900 | 400 | Puntos 1–2px, blancos/lila, titileo lento (3–7s) desfasado; 2 capas con paralaje leve. |
| Tinta dorada | Acto 1 y mientras la pluma traza | máx. 120 vivas | máx. 60 | Nacen en la punta, vida 0.6–1s, caen y se apagan; aditivas, oro → transparente. |
| Polvo del anillo | Acto 2 | 400 | 180 | Puntos que quedan flotando sobre el tramo recién trazado y se asientan; violeta al 30 %. |
| Ventanas de ciudad | Acto 2 | 15 ciudades × ~14 edificios (instanciado) | igual, menos ventanas | No son partículas libres: son ventanas que se prenden y apagan despacio (idea fuerza de la ficha). |
| Destello del logo | Acto 3 (una sola vez) | 260 | 120 | Estallido radial, vida 0.9s, oro → violeta; onda circular. |
| Fondo del acto 4 | Sitio | 0 en movimiento | 0 | Estrellas fijas en CSS (gradientes radiales); nada se mueve mientras se lee. |

En modo ligero: estrellas en canvas 2D (máx. 250), tinta con 40 partículas en canvas, destello con 80. En modo quieto: estrellas fijas, sin partículas.

---

## 6. Acto 4 — El sitio

### 6.1 Encabezado y menú

- **Encabezado fijo**, aparece al llegar a `#inicio` (desliza desde arriba, 250ms). Fondo `#090C14` al 80 % con desenfoque leve solo al hacer scroll. Altura 64px.
- Izquierda: logo pequeño + «Prodigia». Centro (≥1024px): enlaces a secciones (Cómo se juega, Mundos, Aprender, Competir, Pro, Colegios, Apoya). Derecha: botón **«Abrir Prodigia»** (degradado de marca) a la web real.
- **Menú móvil a pantalla completa** (reescritura de *sterling-gate kinetic navigation*; detalle en `docs/web-presentacion/referencias/README.md §2`): botón hamburguesa con `aria-expanded` y `aria-controls`; al abrir, el panel `#090C14` se revela desde el botón (clip-path circular, ~600ms) y los enlaces entran escalonados en Space Grotesk grande (GSAP, 40ms entre ítems); efecto **onda** violeta→dorada al pasar cursor o foco por un enlace (solo con puntero fino). `role="dialog"` + `aria-modal`, **trampa de foco**, `inert` en el resto de la página, cierre con **Escape**, con el botón y al elegir un enlace; el scroll de fondo se bloquea solo mientras está abierto; el foco vuelve al botón al cerrar. Estilos 100 % Tailwind. Con reduced-motion: aparece con fundido, sin onda.

### 6.2 Logo viajero (≥1024px)

- Al terminar la intro, el logo del centro se convierte en el **logo viajero**: un logo de 96px fijo que se mueve de lado según la sección (`data-logo="izq" | "der"`), con una transición de 700ms (`power3.inOut`) y un leve giro del aro.
- Las secciones se maquetan en una rejilla de 12 columnas con el contenido en 8 columnas del lado **opuesto** al logo, así el logo nunca tapa contenido.
- Cada sección puede teñir el aro con su color (como `colorAro` en `Logo.tsx`): violeta por defecto, el color del mundo destacado en «Los mundos», mandarina en «Progreso y estilo».
- En móvil y tablet **no viaja**: se queda en el encabezado (evita tapar contenido en pantallas chicas). Con reduced-motion: cambia de lado con fundido.

### 6.3 Secciones (orden del encargo)

| # | Sección | Lado del logo | Diseño |
|---|---|---|---|
| 1 | **Inicio** (`#inicio`) | centro | Logo + «Prodigia» + frase de marca + 2 CTA: «Abrir Prodigia» (web) y «Prueba sin cuenta» (demo). |
| 2 | **Cómo se juega** | der | 4 tarjetas: Sprint (número protagonista **10**), dificultad que se ajusta sola (escala 1→10 animada), Modo Zen (sin reloj), Retos (**5** diario / **45** semanal). |
| 3 | **Los mundos** | izq → oculto | Rejilla explorable de 15 tarjetas (3×5 escritorio, 2 col tablet, 1 col móvil con desplazamiento normal). Tarjeta: degradado 120° del color del mundo, glifos flotando quietos, nombre, tema, modos (desplegables), botón «Probar demo» → `/es/demo/<mundo>`. Filtro por tramo (chips). El logo viajero se oculta en esta sección (la rejilla usa todo el ancho). |
| 4 | **Aprender** | der | Técnicas (gratis), Clases (la primera de cada mundo gratis), número protagonista **630** lecciones, «en español e inglés». |
| 5 | **Competir y social** | izq | Escalera de rangos Bronce → Prodigio con sus colores; ELO, series al mejor de 3, ligas, clanes (Mundo del Clan), amigos. |
| 6 | **Progreso y estilo** | der | Constelación de 7 estrellas que se enciende al entrar (SVG), racha, placa de jugador de ejemplo (claramente ilustrativa, sin nombre real), «más de 200 cosméticos». |
| 7 | **Plataformas** | izq | Web: botón real. Android: insignia **«Próximamente en Google Play»** no clicable (sin botón de descarga falso). Texto: misma cuenta, mismo progreso. |
| 8 | **Pro** | der | Lista de lo que incluye + etiqueta **«Muy pronto»**. Sin precio como oferta, sin botón de compra. |
| 9 | **Colegios y docentes** | izq | Panel de profesor, grupos y progreso; botón a `/es/docentes`. |
| 10 | **Opiniones** | der | Estado vacío digno (ver `CONTENIDO.md §5`) hasta tener opiniones reales con permiso. |
| 11 | **El desarrollo** | izq | Skyline de actividad (§6.4) + texto sobre cómo se construye. |
| 12 | **Apoya el proyecto** | der | Hoy **sin donaciones**: 4 tarjetas pequeñas de formas de ayudar (jugar un mundo, seguir en Instagram, compartir, escribir), cada una con su icono SVG. El botón de donar solo aparece si algún día se configura `config.donaciones`. |
| 13 | **Pie** | — | Logo, Instagram @prodigia.app, enlaces (web, demo, docentes, privacidad), correo prodigia.oficial@gmail.com como texto visible, «Ver la intro otra vez», «Hecho por Jacobo, con Claude Code». |

Ritmo vertical: secciones con `padding-block: clamp(96px, 14vh, 160px)`; una sola idea por sección; un CTA principal por sección como máximo.

### 6.4 Skyline de desarrollo

Adaptación (no copia) de *contribution-skyline* (detalle en `docs/web-presentacion/referencias/README.md §1`; se conservan tooltips, recorrido con teclado y las estadísticas total / día más activo / racha; orbitar con arrastre solo en escritorio): un mapa de calor de commits por día (semanas en columnas) que al entrar en pantalla **se pliega en un skyline isométrico**: cada día es un edificio cuya altura es su número de commits, con ventanas encendidas. Paleta propia: vacío `#12172A`, niveles `#2A2370 → #4A31B8 → #7C5CFF → #B9A8FF`, días máximos con remate dorado `#FFB627`. Hecho en SVG + GSAP (sin otra librería). Debajo, en mono: total de commits y rango de fechas reales. Tabla accesible oculta visualmente con los datos por semana. Sin datos: estado vacío.

---

## 7. Estados y páginas

| Estado | Diseño |
|---|---|
| 404 | Fondo de estrellas, aro del logo **sin chispa** (la chispa «se escapó»), «Esta página no existe» + botón «Volver al inicio». |
| Error / error global | Mismo fondo, aro quieto, «Algo salió mal» + «Reintentar» y «Volver al inicio». `global-error` con estilos mínimos en línea (no depende del layout). |
| Sin JavaScript | `<noscript>` arriba: aviso breve + enlaces esenciales. Como todo es HTML real, el contenido completo se lee igual (la intro se ve en modo quieto vía CSS por defecto, y el JS la mejora). |
| Red social sin configurar | El botón no se renderiza. |
| Sin opiniones | Estado vacío (CONTENIDO §5). |
| Skyline sin datos | «El registro de actividad se publicará pronto.» |

---

## 8. Accesibilidad (checklist de diseño)

- Contraste 4.5:1 en todo texto; foco visible (anillo violeta 2px + desplazamiento 2px) en todo lo interactivo.
- Orden de lectura = orden visual. Encabezados jerárquicos: un `h1` (la frase), `h2` por acto/sección.
- Canvas y decoraciones con `aria-hidden="true"`; iconos SVG decorativos ocultos; los que son botón llevan `aria-label`.
- Áreas táctiles ≥ 44×44px; nada depende del hover.
- `prefers-reduced-motion` respetado en todo (no solo la intro).
- Probado a 375, 768, 1024 y 1440px. Sin scroll horizontal.

## 9. Componentes de 21st.dev

- **contribution-skyline** → sección El desarrollo (adaptado: paleta, datos reales, accesibilidad).
- **sterling-gate kinetic navigation** → menú móvil (reescrito: Tailwind, foco, `aria-expanded`, Escape, enlaces reales).
- No estaban en el proyecto original; se buscaron en 21st.dev y se documentaron en `docs/web-presentacion/referencias/README.md` (el código fuente pide una clave de 21st).
- Para el resto (texto animado de ciudades, transiciones, tarjetas, pie) se revisará 21st.dev en la fase de construcción, eligiendo solo lo que se pueda hacer con GSAP + Tailwind (sin sumar librerías de animación). Cada elección se anota aquí con su motivo.
