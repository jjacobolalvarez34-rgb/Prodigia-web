# Encargo: página de presentación de Prodigia

Vas a construir la **página de presentación** de Prodigia (no la app para estudiar: esa ya existe en `calibra/` y `mobile/`). Es un sitio público que cuenta qué es Prodigia, muestra sus 15 mundos y lleva a la gente a la web, a la futura app y a las redes. Se despliega en Vercel; el dominio propio vendrá después.

## 0. Antes de escribir código

1. **Lee `FICHA_PRODIGIA.md` completa.** Es la única fuente de verdad sobre el producto (hecha el 2026-10-10). Si algo de este encargo la contradice, gana la ficha. Presta atención especial a su sección 13 (cuidados para la página pública).
2. **Lee el material de marca** que cita la ficha: `docs/marketing/BRAND.md`, `VOZ-TONO.md`, `PRODUCT-MESSAGING.md`, `SLOGANS.md`, y los colores por mundo en `calibra/src/lib/mundos/precios.ts`.
3. **Instala la skill de diseño** `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill` siguiendo el README actual del repositorio (no asumas el comando de memoria) y úsala en todas las decisiones de UI.
4. **Lee las dos referencias de 21st.dev** guardadas en `docs/web-presentacion/referencias/` (ver sección 5).
5. **Pregúntame lo que falta** (sección 9) en un solo mensaje, y arranca con marcadores claros en lo que yo no conteste. No inventes datos.

## 1. Dónde vive y con qué se hace

- Carpeta nueva `sitio/` en la raíz del repo. **No modifiques `calibra/` ni `mobile/`**; solo léelos.
- Next.js (App Router) + TypeScript + Tailwind + estructura shadcn (`components/ui`).
- Animación: GSAP con ScrollTrigger para la secuencia guiada por scroll; three.js con react-three-fiber para el anillo 3D. Puedes proponer otra cosa si la justificas.
- Contenido (mundos, enlaces, textos) en archivos de datos tipados, no regado por los componentes. Los enlaces externos (web de Prodigia, redes, donaciones) salen de un único `config`.
- Textos en **español neutro, sin voseo**. Deja la estructura lista para añadir inglés después, sin traducir todavía.

## 2. La experiencia, de principio a fin

### Acto 1 — La pluma
Pantalla completa, fondo de espacio con la estética de Prodigia (fondo `#090C14`, estrellas sutiles, toques de violeta `#7C5CFF`). En el centro, la **pluma** sola, animada, en dorado `#FFB627`. Se escribe una frase como si la pluma la trazara:

> ¿Alguna vez soñaste con que aprender fuera divertido?

Debajo, un «Desliza para continuar» discreto. Propón dos o tres variantes de la frase apoyándote en `SLOGANS.md`.

### Acto 2 — El anillo
Al deslizar, la pluma levanta vuelo y empieza a **dibujar el anillo de Prodigia**: no un círculo plano ni una esfera, sino el borde de un círculo con volumen, un mundo-anillo visto en perspectiva (al estilo de Halo o Elysium). El anillo se va trazando con el scroll y la cámara lo acompaña.

Mientras se dibuja:
1. Texto breve de **qué es Prodigia** (ficha, sección 1).
2. **Los 15 mundos**, cada uno como una ciudad que se enciende sobre el anillo con su color, su nombre y una línea de qué trata (ficha, sección 2). Quince paradas completas cansan: que cada una sea corta, o agrúpalas por tramos del anillo.
3. Cierre del tramo: **«un universo en expansión»**, con el anillo ya completo.
4. Un momento corto sobre **quién lo hace y cómo se está construyendo** (texto que yo te doy; ver sección 9).

### Acto 3 — El logo
Terminado el anillo, aparece el logo de Prodigia con su animación, un destello/explosión, y queda el logo en el centro. Desde ahí la página pasa a ser un sitio normal que se recorre hacia abajo.

### Acto 4 — El sitio
El logo acompaña el recorrido: se desplaza de un lado al otro según la sección que se esté mostrando. Secciones sugeridas, en este orden:

- **Encabezado fijo** con navegación a las secciones, botón a la web de Prodigia y menú a pantalla completa en móvil.
- **Cómo se juega**: sprint de 10 preguntas, dificultad que se ajusta sola, Modo Zen, retos diario y semanal.
- **Los mundos**: los 15 otra vez, ahora como rejilla explorable, con enlace a la demo jugable sin cuenta (`/demo/<mundo>` en la web).
- **Aprender**: técnicas, clases, 630 lecciones en español e inglés.
- **Competir y social**: Rankeds con ELO y rangos, ligas, clanes, amigos.
- **Progreso y estilo**: constelaciones, rachas, placa de jugador, cosméticos.
- **Plataformas**: web (enlace real) y Android **«próximamente en Google Play»**, sin botón de descarga falso.
- **Pro**: qué incluye, con «muy pronto». Sin precio como oferta activa ni botón de compra.
- **Colegios y docentes**: enlace a `/docentes` de la web.
- **Opiniones**: ver la regla de abajo.
- **El desarrollo**: ver sección 5 (skyline de actividad).
- **Apoya el proyecto**: donaciones mediante **enlace externo** a una plataforma (la que yo indique). El sitio no procesa pagos ni guarda datos de tarjetas.
- **Pie**: redes, enlaces, contacto, aviso de privacidad.

**Regla sobre opiniones:** no escribas reseñas, nombres ni cifras inventadas (ni «+10.000 jugadores», ni estrellas). Si no te doy opiniones reales con permiso, la sección se construye como estado vacío digno: «Sé de los primeros en contarnos qué te parece», con enlace a la demo y a un canal de contacto.

## 3. Reglas de contenido (de la ficha, obligatorias)

- **No mencionar la Trastienda** en ningún lado.
- **Naipia** se presenta como memoria y cálculo mental; nada de casinos ni apuestas.
- **No prometer como disponible** lo apagado o planeado: cobro de Pro, Cometas, anuncios, eventos, app en Google Play.
- Prodigia no es una app infantil: el tono es para cualquier persona que quiera aprender.

## 4. Que la intro no estorbe

- Botón **«Saltar intro»** visible desde el primer segundo; quien ya la vio en la sesión entra directo al acto 4.
- **`prefers-reduced-motion`**: versión sin vuelo ni cámara, con el mismo contenido en fundidos simples.
- **Sin WebGL o equipo flojo**: caída a una versión 2D (SVG/CSS) del anillo. Carga three.js de forma diferida; el texto debe ser legible antes de que llegue el 3D.
- Todo el contenido de la intro existe también como HTML real (para lectores de pantalla y buscadores), no solo dentro del canvas.
- El scroll nunca se secuestra: se puede subir, bajar y usar teclado con normalidad.
- Probar en móvil de gama media: objetivo de animación fluida y Lighthouse ≥ 90 en rendimiento y accesibilidad para la parte posterior a la intro.

## 5. Recursos de 21st.dev

En `docs/web-presentacion/referencias/` hay dos componentes (son libres; adáptalos, no los pegues tal cual):

- **`contribution-skyline.tsx`** — mapa de calor que se pliega en un skyline isométrico. Encaja con «cada mundo es una ciudad». Uso propuesto: sección **El desarrollo**, alimentada con la actividad real del repo (commits por día generados en build con `git log`). Paleta propia con los colores de Prodigia mediante la prop `palette`. Si no hay datos reales, no uses el año de muestra generado como si fuera real.
- **`sterling-gate-kinetic-navigation.tsx`** — menú a pantalla completa con GSAP. Uso: menú móvil del encabezado. Ojo: la referencia **no trae su CSS** (solo variables `:root`), usa clases propias sin estilos, manipula el DOM a mano y le falta foco/accesibilidad. Reescribe los estilos en Tailwind, con trampa de foco, `aria-expanded`, cierre con Escape y enlaces reales.

Para lo demás (texto animado de las ciudades, transiciones, tarjetas, pie) busca en `https://21st.dev/` componentes que encajen y dime cuáles elegiste y por qué. Mantén una sola librería de animación siempre que puedas; no sumes dependencias por un efecto.

## 6. Estados y páginas que no pueden faltar

- Pantalla de carga de marca (pluma dibujándose) mientras llega la intro, y `loading` por ruta.
- `not-found` (404) y `error` / `global-error` con la estética del sitio y camino de vuelta.
- Estados vacíos diseñados: opiniones sin reseñas, skyline sin datos, enlaces de redes aún no configurados (el botón no se muestra, no queda roto).
- Aviso para navegador sin JavaScript con el contenido esencial y los enlaces.
- Página de privacidad sencilla.

## 7. Seguridad

Es un sitio estático sin cuentas ni base de datos; mantenlo así.

- Cabeceras en `next.config`: Content-Security-Policy estricta (con nonce donde haga falta; documenta cualquier excepción), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, y `frame-ancestors 'none'`.
- Ningún secreto en el cliente ni en el repo; `.env.example` documentado.
- Enlaces externos con `rel="noopener noreferrer"`.
- Sin formularios en la primera versión (contacto por enlace). Si más adelante se añade uno: validación en servidor, límite de peticiones y honeypot.
- Dependencias mínimas, versiones fijadas, `npm audit` limpio.
- Sin rastreadores de terceros. Si se mide tráfico, que sea analítica sin cookies y se diga en privacidad.

## 8. SEO y despliegue

- Metadatos, Open Graph e imagen social propia, `sitemap`, `robots`, favicon e iconos a partir del logo.
- URL base por variable de entorno, para cambiar de `*.vercel.app` al dominio sin tocar código.
- Deja el proyecto listo para Vercel con directorio raíz `sitio/` y explica los pasos en `sitio/README.md`.

## 9. Lo que necesito que me preguntes

- **La pluma**: ¿hay archivo vectorial (SVG)? La ficha solo lista `docs/Logo principal@2x.png`, `docs/Logo animado@2x.png` y los videos `docs/mamut-intro-*`. Para dibujarla y hacerla volar hace falta SVG; si no existe, propón un trazado y muéstramelo antes de seguir.
- **El anillo/logo**: confirmar con el logo real qué forma exacta se dibuja.
- URL pública de la web de Prodigia.
- Redes sociales (cuáles y sus enlaces).
- Plataforma y enlace de donaciones.
- Texto sobre mí y sobre el desarrollo (qué quiero contar y con qué nombre firmar).
- Opiniones reales con permiso, si las hay.
- Correo o canal de contacto.

## 10. Cómo trabajar

Por fases, mostrándome cada una antes de pasar a la siguiente:

1. Base del proyecto, tema, datos de los mundos, encabezado, pie, 404/error/carga, cabeceras de seguridad.
2. Acto 4 completo con contenido real (el sitio debe servir aunque la intro no exista).
3. Actos 1 a 3: pluma, anillo, logo, con sus caídas (sin movimiento, sin WebGL).
4. Logo viajero entre secciones, skyline de desarrollo, pulido, rendimiento, accesibilidad, SEO.
5. Revisión final contra la sección 3 y la sección 13 de la ficha, y guía de despliegue.

En cada fase: ejecuta el build, el lint y el chequeo de tipos, revisa la página en ancho de móvil y de escritorio, y dime con franqueza qué quedó a medias.
