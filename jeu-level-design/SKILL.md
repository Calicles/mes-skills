---
name: "jeu-level-design"
description: "Mène l'interview de direction artistique des niveaux (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : ambiance et inspirations, taille, relief, chemins, repères, secrets), puis les conçoit. Concevoir le level design d'un jeu vidéo, d'un mod ou d'un addon : structure du monde (QG et régions), placement des lieux, guidage du joueur sans flèche permanente, densité de points d'intérêt, rythme tension/repos, verrous et clés, donjons salle par salle, frontières, secrets, allers-retours. À utiliser dès qu'on parle de carte, de monde, de zones, de donjon, de niveau, de chemin, de « où mettre ce lieu », de frontière, d'exploration ou de joueurs qui se perdent, même sans dire « level design ». Troisième métier de jeu-video-parcours."
---

# Level design

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Les règles de l'interview » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce métier** : sa fiche (emplacements, distances, profondeurs, chemins, plans) entre dans la porte 1 de la réalisation, avec le plan en planche. Ce skill ne passe jamais la main au code lui-même.

**Pour ce métier, la liste** : la génération du monde (profondeurs, biomes, grottes, structures du jeu comme les chambres de l'épreuve), les zones déjà générées et les nouvelles, la lumière et l'apparition des monstres, l'eau, la lave et la gravité, le Nether et l'End s'ils sont concernés.

## Pourquoi

Le level design dit **où** se joue le gameplay, et dans quel ordre le joueur le découvre. Un bon niveau guide sans tenir la main, alterne effort et répit, et ne laisse jamais le joueur perdu ni dans un endroit vide. Relire d'abord `docs/game-design/experience-joueur.md` et `docs/game-design/gameplay.md`.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La structure du monde**
1. **La forme du monde** : un QG avec des lieux autour, un monde ouvert, une suite de niveaux, des régions reliées par des passages ?
2. **La taille jouable totale**, et le **temps de trajet acceptable** entre deux lieux (en minutes ou en pas).
3. **Les régions** : combien, avec quel thème chacune ?
4. **Les passages** entre régions (portail, route, escalier, bateau…) : leur forme, et dans les deux sens ?

**B. L'ambiance de chaque région** (une région à la fois)
5. **De quelle ambiance s'inspirer ?** Proposer des références (un lieu réel, un film, un jeu, un tableau, un conte), et demander ce qu'on en prend.
6. **Ce que le joueur doit ressentir** en y arrivant, puis en l'explorant.
7. **L'heure, la lumière et la météo** (crépuscule figé, pleine lune, brume, pluie).
8. **Le paysage** :
   - le relief (plat, vallonné, montagneux, falaises, souterrain) ;
   - l'eau ;
   - la végétation (forêt sombre, prairie fleurie, champignons géants) ;
   - les couleurs dominantes.
9. **Les sons** de la région (vent, loups, cloches, eau).

**C. La taille et la forme de chaque lieu** (un lieu à la fois)
10. **Sa taille** : petit, moyen ou grand, en blocs ou en pas ; **le temps de visite** visé.
11. **Sa forme** : ouverte, en couloirs, en étages, en hauteur, sous terre, sur l'eau ?
12. **Ce qu'on voit en arrivant** : le point de vue, le repère qui attire l'œil.
13. **Sa place** sur la carte : direction et distance depuis le QG, à côté de quoi ?

**D. Le guidage**
14. **Les repères visibles de loin** (une tour, une fumée, une lumière, un phare) : lesquels ?
15. **Les chemins** : routes, sentiers, traces, panneaux, lanternes ; leur matière et leur largeur.
16. **L'aide** si on se perd (brume qui s'épaissit, retour doux, personnage) ?
17. **L'aide à l'écran** : ligne d'objectif, carte, rien ?

**E. La densité et le rythme**
18. **La distance entre deux points d'intérêt** (tous les 20 à 30 pas ?).
19. **Les petites découvertes** : de quelles sortes (camps, ruines, puits, autels, cachettes), combien, ce qu'elles contiennent.
20. **La courbe d'un chapitre** : calme, exploration, montée, pic, repos ; où placer les pics ?
21. **Les zones de repos** (camp, auberge, QG).

**F. Les verrous et les secrets**
22. **Comment s'ouvre la suite** : portes, sceaux, clés, ponts, énigmes ?
23. **Les secrets** : combien, quel type (recoin, passage caché, trésor), et pour qui (les curieux, les petits) ?

**G. Les donjons** (un donjon à la fois)
24. **Son inspiration** et son ressenti.
25. **La liste des salles** : thème, ressenti, ce qu'on y fait (combat, piège, énigme, trésor, indice). Valider une salle à la fois.
26. **L'ordre des salles**, les embranchements, les raccourcis de retour.
27. **Les créatures** par salle et leur nombre.
28. **Sa taille** : le nombre de salles, la durée de visite.

**H. Les limites du monde**
29. **Le bord du monde** : rien, une brume, un mur invisible, un relief naturel ?
30. **Ce qui se passe au bord**, et les **exceptions** (lieux qui le dépassent).

**I. La validation**
31. La **carte d'ensemble** (un plan dessiné : QG, régions, lieux, chemins, distances) puis le **plan de chaque donjon**, validés ensemble : « est-ce exactement le monde que tu veux ? »

### En évolution
Pour un nouveau lieu ou une nouvelle région, dérouler les blocs B, C, D (et G pour un donjon). Vérifier sa place sur la carte existante (distances, chevauchements).

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La structure du monde
Choisir la forme d'ensemble, en 2 ou 3 options avec une recommandation :
- **un QG** (la base, le domaine) au centre, que le joueur voit évoluer ;
- **des lieux de quête** autour, de plus en plus loin ;
- **des régions à part** pour les grands chapitres (un autre pays au-delà d'une brume, une cité sous terre), avec leur propre frontière et leur ambiance ;
- les **passages** entre les régions : portails, routes, escaliers. Ils marchent **dans les deux sens, pour toujours** (revenir au QG en pleine quête, revenir voir un lieu après la fin).

Si le monde est trop grand, c'est un frein : **regrouper** les lieux (une zone jouable bornée, des distances qui augmentent peu à peu).

### 2. La carte des lieux
Pour chaque lieu : sa position par rapport au QG (direction, distance), sa taille, son thème, ce qu'on y fait, son gardien éventuel. Vérifier les **écarts minimums** entre les lieux, pour qu'ils ne se chevauchent pas : lieux de quête, découvertes, personnages secondaires.

### 3. Le guidage
Du plus discret au plus explicite, en préférant le premier qui suffit :
1. **un repère visible de loin** : une tour, un phare, une fumée, une lumière, une arche (le « weenie » de Disney : ce qu'on aperçoit attire) ;
2. **le chemin lui-même** : une route, des traces de pattes, des panneaux, des lanternes ;
3. **un personnage qui en parle** (« un chevalier campe au nord-ouest… ») ;
4. **une ligne d'objectif** discrète, avec la direction et la distance ;
5. *en dernier recours* : une flèche ou un fil lumineux, souvent jugé « trop visuel ».

Si on peut se perdre, prévoir une **aide douce** : la brume qui s'épaissit loin des traces, puis un retour à la dernière trace.

### 4. La densité : jamais d'effet vide
- En extérieur, **quelque chose à voir ou à faire tous les 20 à 30 pas** : petites découvertes (camp abandonné, puits, autel, cachette à creuser), ruines, épouvantails, roulottes.
- Dans un donjon, **chaque salle a un thème et au moins une chose à faire** : combat, piège, énigme, trésor ou indice. Les couloirs sont courts et décorés.
- Des découvertes placées de façon **reproductible** (toujours au même endroit pour un monde donné) et comptées dans le carnet.

### 5. Le rythme
Alterner, en suivant la courbe d'un chapitre : **calme** (QG, camp) → **exploration** → **montée** (créatures, énigmes) → **pic** (gardien) → **repos et fête**. Une salle de répit après chaque pic. Ne jamais enchaîner deux pics sans souffle.

### 6. Verrous et clés
Ce qui empêche d'aller trop loin trop tôt, **lisiblement** : une porte à trois sceaux, une grille qui se lève, un étage qui s'ouvre avec la braise du précédent, un pont de lumière à activer. *Écarter* les zones toutes ouvertes d'emblée quand le groupe risque de s'éparpiller.

### 7. Les donjons
Les découper en **salles à thème** (inspirées d'une référence si possible), en ailes à construire au fur et à mesure, avec :
- une entrée marquante ;
- des salles enchaînées par une logique simple ;
- les créatures posées **à l'entrée du groupe**, salle par salle, et qui ne reviennent pas ;
- un raccourci de retour une fois le gardien vaincu.

### 8. Les frontières
Une frontière **douce** : un brouillard qui s'épaissit, un message, puis un mur invisible qui ramène à l'intérieur. **Les exceptions** : tout lieu construit au-delà d'une limite (une grotte creusée dans la roche d'une caverne) doit être **déclaré**. Sinon, la frontière ramène le joueur à l'entrée dès qu'il y entre.

### 9. Les secrets
Quelques récompenses hors du chemin pour les curieux : un recoin, un trésor caché, un raccourci. Jamais indispensables à la quête.

## Ce qu'on écrit dans docs/game-design/level-design.md

Le fichier `docs/game-design/level-design.md` (« Game design — Level design » :
- la structure du monde et les passages ;
- la carte des lieux (positions, tailles, écarts) ;
- le guidage retenu ;
- la densité ;
- la courbe de rythme par chapitre ;
- les verrous et clés ;
- le plan de chaque donjon, salle par salle ;
- les frontières et leurs exceptions ;
- les secrets ;
- les critères à vérifier en jeu (« personne ne se perd », « aucun lieu vide », « les passages marchent dans les deux sens »).

## Pièges vus en vrai

- Un lieu ajouté sans le déclarer aux autres systèmes : les découvertes peuvent tomber dessus, la frontière peut renvoyer le joueur à l'entrée. Chaque nouveau lieu se déclare **partout** où des positions sont vérifiées.
- Agrandir le QG décale tout ce qui est autour : arche, mine, ruines, découvertes. Revoir toutes les distances d'un coup.
- Une région chargée trop loin ou trop grande d'un coup fige le jeu : la construire **par morceaux, à l'approche** (voir le lot Minecraft pour la technique).

## Exemple (Le Domaine oublié)

Le domaine au centre, entouré d'une muraille ; la ruine du nord, le moulin et la mine de plus en plus loin, dans une zone de 300 × 300. La Barovie, au-delà des Brumes : un camp au sud, une route vers le château au nord, la forêt des loups à l'ouest, le marais à l'est, le cimetière collé au château. La cité naine sous terre : un étage par braise (cristal, champignons, lave).
