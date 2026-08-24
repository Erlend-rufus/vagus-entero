# Vaktene — forbudslisten som kode

CI-en og bygget kjører et sett vakter som **feiler** (aldri bare advarer) når
noe bryter reglene fra prosjektbriefen. Denne siden forklarer hvordan du
utvider dem uten å forstå byggkjeden.

## Utvide en forbudsliste (for Erlend)

Listene er rene tekstfiler i `vakter/ordlister/` — én oppføring per linje,
linjer som starter med `#` er kommentarer:

| Fil | Fanger |
|---|---|
| `preparatnavn.txt` | varemerkenavn på legemidler (virkestoffnavn er tillatt og skal IKKE hit) |
| `ventetidsfraser.txt` | villedende formuleringer om ventetid |
| `superlativer.txt` | superlativ- og rangeringspåstander |
| `leverandorer.txt` | navn på journal- og utstyrsleverandører |
| `forsikringsselskaper.txt` | navn på forsikringsselskaper |
| `vurderingssignaler.txt` | signaler på pasientomtaler og stjerner |
| `sporingssignaturer.txt` | tredjeparts sporingsskript (teknisk liste) |
| `eksterne-hvitliste.txt` | tillatte eksterne verter — TOM med vilje |

Slik gjør du det i GitHub:

1. Åpne filen i `vakter/ordlister/`, trykk på blyanten (Edit).
2. Legg til ordet eller frasen på egen linje. Store/små bokstaver spiller
   ingen rolle.
3. **Viktig:** skriv ALDRI selve ordet i commit-meldingen. Skriv f.eks.
   «utvid preparatnavn-listen». Commit-meldinger skannes også, og et treff der
   kan bare fjernes ved å skrive om historikken.
4. Lagre (Commit changes). CI kjører automatisk og feiler alle steder ordet
   nå finnes.

### Slik matcher listene

- Standard er **hele ord**: en oppføring treffer aldri inne i et lengre ord,
  så korte oppføringer er trygge å legge inn.
- En linje som starter med `~` matcher som **delstreng** (brukes for domener
  og skriptnavn i den tekniske sporingslisten).
- Flerords-fraser matcher på tvers av variabel mellomrom.

### Falske positive

Treffer en oppføring en legitim formulering, IKKE fjern oppføringen. Opprett
i stedet filen `vakter/ordlister/unntak/<samme-filnavn>.txt` og legg inn hele
den legitime frasen der — da nulles bare det treffet, og regelen står.

### Nytt ord treffer gammel historikk

Skanning av commit-meldinger bruker en baseline: legger du inn et nytt ord og
CI feiler på en gammel, uskyldig commit-melding, gjennomgår dere treffet
manuelt og setter dagens commit-SHA i
`vakter/ordlister/historikk-baseline.txt`. Da skannes bare meldinger etter
det punktet. Nye synder fanges alltid.

## Vaktene som kjører

| Vakt | Feiler på |
|---|---|
| `innholdskontrakt` | brudd på innholdskontrakten (se `docs/INNHOLDSKONTRAKT.md`) |
| `ordliste-skann` | treff i forbudslistene — i kildefiler, bygde utdata og commit-meldinger |
| `sporing` | sporingssignaturer i kode eller utdata |
| `lagring` | forsøk på lagring i brukerutstyr (nettstedet skal ikke lagre noe som helst) |
| `norsk-i-maler` | litterær tekst i maler — alt synlig språk skal komme fra `ui.json` eller innholdsfiler |
| `ui-kryssjekk` | maloppslag uten nøkkel i `ui.json`, og døde nøkler |
| `eksterne-verter` | enhver referanse til andre domener i bygde utdata (hvitelisten er tom) |
| `jsonld` | forbudte eller ukjente typer i strukturerte data; null-verdier som skulle vært utelatt |
| `lenker` | interne lenker uten mål i bygget |
| `godkjent-status` | side uten GODKJENT i produksjonsbygg; komponentkatalogen i produksjon |
| `klinikk-lansering` | tomme lovpålagte klinikkfelter i ekte produksjonsbygg (ehandelsloven § 9) |
| `noindex` | manglende noindex/Basic-Auth utenfor produksjon; gjenglemt noindex/Basic-Auth i produksjon |
| `headere` | avvik mellom bygde `_headers` og `sikkerhet/policy.json` |

Kjør alt lokalt: `npm run vakter` (kildefiler) eller `npm run bygg`
(bygg + utdatavakter). `npm test` kjører vaktenes **selvtester**: hver test
planter et brudd og krever at vakten fanger det — en vakt som slutter å
virke, feiler dermed CI selv.

## Bevisste unntak fra skanning

- `vakter/ordlister/` — listene må nødvendigvis inneholde ordene de forbyr.
  Ingenting herfra havner i bygde utdata (utdata skannes separat).
- `vakter/tester/` — bruker kun syntetiske testord.
- `package-lock.json` og binærfiler (fonter, bilder) — delstrengtreff i
  base64-innhold gir bare støy.
- `src/komponentkatalog.njk` — internt utviklingsverktøy med ikke-språklig
  fylltekst; finnes aldri i produksjonsbygg (håndhevet av egen vakt).

## Omtale av leverandører i repoet

Leverandører av journalsystem og endoskopiutstyr omtales i kode, dokumenter
og commit-meldinger kun som kategori («journalleverandøren»), aldri ved navn.
Navnene står kun i ordlisten som forbyr dem.
