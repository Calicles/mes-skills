// La musique par lieu (une seule Switch, un seul haut-parleur : une seule musique pour le groupe,
// celle du lieu où sont la plupart des joueurs ; à égalité, le lieu prioritaire, le combat d'abord).
// Au domaine, un morceau calme à l'arrivée, puis la musique normale du jeu, avec ses silences.
import { world } from "@minecraft/server";
import { MUSIQUES, REGLAGES_MUSIQUE as R } from "./donnees/musique.js";
import { lireEtat } from "./etat.js";
import { dansLaBarovie, barovieExiste } from "./barovie.js";
import { positionDuCimetiere } from "./cimetiere.js";
import { joueurDansLaForet } from "./foret.js";
import { joueurDansLeMarais } from "./marais.js";
import { dansLesProfondeurs } from "./profondeurs.js";
import { dansLesGrottes } from "./cristal.js";
import { dansLaForet as dansLesChampignons } from "./champignons.js";
import { dansLaLave } from "./lave.js";

let actuelle;
let candidate;
let joueursAvant = 0;

// Un gardien combat-il, dans la région de ce lieu ?
function combatEnBarovie(etat) {
  const b = etat.barovie ?? {};
  return b.cimetiere?.roi === "eveille" || b.foret?.alpha === "eveille" || b.marais?.pieuvre === "eveillee" || b.chateau?.denouement?.comte === "combat";
}

function combatSousLaMontagne(etat) {
  const p = etat.profondeurs ?? {};
  return p.cristal?.golem === "combat" || p.champignons?.crapaud === "combat" || p.lave?.dragon === "combat";
}

function lieuDuJoueur(joueur, etat) {
  const l = joueur.location;
  if (dansLesProfondeurs(l, etat)) {
    if (combatSousLaMontagne(etat)) return "combat";
    if (dansLesGrottes(l, etat)) return "grottes";
    if (dansLesChampignons(l, etat)) return "champignons";
    if (dansLaLave(l, etat)) return "lave";
    return "cite";
  }
  if (barovieExiste(etat) && dansLaBarovie(l, etat)) {
    if (combatEnBarovie(etat)) return "combat";
    const c = etat.barovie?.cimetiere?.pose ? positionDuCimetiere(etat) : undefined;
    if (c && Math.hypot(l.x - c.x, l.z - c.z) < R.rayonCimetiere) return "cimetiere";
    if (joueurDansLaForet(joueur, etat)) return "foret";
    if (joueurDansLeMarais(joueur, etat)) return "marais";
    return "barovie";
  }
  if (etat.gardien?.statut === "eveille") return "combat";
  return "domaine";
}

// Toutes les 2 secondes : la musique du groupe ; elle ne change qu'après deux relevés pareils (pas de
// va-et-vient au bord d'un lieu), sauf pour un combat qui commence.
export function surveillerMusique() {
  const etat = lireEtat();
  const joueurs = world.getAllPlayers();
  if (joueurs.length === 0) {
    actuelle = undefined;
    return;
  }
  // Un joueur qui arrive : on relance la musique pour qu'il l'entende aussi.
  if (joueurs.length > joueursAvant) actuelle = undefined;
  joueursAvant = joueurs.length;

  const comptes = {};
  for (const j of joueurs) {
    try {
      const lieu = lieuDuJoueur(j, etat);
      comptes[lieu] = (comptes[lieu] ?? 0) + 1;
    } catch {
      // joueur pas encore placé
    }
  }
  const lieux = Object.keys(comptes);
  if (lieux.length === 0) return;
  lieux.sort((a, b) => comptes[b] - comptes[a] || MUSIQUES[b].priorite - MUSIQUES[a].priorite);
  const choisi = lieux[0];
  if (choisi === actuelle) {
    candidate = undefined;
    return;
  }
  if (choisi !== "combat" && candidate !== choisi) {
    candidate = choisi;
    return;
  }
  candidate = undefined;
  actuelle = choisi;
  const m = MUSIQUES[choisi];
  try {
    world.playMusic(m.piste, { loop: m.boucle, fade: R.fondu, volume: R.volume });
  } catch (erreur) {
    console.warn(`[aventure] musique ${m.piste} : ${erreur}`);
  }
}
