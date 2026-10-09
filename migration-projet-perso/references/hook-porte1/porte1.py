#!/usr/bin/env python3
"""Porte 1 (règle 0 du CLAUDE.md) : aucun code dans src/ sans fiche VALIDÉE.

Hook PreToolUse sur Edit, Write, MultiEdit et NotebookEdit.
- Écriture dans src/ : refusée tant qu'il n'y a pas au moins une
  docs/fiche-<étape>.md, ou qu'une fiche n'a pas le statut « VALIDÉE ».
- Passage d'une fiche au statut « VALIDÉE » : demandé à la personne
  (c'est son « je valide », pas celui de Claude).
Le statut est une ligne « Statut : VALIDÉE » (gras Markdown toléré).
"""
import glob, json, os, re, sys

STATUT = re.compile(r'^\W*statut\W*:\W*([^\n*_]+)', re.I | re.M)
VALIDEE = re.compile(r'^valid[ée]e\b', re.I)


def statut(texte):
    m = STATUT.search(texte)
    return m.group(1).strip() if m else None


def est_validee(texte):
    s = statut(texte)
    return bool(s and VALIDEE.match(s))


def repondre(decision, raison):
    print(json.dumps({'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'permissionDecision': decision,
        'permissionDecisionReason': raison}}, ensure_ascii=False))
    sys.exit(0)


def main():
    e = json.load(sys.stdin)
    entree = e.get('tool_input') or {}
    chemin = entree.get('file_path') or entree.get('notebook_path')
    if not chemin:
        return
    racine = os.path.realpath(os.environ.get('CLAUDE_PROJECT_DIR') or e.get('cwd') or '.')
    cible = os.path.realpath(os.path.join(racine, chemin))
    rel = os.path.relpath(cible, racine).replace(os.sep, '/')

    # 1. Le statut « VALIDÉE » n'est écrit qu'avec l'accord de la personne :
    #    on compare le statut de la fiche avant et après la modification.
    if re.fullmatch(r'docs/fiche-[^/]+\.md', rel):
        try:
            with open(cible, encoding='utf-8') as fh:
                avant = fh.read()
        except OSError:
            avant = ''
        if 'content' in entree:
            apres = str(entree['content'])
        else:
            apres = avant
            for ed in entree.get('edits') or [entree]:
                vieux, neuf = str(ed.get('old_string', '')), str(ed.get('new_string', ''))
                if ed.get('replace_all'):
                    apres = apres.replace(vieux, neuf)
                else:
                    apres = apres.replace(vieux, neuf, 1)
        if est_validee(apres) and not est_validee(avant):
            repondre('ask', f'Porte 1 : passer {rel} au statut « VALIDÉE » ? '
                            'Accepter seulement si tu as dit « je valide ».')
        return

    # 2. Rien dans src/ sans fiche validée.
    if rel != 'src' and not rel.startswith('src/'):
        return
    fiches = sorted(glob.glob(os.path.join(racine, 'docs', 'fiche-*.md')))
    if not fiches:
        repondre('deny', 'Porte 1 : aucune docs/fiche-<étape>.md. Rédige la fiche '
                         'de l\'étape et fais-la valider avant d\'écrire dans src/.')
    en_attente = []
    for f in fiches:
        with open(f, encoding='utf-8') as fh:
            texte = fh.read()
        if not est_validee(texte):
            s = statut(texte)
            en_attente.append(f'{os.path.relpath(f, racine)} ({s or "sans statut"})')
    if en_attente:
        repondre('deny', 'Porte 1 : fiche pas encore « VALIDÉE » : ' + ', '.join(en_attente)
                 + '. Pas de code dans src/ avant le « je valide » de la personne.')


if __name__ == '__main__':
    main()
