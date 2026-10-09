---
name: jeu-mobilier-decor
description: "Mène l'interview de direction artistique du mobilier et du décor (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : ressenti, inspirations, matières, couleurs, détails qui racontent), puis les conçoit. Concevoir le mobilier et le décor d'un jeu vidéo, d'un mod ou d'un addon : décor complet par pièce, objets tournés vers leur usage, densité de détails, cohérence avec le thème et l'habitant, objets interactifs ou décoratifs, meubles sur mesure, salles des trophées, décor qui évolue au fil de l'aventure. À utiliser dès qu'on parle de meubles, de décoration, d'aménagement d'une pièce, d'objets à poser, de props, de « rendre un lieu vivant » ou d'une salle trop vide, même sans dire « mobilier ». Sixième et dernier métier de jeu-video-parcours."
---

# Mobilier et décor

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce métier** : la planche de chaque pièce et de chaque meuble sur mesure entre dans la porte 1 de la réalisation. Ce skill ne passe jamais la main au code lui-même.

**Pour ce métier, la liste** : pour chaque meuble, son équivalent dans le jeu (coffre, tonneau, établi, chaise en escalier) et ce qu'il fait comme lui (s'ouvrir, stocker, s'asseoir, éclairer), sa recette, ce qu'il donne quand on le casse, son orientation à la pose, son son, sa place dans l'inventaire créatif.

**Pour ce métier** : la planche d'un meuble le montre dans sa pièce, à côté des meubles du jeu, et dans l'inventaire.

## Pourquoi

Le mobilier est la couche qui rend un lieu **vivant et crédible**. Une pièce sans meubles paraît inachevée ; une pièce surchargée devient illisible. Chaque objet doit être **à sa place, tourné du bon côté, et dire quelque chose** sur le lieu. Relire d'abord `docs/game-design/architecture.md` et `personnages.md`.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc (pour chaque pièce ou lieu)

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. Le ressenti de la pièce**
1. **Sa fonction** (cuisine, laboratoire, salle d'armes, bibliothèque, chambre, salle du trône…).
2. **Ce qu'elle doit faire ressentir** : chaleureuse, inquiétante, magique, majestueuse, en désordre ?
3. **De quoi s'inspirer** : un film, un tableau, un jeu, une pièce réelle. Ce qu'on en prend.

**B. Le contenu**
4. **Les meubles indispensables** qui disent la fonction.
5. **Les objets qui racontent l'habitant** : ses outils, ses collections, ses manies.
6. **Les petits détails** : bougies, tapis, toiles d'araignée, vaisselle, plantes, livres.
7. **La densité** : épurée, garnie, encombrée ?

**C. Les matières, les couleurs, la lumière**
8. **Les matières** : bois clair ou sombre, métal, pierre, tissu.
9. **Les couleurs** : dominante, accent.
10. **Les sources de lumière** : foyer, lanternes, bougies, cristaux, fenêtres ; ambiance chaude ou froide ?
11. **La propreté et l'usure** : neuve, vécue, poussiéreuse, abandonnée ?

**D. L'interaction**
12. **Les objets interactifs** (coffre, levier, pupitre, chaudron, établi) : lesquels, et que font-ils ?
13. **Les objets de quête** ou les indices cachés dans le décor.
14. **Les meubles sur mesure** à créer (ceux que le jeu n'a pas) : forme, couleurs, et comment le joueur peut les obtenir.

**E. L'évolution**
15. **La pièce change-t-elle** au fil de l'aventure (ruine puis meublée, trophées qui s'allument, saisons) ?

**F. Les abords**
16. **Le décor extérieur** : potager, séchoir, cible, charrette, bancs, lanternes sur poteaux ?

**G. La validation**
17. Une **planche** de la pièce (vue d'ensemble, quelques détails) : que changer ?
18. La **liste complète** du mobilier : « est-ce exactement la pièce que tu veux ? »

### En évolution
Pour une pièce ajoutée ou retouchée, dérouler les blocs touchés, en gardant la cohérence avec l'architecture et l'habitant.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La fonction de la pièce
Une ligne : cuisine, laboratoire d'alchimie, salle d'armes, bibliothèque, chambre, atelier, salle du trône. La fonction dicte les **meubles indispensables** (une cuisine : foyer, rôtisserie, table, tonneaux, garde-manger).

### 2. Les trois couches
1. **Les meubles principaux** qui définissent la fonction : on doit deviner la pièce en un coup d'œil.
2. **Le décor secondaire** qui raconte l'habitant : outils, livres, fioles, trophées, portraits.
3. **Les petits détails** : bougies, toiles d'araignée, tapis, plantes, sacs, vaisselle.

Viser l'équilibre : pas de mur nu, mais de la place pour circuler à plusieurs et pour combattre si la pièce l'exige.

### 3. L'orientation et l'appui
- Chaque meuble est **tourné vers son usage** : vers la pièce, jamais vers le mur. Les bancs regardent la fontaine, le pupitre fait face à qui lit, le four s'ouvre côté cuisine, les coffres s'ouvrent du côté libre.
- Chaque objet qui doit être **tenu** l'est : une lanterne posée ou suspendue à une chaîne, une torche contre un mur, une bougie sur un support. Rien ne flotte.
- Pas d'objet qui en **bouche** un autre (du foin devant un râtelier).

### 4. Interactif ou décoratif
Pour chaque objet, décider : **décor seul**, **interactif** (coffre, levier, pupitre, chaudron) ou **lié à une quête** (un objet à trouver, un indice). Un objet interactif doit se **distinguer** (lumière, position, panneau) ; un objet décoratif ne doit pas faire croire à une énigme.

### 5. Les meubles sur mesure
Quand le jeu d'origine n'a pas l'objet voulu (rôtisserie, alambic, râtelier, mannequin, étagère à fioles), le concevoir comme un personnage miniature : **silhouette** lisible, **couleur** qui ne se confond pas, **face avant** définie, et dire comment le joueur peut l'obtenir (récompense, fabrication).

### 6. Le décor qui évolue
Le décor peut **raconter la progression** :
- une pièce en ruine, puis restaurée et meublée ;
- une salle des trophées dont les socles s'allument un à un ;
- un jardin qui pousse, une fontaine qui se remet à couler ;
- des embellissements débloqués par les grandes étapes.

### 7. Le décor extérieur
Les abords racontent aussi : potager, enclos, séchoir, cible d'entraînement, charrette, panneaux, lanternes sur poteaux, bancs. Ils servent aussi la **densité** du level design.

## Ce qu'on écrit dans docs/game-design/mobilier-decor.md

Le fichier `docs/game-design/mobilier-decor.md` (« Game design — Mobilier et décor » :
- pour chaque pièce, sa fonction et ses trois couches ;
- les objets interactifs ;
- les meubles sur mesure (fiche et planche) ;
- le décor qui évolue ;
- les critères à vérifier en jeu (« chaque objet tourné vers son usage », « rien ne flotte », « aucune pièce nue »).

## Pièges vus en vrai

- Des meubles tournés vers le mur, des coffres qui s'ouvrent contre une paroi : prévoir une **règle automatique** (tourner vers l'espace libre) et la vérifier.
- Des lanternes et des bougies qui flottent, des plantes posées sur de la pierre : vérifier les **appuis** de chaque objet après la construction.
- Des bancs mal orientés autour d'une place : préciser la cible de chaque assise (la fontaine).

## Exemple (Le Domaine oublié)

La salle d'armes : meubles principaux, râteliers, mannequins, enclume, support d'armure ; décor secondaire, bottes de foin d'entraînement (placées pour ne pas boucher les râteliers), bannière au blason ; dehors, quand elle est restaurée, un terrain d'entraînement avec des cibles. La salle des trophées : huit socles vides (« Une victoire à venir… ») qui s'allument chacun après sa victoire.
