// Marca de «ya viste la intro» en sessionStorage (DISENO.md §3). Se envuelve
// en try/catch: sessionStorage puede no existir o lanzar (modo privado,
// almacenamiento bloqueado), y la página tiene que funcionar igual.

export const CLAVE_INTRO_VISTA = "prodigia:intro-vista";

export function introVista(): boolean {
  try {
    return window.sessionStorage.getItem(CLAVE_INTRO_VISTA) === "1";
  } catch {
    return false;
  }
}

export function marcarIntroVista() {
  try {
    window.sessionStorage.setItem(CLAVE_INTRO_VISTA, "1");
  } catch {
    // Sin almacenamiento: la intro se vuelve a mostrar, nada más.
  }
}

export function olvidarIntro() {
  try {
    window.sessionStorage.removeItem(CLAVE_INTRO_VISTA);
  } catch {
    // Igual que arriba.
  }
}
