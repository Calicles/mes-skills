---
name: "migration-projet-perso"
description: "Rapatrie un projet existant (avec ou sans code : cadrage, design, wireframes, livrables, ressources, code éparpillés dans un dossier local, la mémoire, un Projet Claude, un Doc, un artifact ou une conversation) vers son dépôt GitHub privé unique, sans perte ni doublon."
---

# Migration d'un projet existant vers son dépôt unique

## Quand utiliser ce skill

Quand un projet existe déjà (cadré, designé, wireframé, ou simplement en cours) mais que ses documents, ses livrables, ses ressources et son code éventuel vivent ailleurs que dans un dépôt GitHub dédié : dossier local, espace cloud d'une ancienne session, fichiers d'un Projet Claude, mémoire, Doc ou artifact publié sur claude.ai, conversation. Le but est de ramener chaque projet, une seule fois, à la structure standard du workflow, pour que tout soit ensuite synchronisé depuis n'importe quelle surface (Claude, Cowork, Claude Code, Claude AI). Le projet peut être avec ou sans code : la structure est la même.

Pas pour un nouveau projet (utiliser `cadrage-projet-perso`) ni pour un projet qui a déjà son dépôt conforme (utiliser `evolution-projet-perso`).

Tous les projets sont personnels par défaut : pas de vocabulaire corporate.

## Structure cible (identique à celle des autres skills du workflow)

- Un dépôt GitHub **privé** par projet, sur le compte GitHub personnel de la personne (vérifier avec `gh api user --jq .login`), nom court en kebab-case, avec le topic `projet-perso` et un topic de type : `avec-code` ou `sans-code`.
- `docs/` : uniquement les documents de référence — `cadrage.md`, `design.md`, `wireframe.md` (au singulier), `wireframe.html` (source des wireframes), plus `docs/game-design/` pour un jeu vidéo (un fichier par métier : `experience-joueur.md`, `gameplay.md`, `level-design.md`, `personnages.md`, `architecture.md`, `mobilier-decor.md`), `journal-decisions.md` (les décisions datées) et `fiche-<étape>.md` (les fiches de réalisation).
- `livrables/` : ce que le projet produit (rapports, tableurs, exports...). Pour un livrable qui vit dans un Doc ou un artifact claude.ai : son export ou sa source, ou à défaut son lien dans `livrables/liens.md`.
- `ressources/` : recherches, sources, notes de travail.
- `src/` : le code, uniquement pour un projet avec code.
- `CLAUDE.md` à la racine, toujours, et un `README.md` d'une ligne.
- Aucune autre copie de référence. Si GitHub est inaccessible depuis la surface en cours, le dire clairement et s'arrêter plutôt que d'enregistrer ailleurs en silence.

## Principes

- **Un projet à la fois**, avec retour de la personne à chaque décision, en messages courts (un lot = une question ou une décision).
- **Ne jamais inventer** : si un document n'existe pas (pas de design.md, pas de wireframes), le dire et le marquer "à produire" au lieu de le reconstituer de mémoire ou à partir d'un résumé. Un résumé de mémoire ou un nom de fichier n'est pas un document.
- **Ne rien supprimer** des sources. Les copies d'origine restent en place jusqu'à ce que la personne demande explicitement de les nettoyer.
- **Fidélité** : copier le contenu tel quel, sans reformuler ni "améliorer". Seules les corrections de nom de fichier (ex. `wireframes.md` → `wireframe.md`) sont permises.
- **Livrable ou ressource ?** Un livrable est ce que le projet produit et qui est destiné à être utilisé ou partagé (rapport, tableur, export, page). Une ressource est du matériau de travail (recherche, source, note). Si un fichier est ambigu, poser la question une fois, ne pas trancher seul.

## Étapes

### 1. Inventaire des projets

Lister les projets candidats à la migration. Sources à parcourir, selon ce qui est accessible depuis la surface en cours :

- la mémoire (`/projects/` et `/areas/`) pour repérer les projets connus, sachant que ces fichiers sont des fiches de suivi, pas les vrais documents ;
- les dépôts déjà existants (`gh repo list --topic projet-perso`, puis `gh repo list` pour repérer d'éventuels dépôts non étiquetés) ;
- les dossiers locaux de la personne, si un dossier est connecté (chercher `cadrage.md`, `design.md`, `wireframes.md`, `wireframe.md`, ainsi que les livrables et notes rattachés au projet) ;
- les artifacts publiés (`Artifact` avec l'action `list`, puis `read`) pour retrouver les wireframes, leur source HTML et d'éventuels livrables ;
- les Docs créés dans Claude Docs, si l'outil est disponible (lecture, puis export) ;
- les Projets Claude et les conversations : si leurs fichiers ne sont pas accessibles d'ici, demander à la personne de les joindre ou de les coller, un projet à la fois.

Présenter la liste des projets trouvés dans un seul message (vue d'ensemble nécessaire) et demander lequel migrer en premier.

### 2. État des lieux d'un projet

Pour le projet choisi, établir et présenter en un message court un tableau : pour chaque élément (cadrage, design, wireframes, livrables, ressources, code), où il se trouve aujourd'hui, s'il est complet ou partiel, et sa date de dernière modification quand elle est connue.

Si plusieurs versions du même document coexistent, ne pas choisir seul : montrer en deux lignes ce qui les distingue et demander laquelle fait foi (une question à la fois).

Déterminer ensuite le **type** du projet : *avec code* s'il existe du code ou si le design prévoit du code ; *sans code* sinon. Le proposer à la personne en une question de confirmation. En cas de doute, choisir `sans code` : le passage en code (skill `evolution-projet-perso`) se fait plus tard sans rien déplacer.

### 3. Créer ou compléter le dépôt

- Vérifier d'abord qu'aucun dépôt ne correspond déjà au projet. S'il existe, le cloner et compléter plutôt que recréer.
- Sinon, confirmer en une ligne le nom du dépôt avec la personne, puis le créer en privé avec les topics `projet-perso` et le topic de type.
- Créer `README.md` (une ligne) et les dossiers `docs/`, `livrables/`, `ressources/` (et `src/` pour un projet avec code), avec un `.gitkeep` dans chaque dossier vide, car git ne versionne pas les dossiers vides.
- Copier chaque document de référence retenu dans `docs/` (avec les noms standards). Pour les wireframes : récupérer la source HTML de l'artifact publié dans `docs/wireframe.html`, et créer `docs/wireframe.md` à partir de l'existant ou, s'il n'existe qu'un lien vers l'artifact, un fichier minimal qui contient ce lien et la mention "inventaire des écrans à compléter".
- Copier les livrables dans `livrables/` et les ressources dans `ressources/`, tels quels. Pour un livrable qui vit dans un Doc ou un artifact : exporter ou enregistrer sa source quand c'est possible, et toujours noter son lien dans `livrables/liens.md`.
- S'il existe du code ailleurs (dossier local, ancien dépôt, artifact), demander s'il doit être copié dans le dépôt, puis le copier dans `src/`. Ne pas le modifier. Si le projet a été codé sous forme d'artifact claude.ai, enregistrer sa source dans `src/` et le dire.
- Pour un projet avec code, une fois le code copié dans `src/` (pas avant : le hook bloquerait la copie), installer le hook de la porte 1 : copier `references/hook-porte1/porte1.py` dans `.claude/hooks/porte1.py` et `references/hook-porte1/settings.json` dans `.claude/settings.json` (s'il existe déjà, y ajouter seulement le bloc `PreToolUse`), puis vérifier qu'une écriture dans `src/` est refusée tant qu'aucune fiche n'est « VALIDÉE ».
- Créer `CLAUDE.md` à la racine à partir du **modèle de CLAUDE.md du skill `cadrage-projet-perso`** (section « Modèle de CLAUDE.md », règle 0 comprise ; exemplaire unique, ne pas le recopier ici). Adapter le nom du projet, la ligne `Type` (`sans code` ou `avec code`, jamais `à déterminer` après une migration), la variante de la règle 2, et ne mentionner dans la liste des documents que ceux qui existent réellement.

- Commit avec un message clair (par exemple "docs: import du projet existant") puis push.

### 4. Vérification

Avant de déclarer le projet migré : cloner le dépôt à nouveau dans un dossier propre, lister l'arborescence, vérifier que chaque fichier importé (`docs/`, `livrables/`, `ressources/`, `src/`) est non vide et identique à sa source, que `CLAUDE.md` référence uniquement des fichiers présents, que les topics sont corrects, et que le dernier commit est bien sur le dépôt distant.

### 5. Compte rendu et nettoyage proposé

Donner à la personne, en quelques lignes : le nom du dépôt, le type retenu, ce qui a été rapatrié (documents, livrables, ressources, code), ce qui manque (documents à produire avec `cadrage-projet-perso`, `design-solution-perso` ou `wireframing-perso`), et la suite :

- *Projet avec code* : le message prêt à coller dans Claude Code : "Lis CLAUDE.md et docs/, puis continue le projet à partir de docs/design.md."
- *Projet sans code* : le projet se poursuit depuis n'importe quelle surface, avec les livrables rangés dans `livrables/` ; si un besoin de code apparaît, le passage en code se fait via `evolution-projet-perso`.

Proposer ensuite, sans le faire d'office, de neutraliser les anciennes copies : ajouter dans le Projet Claude ou le dossier local un simple fichier de renvoi vers le dépôt, ou les supprimer. Ne supprimer quoi que ce soit que sur demande explicite. Ne pas modifier la mémoire pour cela.

Puis proposer de passer au projet suivant de la liste de l'étape 1.

## Si GitHub n'est pas accessible

Le dire en une phrase, préciser ce qui manque (connexion, droits d'écriture), et s'arrêter après l'inventaire et l'état des lieux : ils restent utiles. Ne pas créer de copie de substitution ailleurs.