---
name: jeu-video-parcours
description: "Ouvre et referme la grande interview de game design, une maïeutique : chaque métier pose ses questions, la personne donne la direction artistique point par point. Chef d'orchestre du game design d'un jeu vidéo (ou d'un mod, addon, carte d'aventure) : enchaîne dans l'ordre les skills métiers jeu-experience-joueur, jeu-gameplay, jeu-level-design, jeu-character-design, jeu-architecture et jeu-mobilier-decor, en entier pour un nouveau projet (après cadrage, design et wireframe), ou seulement ceux qu'une évolution touche. À utiliser dès qu'un projet perso est un jeu vidéo ou s'en approche (jeu, mod, addon Minecraft, aventure, quêtes, monde à explorer), à la fin de wireframing-perso ou pendant evolution-projet-perso, même si la personne ne dit pas « game design ». Pour un addon Minecraft, passe ensuite la main à mc-addon-parcours."
---

# Parcours game design (lot 1)

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Ce qui se voit » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill** : le lot 1 ne code rien, mais il mène au code. Il ne passe la main à `mc-addon-parcours` ou à la réalisation qu'avec, pour chaque métier touché, sa fiche validée. Ces fiches nourrissent la porte 1.

**Dans ce parcours** : à l'ouverture d'une évolution, repérer chaque élément nouveau et son équivalent dans le jeu, puis vérifier que chaque métier touché a bien passé en revue sa liste de cohérence avant de fermer son interview.

**Dans ce parcours** : vérifier, avant de fermer chaque métier, que les références ont été demandées, que l'inventaire du contenu est écrit et que les planches ont été vues dans leur contexte.

## Quand utiliser ce skill

Deux entrées, toujours après les skills de projet de la personne :

1. **Nouveau projet** : après `cadrage-projet-perso`, `design-solution-perso` et `wireframing-perso`, quand le projet est un jeu vidéo (ou un mod, un addon, une carte d'aventure). Le design général existe ; ce parcours l'approfondit métier par métier, avant toute réalisation.
2. **Évolution** : pendant `evolution-projet-perso`, quand l'évolution touche le jeu (un lieu, un personnage, une quête, une ambiance…). On ne déroule alors que les métiers concernés.

Si le jeu est un **addon Minecraft**, enchaîner à la fin avec `mc-addon-parcours` (lot 2), qui traduit chaque décision en blocs, entités et scripts.

## Règles communes (reprises des skills de projet)

- **Un projet = un dépôt GitHub privé** ; lire `CLAUDE.md`, `docs/cadrage.md`, `docs/design.md` (et `docs/wireframe.md`, `docs/game-design/`, `docs/journal-decisions.md`) avant tout. Après chaque écriture : commit clair et push.
- **Un message = un seul lot**, le plus petit possible. Ne jamais trancher plusieurs décisions dans la même question.
- **Toute décision qui touche l'expérience du joueur ou une transition** (arrivée, départ, apparition d'un lieu ou d'un personnage, passage d'une étape à l'autre) est proposée en **2 ou 3 options avec une recommandation**, jamais tranchée seul.
- **Les documents décrivent ce qui existe vraiment** : chaque métier écrit ses décisions dans son fichier de `docs/game-design/`, avec les options écartées et pourquoi. En évolution, chaque décision a aussi une entrée datée dans `docs/journal-decisions.md`.
- **Projet perso par défaut** : ton simple, pas de jargon d'entreprise. Expliquer un terme de game design en une phrase la première fois.

## L'interview d'ouverture (avant le premier métier)

**Le parcours est une grande maïeutique : chaque métier mène son interview, et la personne exprime, aussi loin que possible, ce qu'elle imagine ; ce qui n'était pas encore formulé a le droit d'émerger.** Le but : produire ce qui lui ressemble et ce que ses joueurs attendent. Ce skill ouvre et referme l'interview. Les règles (questions ouvertes d'abord, reformuler et relancer, options et recommandation seulement ensuite, suivre le fil de la personne, la voix des joueurs, les idées qui émergent, finir par la scène racontée) sont détaillées dans chaque skill métier.

1. **Nouveau projet ou évolution ?**
2. **Pour une évolution : quel genre d'évolution ?** Une carte à choix multiples (on peut cocher plusieurs types, ou décrire autre chose) :

   | Type | Métiers ouverts |
   |---|---|
   | Un nouveau **décor** ou un lieu réaménagé | mobilier et décor (+ architecture s'il y a un bâtiment, level design s'il change la carte) |
   | Un nouveau **lieu** ou une nouvelle zone | level design, architecture, mobilier, expérience joueur (son ambiance) |
   | Un **événement** (invasion, objet découvert qui déclenche quelque chose, événement lancé par le maître du jeu) | gameplay (bloc « Les événements »), expérience joueur (sa mise en scène), character design (s'il amène des créatures) |
   | Une **quête** : simple, en chaîne, à tiroirs, à embranchements | gameplay (bloc « Les quêtes », dont sa forme), character design (qui la confie), level design (où elle mène) |
   | Un **personnage**, une créature, un animal | character design (+ gameplay s'il donne des quêtes, architecture s'il a une maison) |
   | Un **objet** ou une récompense | gameplay (bloc « Les récompenses »), expérience joueur (sa mise en scène) |
   | Une **ambiance** (musique, lumière, météo, transition) | expérience joueur |
   | Une **retouche** de l'existant | le métier de l'élément retouché, sur ses blocs touchés |

   Puis : l'évolution en une phrase, et la liste des métiers retenus, à faire valider.
   **La profondeur, en évolution** : seuls les **blocs touchés** de chaque métier sont posés, à la profondeur du niveau choisi (retouche, ajout ou nouveau, voir « Les règles de l'interview » dans `references/regles-communes.md`), et la personne peut demander le mode « fiche pré-remplie à corriger ». Ne sauter que les questions déjà tranchées dans `docs/`, en le disant.
3. **Le portrait des joueurs**, une fois pour tout le parcours (question ouverte d'abord) : qui sont-ils, ce que chacun aime, ce qu'ils ont adoré, ignoré ou réclamé lors des parties passées, leurs phrases. Chaque métier part de ce portrait et ne le repose pas.
   **Les co-auteurs** : les joueurs participent-ils à certaines questions (noms, personnages, couleurs) ? Proposer, à chaque métier qui les touche, 3 ou 4 questions à leur poser, puis reprendre avec leurs réponses.
4. **Le tableau d'inspiration global** : d'abord « qu'est-ce qui te vient quand tu imagines ce jeu ? », puis 3 à 5 œuvres qui en résument l'esprit, avant d'entrer dans les métiers. Il servira de référence commune à toutes les interviews.
5. **Les images** : la personne veut-elle des planches à chaque étape (personnages, bâtiments, cartes), ou seulement pour les éléments importants ?

À la fin du parcours :
6. **La revue de cohérence** (voir le déroulé) présentée point par point. Chaque contradiction trouvée devient une question, jamais une correction silencieuse.
7. **La séance racontée** : une partie entière racontée du point de vue des joueurs, puis « est-ce ce que tu imaginais ? qu'est-ce qui manque ? ».
8. **Les idées émergées** pendant tout le parcours, relues une dernière fois : maintenant, plus tard (notées dans `docs/design.md`), ou abandonnées.
9. **La fiche de game design complète**, relue ensemble avant le relais.

## L'ordre des métiers, et pourquoi

| # | Skill | Ce qu'il fixe | Pourquoi à ce rang |
|---|---|---|---|
| 1 | `jeu-experience-joueur` | Ce que le joueur doit ressentir, pour qui, les transitions, l'ambiance | Tout le reste en découle : on conçoit pour une émotion et un public |
| 2 | `jeu-gameplay` | Boucles, quêtes, objectifs, récompenses, progression | Ce que le joueur fait, au service de l'expérience |
| 3 | `jeu-level-design` | Structure du monde, guidage, rythme, verrous, frontières | Où il le fait |
| 4 | `jeu-character-design` | Mobs, PNJ, animaux passifs | Avec qui (ou contre qui) |
| 5 | `jeu-architecture` | Bâtiments et grands lieux construits | Les décors majeurs des niveaux |
| 6 | `jeu-mobilier-decor` | L'intérieur, les objets, la densité de détails | La dernière couche, qui fait « vivant » |

Chaque métier peut renvoyer au précédent : si le level design révèle qu'une quête est mal rythmée, revenir au gameplay le dire, plutôt que de compenser en silence.

## Déroulé — nouveau projet

1. **Annoncer le parcours** en un message court : les six métiers, l'ordre, le fait qu'on avance un métier à la fois avec validation.
2. **Dérouler chaque skill métier** dans l'ordre. Pour chacun : charger le skill, **mener son interview en entier** (questions ouvertes d'abord, options ensuite, récapitulatif et idées émergées relus à chaque bloc, scène racontée à la fin), puis seulement appliquer son savoir-faire, écrire son fichier dans `docs/game-design/` (titre « Game design — <métier> »), commit + push.
3. **Passer en revue la cohérence** à la fin (un seul message de synthèse) :
   - chaque fonctionnalité du design est-elle couverte par au moins un métier ?
   - une décision d'un métier en contredit-elle une autre (ton enfantin mais méchant effrayant, quête longue mais zone minuscule…) ?
   - le joueur a-t-il toujours quelque chose à faire, à voir et une raison d'avancer ?
4. **Définir les points à vérifier en jeu** : chaque métier ajoute ses critères à la definition of done du design (lisibilité, rythme, ambiance…). Ils serviront aux tests.
5. **Relais** :
   - addon Minecraft → charger `mc-addon-parcours` ;
   - autre jeu avec code → message à coller dans Claude Code : « Lis CLAUDE.md et docs/, puis prépare la première étape de docs/design.md : commence par la porte 1 (fiche et planches à me faire valider), sans coder avant mon accord. » ;
   - projet sans code (jeu de société, jeu papier, scénario) → la suite est la production des livrables.

## Déroulé — évolution

1. **Repérer les métiers touchés** avec la carte « quel genre d'évolution ? » de l'interview d'ouverture, et les faire valider. Exemples :
   - « un nouveau PNJ qui donne des quêtes » → character design, gameplay, (architecture s'il a une maison) ;
   - « un nouveau donjon » → level design, gameplay, architecture, mobilier, character design (ses créatures) ;
   - « une musique par lieu » → expérience joueur seule ;
   - « une invasion du domaine » → gameplay (événements), expérience joueur, character design (les envahisseurs) ;
   - « une quête à tiroirs chez un nouveau PNJ » → gameplay (forme des quêtes), character design, level design.
2. **Dérouler seulement ces skills**, dans l'ordre du tableau, en menant **leur interview** sur tout ce que l'évolution ajoute ou change ; ne sauter que les questions déjà tranchées dans `docs/`, en le disant.
3. **Écrire les décisions** dans `docs/journal-decisions.md` (datées) et mettre à jour les fichiers concernés de `docs/game-design/`.
4. **Relais** vers `mc-addon-parcours` (addon Minecraft) ou vers la réalisation, **seulement** avec la fiche validée de chaque métier touché. La réalisation commence par la porte 1, jamais par du code.

## Ce que ce skill n'est pas

Il ne remplace pas le cadrage, le design ni le wireframe de la personne : il vient après, pour la partie « jeu ». Il ne code pas : la réalisation commence après lui (ou dans `mc-addon-parcours` pour Minecraft).
