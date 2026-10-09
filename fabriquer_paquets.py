"""Fabrique les paquets .skill de livrables/skills/paquets/.

Chaque paquet contient le dossier complet du skill. Si son SKILL.md renvoie à
references/regles-communes.md, la source unique commun/regles-communes.md y est
ajoutée à cet emplacement ; s'il renvoie à references/hook-porte1/, le kit
commun/hook-porte1/ (script et configuration du hook de la porte 1) aussi.

Usage (depuis livrables/skills/) : python3 fabriquer_paquets.py [skill ...]
Sans argument : tous les skills.
"""
import os, sys, zipfile

COMMUN = 'commun/regles-communes.md'
RENVOI = 'references/regles-communes.md'
HOOK = 'commun/hook-porte1'
RENVOI_HOOK = 'references/hook-porte1/'

def fabriquer(skill):
    with zipfile.ZipFile(f'paquets/{skill}.skill', 'w', zipfile.ZIP_DEFLATED) as z:
        for racine, _, fichiers in sorted(os.walk(skill)):
            for f in sorted(fichiers):
                z.write(os.path.join(racine, f))
        texte = open(f'{skill}/SKILL.md', encoding='utf-8').read()
        if RENVOI in texte:
            z.write(COMMUN, f'{skill}/{RENVOI}')
        if RENVOI_HOOK in texte:
            for f in sorted(os.listdir(HOOK)):
                z.write(os.path.join(HOOK, f), f'{skill}/{RENVOI_HOOK}{f}')

skills = sys.argv[1:] or sorted(d for d in os.listdir('.') if os.path.isfile(f'{d}/SKILL.md'))
for s in skills:
    fabriquer(s)
    print('ok', s)
