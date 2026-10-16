---
name: "scenario-e2e-minecraft"
description: "Écrire ou mettre à jour un scénario d'enchaînement GameTest (un joueur simulé qui AGIT : coups, interaction) pour toute transition d'un addon Minecraft Bedrock déclenchée par une action du joueur : fin de quête, combat, porte qui se dresse, apparition d'un lieu ou d'un personnage, retour au zoo. À utiliser dès qu'on ajoute ou modifie un tel enchaînement, quand un défaut n'apparaît qu'en jouant (alors que le saut de la baguette vers l'étape suivante marche), ou avant de livrer une fin de quête, même sans dire « E2E »."
---

# Scénario d'enchaînement E2E (addon Minecraft, banc GameTest)

**Dernière vérification : 16/10/2026** (premier scénario, l'ours du « Domaine oublié », rejoué sur BDS 1.26.52.3). Avant de s'appuyer sur un fait qui a pu changer depuis (version du serveur, API bêta `@minecraft/server-gametest`, nom des commandes), le signaler comme possiblement périmé et le revérifier sur le serveur de test.

## Règles communes : à lire avant toute action

**Jamais de code sans accord** : le banc de test est du code ; ce qu'il fait faire aux joueurs ne change rien à ce qu'ils voient, mais une transition NOUVELLE reste soumise aux deux portes (fiche, « je valide »). Lire dans `references/regles-communes.md` la section « Les deux portes » ; les autres sections ne s'appliquent pas à ce skill.

## Pourquoi

Les sauts de la baguette (`/scriptevent aventure:aller <étape>`) posent l'état d'une étape : ils ne prouvent pas que l'étape suivante se déclenche quand le joueur agit. Défaut réel vécu : l'ours devenait passif en fin de combat, mais la transition prévue à 20 % de vie ne se déclenchait pas, alors que le saut vers l'étape suivante marchait. Seul un joueur simulé qui AGIT (coups réels, interaction) prouve la chaîne d'événements du moteur et du mod. Ce que ça ne prouve pas : la sensation de jeu (cadence de coups régulière, pas de manette, pas d'écran partagé).

## Où et comment (dépôt du jeu)

1. Lire `tests_jeu/README.md`, section « Écrire un scénario d'enchaînement ».
2. Dans `tests_jeu/aventure_TEST/scripts/enchainements.js`, ajouter un `definir({ nom, saut, suivre, apresSaut, releve, etapes })`. Le cadre (`scenario.js`) apporte : réservation d'un seul banc, zones de chargement restantes retirées, attente du calme du mod avant le saut, zone de chargement qui suit le joueur simulé, sondes de blocage (domaine, saut), durée par étape, échec avec étape + raison + relevé de l'état.
3. Une étape = `{ nom, budget (ticks), entrer, agir, fait, reproche }` : `entrer` une fois (déplacer, équiper), `agir` à chaque tour de 10 ticks (frapper, interagir), `fait` = la transition attendue a eu lieu, `reproche` = texte d'échec immédiat pour un défaut déjà constaté.
4. `fait` lit l'état du mod par chemin (`c.valeur("zoo.porte")`, chemins déclarés dans `suivre`) ou les entités (`c.dim().getEntities({ type })`).
5. Un scénario par transition déclenchée par le joueur. Chaque défaut constaté en jeu devient un `reproche` ou une étape du scénario (non-régression).

## Pièges déjà rencontrés (ne pas les redécouvrir)

- Ne jamais lire l'état juste après l'action : le résumé du mod arrive un tour plus tard. Toujours attendre via `fait`, et laisser ~3 s avant de reprocher une absence (fausse alerte du 1er essai).
- Ne pas sauter avant que le mod soit calme : à la pose du domaine, son conteur (plusieurs étapes) tourne encore et le saut l'attend.
- Les joueurs simulés ne chargent pas le monde (« sol non chargé » loin du domaine) : poser une zone de chargement autour du joueur, avec un nom neuf à chaque fois (le serveur refuse un nom retiré dans la même seconde).
- Un seul banc à la fois dans le monde ; les zones de chargement persistent entre redémarrages et leur nombre est limité (`tickingarea remove_all` au départ).
- Les propriétés dynamiques sont propres à chaque pack : l'état du mod se lit par un répondeur injecté dans la copie DÉPLOYÉE du mod (`essai:demande <chemins>` → `essai:etat`), jamais dans les sources `src/`.
- Les joueurs simulés ne sont reconnus du mod que si son pack déployé charge aussi `@minecraft/server-gametest` (sinon `undefined` à la place du joueur).
- Protéger le joueur simulé (`effect @s resistance`) et lui donner l'équipement : on teste le mod, pas sa survie.
- Fichiers `.ps1` du dépôt : BOM UTF-8 + CRLF à conserver.
- Un échec du banc n'est pas toujours un défaut du jeu : lire la sonde (occupé, chantiers, conteur, positions) avant de conclure.

## Lancer et conclure

- Sur le PC de l'utilisateur : `scripts\install-server.ps1 -Tests`, puis `gametest run aventure:<nom>` (un scénario) ou `gametest run aventure:enchainements` (tous, à la suite).
- Lire les lignes `[essai] scénario <nom> : <étape> OK en N s` ; l'utilisateur colle le journal de la console.
- Noter le résultat au journal des décisions du dépôt avant toute fusion.
- Dire la limite : la chaîne des événements est prouvée, pas la sensation de jeu.
