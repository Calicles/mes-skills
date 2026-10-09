// Sculpter une caverne creusée en pavé (cité, grottes de cristal, forêt de champignons, rivières de
// lave, grotte du vieux Gronk) : plus aucun angle droit. Dans une bande le long des murs, la roche
// revient en voûte (le plafond descend vers les murs), en bosses et en alcôves (murs bosselés), en
// éboulis au pied des murs, avec des angles arrondis ; des stalactites pendent du plafond. Le cœur
// où l'on joue reste libre.
//
// Rien n'est posé sur ce qui existe déjà : seulement dans l'air. Au-dessus de ce qui est construit
// (maisons, étals, ponts, colonnes…), la roche ne commence que trois blocs plus haut ; devant une
// ouverture dans un mur (tunnel, porte), rien du tout ; au-dessus d'un sol liquide ou vide (rivière,
// lac, gouffre) ou d'un chemin, seulement en hauteur. `protections` ajoute les lieux à garder libres
// qui n'existent pas encore (passages creusés plus tard, trésors, arènes) : rectangles relatifs au
// centre, et hauteur au-dessus de laquelle la roche peut revenir (`dy`, ou toute la hauteur).
//
// zone : l'intérieur creusé, relatif au centre { x1, x2, z1, z2, haut } (le sol en dy = 0, l'air de 1
// à haut). style : { roche: [types], stalactite: type, pointe?: permutation, bande, voute, chemins? }.
import { remplir, poser, permutation } from "./construction.js";

// Bruit de valeurs (déterministe) : une valeur entre 0 et 1, lissée entre les points d'une grille.
export function hache(x, y, z, graine) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177) ^ Math.imul(graine, 144665);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function bruit(x, y, z, pas, graine) {
  const fx = x / pas, fy = y / pas, fz = z / pas;
  const x0 = Math.floor(fx), y0 = Math.floor(fy), z0 = Math.floor(fz);
  const lisse = (t) => t * t * (3 - 2 * t);
  const tx = lisse(fx - x0), ty = lisse(fy - y0), tz = lisse(fz - z0);
  const m = (a, b, t) => a + (b - a) * t;
  const v = (i, j, k) => hache(x0 + i, y0 + j, z0 + k, graine);
  return m(
    m(m(v(0, 0, 0), v(1, 0, 0), tx), m(v(0, 1, 0), v(1, 1, 0), tx), ty),
    m(m(v(0, 0, 1), v(1, 0, 1), tx), m(v(0, 1, 1), v(1, 1, 1), tx), ty),
    tz,
  );
}

// Le décor naturel et les petits objets ne comptent pas comme une construction : la roche peut les
// envelopper (cristaux, champilampes, taches de magma, glaçons…).
const LEGER = /snow_layer|carpet|short_grass|tall_grass|fern|flower|sapling|_mushroom$|glow_lichen|amethyst|bud$|sea_lantern|shroomlight|magma|packed_ice|dripstone|^minecraft:(deepslate|tuff|calcite|blackstone|basalt|smooth_basalt|moss_block)$/;
// (Une protection { x1, x2, z1, z2, profondeur, dy } : jusqu'à `dy` (14 par défaut), la roche n'avance
// que de `profondeur` blocs depuis le mur ; au-dessus, la voûte et les bosses comme ailleurs.)
// Hauteur gardée libre devant une ouverture dans un mur (tunnel, porte) : la voûte reste au-dessus.
const HAUTEUR_PASSAGE = 8;

export function* sculpterCaverne(dim, at, zone, style, protections = []) {
  const { x1, x2, z1, z2, haut } = zone;
  const bande = style.bande ?? 5;
  const graine = (x1 * 7 + z2 * 13 + haut) | 0;
  const cle = (x, z) => `${x},${z}`;
  const lire = (x, dy, z) => {
    try {
      return dim.getBlock(at(x, dy, z));
    } catch {
      return undefined;
    }
  };

  // Distance au mur, angles arrondis (un angle compte comme plus proche du mur), déformée par du
  // bruit : les contours ne suivent jamais une ligne droite.
  const R = bande + 3;
  const distanceAuMur = (x, z) => {
    const wx = Math.min(x - x1, x2 - x);
    const wz = Math.min(z - z1, z2 - z);
    let w = Math.min(wx, wz);
    if (wx < R && wz < R) w = Math.min(w, R - Math.hypot(R - wx, R - wz));
    return w + 3.5 * (bruit(x, 30, z, 5, graine + 3) - 0.5) + 1.5 * (bruit(x, 60, z, 2, graine + 4) - 0.5);
  };

  // 1. Ce qu'il faut garder libre : la hauteur au-dessus de laquelle la roche peut revenir.
  const libreJusqua = new Map();
  // Où la roche ne peut avancer que de quelques blocs depuis le mur (quartiers habités), et où il n'y
  // a pas d'éboulis (au-dessus d'un liquide ou d'un vide).
  const profondeurMax = new Map();
  const sansEboulis = new Set();
  const garder = (x, z, dy) => {
    if (x < x1 || x > x2 || z < z1 || z > z2) return;
    const k = cle(x, z);
    if ((libreJusqua.get(k) ?? 0) < dy) libreJusqua.set(k, dy);
  };
  const autour = (x, z, dy, r) => {
    for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) garder(x + i, z + j, dy);
  };
  for (const p of protections) {
    if (p.profondeur !== undefined) {
      for (let x = p.x1; x <= p.x2; x++) for (let z = p.z1; z <= p.z2; z++) profondeurMax.set(cle(x, z), { profondeur: p.profondeur, jusqua: p.dy ?? 14 });
      continue;
    }
    if (p.rayon !== undefined) {
      // Un cercle (une arène) : { x, z, rayon, dy }.
      for (let x = p.x - p.rayon; x <= p.x + p.rayon; x++) {
        for (let z = p.z - p.rayon; z <= p.z + p.rayon; z++) if (Math.hypot(x - p.x, z - p.z) <= p.rayon) garder(x, z, p.dy ?? haut);
      }
      continue;
    }
    for (let x = p.x1; x <= p.x2; x++) for (let z = p.z1; z <= p.z2; z++) garder(x, z, p.dy ?? haut);
  }
  const colonnes = [];
  for (let x = x1; x <= x2; x++) {
    for (let z = z1; z <= z2; z++) if (distanceAuMur(x, z) < bande || x === x1 || x === x2 || z === z1 || z === z2) colonnes.push([x, z]);
  }
  let lues = 0;
  for (const [x, z] of colonnes) {
    const sol = lire(x, 0, z);
    if (sol && (sol.isAir || sol.isLiquid)) sansEboulis.add(cle(x, z));
    if (sol && style.chemins && style.chemins.test(sol.typeId)) autour(x, z, 4, 1);
    // Ce qui est construit au sol (le décor du plafond ne compte pas) : la roche reprend au-dessus.
    let sommet = 0;
    for (let dy = 1; dy <= haut - 6; dy++) {
      const b = lire(x, dy, z);
      if (b && !b.isAir && !LEGER.test(b.typeId)) sommet = dy;
    }
    if (sommet > 0) autour(x, z, Math.min(haut, sommet + 2), 1);
    // Une ouverture dans le mur (tunnel, porte) : rien devant.
    const dehors = [];
    if (x === x1) dehors.push([x - 1, z]);
    if (x === x2) dehors.push([x + 1, z]);
    if (z === z1) dehors.push([x, z - 1]);
    if (z === z2) dehors.push([x, z + 1]);
    for (const [ox, oz] of dehors) {
      const b1 = lire(ox, 1, oz);
      const b2 = lire(ox, 2, oz);
      if (b1?.isAir && b2?.isAir) autour(x, z, HAUTEUR_PASSAGE, 3);
    }
    if (++lues % 40 === 0) yield;
  }
  yield;

  // 2. La roche, colonne par colonne : la voûte (le plafond descend en arc dès le tiers de la
  //    caverne), puis, le long des murs, les bosses et alcôves et les éboulis au pied ; des
  //    stalactites pendent sous la voûte.
  const roches = style.roche;
  const voute = style.voute ?? Math.round(haut / 3);
  const largeurVoute = style.largeurVoute ?? Math.round(Math.min(x2 - x1, z2 - z1) * 0.3);
  const roche = (x, dy, z) => roches[Math.floor(hache(x, dy, z, graine) * roches.length)];
  let faites = 0;
  for (let x = x1; x <= x2; x++) {
    for (let z = z1; z <= z2; z++) {
      const w = distanceAuMur(x, z);
      const libre = libreJusqua.get(cle(x, z)) ?? 0;
      if (libre >= haut) continue;
      const n = bruit(x, 0, z, 6, graine);
      const arc = Math.max(0, 1 - w / largeurVoute) ** 1.6;
      const descente = Math.max(0, Math.round(arc * voute * (0.6 + 0.8 * n) + 2 * bruit(x, 90, z, 3, graine) - 0.5));
      let plafond = haut - descente; // le dernier bloc d'air sous la voûte
      plafond = Math.max(plafond, libre);
      if (w >= bande) {
        // Au cœur : la voûte (seulement dans l'air : colonnes et cheminées la traversent).
        if (plafond < haut) remplir(dim, at(x, plafond + 1, z), at(x, haut, z), roche(x, haut, z), { blockFilter: { includeTypes: ["minecraft:air"] } });
      } else {
        const k = cle(x, z);
        const limite = profondeurMax.get(k);
        const eboulis = sansEboulis.has(k) || limite ? 0 : Math.round((bande - w) * (0.4 + 1.1 * n));
        let debut;
        for (let dy = 1; dy <= haut + 1; dy++) {
          const plein = dy <= haut && dy > libre && !(limite && dy <= limite.jusqua && w >= limite.profondeur)
            && (dy <= eboulis || dy > plafond || w < bande * 1.3 * bruit(x, dy, z, 5, graine + 1) ** 1.3 - 0.3);
          if (plein && debut === undefined) debut = dy;
          if (!plein && debut !== undefined) {
            remplir(dim, at(x, debut, z), at(x, dy - 1, z), roche(x, debut, z), { blockFilter: { includeTypes: ["minecraft:air"] } });
            debut = undefined;
          }
        }
        plafond = Math.min(plafond, haut);
      }
      // Une stalactite sous la voûte, de loin en loin.
      if (style.stalactite && w >= 2 && plafond - libre > 8 && x % 3 === 0 && z % 3 === 0 && hache(x, 7, z, graine) < (style.densite ?? 0.3)) {
        const long = 1 + Math.floor(hache(x, 9, z, graine) * 5);
        let vide = true;
        for (let dy = plafond; dy >= plafond - long - 2 && vide; dy--) vide = lire(x, dy, z)?.isAir === true;
        if (vide) {
          if (long > 1) remplir(dim, at(x, plafond - long + 2, z), at(x, plafond, z), style.stalactite);
          poser(dim, at(x, plafond - long + 1, z), style.pointe ?? style.stalactite);
        }
      }
      if (++faites % 60 === 0) yield;
    }
  }
}

// La pointe d'une stalactite de pierre (pointe de spéléothème, tournée vers le bas).
export function pointeDeStalactite() {
  return permutation("minecraft:pointed_dripstone", { dripstone_thickness: "tip", hanging: true });
}

// Une paroi de roche droite (une falaise qui coupe une caverne) : ses deux faces deviennent
// rugueuses, avec des avancées de roche (jusqu'à `avancee` blocs) et des creux d'un bloc.
// paroi : { x1, x2, z1, z2, haut } en relatif, la paroi allant d'un mur à l'autre selon z (faces à
// l'ouest de x1 et à l'est de x2). `protections` : boîtes { x1, x2, z1, z2, dy1, dy2 } à garder libres
// (passages, escaliers, corniches).
export function* sculpterParoi(dim, at, paroi, style, protections = []) {
  const avancee = style.avancee ?? 3;
  const graine = 7 + paroi.x1 * 11;
  const protege = (x, dy, z) => protections.some((p) => x >= p.x1 && x <= p.x2 && z >= p.z1 && z <= p.z2 && dy >= p.dy1 && dy <= p.dy2);
  const roche = (x, dy, z) => style.roche[Math.floor(hache(x, dy, z, graine) * style.roche.length)];
  for (let z = paroi.z1; z <= paroi.z2; z++) {
    for (let dy = 1; dy <= paroi.haut; dy++) {
      for (const [face, sens] of [[paroi.x1, -1], [paroi.x2, 1]]) {
        const v = bruit(z, dy, face, 4, graine + sens);
        const e = Math.round((v - 0.3) * (avancee + 1.4));
        if (e > 0) {
          for (let k = 1; k <= e; k++) {
            const x = face + sens * k;
            if (!protege(x, dy, z)) remplir(dim, at(x, dy, z), at(x, dy, z), roche(x, dy, z), { blockFilter: { includeTypes: ["minecraft:air"] } });
          }
        } else if (e < 0 && paroi.x2 - paroi.x1 >= 2 && !protege(face, dy, z)) {
          remplir(dim, at(face, dy, z), at(face, dy, z), "minecraft:air", { blockFilter: { includeTypes: style.roche } });
        }
      }
    }
    if (z % 2 === 0) yield;
  }
}

// Un ravin (gouffre, crevasse, rivière) creusé en rectangle : ses bords deviennent irréguliers, en
// plan et en hauteur. Par endroits il s'élargit (on creuse la rive, jamais sous ce qui y est posé),
// ailleurs la roche avance dedans. rect : { x1, x2, z1, z2 } en relatif ; style : { fond (dy du
// dernier bloc creusé), liquide?: { type, jusqua (dy) }, roche, sol (bloc du bord au niveau 0),
// cotes (parmi "nord", "sud", "ouest", "est"), amplitude }. `protections` : rectangles { x1, x2,
// z1, z2 } où les bords restent droits (ponts, échelles, pierres de passage, rampes).
export function* sculpterRavin(dim, at, rect, style, protections = []) {
  const amplitude = style.amplitude ?? 2;
  const graine = 13 + rect.z1 * 5 + rect.x1;
  const protege = (x, z) => protections.some((p) => x >= p.x1 && x <= p.x2 && z >= p.z1 && z <= p.z2);
  const lire = (x, dy, z) => {
    try {
      return dim.getBlock(at(x, dy, z));
    } catch {
      return undefined;
    }
  };
  const vide = (dy) => (style.liquide && dy <= style.liquide.jusqua ? style.liquide.type : "minecraft:air");
  // Chaque côté : la position le long du bord (t) et la case à `d` blocs du bord (d > 0 : hors du
  // ravin, d <= 0 : dedans).
  const cotes = {
    nord: { de: rect.x1, a: rect.x2, caseA: (t, d) => [t, rect.z1 - d] },
    sud: { de: rect.x1, a: rect.x2, caseA: (t, d) => [t, rect.z2 + d] },
    ouest: { de: rect.z1, a: rect.z2, caseA: (t, d) => [rect.x1 - d, t] },
    est: { de: rect.z1, a: rect.z2, caseA: (t, d) => [rect.x2 + d, t] },
  };
  for (const nom of style.cotes) {
    const c = cotes[nom];
    for (let t = c.de; t <= c.a; t++) {
      const [bx, bz] = c.caseA(t, 0);
      if (protege(bx, bz)) continue;
      // Le haut de la rive (0 sans `style.rive` : la rive est au niveau du lieu).
      const haut = style.rive ? style.rive(...c.caseA(t, 1)) : 0;
      for (let dy = style.fond; dy <= 0; dy++) {
        const e = Math.round((2 * bruit(t, dy, nom.length, 3, graine) - 1) * (amplitude + 0.6));
        if (e > 0) {
          // Le ravin s'élargit : la rive est creusée (pas sous un objet posé au bord).
          for (let d = 1; d <= e; d++) {
            const [x, z] = c.caseA(t, d);
            if (protege(x, z)) break;
            if (dy === 0 && lire(x, 1, z)?.isAir !== true) break;
            remplir(dim, at(x, dy, z), at(x, dy, z), vide(dy));
          }
        } else if (e < 0) {
          // La roche avance dans le ravin (au niveau du sol : le bord de la rive), jamais jusqu'à le
          // refermer : moins de la moitié de sa largeur.
          const largeur = nom === "nord" || nom === "sud" ? rect.z2 - rect.z1 + 1 : rect.x2 - rect.x1 + 1;
          const avance = Math.max(e, -(Math.floor((largeur - 1) / 2) - 1));
          if (dy > haut) continue;
          for (let d = 0; d > avance; d--) {
            const [x, z] = c.caseA(t, d);
            if (protege(x, z)) break;
            remplir(dim, at(x, dy, z), at(x, dy, z), dy === haut ? style.sol : style.roche);
          }
        }
      }
      if (t % 4 === 0) yield;
    }
  }
}
