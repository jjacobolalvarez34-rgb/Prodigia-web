// Script en línea que corre en <head> antes del primer pintado (app/layout.tsx,
// con el nonce de la CSP). Marca <html data-js> para que el CSS solo oculte lo
// que se va a revelar cuando de verdad hay JavaScript.
export const SCRIPT_INICIAL = `document.documentElement.setAttribute("data-js","");`;
