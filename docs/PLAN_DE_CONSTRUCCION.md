# Plan de construcción

> Fecha: 2026-10-10. Sigue el encargo §10: por fases, mostrando cada una antes de pasar a la siguiente.
> Leer antes: `CLAUDE.md`, `ARQUITECTURA.md`, `DISENO.md`, `CONTENIDO.md`, `PENDIENTES.md`.

**En cada fase:** `npm run lint`, `npm run typecheck`, `npm run build`; revisar en `http://localhost:3000` a **375px** y **1440px** (y 768/1024 cuando aplique); reportar con franqueza qué quedó a medias.

---

## Fase 0 — Preparación (antes de instalar nada)

- [x] Confirmar que `.npmrc` apunta la caché a `D:/.npm-cache` y que no se escribe nada en C:.
- [x] Leer las respuestas en `PENDIENTES.md §3`. Lo no contestado → marcador `[PENDIENTE]`.
- [x] Elegir versiones exactas (publicadas hace más de 2 semanas) de: next, react, react-dom, typescript, tailwindcss, @tailwindcss/postcss, gsap, @gsap/react, three, @types/three, @react-three/fiber, eslint, eslint-config-next.

**Resultado (2026-10-10).** `npm config get cache` → `D:\.npm-cache`; `.npmrc` suma `save-exact=true`. `TEMP`/`TMP` de Windows apuntan a C: (2,1 GB libres), así que los comandos de construcción se corren con `TEMP=TMP=<repo>/.tmp` y `NEXT_TELEMETRY_DISABLED=1`.

Corte de fecha: publicadas antes del 2026-09-26.

| Paquete | Versión | Publicada | Motivo |
|---|---|---|---|
| next · eslint-config-next | **16.3.8** | 2026-09-30 | **Excepción a las 2 semanas:** 16.0.0–16.3.7 tiene avisos de seguridad (`npm audit`: caché envenenada en SSG/ISR, SSRF en optimización de imágenes, fuga en rutas de imágenes de metadatos…). 16.3.8 es el parche mínimo que los corrige. |
| react · react-dom | 19.2.8 | 2026-07-21 | Misma línea que `calibra` (probada). 19.3.0 también cabe en el rango de R3F (`<19.4`), pero no aporta nada aquí. |
| typescript | 5.9.3 | 2025-09-30 | `typescript-eslint` exige `<6.1.0`; 7.x no está soportado por el lint. |
| eslint | 9.39.5 | 2026-07-10 | `eslint-plugin-react`, `-import` y `-jsx-a11y` (vía eslint-config-next) aún no aceptan ESLint 10. |
| tailwindcss · @tailwindcss/postcss | 4.3.3 | 2026-07-16 | Última 4.x. |
| gsap | 3.15.0 | 2026-04-13 | Última. |
| @gsap/react | 2.1.2 | 2025-01-15 | Última. |
| three | 0.186.1 | 2026-09-24 | Última. |
| @types/three | 0.186.0 | 2026-09-11 | Última. |
| @react-three/fiber | 9.8.1 | 2026-09-24 | Última; pide React `>=19 <19.4`. |
| @types/react · @types/react-dom | 19.2.18 · 19.2.7 | 2026-07 / 2026-09 | Acordes a React 19.2. |
| @types/node | 22.20.4 | 2026-09-19 | Node local 22.14. |
| clsx · tailwind-merge | 2.1.1 · 3.7.0 | — | Util `cn` de shadcn. Sin `class-variance-authority` ni Radix: las variantes del botón son un objeto simple. |

`npm audit --omit=dev`: **0 vulnerabilidades**. `npm audit` completo: 1 aviso alto **sin corrección publicada** en una dependencia de desarrollo (ver `PENDIENTES.md §4`).

## Fase 1 — Base

- [x] Crear la app Next.js en la **raíz** del repo (TypeScript, App Router, Tailwind 4, ESLint, sin `src/`, alias `@/*`).
- [x] Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `actividad` (`node scripts/generar-actividad.mjs`).
- [x] Tokens de marca en `app/globals.css` (`DISENO.md §1`) y fuentes con `next/font`.
- [x] Estructura shadcn mínima: `components/ui/button.tsx`, `lib/utils.ts` (`cn`).
- [x] `contenido/`: `tipos.ts`, `config.ts` (con `null` en lo pendiente), `mundos.ts` (15 mundos), `tramos.ts`, `es/*.ts`.
- [x] `components/marca/Logo.tsx`: port fiel de `calibra/src/components/Logo.tsx` (mismos paths, dasharray y degradado).
- [x] Encabezado (escritorio) + menú móvil a pantalla completa (accesible) + pie.
- [x] `loading.tsx` (pluma dibujándose), `not-found.tsx`, `error.tsx`, `global-error.tsx`, `privacidad/page.tsx`, `<noscript>`.
- [x] Cabeceras de seguridad + `proxy.ts` con CSP y nonce. Verificar con `curl -I http://localhost:3000` en `next start`.
- [x] `.env.example`, `.gitignore` (incluye `.env*.local`, `.next`, `node_modules`).

**Aceptación:** build limpio; 404 y error se ven con la estética del sitio; el menú móvil se abre/cierra con teclado y Escape, atrapa el foco y devuelve el foco al botón; la consola del navegador no muestra violaciones de CSP.

**Resultado (2026-10-10).** `lint` 0 problemas · `typecheck` ok · `build` ok (las 3 rutas, dinámicas por el nonce).
- `curl -I` en `next start`: las 7 cabeceras de `SEGURIDAD_Y_DESPLIEGUE.md §1`; la CSP lleva un nonce distinto en cada petición y Next lo pone en sus `<script>`.
- Revisado con Chrome (Playwright, `.tmp/`) a 375, 768, 1024 y 1440px: sin scroll horizontal; **0 violaciones de CSP** en `next start` y en `next dev`, también en los estados de error.
- Menú móvil solo con teclado: `aria-expanded` cambia, `#raiz` queda `inert`, Tab ×14 y Shift+Tab no salen del diálogo, Escape cierra y devuelve el foco al botón; al elegir un enlace navega y libera la página. Con `reduced-motion`, fundido sin círculo ni onda.
- `error.tsx`, `global-error.tsx` (HTTP 500, documento propio) y `loading.tsx` se verificaron con un build temporal con rutas de prueba, ya borradas.

**Decisiones de la fase:**
- La app se armó a mano (no `create-next-app`, que rechaza una carpeta con archivos). `typecheck` = `next typegen && tsc --noEmit`, para validar también los tipos de rutas (Next 16).
- Textos que no dependen del idioma separados de los que sí: `contenido/mundos.ts` (colores, glifos) + `contenido/es/mundos.ts` (nombre, tema, línea, modos). El tipo `Contenido` es la forma de `contenido/es`, así un `en/` futuro queda obligado a tener las mismas claves.
- `Logo.tsx`: mismos paths, dasharray y degradado; los ids del `<defs>` son únicos por instancia (`useId`), porque hay varios logos por página y un id repetido dentro de un elemento oculto deja sin degradado a los demás.
- Menú móvil en un portal sobre `<body>`, con su propio botón de cerrar donde estaba la hamburguesa (el botón original queda dentro de `#raiz`, que está inerte).
- `next dev` añade al final de `CLAUDE.md` un bloque de reglas de Next (`generate-agent-files.js`, sin opción para apagarlo). Se versiona: si se borra, vuelve a aparecer.

**Queda a medias (a propósito o para otra fase):**
- El inicio solo tiene el bloque `#inicio`; los enlaces del menú apuntan a secciones que llegan en la Fase 2. El `<h1>` es «Prodigia» hasta que la Fase 3 ponga la frase de la pluma.
- `/favicon.ico` da 404 (un error en consola) hasta los iconos de la Fase 4.
- `npm run actividad` está declarado, pero `scripts/generar-actividad.mjs` se crea en la Fase 4.
- Los textos de las secciones del acto 4 se suman a `contenido/es/sitio.ts` en la Fase 2.
- En escritorio, «Abrir Prodigia» con degradado aparece en el encabezado y en `#inicio` a la vez; `DISENO.md` pide el degradado una vez por pantalla, pero también pide ese botón con degradado en el encabezado (§6.1). Hay que elegir en la Fase 2: por ejemplo, botón del encabezado con estilo secundario mientras `#inicio` esté a la vista.
- Lighthouse (Fase 2) y NVDA (Fase 4) no se midieron todavía.

## Fase 2 — Acto 4 completo (el sitio sirve sin intro)

- [x] Las 13 secciones de `DISENO.md §6.3` con el contenido de `CONTENIDO.md §4`.
- [x] Rejilla de mundos con filtro por tramo y enlace a cada demo (`/es/demo/<slug>`).
- [x] Estados vacíos: opiniones, redes no configuradas, donaciones no configuradas.
- [x] Componente `EnlaceExterno` (siempre `noopener noreferrer`).
- [x] Revisión de texto: sin voseo, sin Trastienda, sin promesas apagadas (`CONTENIDO.md §0`). Buscar con `grep -riE "trastienda|ruleta|apuesta|casino|blackjack|vos |tenés|podés|jugá|elegí|probá"`.

**Aceptación:** la página funciona entera con la intro desactivada; Lighthouse móvil ≥ 90 en rendimiento y accesibilidad; sin scroll horizontal a 375px.

**Resultado (2026-10-10).** `lint` 0 · `typecheck` ok · `build` ok.
- **Lighthouse móvil** (13.5.0, `next start`, `/`): rendimiento **92**, accesibilidad **100**, buenas prácticas 96 (solo por el 404 de `/favicon.ico`), SEO 100. LCP 2,3 s · CLS 0 · TBT 290 ms.
- Sin scroll horizontal a 375, 768, 1024 ni 1440px. Sin errores de consola salvo el favicon. CSP: el script inicial (`data-js`) va firmado con el nonce, 0 violaciones.
- Sin JavaScript: se ven las 11 secciones y los 15 mundos, el filtro se oculta (no serviría) y nada queda escondido. Con `reduced-motion`: sin desplazamientos ni esperas.
- Filtro de mundos: botones con `aria-pressed`, operables con teclado, anuncian «Mostrando N mundos» (`aria-live`).
- Búsqueda de voseo, peninsular, Trastienda, apuestas, Cometas, temporadas: sin resultados en el código (solo comentarios y la insignia aprobada «Próximamente en Google Play»).

**Decisiones de la fase:**
- Las secciones se maquetan en 12 columnas con el contenido en 8 del lado opuesto al logo (`data-logo` en cada `<section>`), listas para el logo viajero de la Fase 4. Hasta entonces, en escritorio queda ese margen libre.
- Revelado al entrar en pantalla con un solo `IntersectionObserver` + transiciones CSS (`Revelador.tsx`), no con GSAP: menos JavaScript. Solo se oculta algo si `<html data-js>`, que lo pone un script en línea con nonce antes del primer pintado (`lib/script-inicial.ts`; la Fase 3 lo amplía para arrancar en `#inicio`).
- Tarjetas de mundo: degradado del color del mundo mezclado como máximo al 48 % con la superficie y texto blanco al 85 % o más → **peor contraste 4,8:1** (Trigonometría), calculado para los 15 colores. Glifos forzados a forma de texto (en Windows, ⌛ salía como emoji de color).
- Rangos con su ELO mínimo real (`calibra/src/types/database.ts`: 0, 900, 1100, 1300, 1500 y 1700).
- El botón «Abrir Prodigia» del encabezado se oculta mientras `#inicio` está a la vista (ahí ya está el mismo botón con degradado): así hay un degradado por pantalla y el encabezado mantiene su botón en el resto (resuelve lo pendiente de la Fase 1).
- `scripts/generar-actividad.mjs` y `datos/actividad.json` se adelantaron de la Fase 4: «El desarrollo» ya muestra total (212), día más activo y racha más larga con datos reales. El skyline sigue en la Fase 4.
- No se sumaron componentes de 21st.dev ni librerías para las secciones: todo con Tailwind, SVG y CSS (`docs/web-presentacion/referencias/README.md §3`).

**Queda para otras fases:** skyline (Fase 4), logo viajero (Fase 4), favicon e iconos (Fase 4), bajar el JavaScript inicial (GSAP con ScrollTrigger entra con el menú: ~57 KiB sin usar al cargar, Fase 4).

## Fase 3 — Actos 1 a 3 (intro) con sus caídas

Orden: primero lo que siempre funciona, después lo vistoso.

1. [ ] `lib/progreso-intro.ts` (tramos de `DISENO.md §2`) y `lib/capacidades.ts` (modos).
2. [ ] `TextosIntro.tsx`: todo el texto de la intro como HTML real.
3. [ ] **Modo quieto** (reduced-motion): bloques con fundidos, anillo 2D completo, logo final.
4. [ ] **Botón Saltar intro** (`DISENO.md §3`): enlace `#inicio` sin JS; con JS salta al estado final, marca la sesión, mueve el foco. Arranque directo en `#inicio` si ya se vio en la sesión. «Ver la intro otra vez» en el pie.
5. [ ] **Modo ligero (2D):** escenario sticky, estrellas en canvas 2D, frase trazada con la pluma SVG, anillo SVG en perspectiva trazado con el scroll, ciudades que se encienden, logo con destello 2D.
6. [ ] **Modo completo (3D)** cargado en diferido: anillo con volumen (Lathe + drawRange), cámara por curva, ciudades instanciadas, pluma 3D, partículas con el presupuesto de `DISENO.md §5`, transición anillo → aro del logo, destello. Caída automática a 2D si falla la carga o se pierde el contexto WebGL.
7. [ ] Pantalla de carga de marca mientras llega el chunk 3D.

**Aceptación:** se puede subir y bajar libremente con rueda, barra, teclado (Espacio, Re Pág/Av Pág, flechas) y gestos; las tres versiones muestran el mismo contenido; el texto es legible antes de que cargue three.js; nada de partículas encima del texto; el botón Saltar se ve desde el primer segundo y lleva al logo final.

**Estado al pausar (2026-10-10, a pedido del dueño).** Hechos y con commit: tareas 1 a 7 (modos quieto, ligero y completo; Saltar; carga del 3D), mejora gráfica del 3D (bloom, losa con suelo y rebordes, ciudades sobre el suelo), opción «Ver con animación» para quien tiene reducido el movimiento, Lighthouse móvil 92 en `/#inicio`, sin `loading.tsx` (rompía la página sin JS con la CSP de nonce). Pista más larga (1400svh / 1150svh).
Pendiente al retomar (pedido del dueño):
- **Explosión del logo por tiempo** (no atada al scroll): destello, 3 ondas, rayos, fogonazo suave, chispas con estela, logo con rebote y aura; textos finales en cascada. Los elementos ya están en el DOM (`.intro-aura`, `.intro-rayos`, `.intro-fogonazo`, 3 `.intro-onda`) y ocultos por CSS; falta el CSS y la línea de tiempo en `render2d.ts` (y quitar el destello atado al scroll).
- **Acto 1:** la pluma entra volando antes de escribir; letras con brillo de tinta dorada que se enfría; la pluma dibuja el subrayado de «divertido» (hoy se ve completo, sin animar); el reposo de la pluma pasa a ser el final del subrayado (también en `escena3d/director.ts`).
- **Anillo 2D nítido:** dibujarlo al tamaño grande y achicarlo al final (hoy se agranda un SVG chico y se ve borroso).
- Cerrar la fase en este documento (resultado y decisiones) y seguir con las Fases 4 y 5.

## Fase 4 — Logo viajero, skyline, pulido

- [ ] Logo viajero (≥1024px) con `data-logo` por sección; oculto en «Los mundos»; quieto en móvil.
- [ ] `scripts/generar-actividad.mjs` + `datos/actividad.json` (solo fechas y conteos; **hechos en la Fase 2**) + skyline (mapa de calor → isométrico) con tabla accesible y estado vacío.
- [ ] SEO: metadatos, Open Graph, imagen social, sitemap, robots, iconos desde el logo.
- [ ] Rendimiento: medir el chunk 3D, DPR, pausa fuera de pantalla, CLS. Lighthouse en `/#inicio`.
- [ ] Accesibilidad: recorrido completo con teclado y con lector de pantalla (NVDA en Windows).

## Fase 5 — Revisión final y despliegue

- [ ] Revisión contra el encargo §3 y la ficha §13 (checklist de `CONTENIDO.md §0`).
- [ ] `npm audit` limpio; versiones fijadas.
- [ ] `README.md` con la guía de despliegue (`SEGURIDAD_Y_DESPLIEGUE.md §6`).
- [ ] Lista honesta de lo que quedó pendiente.

---

## Cómo levantar el localhost

```bash
cd D:/Repositorios/Prodigia-web
npm install            # usa la caché en D: (ver .npmrc)
npm run dev            # http://localhost:3000
```

Para probar como en producción (CSP real, sin `unsafe-eval`): `npm run build && npm start`.
Para probar caídas: DevTools → *Rendering* → `prefers-reduced-motion: reduce`; y `chrome://flags` o `?sin3d=1` (parámetro de depuración que fuerza el modo ligero, solo en desarrollo).
