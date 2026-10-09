"""Modèle tiré du Domaine oublié : peindre une texture de créature en « box UV » (disposition standard
Bedrock) avec Pillow, sans logiciel de dessin. Patron(img, u, v, largeur, hauteur, profondeur) donne
les six faces d'un cube ; peindre(face, couleur ou fonction(x, y, w, h)). Les pixels à demi
transparents brillent avec le matériau entity_emissive_alpha (voir allumer)."""
from pathlib import Path
from PIL import Image

RACINE = Path(__file__).resolve().parent
class Patron:
    """Dessine sur les faces d'un cube en « box UV » (disposition standard Bedrock)."""

    def __init__(self, image, u, v, w, h, d):
        self.img, self.u, self.v, self.w, self.h, self.d = image, u, v, w, h, d

    def faces(self):
        u, v, w, h, d = self.u, self.v, self.w, self.h, self.d
        return {
            "dessus": (u + d, v, w, d),
            "dessous": (u + d + w, v, w, d),
            "droite": (u, v + d, d, h),
            "devant": (u + d, v + d, w, h),
            "gauche": (u + d + w, v + d, d, h),
            "dos": (u + 2 * d + w, v + d, w, h),
        }

    def peindre(self, face, couleur):
        """couleur : un tuple, ou une fonction (x, y, largeur, hauteur) -> tuple."""
        x0, y0, largeur, hauteur = self.faces()[face]
        for y in range(hauteur):
            for x in range(largeur):
                c = couleur(x, y, largeur, hauteur) if callable(couleur) else couleur
                self.img.putpixel((x0 + x, y0 + y), c)

    def peindre_tout(self, couleur):
        for face in self.faces():
            self.peindre(face, couleur)



def motif(couleurs):
    return lambda x, y, *_: couleurs[(x * 7 + y * 3 + (x * y) % 5) % len(couleurs)]


def humanoide(img, peau, corps, jambes, visage=None, bras=None):
    tete = Patron(img, 0, 0, 8, 8, 8)
    tete.peindre_tout(motif(peau))
    if visage:
        tete.peindre("devant", visage)
    Patron(img, 0, 16, 8, 12, 4).peindre_tout(motif(corps))
    Patron(img, 24, 16, 4, 12, 4).peindre_tout(motif(bras or peau))
    Patron(img, 40, 16, 4, 12, 4).peindre_tout(motif(jambes))


# --- Ce qui brille dans le noir (matériau entity_emissive_alpha : un pixel à demi transparent brille) ---
LUEUR = 40  # opacité des pixels qui brillent (plus elle est basse, plus ils brillent)
LUEURS = {
    "loup_garou": [(240, 200, 40)],
    "alpha_loup": [(230, 40, 40)],
    "roi_fantomes": [(90, 200, 255)],
    "golem_cristal": [(150, 230, 255), (220, 190, 255)],
    "lutin_cristal": [(250, 220, 60), (230, 200, 255)],
    "eclat_cristal": [(230, 200, 255), (160, 110, 230)],
    "luciole": [(240, 255, 120), (210, 250, 90)],
    "braisombre": [(255, 130, 30), (255, 200, 70), (255, 230, 80)],
    "salamandre": [(255, 210, 60)],
    "petit_magma": [(255, 140, 30), (255, 230, 60)],
    "comte": [(220, 20, 30)],
    "merlin": [(120, 220, 255), (70, 160, 240)],
}


def allumer(nom):
    """Rend brillants (à demi transparents) les pixels des couleurs de LUEURS[nom] ; le drap des
    fantômes, déjà à demi transparent, brille de lui-même."""
    chemin = RACINE / f"{nom}.png"
    img = Image.open(chemin).convert("RGBA")
    couleurs = set(LUEURS.get(nom, []))
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = img.getpixel((x, y))
            if a == 255 and (r, g, b) in couleurs:
                img.putpixel((x, y), (r, g, b, LUEUR))
    img.save(chemin)


