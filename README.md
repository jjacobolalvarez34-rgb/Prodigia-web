# Prodigia-web

Página de presentación pública de **Prodigia** (la app para estudiar jugando). No es la app: la presenta y lleva a la web, a la futura app y a las redes. Se despliega en Vercel.

> Estado: **planificación terminada, construcción sin empezar.** Ver `docs/PLAN_DE_CONSTRUCCION.md`.

## Documentación

| Documento | Qué tiene |
|---|---|
| [FICHA_PRODIGIA.md](FICHA_PRODIGIA.md) | La verdad del producto (gana sobre todo) |
| [PROMPT_WEB_PRODIGIA.md](PROMPT_WEB_PRODIGIA.md) | El encargo original |
| [CLAUDE.md](CLAUDE.md) | Reglas para quien construya |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Pila, carpetas, flujo, modos de la intro, decisiones |
| [docs/DISENO.md](docs/DISENO.md) | Tokens, coreografía de la intro, partículas, secciones, botón Saltar |
| [docs/CONTENIDO.md](docs/CONTENIDO.md) | Todos los textos, los 15 mundos, reglas de contenido |
| [docs/SEGURIDAD_Y_DESPLIEGUE.md](docs/SEGURIDAD_Y_DESPLIEGUE.md) | Cabeceras, CSP, variables, SEO, pasos en Vercel |
| [docs/PLAN_DE_CONSTRUCCION.md](docs/PLAN_DE_CONSTRUCCION.md) | Fases, tareas y criterios de aceptación |
| [docs/PENDIENTES.md](docs/PENDIENTES.md) | Hallazgos, preguntas abiertas y respuestas |
| [docs/web-presentacion/referencias/README.md](docs/web-presentacion/referencias/README.md) | Los dos componentes de 21st.dev y cómo se adaptan |
| [docs/propuestas/pluma-preview.html](docs/propuestas/pluma-preview.html) | Propuesta de la pluma (abrir en el navegador) |

## Desarrollo local (cuando exista el código)

```bash
npm install     # la caché de npm va a D:/.npm-cache (ver .npmrc)
npm run dev     # http://localhost:3000
```
