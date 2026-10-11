// Decide el modo de la intro en el cliente (ARQUITECTURA.md §6):
// - quieto: prefers-reduced-motion. Sin vuelo ni cámara; bloques con fundidos.
// - completo: WebGL2, equipo capaz y sin ahorro de datos. Anillo 3D en diferido.
// - ligero: todo lo demás (o si el 3D falla). Anillo 2D en SVG/CSS.
// Mientras se decide se pinta el ligero, que no depende de nada pesado.

import { quiereMovimiento } from "./sesion-intro";

export type ModoIntro = "quieto" | "ligero" | "completo";

interface NavegadorExtendido extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

export function prefiereQuieto() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches && !quiereMovimiento();
}

function tieneWebGL2() {
  try {
    const lienzo = document.createElement("canvas");
    const contexto = lienzo.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    const hay = !!contexto;
    contexto?.getExtension("WEBGL_lose_context")?.loseContext();
    return hay;
  } catch {
    return false;
  }
}

export function decidirModo(): ModoIntro {
  if (prefiereQuieto()) return "quieto";

  // Parámetro de depuración (solo en desarrollo): ?sin3d=1 fuerza el modo ligero.
  if (process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("sin3d")) {
    return "ligero";
  }

  const nav = navigator as NavegadorExtendido;
  if (nav.connection?.saveData) return "ligero";
  if ((nav.hardwareConcurrency ?? 0) < 4) return "ligero";
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return "ligero";
  if (!tieneWebGL2()) return "ligero";
  return "completo";
}
