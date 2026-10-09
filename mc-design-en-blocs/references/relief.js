// Raccorder au terrain naturel un lieu dégagé (un rectangle ou un cercle aplani) : au lieu d'une
// falaise taillée au couteau tout autour, le relief remonte en pente irrégulière (taillé au-dessus
// de la pente, remblayé en dessous), sur `marge` blocs, et la surface retaillée reprend de l'herbe.
// forme : { x1, x2, z1, z2 } ou { x, z, rayon }, relative à `at` (le sol du lieu en dy = 0).
// style : { marge, pente (blocs de hauteur par bloc de distance), hauteur (jusqu'où dégager),
// remblai (profondeur comblée au plus), sol }.
import { remplir } from "./construction.js";
import { bruit } from "./caverne.js";

// Ce qui ne compte pas comme le sol (on le taille sans regret, on ne s'y pose pas).
const PAS_LE_SOL = /air|leaves|log|wood|grass$|short_grass|tall_grass|fern|flower|bush|vine|sapling|snow_layer|mushroom|water|lava/;

export function* raccorderAuTerrain(dim, at, forme, style) {
  const marge = style.marge ?? 12;
  const pente = style.pente ?? 1;
  const hauteur = style.hauteur ?? 24;
  const remblai = style.remblai ?? 5;
  const sol = style.sol ?? "minecraft:grass_block";
  const graine = 29;
  const lire = (x, dy, z) => {
    try {
      return dim.getBlock(at(x, dy, z));
    } catch {
      return undefined;
    }
  };
  const rond = forme.rayon !== undefined;
  const x1 = rond ? forme.x - forme.rayon : forme.x1;
  const x2 = rond ? forme.x + forme.rayon : forme.x2;
  const z1 = rond ? forme.z - forme.rayon : forme.z1;
  const z2 = rond ? forme.z + forme.rayon : forme.z2;
  const distance = (x, z) => {
    if (rond) return Math.hypot(x - forme.x, z - forme.z) - forme.rayon;
    return Math.hypot(Math.max(x1 - x, 0, x - x2), Math.max(z1 - z, 0, z - z2));
  };
  let n = 0;
  for (let x = x1 - marge; x <= x2 + marge; x++) {
    for (let z = z1 - marge; z <= z2 + marge; z++) {
      const d = distance(x, z);
      if (d <= 0 || d > marge) continue;
      const dd = Math.max(0.5, d + 3 * (bruit(x, 0, z, 6, graine) - 0.5));
      const haut = Math.max(1, Math.round(dd * pente + 2 * bruit(x, 40, z, 3, graine)));
      // Taillé au-dessus de la pente.
      const dessus = lire(x, haut + 1, z);
      if (dessus && !dessus.isAir) {
        remplir(dim, at(x, haut + 1, z), at(x, hauteur, z), "minecraft:air");
        const surface = lire(x, haut, z);
        if (surface && !PAS_LE_SOL.test(surface.typeId)) remplir(dim, at(x, haut, z), at(x, haut, z), sol);
      } else {
        // Remblayé en dessous (pas dans l'eau).
        const bas = -Math.round(dd * pente);
        let top = haut;
        while (top > -remblai - 1 && PAS_LE_SOL.test(lire(x, top, z)?.typeId ?? "air")) top--;
        const t = lire(x, top, z);
        if (top >= -remblai && top < bas && t && !t.isLiquid && !/water|lava/.test(lire(x, top + 1, z)?.typeId ?? "")) {
          if (bas - 1 > top) remplir(dim, at(x, top + 1, z), at(x, bas - 1, z), "minecraft:dirt");
          remplir(dim, at(x, bas, z), at(x, bas, z), sol);
        }
      }
      if (++n % 50 === 0) yield;
    }
  }
}

// Aplanir une zone (coordonnées du monde : { x1, x2, z1, z2 }) au niveau `y`, avec de petites
// aspérités douces (0 à `asperites` blocs au-dessus, sans marche brusque) : tout ce qui dépasse est
// taillé, arbres compris (dégagé sur `hauteur` blocs), les creux et l'eau sont comblés. Le terrain
// autour se raccorde ensuite avec raccorderAuTerrain.
export function* aplanirZone(dim, zone, y, style = {}) {
  const asperites = style.asperites ?? 2;
  const hauteur = style.hauteur ?? 40;
  const graine = style.graine ?? 41;
  const vides = { blockFilter: { includeTypes: ["minecraft:air", "minecraft:water", "minecraft:flowing_water", "minecraft:short_grass", "minecraft:tall_grass", "minecraft:fern", "minecraft:large_fern", "minecraft:snow_layer"] } };
  for (let x = zone.x1; x <= zone.x2; x++) {
    for (let z = zone.z1; z <= zone.z2; z++) {
      const t = y + Math.min(asperites, Math.floor(bruit(x, 0, z, 9, graine) * (asperites + 1)));
      remplir(dim, { x, y: t + 1, z }, { x, y: t + hauteur, z }, "minecraft:air");
      remplir(dim, { x, y: t - 12, z }, { x, y: t - 1, z }, "minecraft:dirt", vides);
      remplir(dim, { x, y: t, z }, { x, y: t, z }, "minecraft:grass_block");
    }
    if ((x - zone.x1) % 2 === 1) yield;
  }
}
