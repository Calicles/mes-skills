"""Régénère les copies des fichiers communs, les paquets et mes-skills.zip.

Source unique : commun/regles-communes.md et commun/hook-porte1/.
1. Copie dans chaque skill qui y renvoie : <skill>/references/regles-communes.md
   et <skill>/references/hook-porte1/ (copies générées, ne pas les modifier).
2. Fabrique paquets/<skill>.skill (le dossier complet du skill).
3. Fabrique mes-skills.zip (un dossier par skill, SKILL.md à sa racine).

Usage (depuis la racine de mes-skills/) : python3 fabriquer_paquets.py
"""
import os, shutil, zipfile

COMMUN = 'commun/regles-communes.md'
RENVOI = 'references/regles-communes.md'
HOOK = 'commun/hook-porte1'
RENVOI_HOOK = 'references/hook-porte1/'


def copier_communs(skill):
    texte = open(f'{skill}/SKILL.md', encoding='utf-8').read()
    if RENVOI in texte:
        os.makedirs(f'{skill}/references', exist_ok=True)
        shutil.copyfile(COMMUN, f'{skill}/{RENVOI}')
    if RENVOI_HOOK in texte:
        os.makedirs(f'{skill}/{RENVOI_HOOK}', exist_ok=True)
        for f in sorted(os.listdir(HOOK)):
            shutil.copyfile(os.path.join(HOOK, f), f'{skill}/{RENVOI_HOOK}{f}')


def fichiers(skill):
    for racine, _, noms in sorted(os.walk(skill)):
        for f in sorted(noms):
            yield os.path.join(racine, f)


skills = sorted(d for d in os.listdir('.') if os.path.isfile(f'{d}/SKILL.md'))
os.makedirs('paquets', exist_ok=True)
with zipfile.ZipFile('mes-skills.zip', 'w', zipfile.ZIP_DEFLATED) as tout:
    for s in skills:
        copier_communs(s)
        with zipfile.ZipFile(f'paquets/{s}.skill', 'w', zipfile.ZIP_DEFLATED) as z:
            for f in fichiers(s):
                z.write(f)
                tout.write(f)
        print('ok', s)
