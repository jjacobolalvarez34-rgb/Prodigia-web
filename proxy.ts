import { NextResponse, type NextRequest } from "next/server";

// CSP con nonce por petición (docs/SEGURIDAD_Y_DESPLIEGUE.md §2). Next lee el
// nonce de la cabecera Content-Security-Policy de la petición y lo pone en sus
// propios scripts; por eso todas las páginas se renderizan por petición.
//
// Excepción documentada: style-src-attr 'unsafe-inline'. GSAP y
// react-three-fiber escriben atributos style="transform: …" en tiempo de
// ejecución y eso no se puede firmar con nonce. Solo cubre atributos, no
// etiquetas <style> ni scripts.
//
// En desarrollo, React necesita 'unsafe-eval' y Next inyecta <style> sin nonce
// (recarga en caliente); en style-src un nonce anula 'unsafe-inline', así que
// en desarrollo se usa solo 'unsafe-inline'.
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const desarrollo = process.env.NODE_ENV === "development";

  const politica = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${desarrollo ? " 'unsafe-eval'" : ""}`,
    desarrollo ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const cabecerasPeticion = new Headers(request.headers);
  cabecerasPeticion.set("x-nonce", nonce);
  cabecerasPeticion.set("Content-Security-Policy", politica);

  const respuesta = NextResponse.next({ request: { headers: cabecerasPeticion } });
  respuesta.headers.set("Content-Security-Policy", politica);
  return respuesta;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
