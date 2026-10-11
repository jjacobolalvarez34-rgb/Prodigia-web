import * as THREE from "three";

import { ARO, avanceAnillo, dentroDe } from "@/lib/progreso-intro";

import { fundido, mezcla, suave } from "../render2d";
import { PERFIL, RADIO, SUELO, crearGeometriaAnillo, crearMaterialAnillo, indicesParaFraccion, perfil } from "./anillo";
import { crearCiudades } from "./ciudades";
import { crearHalo } from "./halo";
import { crearEstrellas, crearRastro } from "./particulas";
import type { Puente3D } from "./tipos";

// Lógica imperativa de la escena 3D, fuera de React: cada cuadro lee el
// progreso compartido (puente.p) y la pose del anillo 2D (tamaño y lugar en
// pantalla), mueve la cámara, traza el anillo, enciende las ciudades, emite el
// rastro y le dice a la pluma (SVG del DOM) dónde está la punta del trazo.

export const FOV = 35;
const RAD = Math.PI / 180;

interface DatosCamara {
  posicion: THREE.Vector3;
  arriba: THREE.Vector3;
  desplazamiento: { x: number; y: number };
}

export interface Cuadro {
  puente: Puente3D;
  camara: THREE.PerspectiveCamera;
  ancho: number;
  alto: number;
  dpr: number;
  delta: number;
}

/** Cámara para un progreso: elevación, órbita y distancia salen de la pose 2D. */
function camaraPara(puente: Puente3D, p: number, ancho: number, alto: number, salida: DatosCamara) {
  const m = puente.medidas!;
  const pose = puente.poseAnillo!(p);
  // Radio exterior proyectado = el del aro 2D (r 41 de 100 del logo).
  const radioPx = 0.41 * m.L * pose.s;
  const distancia = (RADIO * (alto / 2)) / (radioPx * Math.tan((FOV * RAD) / 2));
  // rotateX 62° del 2D = cámara 28° sobre el plano del anillo; 0° = desde arriba.
  const elevacion = (90 - pose.rx) * RAD;
  // Sigue a la pluma con una órbita lenta (≤ 25° por cada 100svh de scroll).
  const orbita = (-18 + 62 * suave(dentroDe(p, [0.07, 0.63]))) * (1 - suave(dentroDe(p, [0.81, 0.93]))) * RAD;
  salida.posicion.set(
    distancia * Math.cos(elevacion) * Math.sin(orbita),
    distancia * Math.sin(elevacion),
    distancia * Math.cos(elevacion) * Math.cos(orbita),
  );
  // Al quedar desde arriba, «arriba» de la pantalla pasa a ser −Z (como el logo).
  const k = suave(dentroDe(90 - pose.rx, [55, 88]));
  salida.arriba.set(0, 1 - k, -k).normalize();
  salida.desplazamiento.x = ancho / 2 - pose.x;
  salida.desplazamiento.y = alto / 2 - pose.y;
  return pose;
}

function aplicarCamara(camara: THREE.PerspectiveCamera, datos: DatosCamara, ancho: number, alto: number) {
  camara.position.copy(datos.posicion);
  camara.up.copy(datos.arriba);
  camara.lookAt(0, 0, 0);
  camara.setViewOffset(ancho, alto, datos.desplazamiento.x, datos.desplazamiento.y, ancho, alto);
  camara.updateProjectionMatrix();
  camara.updateMatrixWorld();
}

function proyectar(v: THREE.Vector3, camara: THREE.Camera, ancho: number, alto: number) {
  const ndc = v.clone().project(camara);
  return { x: ((ndc.x + 1) / 2) * ancho, y: ((1 - ndc.y) / 2) * alto };
}

export function crearDirector(movil: boolean) {
  const geometria = crearGeometriaAnillo();
  const material = crearMaterialAnillo();
  const anillo = new THREE.Mesh(geometria, material);
  anillo.frustumCulled = false;
  const ciudades = crearCiudades();
  const halo = crearHalo();
  const grupo = new THREE.Group();
  grupo.add(halo.malla, anillo, ciudades.grupo);
  const estrellas = crearEstrellas(movil ? 400 : 900);
  const rastro = crearRastro(movil ? 60 : 120, movil ? 180 : 400);
  const raiz = new THREE.Group();
  raiz.add(estrellas.puntos, grupo, rastro.puntos);

  const datosCamara: DatosCamara = { posicion: new THREE.Vector3(), arriba: new THREE.Vector3(), desplazamiento: { x: 0, y: 0 } };
  const camaraDespegue = new THREE.PerspectiveCamera(FOV, 1, 0.1, 600);
  const punta = new THREE.Vector3();
  const puntosPerfil = material.uniforms.uPerfil.value as THREE.Vector2[];
  // La pluma traza sobre el tope del reborde de afuera.
  const radioPunta = RADIO - PERFIL.anchoReborde / 2;
  const alturaPunta = PERFIL.losa + PERFIL.reborde;
  let anterior = -1;
  let tiempo = 0;
  let cuadros = 0;

  function ponerPluma(c: Cuadro, p: number) {
    const { puente, camara, ancho, alto } = c;
    const m = puente.medidas!;
    const poner = puente.ponerPluma!;
    if (p < 0.07) {
      // Despega del final de la frase y vuela al comienzo del aro (visto con la
      // cámara que habrá en 0.07).
      const t = suave(dentroDe(p, [0, 0.07]));
      const datos: DatosCamara = { posicion: new THREE.Vector3(), arriba: new THREE.Vector3(), desplazamiento: { x: 0, y: 0 } };
      const pose = camaraPara(puente, 0.07, ancho, alto, datos);
      camaraDespegue.aspect = ancho / alto;
      aplicarCamara(camaraDespegue, datos, ancho, alto);
      const inicio = new THREE.Vector3(
        radioPunta * Math.cos(ARO.anguloInicio * RAD),
        alturaPunta,
        radioPunta * Math.sin(ARO.anguloInicio * RAD),
      ).applyAxisAngle(new THREE.Vector3(0, 1, 0), -pose.rz * RAD);
      const hasta = proyectar(inicio, camaraDespegue, ancho, alto);
      const ultima = m.letras[m.letras.length - 1];
      const desde = ultima ? { x: ultima.der, y: ultima.y } : { x: ancho / 2, y: alto / 2 };
      const control = { x: (desde.x + hasta.x) / 2 + ancho * 0.08, y: Math.min(desde.y, hasta.y) - alto * 0.28 };
      const x = (1 - t) ** 2 * desde.x + 2 * (1 - t) * t * control.x + t ** 2 * hasta.x;
      const y = (1 - t) ** 2 * desde.y + 2 * (1 - t) * t * control.y + t ** 2 * hasta.y;
      poner(x, y, mezcla(-14, -24, t), mezcla(m.escalaEscritura, m.escalaDibujo, t), 1);
      return;
    }
    const enPantalla = proyectar(punta, camara, ancho, alto);
    if (p < 0.81) {
      const flotar = dentroDe(p, [0.63, 0.7]) * m.diametro * 0.05;
      poner(enPantalla.x, enPantalla.y - flotar, -20 + Math.sin(p * 90) * 4, m.escalaDibujo, 1);
      return;
    }
    // Acto 3: vuela a la apertura, se encoge y se vuelve la chispa.
    const t = suave(dentroDe(p, [0.81, 0.9]));
    const escalaLogo = RADIO / (ARO.radio + ARO.grosor / 2);
    const chispa = new THREE.Vector3((ARO.chispa.x - 50) * escalaLogo, 0, (ARO.chispa.y + 6 - 50) * escalaLogo);
    grupo.localToWorld(chispa);
    const hacia = proyectar(chispa, camara, ancho, alto);
    const opacidad = 1 - suave(dentroDe(p, [0.875, 0.905]));
    poner(
      mezcla(enPantalla.x, hacia.x, t),
      mezcla(enPantalla.y - m.diametro * 0.05 * (1 - t), hacia.y, t),
      mezcla(-20, 14, t),
      mezcla(m.escalaDibujo, m.escalaDibujo * 0.3, t),
      opacidad,
    );
  }

  /** Un cuadro. Devuelve "listo" en el primero (la escena ya se ve). */
  function cuadro(c: Cuadro): "listo" | null {
    const { puente, camara, ancho, alto, dpr, delta } = c;
    const m = puente.medidas;
    if (!m || !puente.poseAnillo || ancho === 0) return null;
    const p = puente.p;
    tiempo += delta;

    // ── Cámara y pose ──
    const pose = camaraPara(puente, p, ancho, alto, datosCamara);
    aplicarCamara(camara, datosCamara, ancho, alto);
    grupo.rotation.y = -pose.rz * RAD;
    grupo.updateMatrixWorld();

    // ── Anillo: trazo (drawRange) y paso de la losa al aro plano del logo ──
    const a = avanceAnillo(p);
    const kLogo = suave(dentroDe(p, [0.81, 0.93]));
    const u = material.uniforms;
    u.uFin.value = a;
    perfil(kLogo, puntosPerfil);
    u.uPlano.value = suave(dentroDe(p, [0.86, 0.93]));
    u.uCamara.value.copy(camara.position);
    const atenuado = 1 - 0.6 * fundido(p, 0.715, 0.735, 0.79, 0.81);
    u.uOpacidad.value = atenuado;
    u.uTiempo.value = tiempo;
    // La punta brilla mientras traza; los detalles (filos, luces) se apagan
    // cuando la banda se vuelve el aro plano del logo.
    u.uCabeza.value = fundido(p, 0.066, 0.08, 0.6, 0.645);
    u.uDetalle.value = 1 - suave(dentroDe(p, [0.82, 0.9]));
    halo.actualizar(a, atenuado * (1 - kLogo));
    geometria.setDrawRange(0, indicesParaFraccion(a));
    anillo.visible = a > 0.001;

    // ── Ciudades ──
    ciudades.actualizar(p, tiempo, atenuado);

    // ── Partículas ──
    for (const mat of [estrellas.material, rastro.material]) {
      mat.uniforms.uPixel.value = dpr;
      mat.uniforms.uLienzo.value.set(ancho * dpr, alto * dpr);
      mat.uniforms.uZona.value.set(m.zonaTexto.x, m.zonaTexto.y, m.zonaTexto.w, m.zonaTexto.h);
    }
    estrellas.material.uniforms.uTiempo.value = tiempo;

    // ── Punta del trazo: rastro de tinta y polvo ──
    const anguloFin = (ARO.anguloInicio + a * ARO.anguloArco) * RAD;
    const alturaAhora = puntosPerfil[2].y;
    punta.set(radioPunta * Math.cos(anguloFin), alturaAhora, radioPunta * Math.sin(anguloFin));
    grupo.localToWorld(punta);
    if (p > 0.07 && p < 0.63 && Math.abs(p - anterior) > 0.0002) {
      rastro.emitir(punta.x, punta.y, punta.z, true);
      rastro.emitir(punta.x, punta.y, punta.z, true);
      for (let i = 0; i < 3; i++) {
        const atras = anguloFin - Math.random() * 0.12;
        const r = SUELO.desde + Math.random() * (RADIO - SUELO.desde);
        const polvo = new THREE.Vector3(r * Math.cos(atras), SUELO.altura + Math.random() * 0.4, r * Math.sin(atras));
        grupo.localToWorld(polvo);
        rastro.emitir(polvo.x, polvo.y, polvo.z, false);
      }
    }
    rastro.actualizar(Math.min(delta, 0.05));
    anterior = p;

    // ── Pluma (DOM) en la punta proyectada ──
    if (puente.ponerPluma && p > 0.0015 && p < 0.93) ponerPluma(c, p);

    // ── Listo tras el primer cuadro ──
    cuadros += 1;
    return cuadros === 1 ? "listo" : null;
  }

  function destruir() {
    geometria.dispose();
    material.dispose();
    ciudades.destruir();
    halo.destruir();
    estrellas.puntos.geometry.dispose();
    estrellas.material.dispose();
    rastro.puntos.geometry.dispose();
    rastro.material.dispose();
  }

  return { raiz, cuadro, destruir };
}
