// Fausses fenêtres (@minecraft/server-ui) pilotables, pour tester les menus et dialogues hors jeu :
// globalThis.CHOIX = file des réponses (un numéro de bouton, le libellé d'un bouton, ou
// { valeurs: [...] } pour un formulaire) ; globalThis.VUES reçoit chaque fenêtre montrée.
class Fenetre {
  constructor() { this.boutons = []; this.corps = null; this.titre = null; }
  title(t) { this.titre = t; return this; }
  body(c) { this.corps = c; return this; }
  button(t) { this.boutons.push(typeof t === "string" ? t : t.translate ?? t.text); return this; }
  button1(t) { return this.button(t); }
  button2(t) { return this.button(t); }
  textField() { return this; }
  toggle() { return this; }
  dropdown() { return this; }
  slider() { return this; }
  submitButton() { return this; }
  async show(joueur) {
    const choix = (globalThis.CHOIX ?? []).shift();
    (globalThis.VUES ??= []).push({ joueur: joueur?.name, titre: this.titre, corps: JSON.stringify(this.corps), boutons: this.boutons, choix });
    if (choix === undefined) return { canceled: true };
    if (typeof choix === "object") return { canceled: false, formValues: choix.valeurs };
    const i = typeof choix === "number" ? choix : this.boutons.findIndex((b) => b === choix || String(b).endsWith(choix));
    return { canceled: false, selection: i };
  }
}
export const ActionFormData = Fenetre, ModalFormData = Fenetre, MessageFormData = Fenetre;
