"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import Logo from "@/components/marca/Logo";
import { buttonVariants } from "@/components/ui/button";

import EnlaceExterno from "./EnlaceExterno";

interface Props {
  enlaces: readonly { href: string; etiqueta: string }[];
  cta: { href: string; etiqueta: string };
  instagram: { url: string; usuario: string; etiqueta: string } | null;
  textos: { abrir: string; cerrar: string; titulo: string; irAlInicio: string; nombre: string };
}

const ID_PANEL = "menu-movil";
const ENFOCABLES = "a[href], button:not([disabled])";

function suscribirNada() {
  return () => {};
}

// El resto de la página vive en #raiz (app/layout.tsx); el panel se monta
// fuera, en <body>, para poder dejar #raiz inerte mientras el menú está abierto.
function bloquearPagina() {
  const raiz = document.getElementById("raiz");
  if (raiz) raiz.inert = true;
  document.documentElement.style.overflow = "hidden";
}

function liberarPagina() {
  const raiz = document.getElementById("raiz");
  if (raiz) raiz.inert = false;
  document.documentElement.style.overflow = "";
}

type Gsap = typeof import("gsap").gsap;
let gsapCargado: Promise<Gsap> | null = null;

/** GSAP (solo el núcleo) en diferido; la segunda vez sale de la caché. */
function cargarGsap() {
  gsapCargado ??= import("gsap").then((modulo) => modulo.gsap);
  return gsapCargado;
}

function prefiereQuieto() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Menú a pantalla completa para móvil y tablet (<1024px). Reescritura de
// «sterling-gate kinetic navigation» (docs/web-presentacion/referencias/README.md §2):
// el panel se revela desde el botón con un círculo, los enlaces entran
// escalonados y una onda violeta→dorada los recorre al pasar el puntero o el
// foco. Es un diálogo modal: trampa de foco, Escape, #raiz inerte y foco de
// vuelta al botón al cerrar.
export default function MenuMovil({ enlaces, cta, instagram, textos }: Props) {
  const montado = useSyncExternalStore(suscribirNada, () => true, () => false);
  const [abierto, setAbierto] = useState(false);
  // El panel sigue en pantalla durante la animación de salida.
  const [visible, setVisible] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const primerEnlaceRef = useRef<HTMLAnchorElement>(null);
  const devolverFoco = useRef(true);
  const animacion = useRef<{ kill: () => void } | null>(null);

  const abrir = () => {
    setVisible(true);
    setAbierto(true);
  };

  // Se libera la página en el acto (no al final de la animación) para que un
  // enlace a una sección pueda desplazar y enfocar la página de inmediato.
  const cerrar = useCallback((opciones?: { devolverFoco?: boolean }) => {
    devolverFoco.current = opciones?.devolverFoco ?? true;
    liberarPagina();
    setAbierto(false);
  }, []);

  // Animación de apertura y cierre. GSAP se carga en diferido (se precarga al
  // acercarse al botón): no pesa en la carga inicial de la página.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !visible) return;
    let cancelado = false;
    const quieto = prefiereQuieto();
    const caja = botonRef.current?.getBoundingClientRect();
    const x = caja ? caja.left + caja.width / 2 : window.innerWidth - 40;
    const y = caja ? caja.top + caja.height / 2 : 32;

    if (abierto) {
      bloquearPagina();
      // Arranca cerrado mientras llega GSAP (si aún no estaba precargado).
      if (quieto) panel.style.opacity = "0";
      else panel.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      primerEnlaceRef.current?.focus();
    }

    cargarGsap().then((gsap) => {
      if (cancelado) return;
      animacion.current?.kill();
      if (abierto) {
        const items = panel.querySelectorAll("[data-item]");
        const radio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        animacion.current = quieto
          ? gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" })
          : gsap
              .timeline()
              .fromTo(
                panel,
                { clipPath: `circle(0px at ${x}px ${y}px)` },
                { clipPath: `circle(${radio}px at ${x}px ${y}px)`, duration: 0.6, ease: "power3.inOut" },
              )
              .fromTo(
                items,
                { yPercent: 40, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power3.out" },
                "-=0.32",
              );
        return;
      }
      const terminar = () => {
        gsap.set(panel, { clearProps: "clipPath,opacity" });
        setVisible(false);
        if (devolverFoco.current) botonRef.current?.focus();
      };
      animacion.current = quieto
        ? gsap.to(panel, { opacity: 0, duration: 0.15, ease: "power2.in", onComplete: terminar })
        : gsap.to(panel, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.4, ease: "power2.in", onComplete: terminar });
    });

    return () => {
      cancelado = true;
    };
  }, [abierto, visible]);

  useEffect(() => () => animacion.current?.kill(), []);

  // Si la ventana crece a escritorio con el menú abierto, se cierra (el botón
  // desaparece a partir de 1024px).
  useEffect(() => {
    const escritorio = window.matchMedia("(min-width: 1024px)");
    const alCambiar = (e: MediaQueryListEvent) => {
      if (e.matches) cerrar({ devolverFoco: false });
    };
    escritorio.addEventListener("change", alCambiar);
    return () => escritorio.removeEventListener("change", alCambiar);
  }, [cerrar]);

  useEffect(() => liberarPagina, []);

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cerrar();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const enfocables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(ENFOCABLES));
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (!primero || !ultimo) return;
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  };

  // Onda: el color recorre el texto del enlace; con puntero fino, los vecinos
  // se apartan unos píxeles. Sin movimiento si se prefiere quieto.
  const onda = (indice: number, apartar: boolean) => {
    const panel = panelRef.current;
    if (!panel || prefiereQuieto()) return;
    const textos = panel.querySelectorAll<HTMLElement>("[data-onda]");
    const actual = textos[indice];
    if (!actual) return;
    void cargarGsap().then((gsap) => {
      gsap.fromTo(actual, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 0.7, ease: "power2.out", overwrite: "auto" });
      if (!apartar) return;
      textos.forEach((texto, j) => {
        const distancia = Math.abs(j - indice);
        const x = distancia === 0 ? 10 : distancia === 1 ? 6 : distancia === 2 ? 3 : 0;
        gsap.to(texto, { x, duration: 0.35, ease: "power3.out" });
      });
    });
  };

  const calmar = () => {
    const panel = panelRef.current;
    if (!panel) return;
    void cargarGsap().then((gsap) => {
      gsap.to(panel.querySelectorAll("[data-onda]"), { x: 0, duration: 0.35, ease: "power3.out" });
    });
  };

  const panel = (
    <div
      id={ID_PANEL}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={textos.titulo}
      hidden={!visible}
      onKeyDown={alTeclear}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-fondo lg:hidden"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl shrink-0 items-center justify-between px-4 sm:px-6">
        <Link
          href="/#inicio"
          aria-label={textos.irAlInicio}
          onClick={() => cerrar({ devolverFoco: false })}
          className="-ml-2 flex min-h-11 items-center gap-2.5 rounded-full px-2"
        >
          <Logo size={28} />
          <span className="font-display text-lg font-semibold tracking-tight">{textos.nombre}</span>
        </Link>
        <button
          type="button"
          onClick={() => cerrar()}
          aria-label={textos.cerrar}
          className="-mr-2 grid size-11 place-items-center rounded-full text-texto transition-colors hover:bg-sup-2"
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label={textos.titulo} className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
        <ul onPointerLeave={calmar} className="flex flex-col gap-1">
          {enlaces.map((enlace, i) => (
            <li key={enlace.href} data-item>
              <Link
                ref={i === 0 ? primerEnlaceRef : undefined}
                href={enlace.href}
                onClick={() => cerrar({ devolverFoco: false })}
                onPointerEnter={(e) => onda(i, e.pointerType === "mouse")}
                onPointerDown={(e) => e.pointerType !== "mouse" && onda(i, false)}
                onFocus={() => onda(i, false)}
                className="inline-flex min-h-11 items-center rounded-chip py-1 font-display text-[clamp(2rem,9vw,3.25rem)] leading-[1.1] font-semibold tracking-tight"
              >
                <span data-onda className="texto-onda inline-block will-change-transform">
                  {enlace.etiqueta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div data-item className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
        <EnlaceExterno href={cta.href} className={buttonVariants({ size: "lg" })}>
          {cta.etiqueta}
        </EnlaceExterno>
        {instagram && (
          <EnlaceExterno
            href={instagram.url}
            className="inline-flex min-h-11 items-center gap-2 text-texto-2 transition-colors hover:text-texto"
          >
            {instagram.etiqueta} <span className="font-mono text-etiqueta">{instagram.usuario}</span>
          </EnlaceExterno>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        onClick={abrir}
        onPointerEnter={() => void cargarGsap()}
        onFocus={() => void cargarGsap()}
        onTouchStart={() => void cargarGsap()}
        aria-label={textos.abrir}
        aria-expanded={abierto}
        aria-controls={montado ? ID_PANEL : undefined}
        className="-mr-2 grid size-11 place-items-center rounded-full text-texto transition-colors hover:bg-sup-2 lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 8h16M4 16h16" />
        </svg>
      </button>
      {montado && createPortal(panel, document.body)}
    </>
  );
}
