"""Régénère blocs_vanilla.json (les blocs du jeu, leurs états et le type de chaque état) depuis le
paquet npm @minecraft/vanilla-data, à la version du jeu visée :
    npm install @minecraft/vanilla-data@1.26.52   (dans un dossier à part)
    python3 extraire_blocs_vanilla.py <dossier>/node_modules/@minecraft/vanilla-data/lib/mojang-block.d.ts
Écrit blocs_vanilla.json à côté de ce script : { ids: [...], etats: { id: [noms] }, types: { nom: type } }."""
import json
import re
import sys
from pathlib import Path

source = Path(sys.argv[1]).read_text(encoding="utf-8")

# Les identifiants : enum MinecraftBlockTypes { AcaciaButton = "minecraft:acacia_button", ... }
noms = dict(re.findall(r'^\s+(\w+) = "(minecraft:[a-z0-9_]+)",?$', source, re.M))
ids = sorted(set(noms.values()))

# Le type de chaque état : export type BlockStateSuperset = { 'nom': type; ... }
debut = source.index("export type BlockStateSuperset")
bloc = source[debut:source.index("};", debut)]
types = {}
for nom, t in re.findall(r"\['?\"?([\w:]+)'?\"?\]?\??:\s*([^;]+);", bloc):
    t = t.strip()
    types[nom] = "boolean" if t == "boolean" else "number" if t == "number" or re.fullmatch(r"[\d |]+", t) else "string"

# Les états de chaque bloc : export type AcaciaButtonStates = Pick<BlockStateSuperset, 'a' | 'b'>;
etats = {}
for nom, liste in re.findall(r"export type (\w+)States = Pick<BlockStateSuperset, ([^>]+)>;", source):
    if nom in noms:
        etats[noms[nom]] = re.findall(r"'([\w:]+)'", liste)

sortie = Path(__file__).resolve().parent / "blocs_vanilla.json"
sortie.write_text(json.dumps({"ids": ids, "etats": etats, "types": types}, ensure_ascii=False), encoding="utf-8")
print(f"{len(ids)} blocs, {len(etats)} avec des états, {len(types)} noms d'état → {sortie}")
