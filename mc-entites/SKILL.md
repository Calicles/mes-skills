---
name: mc-entites
description: "Mène l'interview de direction des entités (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : modèle, texture, couleurs, animations, sons, comportement), ne code qu'après fiche validée. Réaliser les créatures et personnages d'un addon Minecraft Bedrock : entité de comportement (composants, familles, invincibilité, apparitions et plafonds), entité client (géométrie en box UV, texture générée par script, matériaux transparent ou lumineux, animations de marche et de gestes à nous), PNJ fiables (un seul, à sa place, nom affiché), dialogues natifs ou fenêtres de script, montures et compagnons, butin. À utiliser dès qu'on ajoute ou modifie un mob, un PNJ, un animal, un boss, une monture, une texture, un modèle ou une animation dans un addon, ou qu'une créature glisse, reste figée, apparaît en double ou perd son nom, même sans dire « entité ». Spécialise jeu-character-design."
---

# Entités (Minecraft Bedrock)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire en entier `references/regles-communes.md` (deux portes, cohérence avec le jeu de base, ce qui se voit, règles d'interview) : il fait foi.
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill, la porte 1 contient** : pour chaque créature ou personnage, la planche du modèle avec sa texture (face, profil, dos), ses couleurs, ses animations décrites (et montrées en images si possible), ses sons, son nom affiché et ses répliques, ses chiffres (vie, dégâts, vitesse, nombre). Rien n'entre dans le pack avant le « je valide ».

**Pour ce skill, la liste** : pour chaque créature, son équivalent dans le jeu (familles, comportements, vie, dégâts, vitesse, butin et expérience, apparition et plafonds, sons, mode Paisible, réaction à l'eau, au feu et au soleil) ; pour un équipement porté, le rendu sur le joueur (armure, objet en main, dans quel sens il est tenu) comparé à celui du jeu.

**Pour ce skill** : chaque créature est montrée à côté d'un joueur et d'une créature du jeu, de face, de profil et de dos ; l'essai rapide en jeu est proposé dès qu'une animation ou une taille compte.

## Pourquoi

Le personnage conçu au lot 1 (`jeu-character-design` : rôle, silhouette, comportement) devient deux fichiers et une image :
- une **entité de comportement** (pack de comportement) ;
- une **entité client** : modèle, texture, animations (pack de ressources).

Les pièges sont discrets mais visibles dès la première partie : une créature qui **glisse sans bouger les jambes**, une licorne **figée les pattes en l'air**, un PNJ **en double**, le nom « NPC » au-dessus d'une tête.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc (pour chaque entité, après sa fiche du lot 1)

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. La forme**
1. **Partir d'un modèle existant** (lequel, et ce qu'on masque) ou **un modèle à nous** ?
2. **Sa taille réelle** en blocs (hauteur, largeur), par rapport au joueur.
3. **Les parties qui bougent** : tête, bras, queue, ailes, crinière, mâchoire ?

**B. La texture**
4. **Le niveau de détail** :
   - pixel art fidèle à l'esprit du jeu ;
   - ou texture plus fine pour un personnage vedette, en sachant qu'une texture trop simple fait « pixélisé » et une trop fine jure avec le reste.
5. **La palette** : reprendre les couleurs de la fiche, et décider des ombres, reflets et motifs (étoiles, rayures, taches, écailles).
6. **Ce qui brille** dans le noir, et ce qui est **transparent**.

**C. Les animations**
7. **La marche** : style (raide, souple, bondissante, comique, menaçante), vitesse.
8. **Le repos** : respire, se balance, regarde les joueurs, fait un petit geste de temps en temps ?
9. **Le geste** quand on lui parle, et **l'attaque** pour une créature.
10. Les **animations spéciales** : s'envoler, se changer en brume, avaler, se rendormir.

**D. Les sons**
11. **Les sons du jeu** à reprendre (pas, cris, rire, grognement) : lesquels lui vont ?

**E. Le comportement dans le monde**
12. **Où et quand il apparaît** : posé par l'histoire, apparition naturelle, à l'entrée du groupe ?
13. **Combien à la fois**, et s'il revient après avoir été vaincu.
14. **Ce qu'il laisse** (butin) et à quoi ça sert dans le jeu.
15. Pour un PNJ : **le dialogue natif** (grande scène, portrait) ou **une fenêtre à boutons** (marchands, quêtes secondaires) ? Son nom affiché au-dessus de la tête ?
16. Pour une monture ou un compagnon : vitesse, saut, selle, apprivoisement, suit-il les joueurs ?

**F. La validation**
17. Une **planche** (face, profil, à taille réelle) et une description des animations : que changer ?
18. « Est-ce exactement ainsi que tu veux le voir bouger et vivre ? »

### En évolution
Pour une retouche (« trop pixélisée », « il glisse », « les pattes restent en l'air »), demander ce qui gêne précisément, proposer 2 ou 3 corrections (planche à l'appui), garder ce qui plaît (« des déplacements comme avant »).

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. Choisir la base
- **Partir d'une géométrie existante** quand la silhouette le permet. Elle peut être agrandie avec `minecraft:scale` : un troll, c'est le modèle de l'orc une fois et demie plus grand. Il faut alors masquer les accessoires en trop (rendre transparente la pointe d'un chapeau).
- **Une géométrie à soi** quand la silhouette est la signature du personnage : licorne détaillée, pieuvre, dragon.

### 2. L'entité de comportement
- **Familles** (`type_family`) : `monster` pour qu'elle compte comme monstre, une famille à soi pour la retrouver, `habitant` pour les PNJ.
- **PNJ** :
  - invincible (`damage_sensor` sans dégâts), non poussable, `knockback_resistance` 1 ;
  - `persistent`, `nameable` avec `always_show` ;
  - regard vers le joueur ;
  - sans navigation, s'il doit rester à sa place.
- **Créature** : vie, attaque et portée, déplacements, ciblage, **butin** (`minecraft:loot`), qui doit servir ailleurs dans le jeu (la bave de sangsue pour la potion de la sorcière).
- **Apparitions naturelles** (`spawn_rules`) : toujours une **densité maximale** (`minecraft:density_limit`) par créature, en plus du plafond commun. Sinon, préférer des créatures **posées par le script**, salle par salle, plafonnées, qui disparaissent loin des joueurs.

### 3. La texture
- **Générée par un script** (Pillow) plutôt que dessinée à la main : elle se refait d'une commande, se retouche par code, et garde le patron des faces juste. Voir `references/textures_patron.py` (la classe `Patron` peint chaque face d'un cube en « box UV »).
- **Taille** : 64 × 64 pour un humanoïde, plus fine (texture 4 fois plus grande que l'espace UV) pour une créature-vedette.
- **Lueurs** : des pixels à demi transparents brillent avec le matériau `entity_emissive_alpha` (yeux, cristaux, bâton).
- **Transparence** : `entity_alphatest` pour masquer des parties.

### 4. Les animations
- **Ne jamais compter sur la marche des créatures du jeu** :
  - `animation.humanoid.move` dépend d'une variable que seules les créatures du jeu calculent, donc la nôtre glisse ;
  - la marche des vaches balance jusqu'à 80° et reste figée à l'arrêt.
  
  Utiliser des marches **à nous**, qui dépendent de la vitesse (`query.modified_move_speed`) et reviennent au repos à l'arrêt. Voir `references/marche.animation.json`.
- **Personnages vivants** : une respiration au repos, et un **geste** quand on leur parle, joué par `/playanimation`. Voir `references/vie.animation.json`.
- Attaque (`variable.attack_time`) et recul (`query.hurt_time`) pour les créatures.

### 5. Les PNJ fiables
- **Un seul, à sa place** : le serveur charge le terrain **avant** les créatures. Juste après un chargement, un PNJ bien présent peut être invisible au script, qui en ferait apparaître un deuxième. Ne le faire revenir qu'après **trois constats d'absence** avec un vrai joueur à moins de 32 blocs, et supprimer les doublons. Voir `references/pnj.js`.
- **Son nom** : le dialogue natif remet parfois « NPC ». Remettre le nom régulièrement.
- **Dialogue** :
  - le **dialogue natif** (fichiers `dialogue/*.diag.json`, boutons qui lancent `/scriptevent`) convient aux grandes scènes ; il demande les **triches** sur le Realm ;
  - une **fenêtre de script** (`ActionFormData`) convient aux marchands, aux quêtes secondaires et aux outils.

### 6. Montures et compagnons
Selle, contrôle au sol, saut chargé, vitesse. Apprivoisement (`tame`) pour un compagnon. Sur un nouveau modèle, garder les **mêmes points d'articulation** des pattes, et vérifier la selle et le cavalier.

### 7. La planche
Rendre de face, et de profil si utile, chaque créature à partir de sa géométrie et de sa texture (un petit script de rendu suffit), côte à côte avec celles de la même zone. Pour la porte 1, la ranger dans `ressources/planches/` et la faire valider ; pour la porte 2, la refaire depuis le pack et la ranger dans `livrables/planches/`.

## Ce qu'on écrit dans docs/game-design/personnages.md (section « Réalisation dans l'addon »)

Pour chaque entité :
- sa base (modèle repris ou à nous) ;
- ses composants clés ;
- son apparition et son plafond ;
- son butin ;
- ses animations ;
- sa planche ;
- les points « non vérifiés en jeu » (animations, lueurs, monture).

## Code de référence (dans `references/`)

- `textures_patron.py` : peindre une texture en box UV, motifs, humanoïde, lueurs ;
- `marche.animation.json` : marches humanoïde et quadrupède à nous ;
- `vie.animation.json` : respiration, gestes, attaque, recul ;
- `pnj.js` : garder un seul PNJ à sa place.
