// Avancement des quêtes de groupe : une checklist partagée, remplie par n'importe quel joueur.
// Chaque quête a son état dans le monde : etat[quete.cle] = { statut, progression, victoire }.
// statut : "a_faire" → "en_cours" → "prete" (tout est fait, récompense à venir) → "finie"
import { world } from "@minecraft/server";
import { QUETES } from "./donnees/quetes.js";
import { lireEtat, modifierEtat } from "./etat.js";

export { QUETES };

export function queteParCle(cle) {
  return QUETES.find((q) => q.cle === cle);
}

export function etatQuete(etat, quete) {
  return etat[quete.cle] ?? { statut: "a_faire", progression: {} };
}

// Une quête est disponible quand la pièce de son habitant est restaurée (la 1re l'est toujours),
// ou, au chapitre 2, quand la quête précédente est finie.
export function estDisponible(etat, quete) {
  if (quete.apresQuete && etat[quete.apresQuete]?.statut !== "finie") return false;
  return !quete.apresPiece || etat.pieces?.[quete.apresPiece]?.statut === "restauree";
}

// La quête de cet habitant : la première disponible pas encore finie, sinon la dernière finie
// (pour sa réplique d'après). Perceval en a deux : la 1re et la dernière.
export function queteDeLHabitant(etat, typeHabitant) {
  const siennes = QUETES.filter((q) => q.habitant === typeHabitant && estDisponible(etat, q));
  return siennes.find((q) => etatQuete(etat, q).statut !== "finie") ?? siennes[siennes.length - 1];
}

// La quête en cours (acceptée et pas encore récompensée), s'il y en a une.
export function queteActive(etat) {
  return QUETES.find((q) => ["en_cours", "prete"].includes(etatQuete(etat, q).statut));
}

// La prochaine quête à aller chercher auprès de son habitant.
export function queteAPrendre(etat) {
  return QUETES.find((q) => estDisponible(etat, q) && etatQuete(etat, q).statut === "a_faire");
}

export function nomObjectif(quete, objectif) {
  return { translate: `aventure.objectif.${quete.cle}.${objectif.id}.nom` };
}

export function avancement(etatQ, objectif) {
  return Math.min(etatQ.progression?.[objectif.id] ?? 0, objectif.quantite);
}

export function estFait(etatQ, objectif) {
  return avancement(etatQ, objectif) >= objectif.quantite;
}

export function objectifsRestants(quete, etatQ) {
  return quete.objectifs.filter((o) => !estFait(etatQ, o));
}

function cleDernierObjectif(quete) {
  return `aventure:dernier_objectif_${quete.cle}`;
}

export function dernierObjectif(joueur, quete) {
  const id = joueur.getDynamicProperty(cleDernierObjectif(quete));
  return quete.objectifs.find((o) => o.id === id);
}

// Fait avancer un objectif de `quantite` (plafonné) ; renvoie ce qui a réellement compté.
// Prévient tout le monde quand l'objectif est rempli, puis quand toute la quête est prête.
export function avancer(quete, idObjectif, quantite, joueur) {
  const objectif = quete.objectifs.find((o) => o.id === idObjectif);
  if (!objectif) return { compte: 0, prete: false };
  const actuelle = etatQuete(lireEtat(), quete);
  if (actuelle.statut !== "en_cours" || estFait(actuelle, objectif)) return { compte: 0, prete: false };

  let compte = 0;
  let objectifRempli = false;
  let quetePrete = false;
  modifierEtat((e) => {
    const q = etatQuete(e, quete);
    if (q.statut !== "en_cours") return;
    const avant = avancement(q, objectif);
    compte = Math.min(quantite, objectif.quantite - avant);
    if (compte <= 0) return;
    q.progression = { ...q.progression, [objectif.id]: avant + compte };
    objectifRempli = avant + compte >= objectif.quantite;
    if (objectifsRestants(quete, q).length === 0) {
      q.statut = "prete";
      quetePrete = true;
    }
    e[quete.cle] = q;
  });

  if (compte > 0 && joueur?.isValid) joueur.setDynamicProperty(cleDernierObjectif(quete), objectif.id);
  if (objectifRempli) {
    world.sendMessage({ translate: "aventure.notif.objectif_fait", with: { rawtext: [nomObjectif(quete, objectif)] } });
    for (const j of world.getAllPlayers()) j.playSound("random.orb");
  }
  if (quetePrete) world.sendMessage({ translate: `aventure.notif.${quete.cle}.prete` });
  return { compte, prete: quetePrete };
}

// Fait avancer les objectifs d'un type donné (« vaincre », « lieu ») de la quête en cours.
export function avancerType(type, quantite, joueur, filtre = (_objectif) => true) {
  const quete = queteActive(lireEtat());
  if (!quete) return;
  for (const objectif of quete.objectifs) {
    if (objectif.type === type && filtre(objectif)) avancer(quete, objectif.id, quantite, joueur);
  }
}
