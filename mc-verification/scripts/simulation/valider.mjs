// Vérifie un identifiant de bloc et ses états contre la liste du jeu (blocs_vanilla.json, tirée
// de @minecraft/vanilla-data) ; une erreur est notée (globalThis.PROBLEMES) puis levée, comme le jeu.
import fs from "fs";
const V = JSON.parse(fs.readFileSync(new URL("./blocs_vanilla.json", import.meta.url)));
const IDS = new Set(V.ids);
const NOS_BLOCS = { "aventure:etagere_fioles": 1, "aventure:ratelier": 1, "aventure:rotisserie": 1, "aventure:alambic": 1, "aventure:mannequin": 1, "aventure:trophee": 1, "aventure:table": 0, "aventure:tonneau": 0 };
export function valider(id, etats = {}) {
  let erreur;
  if (id.startsWith("aventure:")) {
    if (!(id in NOS_BLOCS)) erreur = `bloc inconnu ${id}`;
    else for (const n of Object.keys(etats)) if (n !== "minecraft:cardinal_direction" || !NOS_BLOCS[id]) erreur = `état ${n} inconnu pour ${id}`;
  } else if (!IDS.has(id)) {
    erreur = `bloc inconnu ${id}`;
  } else {
    const permis = V.etats[id] ?? [];
    for (const [n, v] of Object.entries(etats)) {
      if (!permis.includes(n)) erreur = `état « ${n} » inconnu pour ${id} (permis : ${permis.join(", ") || "aucun"})`;
      else {
        const t = V.types[n];
        const ok = t === "boolean" ? typeof v === "boolean" : t === "number" ? typeof v === "number" : typeof v === "string";
        if (!ok) erreur = `état ${n}=${JSON.stringify(v)} du mauvais type (${t}) pour ${id}`;
      }
    }
  }
  if (erreur) {
    (globalThis.PROBLEMES ??= []).push(`${globalThis.SOURCE ?? "?"} : ${erreur}`);
    throw new Error(erreur);
  }
}
