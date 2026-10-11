import type { RefObject } from "react";

import type { Medidas, Pose } from "../render2d";

/** Lo que la escena 3D comparte con el resto de la intro (sin estado de React). */
export interface Puente3D {
  /** Progreso suavizado de la intro (0 → 1), el mismo que usan los textos. */
  p: number;
  medidas: Medidas | null;
  /** Pose del anillo 2D: el 3D termina en el mismo lugar y tamaño que el logo. */
  poseAnillo: ((p: number) => Pose) | null;
  /** Coloca la pluma (DOM) donde el 3D dice que está la punta del trazo. */
  ponerPluma: ((x: number, y: number, rotacion: number, escala: number, opacidad: number) => void) | null;
  /** La escena debe dibujar (la intro está a la vista y la pestaña activa). */
  activo: boolean;
}

export interface PropsEscena3D {
  puente: RefObject<Puente3D>;
  alListo: () => void;
  alFallar: (motivo: string) => void;
}
