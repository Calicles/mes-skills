// Les chemins taillés dans le terrain (la route du château, les sentiers de la Barovie) : au lieu
// de poser la terre battue sur le sol tel qu'il est (marches, troncs au milieu, montagne en face),
// le chemin suit une pente douce (le relief lissé, une marche d'un bloc au plus), comblé en dessous
// (en remblai au-dessus de l'eau et des creux) et dégagé au-dessus (arbres, buttes) ; de chaque côté,
// un talus en pente (taillé ou remblayé) le raccorde au terrain, sans mur ni ravin droit.
import { remplir } from "./construction.js";

// Ce qui ne compte pas comme le sol : on le dégage sans regret, on ne s'y pose pas.
const MOU = /air|leaves|log|wood|grass$|short_grass|tall_grass|fern|flower|bush|vine|sapling|snow|mushroom|azalea|dead_bush|sweet_berry|pumpkin|melon|dandelion|poppy|barrier|lantern|torch|sign|fence|carpet|candle/;
const VIDES = { blockFilter: { includeTypes: ["minecraft:air", "minecraft:water", "minecraft:flowing_water", "minecraft:snow_layer", "minecraft:powder_snow", "minecraft:short_grass", "minecraft:tall_grass", "minecraft:fern", "minecraft:large_fern"] } };

// La hauteur du sol d'une colonne (le dessus de l'eau compte comme le sol : on passe en remblai).
export function hauteurDuSol(dim, x, z) {
  try {
    let bloc = dim.getTopmostBlock({ x, z });
    let n = 0;
    while (bloc && n++ < 80 && !bloc.isLiquid && (bloc.isAir || MOU.test(bloc.typeId))) bloc = bloc.below();
    return bloc ? bloc.location.y : undefined;
  } catch {
    return undefined;
  }
}

// Les points entiers d'un segment, un par bloc.
export function ligne(a, b) {
  const n = Math.max(Math.abs(b.x - a.x), Math.abs(b.z - a.z));
  const points = [];
  for (let i = 0; i <= n; i++) points.push({ x: Math.round(a.x + ((b.x - a.x) * i) / (n || 1)), z: Math.round(a.z + ((b.z - a.z) * i) / (n || 1)) });
  return points;
}

// Le profil du chemin : le relief lissé (moyenne sur 9 blocs), les deux bouts tenus (`debut`,
// `fin`, sinon le sol), puis la pente bornée à `pente` bloc par bloc de chemin.
export function profil(hauteurs, debut, fin, pente = 0.5) {
  const n = hauteurs.length;
  const h = hauteurs.slice();
  for (let i = 0; i < n; i++) if (h[i] === undefined) h[i] = h[i - 1];
  for (let i = n - 1; i >= 0; i--) if (h[i] === undefined) h[i] = h[i + 1];
  if (h[0] === undefined) return undefined;
  const s = h.map((_, i) => {
    let t = 0;
    let c = 0;
    for (let j = Math.max(0, i - 4); j <= Math.min(n - 1, i + 4); j++) {
      t += h[j];
      c++;
    }
    return t / c;
  });
  const bout = fin ?? h[n - 1];
  s[0] = debut ?? h[0];
  for (let i = 1; i < n; i++) s[i] = Math.min(Math.max(s[i], s[i - 1] - pente), s[i - 1] + pente);
  s[n - 1] = bout;
  for (let i = n - 2; i >= 0; i--) s[i] = Math.min(Math.max(s[i], s[i + 1] - pente), s[i + 1] + pente);
  return s.map((y) => Math.round(y));
}

// Trace un chemin le long de `points` (coordonnées du monde, un par bloc, dans l'ordre).
// options : largeur (demi-largeur : 1 = 3 blocs), talus (jusqu'où le talus peut s'étendre),
// debut / fin (hauteurs imposées aux bouts), pente, degager (hauteur dégagée au-dessus),
// sol (bloc du chemin, ou fonction (x, z) → bloc).
export function* tracerChemin(dim, points, options = {}) {
  const largeur = options.largeur ?? 1;
  const talus = options.talus ?? 12;
  const degager = options.degager ?? 14;
  const sol = options.sol ?? "minecraft:grass_path";
  if (points.length === 0) return undefined;
  const ys = profil(points.map((p) => hauteurDuSol(dim, p.x, p.z)), options.debut, options.fin, options.pente);
  if (!ys) return undefined;
  yield;

  // Chaque case autour du chemin : sa hauteur visée et sa distance au bord (0 = le chemin).
  /** @type {Map<string, { x: number, z: number, y: number, k: number }>} */
  const cases = new Map();
  points.forEach((p, i) => {
    const av = points[Math.max(0, i - 1)];
    const ap = points[Math.min(points.length - 1, i + 1)];
    const lg = Math.hypot(ap.x - av.x, ap.z - av.z) || 1;
    const px = -(ap.z - av.z) / lg;
    const pz = (ap.x - av.x) / lg;
    for (let d = -(largeur + talus); d <= largeur + talus; d++) {
      const x = Math.round(p.x + px * d);
      const z = Math.round(p.z + pz * d);
      const k = Math.max(0, Math.abs(d) - largeur);
      const cle = `${x},${z}`;
      const avant = cases.get(cle);
      if (!avant || k < avant.k) cases.set(cle, { x, z, y: ys[i], k });
    }
  });

  let n = 0;
  for (const c of cases.values()) {
    const g = hauteurDuSol(dim, c.x, c.z);
    if (g === undefined) continue;
    if (c.k === 0) {
      // Le chemin : comblé dessous, dégagé dessus.
      if (g < c.y) remplir(dim, { x: c.x, y: Math.max(g - 2, c.y - 40), z: c.z }, { x: c.x, y: c.y - 1, z: c.z }, "minecraft:dirt", VIDES);
      remplir(dim, { x: c.x, y: c.y + 1, z: c.z }, { x: c.x, y: Math.max(g, c.y + degager), z: c.z }, "minecraft:air");
      remplir(dim, { x: c.x, y: c.y, z: c.z }, { x: c.x, y: c.y, z: c.z }, typeof sol === "function" ? sol(c.x, c.z) : sol);
    } else if (g > c.y + c.k) {
      // Le talus taillé : la butte descend en pente vers le chemin.
      remplir(dim, { x: c.x, y: c.y + c.k + 1, z: c.z }, { x: c.x, y: Math.max(g, c.y + degager), z: c.z }, "minecraft:air");
      remplir(dim, { x: c.x, y: c.y + c.k, z: c.z }, { x: c.x, y: c.y + c.k, z: c.z }, "minecraft:grass_block");
    } else if (g < c.y - c.k) {
      // Le talus remblayé : le remblai descend en pente vers le terrain.
      remplir(dim, { x: c.x, y: Math.max(g - 2, c.y - c.k - 40), z: c.z }, { x: c.x, y: c.y - c.k - 1, z: c.z }, "minecraft:dirt", VIDES);
      remplir(dim, { x: c.x, y: c.y - c.k, z: c.z }, { x: c.x, y: c.y - c.k, z: c.z }, "minecraft:grass_block");
    }
    if (++n % 40 === 0) yield;
  }
  return ys;
}
