import { gsap } from "@/lib/gsap";
import { ARO, CIUDADES_EN_ANILLO, avanceAnillo, dentroDe, limitar, puntoDelAro, ventanaTramo } from "@/lib/progreso-intro";

// Render del modo ligero (2D) y de todo lo que es DOM en los tres modos
// animados: textos, pluma, destello y logo final. Es una función del progreso
// p (0 → 1): el mismo p siempre da el mismo cuadro, así que subir y bajar con
// el scroll funciona igual en las dos direcciones.

const LARGO_ARCO = ARO.largoTrazo / ARO.circunferencia;

export const suave = (t: number) => t * t * (3 - 2 * t);
export const salida = (t: number) => 1 - (1 - t) ** 3;
export const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 antes de a, sube hasta b, 1 hasta c, baja hasta d, 0 después. */
export function fundido(p: number, a: number, b: number, c: number, d: number) {
  if (p <= a || p >= d) return 0;
  if (p < b) return suave((p - a) / (b - a));
  if (p <= c) return 1;
  return 1 - suave((p - c) / (d - c));
}

type Propiedad = "opacity" | "transform" | "pointerEvents";

export interface Pose {
  x: number;
  y: number;
  s: number;
  rx: number;
  rz: number;
}

export interface Medidas {
  w: number;
  h: number;
  escritorio: boolean;
  /** Lado del logo final (px): el anillo es ese mismo logo, escalado. */
  L: number;
  final: { x: number; y: number };
  dibujo: Pose;
  perspectiva: number;
  diametro: number;
  /** Borde izquierdo, derecho y altura de la punta para cada letra de la frase. */
  letras: { izq: number; der: number; y: number }[];
  plumaAlto: number;
  escalaEscritura: number;
  escalaDibujo: number;
  /** Zona del texto (las partículas se atenúan ahí). */
  zonaTexto: { x: number; y: number; w: number; h: number };
}

export function crearRender2D(raiz: HTMLElement) {
  const q = <T extends Element>(selector: string) => raiz.querySelector<T>(selector);
  const qq = <T extends Element>(selector: string) => Array.from(raiz.querySelectorAll<T>(selector));

  const escenario = q<HTMLElement>(".intro-escenario")!;
  const anillo = q<HTMLElement>(".intro-anillo")!;
  const giro = q<HTMLElement>(".anillo-giro")!;
  const capas = qq<SVGSVGElement>(".anillo-capa");
  const trazos = qq<SVGCircleElement>("[data-trazo]");
  const chispa = q<SVGGElement>("[data-chispa]");
  const cabeza = q<SVGGElement>("[data-cabeza]");
  const pluma = q<HTMLElement>(".intro-pluma")!;
  const destello = q<HTMLElement>(".intro-destello");
  const onda = q<HTMLElement>(".intro-onda");
  const velo = q<HTMLElement>(".intro-velo");
  const capa3d = q<HTMLElement>(".intro-capa3d");
  const final = q<HTMLElement>(".intro-final")!;
  const logoFinal = q<SVGSVGElement>("[data-logo-final]");
  const textosFinal = qq<HTMLElement>("[data-final-texto]");
  const letras = qq<HTMLElement>("[data-letra]");
  const deslizar = q<HTMLElement>(".intro-deslizar");
  const bloque = (momento: string) => q<HTMLElement>(`[data-momento="${momento}"]`);
  const frase = bloque("frase")!;
  const queEs = bloque("que-es");
  const universo = bloque("universo");
  const autor = bloque("autor");
  const tramos = CIUDADES_EN_ANILLO.reduce<number[]>((lista, c) => (lista.includes(c.tramo) ? lista : [...lista, c.tramo]), []).map(
    (i) => ({ el: bloque(`tramo-${i}`), ventana: ventanaTramo(i) }),
  );
  const puntos = new Map(qq<SVGGElement>("[data-ciudad-punto]").map((g) => [g.dataset.ciudadPunto!, g]));
  const etiquetas = new Map(qq<HTMLElement>("li[data-ciudad]").map((li) => [li.dataset.ciudad!, li]));

  let m: Medidas | null = null;
  let escritura = { n: letras.length };
  let tweenEscritura: gsap.core.Tween | null = null;
  let capa3D = false;
  const cache = new Map<string, string>();
  let escritos = new WeakMap<Element, Partial<Record<Propiedad, string>>>();

  // Escribe un estilo solo si cambió (evita trabajo de estilo en cada cuadro).
  function estilo(el: HTMLElement | SVGElement | null | undefined, propiedad: Propiedad, valor: string) {
    if (!el) return;
    const previos = escritos.get(el) ?? {};
    if (previos[propiedad] === valor) return;
    previos[propiedad] = valor;
    escritos.set(el, previos);
    el.style[propiedad] = valor;
  }

  function medir() {
    const caja = escenario.getBoundingClientRect();
    const w = caja.width;
    const h = caja.height;
    const escritorio = w >= 1024;

    // El logo final se mide con su bloque sin transformar.
    const logo = logoFinal?.getBoundingClientRect();
    const L = logo && logo.width > 0 ? logo.width : escritorio ? 160 : 112;
    const fx = logo ? logo.left - caja.left + L / 2 : w / 2;
    const fy = logo ? logo.top - caja.top + L / 2 : h * 0.4;
    anillo.style.width = `${L}px`;
    anillo.style.height = `${L}px`;

    const diametro = escritorio ? Math.min(w * 0.46, h * 0.74) : Math.min(w * 0.84, h * 0.42);
    const centro = escritorio ? { x: w * 0.68, y: h * 0.53 } : { x: w / 2, y: h * 0.3 };
    const s = diametro / (0.82 * L);

    // Letras: punta de la pluma al final de cada una, cerca de la línea base.
    const transformPrevio = frase.style.transform;
    frase.style.transform = "none";
    const medidasLetras = letras.map((letra) => {
      const r = letra.getBoundingClientRect();
      return { izq: r.left - caja.left, der: r.right - caja.left, y: r.bottom - caja.top - r.height * 0.2 };
    });
    const alturaLinea = letras[0]?.getBoundingClientRect().height ?? 60;
    frase.style.transform = transformPrevio;

    const plumaAlto = pluma.offsetHeight || 140;
    const zona = escritorio
      ? { x: 0, y: 0, w: Math.min(w * 0.46, 620), h }
      : { x: 0, y: h * 0.5, w, h: h * 0.5 };

    m = {
      w,
      h,
      escritorio,
      L,
      final: { x: fx, y: fy },
      dibujo: { x: centro.x, y: centro.y, s, rx: 62, rz: 0 },
      perspectiva: diametro * 2.4,
      diametro,
      letras: medidasLetras,
      plumaAlto,
      escalaEscritura: limitar((alturaLinea * 1.5) / plumaAlto, 0.5, 1.1),
      escalaDibujo: limitar((diametro * 0.3) / plumaAlto, 0.45, 1.4),
      zonaTexto: zona,
    };
    cache.clear();
    escritos = new WeakMap();
  }

  /** Pose del anillo para un progreso dado (en todos los modos se usa igual). */
  function poseAnillo(p: number): Pose {
    if (!m) return { x: 0, y: 0, s: 1, rx: 0, rz: 0 };
    const base = m.dibujo;
    const entrada = salida(dentroDe(p, [0, 0.15]));
    let s = base.s * mezcla(0.84, 1, entrada);
    let y = base.y + mezcla(m.diametro * 0.08, 0, entrada);
    let rx = mezcla(76, 62, entrada);
    let rz = mezcla(-10, 0, entrada);
    // La cámara se aleja y el anillo gira lento (universo en expansión).
    s *= 1 - 0.12 * suave(dentroDe(p, [0.63, 0.72]));
    rz += 16 * suave(dentroDe(p, [0.63, 0.81]));
    // Acto 3: se aplana y se encoge hasta ser el logo.
    const k = suave(dentroDe(p, [0.81, 0.93]));
    s = mezcla(s, 1, k);
    y = mezcla(y, m.final.y, k);
    rx = mezcla(rx, 0, k);
    rz = mezcla(rz, 0, k);
    return { x: mezcla(base.x, m.final.x, k), y, s, rx, rz };
  }

  /** Punto del anillo (unidades del logo) proyectado en el escenario. */
  function proyectar(ux: number, uy: number, pose: Pose) {
    if (!m) return { x: 0, y: 0 };
    let x = ((ux - 50) * m.L) / 100;
    let y = ((uy - 50) * m.L) / 100;
    const rz = (pose.rz * Math.PI) / 180;
    const rx = (pose.rx * Math.PI) / 180;
    [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
    const z = y * Math.sin(rx) * pose.s;
    y = y * Math.cos(rx) * pose.s;
    x = x * pose.s;
    const f = m.perspectiva / (m.perspectiva - z);
    return { x: pose.x + x * f, y: pose.y + y * f };
  }

  function ponerPluma(x: number, y: number, rotacion: number, escala: number, opacidad: number) {
    if (!m) return;
    const ancho = pluma.offsetWidth;
    const alto = pluma.offsetHeight;
    estilo(
      pluma,
      "transform",
      `translate3d(${(x - ancho * 0.503).toFixed(1)}px, ${(y - alto * 0.943).toFixed(1)}px, 0) rotate(${rotacion.toFixed(2)}deg) scale(${escala.toFixed(3)})`,
    );
    estilo(pluma, "opacity", opacidad.toFixed(3));
  }

  // La punta recorre cada letra de izquierda a derecha mientras se revela.
  function puntaEscritura(n: number) {
    if (!m || m.letras.length === 0) return { x: (m?.w ?? 0) / 2, y: (m?.h ?? 0) / 2 };
    if (n >= m.letras.length) {
      const ultima = m.letras[m.letras.length - 1];
      return { x: ultima.der, y: ultima.y };
    }
    const i = Math.max(0, Math.floor(n));
    const letra = m.letras[i];
    return { x: mezcla(letra.izq, letra.der, n - i), y: letra.y };
  }

  function aplicarEscritura() {
    const n = escritura.n;
    letras.forEach((letra, i) => estilo(letra, "opacity", limitar(n - i).toFixed(2)));
    if (deslizar) estilo(deslizar, "opacity", n >= letras.length ? "1" : "0");
  }

  /** Acto 1: la pluma escribe la frase, por tiempo (≈ 60 ms por letra). */
  function escribir() {
    tweenEscritura?.kill();
    escritura = { n: 0 };
    aplicarEscritura();
    tweenEscritura = gsap.to(escritura, {
      n: letras.length,
      duration: letras.length * 0.06,
      ease: "none",
      delay: 0.5,
      onUpdate: aplicarEscritura,
    });
  }

  function completarEscritura() {
    if (escritura.n >= letras.length) return;
    tweenEscritura?.kill();
    escritura = { n: letras.length };
    aplicarEscritura();
  }

  function escribiendo() {
    return escritura.n < letras.length;
  }

  function puntaActual() {
    return puntaEscritura(escritura.n);
  }

  function render(p: number) {
    if (!m) return;
    const pose = poseAnillo(p);
    const a = avanceAnillo(p);

    // ── Anillo ──
    const kLogo = suave(dentroDe(p, [0.81, 0.93]));
    estilo(
      giro,
      "transform",
      `translate3d(${(pose.x - m.L / 2).toFixed(1)}px, ${(pose.y - m.L / 2).toFixed(1)}px, 0) perspective(${m.perspectiva.toFixed(0)}px) scale3d(${pose.s.toFixed(4)}, ${pose.s.toFixed(4)}, ${pose.s.toFixed(4)}) rotateX(${pose.rx.toFixed(2)}deg) rotateZ(${pose.rz.toFixed(2)}deg)`,
    );
    const dash = `${(a * LARGO_ARCO).toFixed(4)} 1`;
    if (cache.get("dash") !== dash) {
      cache.set("dash", dash);
      trazos.forEach((trazo) => trazo.setAttribute("stroke-dasharray", dash));
    }
    const profundidad = ((1 - kLogo) * 0.55).toFixed(3);
    if (cache.get("prof") !== profundidad) {
      cache.set("prof", profundidad);
      capas.forEach((capa) => {
        const k = Number(capa.style.getPropertyValue("--k"));
        capa.style.transform = `translateZ(${(-k * Number(profundidad) * m!.L) / 100}px)`;
      });
    }
    const atenuado = 1 - 0.6 * fundido(p, 0.715, 0.735, 0.79, 0.81);
    if (capa3D) {
      // El 3D dibuja el anillo; al final cede al aro 2D, que en ese momento ya
      // es el logo (mismo lugar y tamaño), y este cede al logo de #inicio.
      const cede = suave(dentroDe(p, [0.895, 0.93]));
      estilo(anillo, "opacity", (p >= 0.95 ? 0 : cede).toFixed(3));
      estilo(capa3d, "opacity", (1 - cede).toFixed(3));
    } else {
      estilo(anillo, "opacity", (p >= 0.95 ? 0 : atenuado).toFixed(3));
    }

    // ── Ciudades: se encienden al paso de la pluma y bajan al 60 % ──
    const total = CIUDADES_EN_ANILLO.length;
    CIUDADES_EN_ANILLO.forEach((ciudad, i) => {
      const encendida = suave(dentroDe(p, [ciudad.progreso - 0.004, ciudad.progreso + 0.008]));
      const brillo = p > ventanaTramo(ciudad.tramo)[1] ? 0.6 : 1;
      // En el acto 3 se apagan una a una, al revés del trazado.
      const inicioApagado = 0.81 + (total - 1 - i) * 0.0045;
      const apagado = suave(dentroDe(p, [inicioApagado, inicioApagado + 0.012]));
      estilo(puntos.get(ciudad.slug), "opacity", (encendida * brillo * (1 - apagado)).toFixed(3));
      const etiqueta = etiquetas.get(ciudad.slug);
      if (etiqueta) {
        const visible = suave(dentroDe(p, [ciudad.progreso - 0.008, ciudad.progreso + 0.002]));
        estilo(etiqueta, "opacity", visible.toFixed(3));
        estilo(etiqueta, "transform", `translate3d(0, ${((1 - visible) * 10).toFixed(1)}px, 0)`);
      }
    });

    // ── Tinta fresca en la punta del trazo (mientras escribe) ──
    if (cabeza) {
      const brillo = fundido(p, 0.066, 0.08, 0.6, 0.645);
      const punto = puntoDelAro(ARO.anguloInicio + a * ARO.anguloArco);
      const transformacion = `translate(${punto.x.toFixed(2)} ${punto.y.toFixed(2)})`;
      if (cache.get("cabeza") !== transformacion) {
        cache.set("cabeza", transformacion);
        cabeza.setAttribute("transform", transformacion);
      }
      const opacidad = brillo.toFixed(3);
      if (cache.get("cabeza-op") !== opacidad) {
        cache.set("cabeza-op", opacidad);
        cabeza.setAttribute("opacity", opacidad);
      }
    }

    // ── Chispa: aparece cuando la pluma se posa en la apertura ──
    const kChispa = salida(dentroDe(p, [0.885, 0.93]));
    const escalaChispa = `scale(${kChispa.toFixed(3)})`;
    if (chispa && cache.get("chispa") !== escalaChispa) {
      cache.set("chispa", escalaChispa);
      chispa.setAttribute("transform", escalaChispa);
    }

    // ── Pluma (en 3D, la escena la coloca mientras traza) ──
    if (!capa3D || p <= 0.0015 || p >= 0.93) renderPluma(p, pose, a);

    // ── Textos ──
    const kFrase = suave(dentroDe(p, [0.015, 0.06]));
    estilo(frase, "opacity", (1 - kFrase).toFixed(3));
    estilo(frase, "transform", `translate3d(0, ${(-24 * kFrase).toFixed(1)}px, 0)`);
    const bloques: [HTMLElement | null, number][] = [
      [queEs, fundido(p, 0.07, 0.085, 0.135, 0.15)],
      ...tramos.map(({ el, ventana: [w0, w1] }) => [el, fundido(p, w0 + 0.002, w0 + 0.012, w1 - 0.012, w1 - 0.002)] as [HTMLElement | null, number]),
      [universo, fundido(p, 0.638, 0.652, 0.705, 0.72)],
      [autor, fundido(p, 0.722, 0.737, 0.795, 0.81)],
    ];
    let maximo = 0;
    for (const [el, op] of bloques) {
      if (!el) continue;
      maximo = Math.max(maximo, op);
      estilo(el, "opacity", op.toFixed(3));
      estilo(el, "transform", `translate3d(0, ${((1 - op) * 14).toFixed(1)}px, 0)`);
    }
    if (velo) estilo(velo, "opacity", maximo.toFixed(3));

    // ── Acto 3: destello y logo final ──
    const kDestello = dentroDe(p, [0.925, 0.99]);
    if (destello && onda) {
      const visible = kDestello > 0 && kDestello < 1;
      const base = `translate3d(${(m.final.x - 120).toFixed(1)}px, ${(m.final.y - 120).toFixed(1)}px, 0)`;
      estilo(destello, "opacity", visible ? (Math.sin(Math.PI * kDestello) * 0.95).toFixed(3) : "0");
      estilo(destello, "transform", `${base} scale(${mezcla(0.4, 2.4, salida(kDestello)).toFixed(3)})`);
      estilo(onda, "opacity", visible ? ((1 - kDestello) * 0.9).toFixed(3) : "0");
      estilo(onda, "transform", `${base} scale(${mezcla(0.35, 3.4, salida(kDestello)).toFixed(3)})`);
    }
    const kFinal = suave(dentroDe(p, [0.945, 0.985]));
    estilo(final, "opacity", p >= 0.93 ? "1" : "0");
    estilo(final, "pointerEvents", p >= 0.97 ? "auto" : "none");
    if (logoFinal) estilo(logoFinal, "opacity", p >= 0.95 ? "1" : "0");
    for (const texto of textosFinal) {
      estilo(texto, "opacity", kFinal.toFixed(3));
      estilo(texto, "transform", `translate3d(0, ${((1 - kFinal) * 12).toFixed(1)}px, 0)`);
    }
  }

  function renderPluma(p: number, pose: Pose, a: number) {
    if (!m) return;
    if (p <= 0.0015) {
      const punta = puntaActual();
      ponerPluma(punta.x, punta.y, -14, m.escalaEscritura, 1);
      return;
    }
    const inicioArco = puntoDelAro(ARO.anguloInicio);
    if (p < 0.07) {
      // Despega del final de la frase y vuela hasta el comienzo del aro.
      const t = suave(dentroDe(p, [0, 0.07]));
      const ultima = m.letras[m.letras.length - 1];
      const desde = ultima ? { x: ultima.der, y: ultima.y } : { x: m.w / 2, y: m.h / 2 };
      const hasta = proyectar(inicioArco.x, inicioArco.y, poseAnillo(0.07));
      const control = { x: (desde.x + hasta.x) / 2 + m.w * 0.08, y: Math.min(desde.y, hasta.y) - m.h * 0.28 };
      const x = (1 - t) ** 2 * desde.x + 2 * (1 - t) * t * control.x + t ** 2 * hasta.x;
      const y = (1 - t) ** 2 * desde.y + 2 * (1 - t) * t * control.y + t ** 2 * hasta.y;
      ponerPluma(x, y, mezcla(-14, -24, t), mezcla(m.escalaEscritura, m.escalaDibujo, t), 1);
      return;
    }
    if (p < 0.81) {
      // Traza el aro: la punta va donde termina el trazo.
      const angulo = ARO.anguloInicio + a * ARO.anguloArco;
      const punta = puntoDelAro(angulo);
      const pos = proyectar(punta.x, punta.y, pose);
      const flotar = dentroDe(p, [0.63, 0.7]) * m.diametro * 0.05;
      ponerPluma(pos.x, pos.y - flotar, -20 + Math.sin(p * 90) * 4, m.escalaDibujo, 1);
      return;
    }
    // Acto 3: vuela a la apertura, se encoge y se vuelve la chispa.
    const t = suave(dentroDe(p, [0.81, 0.9]));
    const fin = puntoDelAro(ARO.anguloInicio + ARO.anguloArco);
    const desde = proyectar(fin.x, fin.y, pose);
    const hacia = proyectar(ARO.chispa.x, ARO.chispa.y + 6, pose);
    const opacidad = 1 - suave(dentroDe(p, [0.875, 0.905]));
    ponerPluma(mezcla(desde.x, hacia.x, t), mezcla(desde.y, hacia.y, t), mezcla(-20, 14, t), mezcla(m.escalaDibujo, m.escalaDibujo * 0.3, t), opacidad);
  }

  return {
    medir,
    render,
    escribir,
    completarEscritura,
    escribiendo,
    puntaActual,
    poseAnillo,
    proyectar,
    ponerPluma,
    medidas: () => m,
    /** El 3D está listo: él dibuja el anillo y mueve la pluma mientras traza. */
    usarCapa3D(si: boolean) {
      capa3D = si;
      if (!si && capa3d) capa3d.style.opacity = "";
    },
    capa3D: () => capa3D,
  };
}

export type Render2D = ReturnType<typeof crearRender2D>;
