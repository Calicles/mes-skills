const noop = new Proxy(function () {}, { get: (t, p) => (p === "then" ? undefined : p === Symbol.toPrimitive ? () => 0 : noop), apply: () => noop, construct: () => noop });
import { valider } from "./valider.mjs";
export const BlockPermutation = { resolve: (id, states = {}) => { valider(id, states); return { type: { id }, states, getAllStates: () => states }; } };
export class BlockVolume { constructor(a, b) { this.a = a; this.b = b; } }
export const ItemStack = class { constructor(t, n) { this.typeId = t; this.amount = n; } setLore() {} };
export const BlockTypes = noop, EnchantmentTypes = noop, Potions = noop, GameMode = noop, PlayerPermissionLevel = noop, EquipmentSlot = noop, ScriptEventSource = noop, TimeOfDay = noop;
const runs = [];
export const system = new Proxy({ currentTick: 0, runInterval: () => 0, runTimeout: () => 0, clearRun() {}, run: () => 0 }, { get: (t, p) => (p in t ? t[p] : noop) });
export const world = new Proxy({}, { get: (t, p) => p === "getDimension" ? () => globalThis.DIM : p === "getAllPlayers" ? () => globalThis.JOUEURS ?? [] : p === "getDay" ? () => 1 : p === "getTimeOfDay" ? () => 1000 : p === "getAbsoluteTime" ? () => 30000 : p === "structureManager" ? { place() {} } : p === "then" ? undefined : noop });
