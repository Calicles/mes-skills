---
name: "poser-questions-en-cards"
description: "À utiliser à chaque fois que Claude s'apprête à poser une question à l'utilisateur (clarification, choix, décision), pour la formuler sous forme de cartes plutôt qu'en texte libre ; seule exception, la question ouverte d'une maïeutique (raconter, décrire, imaginer), posée en texte libre."
---

# Poser les questions sous forme de cartes

Ce skill définit une préférence permanente de l'utilisateur : **toute question posée à l'utilisateur doit passer par l'outil de questions à choix (cartes), jamais en texte libre dans la réponse**, sauf la question ouverte d'une maïeutique (voir « Règle de priorité avec les skills de métier »).

## Règle générale

Dès que Claude a besoin d'une réponse de l'utilisateur pour avancer — clarification, choix entre plusieurs options, confirmation, décision — il doit utiliser l'outil de question à cartes (AskUserQuestion ou équivalent selon l'interface), plutôt que d'écrire la question directement dans le texte de la réponse.

Cela s'applique à toutes les conversations, pas seulement aux tâches complexes ou multi-étapes.

## Questions fermées (oui/non)

Quand la question attend une réponse binaire ("est-ce que je fais X ?", "tu es d'accord ?", "je continue ?"), Claude propose une carte avec deux options claires :
- "Oui" (avec une courte description de ce que ça implique si utile)
- "Non" (avec une courte description de ce que ça implique si utile)

Ne pas reformuler la question en dehors de la carte — la carte doit suffire à comprendre l'enjeu (ajouter 1-2 phrases de contexte avant si nécessaire, mais la question elle-même passe par la carte).

## Questions à plusieurs options

Quand la question a plusieurs réponses possibles ("quel format ?", "quelle direction prendre ?", "quel ton ?"), Claude propose une carte avec :
- 2 à 4 propositions concrètes et distinctes, chacune avec une courte description de ce qu'elle implique
- La première option peut être marquée "(Recommandé)" si Claude a une préférence claire à suggérer
- L'option "Autre" est ajoutée automatiquement par l'outil — Claude n'a pas besoin de la créer lui-même, mais doit garder à l'esprit que l'utilisateur pourra toujours taper une réponse libre si aucune proposition ne convient

## Plusieurs questions à la fois

Si plusieurs décisions indépendantes doivent être prises en même temps, Claude peut regrouper jusqu'à 4 questions dans un seul appel à l'outil plutôt que de les poser une par une dans le texte.

## Règle de priorité avec les skills de métier

Les skills qui mènent une interview en maïeutique (cadrage, design, wireframes, évolution, métiers du jeu, skills Minecraft) priment sur ce skill sur deux points :
- **Cartes pour les choix, texte libre pour la maïeutique.** La question ouverte qui ouvre un sujet (« raconte-moi… », « comment l'imagines-tu ? ») se pose en texte libre, sans options. Les cartes ne viennent qu'ensuite, quand il y a des options à départager, une recommandation à confirmer ou un oui/non.
- **Une question par message prime sur « jusqu'à 4 questions par appel ».** Dans ces interviews, une seule question à la fois, même si l'outil en accepte quatre ; le regroupement reste possible hors interview.

## Cas où le texte libre reste acceptable

- La question ouverte d'une maïeutique (voir la règle de priorité ci-dessus)
- Simple conversation sans décision à prendre (pas une "question" au sens décision/choix)
- L'outil de cartes n'est pas disponible dans le contexte courant (par exemple certaines sessions automatisées/headless) : dans ce cas, Claude pose quand même la question de façon structurée en texte (options numérotées ou à puces), en se rapprochant le plus possible de l'esprit "cartes"
- L'utilisateur a explicitement demandé de ne pas utiliser ce format

## Ce que ça ne change pas

Ce skill ne change pas la fréquence à laquelle Claude pose des questions (il ne doit pas se mettre à en poser plus qu'avant, ni interrompre inutilement le fil d'une tâche) — il change uniquement la **forme** que prend une question quand elle est posée.