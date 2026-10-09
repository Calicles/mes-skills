// Sauter à une étape (baguette et carnet du testeur, /scriptevent aventure:aller) : tout ce qui
// précède l'étape choisie est fait (quêtes finies, pièces restaurées d'office, sceaux et braises
// rendus), puis l'étape elle-même est préparée et le testeur emmené devant. Ce qui doit exister
// avant (le camp de Madame Zora, la mine de Thorgrim et sa porte, la cité, le château) se construit
// d'abord : le testeur l'attend sur place, le temps restant affiché en bas de l'écran.
import { world, system } from "@minecraft/server";
import { lireEtat, modifierEtat } from "./etat.js";
import { restaurerDOffice } from "./pieces.js";
import { positionDuLieu } from "./lieux.js";
import { traverserVersLaBarovie as emmenerEnBarovie, traverserVersLaCite as emmenerDansLaCite } from "./regions.js";
import { positionDuCimetiere } from "./cimetiere.js";
import { positionDeLaForet } from "./foret.js";
import { positionDuMarais } from "./marais.js";
import { positionDuChateau } from "./chateau.js";
import { preparerDenouement, positionDuTombeau } from "./denouement.js";
import { reveillerLaPorte, positionDeLaMine, centreCite } from "./profondeurs.js";
import { preparerLeCristal } from "./cristal.js";
import { preparerLesChampignons } from "./champignons.js";
import { preparerLaLave } from "./lave.js";
import { preparerLaForge, preparerLaMine } from "./forge.js";
import { atterrir, ORDRE_DES_ETAPES } from "./testeur.js";

const ATTENTE_MAX = 5 * 60; // secondes

const finie = () => ({ statut: "finie", progression: {} });
const aFaire = () => ({ statut: "a_faire", progression: {} });
const hier = () => world.getDay() - 1;

// Une quête en cours (sauf si elle est déjà finie), avec ce qui est déjà fait.
function avancer(e, cle, progression = {}) {
  if (e[cle]?.statut === "finie") return;
  e[cle] = { statut: "en_cours", progression: { ...(e[cle]?.progression ?? {}), ...progression } };
}

function dire(texte) {
  world.sendMessage(`§e[aventure] ${texte}`);
}

// --- Ce qui est fait, une fois une étape dépassée ---

const FAIT = {
  cuisine: (e) => (e.quete1 = finie()),
  quete2: (e) => (e.quete2 = finie()),
  alchimiste: () => {},
  bibliotheque: () => {},
  quete3: (e) => (e.quete3 = finie()),
  armes: () => {},
  quete4: (e) => avancer(e, "quete4"),
  gardien: (e) => {
    e.quete4 = finie();
    e.gardien = { statut: "vaincu" };
  },
  // La fête du chapitre 1 a eu lieu hier (la roulotte arrive au domaine) et les Brumes sont ouvertes
  // (l'arche s'élève au nord du domaine).
  barovie: (e) => {
    e.barovie = { ...(e.barovie ?? {}), jourDeLaFete: Math.min(e.barovie?.jourDeLaFete ?? hier(), hier()), heureDeLaFete: 0, ouverte: true };
  },
  zora: (e) => avancer(e, "quete5"),
  cimetiere: (e) => avancer(e, "quete5", { tombes: 1 }),
  foret: (e) => avancer(e, "quete5", { loup: 1 }),
  marais: (e) => (e.quete5 = { statut: "finie", progression: { tombes: 1, loup: 1, eaux: 1 } }),
  chateau: (e) => avancer(e, "quete6", { entrer: 1, cles: 4 }),
  comte: (e) => (e.quete6 = finie()),
  ecurie: () => {},
  // Le repos après le chapitre 2 est passé : la mine surgira dès l'écurie restaurée.
  profondeurs: (e) => {
    if (!e.profondeurs?.thorgrim) e.profondeurs = { ...(e.profondeurs ?? {}), jourFin: hier(), heureFin: 0 };
  },
  cite: () => {}, // la porte runique : voir attendreLaPorte
  cristal: (e) => avancer(e, "quete7", { cristal: 1 }),
  champignons: (e) => avancer(e, "quete7", { champignons: 1 }),
  lave: (e) => {
    e.quete7 = { statut: "finie", progression: { cristal: 1, champignons: 1, lave: 1 } };
    e.profondeurs = { ...(e.profondeurs ?? {}), forgerons: true, marche: true, maisons: true };
  },
  forge: (e) => {
    e.profondeurs = { ...(e.profondeurs ?? {}), forge: true, cadeaux: true, chaleur: e.profondeurs?.chaleur ?? false };
  },
  mine: () => {},
};

// Les pièces restaurées d'office une fois leur étape dépassée (sans ingrédients ni fête).
const PIECES_DES_ETAPES = { cuisine: "cuisine", alchimiste: "alchimiste", bibliotheque: "bibliotheque", armes: "armes", ecurie: "ecurie" };

// --- Attendre que quelque chose soit construit ---

// Une seule attente à la fois : un nouveau saut annule celle du précédent.
let attente;

function attendre(joueur, pret, texte, ensuite) {
  if (attente !== undefined) system.clearRun(attente);
  attente = undefined;
  if (pret(lireEtat())) {
    ensuite();
    return;
  }
  dire(texte);
  let secondes = 0;
  const id = system.runInterval(() => {
    secondes++;
    if (pret(lireEtat())) {
      system.clearRun(id);
      attente = undefined;
      ensuite();
      return;
    }
    if (joueur?.isValid) joueur.onScreenDisplay.setActionBar(`§7${texte} (${secondes} s)`);
    if (secondes >= ATTENTE_MAX) {
      system.clearRun(id);
      attente = undefined;
      world.sendMessage(`§c[aventure] Toujours pas prêt après 5 minutes (${texte}). Reste sur place, ou recommence le saut.`);
    }
  }, 20);
  attente = id;
}

function auDomaine(joueur, dx, dy, dz, regard) {
  const d = lireEtat().domaine;
  if (!joueur || !d.pose) return;
  const c = d.centre;
  joueur.teleport({ x: c.x + dx, y: c.y + dy, z: c.z + dz }, regard ? { facingLocation: { x: c.x + regard.x, y: c.y + regard.y, z: c.z + regard.z } } : undefined);
}

// Le chapitre 3 s'ouvre avec l'écurie restaurée, puis la mine surgit au nord du domaine : le testeur
// attend devant l'écurie, puis devant la mine.
function attendreLaMine(joueur, ensuite) {
  auDomaine(joueur, -6.5, 1, 6.5);
  attendre(joueur, (e) => e.pieces?.ecurie?.statut === "restauree", "L'écurie se restaure au domaine…", () => {
    const mine = positionDeLaMine();
    if (joueur && mine) joueur.teleport({ x: mine.x - 4, y: mine.y, z: mine.z - 1 });
    attendre(joueur, (e) => e.profondeurs?.mine === true, "La terre tremble, la mine surgit…", ensuite);
  });
}

// La porte runique réveillée (les runes s'allument une à une, Thorgrim passe le premier).
function attendreLaPorte(joueur, ensuite) {
  attendreLaMine(joueur, () => {
    reveillerLaPorte();
    attendre(joueur, (e) => e.profondeurs?.porte === true, "Thorgrim réveille la porte runique…", ensuite);
  });
}

// Dans la cité (construite d'abord s'il le faut), l'étape préparée, le testeur posé à `lieu`.
function versLaCite(joueur, preparer, lieu, message) {
  attendreLaPorte(joueur, () => {
    preparer();
    if (!joueur) {
      dire(message);
      return;
    }
    emmenerDansLaCite(joueur, (e) => {
      const b = centreCite(e);
      if (b) joueur.teleport(lieu(b));
      dire(message);
    });
  });
}

// En Barovie (le camp construit d'abord s'il le faut), posé au-dessus du lieu.
function versLaBarovie(joueur, position) {
  if (joueur) emmenerEnBarovie(joueur, (e) => atterrir(joueur, position(e)));
}

// --- L'étape elle-même ---

const DEBUT = {
  cuisine: () => {
    modifierEtat((e) => delete e.pieces?.cuisine);
    dire("Quête 1 finie : le coffre de la cuisine va apparaître dans ses ruines.");
  },
  quete2: () => {
    modifierEtat((e) => (e.quete2 = aFaire()));
    dire("Cuisine restaurée d'office : parle à Maître Gaston (quête 2).");
  },
  alchimiste: () => {
    modifierEtat((e) => delete e.pieces?.alchimiste);
    dire("Quête 2 finie : le coffre de la salle d'alchimiste va apparaître dans ses ruines.");
  },
  bibliotheque: (j) => {
    modifierEtat((e) => delete e.pieces?.bibliotheque);
    auDomaine(j, -2.5, 1, -9.5, { x: -6, y: 2, z: -12 });
    dire("L'escalier en ruine et le coffre de la bibliothèque de Merlin vont apparaître dans la grande salle. /scriptevent aventure:piece bibliotheque le remplit.");
  },
  quete3: () => {
    modifierEtat((e) => (e.quete3 = aFaire()));
    dire("Salle d'alchimiste et bibliothèque restaurées d'office : parle à Dame Morgane (quête 3).");
  },
  armes: () => {
    modifierEtat((e) => delete e.pieces?.armes);
    dire("Quête 3 finie : le coffre de la salle d'armes va apparaître dans ses ruines.");
  },
  quete4: () => {
    modifierEtat((e) => {
      e.quete4 = aFaire();
      e.gardien = { statut: "dort" };
    });
    dire("Salle d'armes restaurée d'office : parle à Perceval (quête 4).");
  },
  gardien: (j) => {
    modifierEtat((e) => {
      e.quete4 = { statut: "en_cours", progression: {} };
      e.gardien = { statut: "dort" };
    });
    const ruine = positionDuLieu("ruineFinale");
    if (j && ruine) atterrir(j, { x: ruine.x, y: ruine.y, z: ruine.z + 16 });
    dire("Quête 4 en cours : la ruine maudite se construit à ton approche. Touche la pierre de ralliement !");
  },
  barovie: (j) => {
    modifierEtat((e) => {
      e.quete5 = aFaire();
      e.barovie = { ...(e.barovie ?? {}), jourDeLaFete: hier(), heureDeLaFete: 0 };
    });
    auDomaine(j, -3.5, 1, 18.5, { x: -8, y: 2, z: 18.5 });
    dire("Chapitre 1 fini, repos sauté : la roulotte de Madame Esméralda arrive au domaine. Parle-lui !");
  },
  zora: (j) => {
    modifierEtat((e) => (e.quete5 = aFaire()));
    if (j) emmenerEnBarovie(j);
    dire("Brumes ouvertes : te voilà au camp (construit d'abord s'il le faut). Parle à Madame Zora (tirage des cartes).");
  },
  cimetiere: (j) => {
    modifierEtat((e) => avancer(e, "quete5"));
    versLaBarovie(j, positionDuCimetiere);
    dire("La quête des sceaux est en cours : le cimetière se construit à ton approche.");
  },
  foret: (j) => {
    modifierEtat((e) => avancer(e, "quete5"));
    versLaBarovie(j, positionDeLaForet);
    dire("Sceau des tombes rapporté : la forêt des loups se construit à ton approche. Suis les traces !");
  },
  marais: (j) => {
    modifierEtat((e) => avancer(e, "quete5"));
    versLaBarovie(j, positionDuMarais);
    dire("Sceaux des tombes et du loup rapportés : le marais se construit à ton approche.");
  },
  chateau: (j) => {
    modifierEtat((e) => {
      if (e.quete6?.statut !== "en_cours") e.quete6 = aFaire();
    });
    versLaBarovie(j, positionDuChateau);
    dire("Les trois sceaux sont rapportés : le château se construit à ton approche, la herse va se lever.");
  },
  // Le château doit être construit jusqu'à sa tour (partie 2) : le testeur l'attend devant le pont.
  comte: (j) => {
    versLaBarovie(j, positionDuChateau);
    attendre(j, (e) => e.barovie?.chateau?.partie2?.pose === true, "Le château se construit (murs, salles, tour)…", () => {
      preparerDenouement();
      modifierEtat((e) => {
        e.quete6 = { statut: "en_cours", progression: { entrer: 1, cles: 4, coeur: 1, epee: 1, tombeau: 1 } };
      });
      const tombeau = positionDuTombeau();
      if (j?.isValid && tombeau) j.teleport(tombeau);
      dire("Quête 6 au dernier objectif, Cœur brisé, Épée trouvée : le mur du tombeau va s'ouvrir.");
    });
  },
  ecurie: (j) => {
    auDomaine(j, -6.5, 1, 6.5);
    dire("Quête 6 finie : la roulotte, les ruines de l'écurie, les licornes et le coffre arrivent. /scriptevent aventure:piece ecurie le remplit.");
  },
  profondeurs: (j) => {
    modifierEtat((e) => {
      e.profondeurs = { jourFin: hier(), heureFin: 0 };
    });
    auDomaine(j, -6.5, 1, 6.5);
    attendre(j, (e) => e.pieces?.ecurie?.statut === "restauree", "L'écurie se restaure au domaine…", () => {
      const mine = positionDeLaMine();
      if (j?.isValid && mine) j.teleport({ x: mine.x - 4, y: mine.y, z: mine.z - 1 });
      dire("Chapitres 1 et 2 finis, repos sauté : la terre va trembler au nord du domaine.");
    });
  },
  cite: (j) => {
    attendreLaMine(j, () => {
      reveillerLaPorte();
      const mine = positionDeLaMine();
      if (j?.isValid && mine) j.teleport({ x: mine.x, y: mine.y, z: mine.z - 14 });
      dire("Thorgrim réveille la porte runique : entre dans l'arche, au fond de la mine.");
    });
  },
  cristal: (j) => versLaCite(j, preparerLeCristal, (b) => ({ x: b.x - 35.5, y: b.y + 1, z: b.z - 33.5 }), "Quête 7 en cours : la grille du grand escalier va se lever."),
  champignons: (j) => versLaCite(j, preparerLesChampignons, (b) => ({ x: b.x - 37.5, y: b.y + 1, z: b.z - 1.5 }), "Braise de cristal rendue : le quartier des forgerons se rallume, puis la porte des champignons s'ouvre."),
  lave: (j) => versLaCite(j, preparerLaLave, (b) => ({ x: b.x + 0.5, y: b.y + 1, z: b.z - 19.5 }), "Braises de cristal et des champignons rendues : la trappe derrière la Grande Forge va s'ouvrir."),
  forge: (j) => versLaCite(j, preparerLaForge, (b) => ({ x: b.x + 0.5, y: b.y + 1, z: b.z + 3.5 }), "Les trois braises sont dans le foyer : frappez l'enclume géante (3 coups) !"),
  mine: (j) => {
    attendreLaPorte(j, () => {
      preparerLaMine();
      const mine = positionDeLaMine();
      if (j?.isValid && mine) j.teleport(mine);
      dire("La forge est rallumée : le coffre de la vieille mine va apparaître. /scriptevent aventure:piece mine le remplit.");
    });
  },
};

export function allerA(etape, joueur) {
  const i = ORDRE_DES_ETAPES.indexOf(etape);
  if (i < 0) {
    world.sendMessage(`§e[aventure] Étape inconnue (${ORDRE_DES_ETAPES.join(", ")}).`);
    return;
  }
  if (attente !== undefined) system.clearRun(attente);
  attente = undefined;
  const passees = ORDRE_DES_ETAPES.slice(0, i);
  modifierEtat((e) => {
    for (const cle of passees) FAIT[cle](e);
  });
  for (const cle of passees) if (PIECES_DES_ETAPES[cle]) restaurerDOffice(PIECES_DES_ETAPES[cle]);
  DEBUT[etape](joueur?.typeId === "minecraft:player" ? joueur : undefined);
}
