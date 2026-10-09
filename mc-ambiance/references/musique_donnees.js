// La musique par lieu : des familles de morceaux déjà dans Minecraft (aucun fichier à ajouter).
// `boucle` : en continu ; sinon un morceau, puis la musique normale du jeu (avec ses silences).
// `priorite` : à égalité de joueurs, le lieu qui l'emporte (le combat d'abord).
export const MUSIQUES = {
  combat: { piste: "music.game.endboss", boucle: true, priorite: 10 },
  cimetiere: { piste: "music.game.soulsand_valley", boucle: true, priorite: 6 },
  foret: { piste: "music.overworld.forest", boucle: true, priorite: 6 },
  marais: { piste: "music.overworld.swamp", boucle: true, priorite: 6 },
  barovie: { piste: "music.overworld.swamp", boucle: true, priorite: 5 },
  grottes: { piste: "music.overworld.lush_caves", boucle: true, priorite: 6 },
  champignons: { piste: "music.game.warped_forest", boucle: true, priorite: 6 },
  lave: { piste: "music.game.basalt_deltas", boucle: true, priorite: 6 },
  cite: { piste: "music.overworld.dripstone_caves", boucle: true, priorite: 5 },
  domaine: { piste: "music.overworld.meadow", boucle: false, priorite: 1 },
};

// Le fondu entre deux musiques (secondes), le volume, et le rayon du cimetière (blocs, depuis son centre).
export const REGLAGES_MUSIQUE = { fondu: 3, volume: 1, rayonCimetiere: 40 };
