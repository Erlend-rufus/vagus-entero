# Innholdskontrakten — slik leveres tekst inn i nettstedet

Dette er formatet tekstproduksjonen leverer i. Én markdown-fil per side, i
`src/innhold/`. Bygget validerer hver fil mot kontrakten og **stopper med
forståelig feilmelding** hvis noe mangler — det finnes ingen standardverdier,
med vilje: en tom side er et bedre utfall enn en oppdiktet side.

## Frontmatter — alle felter

```yaml
---
sidetype:          # forside | undersokelse | tilstand | behandling | pris
                   #   | henviser | forsikring | statisk | bestilling
url:               # /koloskopi/ — små bokstaver, tall, bindestrek, skråstrek
                   #   først og sist. Unik for hele nettstedet.
malgruppe:         # selvbetalende | henviser | forsikring
tittel:            # Sidens H1, og <title> hvis sidetittel mangler. 10–60 tegn.
sidetittel:        # valgfri: <title> uten suffiks, f.eks. «Koloskopi på Straume».
                   #   Bygget legger til « | Vagus Entero». 10–70 tegn.
menytittel:        # valgfri: kort etikett i menyen (3–30 tegn)
meta_beskrivelse:  # 70–155 tegn.
status:            # UTKAST | KLAR_FOR_MEDISINSK_GJENNOMGANG | GODKJENT
godkjent_av:       # null til fagansvarlig lege har signert. Deretter navnet.
godkjent_dato:     # null, eller ÅÅÅÅ-MM-DD.
jsonld_type:       # MedicalProcedure | MedicalCondition | MedicalSignOrSymptom
                   #   | MedicalClinic | Physician | null
noindex:           # valgfri: true holder siden ute av søk og sitemap, også i
                   #   produksjon (sider skrevet for en håndfull mottakere)
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
hode_merknad:      # valgfri: merknadslinje under knappene (10–300 tegn),
                   #   f.eks. «Sist oppdatert …» på personvernsiden
fakta:             # valgfri: 2–4 nøkkelfakta som stripe under sidehodet
seksjoner:         # valgfri: sidens innholdsblokker, se «Seksjonsblokker»
bilder:            # RESERVERT — må være tom til visningen er bygget, se under
---
```

Brødsmulestien viser `tittel` uten den medisinske termen i parentes:
«Kikkertundersøkelse av tykktarmen (koloskopi)» → «Kikkertundersøkelse av
tykktarmen». Menyen bruker `menytittel`.

Etter frontmatter kommer brødteksten i vanlig markdown.

## Plassholderen `[TEKST KOMMER]`

Der teksten ennå ikke er levert, skrives nøyaktig `[TEKST KOMMER]` — i
hvilket som helst tekstfelt, uansett lengdekrav. Den er laget for å være
umulig å forveksle med godkjent innhold: bygget godtar den i forhåndsvisning,
en side med den kan aldri bli `GODKJENT`, og et produksjonsbygg som
inneholder den stopper (vakten `tekst-kommer`). Skriv aldri egne
plassholdere som ligner på ekte tekst.

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
6. En prisside kan ikke bli `GODKJENT` uten en `prisliste`-seksjon — prislisten
   på nettstedet er lovpålagt (prisopplysningsforskriften § 10). Ingen
   GODKJENT side kan ha prisrader med `belop_nok: null`.
7. Beløp i løpende tekst stopper bygget (vakten `priser-i-tekst`) — priser
   står bare i `belop_nok`-felter.
8. Bestillingsruten `/bestill/` (sidetype `bestilling`) har egen mal og er
   den eneste siden integrasjonspartneren rører. Innholdssidene er statiske.
9. En `GODKJENT` side kan ikke inneholde noen plassholder: alt i hakeparentes
   — `[TEKST KOMMER]`, `[PLASSHOLDER: …]`, `[PREPARAT]`, `[KLOKKESLETT]` —
   regnes som plassholder, i frontmatter og brødtekst. Lenkesyntaksen
   `[tekst](/sti/)` er unntaket. En godkjent side kan heller ikke lenke til
   en side som ikke er godkjent — målet må godkjennes først.
10. `rekkefolge` må være entydig blant sidene i menyen, og blant sidene i
    bunnteksten.
11. Frontmatter er YAML, aldri kode: filen må starte med en ren `---`-linje.
    Brødteksten er markdown uten rå HTML — `<`-tegn vises som tekst — og
    markdown-lenker i brødteksten kan bare peke på egne sider (`/sti/`);
    eksterne adresser, `mailto:` og `tel:` vises som tekst.
12. Innholdsfiler finnes bare som `src/innhold/<navn>.md`. En fil med
    `sidetype` et annet sted stopper bygget.

## Tekstpakken fra innholdsprosessen

Tekstpakken leveres som denne frontmatteren — feltene er de samme, så det
er ingen oversettelse:

| Tekstpakken sier | Frontmatter-felt |
|---|---|
| Sidetype · URL-sti · Målgruppe | `sidetype`, `url`, `malgruppe` |
| Sidetittel (title-tag) · Meta-beskrivelse | `sidetittel`, `meta_beskrivelse` |
| H1 | `tittel` |
| Ingress | `ingress` |
| Overskriftshierarki H2–H3 og brødtekst seksjon for seksjon | `seksjoner` (hver blokk = én H2; `steg`, `veier`, `praktisk` gir H3) |
| Interne lenker ut | `interne_lenker_ut` + `url` i knapper og kort + lenker i teksten, se «Lenker og linjeskift i tekst» |
| JSON-LD: type og feltverdier | `jsonld_type` (feltverdiene hentes fra `klinikk.json` og sidens `tittel`/`meta_beskrivelse`) |
| Bilde- og alt-tekstbehov | `bilder` med `alt`, eller `illustrasjon` |
| Status | `status`, `godkjent_av`, `godkjent_dato` |
| Åpne punkter / [BEKREFT] | `apne_punkter` |

Filen legges i `src/innhold/<url-navn>.md`. `[MEDISINSK GJENNOMGANG KREVES]`
skrives som et punkt i `apne_punkter`, ikke i brødteksten.

## Brødtekst-konvensjoner

- `tittel` blir sidens H1 — brødteksten starter derfor på `##` (H2).
- Hopp aldri over overskriftsnivåer (H2 → H3, aldri H2 → H4).
- Første avsnitt er ingressen.
- Skriv aldri priser i løpende tekst — de hører i `prisliste`- og
  `pris`-seksjonenes `priser`-rader.
- Faktisk ventetid skrives aldri i teksten. Feltet `ventetid` i
  `src/_data/klinikk.json` er reservert til visningen er bygget.

## Lenker og linjeskift i tekst

I alle prosafelt (`avsnitt`, `tekst`, `svar`, `merknad`, `under`, `liten`,
`ingress`, `etter`) kan du skrive:

- en intern lenke som `[praktiske opplysninger](/for-henvisende-leger/)` —
  målet må være en side som finnes, ellers stopper bygget. Eksterne
  adresser blir ikke lenker (nettstedet peker aldri ut av seg selv fra
  teksten);
- et linjeskift som `\n` i en dobbeltsitert streng (`"Gate 1\n5353 Straume"`)
  — brukes til adresser.

All annen HTML vises som tekst, aldri som markup.

## Bilder (reservert)

Feltet `bilder` er avtalt i kontrakten, men ingen mal viser bilder ennå.
Listen **må være tom** til visningen er bygget — ellers stopper bygget, slik
at et bilde aldri forsvinner stille. Når visningen kommer, er formatet
`{ fil, alt, bildetekst?, dekorativt? }`, og alt-tekst er pasientrettet
innhold som følger samme godkjenningsløp som resten av siden.

## Prisliste

Prislisten er en seksjon av type `prisliste` (på `/priser/` er den
obligatorisk for godkjenning):

```yaml
  - type: prisliste
    tittel: Prisliste
    under: ""                     # valgfri ingress under overskriften
    tabellmerknad: ""             # valgfri tabelltekst, vises når beløp finnes
    kolonner:                     # kolonnehodene
      tjeneste: Undersøkelse eller behandling
      omfang: Inkludert
      pris: Pris
    priser:
      - navn: ""                  # navn på undersøkelsen/tjenesten
        omfang: ""                # valgfri: hva som inngår
        belop_nok: 4500           # hele kroner inkl. mva (over 0), eller null
    merknad: ""                   # valgfri dempet merknad under tabellen
```

Rader med `belop_nok: null`: finnes det ingen beløp i tabellen, vises alle
radene uten priskolonne og uten tabellmerknad; finnes det beløp, utelates
radene uten. `omfang` vises bare når `kolonner` finnes. En GODKJENT side kan
ikke ha rader uten beløp.

## Seksjonsblokker

Sidens brødtekst bygges av typede blokker i `seksjoner`. Hver blokk har en
`type`, en `tittel`, valgfri `under` (ingress for seksjonen) og valgfri
`flate: sand` som gir seksjonen sandfarget bakgrunn. Rytmen i designet er
krem → sand → krem.

| type | krever | brukes til |
|---|---|---|
| `tekst` | `avsnitt` (1–8) | vanlig brødtekst, valgfri `merknad` til slutt |
| `tidslinje` | `punkter` med `naar` og `tekst` | forberedelser dag for dag; `eksempelmerknad` gir den terrakotta-rammede advarselen; valgfritt avsluttende avsnitt `etter` |
| `steg` | `steg` (2–4) med `tittel` og `tekst` | «Slik foregår det»; `strek: true` tegner bølgelinjen over |
| `sporsmal` | `sporsmal` (2–14) med `sporsmal` og `svar` | spørsmål og svar, utvides uten JavaScript |
| `veier` | `veier` (2–4) med `tittel` og `avsnitt` | likestilte valg som kort, med valgfri `illustrasjon`, `liten` og `knapp` |
| `praktisk` | `punkter` (2–6) med `tittel` og `tekst` | korte praktiske opplysninger i kolonner, valgfri `merknad` under |
| `kort` | `kort` (2–6) med `tittel` | rutenett av lenkekort med `fagterm`, `illustrasjon` og `url` |
| `kort_bred` | `avsnitt` | én tjeneste på tvers, med `illustrasjon` og `knapp`. Har blokken `under`, står overskriften over kortet; ellers inne i kortet (forsidens mønster) |
| `pris` | `avsnitt` | den dype petrol-blokken, med `knapper` og enten `sidekolonne` (`etikett` + `avsnitt`, f.eks. «Merk», «Praktisk») eller `priser` som liten tabell — aldri begge |
| `prisliste` | `priser` | full prisliste, se «Prisliste» over |

Strektegningene som kan brukes i `illustrasjon`: `gastroskopi`, `koloskopi`,
`endetarm`, `proktologi`, `overvekt` og `fordoyelse-hero`.

## Knapper

En knapp skrives som `{ tekst, handling }` og rendres **bare når fakta
finnes** — mangler de, forsvinner knappen i stillhet:

- `handling: bestilling` krever `bestilling.url` i `klinikk.json`
- `handling: telefon` krever `telefon` i `klinikk.json`
- `handling: intern` krever `url`, og siden må finnes i bygget

`stil` kan være `primaer` (standard), `sekundaer` eller `invers` (hvit på
mørk flate). I prisblokken blir primærknappen automatisk invers. «Bestill
time» og «Ring oss» får stil etter klinikkens tilstand (se `docs/HANDOFF.md`),
ikke etter innholdsfilen.

## Priser som ikke er fastsatt

`belop_nok: null` betyr «ikke fastsatt ennå». Linjen utelates da fra
nettstedet — det står aldri et gjettet eller oppdiktet beløp. En prisside kan
ikke bli `GODKJENT` så lenge én linje mangler beløp: prislisten er lovpålagt
(prisopplysningsforskriften § 10).

## Klinikkfakta

Alt faktisk om klinikken (org.nr, adresse, telefon, e-post, lege, tilsyn,
bestillingsportal) bor i `src/_data/klinikk.json`, validert mot
`skjema/klinikk.schema.json` i hvert bygg. Ukjent = `null`, og bygget
utelater da feltet fra nettstedet og fra strukturerte data. Skriv aldri slike
fakta i innholdsfiler. `apningstider` og `ventetid` er reservert: de må stå
som `null` til en visning er bygget.
