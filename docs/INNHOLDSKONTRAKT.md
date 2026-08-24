# Innholdskontrakten — slik leveres tekst inn i nettstedet

Dette er formatet tekstproduksjonen leverer i. Én markdown-fil per side, i
`src/innhold/`. Bygget validerer hver fil mot kontrakten og **stopper med
forståelig feilmelding** hvis noe mangler — det finnes ingen standardverdier,
med vilje: en tom side er et bedre utfall enn en oppdiktet side.

## Frontmatter — alle felter

```yaml
---
sidetype:          # forside | undersokelse | tilstand | behandling | pris
                   #   | henviser | forsikring | statisk
url:               # /koloskopi/ — små bokstaver, tall, bindestrek, skråstrek
                   #   først og sist. Unik for hele nettstedet.
malgruppe:         # selvbetalende | henviser | forsikring
tittel:            # Blir <title> og sidens H1. 15–60 tegn.
meta_beskrivelse:  # 70–155 tegn.
status:            # UTKAST | KLAR_FOR_MEDISINSK_GJENNOMGANG | GODKJENT
godkjent_av:       # null til fagansvarlig lege har signert. Deretter navnet.
godkjent_dato:     # null, eller ÅÅÅÅ-MM-DD.
jsonld_type:       # MedicalProcedure | MedicalClinic | Physician | null
interne_lenker_ut: # liste over url-er siden lenker til, f.eks. [/koloskopi/]
apne_punkter:      # liste med uavklarte [BEKREFT]-punkter. MÅ være tom
                   #   før status kan bli GODKJENT.
i_navigasjon:      # true = i hovedmenyen, false = ev. i bunnteksten (statisk)
rekkefolge:        # heltall — plassering i menyen (lavest først)
sist_oppdatert:    # valgfri: ÅÅÅÅ-MM-DD, datostempling av medisinsk innhold
ingress:           # valgfri (brukes på forsiden): 30–300 tegn, vises under H1
undersokelser_tittel: # valgfri (forsiden): overskrift for det automatiske
                   #   utvalget av undersøkelsessider. Kortene genereres av
                   #   bygget fra undersokelse-sidenes tittel/meta_beskrivelse
bilder:            # valgfri liste, se under
priser:            # kun sidetype pris, se under
---
```

Etter frontmatter kommer brødteksten i vanlig markdown.

## Reglene bygget håndhever

1. Mangler et obligatorisk felt → bygget feiler og navngir felt og fil.
2. `status` er ikke `GODKJENT` → siden vises i forhåndsvisning med tydelig
   UTKAST-banner, men **finnes ikke** i produksjonsbygget: ikke i utdata, ikke
   i menyen, ikke i sitemap.
3. `GODKJENT` krever `godkjent_av` + `godkjent_dato` og tom `apne_punkter`.
   Ingen signatur, ingen publisering.
4. To sider kan ikke ha samme `url`.
5. Interne lenker sjekkes mot **den faktiske HTML-en**: lenker en godkjent side
   til en side som ikke finnes i produksjonsbygget, stopper bygget.
6. En prisside kan ikke bli `GODKJENT` uten utfylt `priser`-blokk — prislisten
   på nettstedet er lovpålagt (prisopplysningsforskriften § 10).

## Brødtekst-konvensjoner

- `tittel` blir sidens H1 — brødteksten starter derfor på `##` (H2).
- Hopp aldri over overskriftsnivåer (H2 → H3, aldri H2 → H4).
- Første avsnitt er ingressen.
- Skriv aldri priser i løpende tekst — de hører i `priser`-blokken.
- Faktisk ventetid skrives aldri i teksten — den hentes datadrevet fra
  `src/_data/klinikk.json` når klinikken har fastsatt den.

## Bilder

```yaml
bilder:
  - fil: koloskopi-rom.avif    # filnavn i src/bilder/
    alt: ""                     # alt-tekst — obligatorisk, er innhold
    bildetekst: ""              # valgfri synlig bildetekst
    dekorativt: false           # true tillater tom alt-tekst
```

Alt-tekst er pasientrettet innhold og følger samme godkjenningsløp som resten
av siden.

## Priser (kun sidetype `pris`)

```yaml
priser:
  - navn: ""                    # navn på undersøkelsen/tjenesten
    belop_nok: 0                # kroner inkl. mva
    merknad: ""                 # valgfri, f.eks. hva som inngår
```

## Klinikkfakta

Alt faktisk om klinikken (org.nr, adresse, telefon, e-post, lege, faktisk
ventetid) bor i `src/_data/klinikk.json`. Ukjent = `null`, og bygget utelater
da feltet fra nettstedet og fra strukturerte data. Skriv aldri slike fakta i
innholdsfiler.
