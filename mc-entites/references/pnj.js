// Garder un personnage à sa place, et un seul. Le serveur charge le terrain avant les créatures :
// juste après un chargement, un personnage bien là peut encore être invisible au script. On ne le
// fait donc revenir qu'après trois constats d'absence de suite, un vrai joueur tout près (ses
// créatures sont alors chargées depuis longtemps) ; et s'il y en a plusieurs, on n'en garde qu'un.
import { world } from "@minecraft/server";

const absences = new Map();
const CONSTATS = 3;
const PRES = 32;

// options : { cle (unique par personnage), type, lieu, rayon (où le chercher), filtre (entité → bool),
// poser () → entité }. Rend le personnage trouvé (ou posé), sinon undefined. Peut lever une
// erreur si la zone n'est pas chargée (à attraper par l'appelant).
export function garderUnSeul(dim, options) {
  let trouves = dim.getEntities({ type: options.type, location: options.lieu, maxDistance: options.rayon ?? 24 });
  if (options.filtre) trouves = trouves.filter(options.filtre);
  for (const enTrop of trouves.slice(1)) {
    try {
      enTrop.remove();
    } catch {
      // déjà parti
    }
  }
  if (trouves.length > 0) {
    absences.delete(options.cle);
    return trouves[0];
  }
  const l = options.lieu;
  const proche = world.getAllPlayers().some((j) => j.dimension.id === dim.id && Math.hypot(j.location.x - l.x, j.location.z - l.z) < PRES && Math.abs(j.location.y - l.y) < PRES);
  if (!proche) {
    absences.delete(options.cle);
    return undefined;
  }
  const n = (absences.get(options.cle) ?? 0) + 1;
  if (n < CONSTATS) {
    absences.set(options.cle, n);
    return undefined;
  }
  absences.delete(options.cle);
  return options.poser();
}
