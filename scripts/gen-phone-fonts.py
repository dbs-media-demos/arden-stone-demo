"""
The two font files phones load: Cormorant Garamond 400, roman and italic, Latin plus the
Latin-extended letters real business names and Serbian previews use. Desktop keeps next/font.

Sources (OFL), from github.com/google/fonts/tree/main/ofl/cormorantgaramond:
  python scripts/gen-phone-fonts.py "CormorantGaramond[wght].ttf" "CormorantGaramond-Italic[wght].ttf"
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x180))
    + [0x2C6, 0x2DA, 0x2DC, 0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2022, 0x2026]
    + [0x2039, 0x203A, 0x20AC, 0x2122, 0x2190, 0x2192, 0x2197, 0x2212]
)

for src, out in ((sys.argv[1], "cormorant-phone.woff2"), (sys.argv[2], "cormorant-phone-italic.woff2")):
    font = instancer.instantiateVariableFont(TTFont(src), {"wght": 400})
    options = subset.Options()
    options.layout_features = ["kern", "liga", "mark", "mkmk", "ccmp", "locl"]
    options.flavor = "woff2"
    options.name_IDs = [1, 2, 4, 6]
    options.hinting = False
    options.desubroutinize = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(f"public/fonts/{out}")
