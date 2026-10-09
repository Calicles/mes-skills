// Petits outils pour l'inventaire des joueurs. Rien ne se perd : ce qui ne rentre pas tombe au sol.

function conteneur(joueur) {
  return joueur.getComponent("minecraft:inventory")?.container;
}

export function compter(joueur, objet) {
  const sac = conteneur(joueur);
  if (!sac) return 0;
  let total = 0;
  for (let i = 0; i < sac.size; i++) {
    const pile = sac.getItem(i);
    if (pile?.typeId === objet) total += pile.amount;
  }
  return total;
}

// Retire jusqu'à `quantite` exemplaires ; renvoie le nombre réellement retiré.
export function retirer(joueur, objet, quantite) {
  const sac = conteneur(joueur);
  if (!sac) return 0;
  let reste = quantite;
  for (let i = 0; i < sac.size && reste > 0; i++) {
    const pile = sac.getItem(i);
    if (pile?.typeId !== objet) continue;
    const pris = Math.min(pile.amount, reste);
    if (pris === pile.amount) {
      sac.setItem(i, undefined);
    } else {
      pile.amount -= pris;
      sac.setItem(i, pile);
    }
    reste -= pris;
  }
  return quantite - reste;
}

export function donner(joueur, pile) {
  const sac = conteneur(joueur);
  const surplus = sac ? sac.addItem(pile) : pile;
  if (surplus) joueur.dimension.spawnItem(surplus, joueur.location);
}
