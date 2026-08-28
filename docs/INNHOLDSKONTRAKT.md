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
tittel:            # Blir <title> og sidens H1. 10–60 tegn.
menytittel:        # valgfri: kort etikett i meny og brødsmulesti (3–30 tegn)
meta_beskrivelse:  # 70–155 tegn.
status:            # UTKAST | KLAR_FOR_MEDISINSK_GJENNOMGANG | GODKJENT
godkjent_av:       # null til fagansvarlig lege har signert. Deretter navnet.
godkjent_dato:     # null, eller ÅÅÅÅ-MM-DD.
jsonld_type:       # MedicalProcedure | MedicalClinic | Physician | null
interne_lenker_ut: # liste over url-er siden lenker til, f.eks. [/koloskopi/]
apne_punkter:      # liste med uavklarte [BEKREFT]-punkter. MÅ være tom
                   #   før status kan bli GODKJENT.
i_navigasjon:      # true = i hovedmenyen
i_bunntekst:       # true = i bunntekstens lenkeliste
rekkefolge:        # heltall — plassering i menyen (lavest først)
sist_oppdatert:    # valgfri: ÅÅÅÅ-MM-DD, datostempling av medisinsk innhold
ingress:           # valgfri: 30–300 tegn, vises under H1
overordnet:        # valgfri: url til siden over i brødsmulestien
illustrasjon:      # valgfri: strektegning i sidehodet, se listen under
hode_knapper:      # valgfri: 1–2 knapper i sidehodet, se «Knapper»
fakta:             # valgfri: 2–4 nøkkelfakta som stripe under sidehodet
seksjoner:         # valgfri: sidens innholdsblokker, se «Seksjonsblokker»
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

## Seksjonsblokker

Sidens brødtekst bygges av typede blokker i `seksjoner`. Hver blokk har en
`type`, en `tittel`, valgfri `under` (ingress for seksjonen) og valgfri
`flate: sand` som gir seksjonen sandfarget bakgrunn. Rytmen i designet er
krem → sand → krem.

| type | krever | brukes til |
|---|---|---|
| `tekst` | `avsnitt` (1–8) | vanlig brødtekst, valgfri `merknad` til slutt |
| `tidslinje` | `punkter` med `naar` og `tekst` | forberedelser dag for dag; `eksempelmerknad` gir den terrakotta-rammede advarselen |
| `steg` | `steg` (2–4) med `tittel` og `tekst` | «Slik foregår det»; `strek: true` tegner bølgelinjen over |
| `sporsmal` | `sporsmal` (2–14) med `sporsmal` og `svar` | spørsmål og svar, utvides uten JavaScript |
| `veier` | `veier` (2–4) med `tittel` og `avsnitt` | likestilte valg som kort, med valgfri `illustrasjon`, `liten` og `knapp` |
| `praktisk` | `punkter` (2–6) med `tittel` og `tekst` | korte praktiske opplysninger i kolonner |
| `kort` | `kort` (2–6) med `tittel` | rutenett av lenkekort med `fagterm`, `illustrasjon` og `url` |
| `kort_bred` | `avsnitt` | én tjeneste på tvers, med `illustrasjon` og `knapp` |
| `pris` | `avsnitt` | den dype prisblokken, med `knapper` og `priser` |
| `prisliste` | `priser` | full prisliste med `navn`, `merknad` og `belop_nok` |

Strektegningene som kan brukes i `illustrasjon`: `gastroskopi`, `koloskopi`,
`endetarm`, `proktologi`, `overvekt` og `fordoyelse-hero`.

## Knapper

En knapp skrives som `{ tekst, handling }` og rendres **bare når fakta
finnes** — mangler de, forsvinner knappen i stillhet:

- `handling: bestilling` krever `bestilling.url` i `klinikk.json`
- `handling: telefon` krever `telefon` i `klinikk.json`
- `handling: intern` krever `url`, og siden må finnes i bygget

`stil` kan være `primaer` (standard), `sekundaer` eller `invers` (på mørk
flate).

## Priser som ikke er fastsatt

`belop_nok: null` betyr «ikke fastsatt ennå». Linjen utelates da fra
nettstedet — det står aldri et gjettet eller oppdiktet beløp. En prisside kan
ikke bli `GODKJENT` så lenge én linje mangler beløp: prislisten er lovpålagt
(prisopplysningsforskriften § 10).

## Klinikkfakta

Alt faktisk om klinikken (org.nr, adresse, telefon, e-post, lege, faktisk
ventetid) bor i `src/_data/klinikk.json`. Ukjent = `null`, og bygget utelater
da feltet fra nettstedet og fra strukturerte data. Skriv aldri slike fakta i
innholdsfiler.
