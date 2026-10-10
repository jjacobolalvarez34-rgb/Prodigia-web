import type { NextConfig } from "next";

// Cabeceras fijas de seguridad (docs/SEGURIDAD_Y_DESPLIEGUE.md §1).
// La Content-Security-Policy no va aquí: necesita un nonce por petición y la
// pone proxy.ts.
const cabecerasDeSeguridad = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: cabecerasDeSeguridad }];
  },
};

export default nextConfig;
