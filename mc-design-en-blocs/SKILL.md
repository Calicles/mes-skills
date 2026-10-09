---
name: mc-design-en-blocs
description: "Mène l'interview de direction en blocs (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : palette de blocs, matières, couleurs, échelle, détails), ne code qu'après fiche validée. Traduire bâtiments, lieux, terrains et mobilier en blocs Minecraft Bedrock construits par script : palettes de blocs par style, échelle (1 bloc = 1 m), noms et états de blocs valides (brick_block, iron_chain, cardinal_direction…), appuis (lanternes, torches, plantes), orientation (coffres, fours, meubles), terrassement et raccord en pente au terrain réel, chemins taillés, cavernes sculptées, nettoyage des restes d'arbres, construction étape par étape. À utiliser dès qu'on construit ou modifie un lieu, une maison, un donjon, une caverne, une route ou une pièce dans un addon Minecraft, ou qu'un bloc est refusé, flotte ou regarde un mur, même sans dire « blocs ». Spécialise jeu-architecture et jeu-mobilier-decor."
---

# Design en blocs (Minecraft Bedrock)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill, la porte 1 contient** : la palette de blocs de chaque style, **chaque texture de bloc à nous** (minerais, blocs décoratifs, meubles) et **chaque objet et son icône** (outils, armes, armures et leur rendu porté, lingots, gemmes, objets de quête), dessinés en planche agrandie à côté des blocs du jeu qui les entourent ; la planche de chaque lieu. Les textures sont générées dans un dossier de travail et copiées dans le pack seulement après le « je valide ».

**Pour ce skill, la liste** :
- **un minerai** : ses variantes (pierre, ardoise des profondeurs) ; ce qu'il donne selon la pioche (palier minimum), avec Toucher de soie, avec Fortune et par une explosion ; l'expérience gagnée ; la fonte du bloc lui-même et de ce qu'il donne ; le son ; la vitesse de minage selon chaque pioche ;
- **un matériau** : toutes ses formes (brut, lingot, pépite, bloc, bloc brut) et leurs recettes dans les deux sens ;
- **un bloc décoratif ou utilitaire** : sa recette, ce qu'il donne quand on le casse, son son, sa résistance aux explosions, sa catégorie dans l'inventaire créatif, `blocks.json` (le son **et** la texture : sans la texture, le bloc s'affiche avec une texture par défaut, comme de la terre).

**Pour ce skill** : chaque icône est montrée sur le gris de l'inventaire à côté de l'objet du jeu qu'elle remplace ou complète (le lingot d'argent à côté du lingot de fer) ; chaque bloc posé en 3 × 3 dans le monde, à la lumière du jour et d'une torche ; chaque armure portée de face, de profil et de dos ; chaque outil ou arme tenu en main, dans le bon sens (le tranchant vers les monstres).

## Pourquoi

Le plan d'un bâtiment (`jeu-architecture`) et de son décor (`jeu-mobilier-decor`) doit devenir des **blocs réels**, posés par un script, sur un **terrain qu'on ne connaît pas d'avance**. Trois choses cassent l'immersion :
- un bloc **refusé** (mauvais nom ou mauvais état) : un trou dans le mur ;
- un objet qui **flotte** ou qui **regarde le mur** ;
- un lieu posé **brutalement** sur le terrain : falaise taillée au couteau, arbre coupé en l'air.

Ce skill les évite dès la conception.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc (pour chaque style, puis chaque lieu)

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La palette de blocs** (un style à la fois : médiéval, gothique, nain, féerique…)
1. **Le matériau principal** des murs : proposer 2 ou 3 palettes nommées, avec une planche.
2. **Le matériau d'appui** (bases, angles, poutres, encadrements).
3. **Le toit** : bloc, forme (escaliers, dalles, pente), couleur.
4. **Le sol** intérieur et les **chemins** extérieurs.
5. **Les accents** : couleur signature, métal, verre teinté, laine, terre cuite.
6. **La part d'usure** : blocs moussus, fissurés, ébréchés ; combien ?

**B. L'échelle et les formes**
7. **L'échelle** : taille réelle (1 bloc = 1 m, portes de 2 blocs) ou agrandie (portes de 3 ou 4, plus majestueux) ?
8. **Les arrondis** : escaliers, dalles, murets pour casser les angles, ou des formes franches ?
9. **Les détails** : bannières, têtes, pots, chaînes, cloches, trappes en volets ?

**C. La lumière**
10. **Les sources** : lanternes, torches, bougies, braseros, lumières cachées (lumière sous un tapis), cristaux, lanternes marines.
11. **L'ambiance** : chaude, froide, colorée, faible ou vive ?

**D. Le mobilier en blocs**
12. **Les meubles faits de blocs du jeu** (tables en barrières et plaques, chaises en escaliers…) ou **des meubles à nous** (modèles sur mesure) ? Pièce par pièce si besoin.
13. **Les objets interactifs** : vrais coffres, tonneaux, établis, chaudrons ?

**E. Le terrain autour**
14. **Le lieu épouse-t-il le terrain** (fondations qui suivent la pente) ou l'**aplanit-il** (avec un raccord en pente douce) ?
15. **La végétation** à garder, à retirer ou à planter (arbres, fleurs, haies, lianes).
16. **Les chemins** : matière (terre battue, gravier, pavés), largeur, bordures, lanternes ?

**F. Sous terre** (s'il y a des cavernes bâties)
17. **La forme** : organique (voûte, bosses, alcôves) ou taillée par des habitants (droite, nette) ?
18. **La roche et ses couleurs** (ardoise, tuf, basalte, calcite, améthyste…).
19. **Les éléments signature** : stalactites, cristaux, champignons lumineux, rivières de lave, lac.

**G. La validation**
20. Une **planche** de chaque style (un mur, un toit, un angle, une fenêtre), puis de chaque lieu (vue d'ensemble) : que changer ?
21. La **palette définitive** par style : « est-ce exactement le rendu que tu veux ? »

### En évolution
Pour une retouche de rendu (« les stèles sont moches »), demander d'abord **une image ou une référence** de ce qui est attendu, proposer 2 ou 3 versions en planche, puis faire valider.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La palette de blocs, par style
Pour chaque style du lot 1, une palette courte, faite valider sur une **planche**, puis écrite dans `docs/game-design/architecture.md` :
- **matériau principal**, **matériau d'appui** (bases, angles, poutres), **toit**, **sol**, **accents** (lumière, couleur) ;
- 10 à 20 % de **variantes usées** (moussues, fissurées) pour casser les grands aplats.

Exemples éprouvés :
- domaine médiéval : briques de pierre, chêne, toit de chêne noir, lanternes ;
- château gothique : ardoise, pierre noire, vitraux, chaînes, bougies ;
- cité naine : ardoise polie, cuivre, basalte, braseros ;
- cimetière façon Halloween joyeux : stèles à piliers clairs et panneau sombre, citrouilles-lanternes, torches bleues.

### 2. Les noms et états de blocs : toujours valides
Bedrock **ignore sans bruit** un bloc ou un état inconnu dans certains appels, et refuse le reste. Valider **chaque identifiant et chaque nom d'état** contre la liste officielle (`@minecraft/vanilla-data`, voir `mc-verification`).

Pièges déjà rencontrés :
- `bricks` → **`brick_block`** ; `chain` → **`iron_chain`** ;
- `nether_bricks` → **`nether_brick`** ; `red_nether_bricks` → **`red_nether_brick`** ;
- `sugar_cane` → **`reeds`** ; `flowering_azalea_leaves` → **`azalea_leaves_flowered`** ; `dirt_path` → **`grass_path`** ;
- portillons et pupitres : **`minecraft:cardinal_direction`** (pas `direction`) ;
- bûches : `pillar_axis` ; escaliers : `weirdo_direction` (0 est, 1 ouest, 2 sud, 3 nord : le sens de la montée) et `upside_down_bit` ;
- tonneau : `facing_direction` (1 = couvercle en haut) ; torche : `torch_facing_direction` ; lanterne : `hanging` ;
- cultures : `growth` (7 = mûr) ; terre labourée : `moisturized_amount`.

Garder une **table des anciens noms** essayés si le nouveau n'existe pas encore dans la version du jeu visée (voir `references/construction.js`, `ANCIENS_NOMS`).

### 3. Les appuis : rien ne flotte
Lanternes, torches, bougies, crânes, plantes, nénuphars et neige doivent être **tenus** ; sinon, le premier bloc voisin qui bouge les fait tomber. Après chaque chantier, vérifier automatiquement chaque objet sensible :
- une lanterne sans support est suspendue au plafond par une chaîne, ou devient une torche murale ;
- une torche ou un crâne se fixe au mur voisin ;
- une bougie ou une plante sans appui est retirée ;
- un nénuphar exige de l'eau dessous.

Voir `verifierAppuis` dans `references/construction.js`.

### 4. L'orientation : tourné vers l'usage
Bedrock pose par défaut fours, pupitres, coffres et meubles dans un sens fixe, souvent face au mur. Règle automatique :
- les objets orientables se tournent vers **l'espace libre, dos au mur** ;
- les coffres neufs ouvrent du côté libre ;
- les tonneaux ont le couvercle en haut.

Préciser à la main ce qui a une cible : les bancs regardent la fontaine, une plaque de tombe regarde l'allée. Les **meubles sur mesure** (blocs à nous) ont une face avant au sud dans le modèle, et un état `cardinal_direction` qui tourne le modèle (rotation : sud 0, est 90, nord 180, ouest -90).

### 5. Poser un lieu sur le terrain réel
- **Trouver le sol** en ignorant arbres, plantes, neige, liquides et les blocs de barrière d'une plateforme d'attente (sinon le lieu se construit dans le ciel).
- **Aplanir l'emprise**, puis **raccorder en pente irrégulière** sur 12 à 14 blocs (taillé au-dessus, remblayé en dessous, de l'herbe sur la roche mise à nu) : jamais de falaise droite. Voir `references/relief.js`.
- Un grand lieu peut exiger un **terrain refait** : une forêt aplanie avec 0 à 2 blocs de bosses, pour qu'on puisse y suivre des traces.
- **Chemins taillés** : pente bornée (une marche d'un bloc au plus), remblai au-dessus de l'eau, dégagement au-dessus, talus de chaque côté. Voir `references/chemins.js`.
- **Nettoyer les restes d'arbres** après chaque dégagement : troncs et feuillages qui ne tiennent plus à rien. Voir `references/arbres.js`.

### 6. Sous terre : des cavernes, pas des pavés
- Une caverne bâtie par l'addon a sa **coque de roche** (5 blocs) : elle ne perce jamais une grotte naturelle (lave, eau, monstres du jeu).
- Toute salle ajoutée plus tard a **sa propre coque**.
- **Sculpter** ensuite les parois : voûte, bosses, alcôves, éboulis, stalactites, ravins aux bords irréguliers. Seuls les ouvrages (maisons, ponts, tunnels creusés par les habitants) restent droits. Garder libres les passages, arrivées, trésors et arènes. Voir `references/caverne.js`.

### 7. Construire par étapes
- Une **étape par tick** au plus (`construireDoucement`) : la machine du joueur reçoit les blocs peu à peu. *Écarté* : `system.runJob`, qui en fait plusieurs d'un coup.
- Un remplissage ne dépasse jamais **32 768 blocs**.
- Un remplissage refusé faute de terrain chargé est **mis en attente et rejoué**.
- Chaque chantier note ses blocs sensibles, puis vérifie appuis et orientation à la fin.

## Ce qu'on écrit dans docs/game-design/architecture.md et mobilier-decor.md (section « Réalisation dans l'addon »)

- les palettes ;
- pour chaque lieu : son emprise, son terrassement, ses blocs particuliers ;
- les règles d'appui et d'orientation ;
- les planches de rendu (dans `livrables/planches/`).

## Code de référence (dans `references/`)

Il vient du Domaine oublié et s'adapte à un nouveau projet (imports, noms) :
- `construction.js` : `poser`, `remplir`, anciens noms, sol, zones de chargement, orientation, appuis, chantiers une étape par tick, rejeu des blocs refusés ;
- `relief.js` : raccord en pente, aplanissement d'une zone ;
- `chemins.js` : chemins taillés ;
- `arbres.js` : nettoyage des restes d'arbres ;
- `caverne.js` : sculpture des cavernes, bruit déterministe.
