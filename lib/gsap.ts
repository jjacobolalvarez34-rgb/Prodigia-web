"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registro único de ScrollTrigger (GSAP es la única librería de animación del
// sitio). Este módulo se importa en diferido (import()) desde la intro: GSAP no
// entra en la carga inicial de la página.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
