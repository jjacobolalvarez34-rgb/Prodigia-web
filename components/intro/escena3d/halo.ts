import * as THREE from "three";

import { ARO } from "@/lib/progreso-intro";

import { RADIO } from "./anillo";

// Halo violeta alrededor de la banda (atmósfera del mundo-anillo): un plano en
// el plano del anillo con un brillo que cae suave a los dos lados del radio.
// Sigue al trazo (solo brilla donde el aro ya está dibujado) y se apaga al
// volverse logo.
const VERTICE = /* glsl */ `
varying vec3 vLocal;
void main() {
  vLocal = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENTO = /* glsl */ `
uniform float uRadio;
uniform float uInicio;
uniform float uArco;
uniform float uFin;
uniform float uOpacidad;
uniform vec3 uColor;
varying vec3 vLocal;
void main() {
  // El plano está girado -90° en X: su (x, y) local es el (x, -z) del anillo.
  vec2 p = vec2(vLocal.x, -vLocal.y);
  float r = length(p);
  float angulo = degrees(atan(p.y, p.x));
  float relativo = mod(angulo - uInicio + 360.0, 360.0) / uArco;
  // Bordes angulares suaves (al comienzo y en la punta del trazo): si no, el
  // sector sin trazar se lee como una cuña oscura.
  float dibujado = smoothstep(0.0, 0.06, relativo) * (1.0 - smoothstep(uFin - 0.06, uFin, relativo)) * step(relativo, 1.0);
  // Ceñido a la banda. pow() con base negativa no está definido en GLSL: se
  // eleva al cuadrado a mano.
  float d = (r - uRadio) / 1.25;
  float brillo = exp(-d * d);
  gl_FragColor = vec4(uColor, brillo * dibujado * 0.3 * uOpacidad);
}
`;

export function crearHalo() {
  const geometria = new THREE.PlaneGeometry(RADIO * 3.4, RADIO * 3.4);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uRadio: { value: RADIO - 1.2 },
      uInicio: { value: ARO.anguloInicio },
      uArco: { value: ARO.anguloArco },
      uFin: { value: 0 },
      uOpacidad: { value: 1 },
      uColor: { value: new THREE.Vector3(0.49, 0.36, 1) },
    },
  });
  const malla = new THREE.Mesh(geometria, material);
  malla.rotation.x = -Math.PI / 2;
  malla.position.y = -0.2;
  malla.frustumCulled = false;
  malla.renderOrder = -1;
  return {
    malla,
    actualizar(fin: number, opacidad: number) {
      material.uniforms.uFin.value = fin;
      material.uniforms.uOpacidad.value = opacidad;
    },
    destruir() {
      geometria.dispose();
      material.dispose();
    },
  };
}
