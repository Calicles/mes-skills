// Outils de construction partagés par le domaine et les lieux de quête.
import { BlockPermutation, BlockVolume, system } from "@minecraft/server";
import { nettoyerArbres } from "./arbres.js";

// Blocs qui ne comptent pas comme le sol : arbres, plantes, neige, et les blocs de barrière (la
// plateforme invisible où les joueurs attendent sous l'écran du conteur, très haut dans le ciel).
export const PAS_UN_SOL = /leaves|log|wood|short_grass|tall_grass|fern|flower|bush|snow_layer|vine|mushroom|sapling|dandelion|poppy|barrier/;

// Anciens identifiants de blocs, essayés si le nouveau n'existe pas dans la version du jeu.
const ANCIENS_NOMS = {
  "minecraft:stone_bricks": "minecraft:stonebrick",
  "minecraft:grass_path": "minecraft:dirt_path",
  "minecraft:oak_fence": "minecraft:fence",
  "minecraft:red_carpet": "minecraft:carpet",
  "minecraft:dark_oak_planks": "minecraft:planks",
  "minecraft:oak_planks": "minecraft:planks",
  "minecraft:oak_log": "minecraft:log",
  "minecraft:spruce_log": "minecraft:log",
  "minecraft:spruce_planks": "minecraft:planks",
  "minecraft:spruce_slab": "minecraft:wooden_slab",
  "minecraft:dark_oak_slab": "minecraft:wooden_slab",
  "minecraft:brown_carpet": "minecraft:carpet",
  "minecraft:mud_bricks": "minecraft:brick_block",
  "minecraft:deepslate_bricks": "minecraft:stone_bricks",
  "minecraft:polished_deepslate": "minecraft:stone",
  "minecraft:dark_oak_log": "minecraft:log2",
  "minecraft:purpur_slab": "minecraft:stone_block_slab2",
  "minecraft:purple_carpet": "minecraft:carpet",
  "minecraft:polished_blackstone_bricks": "minecraft:stone_bricks",
  "minecraft:cracked_deepslate_bricks": "minecraft:cracked_stone_bricks",
  "minecraft:deepslate_tiles": "minecraft:stone_bricks",
  "minecraft:skeleton_skull": "minecraft:skull",
  "minecraft:dragon_head": "minecraft:skull",
  "minecraft:wither_skeleton_skull": "minecraft:skull",
  "minecraft:red_wool": "minecraft:wool",
  "minecraft:blue_wool": "minecraft:wool",
  "minecraft:lime_wool": "minecraft:wool",
  "minecraft:white_wool": "minecraft:wool",
  "minecraft:chiseled_stone_bricks": "minecraft:stone_bricks",
  "minecraft:smooth_stone": "minecraft:stone",
  "minecraft:polished_andesite": "minecraft:stone",
  "minecraft:coarse_dirt": "minecraft:dirt",
  "minecraft:stripped_spruce_log": "minecraft:log",
  "minecraft:cobbled_deepslate_slab": "minecraft:stone_block_slab",
};

// --- Les blocs refusés faute de terrain chargé : rejoués plus tard ---

// Un remplissage ou un bloc posé sur un tronçon pas (encore) chargé n'est pas perdu : il attend, et il
// est rejoué dès que le terrain est là (3 minutes au plus). Le premier en attente fait charger sa zone.
const enAttente = [];
const ATTENTE_MAX = 3 * 60 * 20;
let rattrapage;
let zoneDeRattrapage; // { dimension, nom } la zone de chargement en cours
let numeroDeZone = 0;

function nonCharge(erreur) {
  return /Unloaded|unloaded/.test(String(erreur));
}

function dansLeMonde(de, a) {
  return Math.min(de.y, a.y) >= -64 && Math.max(de.y, a.y) <= 319;
}

function mettreEnAttente(travail) {
  if (!dansLeMonde(travail.de, travail.a)) {
    console.warn(`[aventure] ${travail.nom} : hors du monde, ignoré`);
    return;
  }
  if (enAttente.length >= 4000) return; // garde-fou : une file qui déborde n'aide plus personne
  enAttente.push({ ...travail, depuis: system.currentTick });
  if (rattrapage === undefined) rattrapage = system.runInterval(rattraper, 20);
}

function rattraper() {
  for (const t of [...enAttente]) {
    let fini = true;
    try {
      t.faire();
    } catch (erreur) {
      if (nonCharge(erreur) && system.currentTick - t.depuis <= ATTENTE_MAX) fini = false;
      else console.warn(`[aventure] ${t.nom} impossible : ${erreur}`);
    }
    if (fini) enAttente.splice(enAttente.indexOf(t), 1);
  }
  if (zoneDeRattrapage) libererZone(zoneDeRattrapage.dimension, zoneDeRattrapage.nom);
  zoneDeRattrapage = undefined;
  if (enAttente.length === 0) {
    system.clearRun(rattrapage);
    rattrapage = undefined;
    return;
  }
  // Le premier en attente fait charger son terrain (un nom neuf à chaque fois).
  const t = enAttente[0];
  zoneDeRattrapage = { dimension: t.dimension, nom: `rattrapage${numeroDeZone++}` };
  chargerZone(t.dimension, zoneDeRattrapage.nom, [t.de, t.a]);
}

function remplirMaintenant(dimension, volume, bloc, options) {
  try {
    dimension.fillBlocks(volume, bloc, options);
  } catch (erreur) {
    const ancien = typeof bloc === "string" ? ANCIENS_NOMS[bloc] : undefined;
    if (!ancien || nonCharge(erreur)) throw erreur;
    dimension.fillBlocks(volume, ancien, options);
  }
}

export function remplir(dimension, de, a, bloc, options) {
  if (chantierCourant && bloc === "minecraft:air" && !options) noterDegagement(chantierCourant, dimension, de, a);
  const volume = new BlockVolume(de, a);
  const nom = `remplissage ${typeof bloc === "string" ? bloc : bloc.type.id}`;
  try {
    remplirMaintenant(dimension, volume, bloc, options);
  } catch (erreur) {
    if (nonCharge(erreur)) mettreEnAttente({ nom, dimension, de, a, faire: () => remplirMaintenant(dimension, volume, bloc, options) });
    else console.warn(`[aventure] ${nom} impossible : ${erreur}`);
  }
}

function poserSur(cible, dimension, lieu, bloc) {
  if (typeof bloc !== "string") {
    cible.setPermutation(bloc);
  } else {
    try {
      cible.setType(bloc);
    } catch (erreur) {
      if (!ANCIENS_NOMS[bloc]) throw erreur;
      cible.setType(ANCIENS_NOMS[bloc]);
    }
  }
  if (bloc === "minecraft:chest") orienterCoffre(cible);
  noter(dimension, lieu, bloc);
  return cible;
}

function poserMaintenant(dimension, lieu, bloc) {
  const cible = dimension.getBlock(lieu);
  if (!cible) throw new Error("Unloaded");
  poserSur(cible, dimension, lieu, bloc);
}

export function poser(dimension, lieu, bloc) {
  const nom = `bloc ${typeof bloc === "string" ? bloc : bloc.type.id}`;
  try {
    const cible = dimension.getBlock(lieu);
    if (cible) return poserSur(cible, dimension, lieu, bloc);
    mettreEnAttente({ nom, dimension, de: lieu, a: lieu, faire: () => poserMaintenant(dimension, lieu, bloc) });
  } catch (erreur) {
    if (nonCharge(erreur)) mettreEnAttente({ nom, dimension, de: lieu, a: lieu, faire: () => poserMaintenant(dimension, lieu, bloc) });
    else console.warn(`[aventure] ${nom} impossible à poser : ${erreur}`);
  }
  return undefined;
}

export function permutation(type, etats) {
  try {
    return BlockPermutation.resolve(type, etats);
  } catch {
    return BlockPermutation.resolve(type);
  }
}

// Un rectangle de blocs au niveau y, en coordonnées relatives au centre.
export function rectangle(dim, c, y, x1, z1, x2, z2, bloc, options) {
  remplir(dim, { x: c.x + x1, y, z: c.z + z1 }, { x: c.x + x2, y, z: c.z + z2 }, bloc, options);
}

// Le sol en (x, z), sans arbres, plantes ni eau ; undefined si la zone n'est pas chargée.
export function trouverSol(dimension, x, z) {
  try {
    const sol = dimension.getTopmostBlock({ x, z });
    if (!sol) return undefined;
    let y = sol.location.y;
    let bloc = sol;
    while (bloc && y > -60 && (bloc.isAir || bloc.isLiquid || PAS_UN_SOL.test(bloc.typeId))) {
      bloc = bloc.below();
      y--;
    }
    return { x, y: Math.max(y, 62), z };
  } catch {
    return undefined;
  }
}

// Le serveur ne garde chargés que les tronçons proches des joueurs (distance de simulation : 4 tronçons
// par défaut, une soixantaine de blocs) : un grand lieu en déborde, et ses coins ne se chargent
// jamais. Une zone de chargement (ticking area, 100 tronçons au plus) couvre alors tous ses points
// (coordonnées du monde) le temps de la construction ; `libererZone` la retire à la fin.
export function chargerZone(dim, nom, points) {
  const xs = points.map((p) => Math.floor(p.x));
  const zs = points.map((p) => Math.floor(p.z));
  try {
    dim.runCommand(`tickingarea add ${Math.min(...xs)} 64 ${Math.min(...zs)} ${Math.max(...xs)} 64 ${Math.max(...zs)} aventure_${nom} true`);
  } catch {
    // déjà demandée
  }
}

export function libererZone(dim, nom) {
  try {
    dim.runCommand(`tickingarea remove aventure_${nom}`);
  } catch {
    // aucune zone à retirer
  }
}

// Un coffre neuf tourne son ouverture vers l'espace libre (jamais vers le mur contre lequel il est
// posé). Sans orientation, Bedrock le pose toujours dans le même sens. À n'utiliser que sur un
// coffre qu'on vient de poser (vide).
const COTES = [
  { nom: "north", face: 2, voisin: (b) => b.north(), oppose: (b) => b.south() },
  { nom: "south", face: 3, voisin: (b) => b.south(), oppose: (b) => b.north() },
  { nom: "west", face: 4, voisin: (b) => b.west(), oppose: (b) => b.east() },
  { nom: "east", face: 5, voisin: (b) => b.east(), oppose: (b) => b.west() },
];

// Un bloc qui ne bouche pas l'ouverture d'un coffre (air, eau, petits objets posés).
const PAS_UN_MUR = /air|water|torch|lantern|carpet|candle|sign|button|fence|flower|grass|fern|web|chain|banner|pressure_plate|rail|snow_layer|lever|campfire|skull|head/;

function libre(b) {
  return b !== undefined && (b.isAir || b.isLiquid || PAS_UN_MUR.test(b.typeId));
}

export function orienterCoffre(coffre) {
  try {
    if (!coffre || coffre.typeId !== "minecraft:chest") return;
    const note = (c) => {
      const devant = c.voisin(coffre);
      const derriere = c.oppose(coffre);
      if (!libre(devant)) return 0;
      return derriere && !libre(derriere) ? 2 : 1;
    };
    const meilleur = COTES.reduce((m, c) => (note(c) > note(m) ? c : m), COTES[1]);
    if (note(meilleur) === 0) return;
    try {
      coffre.setPermutation(BlockPermutation.resolve("minecraft:chest", { "minecraft:cardinal_direction": meilleur.nom }));
    } catch {
      const ancien = /** @type {any} */ ({ facing_direction: meilleur.face });
      coffre.setPermutation(BlockPermutation.resolve("minecraft:chest", ancien));
    }
  } catch (erreur) {
    console.warn(`[aventure] orientation du coffre : ${erreur}`);
  }
}

// --- Les appuis : ce qui doit être tenu (lanternes, torches, bougies, crânes, plantes) ---
// Pendant un chantier, `poser` note ces blocs ; à la fin, chacun est vérifié : rien ne doit flotter
// (dans le jeu, un bloc sans appui tombe dès qu'un voisin bouge, et laisse un objet par terre).
const SENSIBLES = /:(soul_)?lantern$|torch$|candle$|skull$|_head$|^aventure:(etagere_fioles|ratelier|rotisserie|alambic|mannequin|trophee)$|^minecraft:(waterlily|snow_layer|short_grass|fern|poppy|dandelion|cornflower|oxeye_daisy|allium|pink_tulip|red_tulip|lily_of_the_valley|rose_bush|red_mushroom|brown_mushroom|sweet_berry_bush|wither_rose|furnace|smoker|blast_furnace|lectern|loom|carved_pumpkin|barrel)$/;
const PAS_PORTEUR = /:(soul_)?lantern$|torch|candle|carpet|rail|button|sign|ladder|web|snow_layer|pressure_plate|skull|_head|flower_pot|vine|short_grass|tall_grass|fern|poppy|dandelion|daisy|allium|tulip|orchid|bluet|rose|lily|sapling|_moss$|mushroom$|bush$|reeds|waterlily/;
const TERRE = /grass_block|dirt|podzol|moss_block|mud|farmland|mycelium|clay|sand|gravel/;
// (nos meubles aussi : leur face est au sud dans le modèle, l'état tourne le modèle)
const ORIENTABLES = /^minecraft:(furnace|smoker|blast_furnace|lectern|loom|carved_pumpkin)$|^aventure:(etagere_fioles|ratelier|rotisserie|alambic|mannequin|trophee)$/;
let collecte;
let chantierCourant;

// Les colonnes dégagées (remplies d'air) pendant un chantier : passées en revue à la fin, pour
// retirer les restes d'arbres en l'air (arbres.js).
function noterDegagement(chantier, dim, de, a) {
  const z = chantier.degage;
  const x1 = Math.floor(Math.min(de.x, a.x));
  const x2 = Math.floor(Math.max(de.x, a.x));
  const z1 = Math.floor(Math.min(de.z, a.z));
  const z2 = Math.floor(Math.max(de.z, a.z));
  chantier.degage = z
    ? { dim: z.dim, x1: Math.min(z.x1, x1), x2: Math.max(z.x2, x2), z1: Math.min(z.z1, z1), z2: Math.max(z.z2, z2) }
    : { dim, x1, x2, z1, z2 };
}

function noter(dim, lieu, bloc) {
  if (!collecte) return;
  const type = typeof bloc === "string" ? bloc : bloc.type.id;
  if (SENSIBLES.test(type)) collecte.push({ dim, lieu: { x: Math.floor(lieu.x), y: Math.floor(lieu.y), z: Math.floor(lieu.z) }, type, explicite: typeof bloc !== "string" });
}

function porteur(b) {
  return b !== undefined && !b.isAir && !b.isLiquid && !PAS_PORTEUR.test(b.typeId);
}

// Un mur voisin (est, ouest, sud, nord) : la direction dans laquelle regarde ce qui s'y accroche.
const MURS = [
  { dx: 1, dz: 0, torche: "west", face: 4 },
  { dx: -1, dz: 0, torche: "east", face: 5 },
  { dx: 0, dz: 1, torche: "north", face: 2 },
  { dx: 0, dz: -1, torche: "south", face: 3 },
];

function murVoisin(dim, l) {
  return MURS.find((m) => porteur(dim.getBlock({ x: l.x + m.dx, y: l.y, z: l.z + m.dz })));
}

function remplacer(b, type, etats) {
  try {
    b.setPermutation(BlockPermutation.resolve(type, etats));
    return true;
  } catch {
    return false;
  }
}

function verifierUn({ dim, lieu: l, type, explicite }) {
  const b = dim.getBlock(l);
  if (!b || b.typeId !== type) return;
  const dessous = dim.getBlock({ x: l.x, y: l.y - 1, z: l.z });
  const dessus = dim.getBlock({ x: l.x, y: l.y + 1, z: l.z });
  if (/:(soul_)?lantern$/.test(type)) {
    const suspendue = b.permutation.getState("hanging") === true;
    if (suspendue ? porteur(dessus) : porteur(dessous)) return;
    if (!suspendue && porteur(dessus)) return remplacer(b, type, { hanging: true });
    if (suspendue && porteur(dessous)) return remplacer(b, type, { hanging: false });
    // Une chaîne jusqu'au plafond (5 blocs au plus).
    for (let k = 2; k <= 6; k++) {
      if (!porteur(dim.getBlock({ x: l.x, y: l.y + k, z: l.z }))) continue;
      for (let j = 1; j < k; j++) dim.getBlock({ x: l.x, y: l.y + j, z: l.z })?.setType("minecraft:iron_chain");
      return remplacer(b, type, { hanging: true });
    }
    // Sinon, une torche contre le mur voisin.
    const m = murVoisin(dim, l);
    if (m) return remplacer(b, type.includes("soul") ? "minecraft:soul_torch" : "minecraft:torch", { torch_facing_direction: m.torche });
    return b.setType("minecraft:air");
  }
  if (/torch$/.test(type)) {
    const f = b.permutation.getState("torch_facing_direction");
    if ((!f || f === "top") && porteur(dessous)) return;
    if (f && f !== "top") {
      const m = MURS.find((x) => x.torche === f);
      if (m && porteur(dim.getBlock({ x: l.x + m.dx, y: l.y, z: l.z + m.dz }))) return;
    }
    if (porteur(dessous)) return remplacer(b, type, { torch_facing_direction: "top" });
    const m = murVoisin(dim, l);
    if (m) return remplacer(b, type, { torch_facing_direction: m.torche });
    return b.setType("minecraft:air");
  }
  if (/skull$|_head$/.test(type)) {
    const f = b.permutation.getState("facing_direction");
    if ((f === undefined || f === 1) && porteur(dessous)) return;
    if (f >= 2) return;
    const m = murVoisin(dim, l);
    if (m) return remplacer(b, type, { facing_direction: m.face });
    return b.setType("minecraft:air");
  }
  if (/candle$|snow_layer|mushroom$/.test(type)) {
    if (!porteur(dessous)) b.setType("minecraft:air");
    return;
  }
  if (type === "minecraft:waterlily") {
    if (!dessous?.isLiquid) b.setType("minecraft:air");
    return;
  }
  if (ORIENTABLES.test(type)) {
    if (!explicite) orienterVersLeVide(b, type);
    return;
  }
  if (type === "minecraft:barrel") {
    if (!explicite) remplacer(b, type, { facing_direction: 1 });
    return;
  }
  // Une plante : sur de la terre.
  if (!dessous || !TERRE.test(dessous.typeId)) b.setType("minecraft:air");
}

// Un four, un pupitre, une citrouille… tourne sa face vers l'espace libre (dos au mur, si possible).
function orienterVersLeVide(b, type) {
  const note = (c) => {
    if (!libre(c.voisin(b))) return 0;
    const derriere = c.oppose(b);
    return derriere && !libre(derriere) ? 2 : 1;
  };
  const meilleur = COTES.reduce((m, c) => (note(c) > note(m) ? c : m), COTES[1]);
  if (note(meilleur) === 0) return;
  remplacer(b, type, /** @type {any} */ ({ "minecraft:cardinal_direction": meilleur.nom }));
}

export function verifierAppuis(liste) {
  for (const element of liste) {
    try {
      verifierUn(element);
    } catch {
      // zone déchargée : tant pis
    }
  }
}

// Avance un chantier d'une étape ; les blocs posés pendant l'étape sont notés pour la vérification
// finale des appuis. Rend { fini, attente }.
export function avancerChantier(chantier) {
  collecte = chantier.poses;
  chantierCourant = chantier;
  let resultat;
  try {
    resultat = chantier.etapes.next();
  } catch (erreur) {
    console.warn(`[aventure] construction interrompue : ${erreur}`);
    resultat = { done: true };
  } finally {
    collecte = undefined;
    chantierCourant = undefined;
  }
  // Le chantier fini a dégagé du terrain : on retire encore les restes d'arbres en l'air.
  if (resultat.done && chantier.degage && !chantier.nettoye) {
    chantier.nettoye = true;
    chantier.etapes = nettoyerArbres(chantier.degage.dim, chantier.degage);
    return { fini: false, attente: 0 };
  }
  if (resultat.done) verifierAppuis(chantier.poses);
  return { fini: resultat.done === true, attente: typeof resultat.value === "number" ? resultat.value : 0 };
}

let chantiersActifs = 0;

// Le nombre de constructions en cours (l'écran du conteur attend qu'elles soient finies, nettoyage
// des restes d'arbres compris, avant de passer à l'étape suivante).
export function chantiersEnCours() {
  return chantiersActifs;
}

// Une construction (générateur) avancée d'une étape par tick au plus : la Switch reçoit les blocs
// peu à peu, sans à-coup (en écran partagé à quatre, un gros paquet de blocs d'un coup se voit).
// `yield n` attend n ticks de plus. À la fin, les appuis sont vérifiés.
export function construireDoucement(etapes) {
  const chantier = { etapes, poses: [] };
  let attente = 0;
  chantiersActifs++;
  const id = system.runInterval(() => {
    if (attente > 0) {
      attente--;
      return;
    }
    const pas = avancerChantier(chantier);
    if (pas.fini) {
      system.clearRun(id);
      chantiersActifs--;
    }
    else attente = Math.max(0, pas.attente - 1);
  }, 1);
}
