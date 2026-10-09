---
name: mc-addon-parcours
description: "Ouvre l'interview du socle de l'addon puis enchaîne les interviews de chaque skill du lot 2 : la personne décide de tout ce que les joueurs verront, et on ne code qu'après fiche validée. Chef d'orchestre de la réalisation d'un addon Minecraft Bedrock (nouveau ou évolution d'un existant) : prend la suite de jeu-video-parcours et enchaîne mc-design-en-blocs, mc-entites, mc-scripts-gameplay, mc-monde-et-chargement, mc-ambiance, mc-verification et mc-livraison, pour traduire le game design en blocs, entités, scripts et monde, le vérifier puis le livrer (serveur de test, Realm). À utiliser dès qu'un projet est un addon, un pack de comportement ou de ressources, une carte d'aventure ou un monde Minecraft Bedrock (Switch, Realm, serveur BDS), même sans dire « addon »."
---

# Parcours addon Minecraft Bedrock (lot 2)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Ce qui se voit » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill** : chaque étape jouable passe les deux portes. La porte 1 rassemble les fiches et planches de tous les skills du lot 2 touchés par l'étape. La porte 2 est tenue par `mc-verification` (rendu final) puis `mc-livraison` (aucune fusion ni publication sans elle).

**Dans ce parcours** : chaque skill touché passe sa liste de cohérence en interview ; la porte 1 contient, pour chaque élément nouveau, la ligne « comme dans le jeu / autrement / pas du tout » de chaque point.

**Dans ce parcours** : la porte 1 contient, pour chaque élément visible, la référence de la personne, sa ligne dans l'inventaire du contenu et sa planche en contexte ; les essais rapides utiles sont proposés dès cette étape.

## Quand utiliser ce skill

Après `jeu-video-parcours` (lot 1), quand le jeu est un **addon Minecraft Bedrock** :
- **nouveau projet** : le game design est écrit dans `docs/game-design/`, il faut maintenant décider comment le réaliser dans Minecraft, puis le construire ;
- **évolution** d'un addon existant : seuls les skills touchés par l'évolution sont déroulés.

Chaque skill du lot 2 **spécialise** un skill du lot 1. Il en reprend les décisions et les traduit dans les contraintes de Minecraft : blocs, entités, Script API, chargement du monde, matériel visé.

## Règles communes

Ce sont les mêmes que pour le lot 1 :
- un dépôt GitHub par projet ;
- un message par décision ;
- les choix d'expérience et de transition proposés en 2 ou 3 options avec une recommandation ;
- `docs/` toujours fidèle à ce qui existe, avec une entrée datée par décision.

En plus, pour un addon :
- **Chaque livraison monte la version** des deux packs, et seulement elle : jamais `min_engine_version`, ni les UUID.
- **Rien n'est dit « fait » sans vérification** : types, banc de simulation, essais de la logique, puis la liste des points « non vérifiés en jeu » donnée honnêtement.
- **Le matériel réel décide** : une Switch à quatre en écran partagé n'est pas un PC. Chaque choix pèse son coût en blocs, en créatures et en particules.

## L'interview d'ouverture (le socle, avant le premier skill)

**Le parcours est une grande interview (une maïeutique) : chaque skill du lot 2 mène la sienne, et la personne décide de tout ce qui touche à ce que les joueurs verront et vivront.** Les décisions purement techniques invisibles (structure des fichiers, noms de variables) n'ont pas besoin d'être posées ; tout le reste l'est. Ce skill ouvre et referme le parcours.

### Les règles
Une maïeutique, comme au lot 1 : une question par message ; d'abord une question ouverte (faire décrire ce que la personne imagine, reformuler, relancer), puis seulement 2 ou 3 options en cartes (skill `poser-questions-en-cards` s'il est installé) pour préciser, la recommandation en dernier ; suivre le fil de la personne ; noter les idées qui émergent et les relire à la fin de chaque bloc ; partir du portrait des joueurs fait au lot 1 ; signaler les contradictions avec le game design du lot 1 ; récapitulatif par bloc ; rien n'est écrit sans validation.

### Les questions du socle
1. **Où jouera-t-on** : Switch, PC, tablette, téléphone ; à combien, écran partagé ou non ?
2. **Où vivra le monde** : Realm, serveur, monde solo ; et où teste-t-on (serveur de test sur le PC) ?
3. **Le mode de jeu** : survie, aventure, créatif ; la difficulté ; garder son inventaire à la mort ?
4. **Les triches** (commandes) acceptées dans le monde : nécessaires aux brumes, dialogues, zones de chargement ; à valider.
5. **La version du jeu visée** (celle de la console et du serveur).
6. **Un monde neuf ou existant** : partir d'un monde déjà joué (à ne pas abîmer) ou d'un monde neuf, sur quelle graine ?
7. **Le style visuel** :
   - rester dans l'esprit des blocs du jeu (pixel art, textures 16 px) ou aller vers plus de détail sur certains éléments ;
   - n'utiliser que les blocs du jeu, ou ajouter des blocs et objets à nous.
8. **Le rythme des livraisons** : une étape jouable par semaine, par soirée ? Qui teste, comment les retours remontent-ils ?
9. **Le découpage en étapes jouables**, proposé puis validé une étape à la fois.

À la fin de chaque étape : la liste de ce qui a été vérifié et de ce qui reste à vérifier en jeu, présentée à la personne.

## L'ordre, et ce que chaque skill spécialise

| # | Skill | Spécialise | Ce qu'il fixe |
|---|---|---|---|
| 1 | `mc-design-en-blocs` | architecture, mobilier | Palettes de blocs, noms et états valides, appuis, orientation, terrassement, outils de construction |
| 2 | `mc-entites` | character design | Modèles, textures, animations (marche à nous), comportements, apparitions, PNJ fiables |
| 3 | `mc-scripts-gameplay` | gameplay | État sauvegardé, surveillances, quêtes, fenêtres, objets, commandes et outils de test |
| 4 | `mc-monde-et-chargement` | level design | Régions, graine, terrain réel, zones de chargement, construction d'avance, frontières, performance |
| 5 | `mc-ambiance` | expérience joueur | Brumes, heure, musique, sons, particules, titres, lisibilité sur un quart d'écran |
| 6 | `mc-verification` | (transversal) | Banc de simulation, tests de logique, outils de test en jeu, carnet des points à vérifier |
| 7 | `mc-livraison` | (transversal) | Manifests et versions, paquets, serveur de test, publication sur le Realm sans abîmer le monde |

Les skills 1 à 5 peuvent se croiser : un PNJ demande une maison (blocs), un modèle (entités), un dialogue (scripts), un lieu chargé (monde) et une musique (ambiance). Les dérouler dans l'ordre, et revenir en arrière quand un skill révèle un manque.

## Déroulé — nouveau projet

1. **Fixer le socle technique** (l'interview d'ouverture ci-dessus), une décision par message :
   - la cible : Switch, PC, mobile ; à combien ; écran partagé ou non ;
   - l'hébergement : serveur de test BDS sur le PC, Realm pour jouer ;
   - les packs : un de comportement et un de ressources, les versions de Script API (`@minecraft/server`, `@minecraft/server-ui`), la langue des textes.
   
   Les écrire dans `docs/design.md`, section « Choix techniques ».
2. **Dérouler les skills 1 à 5** sur les décisions du lot 1, en **menant l'interview de chacun en entier** avant de réaliser. Chacun écrit sa partie dans le fichier de son métier, dans `docs/game-design/`.
3. **Découper la réalisation en étapes jouables** : chaque étape se teste seule. Faire valider la liste, puis réaliser étape par étape. Chaque étape est **décrite en entier et validée** avant d'être codée : c'est la porte 1 (fiche et planches, « je valide » explicite), puis l'accord pour coder ; la porte 2 vient avant la fusion.
4. **À chaque étape** : `mc-verification`, puis `mc-livraison` (version montée, documents à jour, PR). La personne teste, rapporte, on corrige.

## Déroulé — évolution

1. Repérer les skills touchés à partir des types choisis dans `jeu-video-parcours` (par exemple, « un nouveau PNJ à quêtes » → entités, scripts, design en blocs pour sa maison, monde pour son emplacement ; « une invasion du domaine » → scripts (événements), entités (envahisseurs), ambiance ; « un nouveau décor » → design en blocs seul ; puis toujours vérification et livraison).
2. Les dérouler dans l'ordre du tableau, en menant **leur interview**, à la profondeur du niveau choisi dans `jeu-video-parcours` (retouche, ajout ou nouveau), sur tout ce que l'évolution ajoute ou change. Ne sauter que ce qui est déjà tranché **par écrit dans `docs/`**, en le disant, et la personne confirme. Les textures, icônes, objets et chiffres de jeu ne sont jamais « déjà tranchés » par une scène validée.
3. **Porte 1** : rassembler la fiche de réalisation et les planches de tous ces skills, dessinées hors des packs, et obtenir le « je valide » explicite. Puis demander l'accord pour coder.
4. Réaliser étape par étape ; tout écart avec la fiche revient à la personne.
5. Finir **toujours** par `mc-verification` (rendu final refait depuis les packs) et `mc-livraison`. **Porte 2** : « je valide » explicite sur le rendu final avant toute fusion ou publication.

## Ce que ce skill n'est pas

Il ne refait pas le game design (lot 1). Il ne remplace pas la vérification en jeu : il la prépare (outils de test, liste des points à vérifier) et la rend honnête.
