---
name: mc-verification
description: "Mène l'interview de la campagne de test (qui teste, quoi, comment, question par question en cartes), ne code qu'après fiche validée, puis vérifie un addon Minecraft Bedrock avant de le livrer, sans serveur ni console : vérification des types des scripts (tsc --checkJs avec les déclarations @minecraft), banc de simulation hors jeu (faux serveur, monde plat, tous les lieux construits, blocs et états validés contre la liste officielle du jeu, audit des objets qui flottent ou regardent un mur), essais de la logique avec de faux joueurs et des fenêtres pilotables, planches de rendu, puis vérification en jeu guidée (baguette et carnet du testeur, points « non vérifiés en jeu »). À utiliser avant chaque livraison d'addon, quand un bloc est refusé ou disparaît, quand on demande « est-ce que ça marche ? », ou pour préparer une campagne de test, même sans dire « vérification »."
---

# Vérification d'un addon (hors jeu, puis en jeu)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Ce qui se voit » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill** : il prépare les planches de la porte 1 (dessinées hors des packs) et tient la porte 2. Il refait les planches **depuis les fichiers réellement intégrés**, liste les écarts avec la fiche validée et les points non vérifiés en jeu, et demande le « je valide ». Une vérification réussie (types, banc, essais) ne remplace jamais ce « je valide ».

**Pour ce skill** : la campagne de test reprend la liste de cohérence de chaque élément nouveau (chaque recette faite à l'établi et au four, chaque pioche sur chaque minerai, Toucher de soie, l'usure, la réparation, l'objet porté et tenu en main), avec un outil de test pour chaque point.

**Pour ce skill** : les planches de la porte 1 et de la porte 2 sont des planches en contexte (inventaire, main, personnage, monde) ; l'outil de test qui donne tout l'élément d'un coup fait partie de la livraison.

## Pourquoi

Dans l'environnement de travail, il n'y a ni Minecraft ni serveur. Sans méthode, « ça devrait marcher » cache :
- des noms de blocs refusés (des trous dans les murs) ;
- des objets qui flottent ;
- des fonctions de l'API qui n'existent plus ;
- des menus qui plantent ;
- des quêtes qui bloquent.

Le banc d'essai attrape tout cela **avant** la partie en famille. Les tests en jeu, eux, se concentrent sur ce que le banc ne sait pas voir.

## L'interview (avant de vérifier, puis à chaque campagne de test)

**La personne décide de ce qui compte comme « fini » et de la façon de tester.** Une question par message ; d'abord ouverte (« comment imagines-tu la campagne de test ? »), puis des options en cartes (skill `poser-questions-en-cards` s'il est installé) avec la recommandation en dernier ; rien n'est déclaré « vérifié » sans qu'elle sache comment.

1. **Qui teste, où et quand** : le parent sur le serveur de test du PC, les enfants sur le Realm, à chaque étape ou par campagne ?
2. **Les images avant de livrer** : planche de chaque nouveau lieu, de chaque créature, ou seulement des éléments importants ?
3. **Les outils de test souhaités** : baguette (aller, sauter une étape), carnet des points à vérifier, commandes dans la console ?
4. **La remontée des problèmes** : carnet en jeu, console du serveur à copier, captures d'écran, message libre ?
5. **Ce qui compte comme « fini »** pour cette étape : la liste des points à vérifier en jeu, proposée puis validée.
6. **Après chaque test** : pour chaque problème rapporté, présenter **le constat, la cause et les corrections possibles** (2 ou 3 si elles changent l'expérience), et laisser choisir.
7. **Les retours des joueurs** après une partie de test : que leur demander (ce qu'ils ont aimé, ce qui les a perdus, ce qui les a fait rire ou peur), comment noter leurs phrases, et ce qui devient une correction ou une idée pour plus tard ?

## Les trois niveaux, à chaque livraison

### 1. Les types
`tsc --allowJs --checkJs --noEmit --target es2022 --module es2022 --moduleResolution node scripts/*.js scripts/donnees/*.js`, dans un dossier où `@minecraft/server` et `@minecraft/server-ui` sont installés **à la version du manifeste**. Une fonction disparue, un paramètre mal typé ou un import cassé sortent ici. Ne rien livrer avec une erreur.

### 2. Le banc de simulation (`scripts/simulation/`)
Un **faux serveur** remplace `@minecraft/server`. Le banc construit **tous les lieux** de l'addon dans un **monde plat simulé**, puis :
- **valide chaque bloc et chaque état** contre la liste officielle du jeu (`blocs_vanilla.json`, tirée de `@minecraft/vanilla-data` à la version visée ; `extraire_blocs_vanilla.py` la régénère) et refuse les inconnus, comme le jeu ;
- **audite les appuis** : lanterne, torche, bougie, crâne, plante, nénuphar sans support ;
- **audite le sens** : panneaux, marches, échelles, fours, pupitres, meubles dont la face avant donne sur un mur.

Pour l'adapter à un projet :
- `lancer.sh` copie les scripts du projet et branche le faux serveur ;
- `tout.mjs` liste les lieux à construire (c'est la partie à réécrire) ;
- `monde.mjs`, `valider.mjs` et `audit.py` restent tels quels.

Résultat attendu : **0 bloc ou état refusé**, et seulement des alertes connues et expliquées (une trappe sous une échelle, un coffre enterré exprès).

**Ses limites, à dire honnêtement** :
- un terrain plat ;
- un bloc par case, sans les formes : les dalles, barrières et vitres ne se relient pas ;
- ni eau qui coule, ni lumière, ni créatures ;
- les états vérifiés en nom et en type, pas toutes leurs valeurs ;
- particules et sons non vérifiés.

Pour un cas précis, simuler un terrain particulier : une colline, un terrain bosselé, une plateforme d'attente dans le ciel.

### 3. Les essais de logique
Pour toute mécanique nouvelle, un petit script Node qui importe le module avec le faux serveur, **de faux joueurs** (inventaire, messages, position) et des **fenêtres pilotables** (`faux_server_ui_pilotable.js` : on donne la suite des boutons choisis). On rejoue un parcours et on regarde l'état obtenu. Par exemple :
- accepter une demande, vaincre des créatures avant et après avoir accepté ;
- deux joueurs qui donnent, un absent qui reçoit sa récompense plus tard ;
- un menu de test parcouru jusqu'au bout ;
- un non-opérateur refusé.

### 4. Les planches
Rendre en image, depuis le monde simulé ou depuis le modèle et la texture : un bâtiment de face, une coupe de caverne, une créature de face et de profil. Deux moments : **avant le code** (porte 1), les planches de ce qui sera fait, dessinées hors des packs, dans `ressources/planches/` ; **avant la fusion** (porte 2), les mêmes planches refaites depuis les fichiers intégrés, avec les écarts, dans `livrables/planches/`. Chaque fois, attendre le « je valide » explicite. Elles ont souvent fait retoucher un détail (les roues d'une roulotte, la queue d'une licorne, une stèle).

## La vérification en jeu

- **Ne jamais dire « vérifié » pour ce qui ne l'est qu'hors jeu.** Chaque livraison liste ses points « non vérifiés en jeu » dans `docs/design.md`.
- Préparer la campagne de test avec les outils de `mc-scripts-gameplay` :
  - la **baguette du testeur** : aller à un lieu, sauter à une étape, placer un PNJ ;
  - le **carnet du testeur** : tous les points à vérifier, marqués « ça marche » ou « problème », avec le bilan écrit dans la console du serveur.
- **Lire la console du serveur** : la ligne « scripts chargés » avec la version, la graine, les erreurs répétées, les blocs refusés faute de terrain chargé.
- Chaque retour de test devient une **entrée datée** dans `docs/journal-decisions.md` : le constat, la cause, la correction, ce qui reste à vérifier.

## Code de référence (dans `scripts/simulation/`)

- `lancer.sh` : lance le banc ;
- `tout.mjs` : la liste des lieux (exemple du Domaine oublié, à réécrire) ;
- `monde.mjs` : le monde simulé ;
- `faux_server.js` et `faux_server_ui.js` : les faux modules ;
- `faux_server_ui_pilotable.js` : des fenêtres pilotables pour les essais ;
- `valider.mjs` : la validation des blocs et des états ;
- `audit.py` : les appuis et le sens ;
- `blocs_vanilla.json` : la liste officielle, en 1.26.52 ;
- `extraire_blocs_vanilla.py` : régénère cette liste pour une autre version du jeu.
