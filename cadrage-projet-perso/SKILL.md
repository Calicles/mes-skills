---
name: "cadrage-projet-perso"
description: "Mène un cadrage guidé comme une maïeutique, en petits lots validés un par un : questions ouvertes d'abord pour faire exprimer ce que la personne imagine, voix des futurs utilisateurs, idées qui émergent notées (challenge du besoin, contexte, cible, contraintes, benchmark), puis enregistre docs/cadrage.md dans le dépôt GitHub privé du projet (source unique de vérité, avec ou sans code)."
---

# Cadrage de projet

## Quand utiliser ce skill

Pour cadrer un projet avant de le construire : side-project, app perso, projet créatif, organisation à la maison, recherche, rédaction, etc. Le but est de creuser ce que la personne veut vraiment avant de commencer, pour éviter de partir dans la mauvaise direction ou de découvrir en cours de route qu'un besoin important n'avait pas été dit.

Dans cet espace, tous les projets sont personnels par défaut : ne jamais demander à la personne de confirmer que le projet est "perso", et ne pas ajouter de vocabulaire ou d'étapes de gestion de projet corporate (pas de "parties prenantes", "gouvernance", "comité de pilotage", validation budgétaire formelle) par défaut. Traiter le projet comme professionnel uniquement si la personne le dit explicitement ("c'est pour le boulot", "projet client", etc.) ; dans ce cas seulement, adapter le vocabulaire et ajouter les éléments pro pertinents.

## Emplacement de référence du projet (règle commune à tout le workflow)

Un projet = UN dépôt GitHub privé = UN seul endroit pour tout ce qui le concerne (documents de référence, livrables, ressources, et code s'il y en a), quelle que soit la surface utilisée (Claude, Cowork, Claude Code, Claude AI) et que le projet nécessite du code ou non. Même structure dans les deux cas : passer d'un projet sans code à un projet avec code ne déplace aucun fichier.

- **Dépôt** : un dépôt privé par projet, sur le compte GitHub personnel de la personne (le récupérer avec `gh api user --jq .login`, sans jamais l'écrire en dur), nom court en kebab-case, avec le topic `projet-perso` et un topic de type : `avec-code` ou `sans-code`. Retrouver tous les projets avec `gh repo list --topic projet-perso`.
- **Structure (identique avec ou sans code)** :
  - `docs/` : UNIQUEMENT les documents de référence — `cadrage.md`, `design.md`, `wireframe.md` (nom au singulier), `wireframe.html` (source des wireframes), plus `docs/game-design/` pour un jeu vidéo (un fichier par métier : `experience-joueur.md`, `gameplay.md`, `level-design.md`, `personnages.md`, `architecture.md`, `mobilier-decor.md`), `journal-decisions.md` (les décisions datées) et `fiche-<étape>.md` (les fiches de réalisation) ;
  - `livrables/` : tout ce que le projet produit (rapports, tableurs, exports...). Si un livrable vit dans un Doc ou un artifact claude.ai, y ranger son export ou sa source, ou à défaut son lien dans `livrables/liens.md` ;
  - `ressources/` : recherches, sources, notes de travail ;
  - `src/` : le code, uniquement pour les projets avec code ;
  - `CLAUDE.md` à la racine, TOUJOURS créé, même sans code (voir le modèle ci-dessous) ;
  - `README.md` d'une ligne.
- **Aucune autre copie de référence** : ne rien enregistrer dans un dossier local, dans l'espace de travail cloud seul, dans la mémoire ou dans un Projet Claude. Un lien vers le dépôt ailleurs est possible, jamais une copie qui pourrait diverger.
- **Lire / écrire** : cloner le dépôt (ou faire `git pull`) avant de lire ; après chaque écriture, faire un commit avec un message clair puis `git push` (par exemple "docs: cadrage v1"). Ne jamais laisser un fichier modifié sans l'avoir poussé.
- **Si GitHub est inaccessible** depuis la surface en cours : le dire clairement à la personne, ne pas enregistrer ailleurs en silence, garder le contenu dans la conversation et proposer de le pousser dès que l'accès est possible.

### Modèle de CLAUDE.md (à créer avec le dépôt, à tenir à jour)

Claude Code lit ce fichier automatiquement ; les autres surfaces doivent le lire en début de travail. Remplacer `<...>` et ne garder, à la règle 2, que la variante qui correspond au type du projet.

```
# <Nom du projet>

Projet perso. Type : <à déterminer | sans code | avec code>

## Documents de référence (source unique de vérité)
- docs/cadrage.md — le besoin, le contexte, le périmètre
- docs/design.md — la solution retenue, les fonctionnalités, les livrables ou les choix techniques, la definition of done
- docs/wireframe.md et docs/wireframe.html — les parcours et les écrans (s'ils existent)
- docs/game-design/ — pour un jeu vidéo, un fichier par métier du game design (s'il existe)
- docs/journal-decisions.md — les décisions prises pendant la réalisation, datées
- docs/fiche-<étape>.md — la fiche de réalisation de chaque étape (règle 0)

## Où ranger quoi
- docs/ : uniquement les documents de référence ci-dessus.
- livrables/ : tout ce que le projet produit (rapports, tableurs, exports...). Pour un livrable qui vit dans un Doc ou un artifact claude.ai, y ranger son export ou sa source, ou à défaut son lien dans livrables/liens.md.
- ressources/ : recherches, sources, notes de travail.
- src/ : le code (projets « avec code » uniquement).
- Aucune copie de référence en dehors de ce dépôt (ni dossier local, ni mémoire, ni Projet Claude).

## Règle 0 (avant toutes les autres)
Aucun code dans src/ tant que docs/fiche-<étape>.md n'a pas le statut « VALIDÉE ».
Ce statut n'est écrit qu'après un « je valide » explicite de la personne, jamais par Claude de lui-même.
Pas de fiche, ou fiche pas encore « VALIDÉE » : on complète la fiche, on ne code pas.
Un hook (.claude/hooks/porte1.py) bloque l'écriture dans src/ tant que chaque fiche n'a pas sa ligne « Statut : VALIDÉE ».

## Règles de travail
1. Lire docs/ avant d'agir.
2. Variante avec code : le code est écrit dans ce dépôt, avec Claude Code.
   Variante sans code : ne pas coder ; si un besoin de code apparaît, passer d'abord par le skill evolution-projet-perso (section « Passage en code »).
3. Tout changement qui touche au besoin, au périmètre, aux fonctionnalités, aux parcours, aux écrans, aux livrables ou aux choix techniques met à jour le ou les documents concernés dans le même commit. Les documents doivent toujours décrire ce qui existe vraiment, pas ce qui était prévu.
4. Les décisions prises pendant la réalisation (et pourquoi) sont notées dans docs/journal-decisions.md, une entrée datée par décision, et le document concerné est mis à jour. Les sections « Décisions en réalisation » déjà écrites restent en place.
5. Vérifier la definition of done de docs/design.md avant de dire que la v1 est terminée.
```

## Qui réalise le projet

Dans cet espace, toute implémentation technique nécessaire pour un projet cadré ici (application, automatisation, script, artifact...) est réalisée par Claude Code, dans le dépôt du projet, dans une étape ultérieure — pas par la personne elle-même, et pas dans cette conversation. C'est l'hypothèse par défaut, même si la personne ne le précise pas. Un projet qui ne nécessite aucun code (méthode, organisation, recherche, rédaction...) n'a rien à implémenter : ses livrables sont produits par Claude depuis n'importe quelle surface et rangés dans `livrables/`.

Conséquence concrète sur le cadrage : ne pas demander à la personne comment elle compte coder ou construire techniquement la solution, ni évaluer ses compétences de développement — ce n'est pas pertinent puisque ce n'est pas elle qui implémente. Se concentrer à la place sur les contraintes qui influenceront ce que Claude devra construire ou produire : sur quel support ça doit tourner (téléphone, ordinateur, via l'application Claude ou un artifact accessible autrement...), en ligne ou hors-ligne, budget éventuel pour des services tiers si le besoin en nécessite, temps disponible de la personne pour suivre/tester le projet. Si la personne mentionne explicitement qu'elle veut coder elle-même ou utiliser un outil no-code précis, en tenir compte à la place de l'hypothèse par défaut.

## Principe général : un lot très court à la fois

Mener une conversation guidée, un thème à la fois — jamais plusieurs thèmes regroupés dans le même message —, en creusant chaque réponse avec des relances plutôt qu'en acceptant la première réponse superficielle. Laisser la personne répondre à un thème avant de passer au suivant, creuser si la réponse est vague, évidente ou trop rapide. Rester dans un ton simple et direct.

Règle valable pour tout le skill, pas seulement pour poser les thèmes : un message = un seul lot, le plus petit possible pour rester vérifiable d'un coup d'œil (une question, un thème, une reformulation à confirmer, ou un seul élément de synthèse). Ne jamais regrouper deux thèmes, ni un thème et un résumé d'un thème précédent, dans le même message. La seule exception est une étape qui a besoin d'une vue d'ensemble pour être utile : le benchmark (phase 2) reste présenté comme une liste groupée de solutions, parce que comparer les solutions entre elles est le but même de l'étape.

Si la personne a déjà répondu spontanément à un thème plus loin dans la liste, ne pas le redemander : le résumer et confirmer que c'est bien ça — dans un message court dédié à ce seul thème, pas mélangé avec le thème en cours.

## La maïeutique (l'esprit de tout le cadrage)

Les questions de ce skill ne sont pas un formulaire à remplir : elles servent à faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et à laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce qu'attendent vraiment ceux qui s'en serviront. Claude ne tranche rien seul ; ses propositions servent à affiner ce que la personne a exprimé, jamais à le remplacer.

- **Ouvrir avant de proposer** — chaque thème s'ouvre par une question ouverte qui fait raconter : une situation vécue, un moment précis, ce que la personne imagine (« raconte-moi la dernière fois que… », « ferme les yeux : le projet existe, qu'est-ce qui a changé ? »). Reformuler ce qui a été dit (« si je te suis bien… ») et relancer : pourquoi ? qu'est-ce que ça évoque ? ça ressemble à quoi que tu connais ? raconte-moi le moment où… Creuser chaque mot vague jusqu'à ce que la personne dise « oui, c'est exactement ça ». Les options (2 ou 3, en cartes avec le skill `poser-questions-en-cards` s'il est installé) ne viennent qu'**ensuite**, en partant de ses mots, pour préciser ou pour l'aider si elle sèche ; la recommandation vient en dernier, avec sa raison en une phrase.
- **Suivre son fil** — l'ordre des thèmes de la phase 1 est un repère, pas un script : si la personne part ailleurs, la suivre, puis revenir aux thèmes qui n'ont pas été abordés avant de conclure. Ne pas reposer ce qui est déjà dit ou tranché, mais signaler une contradiction.
- **La voix des utilisateurs** — dès que d'autres personnes que la personne elle-même se serviront du projet (famille, enfants, amis, joueurs), recueillir ce qu'elle sait d'eux : ce qu'ils aiment, ce qu'ils font aujourd'hui, ce qu'ils ont dit, réclamé, ignoré, et qui aime quoi. Proposer **3 ou 4 questions à leur poser** (courtes et concrètes, adaptées à leur âge), puis reprendre avec leurs réponses. Signaler quand ce que la personne imagine et ce que les utilisateurs semblent attendre s'écartent, et en faire une question.
- **Ce qui émerge** — noter toute idée apparue en route, même hors sujet, et demander régulièrement « qu'est-ce qui te vient d'autre ? ». Relire ces idées à la fin de chaque grand bloc ; pour chacune, la personne décide : maintenant, plus tard (notée dans le document, section des idées pour plus tard), ou abandonnée.
- **Finir par la scène** — avant la relecture finale, raconter en quelques lignes une scène concrète de la vie avec le projet réussi (« un mardi soir, dans 3 mois… »), du point de vue de la personne et de ses utilisateurs, puis demander : « est-ce ce que tu imaginais ? qu'est-ce qui manque ? ». Chaque écart relance l'interview avant d'enregistrer la fiche.

Ces principes s'ajoutent aux règles ci-dessous (un lot court par message, challenge, garde-fous) sans les remplacer : une question ouverte reste une seule question, et un message reste un seul lot.

## Challenger le besoin, surtout si on part déjà d'une solution

Le réflexe le plus courant est de décrire directement une solution ("je veux une app qui fait X", "il faudrait un tableau avec Y", "je vais coder un script qui...") plutôt que le problème sous-jacent. Dès que ça arrive — dès le point de départ ou à n'importe quel moment du cadrage — ne pas embrayer sur la solution comme si elle était acquise : revenir en arrière et challenger avant d'avancer. Ce challenge n'est pas une politesse ponctuelle à un seul moment du cadrage, c'est un réflexe à réappliquer chaque fois qu'une réponse (contexte, cible, contraintes, périmètre, benchmark...) glisse de nouveau vers une solution non justifiée.

Signes qu'on entre trop vite dans la solution : la personne décrit une fonctionnalité, un outil ou une techno précise avant d'avoir dit quel problème ça résout ; elle justifie un choix par "parce que c'est comme ça que ça marche d'habitude" plutôt que par un besoin ; elle passe directement à "comment faire" sans qu'on ait validé le "pourquoi".

Dans ces cas, challenger activement plutôt que de simplement creuser poliment :
- Renvoyer la solution comme hypothèse, pas comme acquis : "Si je comprends bien, [solution], c'est ta réponse à quel problème exactement ?"
- Demander ce qui se passerait si on ne faisait rien : "concrètement, qu'est-ce qui te gêne aujourd'hui si ce projet n'existe pas ?" Si la réponse est floue ou faible, le dire franchement plutôt que de continuer comme si le besoin était solide.
- Proposer une alternative plus simple ou opposée et demander pourquoi elle ne suffirait pas ("est-ce qu'un simple [alternative basique, ex: post-it, appli existante, tableur] ne réglerait pas déjà 90% du problème ?").
- Ne pas lâcher après une seule relance si la réponse reste une reformulation de la solution plutôt qu'une explication du besoin — insister avec un "pourquoi" supplémentaire.
- Rester honnête même si ça déplait : si un besoin semble faible, inventé après coup pour justifier une envie de construire quelque chose, ou si le projet ressemble à "j'ai envie de faire un projet" plutôt qu'à "j'ai un problème à résoudre", le dire clairement plutôt que de valider poliment. Ça n'empêche pas de continuer si la personne veut construire le projet quand même (envie d'apprendre, plaisir de faire, etc.), mais il faut alors le nommer comme tel dans la fiche finale plutôt que d'habiller ça en "vrai besoin" urgent.

## Avant de commencer : retrouver ou créer le dépôt du projet

Applique la règle "Emplacement de référence" ci-dessus. Avant de poser la première question de cadrage :

1. **Chercher si le projet existe déjà** : `gh repo list --topic projet-perso` (et, si la personne cite un projet existant, chercher par nom). S'il existe, cloner/mettre à jour le dépôt, lire `CLAUDE.md` et `docs/`, et ne pas recréer de dépôt. Si des documents du même projet traînent ailleurs (dossier local, mémoire, Projet Claude, ancien nom `wireframes.md`), le signaler et proposer de les rapatrier avec le skill `migration-projet-perso` (une seule fois), puis de ne garder qu'un lien vers le dépôt.
2. **Sinon, créer le dépôt** : privé, nom court en kebab-case proposé à la personne (une confirmation d'une ligne suffit), topic `projet-perso`, avec un `README.md` d'une ligne, les dossiers `docs/`, `livrables/` et `ressources/` (git ne versionne pas les dossiers vides : y déposer un fichier `.gitkeep`) et un `CLAUDE.md` initial selon le modèle ci-dessus, avec `Type : à déterminer`. Le créer dès maintenant, pas à la fin, pour que tout le travail de cadrage ait un seul endroit où atterrir.
3. **Déterminer tôt le type du projet** : dès que la solution probable est visible (le plus souvent dès le point de départ ou au plus tard à la fin de la phase 1), établir s'il nécessite du code (application, site, script, automatisation) ou non (méthode, organisation, recherche, rédaction, suivi...). Le confirmer à la personne en une phrase, puis mettre à jour la ligne `Type` de `CLAUDE.md` et le topic du dépôt (`gh repo edit --add-topic avec-code` ou `--add-topic sans-code`), commit et push.
   - *Avec code* : "ce projet sera codé dans Claude Code, dans ce même dépôt ; ici on prépare le cadrage, le design et les wireframes pour que Claude Code puisse démarrer vite, mais après la porte 1 : aucun code avant que la fiche de la première étape soit validée par un « je valide »". Ne pas coder dans cette conversation. Dès que le type « avec code » est confirmé, installer le hook de la porte 1 : copier `references/hook-porte1/porte1.py` dans `.claude/hooks/porte1.py` et `references/hook-porte1/settings.json` dans `.claude/settings.json` (s'il existe déjà, y ajouter seulement le bloc `PreToolUse`), puis vérifier qu'une écriture dans `src/` est refusée tant qu'aucune fiche n'est « VALIDÉE ».
   - *Sans code* : "ce projet n'a pas besoin de code ; tout reste dans ce dépôt (docs/, livrables/, ressources/). Si un besoin de code apparaît plus tard, le passage en code se fait sans rien déplacer."
   Si le type change en cours de cadrage, mettre à jour `CLAUDE.md` et le topic en conséquence.

## Phase 1 — Creuser le besoin

Couvrir ces thèmes un par un (voir "Principe général"), en suivant le fil de la personne (voir "La maïeutique" : l'ordre ci-dessous est un repère), en adaptant le vocabulaire au projet (reformuler naturellement, ne pas lire les questions telles quelles). Appliquer le challenge ci-dessus dès que la réponse à un thème glisse vers une solution non justifiée :

1. **Point de départ** — qu'est-ce qui a donné l'idée, quelle est la demande initiale telle qu'elle est formulée pour l'instant.
2. **Le vrai besoin derrière la demande** — creuser avec des "pourquoi" successifs (2-3 niveaux minimum, plus si les réponses restent des solutions) jusqu'à distinguer la solution imaginée du problème réel. Exemple : "je veux une app pour noter mes dépenses" → pourquoi ? → "pour savoir où part mon argent" → pourquoi ? → "parce que je suis surpris en fin de mois". Le vrai besoin est souvent plus simple ou différent que la première formulation. C'est le thème où le réflexe de challenge (section précédente) s'applique le plus fort.
3. **Besoins non exprimés** — poser des questions qui font émerger ce que la personne n'a pas pensé à dire : qu'est-ce qui te frustrerait si ça manquait, qu'est-ce que tu fais aujourd'hui pour compenser l'absence de ce projet, y a-t-il un moment où tu as pensé "ça serait bien si...", qu'est-ce que quelqu'un d'autre remarquerait qui te semble évident à toi mais que tu n'as pas mentionné. Utiliser des mises en situation concrètes plutôt que des questions abstraites.
4. **Contexte d'utilisation** — où, quand, à quelle fréquence, sur quel support (téléphone, ordinateur, les deux), seul ou avec d'autres, en ligne ou hors ligne, dans quel état d'esprit (rapide/distrait vs posé/concentré).
5. **Cible utilisateur** — qui va vraiment s'en servir : juste la personne, un cercle proche (famille, amis), un public plus large. Si plusieurs profils, les distinguer et identifier le principal. Puis **la voix des utilisateurs** (voir "La maïeutique") : ce que la personne sait d'eux, et 3 ou 4 questions à leur poser, à reprendre avec leurs réponses avant de finaliser.
6. **Résultat attendu** — à quoi ressemble la réussite concrètement. Demander une image très concrète : "dans 3 mois, qu'est-ce qui te ferait dire que c'était réussi ?" Distinguer le résultat (l'effet recherché) du livrable (l'objet construit ou produit).
7. **Contraintes** — techniques d'usage (téléphone / ordinateur / les deux, via l'application Claude ou autrement, hors-ligne, outils déjà utilisés), temps disponible de la personne pour suivre/tester le projet, budget éventuel pour des services tiers, ce qui doit absolument être évité. Ne pas demander les compétences techniques de la personne (voir "Qui réalise le projet" ci-dessus) sauf si elle a dit vouloir coder elle-même.
8. **Périmètre (v1)** — ce qui est clairement dans le projet vs ce qui est explicitement laissé de côté pour l'instant. Demander explicitement "qu'est-ce qu'on met volontairement de côté pour une v1 ?"
9. **Déjà essayé** — question rapide : a-t-elle déjà essayé quelque chose (une app, un outil, une méthode) pour répondre à ce besoin, et pourquoi ça n'a pas suffi. Cette réponse sert directement d'input à la phase de benchmark qui suit.

## Phase 2 — Benchmark de solutions existantes

Une fois le besoin, le contexte, la cible, le résultat attendu et les contraintes clarifiés (phase 1 terminée), faire une recherche active de solutions existantes qui répondent au besoin identifié, avant de finaliser le cadrage :

- Utiliser la recherche web pour trouver des solutions réelles et à jour (apps, outils, sites, méthodes) qui adressent le même besoin, en tenant compte de ce qui a déjà été essayé (thème 9) et des contraintes définies (support, budget, hors-ligne...). Garder les sources utiles dans `ressources/` du dépôt.
- Présenter une sélection courte (3 à 6 solutions), chacune avec : ce qu'elle fait bien par rapport au besoin exprimé, ses limites ou ce qui lui manque par rapport aux besoins non exprimés ou aux contraintes de la personne, et des infos pratiques (gratuit/payant, support technique). Cette liste reste groupée dans un seul message (exception au principe des lots courts), parce que comparer les solutions entre elles est le but de l'étape.
- Demander à la personne ce qu'elle veut retenir comme inspiration parmi ces solutions (une fonctionnalité précise, un principe d'organisation, un choix d'interface...) et ce qu'elle veut explicitement éviter ou faire différemment.
- Si une des solutions trouvées répond déjà pleinement au vrai besoin identifié en phase 1, le dire franchement (ça fait partie du challenge) plutôt que d'enchainer sur la construction d'un nouveau projet par défaut.
- Ces choix d'inspiration servent ensuite à finaliser le périmètre et les priorités en phase 3 : le benchmark n'est pas une simple liste informative, il alimente directement les décisions du cadrage.

## Phase 3 — Finaliser

10. **Priorités** — parmi tout ce qui a été dit (y compris les inspirations retenues du benchmark), qu'est-ce qui est indispensable dès la v1 vs ce qui peut attendre (must have / nice to have).
11. **Risques et inconnues** — qu'est-ce qui pourrait faire échouer ou abandonner le projet (motivation, complexité technique, temps), qu'est-ce qui n'est pas encore clair et devra être décidé en cours de route.
12. **Première étape concrète** — quelle est la plus petite chose faisable qui ferait avancer réellement le projet.

## À la fin

Produire une fiche de cadrage structurée (titres clairs, prose ou courtes listes selon ce qui est le plus lisible) reprenant : le vrai besoin (et, si pertinent, la manière dont il a été challengé/clarifié par rapport à la demande initiale), le contexte d'usage, la cible, le résultat attendu, les contraintes, le périmètre (inclus/exclu), le benchmark (solutions étudiées et inspirations retenues), les priorités, les risques, la première étape, la voix des utilisateurs (ce qu'on sait d'eux, leurs réponses s'il y en a), les idées notées pour plus tard, et le type du projet (avec code : codé dans Claude Code dans ce dépôt ; ou sans code).

Avant d'enregistrer le fichier, raconter la scène du projet réussi (voir "La maïeutique"), puis faire une dernière relecture avec la personne — mais toujours en lots courts, un grand bloc à la fois (le vrai besoin, puis le contexte, puis les contraintes, etc.), jamais toute la fiche d'un coup, même si chaque élément a déjà été validé en direct pendant la conversation. Une fois cette relecture confirmée, enregistrer la fiche dans `docs/cadrage.md` du dépôt GitHub du projet, vérifier que la ligne `Type` de `CLAUDE.md` et le topic du dépôt sont à jour, puis commit et push (règle "Emplacement de référence") — pas seulement dans le chat, et nulle part ailleurs — pour qu'elle reste disponible comme contexte de référence à chaque fois qu'on retravaille sur ce projet, depuis n'importe quelle surface. Dire à la personne où le fichier est enregistré (nom du dépôt) et que la suite logique est le design (`design-solution-perso`).

Proposer de mettre à jour cette fiche si des éléments importants changent au fil du projet, plutôt que de la considérer figée une fois écrite : toute mise à jour se fait dans `docs/cadrage.md` du dépôt, avec commit et push.