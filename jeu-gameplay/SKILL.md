---
name: jeu-gameplay
description: "Mène l'interview de direction du gameplay (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : boucle, forme des quêtes, événements, combats, récompenses, coopération, difficulté), puis l'écrit. Concevoir le gameplay d'un jeu vidéo, d'un mod ou d'un addon : boucle de jeu, quêtes principales et secondaires (simples, en chaîne, à tiroirs, à embranchements), événements (invasion, objet qui déclenche, kit du maître du jeu), objectifs partagés en coopération, récompenses (communes et personnelles), progression et difficulté, énigmes, combats de boss en phases, rejouabilité. À utiliser dès qu'on parle de quêtes, de missions, d'objectifs, de récompenses, d'événements, de boss, d'énigmes, de progression, d'économie (pièces, gemmes, marchand) ou de « quoi faire dans le jeu », même sans dire « gameplay ». Deuxième métier de jeu-video-parcours."
---

# Gameplay

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce métier** : sa fiche (quêtes, objectifs, récompenses et leurs quantités, chiffres de difficulté, rareté) entre dans la porte 1 de la réalisation. Ce skill ne passe jamais la main au code lui-même.

**Pour ce métier, la liste** :
- **un nouveau matériau** : comment on le trouve, ce qu'il donne quand on le casse (avec Toucher de soie, avec Fortune, par une explosion), l'expérience gagnée, la fonte (four, haut fourneau), toutes ses formes (brut, lingot, pépite, bloc) et les recettes qui passent de l'une à l'autre ;
- **un nouvel équipement** : le set complet attendu (outils, armes, armure), sa place entre les paliers du jeu (dégâts, solidité, protection, vitesse), ses recettes à l'établi, la réparation (enclume, établi), les enchantements possibles, le recyclage en pépites ;
- **l'économie** : les échanges, les marchands, les coffres, et ce que l'ajout rend plus facile ailleurs (une quête, une récompense) ;
- **la découverte** : le livre de recettes, l'inventaire créatif, les noms affichés.

**Pour ce métier** : l'inventaire du contenu (chaque objet, son rôle et son palier) est fait ici, avant que les métiers visuels dessinent quoi que ce soit.

## Pourquoi

Le gameplay, c'est ce que le joueur **fait**. Il sert l'expérience fixée au métier précédent (relire `docs/game-design/experience-joueur.md`). Un bon gameplay pour un public donné n'est pas le plus riche : c'est celui qui produit les émotions visées sans frustration.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La boucle de jeu**
1. **Les verbes** : ce que les joueurs font sans arrêt (explorer, combattre, construire, collectionner, résoudre, parler, élever) ; lesquels sont au cœur ?
2. **La séance** : une étape avec un début, une épreuve et une fête ? Quelle durée ?
3. **L'aventure** : ce qui change dans le monde au fil du temps (un QG qui revit, des régions qui s'ouvrent) ?
4. **Guidé ou libre** : une histoire à suivre, un monde ouvert, ou un mélange (et dans quelle proportion) ?

**B. Jouer ensemble**
5. **Coopération** : une liste d'objectifs partagée, des rôles, des parts réservées ?
6. **Compétition** : aucune, amicale (scores), ou à proscrire ?
7. **Un joueur absent** ou qui meurt : qu'est-ce qu'il perd, comment rattrape-t-il ?

**C. Les quêtes**
8. **Le nombre et la longueur** des quêtes principales ; découpage en chapitres ?
9. **Les types d'objectifs préférés** : aller quelque part, rapporter, vaincre, résoudre, escorter, construire.
10. **Qui confie les quêtes**, et comment (dialogue, lettre, panneau) ?
11. **Les quêtes secondaires** : combien, où, de quel style, avec quelles récompenses ?
12. **Le suivi** : carnet, ligne d'objectif, carte, rien ?
13. **La forme de chaque quête** (proposer un petit schéma pour chacune) :
    - **simple** : un objectif, une fête ;
    - **en chaîne** : des demandes à la suite chez le même personnage (petite, moyenne, grande) ;
    - **à tiroirs** : la quête en ouvre d'autres à l'intérieur (pour aider A, il faut d'abord aider B, qui demande C), puis on remonte jusqu'à la première ;
    - **à embranchements** : un choix des joueurs change la suite ou la fin.

    Pour une quête à tiroirs : combien de niveaux au plus, comment on s'y retrouve (le carnet montre l'arbre ?), et ce qui se passe si on abandonne un tiroir.

**D. Les récompenses**
14. **Ce qui fait vraiment plaisir aux joueurs** : objets rares et nommés, monture, compagnon, pouvoir, base qui revit, collection, titres.
15. **Communes ou personnelles**, ou les deux ; et pour les absents ?
16. **La mise en scène** de la récompense (voir l'expérience joueur).
17. **Une économie** : une monnaie, des gemmes, un marchand ? Que peut-on acheter, que peut-on vendre ?

**E. La difficulté et la progression**
18. **La difficulté** : douce, moyenne, exigeante ; la mort, et ce qu'elle coûte.
19. **Le rythme des nouveautés** : une idée nouvelle par étape ? Laquelle à chaque étape ?
20. **Ce qui ouvre la suite** : des clés, des sceaux, des pièces à construire, un personnage à aider ?
21. **Les pouvoirs du joueur** qui grandissent (armes, sorts, montures) : lesquels et quand ?

**F. Les énigmes**
22. **Le type d'énigmes** : observation, logique, ordre, sons, lumière, objets à placer.
23. **Leur difficulté**, la place de l'**indice** (dans le lieu, chez un personnage), et la **conséquence d'une erreur**.

**G. Les combats et les gardiens**
24. **La place du combat** : central, occasionnel, rare ?
25. **Pour chaque gardien** :
    - son inspiration ;
    - sa **mécanique signature** ;
    - ses phases ;
    - comment on le bat ensemble ;
    - **sa fin** (meurt, s'enfuit, s'apaise, se rendort).
26. **Les créatures ordinaires** : nombre, réapparition, ce qu'elles laissent.

**H. Les événements** (ce qui arrive au monde sans être une quête)
27. **Les événements voulus** : invasion, tempête, visiteur, fête, catastrophe, trésor qui apparaît… Lesquels, et avec quelles inspirations ?
28. **Ce qui les déclenche** : un objet découvert ou utilisé, un lieu atteint, une étape franchie, le hasard, l'heure, ou **le maître du jeu** (un parent qui le lance quand l'ambiance retombe) ?
29. **Leur déroulé** : l'annonce (ce que les joueurs voient et entendent d'abord), la durée, ce qu'il faut faire, **comment ça se termine** (gagné, raté, ça passe tout seul) et ce que ça laisse (récompense, trace dans le monde).
30. **Leur dosage** : à quelle fréquence, jamais pendant un combat de gardien ou une scène, rejouable ou unique ?
31. **Pour le maître du jeu** : quels événements dans son kit, comment il les lance (menu discret), peut-il les arrêter, et les joueurs savent-ils que c'est lui ?

**I. La rejouabilité**
32. **Les raisons de revenir** d'une séance à l'autre (cadeau quotidien, collection, quêtes secondaires) ?
33. **Après la fin** : un mode libre, un nouveau chapitre, des défis ?

**J. La validation**
34. Le **tableau des quêtes** (qui, quoi, forme, ce que ça ouvre, récompense), le **tableau des événements** s'il y en a et la **vérification anti-blocage**, relus ensemble, puis la fiche gameplay complète : « est-ce exactement le jeu que tu veux ? »

### En évolution
Dérouler en entier les blocs touchés : une quête → C (dont sa forme) et D ; un gardien → G ; un événement → H ; une récompense → D. Vérifier ensuite que l'ensemble reste équilibré.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. La boucle de jeu
Écrire la boucle en une ligne, à trois niveaux :
- **la minute** : ce qu'on fait sans arrêt (explorer, combattre, ramasser, construire) ;
- **la séance** : une quête ou une étape, avec un début et une fête à la fin ;
- **l'aventure** : les chapitres, ce qui change dans le monde au fil du temps (le QG qui se reconstruit, une région qui revit).

Vérifier que chaque niveau **nourrit** le suivant : ce qu'on ramasse à la minute sert la quête ; la quête fait avancer l'aventure ; l'aventure donne envie de revenir.

### 2. Les quêtes
Pour chaque quête, une fiche :
- **qui la confie**, avec quelle mise en scène ;
- **ses objectifs**, variés : aller quelque part, rapporter des objets, vaincre des créatures, résoudre une énigme, battre un gardien ;
- **ce qu'elle débloque** (une pièce à construire, une zone, la quête suivante) ;
- **sa récompense**.

En **coopération** : une **liste d'objectifs partagée**. N'importe quel joueur peut remplir n'importe lequel, et l'avancement est commun. On rend les objets en parlant au personnage, et chacun donne ce qu'il a. *À éviter* : des rôles imposés, des parts réservées à un joueur.

**Quêtes secondaires** : des personnages éparpillés, **peu nombreux** (deux par grande zone suffisent), avec **trois demandes à la suite** (petite, moyenne, grande) et une récompense croissante. Elles se suivent dans le **carnet**, jamais dans la ligne d'objectif principale.

**La forme des quêtes** :
- **en chaîne** : la plus sûre pour des enfants (une demande à la fois, une récompense croissante) ;
- **à tiroirs** : deux niveaux au plus, chaque tiroir est une petite quête complète avec sa propre petite fête, et le carnet montre où l'on en est (« pour Gauvain → d'abord Mirabelle → d'abord 6 nénuphars ») ; quand le dernier tiroir se ferme, on **remonte** et chaque personnage le dit ;
- **à embranchements** : peu de choix, aux conséquences visibles, et **aucun choix qui ferme définitivement une récompense** sans le dire ; en coopération, le choix se fait ensemble (vote ou porte-parole).

### 3. Jamais de blocage
Pour chaque objectif, se demander : **peut-il devenir impossible ?**
- créatures demandées qui ne réapparaissent pas, ou en nombre inférieur à ce qui est demandé ;
- objet qui ne se trouve qu'une fois et peut être perdu, vendu ou détruit ;
- objet qui dépend du hasard du monde (biome absent, fruit rare) ;
- lieu inaccessible avant une autre étape.

Remède : une source **renouvelable** et **proche** (le potager du personnage qui demande des légumes, des nénuphars autour de la cabane de la sorcière), un objet de quête qui se **redonne** s'il est perdu, ou une source achetable.

### 4. Les récompenses
Mixer les deux :
- **le commun** (matériaux, ce qui débloque la suite) arrive dans un coffre du QG, ou directement chez chacun ;
- **le personnel** : un **souvenir** par joueur, gardé pour les absents et remis à leur retour.

Récompenses qui comptent pour des enfants : un objet nommé, rare et visible (« Bouclier de Gauvain »), une monture, un compagnon, une pièce de la base qui revit. Mettre chaque récompense **en scène** (voir expérience joueur).

### 5. Progression et difficulté
- **Une courbe douce** : chaque étape introduit **une** idée nouvelle. Principe « apprendre, tester, surprendre » : on présente une mécanique sans danger, on la teste, puis on la détourne.
- **Ce qui ouvre la suite** : un verrou clair, par exemple trois sceaux pour la porte du château, ou une braise qui rallume l'étage suivant.
- **Créatures** posées salle par salle, en nombre plafonné, qui **ne reviennent pas** une fois vaincues dans un donjon. Sur une petite machine à quatre joueurs, c'est aussi une question de fluidité.

### 6. Énigmes
Courtes, lisibles en deux lignes, résolubles **à plusieurs** : trois flammes dont une à éteindre, l'ordre des dalles de couleur, la bonne tombe à réveiller, le portrait qui ne regarde pas le trône. L'indice est **dans le lieu** (un panneau, une épitaphe). Une mauvaise réponse a une **conséquence douce** (un squelette sort de terre), jamais un blocage.

### 7. Combats de gardien
Un gardien par grande étape, combattu **en phases** :
- une mécanique propre (il se reconstruit tant que ses pierres brillent ; il avale un joueur et le recrache) ;
- un moment de répit, une faiblesse à découvrir ;
- une **fin non traumatisante** pour des enfants : il s'enfuit, il s'apaise, il se rendort ;
- un plafond de renforts et une **remise à zéro** si le groupe abandonne (il retourne dormir et reprend des forces).

### 8. Économie (si le jeu en a une)
Une monnaie simple (pièces d'or), des objets précieux (rubis, saphirs) qui ont **un usage** (un marchand qui les achète, un personnage qui les demande) : ce qu'on trouve doit servir quelque part.

### 9. Les événements
Un événement est une **petite histoire qui arrive au monde** : une invasion du domaine, une tempête, un visiteur, un trésor qui apparaît.
- **Une fiche par événement** : son déclencheur, son annonce, ce qu'il faut faire, sa durée, sa fin (gagnée, ratée ou qui passe d'elle-même), ce qu'il laisse.
- **Déclencheurs** : un objet découvert ou utilisé, un lieu atteint, une étape franchie, l'heure, le hasard, ou le **maître du jeu**.
- **L'annonce d'abord** (un son, un titre, un ciel qui change), puis l'action : les joueurs doivent comprendre ce qui arrive avant d'être attaqués.
- **Il finit toujours**, même si les joueurs l'ignorent ou se déconnectent : une durée maximale, et un retour au calme.
- **Jamais par-dessus** un combat de gardien, une scène ou un autre événement.
- **Le kit du maître du jeu** : un menu discret, réservé au parent, qui lance un événement prévu (choisi dans une courte liste), l'arrête ou en baisse la difficulté. Il sert à relancer l'ambiance quand elle retombe ; les joueurs n'ont pas à savoir que c'est lui.

### 10. Rejouabilité et retour
Ce qui fait revenir d'une séance à l'autre : un **cadeau quotidien** (un sort par jour, un coffre de minerais chaque matin), des quêtes secondaires, une collection (découvertes, trophées qui s'allument).

## Ce qu'on écrit dans docs/game-design/gameplay.md

Le fichier `docs/game-design/gameplay.md` (« Game design — Gameplay » :
- la boucle sur ses trois niveaux ;
- les fiches de quêtes, avec leur forme (et les quêtes secondaires) ;
- les fiches d'événements et le kit du maître du jeu, s'il y en a ;
- la vérification anti-blocage ;
- les récompenses ;
- la progression (ce qui ouvre quoi) ;
- les énigmes ;
- les gardiens et leurs phases ;
- l'économie ;
- les critères à vérifier en jeu (« aucun objectif impossible », « chaque quête a sa fête »…).

## Pièges vus en vrai

- Une quête qui se termine trop tôt : le dernier objectif oublié faisait passer la quête du château pour finie à la 4ᵉ clé. Chaque quête finit sur **l'objectif qui conclut l'histoire**.
- Demander 5 loups-garous alors que la forêt n'en compte que 4 posés : vérifier que les créatures demandées **réapparaissent**.
- Des pommes à rapporter, alors qu'elles tombent rarement des arbres : remplacer par une source fiable (des légumes du potager voisin).
- Des victoires qui comptent avant d'avoir accepté la quête : ne compter qu'**après** l'acceptation.

## Exemple (Le Domaine oublié)

Boucle : explorer autour du domaine → rapporter à un habitant → la pièce suivante du domaine se reconstruit avec un coffre d'ingrédients → l'habitant de la pièce confie la quête suivante. Quêtes secondaires : Sire Gauvain (vaincre 6, 10, puis 15 monstres → rubis, saphir, bouclier). Gardiens en phases : le Golem de cristal qui se reconstruit tant que ses trois pierres brillent ; le Crapaud-roi qui avale un joueur et le recrache.
