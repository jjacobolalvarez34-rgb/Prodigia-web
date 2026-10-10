# CLAUDE.md — Página de presentación de Prodigia

Reglas para cualquier persona o agente que construya este sitio. Leer completo antes de tocar código.

## Documentos (leer en este orden)

1. `FICHA_PRODIGIA.md` — verdad del producto. Gana sobre todo lo demás.
2. `PROMPT_WEB_PRODIGIA.md` — el encargo original.
3. `docs/PENDIENTES.md` — hallazgos, preguntas y respuestas del dueño.
4. `docs/ARQUITECTURA.md` · `docs/DISENO.md` · `docs/CONTENIDO.md` · `docs/SEGURIDAD_Y_DESPLIEGUE.md` · `docs/web-presentacion/referencias/README.md`
5. `docs/PLAN_DE_CONSTRUCCION.md` — fases y criterios de aceptación.

## Proyecto original (solo lectura)

`D:\Repositorios\prodigia\calibra-proyecto\` — `calibra/` (web) y `mobile/` (app). **Nunca se modifica.** Si algo no está claro, se verifica ahí; no se inventa.
Archivos clave: `calibra/src/components/Logo.tsx` (logo real), `mobile/src/tema.ts` (colores y glifos de los 15 mundos), `calibra/src/lib/mundos/precios.ts`, `calibra/docs/marketing/{BRAND,VOZ-TONO,PRODUCT-MESSAGING,SLOGANS}.md`, `calibra/src/i18n/routing.ts`.

## Disco

**Todo en D:.** C: está lleno (~2 GB libres).
- Caché de npm: `D:/.npm-cache` (ya configurada en `.npmrc` del repo). No usar `npm cache` global en C:.
- Si se usa Playwright para capturas: `PLAYWRIGHT_BROWSERS_PATH=D:/ms-playwright`.
- Temporales de scripts: dentro del repo en `.tmp/` (ignorado por git) o en D:.

## Contenido: reglas duras

- Español neutro con tuteo. **Nunca voseo** ni español peninsular.
- **Nunca mencionar la Trastienda** (ni ruleta, apuestas, «Monedas»).
- **Naipia** = memoria y cálculo mental. Nunca casinos ni apuestas.
- No prometer como disponible: cobro de Pro, Cometas, anuncios, eventos, app en Google Play.
- Nada inventado: ni reseñas, ni nombres, ni cifras de jugadores. Lo que falte → `[PENDIENTE: …]`.
- Textos en `contenido/es/`, enlaces en `contenido/config.ts`. Nunca texto suelto en componentes.

## Técnica

- Next.js App Router en la **raíz** del repo, TypeScript estricto, Tailwind 4, GSAP (+ScrollTrigger, @gsap/react), three.js + @react-three/fiber. Una sola librería de animación.
- Versiones exactas en `package.json`. `npm audit` limpio.
- Un solo escenario sticky para la intro; nunca secuestrar el scroll.
- Un solo renderer WebGL; three.js cargado en diferido y solo en modo completo.
- Todo el contenido existe como HTML real; el canvas es decorativo (`aria-hidden`).
- `prefers-reduced-motion` respetado en todo el sitio.
- Botón «Saltar intro»: pequeño, gris, esquina inferior derecha, visible desde el segundo 0, lleva al logo final (`#inicio`).
- Enlaces externos con `rel="noopener noreferrer"`. Sin secretos, sin formularios, sin rastreadores.

## Commits (obligatorio)

- **Hacer commit al terminar cada bloque de trabajo que funcione** (cada tarea marcada del plan, como mínimo uno por fase). Nunca dejar una fase entera sin commitear.
- Antes de cada commit: `npm run lint` y `npm run typecheck` en verde (y `npm run build` al cerrar cada fase). No commitear código que no compila.
- Mensajes en español, en imperativo y con prefijo de fase: `fase 1: añade encabezado y menú móvil accesible`.
- Al cerrar una fase, actualizar también `docs/PLAN_DE_CONSTRUCCION.md` (casillas marcadas) y `docs/PENDIENTES.md` si cambió algo, en el mismo commit.
- Nunca commitear `.env*.local`, `node_modules/`, `.next/`, `.tmp/` ni claves (como `API_KEY_21ST`).
- Rama `main`. No hacer `push` ni `--force` sin que el dueño lo pida.

## Verificación en cada fase

`npm run lint` · `npm run typecheck` · `npm run build` · revisar `http://localhost:3000` a 375px y 1440px · reportar con franqueza lo que quedó a medias.
