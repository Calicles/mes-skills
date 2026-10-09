// La baguette du testeur (pour les parents, en campagne de test) : un menu à boutons, sans rien
// taper à la manette, pour aller d'un coup dans un lieu, sauter à une étape de l'aventure (tout est
// préparé, et on est emmené devant ce qu'il faut tester), placer un personnage des quêtes
// secondaires à une demande, et quelques coups de pouce. Réservée aux opérateurs.
// On l'obtient par l'inventaire créatif, ou par /give @s aventure:baguette_testeur.
import { world, system, ItemStack, GameMode, PlayerPermissionLevel } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { lireEtat } from "./etat.js";
import { donner } from "./inventaire.js";
import { trouverSol } from "./construction.js";
import { QUETES, etatQuete } from "./quete.js";
import { PIECES } from "./donnees/pieces.js";
import { SECONDAIRES } from "./donnees/secondaires.js";
import { forcerSecondaire, positionSecondaire } from "./secondaires.js";
import { positionDuLieu } from "./lieux.js";
import { placerAuDomaine, positionPorteDesBrumes } from "./barovie.js";
import { traverserVersLaBarovie as emmenerEnBarovie } from "./regions.js";
import { positionDuCimetiere } from "./cimetiere.js";
import { positionDeLaForet } from "./foret.js";
import { positionDuMarais } from "./marais.js";
import { positionDuChateau } from "./chateau.js";
import { centreCite, positionDeLaMine } from "./profondeurs.js";
import { arriveeDesGrottes } from "./cristal.js";
import { arriveeDeLaForet } from "./champignons.js";
import { arriveeDeLaLave } from "./lave.js";

export const TYPE_BAGUETTE = "aventure:baguette_testeur";

// --- Arriver quelque part ---

// En surface, loin de ce qui est construit : on arrive d'en haut, puis, dès que le terrain est
// chargé, on est posé au sol (plus de chute lente).
export function atterrir(joueur, lieu) {
  if (!lieu || !joueur?.isValid) return;
  const dim = joueur.dimension;
  joueur.addEffect("slow_falling", 20 * 30, { showParticles: false });
  joueur.teleport({ x: lieu.x + 0.5, y: lieu.y + 40, z: lieu.z + 0.5 });
  let essais = 0;
  const id = system.runInterval(() => {
    essais++;
    if (!joueur.isValid || essais > 30) {
      system.clearRun(id);
      return;
    }
    const sol = trouverSol(dim, Math.floor(lieu.x), Math.floor(lieu.z));
    if (!sol) return;
    system.clearRun(id);
    joueur.teleport({ x: Math.floor(lieu.x) + 0.5, y: sol.y + 1, z: Math.floor(lieu.z) + 0.5 });
    joueur.removeEffect("slow_falling");
  }, 5);
}

// Un lieu précis (sous terre, ou déjà construit) : on y est posé tout de suite.
function poser(joueur, lieu) {
  if (!lieu || !joueur?.isValid) return;
  joueur.teleport({ x: lieu.x, y: lieu.y, z: lieu.z });
}

function dire(joueur, texte) {
  joueur.sendMessage(`§e[test] ${texte}`);
}

function pasEncore(joueur, texte) {
  joueur.sendMessage(`§c[test] ${texte}`);
}

// --- Les lieux ---

const chapitre2Ouvert = (etat) => etat.barovie?.ouverte === true;
const citeConstruite = (etat) => Boolean(etat.profondeurs?.cite);
const PAS_BAROVIE = "Les Brumes ne sont pas ouvertes : passe d'abord par « Sauter à une étape › Chapitre 2 › Madame Zora ».";
const PAS_CITE = "La cité n'est pas encore construite : passe d'abord par « Sauter à une étape › Chapitre 3 › La porte runique ».";

export function versSecondaire(joueur, cle, etat) {
  const perso = SECONDAIRES.find((p) => p.cle === cle);
  if (perso.region === "barovie" && !chapitre2Ouvert(etat)) return pasEncore(joueur, PAS_BAROVIE);
  if (perso.region === "barovie" && !etat.barovie?.camp) return emmenerEnBarovie(joueur, (e) => versSecondaire(joueur, cle, e));
  if (perso.region === "profondeurs" && !etat.profondeurs?.[perso.dans]?.construit) {
    return pasEncore(joueur, `${perso.nom} vit dans une caverne pas encore construite : saute d'abord à l'étape « ${perso.dans === "cristal" ? "Les grottes de cristal" : "La forêt de champignons"} ».`);
  }
  const lieu = positionSecondaire(cle);
  if (!lieu) return;
  if (lieu.pose || perso.sol !== undefined) poser(joueur, lieu);
  else atterrir(joueur, { ...lieu, y: lieu.y - 30 });
}

// Chaque lieu : son nom, et comment y aller (renvoie rien ; prévient si c'est impossible).
const LIEUX = [
  {
    chapitre: 1,
    liste: [
      { cle: "domaine", nom: "Le domaine (l'entrée)", aller: (j, e) => placerAuDomaine(j, e) },
      { cle: "grandeSalle", nom: "La grande salle (Perceval)", aller: (j, e) => poser(j, { x: e.domaine.chevalier.x + 0.5, y: e.domaine.chevalier.y, z: e.domaine.chevalier.z + 2.5 }) },
      { cle: "ruineNord", nom: "La ruine du nord", aller: (j) => atterrir(j, positionDuLieu("ruineNord")) },
      { cle: "moulin", nom: "Le vieux moulin", aller: (j) => atterrir(j, positionDuLieu("moulin")) },
      { cle: "mineQuete3", nom: "La mine (quête 3)", aller: (j) => atterrir(j, positionDuLieu("mine")) },
      { cle: "ruineMaudite", nom: "La ruine maudite (le Gardien)", aller: (j) => atterrir(j, { ...positionDuLieu("ruineFinale"), z: positionDuLieu("ruineFinale").z + 16 }) },
      { cle: "gauvain", nom: "Le camp de Sire Gauvain", aller: (j, e) => versSecondaire(j, "gauvain", e) },
      { cle: "mirabelle", nom: "La chaumière de Dame Mirabelle", aller: (j, e) => versSecondaire(j, "mirabelle", e) },
    ],
  },
  {
    chapitre: 2,
    liste: [
      { cle: "arche", nom: "L'arche des Brumes (au domaine)", aller: (j, e) => (e.barovie?.porte ? atterrir(j, { ...positionPorteDesBrumes(e), z: positionPorteDesBrumes(e).z + 5 }) : pasEncore(j, PAS_BAROVIE)) },
      { cle: "camp", nom: "Le camp de Madame Zora", aller: (j, e) => (chapitre2Ouvert(e) ? emmenerEnBarovie(j) : pasEncore(j, PAS_BAROVIE)) },
      { cle: "cimetiere", nom: "Le cimetière", aller: (j, e) => (chapitre2Ouvert(e) ? emmenerEnBarovie(j, (f) => atterrir(j, positionDuCimetiere(f))) : pasEncore(j, PAS_BAROVIE)) },
      { cle: "foret", nom: "La forêt des loups", aller: (j, e) => (chapitre2Ouvert(e) ? emmenerEnBarovie(j, (f) => atterrir(j, positionDeLaForet(f))) : pasEncore(j, PAS_BAROVIE)) },
      { cle: "marais", nom: "Le marais", aller: (j, e) => (chapitre2Ouvert(e) ? emmenerEnBarovie(j, (f) => atterrir(j, positionDuMarais(f))) : pasEncore(j, PAS_BAROVIE)) },
      { cle: "chateau", nom: "Le château (le pont)", aller: (j, e) => (chapitre2Ouvert(e) ? emmenerEnBarovie(j, (f) => atterrir(j, positionDuChateau(f))) : pasEncore(j, PAS_BAROVIE)) },
      { cle: "crapotte", nom: "La cabane de Mère Crapotte", aller: (j, e) => versSecondaire(j, "crapotte", e) },
      { cle: "vanrichten", nom: "La cabane de Van Richten", aller: (j, e) => versSecondaire(j, "vanrichten", e) },
    ],
  },
  {
    chapitre: 3,
    liste: [
      { cle: "vieilleMine", nom: "La vieille mine (au domaine)", aller: (j, e) => (positionDeLaMine(e) ? poser(j, positionDeLaMine(e)) : pasEncore(j, "Le domaine n'est pas posé.")) },
      {
        cle: "cite",
        nom: "La cité naine",
        aller: (j, e) => {
          const b = centreCite(e);
          if (!citeConstruite(e) || !b) return pasEncore(j, PAS_CITE);
          poser(j, { x: b.x + 0.5, y: b.y + 1, z: b.z + 3.5 });
        },
      },
      { cle: "grottes", nom: "Les grottes de cristal", aller: (j, e) => (e.profondeurs?.cristal?.construit ? poser(j, arriveeDesGrottes(e)) : pasEncore(j, "Les grottes ne sont pas construites : saute d'abord à l'étape « Les grottes de cristal ».")) },
      { cle: "champignons", nom: "La forêt de champignons", aller: (j, e) => (e.profondeurs?.champignons?.construit ? poser(j, arriveeDeLaForet(e)) : pasEncore(j, "La forêt n'est pas construite : saute d'abord à l'étape « La forêt de champignons ».")) },
      { cle: "lave", nom: "Les rivières de lave", aller: (j, e) => (e.profondeurs?.lave?.construit ? poser(j, arriveeDeLaLave(e)) : pasEncore(j, "La caverne de lave n'est pas construite : saute d'abord à l'étape « Les rivières de lave ».")) },
      { cle: "gronk", nom: "La grotte du vieux Gronk", aller: (j, e) => versSecondaire(j, "gronk", e) },
      { cle: "pipolin", nom: "La pêcherie de Pipolin", aller: (j, e) => versSecondaire(j, "pipolin", e) },
    ],
  },
];

// Aller à un lieu par sa clé (pour le carnet du testeur).
export function allerAuLieu(joueur, cle) {
  for (const { liste } of LIEUX) {
    const l = liste.find((x) => x.cle === cle);
    if (l) return l.aller(joueur, lireEtat());
  }
}

// --- Les étapes (voir allerA, dans main.js) ---

const ETAPES = [
  {
    chapitre: 1,
    liste: [
      { cle: "cuisine", nom: "La cuisine à restaurer (quête 1 finie)" },
      { cle: "quete2", nom: "Quête 2 : le vieux moulin" },
      { cle: "alchimiste", nom: "La salle d'alchimiste à restaurer" },
      { cle: "bibliotheque", nom: "La bibliothèque de Merlin à restaurer" },
      { cle: "quete3", nom: "Quête 3 : la mine" },
      { cle: "armes", nom: "La salle d'armes à restaurer" },
      { cle: "quete4", nom: "Quête 4 : la dernière quête" },
      { cle: "gardien", nom: "Le Gardien de la ruine maudite" },
    ],
  },
  {
    chapitre: 2,
    liste: [
      { cle: "barovie", nom: "Madame Esméralda au domaine" },
      { cle: "zora", nom: "Madame Zora (le tirage des cartes)" },
      { cle: "cimetiere", nom: "Les sceaux : le cimetière" },
      { cle: "foret", nom: "Les sceaux : la forêt des loups" },
      { cle: "marais", nom: "Les sceaux : le marais" },
      { cle: "chateau", nom: "Le château (trois sceaux, herse)" },
      { cle: "comte", nom: "Le tombeau du comte" },
      { cle: "ecurie", nom: "L'écurie et les licornes" },
    ],
  },
  {
    chapitre: 3,
    liste: [
      { cle: "profondeurs", nom: "Thorgrim sort de la mine" },
      { cle: "cite", nom: "La porte runique (vers la cité)" },
      { cle: "cristal", nom: "Les grottes de cristal" },
      { cle: "champignons", nom: "La forêt de champignons" },
      { cle: "lave", nom: "Les rivières de lave" },
      { cle: "forge", nom: "La Grande Forge (l'enclume)" },
      { cle: "mine", nom: "La mine du domaine à restaurer" },
    ],
  },
];

// Toutes les étapes, dans l'ordre de l'aventure : sauter à l'une fait tout ce qui la précède (sauts.js).
export const ORDRE_DES_ETAPES = ETAPES.flatMap((c) => c.liste.map((e) => e.cle));

// --- Les fenêtres ---

async function choisir(joueur, titre, corps, boutons) {
  const fenetre = new ActionFormData().title(titre).body(corps);
  for (const b of boutons) fenetre.button(b);
  try {
    const r = await fenetre.show(joueur);
    if (r.canceled || r.selection === undefined) return undefined;
    return r.selection;
  } catch {
    return undefined;
  }
}

async function confirmer(joueur, titre, corps) {
  try {
    const r = await new MessageFormData().title(titre).body(corps).button1("Oui").button2("Non").show(joueur);
    return !r.canceled && r.selection === 0;
  } catch {
    return false;
  }
}

export function estOperateur(joueur) {
  try {
    return joueur.playerPermissionLevel >= PlayerPermissionLevel.Operator;
  } catch {
    return false;
  }
}

/** @param {any} joueur @param {{ allerA: (etape: string, joueur: any) => void, reinitialiser: () => void, remplirCoffre: (cle: string) => boolean }} actions */
export async function ouvrirBaguette(joueur, actions) {
  if (!estOperateur(joueur)) {
    joueur.sendMessage("§c[test] La baguette du testeur est réservée aux parents (opérateurs).");
    return;
  }
  if (!lireEtat().domaine?.pose) {
    pasEncore(joueur, "Le domaine n'est pas encore posé : attends la fin de la première arrivée.");
    return;
  }
  const choix = await choisir(joueur, "Baguette du testeur", "Que veux-tu faire ?", [
    "Aller à…", "Sauter à une étape…", "Quêtes secondaires…", "Coups de pouce…", "Fermer",
  ]);
  if (choix === 0) await menuAller(joueur, actions);
  else if (choix === 1) await menuEtapes(joueur, actions);
  else if (choix === 2) await menuSecondaires(joueur, actions);
  else if (choix === 3) await menuCoupsDePouce(joueur, actions);
}

async function choisirChapitre(joueur, titre) {
  const c = await choisir(joueur, titre, "Quel chapitre ?", ["Chapitre 1 : le domaine", "Chapitre 2 : la Barovie", "Chapitre 3 : la Grande Forge", "Retour"]);
  return c === undefined || c === 3 ? undefined : c;
}

async function menuAller(joueur, actions) {
  const c = await choisirChapitre(joueur, "Aller à…");
  if (c === undefined) return ouvrirBaguette(joueur, actions);
  const { liste } = LIEUX[c];
  const i = await choisir(joueur, `Aller à… (chapitre ${c + 1})`, "Où veux-tu aller ?", [...liste.map((l) => l.nom), "Retour"]);
  if (i === undefined) return;
  if (i === liste.length) return menuAller(joueur, actions);
  liste[i].aller(joueur, lireEtat());
}

async function menuEtapes(joueur, actions) {
  const c = await choisirChapitre(joueur, "Sauter à une étape…");
  if (c === undefined) return ouvrirBaguette(joueur, actions);
  const { liste } = ETAPES[c];
  const corps = "Tout ce qui précède est marqué fait, et tu es emmené devant ce qu'il faut tester.";
  const i = await choisir(joueur, `Sauter à… (chapitre ${c + 1})`, corps, [...liste.map((l) => l.nom), "Retour"]);
  if (i === undefined) return;
  if (i === liste.length) return menuEtapes(joueur, actions);
  actions.allerA(liste[i].cle, joueur);
}

async function menuSecondaires(joueur, actions) {
  const i = await choisir(joueur, "Quêtes secondaires…", "Quel personnage ?", [...SECONDAIRES.map((p) => `${p.nom} (chapitre ${p.chapitre})`), "Retour"]);
  if (i === undefined) return;
  if (i === SECONDAIRES.length) return ouvrirBaguette(joueur, actions);
  const perso = SECONDAIRES[i];
  const boutons = ["Y aller", "Demande 1 (à accepter)", "Demande 2 (à accepter)", "Demande 3 (à accepter)",
    "Demande 1 remplie", "Demande 2 remplie", "Demande 3 remplie", "Tout fini", "Retour"];
  const corps = "Le personnage est placé à cette demande (déjà remplie : lui parler donne la récompense), puis tu es emmené devant lui.";
  const k = await choisir(joueur, perso.nom, corps, boutons);
  if (k === undefined) return;
  if (k === 8) return menuSecondaires(joueur, actions);
  if (k >= 1) {
    const rang = k === 7 ? 4 : k <= 3 ? k : k - 3;
    forcerSecondaire(perso.cle, rang, k >= 4 && k <= 6);
    dire(joueur, `${perso.nom} : ${k === 7 ? "tout est fini" : `demande ${rang}${k >= 4 ? " remplie" : " à accepter"}`}.`);
  }
  versSecondaire(joueur, perso.cle, lireEtat());
}

async function menuCoupsDePouce(joueur, actions) {
  const creatif = joueur.getGameMode() === GameMode.Creative;
  const boutons = [
    creatif ? "Repasser en survie" : "Passer en créatif (voler)",
    "Me soigner et me nourrir",
    "Un kit de combat",
    "Remplir le coffre de la pièce en cours",
    "Faire jour",
    "Où en est l'aventure ?",
    "Remettre l'aventure à zéro",
    "Retour",
  ];
  const k = await choisir(joueur, "Coups de pouce…", "", boutons);
  if (k === undefined) return;
  if (k === 0) {
    joueur.setGameMode(creatif ? GameMode.Survival : GameMode.Creative);
  } else if (k === 1) {
    const vie = joueur.getComponent("minecraft:health");
    vie?.setCurrentValue(vie.effectiveMax);
    joueur.addEffect("saturation", 20, { amplifier: 10, showParticles: false });
    dire(joueur, "Soigné et rassasié.");
  } else if (k === 2) {
    /** @type {[string, number][]} */
    const kit = [["minecraft:diamond_sword", 1], ["minecraft:bow", 1], ["minecraft:arrow", 64], ["minecraft:shield", 1],
      ["minecraft:diamond_helmet", 1], ["minecraft:diamond_chestplate", 1], ["minecraft:diamond_leggings", 1], ["minecraft:diamond_boots", 1],
      ["minecraft:cooked_beef", 32], ["minecraft:torch", 64], ["minecraft:golden_apple", 4]];
    for (const [objet, n] of kit) donner(joueur, new ItemStack(objet, n));
    dire(joueur, "Kit de combat donné (épée, arc, bouclier, armure en diamant, nourriture, torches).");
  } else if (k === 3) {
    const etat = lireEtat();
    const enCours = Object.keys(PIECES).filter((cle) => etat.pieces?.[cle]?.statut === "en_cours");
    const remplies = enCours.filter((cle) => actions.remplirCoffre(cle));
    if (remplies.length) dire(joueur, `Coffre rempli : ${remplies.join(", ")}.`);
    else pasEncore(joueur, "Aucun coffre de pièce ouvert (ou trop loin : approche-toi de la pièce).");
  } else if (k === 4) {
    world.setTimeOfDay(1000);
    dire(joueur, "Il fait jour (en Barovie, l'heure revient vite au crépuscule).");
  } else if (k === 5) {
    const etat = lireEtat();
    const lignes = QUETES.map((q) => `${q.cle} : ${etatQuete(etat, q).statut}`);
    const pieces = Object.keys(PIECES).map((cle) => `${cle} : ${etat.pieces?.[cle]?.statut ?? "pas ouverte"}`);
    const l = joueur.location;
    await choisir(joueur, "Où en est l'aventure ?", [...lignes, "", ...pieces, "", `Position : ${Math.floor(l.x)} ${Math.floor(l.y)} ${Math.floor(l.z)}`].join("\n"), ["OK"]);
  } else if (k === 6) {
    if (await confirmer(joueur, "Remettre à zéro ?", "Toute la progression est effacée (le domaine reste). Sûr ?")) actions.reinitialiser();
  } else if (k === 7) {
    return ouvrirBaguette(joueur, actions);
  }
}
