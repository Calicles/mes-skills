---
name: jeu-architecture
description: "Mène l'interview de direction artistique des bâtiments (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : ressenti, inspirations, style, matériaux, couleurs, taille, intérieur), puis les conçoit. Concevoir les bâtiments et grands lieux construits d'un jeu vidéo, d'un mod ou d'un addon : fonction, silhouette visible de loin, style (médiéval, gothique, nain, féérique…), échelle par rapport au joueur, intérieur et extérieur, entrées, éclairage, ruine puis restauration, bâtiment qui raconte une histoire. À utiliser dès qu'on parle de bâtiment, maison, château, tour, cabane, ruine, demeure, village, cité, donjon à construire ou à restaurer, façade ou toit, même sans dire « architecture ». Cinquième métier de jeu-video-parcours."
---

# Architecture

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce métier** : la planche de chaque bâtiment (silhouette, façade, matériaux) entre dans la porte 1 de la réalisation. Ce skill ne passe jamais la main au code lui-même.

**Pour ce métier, la liste** : les blocs utilitaires attendus (portes, lits, établis, fours, coffres, enclume, table d'enchantement), la lumière qui empêche les monstres d'apparaître, les blocs qu'on peut casser ou non, l'eau et le feu, ce qui se passe si un joueur mine un mur.

**Pour ce métier** : la planche d'un bâtiment le montre posé dans son paysage réel, à côté du domaine et de la taille d'un joueur.

## Pourquoi

Un bâtiment de jeu n'est pas un plan d'architecte : c'est un **décor qui sert le jeu**. Il doit se reconnaître de loin, guider le joueur, raconter qui y vit, et laisser jouer à l'intérieur (circuler à plusieurs, combattre, interagir). Relire d'abord `docs/game-design/experience-joueur.md`, `level-design.md` et `personnages.md`.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc (pour chaque bâtiment ou lieu construit)

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La fonction et l'histoire**
1. **Sa fonction** dans le jeu : QG, pièce à restaurer, maison d'un personnage, donjon, repère, lieu de quête ?
2. **Qui y vit ou y a vécu**, et son histoire en deux phrases.
3. **Ce que le bâtiment doit faire ressentir** de loin, en approchant, puis en entrant.

**B. Les inspirations**
4. **De quoi s'inspirer** ? Proposer des références : architecture réelle (château cathare, chaumière normande, cabane sur pilotis), films, dessins animés, jeux, illustrations. Ce qu'on prend de chacune.
5. **L'époque et la culture** : médiéval, gothique, nain, elfique, féerique, Halloween ?
6. **Ce qu'on évite** : trop moderne, trop sombre, trop banal, trop proche d'un autre lieu du jeu.

**C. La silhouette et la taille**
7. **Sa taille** : par rapport au joueur, nombre d'étages, emprise au sol.
8. **Sa forme générale** : tour, bâtiment long, groupe de bâtiments, forme tordue ou droite.
9. **Son toit** : pointu, plat, en chaume, en tonneau, crénelé, effondré ?
10. **Son élément signature**, reconnaissable de loin : une tour, une cheminée qui fume, un phare, un dôme.
11. **Sa position** sur le terrain : perchée, encaissée, sur l'eau, dans les arbres, sous terre ?

**D. Les matières et les couleurs**
12. **Les matériaux principaux** (murs) et **secondaires** (poutres, angles, bases).
13. **Les couleurs** : dominante, secondaire, accent.
14. **L'usure** : neuf, ancien, abîmé, en ruine ; mousse, lierre, fissures ?
15. **Les détails décoratifs** : bannières, vitraux, sculptures, enseignes, lanternes.

**E. L'intérieur**
16. **Les pièces** : combien, lesquelles, dans quel ordre on les traverse.
17. **Les volumes** : hauteur sous plafond, largeur des passages (on circule à combien ?).
18. **La lumière intérieure** : chaude, froide, magique ; fenêtres, lustres, braseros.

**F. Les abords**
19. **Ce qui l'entoure** : cour, jardin, potager, enclos, quai, cimetière, chemin d'accès, clôture.

**G. L'évolution**
20. **Ruine, construction, restauration** : passe-t-il par ces états ? À quoi ressemble chaque état ?
21. **La mise en scène de la construction** : couche par couche, d'un coup, cachée puis révélée ?
22. **Les embellissements** au fil de l'aventure.

**H. La validation**
23. Une **planche** (vue de face, de côté, plan au sol) : que changer ?
24. La **fiche complète** : « est-ce exactement le bâtiment que tu veux ? »

### En évolution
Pour une retouche (« les roulottes ne sont pas réalistes »), commencer par les blocs touchés (souvent B, C, D), puis demander si le reste change aussi.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La fiche du bâtiment
- **Fonction dans le jeu** : QG, pièce à restaurer, maison d'un PNJ, donjon, repère, lieu de quête.
- **Qui y vit ou y a vécu**, et ce que le bâtiment doit en dire (une sorcière : désordre, fioles, chaudron ; un chasseur : trophées, séchoir à peaux).
- **Où** il est (voir level design), et ce qu'on voit en arrivant.

### 2. La silhouette
- **Visible et reconnaissable de loin** : une tour, un toit pointu, une cheminée qui fume, un phare, une forêt de tours tordues. La silhouette sert de repère pour le guidage.
- **Une forme par fonction** : la tour de l'alchimiste n'a pas la silhouette de l'écurie.
- **Une inspiration nommée** quand c'est possible (un dessin animé, un film, un jeu), validée par la personne, pour que tout le monde parte de la même image.

### 3. Le style
Choisir et noter les **matériaux dominants**, les **couleurs**, les **formes de toit et d'ouvertures**, le **degré d'usure**. Garder **un style par région** (domaine médiéval, château gothique, cité naine), et une palette commune pour qu'un ensemble de bâtiments reste cohérent.

### 4. L'échelle
Penser à la taille du personnage joueur, et au **nombre de joueurs** :
- portes et couloirs assez larges pour passer à plusieurs (3 de large dans un donjon) ;
- plafonds assez hauts pour un combat et pour un grand personnage ;
- les salles de gardien sont spacieuses, les recoins d'exploration intimes.

### 5. L'intérieur
Chaque pièce a une **fonction** et un **décor complet** (voir mobilier). Une circulation lisible : on comprend où aller. Les entrées et sorties sont visibles. **Rien de nu** : pas de grande salle vide.

### 6. L'éclairage
Lumière **dedans et dehors**, au service de l'ambiance : chaleur d'un foyer, lanternes suspendues, cristaux qui brillent, vitraux. Éclairer suffit aussi à empêcher les monstres d'apparaître là où on ne les veut pas.

### 7. Ruine, construction, restauration
Un ressort très fort : **voir un lieu revivre**.
- L'état **ruine** : murs écroulés, végétation, panneau « Ici était… », de quoi deviner ce que ce sera.
- La **construction** mise en scène : couche par couche, en peu de temps, visible de tous.
- L'état **restauré**, puis des **embellissements** qui arrivent au fil de l'aventure (le jardin, la fontaine qui coule, les bannières).

### 8. Raconter par le bâtiment
Quelques détails narratifs par lieu : une épitaphe, un portrait qui ne regarde pas comme les autres, des traces de griffes, une table encore mise. C'est aussi là que se cachent les indices des énigmes.

## Ce qu'on écrit dans docs/game-design/architecture.md

Le fichier `docs/game-design/architecture.md` (« Game design — Architecture » :
- une fiche par bâtiment (fonction, habitant, silhouette, inspiration, style, dimensions, pièces) ;
- la palette par région ;
- les états ruine, construction et restauration ;
- les détails narratifs ;
- les critères à vérifier en jeu (« reconnaissable de loin », « on circule à quatre », « aucune salle vide »).

## Pièges vus en vrai

- Un bâtiment posé sur un terrain réel accidenté (falaise, rivière) ne ressemble pas au plan : prévoir un **terrassement** (aplanir, combler) autour.
- Agrandir le QG après coup oblige à redéplacer tout ce qui l'entoure : fixer tôt l'emprise, avec de la marge.
- Une pièce « à l'étage d'une pièce existante » doit respecter ce qui est dessous (escalier, plancher, trémie) : la concevoir avec la pièce porteuse.

## Exemple (Le Domaine oublié)

La cabane de Mère Crapotte : fonction, la maison d'une sorcière qui donne des quêtes secondaires ; silhouette, une cabane sur pilotis au milieu d'une mare, toit pointu, cheminée moussue aux flammes bleues ; intérieur, chaudron plein, alambic, étagère à fioles, crâne ; abords, ponton et marches, nénuphars (qui servent aussi la quête), roseaux.
