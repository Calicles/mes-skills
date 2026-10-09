// Les restes d'arbres en l'air : quand une construction dégage le terrain (remplissage d'air), les
// arbres coupés laissent souvent leur cime au-dessus (bout de tronc et feuillage qui ne tiennent plus
// à rien), au-dessus du domaine, de la muraille, d'une route… À la fin de chaque chantier, la zone
// dégagée est passée en revue (construction.js) et ces restes sont retirés, comme le jeu le ferait
// avec le temps pour des feuilles loin de tout tronc :
// - un tronc tient s'il touche un bloc solide (le sol, un mur, de l'eau) ou un feuillage posé par
//   l'addon, directement ou par d'autres troncs ;
// - un feuillage naturel tient s'il est à 6 feuilles au plus d'un tronc qui tient, 3 au-dessus de
//   la zone dégagée (le bord d'une cime voisine) ; les feuilles posées par l'addon, « persistantes »,
//   tiennent toujours ;
// - lianes, cabosses, ruches et neige tiennent s'ils touchent un bloc solide ou ce qui tient.
// Ce qui dépasse de la zone revue (6 blocs autour) est supposé tenir (prudence).

const TRONC = /_log$|_wood$|_stem$|_hyphae$|mangrove_roots/;
const FEUILLE = /leaves|mushroom_block$/;
const ACCESSOIRE = /vine|cocoa|bee_nest|snow_layer|propagule/;
const PLANTE = /grass$|short_grass|tall_grass|fern|flower|bush|sapling|dandelion|poppy|tulip|orchid|allium|bluet|daisy|lily|rose|peony|lilac|sunflower|torchflower|pitcher|sweet_berry|seagrass|kelp|mushroom$/;
const DISTANCE_FEUILLES = 6;
const DISTANCE_DEGAGE = 3; // au-dessus de la zone dégagée : seulement le bord d'une cime voisine
const MARGE = 6;
const TAILLE_MAX = 60000;
const VOISINS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

function genre(type) {
  if (TRONC.test(type)) return "tronc";
  if (FEUILLE.test(type)) return "feuille";
  if (ACCESSOIRE.test(type)) return "accessoire";
  return undefined;
}

// zone : { x1, x2, z1, z2 } (coordonnées du monde), les colonnes dégagées.
export function* nettoyerArbres(dim, zone) {
  const bx1 = zone.x1 - MARGE;
  const bx2 = zone.x2 + MARGE;
  const bz1 = zone.z1 - MARGE;
  const bz2 = zone.z2 + MARGE;
  /** @type {Map<string, { g?: string, solide: boolean, persistant: boolean } | null>} */
  const cache = new Map();
  let lectures = 0;
  const lire = (x, y, z) => {
    const cle = `${x},${y},${z}`;
    if (cache.has(cle)) return cache.get(cle);
    let v = null;
    if (x >= bx1 && x <= bx2 && z >= bz1 && z <= bz2 && y >= -64 && y <= 319) {
      try {
        const b = dim.getBlock({ x, y, z });
        lectures++;
        if (b) {
          const g = genre(b.typeId);
          let persistant = false;
          if (g === "feuille") {
            try {
              persistant = b.permutation.getState("persistent_bit") === true;
            } catch {
              // feuillage sans cet état (champignon géant)
            }
          }
          v = { g, solide: !g && !b.isAir && !PLANTE.test(b.typeId), persistant };
        }
      } catch {
        v = null; // non chargé : supposé tenir
      }
    }
    cache.set(cle, v);
    return v;
  };
  const vus = new Set();
  let retires = 0;

  for (let x = zone.x1; x <= zone.x2; x++) {
    for (let z = zone.z1; z <= zone.z2; z++) {
      // Le bloc le plus haut peut être rendu par un tronçon chargé mais pas actif : le lire lève
      // alors une erreur (on passe la colonne).
      let depart;
      let hy;
      try {
        const haut = dim.getTopmostBlock({ x, z });
        if (!haut || !genre(haut.typeId)) continue;
        hy = haut.location.y;
        depart = `${x},${hy},${z}`;
      } catch {
        continue;
      }
      if (vus.has(depart)) continue;

      // 1. Le groupe de blocs d'arbre reliés à cette cime.
      /** @type {{ x: number, y: number, z: number, g: string, ancre: boolean, persistant: boolean }[]} */
      const noeuds = [];
      const index = new Map();
      const file = [[x, hy, z]];
      vus.add(depart);
      let trop = false;
      while (file.length > 0) {
        const [px, py, pz] = file.pop();
        const v = lire(px, py, pz);
        if (!v || !v.g) continue;
        const n = { x: px, y: py, z: pz, g: v.g, ancre: false, persistant: v.persistant };
        index.set(`${px},${py},${pz}`, noeuds.length);
        noeuds.push(n);
        if (noeuds.length > TAILLE_MAX) {
          trop = true;
          break;
        }
        for (const [dx, dy, dz] of VOISINS) {
          const qx = px + dx;
          const qy = py + dy;
          const qz = pz + dz;
          const w = lire(qx, qy, qz);
          if (w === null) n.ancre = true; // hors de la zone revue ou non chargé
          else if (w.g) {
            const cle = `${qx},${qy},${qz}`;
            if (!vus.has(cle)) {
              vus.add(cle);
              file.push([qx, qy, qz]);
            }
          } else if (w.solide && n.g !== "feuille") n.ancre = true;
          // Un tronc posé par l'addon peut traverser le feuillage (persistant) d'un autre arbre.
          if (w && w.g === "feuille" && w.persistant && n.g === "tronc") n.ancre = true;
        }
        if (lectures > 1500) {
          lectures = 0;
          yield;
        }
      }
      cache.clear();
      if (trop) continue;

      // 2. Ce qui tient : troncs reliés au solide, feuillage proche d'un tronc qui tient.
      const tient = new Array(noeuds.length).fill(false);
      const voisinsDe = (i) => {
        const n = noeuds[i];
        const liste = [];
        for (const [dx, dy, dz] of VOISINS) {
          const j = index.get(`${n.x + dx},${n.y + dy},${n.z + dz}`);
          if (j !== undefined) liste.push(j);
        }
        return liste;
      };
      let pile = [];
      noeuds.forEach((n, i) => {
        if (n.g === "tronc" && n.ancre) {
          tient[i] = true;
          pile.push(i);
        }
      });
      while (pile.length > 0) {
        const i = pile.pop();
        for (const j of voisinsDe(i)) {
          if (!tient[j] && noeuds[j].g === "tronc") {
            tient[j] = true;
            pile.push(j);
          }
        }
      }
      const distance = new Array(noeuds.length).fill(Infinity);
      let front = [];
      noeuds.forEach((n, i) => {
        if (n.g !== "feuille") return;
        if (n.ancre || n.persistant) distance[i] = 0;
        else if (voisinsDe(i).some((j) => noeuds[j].g === "tronc" && tient[j])) distance[i] = 1;
        if (distance[i] < Infinity) front.push(i);
      });
      while (front.length > 0) {
        const suivant = [];
        for (const i of front) {
          if (distance[i] >= DISTANCE_FEUILLES) continue;
          for (const j of voisinsDe(i)) {
            if (noeuds[j].g === "feuille" && distance[j] > distance[i] + 1) {
              distance[j] = distance[i] + 1;
              suivant.push(j);
            }
          }
        }
        front = suivant;
      }
      noeuds.forEach((n, i) => {
        const limite = n.x >= zone.x1 && n.x <= zone.x2 && n.z >= zone.z1 && n.z <= zone.z2 ? DISTANCE_DEGAGE : DISTANCE_FEUILLES;
        if (n.g === "feuille" && distance[i] <= limite) tient[i] = true;
      });
      pile = [];
      noeuds.forEach((n, i) => {
        if (n.g === "accessoire" && (n.ancre || voisinsDe(i).some((j) => noeuds[j].g !== "accessoire" && tient[j]))) {
          tient[i] = true;
          pile.push(i);
        }
      });
      while (pile.length > 0) {
        const i = pile.pop();
        for (const j of voisinsDe(i)) {
          if (!tient[j] && noeuds[j].g === "accessoire") {
            tient[j] = true;
            pile.push(j);
          }
        }
      }

      // 3. Le reste s'en va (accessoires d'abord, puis feuillage, puis troncs).
      const ordre = { accessoire: 0, feuille: 1, tronc: 2 };
      const aRetirer = noeuds.filter((_, i) => !tient[i]).sort((a, b) => ordre[a.g] - ordre[b.g]);
      for (const n of aRetirer) {
        try {
          dim.getBlock({ x: n.x, y: n.y, z: n.z })?.setType("minecraft:air");
          retires++;
        } catch {
          // déchargé entre-temps
        }
        if (retires % 300 === 0) yield;
      }
    }
    if ((x - zone.x1) % 8 === 7) yield;
  }
  if (retires > 0) console.warn(`[aventure] ${retires} restes d'arbres en l'air retirés`);
}
