---
name: jeu-character-design
description: "Mène l'interview de direction artistique des personnages d'un jeu vidéo, d'un mod ou d'un addon, puis les conçoit : la personne décide de tout, en maïeutique : questions ouvertes d'abord, options et recommandation ensuite (ressenti voulu, inspirations, nom, personnalité, silhouette, visage, vêtements, matières et textures, couleurs, accessoires, comportement, voix, répliques, mise en scène, planche à valider). Couvre PNJ (habitants, donneurs de quêtes, marchands), mobs et créatures (ennemis, gardiens, boss), animaux passifs, compagnons et bestiaires par zone. À utiliser dès qu'on crée ou modifie un personnage, PNJ, monstre, créature, boss, animal, compagnon, son apparence, sa texture ou ses dialogues, même sans dire « character design ». Quatrième métier de jeu-video-parcours."
---

# Character design

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce métier** : la planche de chaque personnage ou créature (face, profil, couleurs) entre dans la porte 1 de la réalisation. Ce skill ne passe jamais la main au code lui-même.

**Pour ce métier, la liste** : pour une créature, son équivalent (passive, neutre, hostile, boss), sa vie, ses dégâts, sa vitesse, son butin et son expérience, où et quand elle apparaît (lumière, biome, nombre), ses sons, sa réaction au mode Paisible, son comportement face à l'eau, au feu et à la lumière ; pour un personnage, ce que font les villageois (échanges, lit, métier, cloche) et ce qu'on reprend ou non.

**Pour ce métier** : la planche d'un personnage le montre dans le monde, à côté d'un joueur et d'une créature du jeu, de jour et de nuit.

## Pourquoi

Les personnages portent l'histoire et les émotions. Pour un jeu vu sur petit écran, un personnage réussi se reconnaît **à sa silhouette et à sa couleur avant tout texte**, et a **un rôle clair** dans le jeu. Relire d'abord `docs/game-design/experience-joueur.md` (le ton, le public) et `docs/game-design/gameplay.md`.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

**Pour ce métier, des options qu'on peut se représenter** (à la place des exemples du fichier commun) :
- des références nommées : personnages de films, de dessins animés, de jeux, de livres, de contes ;
- des couleurs, des matières, des formes décrites précisément (« cape de laine vert mousse, élimée aux bords ») ;
- quand ça aide, une **image** (planche, croquis, rendu) avant de faire choisir.

### Les sujets à couvrir, bloc par bloc (pour chaque personnage ou groupe de créatures)

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. Sa place dans le jeu**
1. Son **rôle** : donner des quêtes, vendre, guider, faire rire, menacer, garder un trésor, accompagner, décorer la vie du monde ?
2. Son **importance** : personnage vedette, secondaire, figurant ou créature en nombre ?
3. Sa **relation aux joueurs** : allié, ennemi, neutre qui peut basculer, comique, mystérieux ?
4. **Où et quand** on le rencontre dans l'aventure ?

**B. Le ressenti et les inspirations**
5. **Que doit ressentir le joueur en le voyant pour la première fois ?** (émerveillement, confiance, méfiance, frisson, envie de rire, tendresse…) Et en le quittant ?
6. **De quels personnages s'inspirer ?** Proposer 2 ou 3 références (films, dessins animés, jeux, livres, mythologie) et demander **ce qu'on prend de chacune** (la silhouette, l'humour, la voix, les couleurs).
7. **Ce qu'on évite** : trop effrayant, cliché, trop proche d'un personnage existant, trop compliqué à lire en petit.
8. Le **degré de fantaisie** : réaliste, conte, cartoon, gothique comique ?

**C. Son identité**
9. Son **nom** : 3 propositions dans le ton (faciles à lire et à dire pour le public), ou celui de la personne.
10. Son **espèce, son âge, son origine**.
11. Sa **personnalité** en 3 mots, et **sa manie** (une habitude qui le rend unique).
12. Son **histoire** en deux phrases, et un **secret** éventuel à découvrir.
13. Ce qu'il **veut** (son but), et ce qu'il **craint**.

**D. Son apparence**
14. Sa **silhouette et ses proportions** : taille par rapport au joueur, corpulence, posture (voûté, droit, bondissant).
15. Son **trait distinctif**, reconnaissable de loin : un chapeau, une cape, une arme, une taille hors norme, une forme de tête.
16. Son **visage** : yeux (couleur, forme, lueur), nez, bouche, barbe ou moustache, expression par défaut.
17. Ses **cheveux ou sa pilosité** : couleur, longueur, coiffure.
18. Ses **vêtements** : coupe, époque, style (paysan, chevalier, mage, aventurier…), état (neuf, usé, rapiécé, sale).
19. Les **matières et textures** de ses habits et de son corps : laine, cuir, lin, velours, métal, fourrure, écailles, mousse, pierre, bois… Uni, à motifs (étoiles, fleurs, rayures), brodé ?
20. Ses **couleurs** :
    - une dominante, une secondaire, un accent ;
    - le **contraste avec le décor** où il vit (se détacher ou se fondre) ;
    - les couleurs **à éviter** pour ne pas le confondre avec un autre personnage ou un objet.
21. Ses **accessoires** : arme, bâton, outil, sac, animal de compagnie, bijoux.
22. Ce qui **brille** dans le noir (yeux, cristaux, bâton) ou ce qui est **transparent** (fantôme).
23. Le **niveau de détail** de la texture : pixel art simple dans l'esprit du jeu, ou plus fin pour un personnage vedette.

**E. Son comportement**
24. Ses **déplacements** : immobile à sa place, se promène, patrouille, suit les joueurs, vole, nage, traverse les murs.
25. Sa **posture au repos** et son **geste** quand on lui parle (salut, rire, lever son bâton…).
26. Sa **réaction** quand on le frappe, quand on lui offre quelque chose, quand on revient le voir.
27. Pour une créature :
    - sa façon d'attaquer, sa portée, sa vitesse ;
    - sa **faiblesse** ;
    - ce qu'elle laisse en disparaissant ;
    - combien à la fois ;
    - si elle revient.
28. Pour un gardien :
    - ses **phases** ;
    - sa mécanique signature ;
    - sa **fin** (meurt, s'enfuit, s'apaise, se rendort), adaptée au public.

**F. Sa voix**
29. Sa **façon de parler** : vocabulaire, tutoiement ou vouvoiement, tics de langage, accent écrit, longueur des phrases.
30. Ses **répliques clés**, proposées puis ajustées une à une : rencontre, demande, rappel, merci, au revoir.
31. Ses **sons** (rire, grognement, ronflement, pas, cri) et sa **musique** éventuelle.

**G. Sa mise en scène**
32. Son **apparition** : il surgit, arrive, se révèle, interpelle le groupe, se laisse découvrir ? Avec quel son, quel effet visuel ?
33. Son **lieu de vie** et ce qui l'entoure (sa maison, ses objets, ses animaux).
34. Son **évolution** au fil de l'aventure : change-t-il d'apparence, d'humeur, de place ?

**H. La validation visuelle**
35. Une **planche** : de face et de profil, à taille réelle et agrandie, à côté des personnages de la même zone. Que changer : silhouette, couleurs, détails ?
36. Après retouches, la **fiche complète** (blocs A à G) : « est-ce exactement le personnage que tu veux ? »

**Pour un bestiaire de zone** (avant les fiches de chaque créature) :
- le thème de la zone ;
- le nombre de créatures différentes ;
- la proportion d'hostiles, de neutres et de passifs ;
- un ou deux clins d'œil ;
- le gardien.

### En évolution
Pour un personnage ajouté ou modifié, dérouler les mêmes blocs. Pour une **retouche** (« la licorne est trop pixélisée »), commencer par les blocs touchés (D et H), puis demander si le reste change aussi.

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. Le rôle dans le jeu
Avant l'apparence, une ligne : **à quoi sert-il ?** Donner une quête, vendre, guider, faire rire, menacer, garder un trésor, accompagner. Un personnage sans rôle est un candidat à retirer.

Catégories :
- **PNJ** : habitants, donneurs de quêtes, marchands, guides ;
- **créatures hostiles** : ordinaires (en nombre), d'élite, **gardiens** (un par étape) ;
- **créatures neutres** (elles ne s'énervent que si on les provoque) et **animaux passifs** (vie ambiante, ressources) ;
- **compagnons et montures**.

### 2. La fiche personnage
- **Nom** facile à lire et à prononcer pour le public (un nom d'origine compliqué se simplifie : « Comte Dracula » plutôt qu'un long nom inventé).
- **Personnalité en trois mots** (grognon mais gentil, vaniteux, farceur) et **une manie** (il parle de lui à la troisième personne, il commente l'avancée du groupe).
- **Ses répliques** : courtes, dans le ton, avec une voix reconnaissable ; une réplique de **rencontre**, de **rappel**, de **merci** et de **fin**.
- **Son geste** quand on lui parle (lever son bâton, se frotter le ventre, saluer) et son **repos** (respirer, regarder le joueur).
- **Son lieu** et sa **mise en scène d'arrivée** : il apparaît, il interpelle le groupe, il surgit (à proposer en options, c'est une transition).

### 3. La silhouette et la lecture à petite taille
- Le **test des trois lectures** : de loin, on reconnaît la forme (chapeau pointu, défenses, grand corps) ; de plus près, la couleur dominante ; de près seulement, les détails.
- **Une forme distinctive par personnage** important : un chapeau, une cape, une arme, une taille (un troll une fois et demie plus grand, un gnome minuscule).
- **Des couleurs qui ne se confondent pas** entre objets ou personnages proches : deux clés beiges se confondent sur un quart d'écran.
- Des **éléments qui brillent dans le noir** (yeux, cristaux, bâton) pour les lieux sombres.

### 4. Le comportement
- PNJ : immobile ou dans sa zone, **invincible**, qui revient à sa place s'il en est écarté, et qui réapparaît s'il manque.
- Créature : sa façon de se déplacer et d'attaquer (bondit, tire des cailloux, traverse les murs, avale), sa **portée**, ce qui la rend vulnérable, ce qu'elle laisse en mourant (un butin utile ailleurs).
- Gardien : ses **phases** (voir gameplay) et sa **fin** adaptée au public.
- Nombre et réapparition : **plafond** par zone, et réapparition seulement là où le gameplay l'exige.

### 5. Le ton et le public
Adapter aux enfants sans affadir : un méchant **de théâtre** (vaniteux, comique, qui s'enfuit en chauves-souris), des fantômes **inoffensifs**, un loup-garou impressionnant mais pas gore. *Écarter* les créatures du jeu d'origine qui sont trop rares ou trop effrayantes si le cadrage le demande.

### 6. Le bestiaire
Par zone : 2 à 4 créatures ordinaires, une neutre, un gardien. Un **thème** cohérent (marais : sangsues, pieuvre ; forêt : loups-garous, ours-hibou ; château : gargouilles, armures animées, mimiques). Un ou deux personnages **clins d'œil** (une référence que les parents reconnaîtront).

### 7. La planche de validation
Avant d'intégrer, montrer une **planche** : chaque personnage de face (et de profil si utile), à taille réelle et agrandi, côte à côte avec ceux de la même zone. On y repère les confusions de silhouette et de couleur. Dessiner la planche dans `ressources/planches/` et la faire valider (porte 1) ; la planche refaite depuis le projet va dans `livrables/planches/` (porte 2).

## Ce qu'on écrit dans docs/game-design/personnages.md

Le fichier `docs/game-design/personnages.md` (« Game design — Personnages », **seulement après la validation de la fiche complète** (bloc H) ; les réponses de l'interview y sont reprises telles que la personne les a données, avec les options écartées :
- une fiche par personnage (rôle, nom, personnalité, répliques clés, geste, lieu, arrivée, comportement) ;
- le bestiaire par zone ;
- les règles de ton ;
- les liens vers les planches ;
- les critères à vérifier en jeu (« reconnaissable sur un quart d'écran », « aucune créature confondue avec une autre »).

## Pièges vus en vrai

- Deux objets ou personnages de la même couleur se confondent sur un quart d'écran : la planche côte à côte le révèle avant l'intégration.
- Le nom par défaut d'un dialogue natif (« NPC ») réapparaît au-dessus d'un PNJ : prévoir de **remettre son nom** régulièrement.
- Un modèle emprunté à un autre personnage traîne ses accessoires : le chapeau pointu d'une alchimiste donnait un air de sorcière à l'herboriste. Masquer ce qui ne va pas (rendre transparente la pointe du chapeau).
- Des PNJ qui ne font que tourner la tête paraissent morts : un geste quand on leur parle, une respiration au repos.

## Exemple (Le Domaine oublié)

Le vieux Gronk, troll des cavernes : rôle, demander des pierres précieuses contre une armure magique ; personnalité, grognon et gentil, il parle de lui à la troisième personne (« Gronk aime les cailloux qui brillent ! ») ; silhouette, une fois et demie plus grand, peau de pierre moussue, défenses blanches, bâton à tête de cristal ; arrivée, on l'entend ronfler avant de le voir, puis il interpelle le groupe.
