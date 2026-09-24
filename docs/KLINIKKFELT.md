# Klinikkfelt som venter på klinikken

**Opprettet:** 24.09.2026 (arbeidsordre «leveringsklart forhåndsbygg»)

Alle feltene under står som `null` i `src/_data/klinikk.json`. Så lenge et
felt er `null`, utelates elementene som krever det (se «Utelatelse» i
`docs/INNHOLDSKONTRAKT.md`). Forhåndsvisningen viser «Venter på opplysning fra
klinikken: …» der elementet ville stått. Produksjon viser ingenting.

Feltene er definert og validert i `skjema/klinikk.schema.json`. Navnet som
vises i markøren er feltets `title` der. Beskrivelsen der sier om verdien er
en **kort verdi** som settes inn i en setning eller faktaliste, eller en
**hel setning** skrevet av klinikken.

Fyll inn et felt → neste bygg viser elementet. Ingen innholdsfil trenger å
endres. Teksten rundt feltet er foreløpig: når svaret foreligger, kan
innholdsprosessen skrive endelig ordlyd.

Fordelingen på hvem som svarer er et forslag: Malin svarer på fakta, og
Kristian på drift og medisin.

## Feltene

| Felt | Hva | Form | Svarer | Sider |
|---|---|---|---|---|
| `telefon` | telefonnummer | kort | Malin | `/kontakt/`, `/personvern/`, i tillegg «Ring oss»-knapper og bunntekst på alle sider |
| `epost` | e-postadresse | kort | Malin | `/personvern/`, i tillegg bunnteksten på alle sider |
| `apningstider` | åpningstider for telefonen | kort | Malin | `/kontakt/` |
| `betaling.betalingsmater` | betalingsmåter | hel setning | Malin | `/priser/` |
| `betaling.avbestilling` | avbestillingsfrist og gebyr ved ikke møtt | hel setning | Malin | `/priser/` |
| `betaling.kvittering` | kvittering til forsikring og skattefradrag | hel setning | Malin | `/priser/` |
| `adkomst.parkering` | parkering | hel setning | Malin | `/kontakt/`, `/for-forsikringsselskaper/` |
| `adkomst.kollektiv` | buss og holdeplass | hel setning | Malin | `/kontakt/`, `/for-forsikringsselskaper/` |
| `adkomst.tilgjengelighet` | trinnfritt, heis, HC-parkering, teleslynge | hel setning | Malin | `/kontakt/`, `/for-forsikringsselskaper/` |
| `adkomst.reisetid_bergen` | reisetid fra Bergen sentrum, f.eks. «25 min» | kort (maks 40 tegn) | Malin | `/for-forsikringsselskaper/` |
| `avtale.kontakt.navn` / `.rolle` / `.epost` / `.telefon` | kontaktperson for forsikringsavtaler | kort | Malin | `/for-forsikringsselskaper/` |
| `avtale.fakturering` | fakturaformat, betingelser, referanse, EHF | hel setning | Malin | `/for-forsikringsselskaper/` |
| `personvern.databehandlere` | øvrige databehandlere (laboratorium, regnskap) | hel setning | Malin | `/personvern/` |
| `henvisning.kanal` | henvisningskanal | kort (maks 40 tegn) | Kristian | `/for-henvisende-leger/` |
| `henvisning.epikrise_svartid` | svartid på epikrise | kort (maks 40 tegn) | Kristian | `/for-henvisende-leger/` |
| `henvisning.lege_til_lege` | eget lege-til-lege-nummer, **valgfritt** | kort | Kristian | `/for-henvisende-leger/` |
| `henvisning.ovrige_avgrensninger` | øvrige avgrensninger for henvisninger (medisinsk) | hel setning | Kristian | `/for-henvisende-leger/` |
| `laboratorium.navn` | laboratorium for vevsprøver | kort | Kristian | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| `laboratorium.svartid` | svartid på vevsprøver | kort | Kristian | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| `kvalitet.kvalitetsregistre` | kvalitetsregistre klinikken rapporterer til | hel setning | Kristian | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| `kvalitet.avvikssystem` | avvikssystem og melderutiner | hel setning | Kristian | `/for-forsikringsselskaper/` |
| `kvalitet.internkontroll_dokumentasjon` | dokumentasjon av internkontroll som kan framlegges | hel setning | Kristian | `/for-forsikringsselskaper/` |
| `utstyr` | endoskopisk utstyr og desinfeksjonsrutiner | hel setning | Kristian | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| `kapasitet.rom` / `.dager_per_uke` / `.undersokelser_per_uke` | kapasitet, oppgis når driften er i gang | kort, hver på egen linje | Kristian | `/for-forsikringsselskaper/` |
| `avtale.avtaleform` | avtaleform | kort (maks 40 tegn) | Kristian | `/for-forsikringsselskaper/` |
| `avtale.svartid` | tid fra bestilling til time, og fra undersøkelse til epikrise | hel setning | Kristian | `/for-forsikringsselskaper/` |
| `avtale.rapportering` | format og kanal for rapportering | hel setning | Kristian | `/for-forsikringsselskaper/` |
| `avtale.avbestilling` | avbestillingsvilkår i avtalen | hel setning | Kristian | `/for-forsikringsselskaper/` |
| `avtale.journalintegrasjon` | integrasjon mot selskapets systemer | hel setning | Kristian | `/for-forsikringsselskaper/` |
| `personvern.kontaktperson` | personvernombud eller kontaktperson for personvern | hel setning | Kristian | `/personvern/` |
| `personvern.lagringstider` | øvrige lagringstider | hel setning | Kristian | `/personvern/` |

## Utover listen i arbeidsordren

Arbeidsordren listet feltene fra `apningstider` til lege-til-lege-nummeret.
Noen plassholdere på de samme sidene hadde ikke et felt i listen. Hadde de
blitt stående, ville de vært synlige. Disse feltene er derfor lagt til, også
som `null`:

- `adkomst.reisetid_bergen`
- `henvisning.ovrige_avgrensninger`
- `kvalitet.internkontroll_dokumentasjon`
- `utstyr`
- `avtale.avtaleform`, `avtale.svartid`, `avtale.rapportering`,
  `avtale.fakturering`, `avtale.avbestilling` og `avtale.journalintegrasjon`
- `personvern.*`, for de gjenværende plassholderne i personvernerklæringen
  (del 2c i ordren)

## Plassholdere som ble fjernet uten nytt felt

To plassholdere dekket noe som allerede står i faktalisten øverst på samme
side. De er fjernet, uten nytt felt:

- «[PLASSHOLDER: kanal og svartid.]» i «Epikrise» på henvisersiden.
  Faktalisten viser henvisningskanal og svartid på epikrise.
- «[PLASSHOLDER: reisetid fra Bergen sentrum.]» i «Geografisk dekning» på
  forsikringssiden. Faktalisten viser reisetiden.

«Øvrige leger og sykepleiere når de er ansatt» er fjernet fra begge
fagsidene. Klinikken har ingen andre ansatte behandlere. Dette står nå som et
åpent punkt: nye behandlere føres opp når de er ansatt.
