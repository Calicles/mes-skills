---
name: "mc-scripts-gameplay"
description: "Mène l'interview des règles du jeu en script (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : quêtes, dialogues, récompenses, carnet, événements, outils de test), ne code qu'après fiche validée. Programmer le gameplay d'un addon Minecraft Bedrock avec la Script API (@minecraft/server, @minecraft/server-ui) : état de l'aventure sauvegardé dans le monde et gardé en mémoire, surveillances régulières, quêtes et objectifs partagés, dialogues et fenêtres, objets à utiliser, récompenses pour chacun et pour les absents, quêtes à tiroirs, événements du monde (invasion, déclencheurs, kit du maître du jeu) et de l'API (créature vaincue, interaction, objet utilisé), commandes et outils de test (baguette et carnet du testeur, sauts d'étape). À utiliser dès qu'on écrit ou corrige un script d'addon, une quête, un PNJ qui parle, un objet magique, une récompense, une commande de test, ou qu'une erreur apparaît dans la console du serveur, même sans dire « Script API ». Spécialise jeu-gameplay."
---

# Scripts de gameplay (Script API Bedrock)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Les règles de l'interview » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill, la porte 1 contient** : chaque texte affiché (dialogues, messages, titres, ligne d'objectif, pages du carnet), chaque fenêtre et ses boutons (en maquette), chaque récompense et ses quantités, chaque chiffre de règle (rareté, probabilité, durée, nombre), chaque objet ajouté et son apparence, et ce qui se passe quand ça rate (message ou silence). Les outils de test (baguette, carnet du testeur) y figurent aussi.

**Pour ce skill, la liste** :
- **le butin et la fonte** : ce que donne chaque bloc ou créature selon l'outil, Toucher de soie, Fortune, l'expérience ; les recettes de four et de haut fourneau ;
- **l'équipement** : les recettes de chaque pièce, l'usure (le jeu n'use pas les outils d'un addon : le script le fait), la réparation, les enchantements, le recyclage en pépites, les dégâts et la protection face aux paliers du jeu ;
- **le livre de recettes et l'inventaire créatif** : tout ce qui est ajouté doit y apparaître ;
- **les outils de test** : de quoi essayer chaque recette et chaque réglage sans les chercher dans le monde.

## Pourquoi

Le gameplay du lot 1 (boucles, quêtes, récompenses, gardiens) vit dans les scripts du pack de comportement. Ils tournent **sur le serveur** (serveur de test ou Realm), pas sur la Switch : le coût pour la Switch, ce sont les blocs, les créatures et les particules qu'ils envoient.

Un script d'addon doit survivre à trois situations :
- le **redémarrage** : la progression est gardée ;
- un **terrain pas chargé** : rien ne plante, tout reprend ;
- **quatre joueurs à la fois** : pas de doublons, pas de course.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. Parler aux personnages**
1. **La forme des dialogues** : fenêtre native avec portrait (grandes scènes), fenêtre à boutons (rapide), messages dans la discussion ?
2. **Le nombre de répliques** par rencontre, et ce qu'on peut répondre (un bouton, deux choix) ?

**B. Suivre l'aventure**
3. **Le carnet** : faut-il un carnet d'aventure ? Que montre-t-il (quête en cours, compteurs, souvenirs, découvertes) ?
4. **La ligne d'objectif** à l'écran : oui ou non, avec direction et distance ?
5. **Les annonces** : titre à l'écran, message, son ; pour qui (tous, ceux qui sont près) ?

**C. Les objets et récompenses**
6. **Où arrivent les récompenses** : dans l'inventaire de chacun, dans un coffre du QG, au sol ?
7. **Les objets magiques** (sorts, parchemins, symboles) : ce qu'ils font, combien de fois, leur apparence.
8. **La perte** : objet de quête perdu, mort, inventaire gardé ou non ; qui peut redonner un objet ?

**D. Les règles du monde**
9. **Les réglages** : garder l'inventaire, cycle jour/nuit, apparition des monstres, dégâts de chute, feu ?
10. **Les absents** : ce qu'un joueur absent reçoit à son retour.

**E. Les quêtes à tiroirs et les événements** (si le gameplay en prévoit)
11. **Le suivi d'une quête à tiroirs** dans le carnet : un arbre, une liste « d'abord… », ou seulement le tiroir en cours ?
12. **Le déclencheur en jeu** de chaque événement : objet utilisé (lequel, son apparence), entrée dans une zone, heure du jeu, étape franchie ?
13. **Le kit du maître du jeu** : un objet réservé au parent comme la baguette du testeur, ou une page cachée de la baguette ? Quels boutons : lancer, arrêter, plus facile, plus difficile ?

**F. Les outils de test** (pour la personne qui teste)
14. **Les outils souhaités** : un menu à boutons (baguette du testeur), des commandes, un carnet des points à vérifier ?
15. **Ce qu'ils doivent permettre** : aller à un lieu, sauter à une étape, placer un personnage, coups de pouce (voler, se soigner, faire jour).
16. **Qui peut s'en servir** (seulement les parents opérateurs) ?

**G. La validation**
17. Le **parcours d'une quête** (ou d'un événement) décrit pas à pas (qui parle, ce qui s'affiche, ce qui se passe à chaque objectif, la fête) : « est-ce exactement ce que tu veux voir en jeu ? »

### En évolution
Pour une mécanique nouvelle, décrire **le parcours du joueur** pas à pas et le faire valider avant d'écrire le moindre script.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. Le socle
- Dernières versions **stables** de `@minecraft/server` et `@minecraft/server-ui`, déclarées dans le manifeste. JavaScript simple, **vérifié par TypeScript** (`tsc --checkJs`, voir `mc-verification`).
- Une ligne au démarrage dans la console : « Mon addon 1.2.3 : scripts chargés ». Sans elle, l'addon ne tourne pas, et c'est la première chose à regarder.
- Un `main.js` qui branche les événements et les surveillances, des modules par thème, et des **données à part** (`donnees/*.js` : quêtes, lieux, textes) que la personne peut relire.

### 2. L'état de l'aventure
- **Un seul JSON** dans une propriété dynamique du monde (`world.setDynamicProperty`), lu une fois puis **gardé en mémoire**. On le modifie en partant d'une copie neuve, on l'écrit, et la mémoire est tenue à jour. Voir `references/etat.js`.
- Des **valeurs par défaut** à la lecture, pour qu'une ancienne sauvegarde reste lisible quand l'addon évolue.
- Ce qui est propre à un joueur (« a entendu la présentation », « a reçu son kit ») va dans ses propriétés dynamiques.
- Garder le JSON petit (quelques Ko) : des statuts et des compteurs, pas des listes de blocs.

### 3. Les surveillances
- `system.runInterval` toutes les 10 à 200 ticks selon le besoin. Chacune **sort tout de suite** si elle n'a rien à faire : pas de joueur dans la zone, étape pas encore atteinte, monde pas encore posé.
- **Attendre que le monde existe** avant d'en lire la dimension ou la position. Sinon : une erreur en boucle toutes les deux secondes dans la console.
- Entourer de `try` tout ce qui touche un bloc ou une entité **dans une zone peut-être pas chargée** (`LocationInUnloadedChunkError`), et réessayer plus tard.

### 4. Les quêtes
- **Des données**, pas du code : chaque quête a son habitant, ses objectifs (`lieu`, `rapporter`, `vaincre`, `gardien`…), ce qu'elle débloque, son coffre commun et son souvenir.
- **L'avancement est commun** ; chacun peut donner ce qu'il a. Les victoires ne comptent qu'**après avoir accepté**.
- Statuts : `a_faire` → `en_cours` → `prete` → `finie`. La fête vient **une seule fois** : on peut appeler la fonction plusieurs fois sans effet en double.
- Voir `references/quete.js` et `references/inventaire.js` (compter, retirer, donner ; ce qui ne rentre pas tombe au sol).

Une **quête à tiroirs** : chaque tiroir est une quête ordinaire avec un champ `parent` ; la quête parente reste `en_cours` tant qu'un tiroir est ouvert, et la fermeture d'un tiroir rappelle la parente. Une **quête à embranchements** garde le choix fait dans l'état (`choix: "a"`), lu par la suite.

### 5. Les récompenses
- Objets nommés et décrits (`nameTag`, `setLore`), enchantés (composant `minecraft:enchantable`, `EnchantmentTypes.get`).
- **Potions** : `Potions.resolve("minecraft:healing", "Consume")`. Une ancienne fonction (`createPotion`) n'existe plus : elle donnait des carottes à la place, en silence.
- **Les absents** : leur part est gardée (liste par joueur dans l'état) et remise à leur connexion.

### 6. Parler aux personnages
- `world.beforeEvents.playerInteractWithEntity` : annuler l'interaction par défaut, puis ouvrir la scène dans `system.run` (pas de fenêtre dans un événement « avant »).
- **Dialogue natif** : `/dialogue open`, avec des boutons qui envoient un `/scriptevent` traité par `system.afterEvents.scriptEventReceive`. Il demande les **triches** sur le Realm.
- **Fenêtre de script** (`ActionFormData`) : titre, texte, boutons. Elle convient aux demandes en plusieurs étapes, aux marchands, aux carnets.

### 6 bis. Les événements
- **Des données** comme les quêtes : chaque événement a son déclencheur, son annonce, ses vagues ou ses effets, sa durée maximale et sa fin.
- Un **seul événement à la fois**, gardé dans l'état (`evenement: { id, debut, phase }`) : il reprend après un redémarrage, et **finit toujours** (durée maximale, puis retour au calme : créatures retirées, ciel rétabli).
- Ne rien lancer pendant un combat de gardien ou une scène (lire leur statut avant).
- Créatures d'une invasion : marquées d'une étiquette (`addTag`) pour être comptées, puis retirées à la fin, en nombre plafonné.
- **Le kit du maître du jeu** : construit comme la baguette du testeur (objet réservé aux opérateurs, menu à boutons), avec lancer, arrêter, plus facile et plus difficile.

### 7. Les objets à utiliser
`world.afterEvents.itemUse` : un carnet qui ouvre une fenêtre, un parchemin de sort, un symbole sacré. L'objet a son JSON (icône, nom, taille de pile) et sa texture.

### 8. Les commandes qui demandent les triches
Lancées par le script avec `dimension.runCommand(...)`, elles n'agissent qu'avec les **triches actives** sur le monde :
- `tickingarea` (zones de chargement) ;
- `fog` (brume) ;
- `camera … fade` (écran noir) ;
- `playanimation` (gestes) ;
- `dialogue open`.

Les activer sur le serveur de test et sur le Realm, et le noter.

### 9. Les outils de test (dès le début)
- **Sauts d'étape** : un moteur qui, pour sauter à une étape, applique tout ce qui la précède (quêtes finies, pièces restaurées sans fête, lieux construits d'abord), puis emmène le testeur sur place. Voir `references/sauts.js`.
- **Baguette du testeur** : un objet réservé aux opérateurs (`playerPermissionLevel`) qui ouvre un menu à boutons. On y trouve : aller à un lieu, sauter à une étape, placer un PNJ à une demande, coups de pouce. **À la manette, un menu vaut mieux qu'une commande à taper.** Voir `references/testeur.js`.
- **Carnet du testeur** : les points à vérifier en jeu, à marquer « ça marche » ou « problème », avec « Y aller » et un bilan écrit dans la console. Voir `references/carnet_testeur.js`.
- Garder aussi des `/scriptevent mon_addon:…` pour la console du serveur.

## Ce qu'on écrit dans docs/game-design/gameplay.md (section « Réalisation dans l'addon ») et docs/design.md (choix techniques)

- les choix techniques (versions de Script API, structure des fichiers, forme de l'état) ;
- les quêtes en données ;
- les commandes et outils de test (dans le README) ;
- pour chaque livraison, ce qui a été vérifié hors jeu et ce qui ne l'a pas été.

## Code de référence (dans `references/`)

- `etat.js` : état JSON gardé en mémoire ;
- `quete.js` : objectifs partagés ;
- `inventaire.js` : compter, retirer, donner ;
- `sauts.js` : moteur des sauts d'étape ;
- `testeur.js` : baguette du testeur ;
- `carnet_testeur.js` : carnet des points à vérifier.

Ces fichiers viennent du Domaine oublié : en garder la logique et adapter les imports et les données.
