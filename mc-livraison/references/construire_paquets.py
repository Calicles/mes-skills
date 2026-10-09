"""Vérifie les manifest.json et fabrique les paquets de l'addon.

Produit dans build/ :
  - aventure_BP.mcpack et aventure_RP.mcpack (un pack chacun) ;
  - le-domaine-oublie-X.Y.Z.mcaddon (les deux packs ensemble).

Vérifications (le script s'arrête sur la première erreur trouvée par pack) :
  - header et modules ont la même version ; les UUID sont présents ;
  - le pack de comportement dépend du pack de ressources dans sa version exacte ;
  - avec --reference REF (ex. origin/main) : tout pack modifié depuis REF a une version
    plus grande qu'en REF, et ses UUID n'ont pas changé.

Usage :
  python src/outils/construire_paquets.py
  python src/outils/construire_paquets.py --reference origin/main
  python src/outils/construire_paquets.py --verifier-seulement --reference origin/main
"""
import argparse
import json
import subprocess
import sys
import zipfile
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
PACKS = ["aventure_BP", "aventure_RP"]
NOM_ADDON = "le-domaine-oublie"


def lire_manifest(texte):
    return json.loads(texte.lstrip("﻿"))


def version_texte(v):
    return ".".join(str(n) for n in v)


def verifier_pack(nom, manifest):
    erreurs = []
    header = manifest.get("header", {})
    version = header.get("version")
    if not header.get("uuid"):
        erreurs.append(f"{nom} : header.uuid manquant")
    if not (isinstance(version, list) and len(version) == 3):
        erreurs.append(f"{nom} : header.version doit être [x, y, z]")
        return erreurs
    for module in manifest.get("modules", []):
        if module.get("version") != version:
            erreurs.append(
                f"{nom} : le module {module.get('type')} est en {version_texte(module.get('version', []))}, "
                f"le header en {version_texte(version)} (mettre la même version partout)"
            )
    return erreurs


def verifier_dependance(bp, rp):
    rp_uuid = rp["header"]["uuid"]
    rp_version = rp["header"]["version"]
    for dep in bp.get("dependencies", []):
        if dep.get("uuid") == rp_uuid:
            if dep.get("version") != rp_version:
                return [
                    f"aventure_BP dépend du pack de ressources en {version_texte(dep.get('version', []))}, "
                    f"mais il est en {version_texte(rp_version)}"
                ]
            return []
    return ["aventure_BP ne déclare pas de dépendance au pack de ressources"]


def git(*args):
    return subprocess.run(["git", *args], cwd=RACINE, capture_output=True, text=True, encoding="utf-8")


def verifier_par_rapport_a(reference, manifests):
    erreurs = []
    for nom in PACKS:
        chemin = f"src/{nom}"
        diff = git("diff", "--quiet", reference, "--", chemin)
        if diff.returncode == 0:
            continue  # pack inchangé
        if diff.returncode != 1:
            erreurs.append(f"git diff impossible avec {reference} : {diff.stderr.strip()}")
            continue
        ancien = git("show", f"{reference}:{chemin}/manifest.json")
        if ancien.returncode != 0:
            continue  # pack nouveau dans cette branche
        avant = lire_manifest(ancien.stdout)
        apres = manifests[nom]
        if avant["header"]["uuid"] != apres["header"]["uuid"]:
            erreurs.append(f"{nom} : l'UUID du header a changé (il ne doit jamais changer)")
        anciens_modules = {m.get("type"): m.get("uuid") for m in avant.get("modules", [])}
        for module in apres.get("modules", []):
            ancien_uuid = anciens_modules.get(module.get("type"))
            if ancien_uuid and ancien_uuid != module.get("uuid"):
                erreurs.append(f"{nom} : l'UUID du module {module.get('type')} a changé (il ne doit jamais changer)")
        v_avant, v_apres = avant["header"]["version"], apres["header"]["version"]
        if tuple(v_apres) <= tuple(v_avant):
            erreurs.append(
                f"{nom} a été modifié mais sa version n'a pas augmenté "
                f"({version_texte(v_avant)} sur {reference}, {version_texte(v_apres)} ici) : "
                "sans ça, la Switch et le Realm gardent l'ancienne version en cache"
            )
    return erreurs


def fichiers_du_pack(dossier):
    for chemin in sorted(dossier.rglob("*")):
        if chemin.is_file() and "__pycache__" not in chemin.parts:
            yield chemin


def ecrire_zip(destination, entrees):
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED) as z:
        for chemin, nom_dans_zip in entrees:
            z.write(chemin, nom_dans_zip)


def construire(manifests, sortie):
    sortie.mkdir(parents=True, exist_ok=True)
    for ancien in list(sortie.glob("*.mcpack")) + list(sortie.glob("*.mcaddon")):
        ancien.unlink()
    entrees_addon = []
    for nom in PACKS:
        dossier = RACINE / "src" / nom
        entrees = [(f, f.relative_to(dossier).as_posix()) for f in fichiers_du_pack(dossier)]
        ecrire_zip(sortie / f"{nom}.mcpack", entrees)
        entrees_addon += [(f, f"{nom}/{dans_zip}") for f, dans_zip in entrees]
    version = version_texte(manifests["aventure_BP"]["header"]["version"])
    addon = sortie / f"{NOM_ADDON}-{version}.mcaddon"
    ecrire_zip(addon, entrees_addon)
    return addon


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--reference", help="branche ou commit de comparaison (ex. origin/main)")
    parser.add_argument("--verifier-seulement", action="store_true", help="ne pas fabriquer les paquets")
    parser.add_argument("--sortie", default=str(RACINE / "build"), help="dossier de sortie (défaut : build/)")
    args = parser.parse_args()

    manifests = {}
    erreurs = []
    for nom in PACKS:
        chemin = RACINE / "src" / nom / "manifest.json"
        try:
            manifests[nom] = lire_manifest(chemin.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            erreurs.append(f"{nom} : manifest.json illisible ({e})")
    if not erreurs:
        for nom in PACKS:
            erreurs += verifier_pack(nom, manifests[nom])
    if not erreurs:
        erreurs += verifier_dependance(manifests["aventure_BP"], manifests["aventure_RP"])
    if not erreurs and args.reference:
        erreurs += verifier_par_rapport_a(args.reference, manifests)

    if erreurs:
        for e in erreurs:
            print(f"ERREUR : {e}", file=sys.stderr)
        return 1

    for nom in PACKS:
        print(f"{nom} {version_texte(manifests[nom]['header']['version'])} : OK")
    if not args.verifier_seulement:
        addon = construire(manifests, Path(args.sortie))
        print(f"Paquets fabriqués dans {addon.parent}")
        for f in sorted(addon.parent.iterdir()):
            print(f"  {f.name} ({f.stat().st_size // 1024} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
