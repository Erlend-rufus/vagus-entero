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
- En linje som slutter med `*` krever ordgrense foran, men tillater **fri
  endelse** bak — for egennavn som bøyes og settes sammen («Navnet»,
  «Navnets», «Navn-utstyr»). Brukes i preparat-, leverandør- og
  forsikringslistene, men ikke på korte navn som også er vanlige ordstammer.
- En linje som starter med `~` matcher som **delstreng** hvor som helst
  (brukes for domener og skriptnavn i den tekniske sporingslisten).
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
| `innholdskontrakt` | brudd på innholdskontrakten (se `docs/INNHOLDSKONTRAKT.md`), inkludert plassholdere i en GODKJENT side og prisrader uten beløp |
| `datafiler` | `src/_data/klinikk.json` og `ui.json` som bryter skjemaene sine, og reserverte felt som er fylt ut før visningen finnes |
| `priser-i-tekst` | beløp i løpende tekst — priser hører bare i prisrader |
| `ordliste-skann` | treff i forbudslistene — i kildefiler, bygde utdata og commit-meldinger |
| `sporing` | sporingssignaturer i kode eller utdata |
| `lagring` | forsøk på lagring i brukerutstyr (nettstedet skal ikke lagre noe som helst) |
| `norsk-i-maler` | litterær tekst i maler — alt synlig språk skal komme fra `ui.json` eller innholdsfiler |
| `ui-kryssjekk` | maloppslag uten nøkkel i `ui.json`, og døde nøkler |
| `eksterne-verter` | enhver referanse til andre domener i bygde utdata — i attributter, `srcset`, `<meta content>`, CSS, JavaScript, innebygde `<style>`/`<script>`-blokker og SVG-filer, også protokollrelative `//`-adresser (hvitelisten er tom) |
| `innebygd-kode` | `<script>` utenfor JSON-LD, `<style>`, `style=`, `on*`-attributter, `javascript:`, rammer, skjemaelementer, meta refresh og `ping` i bygd HTML — nettstedet har ingen innebygd kode |
| `jsonld` | forbudte eller ukjente typer i strukturerte data; null-verdier som skulle vært utelatt |
| `lenker` | interne lenker uten mål i bygget |
| `godkjent-status` | side uten GODKJENT i produksjonsbygg; alt som ikke er en innholdsside (komponentkatalogen, løse maler); produksjon uten forside |
| `klinikk-lansering` | tomme lovpålagte klinikkfelter i ekte produksjonsbygg (ehandelsloven § 9); `CI_SYNTETISK` i et Netlify-bygg |
| `tekst-kommer` | plassholderen `[TEKST KOMMER]` i et produksjonsbygg |
| `noindex` | manglende noindex utenfor produksjon (og manglende Basic-Auth-linje når passordvariablene var satt i bygget); gjenglemt noindex/Disallow/Basic-Auth i produksjon |
| `headere` | avvik mellom bygde `_headers` og `sikkerhet/policy.json` (CSP, faste headere, Cache-Control) |

Kjør alt lokalt: `npm run vakter` (kildefiler) eller `npm run bygg`
(bygg + utdatavakter). `npm test` kjører vaktenes **selvtester**: hver vakt
har minst én test som planter et brudd og krever at vakten fanger det, med
sjekk på hvilken melding som kom — en vakt som slutter å virke, feiler
dermed CI selv. Historikkskannet testes mot et midlertidig git-repo med
egen baseline, uavhengig av baselinen i hovedrepoet.

## Bevisste unntak fra skanning

- `vakter/ordlister/` — listene må nødvendigvis inneholde ordene de forbyr.
  Ingenting herfra havner i bygde utdata (utdata skannes separat).
- `vakter/tester/` — bruker kun syntetiske testord.
- `package-lock.json` og binærfiler (fonter, bilder) — delstrengtreff i
  base64-innhold gir bare støy.
- `src/komponentkatalog.njk` — internt utviklingsverktøy med ikke-språklig
  fylltekst; finnes aldri i produksjonsbygg (håndhevet av egen vakt).
- `.claude/worktrees/` — midlertidige arbeidskopier fra utviklingsverktøy,
  aldri en del av bygget.

## Omtale av leverandører i repoet

Leverandører av journalsystem og endoskopiutstyr omtales i kode, dokumenter
og commit-meldinger kun som kategori («journalleverandøren»), aldri ved navn.
Navnene står kun i ordlisten som forbyr dem.
