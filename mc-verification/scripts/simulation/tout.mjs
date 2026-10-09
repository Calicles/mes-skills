import fs from "fs";
import { creerMonde, joueurA } from "./monde.mjs";
const dim = creerMonde(); globalThis.DIM = dim;
const C = { x: 0, y: 64, z: 0 };
globalThis.ETAT = { domaine: { pose: true, centre: C, dimension: "minecraft:overworld" }, quete1: { statut: "finie", progression: {} }, souvenirsEnAttente: {}, joueursConnus: [] };
const E = globalThis.ETAT;
const cons = await import("./scripts/construction.js");
const vider = (g) => cons.construireDoucement(g);
const etape = async (nom, f) => { globalThis.SOURCE = nom; try { await f(); console.log("ok", nom, dim.blocs.size); } catch (e) { console.log("ERREUR", nom, e.message, e.stack.split("\n")[1]); } };
const pres = (x, z, y = 65) => { globalThis.JOUEURS = [joueurA(dim, x, y, z)]; };

const d = await import("./scripts/domaine.js");
await etape("domaine", () => vider(d.construireDomaineGen(dim, C)));
const mu = await import("./scripts/muraille.js");
await etape("muraille", () => vider(mu.construireMuraille(dim, C)));
const s = await import("./scripts/salles.js");
await import("./scripts/bibliotheque.js"); await import("./scripts/mine.js");
const pieces = await import("./scripts/pieces.js");
const { DOMAINE } = await import("./scripts/donnees/domaine.js");
for (const nom of ["cuisine", "alchimiste", "armes", "ecurie", "bibliotheque"]) {
  const e = DOMAINE.emplacements.find((x) => x.nom === nom);
  const lieu = { centre: { x: e.centre.x, y: 64, z: e.centre.z }, porte: e.porte, dimension: "minecraft:overworld" };
  if (nom === "bibliotheque") await etape("bibliotheque_ruine", () => pieces.aLOuverture.bibliotheque(lieu));
  await etape("salle_" + nom, () => vider(s.genSalle(nom, lieu)));
}
const em = await import("./scripts/embellir.js");
for (const n of ["potager", "facadeCuisine", "verger", "entrainement", "facadeEcurie", "renaissance"]) await etape("embellir_" + n, () => vider(em[n](dim, C)));
await etape("trophees", () => vider(em.socles(dim, C, { gardien: true, tombes: true, loup: true, eaux: true, licorne: true, cristal: true, champignons: true, lave: true })));
// Lieux de quête
const lx = await import("./scripts/lieux.js");
const { LIEUX } = await import("./scripts/donnees/lieux.js");
for (const [cle, l] of Object.entries(LIEUX)) { pres(l.decalage.x, l.decalage.z); await etape("lieu_" + cle, () => lx.poserLieuxProches()); }
// Découvertes
const dc = await import("./scripts/decouvertes.js");
for (let x = -140; x <= 140; x += 30) for (let z = -140; z <= 140; z += 30) { pres(x, z); globalThis.SOURCE = "decouvertes"; try { dc.surveillerDecouvertes(); } catch (e) { console.log("ERREUR decouvertes", e.message); break; } }
console.log("ok decouvertes", dim.blocs.size);
// Barovie
E.quete4 = { statut: "finie", progression: {} };
E.barovie = { ouverte: true, jourDeLaFete: 0, heureDeLaFete: 0 };
const ba = await import("./scripts/barovie.js");
await etape("porte_brumes", () => vider(ba.construirePorte(dim, { x: 0, y: 64, z: -50 }, "Les Brumes")));
await etape("roulotte_esmeralda", () => ba.arriveeDEsmeralda());
const ec = await import("./scripts/ecurie.js");
await etape("ruine_ecurie", () => ec.poserRuineEcurie());
const b = ba.centreBarovie(E);
const { BAROVIE } = await import("./scripts/donnees/barovie.js");
const cc = { x: b.x + BAROVIE.camp.x, y: 64, z: b.z + BAROVIE.camp.z };
await etape("camp", () => vider(ba.construireCamp(dim, cc)));
E.barovie = { ...E.barovie, camp: cc, porte: true };
for (let z = 80; z >= -40; z -= 20) { pres(b.x, b.z + z); await etape("route_" + z, () => ba.poserRouteProche()); }
const ci = await import("./scripts/cimetiere.js"); pres(ci.positionDuCimetiere(E).x, ci.positionDuCimetiere(E).z); await etape("cimetiere", () => ci.poserCimetiere());
const fo = await import("./scripts/foret.js"); pres(fo.positionDeLaForet(E).x - 30, fo.positionDeLaForet(E).z); await etape("foret", () => fo.poserForet());
const ma = await import("./scripts/marais.js"); pres(ma.positionDuMarais(E).x + 30, ma.positionDuMarais(E).z); await etape("marais", () => ma.poserMarais());
// Quêtes secondaires (domaine et Barovie), et les orchidées de la forêt.
const sec = await import("./scripts/secondaires.js");
const { SECONDAIRES, ORCHIDEES } = await import("./scripts/donnees/secondaires.js");
for (const p of SECONDAIRES.filter((q) => q.region === "domaine" || q.region === "barovie")) {
  const o = p.region === "barovie" ? b : { x: 0, z: 0 };
  pres(o.x + p.decalage.x, o.z + p.decalage.z); await etape("secondaire_" + p.cle, () => sec.surveillerSecondaires());
}
for (const o of ORCHIDEES) { pres(b.x + o.x, b.z + o.z); await etape("orchidees", () => sec.surveillerSecondaires()); }
const chm = await import("./scripts/chateau.js"); pres(chm.positionDuChateau(E).x, chm.positionDuChateau(E).z); await etape("chateau", () => chm.poserChateau());
const sc = await import("./scripts/salles_chateau.js"); await etape("salles_chateau", () => sc.poserSalles());
const p2 = await import("./scripts/partie2.js"); await etape("partie2", () => p2.poserPartie2());
const de = await import("./scripts/denouement.js"); await etape("denouement", () => de.poserDenouement());
// Profondeurs
const pr = await import("./scripts/profondeurs.js");
await etape("tertre_mine", () => vider(pr.construireTertre(dim, E)));
const bc = pr.centreCite(E);
await etape("cite", () => vider(pr.construireCite(dim, bc)));
const cr = await import("./scripts/cristal.js");
await etape("cristal_tunnel", () => vider(cr.construireTunnel(dim, bc)));
const { CRISTAL, CHAMPIGNONS, LAVE } = await import("./scripts/donnees/profondeurs.js");
await etape("cristal_grottes", () => vider(cr.construireGrottes(dim, { x: bc.x + CRISTAL.centre.x, y: CRISTAL.sol, z: bc.z + CRISTAL.centre.z })));
const ch = await import("./scripts/champignons.js");
await etape("champ_tunnel", () => vider(ch.construireTunnel(dim, bc)));
await etape("champ_foret", () => vider(ch.construireForet(dim, { x: bc.x + CHAMPIGNONS.centre.x, y: CHAMPIGNONS.sol, z: bc.z + CHAMPIGNONS.centre.z })));
const lv = await import("./scripts/lave.js");
await etape("lave", () => vider(lv.construireLave(dim, { x: bc.x + LAVE.centre.x, y: LAVE.sol, z: bc.z + LAVE.centre.z })));
await etape("crevasse", () => vider(pr.creuserCrevasse(dim, bc)));
// Quêtes secondaires des profondeurs (dans les grottes et la forêt construites).
E.profondeurs = { ...(E.profondeurs ?? {}), cite: E.profondeurs?.cite ?? true, cristal: { construit: true }, champignons: { construit: true } };
for (const p of SECONDAIRES.filter((q) => q.region === "profondeurs")) {
  pres(bc.x + p.decalage.x, bc.z + p.decalage.z, p.sol + 1); await etape("secondaire_" + p.cle, () => sec.surveillerSecondaires());
}
const mine = await import("./scripts/mine.js");
const em2 = DOMAINE.emplacements.find((x) => x.nom === "mine");
await etape("mine_restauree", () => vider(mine.restaurerMine({ centre: { x: em2.centre.x, y: 64, z: em2.centre.z }, porte: "sud", dimension: "minecraft:overworld" })));
const out = [];
for (const [key, v] of dim.blocs) out.push([...key.split(",").map(Number), v.id.replace("minecraft:", ""), v.states, v.source]);
fs.writeFileSync("monde.json", JSON.stringify(out));
console.log("total", out.length);
const P = [...new Set(globalThis.PROBLEMES ?? [])];
fs.writeFileSync("problemes.json", JSON.stringify(P));
console.log("BLOCS OU ÉTATS REFUSÉS PAR LE JEU :", P.length);
for (const p of P) console.log("  - " + p);
