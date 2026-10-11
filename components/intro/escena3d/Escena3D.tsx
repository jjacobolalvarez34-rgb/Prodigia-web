"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { FOV, crearDirector } from "./director";
import type { PropsEscena3D } from "./tipos";

// Escena 3D de la intro (modo completo): un solo renderer WebGL para toda la
// página, cargado en diferido (components/intro/EscenaIntro.tsx). Toda la
// lógica por cuadro vive en director.ts; aquí, el lienzo y el ciclo de dibujo.
//
// - Lienzo opaco (#090C14) y sin conversión de color ni tone mapping (flat +
//   linear): los colores van tal cual en sRGB, así el final coincide con el
//   violeta del logo. Encima van las mismas nebulosas y viñeta del cielo del
//   sitio (globals.css, .intro-capa3d::after).
// - Brillo real (bloom) en escritorio: el neón de las ventanas, los filos del
//   anillo y la tinta dorada irradian luz. En móvil va sin bloom.
// - Si el equipo no llega a 30 cuadros por segundo, primero se apaga el bloom;
//   si no llega a 20, la intro vuelve al 2D.

const FONDO = "#090C14";

function crearEfectos(gl: THREE.WebGLRenderer, escena: THREE.Scene, camara: THREE.Camera, ancho: number, alto: number) {
  const destino = new THREE.WebGLRenderTarget(ancho, alto, { type: THREE.HalfFloatType, samples: 4 });
  const compositor = new EffectComposer(gl, destino);
  compositor.addPass(new RenderPass(escena, camara));
  const brillo = new UnrealBloomPass(new THREE.Vector2(ancho / 2, alto / 2), 0.85, 0.55, 0.62);
  compositor.addPass(brillo);
  return {
    dibujar: () => compositor.render(),
    medir: (w: number, h: number, dpr: number) => {
      compositor.setPixelRatio(dpr);
      compositor.setSize(w, h);
    },
    destruir: () => {
      brillo.dispose();
      compositor.dispose();
      destino.dispose();
    },
  };
}

function Director({ puente, alListo, alFallar, movil }: PropsEscena3D & { movil: boolean }) {
  const { camera, size, gl, scene } = useThree();
  const [director] = useState(() => crearDirector(movil));
  const [efectos] = useState(() => (movil ? null : crearEfectos(gl, scene, camera, size.width, size.height)));
  const [rendimiento] = useState(() => ({ conBrillo: !movil, cuadros: 0, suma: 0 }));

  useEffect(() => () => director.destruir(), [director]);
  useEffect(() => () => efectos?.destruir(), [efectos]);
  useEffect(() => {
    efectos?.medir(size.width, size.height, gl.getPixelRatio());
  }, [efectos, size.width, size.height, gl]);

  // Lógica del cuadro (prioridad 0: antes del dibujo).
  useFrame((_, delta) => {
    const resultado = director.cuadro({
      puente: puente.current,
      camara: camera as THREE.PerspectiveCamera,
      ancho: size.width,
      alto: size.height,
      dpr: gl.getPixelRatio(),
      delta,
    });
    if (resultado === "listo") requestAnimationFrame(() => alListo());
    const veredicto = medirRendimiento(rendimiento, delta);
    if (veredicto === "lento") alFallar("rendimiento bajo (menos de 20 cuadros por segundo)");
  });

  // Dibujo (prioridad 1: R3F deja de dibujar solo y lo hacemos aquí).
  useFrame(() => {
    if (efectos && rendimiento.conBrillo) efectos.dibujar();
    else gl.render(scene, camera);
  }, 1);

  return <primitive object={director.raiz} />;
}

/** Mide 90 cuadros (tras 20 de arranque): sin bloom si no llega a 30 fps; 2D si no llega a 20. */
function medirRendimiento(r: { conBrillo: boolean; cuadros: number; suma: number }, delta: number) {
  r.cuadros += 1;
  if (r.cuadros > 20 && r.cuadros <= 110) r.suma += delta;
  if (r.cuadros !== 110) return null;
  const promedio = r.suma / 90;
  if (r.conBrillo && promedio > 1 / 30) {
    r.conBrillo = false;
    r.cuadros = 0;
    r.suma = 0;
    return null;
  }
  return promedio > 1 / 20 ? "lento" : null;
}

export default function Escena3D(props: PropsEscena3D) {
  const { puente, alFallar } = props;
  const [movil] = useState(() => window.innerWidth < 768);
  // Solo dibuja mientras la intro está a la vista y la pestaña activa.
  const [activo, setActivo] = useState(true);
  useEffect(() => {
    const id = window.setInterval(() => setActivo(puente.current.activo), 300);
    return () => window.clearInterval(id);
  }, [puente]);

  return (
    <Canvas
      flat
      linear
      dpr={[1, movil ? 1.5 : 1.75]}
      frameloop={activo ? "always" : "never"}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      camera={{ fov: FOV, near: 0.1, far: 600, position: [0, 12, 40] }}
      onCreated={({ gl }) => {
        gl.setClearColor(FONDO, 1);
        gl.domElement.addEventListener("webglcontextlost", (evento) => {
          evento.preventDefault();
          alFallar("se perdió el contexto WebGL");
        });
      }}
    >
      <Director {...props} movil={movil} />
    </Canvas>
  );
}
