# Referencias de 21st.dev

> Revisado: 2026-10-10. El encargo §5 decía que estaban guardadas en el repo original; **no lo estaban**. El dueño pidió buscarlas en 21st.dev y guiarse mucho por ellas.
> El **código fuente no se pudo descargar**: el registro (`https://21st.dev/r/...`) responde `403 Authentication required` sin una clave de 21st (`API_KEY_21ST`, gratis en https://21st.dev/mcp, con límite de copias diarias). Lo de abajo sale de las páginas públicas de cada componente.
> Si en la construcción se consigue la clave: `npx shadcn@latest add "https://21st.dev/r/<autor>/<componente>?api_key=$API_KEY_21ST"` **en una carpeta aparte** (`docs/web-presentacion/referencias/codigo/`), solo para leerlo. Nunca se pega tal cual: se adapta (encargo §5).

---

## 1. contribution-skyline → sección «El desarrollo»

- Página: https://21st.dev/@kedhareswer/components/contribution-skyline
- Autor: Kedhareswer Naidu · Licencia: **MIT** · Publicado 2026-09-30 · Solo React (sin otras dependencias).
- Qué hace (según su página):
  - Mapa de contribuciones estilo GitHub que **se transforma en un skyline isométrico 3D** (cada día = un edificio).
  - Tooltips al pasar sobre un día.
  - **Arrastrar para orbitar** la vista.
  - **Recorrerlo con el teclado.**
  - **Seis paletas** (prop `palette`, según el encargo).
  - Estadísticas: **total, día más activo y racha**.
  - Acepta datos propios fecha → conteo.
  - Nota de su demo: necesita `w-full` en el contenedor (en un flex se encoge a su contenido).

**Cómo se adapta en este sitio (`DISENO.md §6.4`):**
- Datos reales de `datos/actividad.json` (commits por día del repo de Prodigia; solo fechas y conteos).
- Paleta propia de Prodigia: vacío `#12172A`, `#2A2370 → #4A31B8 → #7C5CFF → #B9A8FF`, días máximos con remate dorado `#FFB627`; ventanas de los edificios encendidas (idea fuerza «cada mundo es una ciudad de noche»).
- Se mantienen: transformación mapa → skyline al entrar en pantalla, tooltips, navegación con teclado (flechas entre días, con `aria-live` que lee «12 de septiembre: 7 cambios»), estadísticas **total / día más activo / racha** en JetBrains Mono.
- Orbitar con arrastre: solo en escritorio y con un tope de ángulo; en móvil, vista fija (no pelea con el scroll).
- Animación con GSAP (la única librería de animación del sitio), SVG o CSS 3D; **sin** sumar three.js a esta sección.
- Reduced-motion: se muestra directamente el skyline final, sin transformación.
- Tabla accesible (oculta visualmente) con los datos por semana.

## 2. sterling-gate-kinetic-navigation → menú móvil

- Página: https://21st.dev/@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation
- Autor: Hardik Kashiyani · Licencia: **«unknown»** en 21st (el encargo dice que es libre). Como se reescribe desde cero, no se copia código.
- Dependencia: `gsap`.
- Qué hace (según su página):
  - Navegación a **pantalla completa** con lógica de «revelado»: de la vista normal a una capa inmersiva hecha sobre todo de **tipografía grande**.
  - Transiciones «fluidas y pesadas» que dan profundidad (inspiración «plata» y «agua»).
  - Efecto **«onda» (ripple)** que recorre los ítems del menú al pasar el cursor.
  - Pensado para una estética de «lujo silencioso».
- Advertencia del propio blog de 21st («React Navbar Design»): un menú que tapa la página **es un diálogo modal**, lo llames así o no. Necesita **trampa de foco, cierre con Escape, devolver el foco al botón y `inert` en la página de atrás**; si no, el teclado y los lectores de pantalla terminan en enlaces que nadie ve.

**Cómo se adapta en este sitio (`DISENO.md §6.1`):**
- Revelado: el panel `#090C14` crece desde el botón (clip-path circular) en ~600ms con `power3.inOut`; los enlaces entran escalonados en Space Grotesk grande.
- Onda: al pasar el cursor/foco por un enlace, una onda de luz violeta→dorada lo recorre y los vecinos se desplazan 4–6px (solo en dispositivos con puntero fino; en táctil, un brillo al tocar).
- Accesibilidad completa: `aria-expanded`, `aria-controls`, `role="dialog"` + `aria-modal`, trampa de foco, Escape, `inert` en el resto de la página, foco de vuelta al botón, scroll de fondo bloqueado solo mientras está abierto.
- Estilos 100 % Tailwind; enlaces reales a las secciones y a la web de Prodigia.
- Reduced-motion: aparece con fundido, sin onda.

## 3. Otros componentes de 21st.dev

El encargo pide buscar para: texto animado de las ciudades, transiciones, tarjetas y pie. Se elige en la fase de construcción con estas condiciones: se puede hacer con **GSAP + Tailwind** (sin sumar librerías como `motion`), es accesible y encaja con la marca. Cada elección se anota aquí con su enlace y su motivo.
