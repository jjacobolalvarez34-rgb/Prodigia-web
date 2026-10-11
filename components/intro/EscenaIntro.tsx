"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { decidirModo } from "@/lib/capacidades";
import { EVENTO_SALTAR, EVENTO_VER, saltarIntro } from "@/lib/intro-eventos";
import { ARO, PROGRESO_VISTA, avanceAnillo, puntoDelAro } from "@/lib/progreso-intro";
import { introVista, marcarIntroVista } from "@/lib/sesion-intro";

import type { Puente3D } from "./escena3d/tipos";
import type { Lienzo2D } from "./lienzo2d";
import type { Render2D } from "./render2d";

// La escena 3D (three.js + react-three-fiber) va en un chunk aparte y solo se
// pide en modo completo, cuando se está en la parte animada de la intro y el
// navegador está libre (ARQUITECTURA.md §9).
const Escena3D = dynamic(() => import("./escena3d/Escena3D"), { ssr: false });

// Si la escena 3D falla (no carga el chunk, no hay WebGL, se pierde el
// contexto), la intro sigue en 2D: nunca se rompe la página.
class Contencion3D extends Component<{ alFallar: (motivo: string) => void; children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch(error: unknown) {
    this.props.alFallar(error instanceof Error ? error.message : "error en la escena 3D");
  }

  render() {
    return this.state.fallo ? null : this.props.children;
  }
}

// Orquestador de la intro (actos 1 a 3). Un solo ScrollTrigger con scrub
// convierte el scroll en un progreso 0 → 1 que comparten los textos, el anillo
// 2D y la escena 3D. El escenario es sticky: nunca se secuestra el scroll.
//
// GSAP y los módulos de la intro se cargan en diferido. Si la página arranca en
// #inicio (intro ya vista, o #inicio en la URL), el CSS ya muestra el cuadro
// final y la intro se prepara cuando el navegador queda libre o con la primera
// interacción: el sitio se puede usar antes.
export default function EscenaIntro() {
  const [destino3d, setDestino3d] = useState<HTMLElement | null>(null);
  const puente = useRef<Puente3D>({ p: 0, medidas: null, poseAnillo: null, ponerPluma: null, activo: false });
  const raizRef = useRef<HTMLElement | null>(null);
  const render2dRef = useRef<Render2D | null>(null);
  const lienzoRef = useRef<Lienzo2D | null>(null);

  useEffect(() => {
    const raiz = document.getElementById("intro");
    if (!raiz) return;
    raizRef.current = raiz;
    const modo = decidirModo();
    raiz.dataset.modo = modo;
    if (modo === "quieto") return;

    const html = document.documentElement;
    const limpiezas: (() => void)[] = [];
    let cancelado = false;
    let iniciada = false;
    let contexto: { revert: () => void } | null = null;
    const escuchar = (evento: string, fn: () => void, opciones?: AddEventListenerOptions) => {
      window.addEventListener(evento, fn, opciones);
      limpiezas.push(() => window.removeEventListener(evento, fn, opciones));
    };

    const iniciar = async () => {
      if (iniciada) return;
      iniciada = true;
      const [{ gsap, ScrollTrigger }, { crearRender2D }, { crearLienzo2D }] = await Promise.all([
        import("@/lib/gsap"),
        import("./render2d"),
        import("./lienzo2d"),
      ]);
      if (cancelado) return;
      contexto = gsap.context(() => montar({ gsap, ScrollTrigger, crearRender2D, crearLienzo2D }));
    };

    function montar({
      gsap,
      ScrollTrigger,
      crearRender2D,
      crearLienzo2D,
    }: Pick<typeof import("@/lib/gsap"), "gsap" | "ScrollTrigger"> &
      Pick<typeof import("./render2d"), "crearRender2D"> &
      Pick<typeof import("./lienzo2d"), "crearLienzo2D">) {
      if (!raiz) return;
      const r2d = crearRender2D(raiz);
      render2dRef.current = r2d;
      const lienzoEl = raiz.querySelector<HTMLCanvasElement>(".intro-lienzo");
      const lienzo = lienzoEl ? crearLienzo2D(lienzoEl) : null;
      lienzoRef.current = lienzo;
      const estado = puente.current;
      estado.poseAnillo = r2d.poseAnillo;
      estado.ponerPluma = r2d.ponerPluma;

      // Si se arranca en #inicio, el scroll se asegura ahí antes de calcular
      // nada (el navegador puede no haber saltado todavía al ancla).
      const ancla = document.getElementById("inicio");
      if (html.hasAttribute("data-intro-final") && ancla) {
        window.scrollTo({ top: ancla.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
      }
      // Progreso real según dónde está el scroll ahora: el primer cuadro ya es
      // el correcto, nunca un cuadro con progreso 0 que no corresponde.
      const recorrido = Math.max(1, raiz.offsetHeight - window.innerHeight);
      estado.p = Math.min(1, Math.max(0, (window.scrollY - raiz.offsetTop) / recorrido));

      const medir = () => {
        r2d.medir();
        const m = r2d.medidas();
        estado.medidas = m;
        if (m) lienzo?.medir(m.w, m.h, m.zonaTexto);
      };
      medir();

      // Solo se dibuja mientras la intro está a la vista, la pestaña activa y
      // antes del cuadro final (el logo quieto no necesita estrellas que
      // titilen ni la escena 3D, que ya cedió su lugar).
      let aLaVista = false;
      const actualizarActivo = () => {
        const si = aLaVista && document.visibilityState === "visible" && estado.p < 0.97;
        estado.activo = si;
        lienzo?.activar(si);
        // Modo completo: el 3D se pide la primera vez que se está de verdad en
        // la parte animada (no al llegar directo a #inicio).
        if (si && modo === "completo" && !raiz.dataset.capa && !raiz.hasAttribute("data-cargando-3d")) {
          raiz.setAttribute("data-cargando-3d", "");
          const pedir = () => setDestino3d(raiz.querySelector<HTMLElement>(".intro-capa3d"));
          if ("requestIdleCallback" in window) window.requestIdleCallback(pedir, { timeout: 1500 });
          else setTimeout(pedir, 300);
        }
      };
      const observador = new IntersectionObserver(([entrada]) => {
        aLaVista = entrada?.isIntersecting ?? false;
        actualizarActivo();
      });
      observador.observe(raiz);
      document.addEventListener("visibilitychange", actualizarActivo);
      limpiezas.push(() => {
        observador.disconnect();
        document.removeEventListener("visibilitychange", actualizarActivo);
        lienzo?.destruir();
      });

      let anterior = estado.p;
      let ultimaTinta = 0;
      const alActualizar = () => {
        const p = estado.p;
        if (p > 0.002) r2d.completarEscritura();
        r2d.render(p);
        lienzo?.progreso(p);
        // Tinta mientras la pluma traza el aro (en 2D; en 3D la pone la escena).
        const m = r2d.medidas();
        if (lienzo && m && !r2d.capa3D() && p > 0.07 && p < 0.63 && Math.abs(p - anterior) > 0.0004 && performance.now() - ultimaTinta > 40) {
          const punta = puntoDelAro(ARO.anguloInicio + avanceAnillo(p) * ARO.anguloArco);
          const pos = r2d.proyectar(punta.x, punta.y, r2d.poseAnillo(p));
          lienzo.tinta(pos.x, pos.y);
          ultimaTinta = performance.now();
        }
        if (anterior < 0.93 && p >= 0.93 && m) lienzo?.estallido(m.final.x, m.final.y);
        if (p >= PROGRESO_VISTA) marcarIntroVista();
        if (anterior < 0.97 !== p < 0.97) actualizarActivo();
        anterior = p;
      };

      const tween = gsap.fromTo(
        estado,
        { p: 0 },
        {
          p: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: raiz,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: () => {
              medir();
              r2d.render(estado.p);
            },
          },
          onUpdate: alActualizar,
        },
      );
      const disparador = tween.scrollTrigger;

      // Salta sin animación al progreso real del scroll (al saltar o al volver
      // arriba), en vez de dejar que el scrub lo recorra.
      const alinear = () => {
        ScrollTrigger.update();
        if (!disparador) return;
        disparador.getTween()?.progress(1);
        tween.progress(disparador.progress);
        estado.p = disparador.progress;
        anterior = estado.p;
        r2d.render(estado.p);
        actualizarActivo();
      };
      alinear();

      // Acto 1: la pluma escribe la frase al cargar, si se está arriba.
      if (estado.p < 0.002 && !html.hasAttribute("data-intro-final")) r2d.escribir();
      else r2d.completarEscritura();
      r2d.render(estado.p);
      // Desde aquí manda el JavaScript (estilos en línea según el progreso).
      html.removeAttribute("data-intro-final");

      // Mientras escribe, la pluma sigue a la punta (y deja tinta).
      const alEscribir = () => {
        if (!r2d.escribiendo() || estado.p > 0.002) return;
        r2d.render(estado.p);
        const punta = r2d.puntaActual();
        if (Math.random() < 0.5) lienzo?.tinta(punta.x, punta.y);
      };
      gsap.ticker.add(alEscribir);
      limpiezas.push(() => gsap.ticker.remove(alEscribir));

      escuchar(EVENTO_SALTAR, () => {
        r2d.completarEscritura();
        alinear();
      });
      escuchar(EVENTO_VER, () => {
        alinear();
        r2d.escribir();
      });

      // Si el foco de teclado entra al bloque final antes de tiempo, se salta.
      const final = raiz.querySelector<HTMLElement>(".intro-final");
      const alEnfocar = () => {
        if (estado.p < 0.97) saltarIntro();
      };
      final?.addEventListener("focusin", alEnfocar);
      limpiezas.push(() => final?.removeEventListener("focusin", alEnfocar));
    }

    if (html.hasAttribute("data-intro-final")) {
      // Arranca en #inicio: la intro se prepara con el navegador libre o con la
      // primera interacción (lo que llegue antes).
      const alInteractuar = () => void iniciar();
      for (const evento of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
        escuchar(evento, alInteractuar, { once: true, passive: true });
      }
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(() => void iniciar(), { timeout: 4000 });
        limpiezas.push(() => window.cancelIdleCallback(id));
      } else {
        const id = setTimeout(() => void iniciar(), 2000);
        limpiezas.push(() => clearTimeout(id));
      }
    } else {
      void iniciar();
      // Intro ya vista y se está arriba (navegación del lado del cliente a "/"):
      // a #inicio, sin robar el foco.
      if (introVista() && !window.location.hash && window.scrollY < 8) {
        requestAnimationFrame(() => saltarIntro({ enfocar: false }));
      }
    }

    return () => {
      cancelado = true;
      limpiezas.forEach((limpiar) => limpiar());
      contexto?.revert();
    };
  }, []);

  const alListo = useCallback(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    raiz.removeAttribute("data-cargando-3d");
    raiz.dataset.capa = "3d";
    render2dRef.current?.usarCapa3D(true);
    lienzoRef.current?.estrellas(false);
  }, []);

  const alFallar = useCallback((motivo: string) => {
    const raiz = raizRef.current;
    if (raiz) {
      raiz.removeAttribute("data-cargando-3d");
      raiz.dataset.capa = "2d";
      raiz.dataset.motivo2d = motivo;
    }
    render2dRef.current?.usarCapa3D(false);
    lienzoRef.current?.estrellas(true);
    setDestino3d(null);
  }, []);

  return destino3d
    ? createPortal(
        <Contencion3D alFallar={alFallar}>
          <Escena3D puente={puente} alListo={alListo} alFallar={alFallar} />
        </Contencion3D>,
        destino3d,
      )
    : null;
}
