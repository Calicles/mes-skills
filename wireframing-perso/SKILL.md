---
name: "wireframing-perso"
description: "Une fois la solution conçue (docs/design.md dans le dépôt GitHub), valide le design, fait raconter puis challenge chaque parcours (maïeutique : questions ouvertes d'abord, voix des utilisateurs, idées qui émergent), dessine des wireframes basse fidélité (artifact), enregistre docs/wireframe.md et wireframe.html puis, pour un jeu vidéo, passe au parcours game design (jeu-video-parcours, puis mc-addon-parcours pour un addon Minecraft), et si le projet est avec code, passe le relais à Claude Code."
---

# Wireframing

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` la section « Les deux portes, version générique (projets hors jeu) » : elle fait foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill** : les wireframes font partie des planches de la porte 1 ; le relais vers le code rappelle que la réalisation commence par la porte 1 de chaque étape.

## Quand utiliser ce skill

Après la conception de la solution (skill `design-solution-perso`), pour transformer le design en écrans concrets. Ça se fait en deux temps : d'abord penser et challenger vraiment le parcours utilisateur (pas juste reprendre tel quel le "parcours d'usage principal" du design.md, qui reste une esquisse haut niveau), puis traduire ce parcours approfondi en écrans. C'est une étape de structure et de réflexion UX, pas de style : on ne décide pas encore des couleurs, de la typographie ou de l'identité visuelle à ce stade — seulement du parcours, de l'agencement et de la hiérarchie de l'information.

Comme pour le cadrage et le design, tous les projets sont personnels par défaut dans cet espace : pas de vocabulaire corporate, sauf si la personne précise explicitement que c'est un projet professionnel.

## Emplacement de référence du projet (règle commune à tout le workflow)

Un projet = UN dépôt GitHub privé = UN seul endroit pour tout ce qui le concerne (documents de référence, livrables, ressources, et code s'il y en a), quelle que soit la surface utilisée (Claude, Cowork, Claude Code, Claude AI) et que le projet nécessite du code ou non. Même structure dans les deux cas.

- **Dépôt** : un dépôt privé par projet, sur le compte GitHub personnel de la personne (vérifier avec `gh api user --jq .login`), avec le topic `projet-perso` et un topic de type `avec-code` ou `sans-code` (`gh repo list --topic projet-perso` pour retrouver le projet).
- **Structure** : `docs/` = uniquement les documents de référence (`cadrage.md`, `design.md`, `wireframe.md` au singulier, `wireframe.html`, plus `docs/game-design/` pour un jeu vidéo (un fichier par métier : `experience-joueur.md`, `gameplay.md`, `level-design.md`, `personnages.md`, `architecture.md`, `mobilier-decor.md`), `journal-decisions.md` (les décisions datées) et `fiche-<étape>.md` (les fiches de réalisation)) ; `livrables/` = ce que le projet produit ; `ressources/` = recherches, sources, notes ; `src/` = le code, projets avec code uniquement ; `CLAUDE.md` à la racine, toujours (le modèle est dans le skill `cadrage-projet-perso`) ; `README.md` d'une ligne.
- **Aucune autre copie de référence** : ni dossier local, ni espace cloud seul, ni mémoire, ni Projet Claude. Un lien vers le dépôt est possible, jamais une copie qui pourrait diverger.
- **Lire / écrire** : cloner le dépôt (ou `git pull`) avant de lire ; après chaque écriture, commit avec un message clair puis `git push`.
- **Si GitHub est inaccessible** depuis la surface en cours : le dire clairement, ne pas enregistrer ailleurs en silence, garder le contenu dans la conversation et proposer de le pousser dès que possible.

## Prérequis : le design, validé élément par élément

Ce skill exige qu'une conception existe. Retrouver le dépôt du projet (`gh repo list --topic projet-perso`, ou le nom donné par la personne), le cloner ou le mettre à jour, lire `CLAUDE.md` (notamment la ligne `Type`), puis chercher `docs/design.md`. Si le dépôt n'existe pas mais que le design traîne ailleurs, proposer de le rapatrier une seule fois avec le skill `migration-projet-perso`. S'il n'existe aucun design, ne pas wireframer à l'aveugle : le dire clairement et proposer de faire d'abord la conception (skill `design-solution-perso`, qui lui-même exige un cadrage) avant de continuer.

Une fois le `docs/design.md` trouvé, le lire en entier, ainsi que le `docs/cadrage.md` associé. Puis faire valider les points clés par la personne en petits lots courts, un seul élément à la fois, jamais plusieurs regroupés dans le même message :

1. Le concept retenu au design. Attendre la validation.
2. Les fonctionnalités clés de la v1. Attendre la validation.
3. Le parcours d'usage principal tel que décrit au design.md (juste pour confirmer qu'il est toujours à jour — il sera challengé en détail dans la phase 1 qui suit). Attendre la validation.
4. Le contexte d'usage réel (support, fréquence, état d'esprit) tel que défini au cadrage. Attendre la validation.

Quand un point de cette liste est lui-même composé de plusieurs éléments distincts — c'est le cas des fonctionnalités clés (point 2), qui sont une liste et non un fait unique — ne jamais les confirmer en bloc dans un seul message : décomposer ce point en autant de messages qu'il y a de fonctionnalités, chacune présentée et validée (ou ajustée) individuellement par la personne, avant de passer au point suivant de la liste ci-dessus.

Ne pas redécouvrir ces éléments par des questions ouvertes — ils sont déjà tranchés, il s'agit seulement de les confirmer un par un avant de passer à la phase 1. Si une correction change le design, mettre à jour `docs/design.md` dans le dépôt.

## Principe général

Basse fidélité assumée pour le rendu visuel : blocs, zones et libellés de contenu ("titre", "liste des éléments", "bouton d'action principal"), jamais de vraies couleurs de marque, de typographie soignée ou de contenu final rédigé. Si la personne demande d'aller plus loin sur le style visuel à ce stade, le dire explicitement : c'est une étape ultérieure, hors périmètre de ce skill.

Mais la réflexion, elle, n'est pas basse fidélité : chaque parcours utilisateur doit être pensé et challengé en profondeur avant d'être dessiné. Ne pas se contenter de transcrire silencieusement le parcours du `design.md` en écrans — le détailler, le questionner, et l'améliorer avec la personne avant de dessiner quoi que ce soit.

Garde-fou identique aux skills précédents : chaque écran et chaque élément dessiné doit se relier à quelque chose du `design.md`. Si un écran ou un élément ne se relie à rien de précis, le signaler comme candidat au hors-périmètre plutôt que de le dessiner par réflexe ou par habitude d'interfaces vues ailleurs.

Règle valable pour tout le skill, comme pour le cadrage et le design : un message = un seul lot, le plus petit possible pour rester vérifiable d'un coup d'œil (une question du parcours, un écran, un seul élément à valider). Ne jamais regrouper deux éléments distincts dans le même message — y compris quand ces éléments distincts forment une liste au sein d'un même point plus large (voir l'exemple des fonctionnalités clés ci-dessus). Avancer parcours par parcours, puis écran par écran, un seul à la fois par défaut, avec retour de la personne à chaque fois. Ne regrouper plusieurs écrans dans un même message que lorsqu'ils sont si étroitement liés qu'il faut les voir ensemble pour juger (par exemple deux variantes très proches d'un même écran, ou l'inventaire complet des écrans à valider avant de commencer à dessiner, qui a besoin d'une vue d'ensemble pour vérifier qu'aucun écran n'est oublié ou superflu).

## La maïeutique (l'esprit de tout le wireframe)

Les questions de ce skill ne sont pas un formulaire à remplir : elles servent à faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et à laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce qu'attendent vraiment ceux qui s'en serviront. Claude ne tranche rien seul ; ses propositions servent à affiner ce que la personne a exprimé, jamais à le remplacer.

- **Ouvrir avant de proposer** — avant de détailler un parcours ou de dessiner un écran, demander à la personne comment elle voit ce moment : « raconte-moi : tu ouvres l'app, qu'est-ce que tu vois d'abord, qu'est-ce que tu fais ? ». Les questions de challenge (étapes inutiles, frictions, états limites) viennent ensuite, sur ce qu'elle a raconté. Reformuler ce qui a été dit (« si je te suis bien… ») et relancer : pourquoi ? qu'est-ce que ça évoque ? ça ressemble à quoi que tu connais ? raconte-moi le moment où… Creuser chaque mot vague jusqu'à ce que la personne dise « oui, c'est exactement ça ». Les options (2 ou 3, en cartes avec le skill `poser-questions-en-cards` s'il est installé) ne viennent qu'**ensuite**, en partant de ses mots, pour préciser ou pour l'aider si elle sèche ; la recommandation vient en dernier, avec sa raison en une phrase.
- **Suivre son fil** — l'ordre des questions de la phase 1 est un repère, pas un script : si la personne part ailleurs, la suivre, puis revenir aux thèmes qui n'ont pas été abordés avant de conclure. Ne pas reposer ce qui est déjà dit ou tranché, mais signaler une contradiction.
- **La voix des utilisateurs** — dès que d'autres personnes que la personne elle-même se serviront du projet (famille, enfants, amis, joueurs), recueillir ce qu'elle sait d'eux : ce qu'ils aiment, ce qu'ils font aujourd'hui, ce qu'ils ont dit, réclamé, ignoré, et qui aime quoi. Proposer **3 ou 4 questions à leur poser** (courtes et concrètes, adaptées à leur âge), puis reprendre avec leurs réponses. Signaler quand ce que la personne imagine et ce que les utilisateurs semblent attendre s'écartent, et en faire une question.
- **Ce qui émerge** — noter toute idée apparue en route, même hors sujet, et demander régulièrement « qu'est-ce qui te vient d'autre ? ». Relire ces idées à la fin de chaque grand bloc ; pour chacune, la personne décide : maintenant, plus tard (notée dans le document, section des idées pour plus tard), ou abandonnée.
- **Finir par la scène** — avant la vérification finale, raconter chaque parcours comme une scène vécue par un utilisateur précis, écran après écran, puis demander : « est-ce ce que tu imaginais ? qu'est-ce qui manque ? ». Chaque écart relance l'interview avant d'enregistrer les wireframes.

Ces principes s'appliquent aux phases 1 à 4 (le rappel du design en prérequis reste une simple confirmation) et s'ajoutent aux règles ci-dessous (un lot court par message, challenge, garde-fous) sans les remplacer : une question ouverte reste une seule question, et un message reste un seul lot.

## Phase 1 — Penser et challenger chaque parcours

Pour chaque fonctionnalité clé du `design.md` qui implique une interaction (pas seulement le parcours principal), dérouler et challenger le parcours avant de passer à l'écran suivant. Poser les questions ci-dessous une à la fois, comme pour le cadrage — pas toutes d'un bloc :

0. **Faire raconter le parcours** — demander d'abord à la personne comment elle imagine ce moment, en question ouverte, et ce que feraient ou diraient ses utilisateurs (voir "La maïeutique"). Ce récit sert de base aux questions suivantes.
1. **Détailler le parcours pas à pas** — reprendre le récit de la personne et le parcours du design.md et le décomposer en actions concrètes et successives (chaque clic, chaque saisie, chaque décision), pas seulement le résumé haut niveau. Formuler à voix haute chaque étape à la personne pour validation.
2. **Questionner la nécessité de chaque étape** — pour chaque étape : est-ce indispensable ? Peut-elle être supprimée, fusionnée avec une autre, ou automatisée ? "Si on enlevait cette étape, qu'est-ce qu'on perdrait vraiment ?" Ne pas hésiter à proposer un parcours plus court si le contexte d'usage (rapide/distrait) du cadrage le justifie.
3. **Identifier les points de friction** — à quel moment la personne pourrait hésiter, se tromper, ou abandonner ? Est-ce qu'une saisie est évitable (valeur par défaut, pré-remplissage, choix plutôt que texte libre) ? Le nombre d'étapes est-il cohérent avec la fréquence d'usage définie au cadrage (une action très fréquente doit être très courte) ?
4. **Explorer les points d'entrée** — comment la personne arrive-t-elle à ce parcours ? Y a-t-il plusieurs façons d'y entrer (depuis un autre écran, une notification, un raccourci) ? Toutes sont-elles nécessaires, ou certaines sont-elles superflues ?
5. **Explorer les points de sortie** — qu'est-ce que la personne fait juste après avoir terminé cette action ? Le parcours l'amène-t-il naturellement vers cette suite logique, ou la laisse-t-il sans indication ?
6. **Envisager les états limites** — que montre-t-on la première fois (aucune donnée) ? Que se passe-t-il s'il y a beaucoup d'éléments à afficher ? Que se passe-t-il en cas d'erreur (saisie invalide, action échouée, connexion absente si pertinent) ou d'annulation ? Ne pas laisser ces cas de côté même pour un projet perso simple — au moins les nommer et décider consciemment de les ignorer ou pas.
7. **Vérifier la cohérence avec le contexte d'usage** — ce parcours, tel qu'il est maintenant détaillé, correspond-il vraiment à la réalité décrite au cadrage (support, fréquence, état d'esprit) ? Si non, l'ajuster avant de dessiner.

Ne traiter cette phase comme terminée pour un parcours que lorsque la personne et l'assistant sont alignés sur une version challengée et validée, pas la première version venue du design.md.

## Phase 2 — Inventaire des écrans

À partir des parcours challengés en phase 1 (pas du design.md brut), lister les écrans/vues nécessaires, y compris les états particuliers identifiés (écran vide, écran d'erreur) quand ils justifient un écran ou un état distinct. Présenter cette liste à la personne avant de commencer à dessiner, pour confirmer qu'elle est complète et qu'aucun écran superflu ne s'y est glissé (cette liste reste groupée dans un seul message, exception au principe des lots courts, parce qu'une vue d'ensemble est nécessaire pour vérifier qu'elle est complète).

Confirmer aussi sur quel support dessiner en priorité (téléphone ou ordinateur), d'après le contexte d'usage défini au cadrage. Si les deux sont pertinents, wireframer le support principal d'abord et noter les différences majeures pour l'autre plutôt que de tout dessiner deux fois.

## Phase 3 — Dessiner les wireframes

Pour chaque écran, avant de dessiner, lister ce qu'il doit contenir : les informations à afficher et les actions possibles, chacune reliée à une étape du parcours challengé en phase 1. Déterminer la hiérarchie visuelle (ce qui compte le plus) et la navigation (où mène chaque action).

Produire un artifact regroupant les écrans en basse fidélité : zones et blocs délimités clairement (ex. en-tête, contenu principal, actions, navigation), libellés de contenu à la place du contenu réel, niveaux de gris uniquement (pas de palette de couleurs), et des indications de navigation entre écrans ("ce bouton mène à l'écran X"). Représenter aussi les états particuliers retenus en phase 1 (vide, erreur) quand ils ont été jugés nécessaires. Avant de publier, suivre les instructions de conception d'artifacts habituelles, mais en respectant explicitement cette contrainte de fidélité volontairement basse.

Présenter les écrans produits un à la fois par défaut (voir "Principe général"), recueillir le retour de la personne, ajuster avant de passer à l'écran suivant plutôt que d'attendre la fin pour tout remettre en question. Ne regrouper plusieurs écrans que s'ils sont si étroitement liés qu'il faut les voir ensemble pour juger.

## Phase 4 — Vérification finale

Une fois tous les écrans dessinés, raconter chaque parcours comme une scène vécue (voir "La maïeutique"), puis relire l'ensemble en suivant chaque parcours challengé en phase 1 du début à la fin, pour vérifier que la navigation est cohérente et complète, et que les décisions prises en phase 1 (étapes supprimées, états gérés ou volontairement ignorés) sont bien reflétées dans les écrans finaux.

## À la fin

Publier l'ensemble des wireframes comme un seul artifact (ou plusieurs artifacts clairement liés si le nombre d'écrans le justifie). L'artifact vit sur claude.ai, pas dans le dépôt : pour que rien ne se perde et que Claude Code puisse s'en servir, enregistrer dans le dépôt GitHub du projet (commit + push, règle "Emplacement de référence") :

- `docs/wireframe.html` : le fichier source de l'artifact (celui qui a été publié), pour que les wireframes soient récupérables et modifiables de n'importe où ;
- `docs/wireframe.md` (au singulier ; si un ancien `wireframes.md` existe, le renommer) : les décisions clés prises en phase 1 pour chaque parcours (étapes retirées ou simplifiées, états limites gérés ou explicitement ignorés et pourquoi), l'inventaire des écrans avec un résumé d'une phrase par écran, les décisions de navigation principales, les idées notées pour plus tard, et le lien vers l'artifact publié.

Ainsi, le contexte complet du projet (besoin, conception, réflexion UX, wireframes) reste accessible depuis le dépôt, quelle que soit la surface utilisée.

### Mettre à jour CLAUDE.md et passer le relais

Vérifier que `CLAUDE.md` existe à la racine du dépôt (le créer sinon, avec le modèle du skill `cadrage-projet-perso`) et qu'il mentionne bien `docs/wireframe.md` et `docs/wireframe.html`. Puis :

- **Jeu vidéo (ou mod, addon, carte d'aventure)** : avant tout relais vers la réalisation, demander en une question si le projet est un jeu vidéo et, si oui, si c'est un addon Minecraft. Si c'est un jeu : charger le skill `jeu-video-parcours`, qui approfondit le game design métier par métier (expérience joueur, gameplay, level design, personnages, architecture, mobilier) dans `docs/design.md`. Si c'est en plus un addon Minecraft, `jeu-video-parcours` passe ensuite la main à `mc-addon-parcours`. Le relais vers Claude Code (ci-dessous) ne vient qu'à la fin de ces parcours.
- **Projet avec code** : dire à la personne, en une ou deux phrases, que tout est enregistré dans le dépôt `<compte>/<nom>` et que la réalisation se fait maintenant dans Claude Code sur ce dépôt, avec un premier message à coller : "Lis CLAUDE.md et docs/, puis prépare la première étape de docs/design.md : commence par la porte 1 (fiche et planches à me faire valider), sans coder avant mon accord en suivant docs/wireframe.md." Ne pas commencer à coder dans cette conversation, sauf demande explicite de la personne, et jamais avant la porte 1.
- **Projet sans code** : pas de relais vers Claude Code. Dire à la personne que les wireframes sont enregistrés dans le dépôt et que la suite est la production des livrables définis au design (rangés dans `livrables/`). Si un besoin de code apparaît plus tard, le passage en code se fait via `evolution-projet-perso`, sans rien déplacer.

Proposer de mettre à jour les wireframes (`docs/wireframe.html` et `docs/wireframe.md`) si des écrans ou des parcours changent en cours de réalisation, plutôt que de les considérer figés — toujours dans le dépôt, avec commit et push.