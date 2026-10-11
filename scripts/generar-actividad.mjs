// Genera datos/actividad.json con los cambios (commits) por día del repo de
// Prodigia, para la sección «El desarrollo» (ARQUITECTURA.md §8).
//
// Solo fechas y conteos: nunca mensajes, autores ni correos (los mensajes del
// repo mencionan cosas internas que no se publican).
//
// Uso: npm run actividad
// Ruta del repo: PRODIGIA_REPO_PATH (por defecto D:/Repositorios/prodigia).
// Se corre a mano antes de desplegar: en Vercel el repo de Prodigia no existe y
// el build usa el JSON versionado.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = process.env.PRODIGIA_REPO_PATH ?? "D:/Repositorios/prodigia";
const destino = join(raiz, "datos", "actividad.json");

let salida;
try {
  salida = execFileSync("git", ["-C", repo, "log", "--date=short", "--format=%ad"], { encoding: "utf8" });
} catch (error) {
  console.error(`No se pudo leer el historial de ${repo}. ¿Existe y es un repositorio git?`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const dias = {};
for (const linea of salida.split(/\r?\n/)) {
  const fecha = linea.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) continue;
  dias[fecha] = (dias[fecha] ?? 0) + 1;
}

const fechas = Object.keys(dias).sort();
const ordenado = Object.fromEntries(fechas.map((f) => [f, dias[f]]));
const total = fechas.reduce((suma, f) => suma + dias[f], 0);

const datos = {
  generado: new Date().toISOString().slice(0, 10),
  desde: fechas[0] ?? null,
  hasta: fechas.at(-1) ?? null,
  total,
  dias: ordenado,
};

mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(datos, null, 2) + "\n", "utf8");
console.log(`datos/actividad.json: ${total} cambios en ${fechas.length} días (${datos.desde} → ${datos.hasta}).`);
