// Partículas del modo ligero en un solo canvas 2D (DISENO.md §5): estrellas
// lejanas que titilan con un leve paralaje, tinta dorada que nace en la punta
// de la pluma y el estallido del destello. Presupuesto: estrellas 250 (móvil
// 140), tinta 40 vivas, estallido 80. Nunca tapan el texto: en la zona de texto
// su opacidad baja al 30 %. Solo dibuja mientras la intro está a la vista.

interface Estrella {
  x: number;
  y: number;
  r: number;
  alfa: number;
  periodo: number;
  fase: number;
  capa: 0 | 1;
  lila: boolean;
}

interface Particula {
  tipo: "tinta" | "estallido";
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  edad: number;
  r: number;
  color: [number, number, number];
}

interface Zona {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MAX_TINTA = 40;
const ORO: [number, number, number] = [255, 197, 61];
const ORO_CLARO: [number, number, number] = [255, 231, 163];
const VIOLETA: [number, number, number] = [167, 148, 255];

// Pseudoaleatorio con semilla: el cielo es siempre el mismo.
function aleatorio(semilla: number) {
  let s = semilla;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function crearLienzo2D(lienzo: HTMLCanvasElement) {
  const ctx = lienzo.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  let estrellas: Estrella[] = [];
  let particulas: Particula[] = [];
  let zona: Zona | null = null;
  let progreso = 0;
  let activo = false;
  let conEstrellas = true;
  let cuadro = 0;
  let ultimo = 0;

  function medir(ancho: number, alto: number, zonaTexto: Zona | null) {
    w = ancho;
    h = alto;
    zona = zonaTexto;
    dpr = Math.min(window.devicePixelRatio || 1, ancho < 768 ? 1.5 : 1.75);
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    const cantidad = ancho < 768 ? 140 : 250;
    const azar = aleatorio(20261010);
    estrellas = Array.from({ length: cantidad }, () => ({
      x: azar() * ancho,
      y: azar() * alto,
      r: azar() < 0.85 ? 0.6 + azar() * 0.4 : 1 + azar() * 0.6,
      alfa: 0.25 + azar() * 0.55,
      periodo: 3000 + azar() * 4000,
      fase: azar() * Math.PI * 2,
      capa: azar() < 0.6 ? 0 : 1,
      lila: azar() < 0.25,
    }));
  }

  function enZona(x: number, y: number) {
    return !!zona && x >= zona.x && x <= zona.x + zona.w && y >= zona.y && y <= zona.y + zona.h;
  }

  function dibujar(t: number) {
    if (!ctx) return;
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Estrellas: dos capas con un paralaje leve según el progreso.
    for (const e of conEstrellas ? estrellas : []) {
      const desplazamiento = progreso * (e.capa === 0 ? 30 : 70);
      const y = (((e.y - desplazamiento) % h) + h) % h;
      let alfa = e.alfa * (0.6 + 0.4 * Math.sin(t / e.periodo + e.fase));
      if (enZona(e.x, y)) alfa *= 0.3;
      ctx.fillStyle = e.lila ? `rgba(185,168,255,${alfa.toFixed(3)})` : `rgba(244,246,251,${alfa.toFixed(3)})`;
      if (e.r < 1) ctx.fillRect(e.x, y, e.r * 1.6, e.r * 1.6);
      else {
        ctx.beginPath();
        ctx.arc(e.x, y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Tinta y estallido, aditivos.
    if (particulas.length > 0) {
      ctx.globalCompositeOperation = "lighter";
      particulas = particulas.filter((pa) => {
        pa.edad += dt;
        if (pa.edad >= pa.vida) return false;
        pa.vx *= 0.98;
        pa.vy = pa.vy * 0.98 + 60 * dt;
        pa.x += pa.vx * dt;
        pa.y += pa.vy * dt;
        let alfa = 1 - pa.edad / pa.vida;
        if (enZona(pa.x, pa.y)) alfa *= 0.3;
        const [r, g, b] = pa.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${alfa.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pa.x, pa.y, pa.r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalCompositeOperation = "source-over";
    }

    if (activo) cuadro = requestAnimationFrame(dibujar);
  }

  return {
    medir,
    progreso(p: number) {
      progreso = p;
    },
    /** Gotas de tinta en la punta de la pluma. */
    tinta(x: number, y: number) {
      if (particulas.filter((pa) => pa.tipo === "tinta").length >= MAX_TINTA) return;
      particulas.push({
        tipo: "tinta",
        x,
        y,
        vx: (Math.random() - 0.5) * 40,
        vy: 10 + Math.random() * 30,
        vida: 0.6 + Math.random() * 0.4,
        edad: 0,
        r: 0.8 + Math.random() * 1.4,
        color: Math.random() < 0.7 ? ORO : ORO_CLARO,
      });
    },
    /** Estallido radial del destello del logo (una sola vez). */
    estallido(x: number, y: number) {
      for (let i = 0; i < 80; i++) {
        const angulo = (i / 80) * Math.PI * 2 + Math.random() * 0.2;
        const rapidez = 90 + Math.random() * 180;
        particulas.push({
          tipo: "estallido",
          x,
          y,
          vx: Math.cos(angulo) * rapidez,
          vy: Math.sin(angulo) * rapidez,
          vida: 0.9 + Math.random() * 0.15,
          edad: 0,
          r: 1 + Math.random() * 1.6,
          color: Math.random() < 0.6 ? ORO : VIOLETA,
        });
      }
    },
    /** En modo completo las estrellas las pone la escena 3D. */
    estrellas(si: boolean) {
      conEstrellas = si;
    },
    activar(si: boolean) {
      if (si === activo) return;
      activo = si;
      if (si) {
        ultimo = 0;
        cuadro = requestAnimationFrame(dibujar);
      } else cancelAnimationFrame(cuadro);
    },
    destruir() {
      activo = false;
      cancelAnimationFrame(cuadro);
    },
  };
}

export type Lienzo2D = ReturnType<typeof crearLienzo2D>;
