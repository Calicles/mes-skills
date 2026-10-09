# Règles communes des skills perso

Source unique. Chaque skill qui y renvoie l'applique en entier, ou seulement les sections qu'il cite ; ce qui est propre à un skill reste dans son SKILL.md. La section « Les deux portes, version générique (projets hors jeu) » ne vaut que pour les skills qui la citent ; les autres appliquent « Les deux portes : aucun code sans validation ».

## Les deux portes : aucun code sans validation

**Règle absolue, au-dessus de tout le reste du skill qui renvoie ici.** Rien de ce que les joueurs (ou les utilisateurs) verront, entendront ou liront n'est réalisé sans avoir passé deux portes de validation. Valider une scène, répondre à une carte ou dire « oui » sur un autre sujet n'ouvre aucune porte.

**Deux niveaux de fiche, aucun code dispensé.** Ce qui se voit passe par la **fiche complète** décrite à la porte 1. Le code invisible (refactor, architecture, réorganisation des fichiers, outillage, performance) passe par une **note technique courte** : ce qui change, pourquoi, ce qui ne doit pas changer pour les utilisateurs, comment on le vérifie. Elle se valide de la même façon (même fichier `docs/fiche-<étape>.md`, statut « VALIDÉE » après un « je valide » explicite). Un changement invisible qui touche quoi que ce soit de visible repasse par la fiche complète.

**Jamais de code sans l'accord de la personne.** Seule exception : un **essai rapide** pour juger d'un rendu ou d'une idée (une texture posée sur le serveur de test, un prototype jetable). Même là, Claude le **propose** et **demande** : il dit ce qu'il essaiera, pourquoi et ce qui sera jeté ensuite, puis attend l'accord. L'essai ne va jamais dans `main`, ne vaut pas validation et ne remplace aucune porte.

**Code jetable permis, code livré interdit avant la porte 1.** Les scripts qui servent à préparer la porte 1 (textures générées avec Pillow, rendu de modèles, banc de simulation, maquettes) sont permis sans attendre, à condition de rester dans `ressources/`. Le code livré (`src/`, les packs) n'est écrit qu'après la porte 1 ; un script jetable n'y entre jamais sans elle.

**Porte 1 — avant la moindre ligne de code** (aucun fichier créé ou modifié dans `src/` ou dans les packs, aucun commit de code avant elle) :
- **La fiche de réalisation** : la liste de **tout** ce que l'évolution ou l'étape fait apparaître, élément par élément. Par exemple : chaque texture, modèle, bloc, objet et son icône, chaque nom affiché, texte, message, son, musique, chaque chiffre de jeu (rareté, quantités, dégâts, durées, distances), chaque emplacement. En face de chaque élément : la décision de la personne, avec ses mots. Un élément qu'elle n'a pas tranché passe d'abord en interview (question ouverte, puis options et recommandation). Claude ne choisit rien seul, pas même « un détail ».
- **Les planches** de tout ce qui se voit (textures, icônes, modèles, lieux, fenêtres, écrans), dessinées **hors du projet livré**, dans `ressources/planches/`, montrées à la personne, retouchées autant qu'il faut.
- **Un « je valide » explicite** de la personne sur la fiche et les planches. Ce qui n'est pas sur la fiche n'est pas validé.

**Juste après la porte 1, avant le premier code** : estimer l'étape avec le skill `token-estimation` (palier S, M, L ou XL, jamais de nombre de tokens) et donner le palier à la personne. Une étape XL est découpée avant de coder : la personne valide le découpage, et la fiche validée est répartie entre les morceaux sans rien y changer.

**Pendant le code** : tout écart avec la fiche s'arrête et revient à la personne avant d'aller plus loin. Un écart, c'est un élément ajouté, une couleur ou un dessin retouché après essai, un chiffre ajusté, un texte reformulé, une limite technique qui change le rendu.

**Porte 2 — avant la fusion, la publication ou la livraison** :
- le **rendu final**, tiré des fichiers réellement intégrés (planches refaites depuis le projet, captures du banc d'essai), rangé dans `livrables/planches/` ;
- la **liste des écarts** avec la fiche validée, et ce qui reste **non vérifié en jeu** ;
- un **« je valide » explicite** de la personne sur ce rendu. Sans lui : pas de fusion, pas de publication, même si la personne avait demandé de fusionner avant de voir la porte 2.

**Ne jamais s'en dispenser** : « les décisions sont déjà prises », « c'est un petit ajustement », « on est déjà dans Claude Code » ne permettent de sauter ni une porte ni l'interview d'un skill. On ne saute un sujet que s'il est déjà tranché **par écrit dans `docs/`**, en le disant à la personne, qui confirme.

## Les deux portes, version générique (projets hors jeu)

**Règle absolue, au-dessus de tout le reste du skill qui renvoie ici.** Rien de ce que les utilisateurs verront, entendront ou liront n'est réalisé sans avoir passé deux portes de validation. Valider une scène, répondre à une carte ou dire « oui » sur un autre sujet n'ouvre aucune porte.

**Deux niveaux de fiche, aucun code dispensé.** Ce qui se voit passe par la **fiche complète** décrite à la porte 1. Le code invisible (refactor, architecture, réorganisation des fichiers, outillage, performance) passe par une **note technique courte** : ce qui change, pourquoi, ce qui ne doit pas changer pour les utilisateurs, comment on le vérifie. Elle se valide de la même façon (même fichier `docs/fiche-<étape>.md`, statut « VALIDÉE » après un « je valide » explicite). Un changement invisible qui touche quoi que ce soit de visible repasse par la fiche complète.

**Jamais de code sans l'accord de la personne.** Seule exception : un **essai rapide** pour juger d'un rendu ou d'une idée (un écran maquetté, un calcul essayé sur un exemple, un prototype jetable). Même là, Claude le **propose** et **demande** : il dit ce qu'il essaiera, pourquoi et ce qui sera jeté ensuite, puis attend l'accord. L'essai ne va jamais dans `main`, ne vaut pas validation et ne remplace aucune porte.

**Code jetable permis, code livré interdit avant la porte 1.** Les scripts qui servent à préparer la porte 1 (textures générées avec Pillow, rendu de modèles, banc de simulation, maquettes) sont permis sans attendre, à condition de rester dans `ressources/`. Le code livré (`src/`, les packs) n'est écrit qu'après la porte 1 ; un script jetable n'y entre jamais sans elle.

**Porte 1 — avant la moindre ligne de code** (aucun fichier créé ou modifié dans `src/` ou dans les packs, aucun commit de code avant elle) :
- **La fiche de réalisation** : la liste de **tout** ce que l'évolution ou l'étape fait apparaître, élément par élément. Par exemple : chaque écran et ce qu'il affiche, chaque texte (titres, boutons, messages, erreurs), chaque champ (nom, format, obligatoire ou non, valeur par défaut), chaque règle de calcul (formule, arrondi, cas limites), chaque donnée (ce qui est stocké, d'où elle vient, combien de temps on la garde). Pour un jeu vidéo, les skills des parcours ajoutent leur propre liste. En face de chaque élément : la décision de la personne, avec ses mots. Un élément qu'elle n'a pas tranché passe d'abord en interview (question ouverte, puis options et recommandation). Claude ne choisit rien seul, pas même « un détail ».
- **Les planches** de tout ce qui se voit (écrans, maquettes, exemples de données et de résultats calculés), dessinées **hors du projet livré**, dans `ressources/planches/`, montrées à la personne, retouchées autant qu'il faut.
- **Un « je valide » explicite** de la personne sur la fiche et les planches. Ce qui n'est pas sur la fiche n'est pas validé.

**Juste après la porte 1, avant le premier code** : estimer l'étape avec le skill `token-estimation` (palier S, M, L ou XL, jamais de nombre de tokens) et donner le palier à la personne. Une étape XL est découpée avant de coder : la personne valide le découpage, et la fiche validée est répartie entre les morceaux sans rien y changer.

**Pendant le code** : tout écart avec la fiche s'arrête et revient à la personne avant d'aller plus loin. Un écart, c'est un élément ajouté, une couleur ou un dessin retouché après essai, un chiffre ajusté, un texte reformulé, une limite technique qui change le rendu.

**Porte 2 — avant la fusion, la publication ou la livraison** :
- le **rendu final**, tiré des fichiers réellement intégrés (planches refaites depuis le projet, captures de l'application ou des résultats réels), rangé dans `livrables/planches/` ;
- la **liste des écarts** avec la fiche validée, et ce qui reste **non vérifié en usage réel** ;
- un **« je valide » explicite** de la personne sur ce rendu. Sans lui : pas de fusion, pas de publication, même si la personne avait demandé de fusionner avant de voir la porte 2.

**Ne jamais s'en dispenser** : « les décisions sont déjà prises », « c'est un petit ajustement », « on est déjà dans Claude Code » ne permettent de sauter ni une porte ni l'interview d'un skill. On ne saute un sujet que s'il est déjà tranché **par écrit dans `docs/`**, en le disant à la personne, qui confirme.

## La cohérence avec le jeu de base

**Tout ce qu'on ajoute doit se comporter comme ses équivalents du jeu, sauf décision contraire de la personne.** Les joueurs connaissent le jeu par cœur. Un minerai qui ne fond pas, une arme sans recette ou une créature sans butin les déroutent tout de suite. Dès qu'un élément nouveau apparaît (matériau, objet, bloc, créature, lieu, mécanique), poser en interview **la liste de son équivalent dans le jeu**, point par point. Pour chaque point, la personne tranche : **comme dans le jeu**, **autrement** (comment ?) ou **pas du tout** (pourquoi ?). Ces réponses vont dans la fiche de la porte 1. Ne jamais attendre que la personne remarque elle-même un manque en jouant.

Pour trouver l'équivalent, se demander : « quel élément du jeu ressemble le plus à celui-ci ? » (l'argent → le fer ; une nouvelle épée → l'épée en fer et l'épée en diamant ; un gardien → un mob hostile ; une pièce de la demeure → les blocs utilitaires du jeu). Puis passer en revue tout ce que cet équivalent fait, possède ou permet.

## Ce qui se voit : références, inventaire, contexte, essai

**Tiré d'un essai réel (le set en argent) : l'interview avait tranché les règles du jeu, mais pas l'apparence ni le contenu exact, et presque tout ce qui se voit a dû être repris après coup.** Pour tout élément visible, quatre réflexes, avant la porte 1 :

1. **Les images de référence d'abord.** Avant de dessiner quoi que ce soit, demander : « montre-moi un exemple que tu aimes » (capture d'un jeu, d'un pack, d'un dessin, d'un objet réel), puis faire dire ce qui plaît dedans (forme, contraste, couleurs, détails). Reformuler ce qu'on y lit et le faire confirmer. Sans référence, proposer 2 ou 3 directions dessinées, pas une seule.
2. **L'inventaire du contenu.** Un mot comme « un set », « des meubles » ou « des monstres » cache une liste : faire écrire chaque pièce, son rôle (arme ou outil, décor ou utilitaire, passif ou hostile) et sa place face aux éléments du jeu (au-dessus du fer, sous le diamant…). Demander ce qui manque : la personne a souvent en tête une pièce que personne ne lui a demandée (une masse d'armes, un marteau de guerre).
3. **Le rendu dans son vrai contexte.** Chaque planche montre l'élément là où les joueurs le verront : dans le menu (sur le gris de l'inventaire), à côté de son équivalent du jeu, tenu en main, porté sur le personnage, posé dans le monde, de jour et dans une grotte, et avec la lisibilité de l'écran réel (vidéoprojecteur, écran partagé à quatre). Distinguer ce que montre l'icône de ce que montre l'objet en main ou porté.
4. **L'essai rapide tôt.** Ce qu'une planche ne montre pas bien (une armure portée, un objet en main, un bloc sous la lumière du jeu) se propose **tôt** en essai rapide (accord de la personne, branche à part, jamais fusionnée), pas à la fin. Prévoir aussi l'outil de test qui donne tout l'élément d'un coup (le set, la matière, les blocs à essayer).

## Les règles de l'interview

**Trois niveaux de profondeur**
- Le niveau se choisit au début, en une carte avec une recommandation (en évolution, une fois pour tout le parcours) ; la personne peut toujours monter d'un niveau en route.
- **Retouche** (un détail d'un élément existant : une couleur, un texte, un chiffre, une animation) : seulement les questions qui touchent ce détail, et ses conséquences visibles ailleurs. Pas de voix des joueurs ni de scène si rien ne change pour eux ; récapitulatif en 2 lignes.
- **Ajout** (un élément nouveau dans un cadre existant : un objet, un personnage, une pièce, une quête) : les blocs touchés, en entier, avec la voix des joueurs si l'élément touche ce qu'ils vivent, et la scène.
- **Nouveau** (un lieu, une région, un système, un projet) : tous les blocs, l'interview complète.
- La section « En évolution » d'un skill dit quels blocs sont touchés ; le niveau dit jusqu'où les creuser. Le niveau ne change rien aux portes : même une retouche passe la porte 1, avec une fiche courte.

**Le mode « fiche pré-remplie à corriger »** (proposé par Claude ou demandé par la personne, à tout niveau)
- D'abord la question ouverte, en deux phrases (« raconte-moi ce que tu imagines »), pour que la fiche parte des mots de la personne.
- Puis Claude rédige la fiche complète à partir de `docs/` et de ce qui a été dit, et marque chaque ligne : **(tiré de docs/)**, **(tes mots)** ou **(proposé par Claude)**.
- La personne corrige ligne par ligne. Chaque ligne « proposé par Claude » est confirmée ou changée explicitement : aucune n'est validée par défaut. Une ligne sur laquelle elle hésite repasse en interview (question ouverte, puis options).
- La fiche corrigée passe la porte 1 comme une autre, avec un « je valide » explicite.

**Ouvrir avant de proposer**
- Chaque sujet s'ouvre par **une question ouverte**, en texte libre (pas de carte) : faire raconter, décrire, imaginer. Par exemple : « Ferme les yeux : tes joueurs arrivent devant… Qu'est-ce qu'ils voient, entendent, disent ? »
- **Reformuler** ce qui a été dit (« si je te suis bien… ») et **relancer** : pourquoi ? qu'est-ce que ça évoque ? ça ressemble à quoi que tu connais ? raconte-moi le moment où… Creuser chaque mot vague (« effrayant » : comme quoi, jusqu'où, pour qui ? « joli » : joli comment ?) jusqu'à ce que la personne dise « oui, c'est exactement ça ».
- **Ensuite seulement, les options** : 2 ou 3, en cartes (skill `poser-questions-en-cards` s'il est installé), pour **préciser ce que la personne a dit**, en partant de ses mots, ou pour l'aider si elle sèche (« je ne sais pas »). **La recommandation vient en dernier**, avec sa raison en une phrase. La personne peut toujours répondre autre chose.
- **Des options qu'on peut se représenter** :
  - des références nommées : jeux, films, dessins animés, livres, lieux réels, tableaux ;
  - des couleurs, des matières, des formes, des tailles, des sons décrits précisément ;
  - quand ça aide, une **image** (planche, plan, croquis, rendu) avant de faire choisir.
- **Une question par message.**

**Suivre son fil**
- Les sujets plus bas sont **une carte à couvrir, pas un ordre** : suivre ce que la personne amène, puis revenir, avant la fin du bloc, aux sujets qui n'ont pas été abordés.
- **Partir de ce qui est décidé** (`docs/`, réponses précédentes, skills déjà déroulés) : ne pas reposer une question tranchée, mais **signaler une contradiction** avec une décision antérieure.
- **Ne sauter un sujet que s'il ne concerne pas l'élément**, et le dire.

**La voix des joueurs (au début de l'interview, quand le sujet touche ce qu'ils vivent)**
- Avant les sujets : ce que les joueurs ont adoré, ignoré ou réclamé lors des parties passées, les phrases qu'ils ont dites, qui aime quoi (chaque joueur a ses goûts). Ne pas reposer ce qui a déjà été recueilli dans le parcours.
- Proposer **3 ou 4 questions à leur poser** (pour des enfants : courtes, concrètes, à poser au dîner ou après une partie), puis reprendre l'interview avec leurs réponses.
- **Signaler** quand ce que la personne imagine et ce que ses joueurs attendent semblent s'écarter, et en faire une question.

**Ce qui émerge**
- **Noter toute idée apparue en route**, même hors sujet, et demander régulièrement : « qu'est-ce qui te vient d'autre ? »
- **À la fin de chaque bloc** : un récapitulatif (5 lignes au plus) à valider, puis **relire les idées émergées**. Pour chacune, la personne décide : maintenant, plus tard (notée dans `docs/design.md`, avec les idées pour plus tard), ou abandonnée.

**Finir par la scène**
- Avant la fiche, **raconter la scène telle que les joueurs la vivront**, à la première personne, puis demander : « est-ce ce que tu imaginais ? qu'est-ce qui manque ? ». Chaque écart relance l'interview.
- Puis la **fiche complète** (et la planche s'il y en a une), validée ensemble, avant d'écrire quoi que ce soit dans `docs/` (`docs/design.md` ou le fichier du métier dans `docs/game-design/`). Les réponses y sont reprises avec les mots de la personne, avec les options écartées et les idées notées pour plus tard.
