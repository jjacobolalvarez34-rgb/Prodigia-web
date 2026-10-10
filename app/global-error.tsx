"use client";

import Logo from "@/components/marca/Logo";
import { es } from "@/contenido/es";

// Error en el layout raíz. Reemplaza al layout entero, así que no depende de
// él: arma su propio documento, sin globals.css ni next/font, con estilos
// mínimos en atributos style (permitidos por style-src-attr) y fuentes del
// sistema (DISENO.md §7).
const fondo = "#090C14";
const texto = "#F4F6FB";
const texto2 = "#8892B0";

const boton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 28px",
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 600,
  fontFamily: "inherit",
  textDecoration: "none",
  cursor: "pointer",
} as const;

export default function ErrorGlobal({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = es.sitio.estados.error;

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: 16,
          background: fondo,
          color: texto,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          colorScheme: "dark",
        }}
      >
        <title>{t.titulo}</title>
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Logo size={112} />
          <h1 style={{ margin: "32px 0 0", fontSize: "clamp(1.875rem, 1.3rem + 2.4vw, 3.5rem)", lineHeight: 1.1 }}>{t.titulo}</h1>
          <p style={{ margin: "16px 0 0", maxWidth: 440, color: texto2, lineHeight: 1.6 }}>{t.texto}</p>
          <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{ ...boton, border: 0, background: "linear-gradient(120deg, #7C5CFF, #FFC53D)", color: "#05070D" }}
            >
              {t.reintentar}
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- recarga completa a propósito: el layout raíz falló */}
            <a href="/" style={{ ...boton, border: "1px solid #232B47", background: "#171D34", color: texto }}>
              {t.volver}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
