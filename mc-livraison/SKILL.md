---
name: "mc-livraison"
description: "Mène l'interview de livraison (en maïeutique : questions ouvertes d'abord, options et recommandation ensuite : nom, icône, Realm, sauvegardes, procédure), ne code qu'après fiche validée, puis livre un addon Minecraft Bedrock jusqu'aux joueurs sans abîmer leur monde : manifests (UUID fixes, version montée à chaque livraison, min_engine_version jamais montée, dépendance exacte entre packs), fabrication des .mcpack et .mcaddon, vérification automatique dans GitHub, serveur de test BDS sur le PC (server.properties propre, graine, triches, connexion de la Switch par BedrockConnect), publication sur un Realm avec sauvegarde (ou restauration, ou monde neuf sur la graine), README de test. À utiliser dès qu'on publie, met à jour, empaquette ou installe un addon, qu'on prépare le serveur de test ou le Realm, ou que l'addon ne se charge pas, que la Switch ne se connecte pas ou qu'un monde s'ouvre sans l'addon, même sans dire « livraison »."
---

# Livraison d'un addon (serveur de test, Realm)

**Dernière vérification : 08/10/2026** (rédaction du skill). Avant de s'appuyer sur un fait qui a pu changer depuis (version du jeu ou de la Script API, nombre de zones de chargement, noms et états de blocs, API Realms non officielle), le signaler à la personne comme possiblement périmé et le revérifier (documentation officielle, liste des blocs du jeu, essai sur le serveur de test) ; une fois revérifié, mettre la date à jour.

## Règles communes : à lire avant toute action

**Jamais de code sans fiche validée** : porte 1 (fiche, planches dans `ressources/planches/`, « je valide » explicite) avant tout code livré ; porte 2 (rendu final validé) avant toute fusion.
Avant de commencer, lire dans `references/regles-communes.md` les sections « Les deux portes », « La cohérence avec le jeu de base » et « Les règles de l'interview » : elles font foi (les autres sections ne s'appliquent pas à ce skill).
Ci-dessous, seulement ce qui est propre à ce skill.

**Dans ce skill** : aucune fusion, aucune release, aucune publication sur le Realm sans la porte 2 passée (rendu final validé par un « je valide » explicite). Une demande de fusion faite avant d'avoir vu la porte 2 ne compte pas : montrer d'abord le rendu final, puis attendre le « je valide ».

**Pour ce skill** : avant la porte 2, vérifier que la liste de cohérence de chaque élément nouveau est entièrement tranchée et essayée, ou notée « non vérifié en jeu ».

## Pourquoi

Un addon n'est fini que quand il tourne **dans le monde des joueurs**, sans l'abîmer. Les pannes de livraison sont muettes et coûtent une soirée :
- un monde qui s'ouvre **sans l'addon** et sans aucune erreur ;
- une version minimale du jeu trop haute, et le **serveur refuse** les packs ;
- une Switch qui ne se connecte plus ;
- un cache de packs qui garde l'**ancienne version**.

## L'interview (le cœur de ce skill)

**C'est une maïeutique : faire exprimer à la personne, aussi loin que possible, ce qu'elle imagine, et laisser émerger ce qu'elle n'avait pas encore formulé, pour produire ce qui lui ressemble et ce que ses joueurs attendent. Claude ne tranche rien seul.** Le savoir-faire plus bas sert à affiner ce qu'elle a exprimé, puis à vérifier le résultat. Il ne remplace jamais sa parole.

### Les règles de l'interview

Celles de `references/regles-communes.md` (section « Les règles de l'interview »), appliquées en entier.

### Les sujets à couvrir, bloc par bloc

*Une carte des sujets, pas un ordre : chaque sujet s'ouvre par une question ouverte ; les précisions entre parenthèses servent à relancer et à bâtir les options ensuite.*

**A. L'addon**
1. **Son nom** affiché, sa **description** et son **icône** (proposer 2 ou 3 icônes en image).
2. **La langue** des textes (et les langues de la console).

**B. Où et comment publier**
3. **Le monde des joueurs** : Realm, serveur, monde solo ; quel emplacement ?
4. **Qui publie, et quand** : à chaque étape fusionnée, avant une soirée de jeu, jamais pendant une partie ?
5. **Les sauvegardes** : combien en garder, où ; tester une restauration au moins une fois ?
6. **Repartir de zéro** : prévoir la possibilité de recommencer un monde neuf (sur quelle graine) ?

**C. Le serveur de test**
7. **Le serveur de test** sur le PC : le monde repart-il de zéro à chaque lancement, ou garde-t-on la partie ?
8. **La connexion de la console** au serveur de test (par BedrockConnect pour la Switch) : déjà en place ?

**D. La validation**
9. **La procédure de publication** décrite pas à pas (double-clic, ce qui s'affiche, que faire en cas d'erreur) : « est-ce exactement ainsi que tu veux publier ? »

## Le savoir-faire (pour bâtir les options, puis vérifier)

### 1. Les manifestes
- **UUID** : créés une fois, **jamais changés** (header et modules). Un nouvel UUID crée un autre addon, et les mondes perdent le leur.
- **Version** : `header.version`, la version de chaque module et la dépendance du pack de comportement vers le pack de ressources, toutes **montées ensemble à chaque livraison**. La Switch garde les packs en cache selon leur version.
- **`min_engine_version` ne se monte jamais** avec la version de l'addon. Elle suit la version du jeu réellement visée (celle du serveur de test et de la console). Monter les deux ensemble a fait refuser l'addon par le serveur.
- Dépendances de scripts : `@minecraft/server` et `@minecraft/server-ui` à des versions **stables** prises en charge par le serveur.
- La même version écrite dans le script (ligne « scripts chargés » de la console).

### 2. Les paquets et la vérification automatique
- Un script fabrique le `.mcpack` de chaque pack et le `.mcaddon` des deux. Il **refuse** une version non montée par rapport à `main`, des UUID changés, des versions incohérentes. Voir `references/construire_paquets.py`.
- Une action GitHub le lance sur chaque PR, et publie une **release** à chaque version de `main`. Voir `references/addon.yml`.
- Une livraison = une branche, une PR, une version. On ne fusionne qu'avec l'accord de la personne.

### 3. Le serveur de test (BDS sur le PC)
- Un script installe ou met à jour le serveur. Il **réécrit `server.properties` en entier à chaque lancement** à partir d'une liste propre, avec les fins de ligne du système (CRLF sous Windows). Un fichier abîmé ou géant fait prendre au serveur ses réglages **par défaut**, graine comprise, sans erreur visible.
- N'écrire que les réglages utiles :
  - nom du monde (`level-name=level`) et **graine** (lue dans un seul fichier) ;
  - mode et difficulté, **triches actives** ;
  - pack de ressources obligatoire, journal du contenu.
  
  Laisser le reste par défaut, notamment le **transport**. Forcer RakNet ou NetherNet a tour à tour coupé la Switch.
- **Activer les packs dans le monde** : `world_behavior_packs.json` et `world_resource_packs.json` dans le dossier du monde (`worlds/level/`). Si le nom du monde est vide, ils partent au mauvais endroit et le monde s'ouvre sans l'addon (« Pack Stack - None »).
- **Preuve que l'addon tourne** : la console affiche « … scripts chargés » avec la version et la graine. Sans cette ligne, rien ne tourne.
- **La Switch** rejoint le serveur du PC par **BedrockConnect** (changement de DNS sur la console, serveur ajouté à sa liste). L'écran partagé marche à quatre.
- **Opérateur** : `/op <nom exact>` (vérifier le nom avec `list`) pour les commandes et les outils de test.
- Voir `references/install-server.sh`.

### 4. Le Realm (le monde de la famille)
- Sur un Realm, **les packs vivent dans le monde**. Publier, c'est :
  1. **refuser si quelqu'un joue** ;
  2. rendre actif l'emplacement de la famille ;
  3. **fermer le Realm** ;
  4. **télécharger et sauvegarder le monde** (garder les 10 dernières sauvegardes) ;
  5. **remplacer les packs** dans le monde (retirer toute ancienne copie du même UUID) ;
  6. **renvoyer** le monde et vérifier qu'il est validé ;
  7. **rouvrir** le Realm, même en cas d'erreur.
  
  Jamais un monde neuf à la place de celui de la famille.
- **Restaurer** une sauvegarde : liste numérotée, confirmation, sauvegarde du monde actuel d'abord.
- **Recommencer** de zéro : un monde neuf **sur la graine de la famille**, après une confirmation forte (taper un mot).
- **Triches activées** sur le monde publié : dialogues natifs, brumes, zones de chargement, écran noir en dépendent.
- Ces opérations passent par l'API Realms non officielle (`prismarine-auth`, `prismarine-realms`, connexion Microsoft une fois). Voir `references/realm.js`.
- Un double-clic (`Publier sur le Realm.cmd`) qui affiche « PUBLIÉ », « DÉJÀ À JOUR » ou une erreur claire.

### 5. Le README de chaque livraison
Pour chaque version, une section « Tester … (X.Y.Z) » :
- ce qui change ;
- comment y aller vite (la baguette, une commande) ;
- ce qu'il faut regarder (les points « non vérifiés en jeu »).

## Liste de contrôle avant de dire « livré »

1. Version montée partout, `min_engine_version` inchangée, UUID inchangés.
2. Types OK, banc de simulation OK, essais de logique OK (`mc-verification`).
3. Paquets fabriqués, vérification automatique verte.
4. `docs/` à jour (décision datée, « non vérifié en jeu »), README de test.
5. Porte 2 passée : rendu final montré, écarts listés, « je valide » explicite.
6. PR ouverte ; fusion seulement à la demande, **après** la porte 2 ; publication sur le Realm par la personne (après un essai sur le serveur de test).

## Code de référence (dans `references/`)

- `construire_paquets.py` : vérifie les manifestes et fabrique les paquets ;
- `addon.yml` : l'action GitHub (vérification des PR, release à chaque version de `main`) ;
- `install-server.sh` : le serveur de test (la version PowerShell suit la même logique) ;
- `realm.js` : publier, sauvegarder, restaurer, recommencer sur un Realm.
