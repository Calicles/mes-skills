// Le carnet du testeur (pour les parents) : tous les points à vérifier en jeu (donnees/tests.js),
// partie par partie. Chaque point se marque « ça marche » ou « problème » (avec une note), se remet
// à vérifier, et a souvent un bouton « Y aller » (l'étape est préparée, on y est emmené). Les
// problèmes notés se relisent d'un coup, et le bilan s'envoie dans la console du serveur (pour le
// copier depuis le PC). Ce qui est vérifié est gardé dans le monde. Réservé aux opérateurs.
// On l'obtient par l'inventaire créatif, ou par /give @s aventure:carnet_testeur.
import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { TESTS } from "./donnees/tests.js";
import { estOperateur, allerAuLieu, versSecondaire } from "./testeur.js";
import { lireEtat } from "./etat.js";

export const TYPE_CARNET_TESTEUR = "aventure:carnet_testeur";
const CLE = "aventure:tests";

// --- Ce qui est vérifié : { id: { statut: "ok" | "ko", note?: string } } ---

function lireTests() {
  try {
    const brut = world.getDynamicProperty(CLE);
    return typeof brut === "string" ? JSON.parse(brut) : {};
  } catch {
    return {};
  }
}

function ecrireTests(tests) {
  world.setDynamicProperty(CLE, JSON.stringify(tests));
}

function marquer(id, statut, note) {
  const tests = lireTests();
  if (statut) tests[id] = note ? { statut, note } : { statut };
  else delete tests[id];
  ecrireTests(tests);
}

const MARQUES = { ok: "§2[OK]§r ", ko: "§c[!!]§r " };
const marque = (t) => MARQUES[t?.statut] ?? "§8[  ]§r ";

function compter(points, tests) {
  const ok = points.filter((p) => tests[p.id]?.statut === "ok").length;
  const ko = points.filter((p) => tests[p.id]?.statut === "ko").length;
  return { ok, ko, reste: points.length - ok - ko };
}

const tousLesPoints = () => TESTS.flatMap((t) => t.points.map((p) => ({ ...p, partie: t.partie })));

// --- Les fenêtres ---

async function montrer(joueur, titre, corps, boutons) {
  const fenetre = new ActionFormData().title(titre).body(corps);
  for (const b of boutons) fenetre.button(b);
  try {
    const r = await fenetre.show(joueur);
    return r.canceled || r.selection === undefined ? undefined : r.selection;
  } catch {
    return undefined;
  }
}

/** @param {any} joueur @param {{ allerA: (etape: string, joueur: any) => void }} actions */
export async function ouvrirCarnetTesteur(joueur, actions) {
  if (!estOperateur(joueur)) {
    joueur.sendMessage("§c[test] Le carnet du testeur est réservé aux parents (opérateurs).");
    return;
  }
  const tests = lireTests();
  const total = compter(tousLesPoints(), tests);
  const corps = `Bilan : §2${total.ok} vérifiés§r, §c${total.ko} problèmes§r, ${total.reste} à vérifier.\n\n[OK] ça marche   [!!] problème   [  ] à vérifier`;
  const boutons = TESTS.map((t) => {
    const c = compter(t.points, tests);
    return `${t.partie}\n§2${c.ok} OK§r · §c${c.ko} !!§r · ${c.reste} à voir`;
  });
  const k = await montrer(joueur, "Carnet du testeur", corps, [...boutons, `Les problèmes notés (${total.ko})`, "Envoyer le bilan dans la console", "Fermer"]);
  if (k === undefined || k === TESTS.length + 2) return;
  if (k < TESTS.length) return ouvrirPartie(joueur, actions, k);
  if (k === TESTS.length) return voirLesProblemes(joueur, actions);
  envoyerLeBilan(joueur);
}

async function ouvrirPartie(joueur, actions, n) {
  const { partie, points } = TESTS[n];
  const tests = lireTests();
  const k = await montrer(joueur, partie, "Choisis un point à vérifier :", [...points.map((p) => marque(tests[p.id]) + p.nom), "Retour"]);
  if (k === undefined) return;
  if (k === points.length) return ouvrirCarnetTesteur(joueur, actions);
  return ouvrirPoint(joueur, actions, points[k], () => ouvrirPartie(joueur, actions, n));
}

async function ouvrirPoint(joueur, actions, point, retour) {
  const t = lireTests()[point.id];
  const etat = { ok: "§2Ça marche.§r", ko: "§cProblème.§r" }[t?.statut] ?? "À vérifier.";
  const corps = `${point.detail}\n\nÉtat : ${etat}${t?.note ? `\nNote : ${t.note}` : ""}`;
  const peutAller = point.etape || point.lieu || point.secondaire;
  const boutons = ["§2Ça marche", "§cProblème (noter)", ...(peutAller ? [point.etape ? "Y aller (l'étape est préparée)" : "Y aller"] : []), "Remettre à vérifier", "Retour"];
  const k = await montrer(joueur, point.nom, corps, boutons);
  if (k === undefined) return;
  const choix = boutons[k];
  if (choix === "§2Ça marche") {
    marquer(point.id, "ok");
    joueur.playSound("random.orb");
    return retour();
  }
  if (choix === "§cProblème (noter)") {
    const note = await demanderNote(joueur, point, t?.note);
    if (note === undefined) return ouvrirPoint(joueur, actions, point, retour);
    marquer(point.id, "ko", note);
    console.warn(`[test] PROBLÈME « ${point.nom} » : ${note || "(sans note)"}`);
    joueur.playSound("note.bass");
    return retour();
  }
  if (choix === "Remettre à vérifier") {
    marquer(point.id, undefined);
    return retour();
  }
  if (choix === "Retour") return retour();
  // Y aller.
  if (point.etape) actions.allerA(point.etape, joueur);
  else if (point.lieu) allerAuLieu(joueur, point.lieu);
  else if (point.secondaire) versSecondaire(joueur, point.secondaire, lireEtat());
}

// La note (facultative) : ce qui ne va pas, en quelques mots.
async function demanderNote(joueur, point, ancienne) {
  try {
    const r = await new ModalFormData()
      .title(point.nom)
      .textField("Qu'est-ce qui ne va pas ? (facultatif)", "en quelques mots", { defaultValue: ancienne ?? "" })
      .submitButton("Noter le problème")
      .show(joueur);
    if (r.canceled) return undefined;
    return String(r.formValues?.[0] ?? "").trim();
  } catch {
    return "";
  }
}

async function voirLesProblemes(joueur, actions) {
  const tests = lireTests();
  const problemes = tousLesPoints().filter((p) => tests[p.id]?.statut === "ko");
  if (problemes.length === 0) {
    await montrer(joueur, "Les problèmes notés", "Aucun problème noté pour l'instant.", ["Retour"]);
    return ouvrirCarnetTesteur(joueur, actions);
  }
  const corps = problemes.map((p) => `§c[!!]§r ${p.nom} §7(${p.partie})§r${tests[p.id].note ? `\n   ${tests[p.id].note}` : ""}`).join("\n");
  const k = await montrer(joueur, `Les problèmes notés (${problemes.length})`, corps, [...problemes.map((p) => p.nom), "Retour"]);
  if (k === undefined) return;
  if (k === problemes.length) return ouvrirCarnetTesteur(joueur, actions);
  return ouvrirPoint(joueur, actions, problemes[k], () => voirLesProblemes(joueur, actions));
}

// Le bilan complet dans la console du serveur (sur le PC), à copier pour le transmettre.
async function envoyerLeBilan(joueur) {
  const tests = lireTests();
  const lignes = ["[test] ===== BILAN DU CARNET DU TESTEUR ====="];
  for (const { partie, points } of TESTS) {
    lignes.push(`[test] --- ${partie} ---`);
    for (const p of points) {
      const t = tests[p.id];
      const mot = { ok: "OK      ", ko: "PROBLÈME" }[t?.statut] ?? "à voir  ";
      lignes.push(`[test] ${mot} ${p.nom}${t?.note ? ` : ${t.note}` : ""}`);
    }
  }
  for (const l of lignes) console.warn(l);
  try {
    await new MessageFormData()
      .title("Bilan envoyé")
      .body("Le bilan est dans la fenêtre du serveur, sur le PC (les lignes qui commencent par [test]). Sur le Realm, la console n'est pas visible : utilise « Les problèmes notés ».")
      .button1("OK")
      .button2("Fermer")
      .show(joueur);
  } catch {
    // fenêtre fermée
  }
}
