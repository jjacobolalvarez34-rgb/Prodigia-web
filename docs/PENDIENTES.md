# Pendientes, hallazgos y preguntas

> Fecha: 2026-10-10. Se actualiza en cada fase. Lo que no se conteste se construye con un marcador `[PENDIENTE: …]` visible en el código y en `contenido/`, nunca con datos inventados.

## 1. Hallazgos al revisar el proyecto original

| # | Hallazgo | Consecuencia |
|---|---|---|
| H1 | **No existe `docs/web-presentacion/referencias/`** en el proyecto original. Faltan `contribution-skyline.tsx` y `sterling-gate-kinetic-navigation.tsx`. | Se pide al dueño que los guarde, o se autoriza a buscarlos en 21st.dev durante la construcción. Mientras tanto se diseñan desde cero según la descripción del encargo. |
| H2 | **No hay SVG de pluma.** | Propuesta en `docs/propuestas/pluma.svg` (vista: `docs/propuestas/pluma-preview.html`), derivada del brazo de la chispa del logo. Necesita aprobación. |
| H3 | **`Logo principal@2x.png` y `Logo animado@2x.png` son el logo de Mamut S.A.S.** (el estudio), no de Prodigia. Los videos `mamut-intro-*` son la intro del estudio. | El logo de Prodigia es el de `calibra/src/components/Logo.tsx`: aro violeta abierto + chispa asimétrica de 4 puntas. Se porta tal cual a SVG. |
| H4 | La web usa prefijo de idioma obligatorio (`localePrefix: "always"`). | Enlaces reales: `<web>/es/demo/<mundo>` y `<web>/es/docentes`. |
| H5 | Las 15 rutas de demo existen (`calibra/src/app/[locale]/demo/<mundo>`). | Cada tarjeta de mundo puede enlazar su demo. |
| H6 | URL de la web en el código: `https://prodigia-sandy.vercel.app`. En piezas de marketing aparece `prodigia.app` («verificar»). | Hay que confirmar cuál es la pública. |
| H7 | El repo de Prodigia tiene 212 commits (17-08-2026 → 10-10-2026). | El skyline puede usar datos reales. |
| H8 | Documentos viejos dicen 8 o 13 mundos y «60 segundos». | Se usa la ficha: 15 mundos y «contra el reloj». Ver `CONTENIDO.md §0`. |
| H9 | El disco C: tiene ~2 GB libres y la caché de npm apunta a C:. | `.npmrc` del repo manda la caché a `D:/.npm-cache`. Ver `CLAUDE.md`. |

## 2. Preguntas para el dueño (encargo §9 + hallazgos)

1. **Pluma:** ¿apruebas la propuesta (`docs/propuestas/pluma-preview.html`) o tienes un SVG propio?
2. **Anillo/logo:** ¿confirmas que el anillo que se dibuja es el aro del logo real (abierto, con la chispa escapando por la apertura)?
3. **URL pública de la web de Prodigia:** ¿`prodigia-sandy.vercel.app`, `prodigia.app` u otra?
4. **Redes sociales:** ¿cuáles y con qué enlaces?
5. **Donaciones:** ¿qué plataforma y qué enlace?
6. **Texto sobre ti y el desarrollo:** qué contar y con qué nombre firmar. ¿Se menciona Mamut S.A.S.?
7. **Opiniones reales con permiso:** ¿hay alguna?
8. **Contacto:** ¿correo o canal? (También para el aviso de privacidad: razón social, NIT, domicilio.)
9. **Referencias de 21st.dev:** ¿las guardas en el proyecto o las busco yo en 21st.dev?
10. **Frase de la pluma:** ¿A, B o C? (`CONTENIDO.md §1`)
11. **Tramos de mundos:** ¿te sirve la agrupación propuesta? (`CONTENIDO.md §3`)
12. **Pro «sin anuncios»:** ¿lo omitimos (recomendado, porque hoy no hay anuncios)?

## 3. Respuestas recibidas (2026-10-10)

| # | Pregunta | Respuesta | Qué se hace |
|---|---|---|---|
| 1 | Pluma | **Aprobada** la propuesta | Se usa `docs/propuestas/pluma.svg` |
| 2 | Anillo = aro del logo | **Sí** | El anillo deja la apertura y termina siendo el aro del logo |
| 3 | URL de la web | **La del código:** `https://prodigia-sandy.vercel.app` | `config.webProdigia`; demos en `/es/demo/<mundo>`, docentes en `/es/docentes` |
| 4 | Redes | **Instagram @prodigia.app** | `https://www.instagram.com/prodigia.app/`; las demás redes quedan en `null` (no se muestran) |
| 5 | Donaciones | **Ninguna** | `config.donaciones = null`; «Apoya el proyecto» ofrece formas de ayudar sin dinero (`CONTENIDO.md §4`) |
| 6 | Autor | Estudiante de **matemática pura** que usa **Claude Code**. Firma real **Jacobo**; apodos posibles Akito o Neutrón | Borrador en `CONTENIDO.md §1`. Firma por defecto: **Jacobo** (sin apellido), cambiable en `config.autor.firma` |
| 7 | Opiniones | No había quedado claro qué eran (testimonios de personas reales) → **no hay** | Estado vacío digno |
| 8 | Contacto | **prodigia.oficial@gmail.com**. Sin NIT, sin razón social, sin domicilio | Responsable en Privacidad: Jacobo + correo. **No se menciona «Mamut S.A.S.»** hasta que la sociedad esté registrada |
| 9 | 21st.dev | **Buscarlas en la página** y guiarse mucho por ellas | Hecho: `docs/web-presentacion/referencias/README.md`. El código pide una clave de 21st; sin ella se reescriben desde su descripción |
| 10 | Frase | **A** | «¿Alguna vez soñaste con que aprender fuera divertido?» |
| 11 | Tramos | **Aprobados** | `contenido/tramos.ts` |
| 12 | Pro sin anuncios | **Se omite** | — |

## 4. Lo único que sigue abierto

- **Clave de 21st (opcional):** si Jacobo crea una cuenta gratis en https://21st.dev/mcp y pone la clave en `API_KEY_21ST` (en su terminal, nunca en el repo), la construcción puede leer el código original de los dos componentes. Sin ella también se puede construir.
- **Texto del autor:** revisar el borrador de `CONTENIDO.md §1` y elegir firma (Jacobo / Akito / Neutrón).
- **Opiniones reales:** cuando alguien dé permiso, se agregan.
