---
name: mc-ambiance
description: "Mène l'interview d'ambiance (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : brumes, lumière, musique, sons, titres, recettes de transition), ne code qu'après fiche validée. Réaliser l'ambiance et les transitions d'un addon Minecraft Bedrock : brumes par zone (fichiers fogs et commande /fog), heure figée et nuit de pleine lune, musique par lieu avec les morceaux du jeu (world.playMusic, une seule musique pour un écran partagé), sons, particules, titres et sous-titres, écran noir (camera fade), ligne d'objectif, textes lisibles sur un quart d'écran. À utiliser dès qu'on règle l'atmosphère d'un lieu, une mise en scène (arrivée, fête, apparition), la musique, la météo, la lumière ou la lisibilité des textes dans un addon, même sans dire « ambiance ». Spécialise jeu-experience-joueur."
---

# Ambiance (Minecraft Bedrock)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill, la porte 1 contient** : chaque brume (couleur, épaisseur), lumière, musique et son par lieu ou par moment, chaque titre et sous-titre, chaque mise en scène racontée seconde par seconde, avec des captures ou références quand c'est possible.

**Pour ce skill, la liste** : les sons du jeu pour chaque matière (métal, pierre, bois, verre), la musique du jeu par lieu, les particules et effets connus (éclat d'enchantement, fumée, étincelles), la lisibilité des messages à l'endroit où le jeu les affiche d'habitude.

**Pour ce skill** : brumes, lumières et textes sont jugés sur l'écran réel des joueurs (vidéoprojecteur, écran partagé) : proposer un essai rapide plutôt qu'une description.

## Pourquoi

L'expérience voulue au lot 1 (`jeu-experience-joueur` : émotions, ton, transitions, fiches d'ambiance) passe ici par les outils du jeu. Ils ont des limites précises sur une Switch en écran partagé :
- un seul haut-parleur pour quatre joueurs ;
- un quart d'écran pour lire ;
- des commandes qui demandent les triches.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc (pour chaque zone)

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La brume**
1. **Une brume ou non** ; sa **couleur** (gris, violet, vert, bleu), sa **densité** et la **distance de vue** (on voit loin, ou les lieux sortent de la brume) ?

**B. L'heure et le ciel**
2. **L'heure** : cycle normal, heure figée (crépuscule, nuit de pleine lune, aube), différente par zone ?
3. **Les monstres ordinaires** la nuit : oui, ou coupés pour garder le frisson sans l'angoisse ?
4. **La météo** : pluie, orage, tonnerre au loin, neige ?

**C. La musique**
5. **Quelle musique** parmi celles du jeu (en donner le nom et l'ambiance : prairie, forêt, marais, grottes luxuriantes, basalte, combat du dragon…) ; en continu ou avec des silences ?
6. **La musique de combat** pour les gardiens : oui ou non ?
7. **Un seul haut-parleur** : quelle musique quand les joueurs sont dans des zones différentes ?

**D. Les sons et la vie**
8. **Les sons d'ambiance** : vent, cloches, loups, eau, orgue au loin ; à quelle fréquence ?
9. **Les créatures d'ambiance** : corbeaux, chauves-souris, lucioles ; combien ?
10. **Les particules** : étincelles, fumée, feuilles, braises ; où et combien ?

**E. Les textes à l'écran**
11. **Le style des titres** : couleur, longueur, sous-titre ; quels moments méritent un grand titre ?
12. **Les messages** : couleur des noms, longueur, ton.

**F. Les transitions** (chacune validée au lot 1)
13. **La recette** de chaque transition, proposée puis validée : ordre des sons, titres, effets, apparitions, et leur durée.

**G. La validation**
14. La **fiche d'ambiance** de chaque zone et les recettes des transitions : « est-ce exactement l'atmosphère que tu veux ? »

### En évolution
Pour une demande d'ambiance (« une brume bleue dans le cimetière », « pas de pleine lune ? »), proposer 2 ou 3 réglages avec ce qu'ils changent à l'écran, et laisser choisir.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La brume par zone
- Un fichier par ambiance dans le pack de ressources (`fogs/brume_<zone>.json`) : couleur, distance de début et de fin, et distance de vue dans l'eau.
- Elle est posée **par joueur** avec `/fog @s push <brume> <nom>` à l'entrée de la zone et retirée à la sortie (`/fog @s remove <nom>`). Demande les triches.
- Une brume **différente par lieu** : grise en Barovie, verdâtre au marais, bleutée sous la lune, bleue au cimetière. Elle laisse voir à environ 70 blocs : les lieux « sortent de la brume » quand on approche, et les repères de guidage doivent être plus près.

### 2. L'heure et la nuit
- L'heure est **commune à tout le monde**. Une heure figée (crépuscule) s'applique quand le groupe est dans la région, et l'heure d'avant est rendue au retour.
- **Une nuit sans monstres ordinaires** : couper `doMobSpawning` le temps de la nuit voulue, puis le rétablir. Garder la trace dans l'état, pour le rétablir même après un redémarrage.
- La texture de la lune peut être remplacée (`textures/environment/moon_phases.png`) pour une **pleine lune** permanente.
- **Démarrer l'ambiance dès que la région existe**, pas seulement quand on y entre par le passage prévu : un saut de test y arrive autrement.

### 3. La musique
- Des **morceaux déjà dans Minecraft** (`world.playMusic(piste, { loop, fade, volume })`) : prairie, forêt, marais, grottes luxuriantes, deltas de basalte, combat du dragon… Aucun fichier à ajouter.
- **Une seule musique pour le groupe** (un haut-parleur) : celle du lieu où sont **la plupart** des joueurs ; à égalité, le lieu prioritaire ; **le combat d'abord** (un gardien éveillé). Ne la changer qu'après deux relevés identiques, pour éviter le va-et-vient au bord d'une zone.
- **Des silences** au QG : un morceau à l'arrivée, puis la musique normale du jeu.
- Voir `references/musique.js` et `references/musique_donnees.js`.
- À vérifier en jeu : le nom exact des familles de musiques (un nom inconnu donne un silence) et le volume « Musique » de la console.

### 4. Les sons et les particules
- Sons du jeu (`playSound`) aux moments clés : fanfare (`random.levelup`), feux d'artifice, cloche qui monte quand des runes s'allument, grondement, tonnerre au loin à intervalles irréguliers.
- **Particules** pour signaler et émerveiller : étincelles d'un geste magique, éclair bleu d'une arrivée, fumée d'une cheminée. Toujours **autour des joueurs**, quelques-unes à la fois.
- **Vie ambiante** : chauves-souris, corbeaux, lucioles, en nombre plafonné.

### 5. Les titres et les messages
- Un **grand titre** (`onScreenDisplay.setTitle`) pour les vrais moments : arrivée, quête accomplie, fin de chapitre. Jamais deux en même temps : **retarder** le second.
- **Couper les lignes** pour un quart d'écran : environ 16 caractères pour un titre, 26 pour le reste.
- Les **messages** dans la discussion : une idée, deux lignes au plus, avec la couleur du nom de qui parle.
- Une **ligne d'objectif** discrète (au-dessus de la barre d'objets, `setActionBar`) avec la direction et la distance. Le reste va dans un carnet.

### 6. L'écran noir et les attentes
`/camera @s fade` (entretenu tant qu'on attend), déplacements bloqués, une plateforme à l'abri. Les titres doivent rester lisibles par-dessus. C'est l'écran d'attente de `mc-monde-et-chargement`.

### 7. Les transitions, en pratique
Pour chaque transition validée au lot 1, écrire sa **recette** : ordre des sons, des titres, des particules, des apparitions, et leurs délais en ticks. Exemples :
- l'apparition d'un PNJ : un éclair, son nom en titre, une réplique ;
- l'arrivée d'une roulotte au lever du jour ;
- un portail dont les runes s'allument une à une ;
- le début d'un événement (une invasion annoncée par un ciel qui s'assombrit, un cor au loin, puis un titre) et son retour au calme.

## Ce qu'on écrit dans docs/game-design/experience-joueur.md (section « Réalisation dans l'addon »)

Par zone :
- la brume ;
- l'heure ;
- la musique (et sa priorité) ;
- les sons ;
- les créatures d'ambiance.

Pour chaque transition, sa recette. Et les points « non vérifiés en jeu » : brume sur la Switch, noms des musiques, fondu de caméra.

## Code de référence (dans `references/`)

- `musique.js` : choisir la musique du groupe et la jouer ;
- `musique_donnees.js` : les morceaux par lieu ;
- `brume_marais.json` : un fichier de brume.
