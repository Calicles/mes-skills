#!/bin/bash
# Banc d'essai hors jeu : construit tous les lieux de l'aventure dans un monde simulé (terrain plat),
# puis vérifie que rien ne flotte (lanternes, torches, bougies, crânes, plantes) et que rien ne
# regarde un mur (panneaux, marches, échelles, fours, nos meubles).
# Usage : bash src/outils/simulation/lancer.sh   (Node.js 18+ et Python 3)
set -e
ICI="$(cd "$(dirname "$0")" && pwd)"
RACINE="$(cd "$ICI/../../.." && pwd)"
T="$(mktemp -d)"
mkdir -p "$T/node_modules/@minecraft/server" "$T/node_modules/@minecraft/server-ui"
echo '{"name":"@minecraft/server","type":"module","main":"index.js"}' > "$T/node_modules/@minecraft/server/package.json"
echo '{"name":"@minecraft/server-ui","type":"module","main":"index.js"}' > "$T/node_modules/@minecraft/server-ui/package.json"
cp "$ICI/faux_server.js" "$T/node_modules/@minecraft/server/index.js"
cp "$ICI/faux_server_ui.js" "$T/node_modules/@minecraft/server-ui/index.js"
cp "$ICI/monde.mjs" "$ICI/tout.mjs" "$ICI/audit.py" "$ICI/valider.mjs" "$ICI/blocs_vanilla.json" "$T/"
cp "$ICI/valider.mjs" "$ICI/blocs_vanilla.json" "$T/node_modules/@minecraft/server/"
cp -r "$RACINE/src/aventure_BP/scripts" "$T/scripts"
cd "$T"
python3 - <<'PY'
s=open('scripts/etat.js').read()
s=s.replace("export function lireEtat() {","export function lireEtat() {\n  if (globalThis.ETAT) return globalThis.ETAT;",1)
s=s.replace("export function modifierEtat(modification) {","export function modifierEtat(modification) {\n  if (globalThis.ETAT) { modification(globalThis.ETAT); return globalThis.ETAT; }",1)
open('scripts/etat.js','w').write(s)
s=open('scripts/construction.js').read()
i=s.index("export function construireDoucement(etapes) {")
s=s[:i]+"export function construireDoucement(etapes) {\n  const chantier = { etapes, poses: [] };\n  while (!avancerChantier(chantier).fini);\n}\n"
open('scripts/construction.js','w').write(s)
s=open('scripts/salles.js').read()
s+="\nexport function* genSalle(cle, lieu) { const salle = SALLES[cle]; if (salle.construire) yield* salle.construire(lieu); else { yield* coque(lieu, salle.style); yield* salle.decor(lieu); } }\n"
open('scripts/salles.js','w').write(s)
for f,e in [('domaine.js','construire as construireDomaineGen'),('embellir.js','potager, facadeCuisine, verger, entrainement, facadeEcurie, renaissance, socles'),('barovie.js','construireCamp, roulotte, construirePorte'),('profondeurs.js','construireCite, construireMine as construireTertre'),('cristal.js','construireTunnel, construireGrottes'),('champignons.js','construireTunnel, construireForet'),('lave.js','construire as construireLave'),('mine.js','construireMine as restaurerMine')]:
    open('scripts/'+f,'a').write('\nexport { %s };\n'%e)
PY
node tout.mjs 2>&1 | grep -E "^(ERREUR|total|BLOCS|  - )"
python3 audit.py
echo "(monde simulé : $T/monde.json)"
