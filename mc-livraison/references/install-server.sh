#!/usr/bin/env bash
# Installe (si besoin) le Bedrock Dedicated Server dans ./server,
# y déploie les packs de l'addon (src/aventure_BP, src/aventure_RP), puis lance le serveur.
# Relancer le script après chaque modification de l'addon pour le redéployer.
#
# Usage :
#   ./scripts/install-server.sh                      # télécharge la dernière version
#   ./scripts/install-server.sh /chemin/bedrock-server-x.y.z.zip
#   NO_START=1 ./scripts/install-server.sh           # déploie sans lancer
#   KEEP_WORLD=1 ./scripts/install-server.sh         # garde le monde de test précédent
#
# Le monde de test repart de zéro à chaque lancement (le monde de la famille est sur le Realm).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT/server"
ZIP_PATH="${1:-}"

# 1. Téléchargement / extraction du serveur
if [[ ! -x "$SERVER_DIR/bedrock_server" ]]; then
  if [[ -z "$ZIP_PATH" ]]; then
    echo "Recherche de la dernière version du Bedrock Dedicated Server..."
    URL="$(curl -fsSL https://net-secondary.web.minecraft-services.net/api/v1.0/download/links \
      | python3 -c 'import json,sys; print(next(l["downloadUrl"] for l in json.load(sys.stdin)["result"]["links"] if l["downloadType"]=="serverBedrockLinux"))' \
      || true)"
    if [[ -z "$URL" ]]; then
      echo "Lien introuvable. Télécharge le zip Linux sur https://www.minecraft.net/download/server/bedrock" >&2
      echo "puis relance : $0 /chemin/du/zip" >&2
      exit 1
    fi
    ZIP_PATH="$(mktemp --suffix=.zip)"
    echo "Téléchargement de $URL"
    curl -fL -A "Mozilla/5.0" -o "$ZIP_PATH" "$URL"
  fi
  echo "Extraction dans $SERVER_DIR"
  mkdir -p "$SERVER_DIR"
  unzip -oq "$ZIP_PATH" -d "$SERVER_DIR"
  chmod +x "$SERVER_DIR/bedrock_server"
fi

# 2. server.properties, réécrit en entier à chaque lancement (survie, Facile ; l'inventaire gardé à la
#    mort est réglé par l'addon). Réécrit plutôt que modifié : un fichier abîmé faisait ignorer au serveur
#    1.26.52 tous ses réglages, graine de la famille comprise. Les réglages absents gardent leur valeur
#    par défaut.
PROPS="$SERVER_DIR/server.properties"
LEVEL_NAME=level
cat > "$PROPS" <<PROPRIETES
level-name=$LEVEL_NAME
level-seed=$(head -n1 "$ROOT/scripts/graine.txt" | tr -d '[:space:]')
gamemode=survival
force-gamemode=true
difficulty=easy
allow-cheats=true
texturepack-required=true
content-log-file-enabled=true
PROPRIETES
# (Pas de réglage du mode de connexion : la valeur par défaut du serveur 1.26.5x, NetherNet, est la
#  seule qui laisse entrer la Switch ; « transport=raknet » la bloquait, erreur « silverfish ».)
echo "Réglages écrits : $(grep -E '^(level-name|level-seed|gamemode)=' "$PROPS" | tr '\n' ' ')"

# 3. Copie des packs + activation sur le monde
WORLD_DIR="$SERVER_DIR/worlds/$LEVEL_NAME"
if [ -d "$WORLD_DIR" ] && [ -z "${KEEP_WORLD:-}" ]; then
  rm -rf "$WORLD_DIR"
  echo "Nouveau monde de test : l'ancien est effacé (KEEP_WORLD=1 pour le garder)."
fi
mkdir -p "$WORLD_DIR"
deploy_pack() { # $1 = dossier du pack, $2 = dossier cible, $3 = fichier world_*_packs.json
  rm -rf "$SERVER_DIR/$2/$1"
  cp -r "$ROOT/src/$1" "$SERVER_DIR/$2/$1"
  python3 - "$ROOT/src/$1/manifest.json" "$WORLD_DIR/$3" <<'EOF'
import json, sys
h = json.load(open(sys.argv[1]))["header"]
json.dump([{"pack_id": h["uuid"], "version": h["version"]}], open(sys.argv[2], "w"), indent=2)
print(f"Pack {h['name']} {'.'.join(map(str, h['version']))} déployé")
EOF
}
deploy_pack aventure_BP behavior_packs world_behavior_packs.json
deploy_pack aventure_RP resource_packs world_resource_packs.json

# 4. Adresses IP locales à utiliser depuis la Switch
echo
echo "Adresse(s) IP de cette machine (à taper sur la Switch, port 19132) :"
hostname -I 2>/dev/null | tr ' ' '\n' | grep -E '^[0-9]+\.' | sed 's/^/  /' || true
echo

if [[ -z "${NO_START:-}" ]]; then
  echo 'Démarrage du serveur (tape "stop" pour l'"'"'arrêter)...'
  cd "$SERVER_DIR"
  LD_LIBRARY_PATH=. exec ./bedrock_server
fi
