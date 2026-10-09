// L'écran du conteur : pendant qu'une région se prépare (première arrivée, premières traversées des
// Brumes et de la porte runique) et à chaque passage de portail, l'écran est noir, le personnage
// immobile et à l'abri, et on lit : un grand titre, une phrase drôle qui change toutes les 8
// secondes, l'avancement en bas de l'écran, et une page du livre du conteur. On ne révèle la région
// qu'une fois tout construit, puis après quelques secondes de plus, le temps que la console reçoive
// le terrain : plus rien ne pousse sous les yeux des joueurs.
//
// L'abri : une petite plateforme invisible (blocs de barrière) à 300 blocs de haut, au-dessus de
// la région qui se prépare (le serveur charge ce qui est autour des joueurs). Une préparation
// avance étape par étape : chaque étape pose une présence (presence.js) sur un lieu et fait charger
// sa zone, jusqu'à ce que le lieu soit construit.
import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { HUMOUR, PAGES } from "./donnees/conteur.js";
import { lireEtat } from "./etat.js";
import { chargerZone, libererZone, chantiersEnCours } from "./construction.js";
import { ajouterPresence, retirerLesPresences } from "./presence.js";

const HAUTEUR_ABRI = 300;
const DELAI_HUMOUR = 8 * 20;
const ATTENTE_REVELATION = 5 * 20; // après la dernière étape, avant de rendre la vue
const ATTENTE_PASSAGE = 8 * 20; // un passage vers une région déjà construite
const ETAPE_MAX = 4 * 60 * 20; // une étape qui n'aboutit pas est abandonnée (message dans la console)
const COULEUR = "10 8 18"; // le noir de l'écran, à peine violet
const LARGEUR_LIGNE = 26; // caractères par ligne (un quart d'écran sur la Switch)
const ZONES_MAX = 6; // zones de chargement à la fois (le monde en accepte 10 en tout)

const abris = new Map(); // joueur.id → { x, y, z, dimension }
const enPassage = new Set(); // joueurs dans le noir, le temps d'un passage ou d'une révélation
let preparation; // la préparation en cours (une à la fois)

function commande(joueur, texte) {
  try {
    joueur.runCommand(texte);
  } catch {
    // commande refusée : on continue sans
  }
}

function noircir(joueur) {
  commande(joueur, `camera @s fade time 0 10 0.5 color ${COULEUR}`);
}

function rendreLaVue(joueur) {
  commande(joueur, `camera @s fade time 0 0.5 2 color ${COULEUR}`);
}

function figer(joueur, fige) {
  commande(joueur, `inputpermission set @s movement ${fige ? "disabled" : "enabled"}`);
}

function humour(decalage = 0) {
  return HUMOUR[(Math.floor(system.currentTick / DELAI_HUMOUR) + decalage) % HUMOUR.length];
}

// Coupe un texte en lignes courtes : en écran partagé à quatre, une ligne trop longue sort de l'écran.
export function couper(texte, largeur = LARGEUR_LIGNE) {
  const lignes = [];
  let ligne = "";
  for (const mot of texte.split(" ")) {
    if (ligne && (ligne + " " + mot).length > largeur) {
      lignes.push(ligne);
      ligne = mot;
    } else ligne = ligne ? `${ligne} ${mot}` : mot;
  }
  if (ligne) lignes.push(ligne);
  return lignes.join("\n");
}

// Au centre : le grand titre et, dessous, l'avancement (« 4 / 27 ») ; en bas : l'étape en cours et
// la phrase drôle, coupées en lignes courtes.
function afficher(joueur, titre, avancement, bas) {
  try {
    joueur.onScreenDisplay.setTitle(couper(titre, 16), { subtitle: avancement, fadeInDuration: 0, stayDuration: DELAI_HUMOUR + 40, fadeOutDuration: 0 });
    joueur.onScreenDisplay.setActionBar(`${bas ? `§e${couper(bas)}\n` : ""}§7${couper(humour(joueur.name.length))}`);
  } catch {
    // joueur parti
  }
}

// La page du livre, dans une fenêtre qu'on ferme quand on l'a lue (réessayée si le joueur est occupé).
function montrerLaPage(joueur, page, essai = 0) {
  if (!page || !joueur.isValid || essai > 5) return;
  let ouverture;
  try {
    ouverture = new ActionFormData().title(page.livre).body(page.texte).button("Fermer le livre").show(joueur);
  } catch {
    return;
  }
  Promise.resolve(ouverture)
    .then((r) => {
      if (r?.canceled && r.cancelationReason === "UserBusy") system.runTimeout(() => montrerLaPage(joueur, page, essai + 1), 40);
    })
    .catch(() => {});
}

// --- L'abri ---

function poserPlateforme(abri, type) {
  try {
    const dim = world.getDimension(abri.dimension);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const b = dim.getBlock({ x: abri.x + dx, y: abri.y - 1, z: abri.z + dz });
        if (b && (type === "minecraft:air" ? b.typeId === "minecraft:barrier" : b.isAir)) b.setType(type);
      }
    }
  } catch {
    // pas encore chargé : on réessaie à la prochaine seconde
  }
}

// Met le joueur à l'abri au-dessus de `lieu` (ou l'y déplace), l'écran noir, immobile.
export function abriter(joueur, lieu, dimension = "minecraft:overworld") {
  if (!joueur?.isValid) return;
  const ancien = abris.get(joueur.id);
  const abri = { x: Math.floor(lieu.x), y: HAUTEUR_ABRI, z: Math.floor(lieu.z), dimension };
  if (ancien && ancien.x === abri.x && ancien.z === abri.z) return;
  if (ancien && (ancien.x !== abri.x || ancien.z !== abri.z)) poserPlateforme(ancien, "minecraft:air");
  abris.set(joueur.id, abri);
  figer(joueur, true);
  noircir(joueur);
  joueur.addEffect("slow_falling", 30 * 20, { showParticles: false });
  joueur.addEffect("resistance", 30 * 20, { amplifier: 4, showParticles: false });
  joueur.teleport({ x: abri.x + 0.5, y: abri.y + 0.1, z: abri.z + 0.5 }, { dimension: world.getDimension(dimension) });
  poserPlateforme(abri, "minecraft:barrier");
}

// Le joueur est-il sous l'écran du conteur (à l'abri, ou dans le noir d'un passage) ?
export function enAttente(joueur) {
  return abris.has(joueur.id) || enPassage.has(joueur.id);
}

// Déplace tous les joueurs à l'abri au-dessus d'un autre lieu (la recherche de la Barovie).
export function deplacerLesAbris(lieu, dimension = "minecraft:overworld") {
  for (const joueur of world.getAllPlayers()) if (abris.has(joueur.id)) abriter(joueur, lieu, dimension);
}

// Toutes les secondes : la plateforme sous les pieds, l'écran noir entretenu, on ne tombe pas.
function tenirLesAbris() {
  for (const joueur of world.getAllPlayers()) {
    const abri = abris.get(joueur.id);
    if (!abri) continue;
    poserPlateforme(abri, "minecraft:barrier");
    noircir(joueur);
    joueur.addEffect("slow_falling", 30 * 20, { showParticles: false });
    const l = joueur.location;
    if (l.y < abri.y - 2 || Math.abs(l.x - abri.x - 0.5) > 2 || Math.abs(l.z - abri.z - 0.5) > 2) {
      joueur.teleport({ x: abri.x + 0.5, y: abri.y + 0.1, z: abri.z + 0.5 }, { dimension: world.getDimension(abri.dimension) });
    }
  }
}

// Rend le joueur au monde : `poser(joueur)` le place à destination, écran encore noir ; la vue
// revient quand la console a reçu le terrain.
export function liberer(joueur, poser, attente = ATTENTE_REVELATION) {
  const abri = abris.get(joueur.id);
  abris.delete(joueur.id);
  if (abri && ![...abris.values()].some((a) => a.x === abri.x && a.z === abri.z)) poserPlateforme(abri, "minecraft:air");
  if (!joueur.isValid) return;
  enPassage.add(joueur.id);
  noircir(joueur);
  joueur.removeEffect("slow_falling");
  try {
    poser(joueur);
  } catch (erreur) {
    console.warn(`[aventure] conteur : ${erreur}`);
  }
  system.runTimeout(() => {
    enPassage.delete(joueur.id);
    if (!joueur.isValid) return;
    joueur.removeEffect("resistance");
    figer(joueur, false);
    rendreLaVue(joueur);
  }, attente);
}

// --- Préparer une région ---

// options : { cle, titre, page (clé de PAGES), joueurs, etapes, fin(joueur) }. Une étape :
// { nom, points?(etat) → [{x, z}] (présence et chargement), rayon?, lancer?(), fait(etat) }.
// Un joueur qui arrive pendant la préparation la rejoint (rejoindre).
export function preparer(options) {
  if (preparation) {
    for (const j of options.joueurs) rejoindre(j, options.fin);
    return;
  }
  const page = PAGES[options.page];
  const premier = abris.get(options.joueurs[0]?.id);
  preparation = { ...options, i: -1, debut: 0, fins: new Map(), abri: premier };
  for (const j of options.joueurs) {
    preparation.fins.set(j.id, options.fin);
    montrerLaPage(j, page);
  }
  const dim = world.getDimension("overworld");
  const id = system.runInterval(() => {
    const p = preparation;
    tenirLesAbris();
    const total = p.etapes.length;
    if (p.i >= total) return;
    const etat = lireEtat();
    // L'étape en cours est-elle faite (ou trop longue) ? On passe à la suivante.
    const e = p.etapes[p.i];
    // Une étape est faite quand son état le dit et que plus rien ne se construit (le nettoyage des
    // restes d'arbres en l'air suit chaque construction : ses zones doivent rester chargées).
    if (p.i < 0 || (e.fait(etat) && chantiersEnCours() === 0) || system.currentTick - p.debut > (e.max ?? ETAPE_MAX)) {
      if (e && !e.fait(etat)) console.warn(`[aventure] conteur : « ${e.nom} » n'a pas abouti, on continue`);
      oublierLesZones(dim);
      p.i++;
      while (p.i < total && p.etapes[p.i].fait(lireEtat())) p.i++;
      p.debut = system.currentTick;
      if (p.i >= total) {
        terminer(id);
        return;
      }
      // Tous les lieux de l'étape à la fois : une présence et une zone de chargement chacun (ou une
      // seule zone pour des points proches, comme une route).
      const suivante = p.etapes[p.i];
      const tous = suivante.points?.(lireEtat()) ?? [];
      const points = suivante.zoneUnique ? tous : tous.slice(0, ZONES_MAX);
      const r = suivante.rayon ?? 32;
      // Des noms neufs à chaque étape : le serveur refuse une zone dont le nom vient d'être retiré
      // dans la même seconde (l'étape attendait alors un terrain qui ne se chargeait jamais).
      const nom = (k) => `conteur${p.i}x${k}`;
      if (suivante.zoneUnique && points.length > 0) {
        chargerZone(dim, nom(0), points.flatMap((pt) => [{ x: pt.x - r, z: pt.z - r }, { x: pt.x + r, z: pt.z + r }]));
        zones.push(nom(0));
      } else {
        points.forEach((pt, k) => {
          chargerZone(dim, nom(k), [{ x: pt.x - r, z: pt.z - r }, { x: pt.x + r, z: pt.z + r }]);
          zones.push(nom(k));
        });
      }
      points.forEach((pt, k) => ajouterPresence(`conteur${k}`, pt));
    }
    const en = p.etapes[p.i];
    en.lancer?.();
    for (const j of world.getAllPlayers()) if (p.fins.has(j.id)) afficher(j, p.titre, `§e${p.i + 1} / ${total}`, en.nom);
  }, 20);
}

// Les présences et zones de chargement de l'étape terminée.
const zones = [];
function oublierLesZones(dim) {
  retirerLesPresences();
  while (zones.length > 0) libererZone(dim, zones.pop());
}

function terminer(id) {
  system.clearRun(id);
  const p = preparation;
  oublierLesZones(world.getDimension("overworld"));
  for (const j of world.getAllPlayers()) if (p.fins.has(j.id)) afficher(j, p.titre, "§aTout est prêt !");
  // Encore un instant dans le noir, puis chacun est posé à destination.
  system.runTimeout(() => {
    preparation = undefined;
    for (const j of world.getAllPlayers()) {
      const fin = p.fins.get(j.id);
      if (fin) liberer(j, fin);
    }
  }, ATTENTE_REVELATION);
}

export function preparationEnCours(cle) {
  return preparation !== undefined && (cle === undefined || preparation.cle === cle);
}

// Le joueur attendait cette préparation (il s'est déconnecté pendant l'attente) ?
export function participe(joueur) {
  return preparation?.fins.has(joueur.id) === true;
}

// Il revient : à l'abri avec les autres.
export function reprendre(joueur) {
  if (!preparation?.abri) return;
  abriter(joueur, preparation.abri, preparation.abri.dimension);
  montrerLaPage(joueur, PAGES[preparation.page]);
}

// Un joueur resté dans le noir ou immobile (serveur arrêté pendant une attente) retrouve la vue.
export function rendreLaMain(joueur) {
  abris.delete(joueur.id);
  enPassage.delete(joueur.id);
  figer(joueur, false);
  rendreLaVue(joueur);
}

// Un joueur rejoint la préparation en cours (il arrive par le même portail, ou se connecte).
export function rejoindre(joueur, fin) {
  if (!preparation) return false;
  preparation.fins.set(joueur.id, fin ?? preparation.fin);
  montrerLaPage(joueur, PAGES[preparation.page]);
  return true;
}

// Un passage vers une région déjà construite : écran noir, on est posé à destination, la vue revient
// une fois le terrain reçu.
export function passer(joueur, titre, poser) {
  if (!joueur?.isValid) return;
  enPassage.add(joueur.id);
  figer(joueur, true);
  noircir(joueur);
  joueur.addEffect("resistance", 20 * 20, { amplifier: 4, showParticles: false });
  afficher(joueur, titre, "", "Le chemin se dessine…");
  system.runTimeout(() => {
    if (!joueur.isValid) return;
    abris.delete(joueur.id);
    liberer(joueur, poser, ATTENTE_PASSAGE);
  }, 15);
}
