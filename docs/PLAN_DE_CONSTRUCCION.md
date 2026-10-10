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

- [ ] Crear la app Next.js en la **raíz** del repo (TypeScript, App Router, Tailwind 4, ESLint, sin `src/`, alias `@/*`).
- [ ] Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `actividad` (`node scripts/generar-actividad.mjs`).
- [ ] Tokens de marca en `app/globals.css` (`DISENO.md §1`) y fuentes con `next/font`.
- [ ] Estructura shadcn mínima: `components/ui/button.tsx`, `lib/utils.ts` (`cn`).
- [ ] `contenido/`: `tipos.ts`, `config.ts` (con `null` en lo pendiente), `mundos.ts` (15 mundos), `tramos.ts`, `es/*.ts`.
- [ ] `components/marca/Logo.tsx`: port fiel de `calibra/src/components/Logo.tsx` (mismos paths, dasharray y degradado).
- [ ] Encabezado (escritorio) + menú móvil a pantalla completa (accesible) + pie.
- [ ] `loading.tsx` (pluma dibujándose), `not-found.tsx`, `error.tsx`, `global-error.tsx`, `privacidad/page.tsx`, `<noscript>`.
- [ ] Cabeceras de seguridad + `proxy.ts` con CSP y nonce. Verificar con `curl -I http://localhost:3000` en `next start`.
- [ ] `.env.example`, `.gitignore` (incluye `.env*.local`, `.next`, `node_modules`).

**Aceptación:** build limpio; 404 y error se ven con la estética del sitio; el menú móvil se abre/cierra con teclado y Escape, atrapa el foco y devuelve el foco al botón; la consola del navegador no muestra violaciones de CSP.

## Fase 2 — Acto 4 completo (el sitio sirve sin intro)

- [ ] Las 13 secciones de `DISENO.md §6.3` con el contenido de `CONTENIDO.md §4`.
- [ ] Rejilla de mundos con filtro por tramo y enlace a cada demo (`/es/demo/<slug>`).
- [ ] Estados vacíos: opiniones, redes no configuradas, donaciones no configuradas.
- [ ] Componente `EnlaceExterno` (siempre `noopener noreferrer`).
- [ ] Revisión de texto: sin voseo, sin Trastienda, sin promesas apagadas (`CONTENIDO.md §0`). Buscar con `grep -riE "trastienda|ruleta|apuesta|casino|blackjack|vos |tenés|podés|jugá|elegí|probá"`.

**Aceptación:** la página funciona entera con la intro desactivada; Lighthouse móvil ≥ 90 en rendimiento y accesibilidad; sin scroll horizontal a 375px.

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

## Fase 4 — Logo viajero, skyline, pulido

- [ ] Logo viajero (≥1024px) con `data-logo` por sección; oculto en «Los mundos»; quieto en móvil.
- [ ] `scripts/generar-actividad.mjs` + `datos/actividad.json` (solo fechas y conteos) + skyline (mapa de calor → isométrico) con tabla accesible y estado vacío.
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
