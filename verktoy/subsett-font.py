#!/usr/bin/env python3
"""Repeterbar font-subsetting for Vagus Entero AS.

Nettstedet bruker to selvhostede variable fonter (vedtak 27.08.2026,
Utkast 08): EB Garamond til overskrifter og ordmerke, Work Sans til
brødtekst. Begge er SIL OFL 1.1. Kildefilene er Fontsource sine latinske
variable woff2-er; dette scriptet snevrer dem videre inn til norsk
tegnsett, slik at begge til sammen holder seg innenfor ytelsesbudsjettet.

Kursiv lastes ikke: designsystemet bruker aldri kursiv i løpende tekst.

Bruk:
  pip install "fonttools[woff]"
  npm pack @fontsource-variable/eb-garamond @fontsource-variable/work-sans
  python3 verktoy/subsett-font.py <katalog-med-kildefiler>

Katalogen skal inneholde eb-garamond-latin-wght-normal.woff2 og
work-sans-latin-wght-normal.woff2.
"""

import subprocess
import sys
from pathlib import Path

# Norsk tegnsett: ASCII, æøå/ÆØÅ, de aksenttegnene som forekommer i navn og
# låneord, og norsk typografi (« » – — ' ' " "). Bevisst smalere enn hele
# Latin-1 — hvert tegn vi ikke trenger er byte over bretten.
UNICODES = (
    "U+0020-007E,U+00A0,U+00AB,U+00BB,U+00C4-00C6,U+00C9,U+00D6,U+00D8,U+00DC,"
    "U+00E0,U+00E4-00E6,U+00E8-00EB,U+00F4,U+00F6,U+00F8,U+00FC,"
    "U+00A7,U+00B0,U+00D7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,"
    "U+2022,U+2026,U+2039,U+203A,U+2212"
)

# Kun de OpenType-funksjonene nettstedet faktisk bruker. «*» tar med
# kapiteler, gammelstil-tall og pyntligaturer vi aldri setter, og koster
# rundt 6 KB per fil.
FUNKSJONER = "kern,liga,clig,tnum,ccmp,mark,mkmk"

# Samlet tak for begge filene. Enkeltfilene får hver sin sanity-grense.
MAKS_TOTALT = 60_000

FONTER = [
    ("eb-garamond-latin-wght-normal.woff2", "src/fonter/eb-garamond-norsk.woff2", 30_000),
    ("work-sans-latin-wght-normal.woff2", "src/fonter/work-sans-norsk.woff2", 32_000),
]


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    kildekatalog = Path(sys.argv[1])
    if not kildekatalog.is_dir():
        print(f"Finner ikke katalogen {kildekatalog}")
        return 2

    totalt = 0
    feil = False
    for kildenavn, utsti, maks in FONTER:
        treff = list(kildekatalog.rglob(kildenavn))
        if not treff:
            print(f"FEIL: fant ikke {kildenavn} under {kildekatalog}")
            return 2
        ut = Path(utsti)
        ut.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                "pyftsubset",
                str(treff[0]),
                f"--unicodes={UNICODES}",
                f"--layout-features={FUNKSJONER}",
                "--flavor=woff2",
                f"--output-file={ut}",
            ],
            check=True,
        )
        storrelse = ut.stat().st_size
        totalt += storrelse
        merknad = "" if storrelse <= maks else f"  ← over grensen på {maks} bytes"
        print(f"Skrev {ut} ({storrelse} bytes){merknad}")
        if storrelse > maks:
            feil = True

    print(f"Til sammen {totalt} bytes (tak {MAKS_TOTALT}).")
    if totalt > MAKS_TOTALT:
        print("FEIL: over det samlede taket — ikke commit dette.")
        feil = True
    return 1 if feil else 0


if __name__ == "__main__":
    raise SystemExit(main())
