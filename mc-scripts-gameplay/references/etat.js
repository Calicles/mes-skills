// Progression de l'aventure, enregistrée dans le monde (donc incluse dans les sauvegardes).
import { world } from "@minecraft/server";

const CLE = "aventure:etat";

function etatInitial() {
  return {
    // statut : "a_faire" → "en_cours" → "prete" (tout est fait, récompense à venir) → "finie"
    quete1: { statut: "a_faire", progression: {} },
    // Lieux du domaine une fois posé (centre, coffre, chevalier, porte ; apparition sur le parvis et grande entrée de la muraille).
    domaine: { pose: false },
    joueursConnus: [],
    // identifiant du joueur → liste des quêtes dont le souvenir est à lui remettre
    souvenirsEnAttente: {},
  };
}

// Lecture de l'état depuis son texte (JSON), avec les valeurs par défaut.
function lireDepuis(brut) {
  if (typeof brut !== "string") return etatInitial();
  try {
    const initial = etatInitial();
    const lu = JSON.parse(brut);
    // Ancienne quête provisoire « 5 lingots » (étapes 1 et 2) : la vraie quête 1 repart de zéro.
    if (lu.quete1 && !lu.quete1.progression) lu.quete1 = {};
    return {
      ...initial,
      ...lu,
      quete1: { ...initial.quete1, ...lu.quete1 },
      domaine: { ...initial.domaine, ...lu.domaine },
    };
  } catch (erreur) {
    console.warn(`[aventure] état illisible, remis à zéro : ${erreur}`);
    return etatInitial();
  }
}

// Les dizaines de surveillances lisent l'état plusieurs fois par seconde : il est lu une seule fois
// dans le monde, puis gardé en mémoire (seul ce script l'écrit, toujours par modifierEtat ou
// reinitialiserEtat, qui tiennent la mémoire à jour). L'objet rendu se lit seulement.
let memoire = { brut: undefined, etat: undefined };

export function lireEtat() {
  if (memoire.etat) return memoire.etat;
  const brut = world.getDynamicProperty(CLE);
  memoire = { brut, etat: lireDepuis(brut) };
  return memoire.etat;
}

// La modification part d'une copie neuve (jamais de l'objet partagé), puis l'enregistre.
export function modifierEtat(modification) {
  if (!memoire.etat) lireEtat();
  const etat = lireDepuis(memoire.brut);
  modification(etat);
  const brut = JSON.stringify(etat);
  world.setDynamicProperty(CLE, brut);
  memoire = { brut, etat: lireDepuis(brut) };
  return etat;
}

// Remet l'aventure à zéro (pour les tests) ; le domaine et les joueurs connus sont gardés.
export function reinitialiserEtat() {
  const { domaine, joueursConnus, lieux, secondaires } = lireEtat();
  // Les lieux de quête (et ceux des quêtes secondaires) gardent leur emplacement mais seront reconstruits à neuf.
  const aRefaire = (liste) => Object.fromEntries(Object.entries(liste ?? {}).map(([cle, l]) => [cle, { centre: l.centre, pose: false }]));
  const brut = JSON.stringify({ ...etatInitial(), domaine, joueursConnus, lieux: aRefaire(lieux), secondaires: aRefaire(secondaires) });
  world.setDynamicProperty(CLE, brut);
  memoire = { brut, etat: lireDepuis(brut) };
}

// Mémoire propre à chaque joueur : a-t-il entendu la présentation de chaque quête ?
function clePresentation(cleQuete) {
  return cleQuete === "quete1" ? "aventure:presentation_entendue" : `aventure:presentation_${cleQuete}`;
}

export function aEntenduLaPresentation(joueur, cleQuete = "quete1") {
  return joueur.getDynamicProperty(clePresentation(cleQuete)) === true;
}

export function noterPresentationEntendue(joueur, entendue = true, cleQuete = "quete1") {
  joueur.setDynamicProperty(clePresentation(cleQuete), entendue ? true : undefined);
}

const CLE_KIT = "aventure:kit_recu";

export function aRecuLeKit(joueur) {
  return joueur.getDynamicProperty(CLE_KIT) === true;
}

export function noterKitRecu(joueur) {
  joueur.setDynamicProperty(CLE_KIT, true);
}
