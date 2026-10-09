# Mes skills perso

Dépôt de référence de mes skills claude.ai : un dossier par skill, avec son `SKILL.md` à la racine.

## Régénérer les copies et le zip
1. Les règles communes et le hook ne se modifient que dans `commun/` (`regles-communes.md`, `hook-porte1/`).
2. Les fichiers `<skill>/references/regles-communes.md` et `<skill>/references/hook-porte1/` sont des copies générées : ne pas les modifier.
3. Après toute modification, lancer `python3 fabriquer_paquets.py` depuis la racine de ce dossier.
4. Le script recopie les fichiers communs dans chaque skill qui y renvoie, refait `paquets/<skill>.skill` et `mes-skills.zip`.
5. Commiter le tout (le zip est ignoré par git) ; importer dans claude.ai `mes-skills.zip` ou les fichiers `paquets/*.skill`, un par skill.

## Origine : skills tirés du Domaine oublié

Capitaliser la manière dont l'addon a été construit, en skills personnels claude.ai (en français).

## Les deux parcours

- **Nouveau projet** : `cadrage-projet-perso` → `design-solution-perso` → `wireframing-perso` → si jeu vidéo,
  `jeu-video-parcours` (lot 1) → si addon Minecraft, `mc-addon-parcours` (lot 2) → réalisation.
- **Évolution** : `evolution-projet-perso` → si jeu vidéo, `jeu-video-parcours` (les métiers touchés seulement)
  → si addon Minecraft, `mc-addon-parcours`.

## Le principe : une maïeutique

Chaque skill **mène une interview** avant de réaliser quoi que ce soit. Son but : faire exprimer, aussi loin que
possible, ce que la personne imagine, laisser émerger ce qu'elle n'avait pas encore formulé, et le confronter à ce
que ses joueurs attendent.
- **Ouvrir avant de proposer** : chaque sujet commence par une question ouverte (raconter, décrire, imaginer) ;
  Claude reformule et relance ; les options en cartes ne viennent qu'ensuite, pour préciser, et la recommandation
  en dernier.
- **Suivre le fil** de la personne : les sujets sont une carte à couvrir, pas un ordre.
- **La voix des joueurs** : ce qu'ils ont aimé, ignoré, réclamé ; 3 ou 4 questions à leur poser, puis on reprend.
- **Ce qui émerge** est noté et relu à la fin de chaque bloc : maintenant, plus tard, ou abandonné.
- **Finir par la scène** racontée comme les joueurs la vivront, puis la fiche validée avant d'écrire.
Le savoir-faire du skill sert à affiner ce que la personne a exprimé, puis à vérifier.

La même maïeutique est ajoutée aux **skills de projet** (`cadrage-projet-perso`, `design-solution-perso`,
`wireframing-perso`, `evolution-projet-perso`, copiés ici avec leurs paquets) : question ouverte avant toute piste
ou option, voix des futurs utilisateurs (avec questions à leur poser), idées émergées notées, scène racontée avant
d'enregistrer. Leurs règles d'origine (un lot par message, challenge, diverger puis converger) restent.
Les parcours ouvrent l'interview (projet ou évolution, socle technique) et enchaînent celles des métiers.
En évolution, une première carte demande **quel genre d'évolution** (décor, lieu, événement, quête simple, en
chaîne, à tiroirs ou à embranchements, personnage, objet, ambiance, retouche) et ouvre les métiers concernés ; leurs
blocs touchés sont posés en entier. `jeu-gameplay` et `mc-scripts-gameplay` couvrent les **événements** (invasion,
objet qui déclenche, kit du maître du jeu) et la **forme des quêtes**.

## Les deux portes : aucun code sans validation (ajouté le 09/10/2026)

En tête de chaque skill qui mène au code (tous sauf `cadrage-projet-perso`) : **jamais de code sans l'accord de la
personne** (seule exception : un essai rapide, proposé et accepté, qui ne va jamais dans `main`).
- **Porte 1, avant la moindre ligne de code** : la fiche de réalisation de tout ce qui apparaît (textures, objets
  et icônes, noms, textes, sons, chiffres de jeu, emplacements), les planches dessinées hors du projet, et un
  « je valide » explicite. Une scène validée n'ouvre aucune porte.
- **Pendant le code** : tout écart avec la fiche revient à la personne.
- **Porte 2, avant la fusion ou la publication** : le rendu final refait depuis les fichiers intégrés, les écarts,
  les points non vérifiés en jeu, et un « je valide » explicite.
- On ne saute ni une porte ni l'interview d'un skill parce que « c'est déjà décidé » : seulement ce qui est écrit
  dans `docs/`, en le disant.

## La cohérence avec le jeu de base (ajoutée le 09/10/2026)

Dans tous les skills qui touchent au jeu (lots 1 et 2, et `evolution-projet-perso`) : dès qu'un élément nouveau
apparaît (matériau, objet, bloc, créature, lieu), l'interview passe en revue **son équivalent dans le jeu** et tout ce
que cet équivalent fait (l'argent → le fer : variantes du minerai, butin selon la pioche, Toucher de soie, fonte,
brut, lingot, pépite, bloc, set d'outils et d'armure, recettes, réparation, recyclage, livre de recettes). Chaque
point est tranché par la personne (comme dans le jeu, autrement, pas du tout) et entre dans la fiche de la porte 1.

## Ce qui se voit : références, inventaire, contexte, essai (ajouté le 09/10/2026)

Tiré du bilan de l'essai du set en argent (presque tout ce qui se voit a été repris après l'interview). Dans les
skills qui touchent à ce que les joueurs voient (12 skills) : **demander des images de référence** avant de
dessiner ; **faire l'inventaire du contenu** (chaque pièce, son rôle, son palier, ce qui manque) ; **montrer
chaque planche dans son vrai contexte** (inventaire, à côté de l'équivalent du jeu, en main, porté, dans le monde,
sur l'écran réel) ; **proposer tôt un essai rapide** pour ce qu'une planche ne montre pas, avec l'outil de test qui
donne tout d'un coup.

## Lot 1 : concevoir un jeu vidéo (livré le 08/10/2026)

| Skill | Rôle |
|---|---|
| `jeu-video-parcours` | Chef d'orchestre : enchaîne les six métiers (nouveau projet ou évolution) |
| `jeu-experience-joueur` | Public, émotions, ton, transitions, ambiance, lisibilité, « jamais d'effet vide » |
| `jeu-gameplay` | Boucle, quêtes, coopération, anti-blocage, récompenses, progression, énigmes, gardiens |
| `jeu-level-design` | Structure du monde, guidage, densité, rythme, verrous, donjons, frontières, secrets |
| `jeu-character-design` | PNJ, créatures, animaux : rôle, fiche, silhouette, comportement, bestiaire, planches |
| `jeu-architecture` | Bâtiments : fonction, silhouette, style, échelle, ruine puis restauration |
| `jeu-mobilier-decor` | Pièces : trois couches de décor, orientation, appuis, meubles sur mesure |

Mis à jour pour le relais vers les parcours : `wireframing-perso`, `evolution-projet-perso` (même nom, contenu
d'origine conservé, une étape de relais ajoutée).

## Lot 2 : addon Minecraft Bedrock (livré le 08/10/2026)

Chaque skill spécialise un skill du lot 1 et joint du code de référence tiré de l'addon (à adapter).

| Skill | Spécialise | Rôle | Code joint |
|---|---|---|---|
| `mc-addon-parcours` | — | Chef d'orchestre : socle technique, étapes jouables, enchaîne les sept skills | — |
| `mc-design-en-blocs` | architecture, mobilier | Palettes, noms et états valides, appuis, orientation, terrain, cavernes, chantiers | construction, relief, chemins, arbres, caverne |
| `mc-entites` | character design | Comportement, texture générée, marche à nous, PNJ fiables, dialogues | textures_patron.py, animations, pnj |
| `mc-scripts-gameplay` | gameplay | État, surveillances, quêtes, récompenses, triches, outils de test | etat, quete, inventaire, sauts, testeur, carnet_testeur |
| `mc-monde-et-chargement` | level design | Graine, régions, biomes, zones de chargement, écran d'attente, frontières, fluidité | regions, conteur, presence |
| `mc-ambiance` | expérience joueur | Brumes, heure, musique du groupe, sons, titres, quart d'écran | musique, brume |
| `mc-verification` | — | Types, banc de simulation, essais de logique, planches, vérification en jeu | banc complet + extraction des blocs du jeu |
| `mc-livraison` | — | Manifestes, paquets, CI, serveur de test, Realm | construire_paquets, addon.yml, install-server, realm.js |

## Installer

Les fichiers `.skill` sont dans `paquets/` : sur claude.ai, ouvrir le fichier (bouton « Save skill ») ou
l'importer dans Réglages › Capacités › Skills. Pour `wireframing-perso` et `evolution-projet-perso`, la nouvelle
version remplace l'ancienne (même nom). Les sources (`<skill>/SKILL.md`) restent ici, dans le dépôt.
