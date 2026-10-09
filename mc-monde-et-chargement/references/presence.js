// Les présences : les joueurs, plus des points où l'on fait comme si un joueur était là. Pendant
// l'écran du conteur, une présence posée tour à tour sur chaque lieu d'une région le fait construire
// d'avance (les lieux se construisent « quand un joueur s'en approche »). Une présence ne compte que
// pour construire : jamais pour une rencontre, une découverte trouvée ou un combat.
import { world } from "@minecraft/server";

const fictives = new Map();

export function presences() {
  return [...world.getAllPlayers(), ...fictives.values()];
}

export function ajouterPresence(nom, lieu, dimensionId = "minecraft:overworld") {
  fictives.set(nom, { id: `presence:${nom}`, isValid: true, location: { x: lieu.x, y: lieu.y ?? 64, z: lieu.z }, dimension: { id: dimensionId } });
}

export function retirerPresence(nom) {
  fictives.delete(nom);
}

export function retirerLesPresences() {
  fictives.clear();
}
