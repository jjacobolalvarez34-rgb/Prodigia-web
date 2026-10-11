import datos from "@/datos/actividad.json";

// Actividad real del repo de Prodigia (scripts/generar-actividad.mjs): solo
// fechas y conteos de cambios por día.
export interface Actividad {
  generado: string | null;
  desde: string | null;
  hasta: string | null;
  total: number;
  dias: Record<string, number>;
}

export interface ActividadConDatos extends Actividad {
  desde: string;
  hasta: string;
}

/** `null` si no hay datos: la sección muestra su estado vacío (nunca datos de muestra). */
export function leerActividad(): ActividadConDatos | null {
  const actividad = datos as Actividad;
  if (!actividad.desde || !actividad.hasta || actividad.total <= 0) return null;
  return actividad as ActividadConDatos;
}

const DIA_MS = 86_400_000;

function aFecha(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function aIso(fecha: Date) {
  return fecha.toISOString().slice(0, 10);
}

/** Todos los días entre `desde` y `hasta`, con 0 donde no hubo cambios. */
export function diasCompletos(actividad: ActividadConDatos): { fecha: string; cambios: number }[] {
  const lista = [];
  for (let t = aFecha(actividad.desde).getTime(); t <= aFecha(actividad.hasta).getTime(); t += DIA_MS) {
    const fecha = aIso(new Date(t));
    lista.push({ fecha, cambios: actividad.dias[fecha] ?? 0 });
  }
  return lista;
}

export function estadisticas(actividad: ActividadConDatos) {
  const dias = diasCompletos(actividad);
  let diaMasActivo = dias[0] ?? { fecha: actividad.desde, cambios: 0 };
  let racha = 0;
  let rachaMasLarga = 0;
  for (const dia of dias) {
    if (dia.cambios > diaMasActivo.cambios) diaMasActivo = dia;
    racha = dia.cambios > 0 ? racha + 1 : 0;
    rachaMasLarga = Math.max(rachaMasLarga, racha);
  }
  return { total: actividad.total, diaMasActivo, rachaMasLarga, dias: dias.length };
}

const formatoLargo = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const formatoCorto = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", timeZone: "UTC" });

/** «17 de agosto de 2026» */
export function fechaLarga(iso: string) {
  return formatoLargo.format(aFecha(iso));
}

/** «17 de agosto» */
export function fechaCorta(iso: string) {
  return formatoCorto.format(aFecha(iso));
}
