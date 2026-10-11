import { CLAVE_INTRO_VISTA, CLAVE_MOVIMIENTO } from "./sesion-intro";

// Script en línea de <head> (app/layout.tsx), firmado con el nonce de la CSP.
// Corre antes del primer pintado. Es corto a propósito y no depende de nada:
// - data-js: hay JavaScript, el CSS puede esconder lo que se va a revelar.
// - data-intro: "quieto" con prefers-reduced-motion (salvo que la persona
//   haya elegido «Ver con animación»), si no "animada"; así la intro se arma
//   con su diseño final desde el primer pintado, sin saltos.
// - data-intro-vista: la intro ya se vio en esta sesión y se llegó sin ancla.
//   En cuanto el HTML termina de leerse, el scroll se coloca en #inicio sin
//   animación (DISENO.md §3).
// - data-intro-final: se arranca en #inicio (ya vista, o con #inicio en la
//   URL): el CSS muestra el cuadro final desde el primer pintado, sin esperar
//   al JavaScript.
//
// Ojo: no hay app/loading.tsx a propósito. Con la CSP de nonce todas las
// páginas se renderizan por petición, y bajo un límite de carga Next manda
// primero la pantalla de carga y el contenido escondido hasta que corre
// JavaScript: sin JS (o para un buscador sin JS) no se vería nada. La carga de
// marca vive en la intro, mientras llega la escena 3D.
export const SCRIPT_INICIAL = `(function(){var d=document.documentElement;d.setAttribute("data-js","");var q=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;try{if(localStorage.getItem("${CLAVE_MOVIMIENTO}")==="si"){q=false;d.setAttribute("data-movimiento-elegido","")}}catch(e){}d.setAttribute("data-intro",q?"quieto":"animada");if(location.hash==="#inicio")d.setAttribute("data-intro-final","");try{if(sessionStorage.getItem("${CLAVE_INTRO_VISTA}")==="1"&&!location.hash){var n=performance.getEntriesByType?performance.getEntriesByType("navigation")[0]:null;if(!n||n.type==="navigate"||n.type==="reload"){d.setAttribute("data-intro-vista","");d.setAttribute("data-intro-final","");document.addEventListener("DOMContentLoaded",function(){var a=document.getElementById("inicio");if(a)window.scrollTo({top:a.getBoundingClientRect().top+window.scrollY,behavior:"instant"})})}}}catch(e){}})();`;
