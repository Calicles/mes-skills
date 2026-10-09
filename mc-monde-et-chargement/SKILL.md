---
name: "mc-monde-et-chargement"
description: "Mène l'interview du monde (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : graine, emplacement, attentes, écrans de chargement), ne code qu'après fiche validée. Concevoir et fiabiliser le monde d'un addon Minecraft Bedrock : graine fixe, emplacement des régions (domaine, régions lointaines, cavernes sous terre), choix du terrain et des biomes, terrain réel et aplanissement, zones de chargement (tickingarea), distance de simulation, construction des lieux d'avance ou à l'approche, écran d'attente pendant la préparation, blocs refusés faute de terrain chargé, frontières et leurs exceptions, temps de chargement et fluidité à quatre joueurs sur Switch. À utiliser dès qu'on place un lieu ou une région, qu'un lieu ne se construit pas, se construit dans le ciel ou à moitié, qu'une zone met du temps à charger, qu'un monde neuf diffère du monde de test, ou qu'on parle de performance, de lag ou de création du monde, même sans dire « chargement ». Spécialise jeu-level-design."
---

# Monde et chargement (Minecraft Bedrock)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Les règles de l'interview » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill, la porte 1 contient** : chaque emplacement et sa distance au domaine, les profondeurs, les biomes, les zones touchées ou laissées intactes, les écrans d'attente et leurs textes, avec un plan en planche. Aucune génération ni construction n'est codée avant le « je valide ».

**Pour ce skill, la liste** : les profondeurs et les biomes du jeu, les structures du jeu (grottes, chambres de l'épreuve, villages), les zones déjà générées (une génération du jeu ne repasse jamais dessus) et les nouvelles, la lumière et l'apparition des monstres.

## Pourquoi

C'est là que la simulation et le jeu divergent le plus. Le serveur ne garde chargé que ce qui est **proche des joueurs**. Il **génère le terrain au fil de l'eau**, charge les créatures **après** le terrain, et envoie tout à la Switch avec retard. Un lieu peut donc :
- ne jamais se construire, parce que ses coins ne sont jamais chargés ;
- se construire à moitié, avec des blocs refusés ;
- se construire dans le ciel, sur le mauvais sol ;
- se poser sur un terrain qui casse l'immersion : banquise, montagne, mer.

Ce skill traduit le plan du monde (`jeu-level-design`) en positions réelles, et rend la construction prévisible.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La carte**
1. **La graine** : une carte connue à reprendre, une graine choisie pour un paysage (proposer d'en essayer), ou au hasard ?
2. **Le QG** : au point d'apparition, ou dans un lieu choisi (une plaine, un vallon, un bord de lac) ?
3. **Le paysage autour du QG** souhaité (forêt, prairie, cerisiers, montagnes au loin, mer) ?

**B. Les régions** (une région à la fois)
4. **Où** : à côté du QG, ou loin (une autre contrée qu'on rejoint par un passage) ?
5. **Le biome voulu**, avec une référence (forêt sombre, marais, montagne, désert) ; et les **biomes interdits** (neige, océan…).
6. **Le terrain** : garder le relief naturel, l'adoucir, ou le refaire entièrement (une forêt plate pour suivre des traces, un château perché pour être vu de loin) ?
7. **La taille** de la région et de chaque lieu, en blocs.
8. **Sous terre** : des cavernes bâties (contrôlées) ou les grottes naturelles du jeu ?

**C. La construction et l'attente**
9. **Quand les lieux se construisent** :
   - **toute la région d'avance**, derrière un écran d'attente, à la première arrivée ;
   - ou **à l'approche**, sous les yeux des joueurs ?
10. **Le temps d'attente acceptable** (quelques secondes, une minute, trois minutes si tout est parfait ensuite) ?
11. **L'écran d'attente** : noir avec texte, phrases drôles, page d'histoire, salle d'attente réelle ?
12. **Ce qui reste une surprise** de l'histoire (une porte qui s'ouvre, un tunnel qui se creuse), même si le lieu est construit d'avance.

**D. Les limites**
13. **Le bord du monde** : rien, une brume, un mur invisible ?
14. **Le bord d'une région à part** : brume qui ramène, roche qui ramène l'égaré, rien ?

**E. La fluidité**
15. **Le nombre de créatures** acceptable à la fois (à quatre sur la console visée).
16. **Les effets** : nombre de particules, de lumières, de créatures d'ambiance (lucioles…) ?
17. **La priorité** si un compromis s'impose : la beauté des lieux, le nombre de créatures, ou le temps de chargement ?

**F. La validation**
18. Un **plan** des régions et de leurs lieux (positions, tailles), la stratégie de construction et l'expérience d'attente décrite pas à pas : « est-ce exactement ainsi que tu veux découvrir le monde ? »

### En évolution
Quand un test révèle un problème de monde (lieu dans le ciel, banquise, attente trop longue, lieu à moitié construit), présenter **le constat, la cause et 2 ou 3 corrections** possibles avec leur effet sur l'expérience, puis laisser choisir.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La graine et le monde de référence
- **Fixer la graine** et la garder dans un seul fichier (`graine.txt`), lu par le serveur de test et par la fabrication du monde du Realm. Même graine partout, même carte partout.
- Le domaine se construit **autour du point d'apparition**, fixé par la graine.
- Vérifier au démarrage que la graine est bien appliquée (l'écrire dans la console). Un fichier de réglages du serveur abîmé ou mal écrit (fins de ligne, fichier géant) fait prendre une graine au hasard **sans erreur visible**.

### 2. Placer les régions
- **Le QG** autour du point d'apparition ; les lieux de quête de plus en plus loin, à des écarts minimums.
- **Les régions à part** (un autre pays, une cité sous terre) **loin** du QG (des milliers de blocs), pour qu'elles n'interfèrent pas. On y va par un passage (portail), et on en revient par le même.
- **Le terrain d'une région en surface** : il faut un biome cohérent (une forêt sombre pour un pays gothique ; jamais de neige si le sol doit garder des traces).
  1. Écrire une **recherche** qui lit le biome en quelques points autour de candidats éloignés.
  2. Une fois un bon emplacement trouvé, l'**écrire en dur** (`fixe: [x, z]`) : plus de recherche, plus de surprise.
- **Sous terre** : une région **bâtie entièrement par l'addon** (coque de roche, plafond, lumières) à une hauteur fixe, plutôt que des grottes naturelles imprévisibles.

### 3. Le terrain réel
Tout lieu s'adapte au terrain (voir `mc-design-en-blocs`) :
- trouver le sol en ignorant arbres, neige et barrières ;
- aplanir l'emprise et raccorder en pente ;
- tailler les chemins ;
- nettoyer les restes d'arbres.

Un lieu où l'on doit **suivre quelque chose au sol** (des traces) a besoin d'un terrain refait **presque plat**.

### 4. Charger avant de construire
- **Distance de simulation** : 4 tronçons par défaut (environ 60 blocs, en cercle) autour des joueurs. Un lieu plus grand en déborde, et ses coins ne se chargent jamais.
- **Zone de chargement** (`tickingarea`, triches nécessaires) :
  - elle couvre toute l'emprise du lieu, **plus ses marges** : le raccord en pente, les entrées de tunnel creusées un bloc au-delà de la coque ;
  - elle est posée le temps de la construction, puis retirée ;
  - limites : 100 tronçons par zone, **10 zones** à la fois ;
  - **un nom différent à chaque fois** : une zone retirée puis recréée sous le même nom dans la même seconde est refusée, et le terrain ne charge jamais.
- **Vérifier qu'un point est chargé** avant d'y poser des blocs (`getBlock` qui ne rend rien, ou une erreur). Un tronçon chargé mais **pas encore actif** fait aussi échouer une lecture : passer, et réessayer.
- **Filet de sécurité** : un remplissage refusé faute de terrain chargé est mis en attente, sa zone est chargée, et il est rejoué dès que possible (quelques minutes au plus).

### 5. Construire d'avance ou à l'approche
Deux stratégies, à proposer en choix (c'est une transition vécue par les joueurs) :
- **À l'approche** : chaque lieu se construit quand un joueur arrive à 40 à 70 blocs. Pas d'attente au départ, mais les joueurs voient parfois le lieu se bâtir, et les attentes sont imprévisibles.
- **Toute la région d'un coup, derrière un écran d'attente** : à la première arrivée dans une région, tous ses lieux se préparent, puis on révèle. C'est le choix retenu pour le Domaine oublié : l'immersion avant tout, 1 à 3 minutes acceptées.
  - Écran noir entretenu (fondu de caméra), joueurs immobiles sur une plateforme invisible très haut au-dessus de la région, avec des phrases drôles et une page d'histoire.
  - Une **présence** (un faux joueur, qui ne compte que pour construire) est posée tour à tour sur chaque lieu, avec sa zone de chargement.
  - Les lieux d'une même étape se préparent **en même temps** : 6 zones au plus.
  - Une étape bloquée est passée après un délai : le lieu se construira à l'approche.
  - Voir `references/regions.js`, `references/conteur.js`, `references/presence.js`.
- Dans les deux cas, **les événements de l'histoire** (une porte qui s'ouvre, une trappe, un tunnel) restent des surprises : construire le lieu d'avance, mais garder son ouverture pour le bon moment.

### 6. Frontières
- Une frontière **douce** (brume qui s'épaissit, puis retour en arrière) pour une région à part. Une roche qui ramène l'égaré pour une cité souterraine.
- **Déclarer chaque exception** : toute salle creusée au-delà d'une caverne doit être connue de la frontière, sinon elle ramène le joueur à l'entrée.
- Se demander si un mur invisible autour du QG est vraiment utile. Il a été retiré dans le Domaine oublié, à la demande de l'utilisateur.

### 7. Fluidité à quatre sur une Switch
- Constructions **une étape par tick**, pas de remplissage géant, pas d'éclairage massif d'un coup.
- **Créatures plafonnées** par zone, posées à l'entrée du groupe, retirées loin des joueurs (48 à 96 blocs). Gardiens exceptés.
- **Densité maximale** sur les apparitions naturelles.
- Particules avec parcimonie, autour des joueurs. Une quarantaine de lucioles au plus dans une forêt.
- Surveillances qui sortent vite. État gardé en mémoire.
- **Mesurer en jeu** : le temps de la première préparation, la fluidité pendant la construction du plus gros lieu, le nombre de créatures pendant un combat à quatre.

## Ce qu'on écrit dans docs/game-design/level-design.md (section « Réalisation dans l'addon »)

- la graine ;
- les positions de chaque région et lieu (et pourquoi) ;
- la stratégie de construction choisie ;
- les zones de chargement ;
- les frontières et leurs exceptions ;
- les plafonds de créatures ;
- les temps mesurés en jeu, ou « non vérifié en jeu ».

## Code de référence (dans `references/`)

- `regions.js` : préparer une région d'un coup, étape par étape ;
- `conteur.js` : l'écran d'attente (fondu, plateforme, phrases, livre) ;
- `presence.js` : la présence qui fait construire sans compter comme un joueur.

Les outils de terrain sont dans `mc-design-en-blocs` : sol, zones de chargement, rejeu des blocs, relief, chemins, arbres, cavernes.
