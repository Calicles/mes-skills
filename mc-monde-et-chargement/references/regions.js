// Les trois régions de l'aventure, préparées d'un coup sous l'écran du conteur (conteur.js) :
// - le domaine, à la toute première arrivée : le domaine et sa muraille, les lieux des quêtes du
//   chapitre 1, les découvertes, les camps de Sire Gauvain et de Dame Mirabelle ;
// - la Barovie, à la première traversée des Brumes : le choix du pays, le camp, la route, le
//   cimetière, la forêt, le marais, le château entier, les cabanes de Mère Crapotte et de Van Richten ;
// - les profondeurs, à la première traversée de la porte runique : la cité, les grottes de cristal,
//   la forêt de champignons, les rivières de lave, les grottes de Gronk et de Pipolin.
// Les passages suivants ne font que charger le terrain (écran noir quelques secondes). Les
// événements de l'histoire (roulotte, mine qui surgit, tunnels, trappe…) restent des surprises.
import { world, system, TimeOfDay } from "@minecraft/server";
import { lireEtat } from "./etat.js";
import { abriter, preparer, passer, preparationEnCours, rejoindre, deplacerLesAbris } from "./conteur.js";
import { PASSAGES } from "./donnees/conteur.js";
import { construireDomaine } from "./domaine.js";
import { positionDuLieu } from "./lieux.js";
import { LIEUX } from "./donnees/lieux.js";
import { placement } from "./decouvertes.js";
import { positionSecondaire } from "./secondaires.js";
import { centreBarovie, placerAuCamp, lancerConstructionDuCamp } from "./barovie.js";
import { BAROVIE } from "./donnees/barovie.js";
import { positionDuCimetiere } from "./cimetiere.js";
import { FORET } from "./donnees/foret.js";
import { MARAIS } from "./donnees/marais.js";
import { CHATEAU } from "./donnees/chateau.js";
import { centreCite, placerDansLaCite, lancerConstructionDeLaCite, ecrireProfondeurs, etatProfondeurs } from "./profondeurs.js";
import { CRISTAL, CHAMPIGNONS, LAVE } from "./donnees/profondeurs.js";

const milieu = (z) => ({ x: (z.x1 + z.x2) / 2, z: (z.z1 + z.z2) / 2 });
const decale = (b, d) => (b ? { x: b.x + d.x, z: b.z + d.z } : undefined);
const seul = (p) => (p ? [p] : []);

function bienvenue(joueur, cle) {
  system.runTimeout(() => {
    if (!joueur.isValid) return;
    joueur.onScreenDisplay.setTitle({ translate: cle }, { subtitle: { translate: `${cle}.sous_titre` }, fadeInDuration: 10, stayDuration: 70, fadeOutDuration: 20 });
  }, 120);
}

// Les lieux de plusieurs quêtes secondaires, à la fois.
function etapeSecondaires(cles, nom) {
  return { nom, points: () => cles.flatMap((cle) => seul(positionSecondaire(cle))), rayon: 24, fait: (e) => cles.every((cle) => e.secondaires?.[cle]?.pose === true) };
}

// --- Le domaine ---

function etapesDuDomaine() {
  const auDomaine = (e, d) => (e.domaine?.pose ? [{ x: e.domaine.centre.x + d.x, z: e.domaine.centre.z + d.z }] : []);
  /** @type {any[]} */
  const etapes = [
    {
      nom: "Le domaine sort du brouillard",
      lancer: () => construireDomaine(() => world.setTimeOfDay(TimeOfDay.Day)),
      fait: (e) => e.domaine?.pose === true && e.muraille?.alentours === true,
    },
    // Les lieux des quêtes, tous à la fois.
    {
      nom: "Les ruines, le moulin et la mine",
      points: (e) => (e.domaine?.pose ? Object.keys(LIEUX).filter((cle) => !e.lieux?.[cle]?.pose).flatMap((cle) => seul(positionDuLieu(cle))) : []),
      rayon: 40,
      fait: (e) => Object.keys(LIEUX).every((cle) => e.lieux?.[cle]?.pose === true),
    },
    {
      nom: "Les camps des voyageurs",
      points: () => ["gauvain", "mirabelle"].flatMap((cle) => seul(positionSecondaire(cle))),
      rayon: 24,
      fait: (e) => ["gauvain", "mirabelle"].every((cle) => e.secondaires?.[cle]?.pose === true),
    },
  ];
  // Les découvertes, cinq par cinq.
  const liste = placement();
  for (let debut = 0; debut < liste.length; debut += 5) {
    const lot = liste.map((d, i) => ({ d, i })).slice(debut, debut + 5);
    etapes.push({
      nom: `Les secrets du domaine (${Math.min(debut + 5, liste.length)} / ${liste.length})`,
      points: (e) => lot.filter(({ i }) => !e.decouvertes?.[i]?.pose).flatMap(({ d }) => auDomaine(e, d)),
      rayon: 16,
      fait: (e) => lot.every(({ i }) => e.decouvertes?.[i]?.pose === true),
      max: 90 * 20,
    });
  }
  return etapes;
}

// La toute première arrivée : `accueillir(joueur)` le pose sur le parvis et lui donne son kit.
export function premiereArrivee(joueur, accueillir) {
  const spawn = world.getDefaultSpawnLocation();
  abriter(joueur, spawn);
  if (preparationEnCours("domaine")) {
    rejoindre(joueur, accueillir);
    return;
  }
  preparer({ cle: "domaine", titre: "Le brouillard se lève…", page: "arrivee", joueurs: [joueur], etapes: etapesDuDomaine(), fin: accueillir });
}

// --- La Barovie ---

function campPrevu(etat) {
  return decale(centreBarovie(etat), BAROVIE.camp);
}

function etapesDeLaBarovie() {
  const b = (e) => centreBarovie(e);
  const route = [];
  for (let z = BAROVIE.route.de; z >= BAROVIE.route.a; z -= 10) route.push({ cle: `troncon:${z}`, x: BAROVIE.route.x, z: z - 5 });
  BAROVIE.bordDeRoute.forEach((l, i) => route.push({ cle: `lieu:${i}`, x: l.x, z: l.z }));
  const chateau = milieu(CHATEAU.enceinte);
  const auChateau = (e) => seul(decale(b(e), chateau));
  return [
    { nom: "Les Brumes cherchent un pays", lancer: lancerConstructionDuCamp, fait: (e) => e.barovie?.centreChoisi === true || Boolean(e.barovie?.camp) },
    {
      nom: "Le camp de Madame Zora",
      lancer: () => {
        const c = campPrevu(lireEtat());
        if (c) deplacerLesAbris(c);
        lancerConstructionDuCamp();
      },
      fait: (e) => Boolean(e.barovie?.camp),
    },
    {
      nom: "La route du château",
      points: (e) => route.filter((r) => !(e.barovie?.route ?? []).includes(r.cle)).map((r) => decale(b(e), r)),
      rayon: 40,
      zoneUnique: true,
      fait: (e) => route.every((r) => (e.barovie?.route ?? []).includes(r.cle)),
    },
    {
      nom: "Le cimetière, la forêt et le marais",
      points: (e) => [...seul(positionDuCimetiere(e)), ...seul(decale(b(e), milieu(FORET.zone))), ...seul(decale(b(e), milieu(MARAIS.zone)))],
      rayon: 8,
      fait: (e) => e.barovie?.cimetiere?.pose === true && e.barovie?.foret?.pose === true && e.barovie?.marais?.pose === true,
    },
    { nom: "Le château du comte", points: auChateau, rayon: 8, fait: (e) => e.barovie?.chateau?.pose === true },
    { nom: "Les salles du château", points: auChateau, rayon: 60, fait: (e) => e.barovie?.chateau?.sallesPosees === true },
    { nom: "La tour du château", points: auChateau, rayon: 60, fait: (e) => e.barovie?.chateau?.partie2?.pose === true },
    { nom: "La crypte du comte", points: auChateau, rayon: 60, fait: (e) => e.barovie?.chateau?.denouement?.construit === true },
    etapeSecondaires(["crapotte", "vanrichten"], "Les cabanes du marais et des bois"),
  ];
}

// Traverser les Brumes vers la Barovie (l'arche, ou la baguette du testeur avec `versLieu(etat)`).
export function traverserVersLaBarovie(joueur, versLieu) {
  const fin = (j) => {
    const etat = lireEtat();
    if (versLieu) versLieu(etat);
    else {
      placerAuCamp(j, etat);
      bienvenue(j, "aventure.barovie.bienvenue");
    }
  };
  if (lireEtat().barovie?.camp && !preparationEnCours("barovie")) {
    passer(joueur, PASSAGES.versBarovie, fin);
    return;
  }
  abriter(joueur, campPrevu(lireEtat()) ?? joueur.location);
  if (preparationEnCours("barovie")) {
    rejoindre(joueur, fin);
    return;
  }
  preparer({ cle: "barovie", titre: "Les Brumes vous emportent…", page: "brumes", joueurs: [joueur], etapes: etapesDeLaBarovie(), fin });
}

// --- Les profondeurs ---

function etapesDesProfondeurs() {
  const c = (e, d) => seul(decale(centreCite(e), d.centre));
  return [
    { nom: "La cité de Khaz-Durim se réveille", lancer: lancerConstructionDeLaCite, fait: (e) => etatProfondeurs(e).cite === true },
    {
      nom: "Les cristaux, les champignons et la lave",
      points: (e) => [...c(e, CRISTAL), ...c(e, CHAMPIGNONS), ...c(e, LAVE)],
      rayon: 8,
      fait: (e) => ["cristal", "champignons", "lave"].every((k) => etatProfondeurs(e)[k]?.construit === true),
    },
    etapeSecondaires(["gronk", "pipolin"], "Les grottes de Gronk et de Pipolin"),
  ];
}

// Traverser la porte runique vers la cité (ou la baguette du testeur avec `versLieu(etat)`).
export function traverserVersLaCite(joueur, versLieu) {
  const fin = (j) => {
    const etat = lireEtat();
    if (versLieu) versLieu(etat);
    else {
      placerDansLaCite(j, etat);
      bienvenue(j, "aventure.cite.bienvenue");
    }
  };
  if (etatProfondeurs().cite && !preparationEnCours("profondeurs")) {
    passer(joueur, PASSAGES.versCite, fin);
    return;
  }
  abriter(joueur, centreCite() ?? joueur.location);
  if (preparationEnCours("profondeurs")) {
    rejoindre(joueur, fin);
    return;
  }
  // Les cavernes se construisent d'avance, avant leurs tunnels (voir poserCristal, poserChampignons, poserLave).
  ecrireProfondeurs({ avance: true });
  preparer({ cle: "profondeurs", titre: "La porte runique s'éveille…", page: "porte", joueurs: [joueur], etapes: etapesDesProfondeurs(), fin });
}
