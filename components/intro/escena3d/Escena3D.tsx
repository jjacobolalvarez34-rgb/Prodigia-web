"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { PerspectiveCamera } from "three";

import { FOV, crearDirector } from "./director";
import type { PropsEscena3D } from "./tipos";

// Escena 3D de la intro (modo completo): un solo renderer WebGL para toda la
// página, cargado en diferido (components/intro/EscenaIntro.tsx). Toda la
// lógica por cuadro vive en director.ts; aquí solo el lienzo y el ciclo.
// El lienzo trabaja sin conversión de color ni tone mapping (flat + linear):
// los colores van tal cual en sRGB y el final coincide con el violeta del logo.

function Director({ puente, alListo, alFallar, movil }: PropsEscena3D & { movil: boolean }) {
  const { camera, size, gl } = useThree();
  const [director] = useState(() => crearDirector(movil));
  useEffect(() => () => director.destruir(), [director]);

  useFrame((_, delta) => {
    const resultado = director.cuadro({
      puente: puente.current,
      camara: camera as PerspectiveCamera,
      ancho: size.width,
      alto: size.height,
      dpr: gl.getPixelRatio(),
      delta,
    });
    if (resultado === "listo") requestAnimationFrame(() => alListo());
    else if (resultado === "lento") alFallar("rendimiento bajo (menos de 20 cuadros por segundo)");
  });

  return <primitive object={director.raiz} />;
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
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      camera={{ fov: FOV, near: 0.1, far: 600, position: [0, 12, 40] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
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
