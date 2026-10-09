import { valider } from "./valider.mjs";
// Monde simulé : terrain plat par défaut (herbe au niveau 64, pierre dessous, air au-dessus).
export function creerMonde() {
  const blocs = new Map();
  const k = (x, y, z) => `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
  const defaut = (y) => (y > 64 ? "minecraft:air" : y === 64 ? "minecraft:grass_block" : y > 60 ? "minecraft:dirt" : "minecraft:stone");
  const lire = (x, y, z) => blocs.get(k(x, y, z)) ?? { id: defaut(Math.floor(y)), states: {} };
  const dim = {
    id: "minecraft:overworld",
    blocs, lire,
    getBlock(l) {
      const x = Math.floor(l.x), y = Math.floor(l.y), z = Math.floor(l.z);
      const b = {
        x, y, z, location: { x, y, z }, dimension: dim,
        get typeId() { return lire(x, y, z).id; },
        get permutation() { const e = lire(x, y, z); return { type: { id: e.id }, getAllStates: () => e.states, getState: (n) => e.states[n] }; },
        get isAir() { return lire(x, y, z).id === "minecraft:air"; },
        get isLiquid() { return /water|lava/.test(lire(x, y, z).id); },
        setType(id) { valider(id); blocs.set(k(x, y, z), { id, states: {}, source: globalThis.SOURCE }); },
        setPermutation(p) { blocs.set(k(x, y, z), { id: p.type.id, states: p.states, source: globalThis.SOURCE }); },
        below: () => dim.getBlock({ x, y: y - 1, z }), above: () => dim.getBlock({ x, y: y + 1, z }),
        north: () => dim.getBlock({ x, y, z: z - 1 }), south: () => dim.getBlock({ x, y, z: z + 1 }),
        east: () => dim.getBlock({ x: x + 1, y, z }), west: () => dim.getBlock({ x: x - 1, y, z }),
        getComponent: () => ({ setText() {}, setWaxed() {}, container: { size: 27, getItem() {}, setItem() {}, addItem() {} } }),
        isValid: true,
      };
      return b;
    },
    fillBlocks(v, bloc, options) {
      const id = typeof bloc === "string" ? bloc : bloc.type.id;
      if (typeof bloc === "string") valider(id);
      const states = typeof bloc === "string" ? {} : bloc.states;
      const inc = options?.blockFilter?.includeTypes, exc = options?.blockFilter?.excludeTypes;
      for (let x = Math.min(v.a.x, v.b.x); x <= Math.max(v.a.x, v.b.x); x++)
        for (let y = Math.min(v.a.y, v.b.y); y <= Math.max(v.a.y, v.b.y); y++)
          for (let z = Math.min(v.a.z, v.b.z); z <= Math.max(v.a.z, v.b.z); z++) {
            const cur = lire(x, y, z).id;
            if (inc && !inc.includes(cur)) continue;
            if (exc && exc.includes(cur)) continue;
            blocs.set(k(x, y, z), { id, states, source: globalThis.SOURCE });
          }
    },
    getTopmostBlock({ x, z }) {
      for (let y = 319; y > -64; y--) if (lire(x, y, z).id !== "minecraft:air") return dim.getBlock({ x, y, z });
      return undefined;
    },
    spawnEntity: () => ({ nameTag: "", triggerEvent() {}, addTag() {}, getComponent() {}, teleport() {}, isValid: true, location: { x: 0, y: 0, z: 0 } }),
    getEntities: () => [], spawnParticle() {}, playSound() {}, spawnItem() {}, runCommand() {},
  };
  return dim;
}
export function joueurA(dim, x, y, z) {
  const noop = new Proxy(function () {}, { get: (t, p) => (p === "then" ? undefined : noop), apply: () => noop });
  return new Proxy({ id: "j" + x + z, location: { x, y, z }, dimension: dim, isValid: true, typeId: "minecraft:player", name: "test" }, { get: (t, p) => (p in t ? t[p] : noop) });
}
