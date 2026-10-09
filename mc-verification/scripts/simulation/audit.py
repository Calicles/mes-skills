import json, collections, sys
d = json.load(open('monde.json'))
B = {(x, y, z): (i, st, src) for x, y, z, i, st, src in d}
def defaut(y): return 'air' if y > 64 else 'grass_block' if y == 64 else 'dirt' if y > 60 else 'stone'
def bid(p): return B[p][0] if p in B else defaut(p[1])
PLANTES = ('short_grass','tall_grass','fern','poppy','dandelion','cornflower','oxeye_daisy','allium','tulip','lily_of_the_valley','rose_bush','sweet_berry_bush','red_mushroom','brown_mushroom','sapling','waterlily','reeds','dead_bush','vine','pale_hanging_moss','wither_rose','azure_bluet','blue_orchid','peony','lilac','sunflower')
NONSOLIDE = ('air','water','flowing_water','lava','flowing_lava','torch','lantern','candle','carpet','rail','button','sign','ladder','web','snow_layer','pressure_plate','skull','head','flower_pot','pale_hanging_moss','vine','chain') + PLANTES
def solide(p):
    i = bid(p)
    return not any(n in i for n in NONSOLIDE)
def nonvide(p):
    i = bid(p); return i not in ('air','water','flowing_water','lava','flowing_lava')
DIRS = {2: (0,0,1), 3: (0,0,-1), 4: (1,0,0), 5: (-1,0,0), 0: (0,1,0), 1: (0,-1,0)}  # facing -> bloc porteur
def add(p, v): return (p[0]+v[0], p[1]+v[1], p[2]+v[2])
pb = collections.defaultdict(list)
def signale(cat, p, i, src, detail=''): pb[(cat, src, i)].append((p, detail))
BAS = ('candle','carpet','short_grass','fern','poppy','dandelion','cornflower','oxeye_daisy','allium','tulip','lily_of_the_valley','rose_bush','sweet_berry_bush','red_mushroom','brown_mushroom','sapling','rail','pressure_plate','standing_sign','flower_pot','snow_layer','turtle_egg','wither_rose','reeds')
CULTURES = ('wheat','carrots','potatoes','beetroot')
for p, (i, st, src) in B.items():
    if i == 'air': continue
    sous, dessus = add(p,(0,-1,0)), add(p,(0,1,0))
    if i in ('lantern','soul_lantern'):
        if st.get('hanging'):
            if not nonvide(dessus): signale('lanterne suspendue sans plafond', p, i, src)
        elif not nonvide(sous): signale('lanterne posée dans le vide', p, i, src)
    elif i in ('torch','soul_torch','redstone_torch'):
        f = st.get('torch_facing_direction', 'top')
        porteur = {'top':(0,-1,0),'north':(0,0,1),'south':(0,0,-1),'west':(1,0,0),'east':(-1,0,0)}.get(f,(0,-1,0))
        if not solide(add(p,porteur)): signale('torche sans appui', p, i, src, f)
    elif i in CULTURES:
        if bid(sous) != 'farmland': signale('culture sans terre labourée', p, i, src, bid(sous))
    elif i == 'waterlily':
        if 'water' not in bid(sous): signale('nénuphar hors de l\'eau', p, i, src, bid(sous))
    elif any(k in i for k in BAS) and 'block' not in i and 'stem' not in i:
        if not nonvide(sous) or 'water' in bid(sous): signale('posé dans le vide', p, i, src, bid(sous))
    elif i in ('ladder','wall_sign') or i.endswith('_wall_sign') or i.endswith('button'):
        f = st.get('facing_direction', 0 if i.endswith('button') else 2)
        porteur = add(p, DIRS.get(f,(0,0,1)))
        if not solide(porteur): signale('accroché à rien', p, i, src, f'face {f}, derrière: {bid(porteur)}')
    elif i in ('pale_hanging_moss',):
        if not nonvide(dessus): signale('mousse suspendue sans support', p, i, src)
    elif i == 'bell':
        a = st.get('attachment','standing')
        if a == 'hanging' and not nonvide(dessus): signale('cloche sans support', p, i, src)
        if a == 'standing' and not nonvide(sous): signale('cloche dans le vide', p, i, src)
    elif i == 'vine':
        bits = st.get('vine_direction_bits', 0)
        ok = False
        for bit, v in ((1,(0,0,1)),(2,(-1,0,0)),(4,(0,0,-1)),(8,(1,0,0))):
            if bits & bit and solide(add(p,v)): ok = True
        if not ok: signale('lierre accroché à rien', p, i, src, str(bits))
    elif ('skull' in i or i.endswith('_head')) and st.get('facing_direction', 1) == 1 and not nonvide(sous):
        signale('crâne dans le vide', p, i, src)
    elif i in ('furnace','smoker','blast_furnace','lectern','carved_pumpkin','lit_pumpkin','loom','stonecutter_block','grindstone','anvil','barrel','chest','beehive','composter','smithing_table','crafting_table','cauldron','enchanting_table','brewing_stand'):
        if i in ('furnace','smoker','blast_furnace','lectern','carved_pumpkin','barrel','chest','loom'):
            pb[('(orientables)', src, i + (' [orienté]' if st else ' [sans orientation]'))].append((p,''))
tot = collections.Counter()
for (cat, src, i), l in sorted(pb.items()):
    tot[cat] += len(l)
    if cat.startswith('('): continue
    print(f'{cat:32s} {src:22s} {i:24s} {len(l):5d}  ex: {l[0][0]} {l[0][1]}')
print(); [print(k, v) for k, v in tot.items()]
print()
for (cat, src, i), l in sorted(pb.items()):
    if cat.startswith('('): print(f'{src:22s} {i:40s} {len(l)}')

print("\n=== Sens (face avant contre un mur) ===")
def avant_panneau(d):
    import math
    a = (d % 16) * 22.5  # 0 = sud
    return (round(-math.sin(math.radians(a))), 0, round(math.cos(math.radians(a))))
STAIR = {0: (-1,0,0), 1: (1,0,0), 2: (0,0,-1), 3: (0,0,1)}
FACE = {2: (0,0,-1), 3: (0,0,1), 4: (-1,0,0), 5: (1,0,0)}
CARD = {'north': (0,0,-1), 'south': (0,0,1), 'west': (-1,0,0), 'east': (1,0,0)}
sens = collections.defaultdict(list)
for p, (i, st, src) in B.items():
    if i.endswith('standing_sign') or i == 'standing_sign':
        v = avant_panneau(st.get('ground_sign_direction', 0))
        if solide(add(p, v)) and solide(add(add(p, v), (0,1,0))): sens[('panneau face au mur', src, i)].append(p)
    elif i.endswith('_stairs') and not st.get('upside_down_bit'):
        v = STAIR.get(st.get('weirdo_direction', 0))
        if solide(add(p, v)): sens[('marche bouchée devant', src, i)].append((p, st.get('weirdo_direction', 0)))
    elif i == 'ladder' or i.endswith('wall_sign'):
        v = FACE.get(st.get('facing_direction', 2))
        if v and solide(add(p, v)): sens[('face avant contre un mur', src, i)].append(p)
    elif i in ('furnace','smoker','blast_furnace','lectern','carved_pumpkin','loom'):
        c = st.get('minecraft:cardinal_direction')
        v = CARD.get(c) if c else None
        if v and solide(add(p, v)): sens[('face avant contre un mur', src, i)].append(p)
for (cat, src, i), l in sorted(sens.items()):
    print(f'{cat:28s} {src:22s} {i:28s} {len(l):4d} ex: {l[:3]}')
print('total', sum(len(l) for l in sens.values()))
