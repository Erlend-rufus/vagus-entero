#!/usr/bin/env python3
"""Repeterbar font-subsetting for Vagus Entero AS.

Dagens fil (src/fonter/source-sans-3-norsk.woff2) er Fontsource sitt
latin-subsett av Source Sans 3 Variable (SIL OFL 1.1), som dekker hele
Latin-1 inkl. æ ø å og norsk typografi (« » – — ’). Dette scriptet er den
dokumenterte veien til å regenerere subsettet fra en full fontfil, f.eks.
ved fontoppgradering.

Bruk:
  pip install "fonttools[woff]"
  python3 verktoy/subsett-font.py <full-font.ttf/otf>

Sanity: resultatet skal ligge på ca. 25-45 KB. Er filen vesentlig større,
er subsettingen feil — ikke commit.
"""

import subprocess
import sys
from pathlib import Path

UT = Path("src/fonter/source-sans-3-norsk.woff2")
MAKS_BYTES = 60_000

# Latin-1 (dekker a-å, æ, ø, å, ÆØÅ) + norsk typografisk tegnsett.
UNICODES = "U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122"

def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    kilde = Path(sys.argv[1])
    if not kilde.exists():
        print(f"Finner ikke {kilde}")
        return 2

    subprocess.run(
        [
            "pyftsubset",
            str(kilde),
            f"--unicodes={UNICODES}",
            "--layout-features=*",
            "--flavor=woff2",
            f"--output-file={UT}",
        ],
        check=True,
    )

    storrelse = UT.stat().st_size
    print(f"Skrev {UT} ({storrelse} bytes)")
    if storrelse > MAKS_BYTES:
        print(f"FEIL: over sanity-grensen på {MAKS_BYTES} bytes — ikke commit dette.")
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
