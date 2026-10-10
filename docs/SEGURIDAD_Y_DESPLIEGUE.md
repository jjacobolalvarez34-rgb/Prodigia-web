# Seguridad y despliegue

> Estado: plan. Fecha: 2026-10-10. Encargo §7 y §8.

Es un sitio sin cuentas, sin base de datos, sin formularios y sin pagos. **Se mantiene así.**

## 1. Cabeceras

Se definen en `next.config.ts` (`headers()`) y, la CSP, en `proxy.ts` (necesita un nonce por petición).

| Cabecera | Valor |
|---|---|
| `Content-Security-Policy` | ver §2 |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (añadir `preload` solo cuando el dominio propio sea definitivo) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` |
| `X-Frame-Options` | `DENY` (respaldo de `frame-ancestors` para navegadores viejos) |
| `Cross-Origin-Opener-Policy` | `same-origin` |

## 2. Content-Security-Policy

```
default-src 'self';
script-src 'self' 'nonce-{NONCE}' 'strict-dynamic';
style-src 'self' 'nonce-{NONCE}';
style-src-attr 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self';
worker-src 'self' blob:;
object-src 'none';
base-uri 'self';
form-action 'none';
frame-ancestors 'none';
upgrade-insecure-requests;
```

- **Nonce:** `proxy.ts` genera un nonce aleatorio por petición, lo pone en la cabecera y en `x-nonce`; Next lo aplica a sus scripts. Consecuencia: la página se renderiza por petición (no 100 % estática). En Vercel el costo es bajo y se acepta (decisión D7 en `ARQUITECTURA.md`).
- **Excepción documentada — `style-src-attr 'unsafe-inline'`:** GSAP y react-three-fiber escriben estilos en línea (`style="transform: …"`) en tiempo de ejecución. Eso no se puede firmar con nonce. Se permite **solo para atributos `style`**, no para etiquetas `<style>` ni scripts. El riesgo es bajo (no ejecuta código).
- **Desarrollo:** `next dev` necesita `'unsafe-eval'`; se añade **solo** cuando `NODE_ENV === "development"`.
- Fuentes autoalojadas con `next/font` → `font-src 'self'` sin dominios de Google.
- Si algún día se añade analítica sin cookies, se suma su dominio a `script-src`/`connect-src` y se dice en Privacidad.

## 3. Otras reglas

- **Ningún secreto** en el cliente ni en el repo. Solo variables `NEXT_PUBLIC_*` no sensibles. `.env.local` en `.gitignore`.
- **Enlaces externos** siempre con `target="_blank" rel="noopener noreferrer"` (componente `EnlaceExterno` único).
- **Sin formularios** en la v1 (contacto por enlace). Si se añade uno después: validación en servidor, límite de peticiones y honeypot.
- **Dependencias mínimas**, versiones exactas, `npm audit` limpio antes de cada despliegue.
- **Sin rastreadores** ni píxeles de terceros. Sin cookies.
- **Datos del repo:** `datos/actividad.json` solo lleva fechas y conteos (sin mensajes, autores ni correos).

## 4. Variables de entorno (`.env.example`)

```bash
# URL pública de ESTE sitio (metadatos, Open Graph, sitemap). Cambiar al dominio propio sin tocar código.
NEXT_PUBLIC_SITE_URL=https://prodigia-presentacion.vercel.app

# Solo para scripts locales: ruta al repo de Prodigia para generar datos/actividad.json.
PRODIGIA_REPO_PATH=D:/Repositorios/prodigia
```

Los enlaces a la web de Prodigia, redes, donaciones y contacto **no** son variables de entorno: viven en `contenido/config.ts` (encargo §1: un único `config`).

## 5. SEO

- `metadata` en `app/layout.tsx` con `metadataBase = NEXT_PUBLIC_SITE_URL`; título, descripción, Open Graph y Twitter.
- `app/opengraph-image.tsx`: imagen social generada (logo real + anillo + estrellas, 1200×630).
- `app/icon.svg` (el logo real), `apple-icon.png` (180px, fondo `#090C14`), `manifest.ts`.
- `sitemap.ts` (`/`, `/privacidad`) y `robots.ts` (permitir todo, apuntar al sitemap).
- `lang="es"`. Todo el contenido de la intro como HTML real (indexable).

## 6. Despliegue en Vercel (pasos)

1. Subir este repo a GitHub (repo propio del sitio).
2. En Vercel: **Add New → Project →** importar el repo. *Framework*: Next.js. **Root Directory: `./`** (la app está en la raíz; ver decisión D1).
3. Variables: `NEXT_PUBLIC_SITE_URL` = la URL que asigne Vercel (`https://<proyecto>.vercel.app`).
4. Deploy. Comprobar cabeceras con `curl -I https://<proyecto>.vercel.app` y en https://securityheaders.com.
5. **Dominio propio (después):** Vercel → Settings → Domains → añadir el dominio, configurar DNS, cambiar `NEXT_PUBLIC_SITE_URL` y volver a desplegar. Recién entonces considerar `preload` en HSTS.
6. Antes de cada despliegue: `npm run actividad` (si cambió el repo de Prodigia), `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit`.

Esta guía se copiará, resumida, al `README.md` del repo al final de la construcción.
