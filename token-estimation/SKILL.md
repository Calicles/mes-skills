---
name: "token-estimation"
description: Estime le coût de développement d'une tâche, user story ou ticket EN COÛT DE TOKENS (pas en story points), pour des équipes dont le code sera écrit par Claude Code ou un autre agent IA. Utilise ce skill dès qu'on parle d'estimer, chiffrer ou évaluer la charge d'une tâche de dev, d'une user story, d'un ticket, ou de planifier/prioriser un sprint ou une backlog — même si l'utilisateur ne dit pas explicitement "tokens" ou "estimation". Si une tâche s'avère trop grosse (palier XL), le skill propose aussi un découpage en sous-tâches plus petites.
---

# Estimation en coût de tokens

Ce skill sert à estimer la charge de développement d'une tâche non pas en story points, mais en **paliers de coût de tokens**, adaptés au fait que le code sera produit par Claude Code (ou un agent IA équivalent) plutôt que par un humain qui type.

## Principe

Un agent IA ne "code" pas comme un humain : son coût réel dépend de la taille du contexte à charger, du nombre d'itérations (essais/erreurs, tests qui échouent, corrections), et du nombre d'appels d'outils (recherche dans le repo, exécution, edits). Ce n'est **pas** corrélé à la complexité perçue par un humain de la même façon que les story points classiques.

Ne jamais donner de nombre de tokens exact et chiffré (ex: "≈45 000 tokens") — ce n'est pas fiable et donne une fausse impression de précision. Toujours raisonner en **paliers relatifs**.

## Facteurs qui font varier le coût

Pour chaque tâche, évalue ces facteurs avant de trancher le palier :

1. **Taille du contexte à charger** — combien de fichiers existants l'agent doit-il lire pour comprendre où intervenir ? (1 fichier isolé vs. plusieurs modules interdépendants vs. tout un service)
2. **Nombre d'itérations probables** — la tâche a-t-elle un critère de succès net et vérifiable rapidement (tests unitaires clairs, comportement simple), ou risque-t-elle des allers-retours (bug flou, comportement UI à ajuster visuellement, dépendance externe capricieuse) ?
3. **Complexité du raisonnement** — logique métier simple et locale, vs. logique transverse touchant plusieurs couches (frontend + backend + DB), vs. décisions d'architecture.
4. **Nombre d'appels d'outils attendus** — recherche dans le repo, exécution de tests, edits multiples fichiers, installation de dépendances, etc.
5. **Nouveauté / ambiguïté** — tâche similaire à quelque chose de déjà fait dans le repo (patterns connus, donc contexte réduit) vs. totalement inédite (l'agent doit explorer et décider).

## Paliers

| Palier | Critères typiques | Coût relatif |
|---|---|---|
| **S** | 1 fichier, changement localisé, pattern déjà présent dans le repo, critère de succès net | Faible |
| **M** | Plusieurs fichiers liés, logique métier modérée, tests à écrire, peu d'ambiguïté | Moyen |
| **L** | Plusieurs modules/couches impactés, contexte large à charger, itérations probables (bug/debug, ajustements) | Élevé |
| **XL** | Architecture, migration, dépendances transverses, ambiguïté forte, risque de nombreux allers-retours | Très élevé — à découper avant de lancer |

## Format de sortie

Toujours présenter l'estimation sous forme de tableau simple avec, pour chaque tâche/story :

| Tâche | Palier | Facteurs clés | Coût relatif |
|---|---|---|---|
| Ex: Ajouter un champ "téléphone" au formulaire profil | S | 1 fichier, pattern existant | Faible |
| Ex: Intégrer un nouveau provider de paiement | L | Multi-couches, dépendance externe, tests d'intégration | Élevé |

Après le tableau, ajoute 1-2 lignes qui justifient brièvement les cas non évidents (pourquoi telle tâche est L et pas M, par exemple) — pas besoin de justifier les cas triviaux.

## Cas XL : proposer un découpage

Dès qu'une tâche est estimée **XL**, ne pas s'arrêter à l'estimation : proposer un découpage en sous-tâches plus petites (idéalement toutes ≤ L, si possible M ou S), chacune avec son propre palier. Le découpage doit suivre des frontières naturelles :

- Par couche (ex: migration DB / logique backend / UI)
- Par étape séquentielle (ex: proof of concept isolé / intégration / nettoyage & tests)
- Par périmètre fonctionnel (ex: cas nominal d'abord, cas limites ensuite)

Présente le découpage comme un second petit tableau juste après le tableau d'estimation, avec la mention explicite que c'est une proposition à valider avec l'équipe.

## Ce qu'il ne faut jamais faire

- Ne jamais donner un nombre de tokens précis ou pseudo-précis.
- Ne jamais convertir le palier en story points ou en jours/heures homme — ce sont deux métriques différentes, ne pas les mélanger.
- Ne pas estimer sans avoir au moins une idée du repo/contexte existant ; si l'information manque (langage, taille du projet, patterns existants), le demander avant de trancher entre S/M/L/XL plutôt que de deviner.
