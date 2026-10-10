import type { Config } from "./tipos";

// ÚNICA fuente de enlaces externos (encargo §1). Respuestas del dueño en
// docs/PENDIENTES.md §3. Un valor `null` significa «no configurado»: el botón
// no se renderiza, nunca queda un enlace roto.
export const config: Config = {
  webProdigia: "https://prodigia-sandy.vercel.app",
  idiomaWeb: "es",
  mundoDemo: "numeria",
  redes: {
    instagram: { url: "https://www.instagram.com/prodigia.app/", usuario: "@prodigia.app" },
    tiktok: null,
    youtube: null,
    x: null,
    facebook: null,
  },
  donaciones: null,
  contacto: { correo: "prodigia.oficial@gmail.com" },
  // Cambiar la firma aquí (Jacobo / Akito / Neutrón): PENDIENTES.md §4.
  autor: { firma: "Jacobo", apodos: ["Akito", "Neutrón"] },
  // La app aún no está publicada: «Próximamente», sin enlace.
  googlePlay: null,
};
