// Marca de «ya viste la intro» en sessionStorage (DISENO.md §3). Se envuelve
// en try/catch: sessionStorage puede no existir o lanzar (modo privado,
// almacenamiento bloqueado), y la página tiene que funcionar igual.

export const CLAVE_INTRO_VISTA = "prodigia:intro-vista";

/**
 * Elección explícita de la persona: ver la intro animada aunque su sistema
 * pida reducir el movimiento (botón «Ver con animación» del modo quieto).
 * Se guarda en este navegador (localStorage); por defecto se respeta el ajuste.
 */
export const CLAVE_MOVIMIENTO = "prodigia:movimiento";

export function quiereMovimiento(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_MOVIMIENTO) === "si";
  } catch {
    return false;
  }
}

export function elegirMovimiento(si: boolean) {
  try {
    if (si) window.localStorage.setItem(CLAVE_MOVIMIENTO, "si");
    else window.localStorage.removeItem(CLAVE_MOVIMIENTO);
  } catch {
    // Sin almacenamiento: se sigue el ajuste del sistema.
  }
}

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
