# Leveringssjekk: forhåndsbygget til gjennomlesning

**Dato:** 08.10.2026
**Arbeidsordre:** «innlemming av svar fra klinikken» (første levering til gjennomgang)
**Grunnlag:** `npm run bygg` uten `PRODUKSJON`. Alle tall er telt i den **rendrede HTML-en i `dist/`**, i synlig tekst med tagger, `<script>` og `<style>` fjernet, ikke i kildefilene.

**Akseptkriteriet er oppfylt:** 0 synlige plassholdere i forhåndsbygget. Tellingen dekker `[PLASSHOLDER`, `[TEKST KOMMER`, `[BEKREFT` og sifferplassholdere som `[00 00 00 00]`, og gir 0 på alle 23 bygde sider. 0 døde interne lenker. Alle markører er listet under.

Kolonnene:

- **Plassholdere:** synlige plassholdere av typene over.
- **Markører:** linjer med «Venter på opplysning fra klinikken: …». Antall, og feltene hver markør venter på, skilt med semikolon.
- **Døde lenker:** interne `href` uten mål i `dist/`.
- **Tittel / beskrivelse:** om `<title>` og `<meta name="description">` finnes, med lengde i tegn. Tittelen er målt med suffikset «| Vagus Entero».

| Side og URL | Status | Plassholdere | Markører «Venter på klinikken» | Døde lenker | Tittel / beskrivelse | Merknad |
|---|---|---|---|---|---|---|
| Klinikk for mage, tarm og endetarm — `/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (60 / 125) | Prisblokken venter på beløp. |
| Undersøkelser og behandling — `/undersokelser/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (42 / 142) | Varigheten for anoskopi og rektoskopi er satt til ca. 10 minutter (Kristian 25.9). Prisblokken venter på beløp. |
| Kikkertundersøkelse av spiserør og magesekk (gastroskopi) — `/gastroskopi/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (55 / 140) | Timen er satt av 30 minutter (Malin). Åpent punkt om at Kristian ikke har lest det ennå, og om gravide og ammende. |
| Kikkertundersøkelse av tykktarmen (koloskopi) — `/koloskopi/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (53 / 152) | Timen er satt av 60 minutter (Malin). Åpne punkter som over. |
| Undersøkelse av endetarmen (anoskopi og rektoskopi) — `/undersokelse-av-endetarmen/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (66 / 152) | Rettet etter Kristian 25.9 (ca. 10 minutter, ca. 5 cm, beinholdere, timen satt av 30 minutter). Tittelen er over 60 tegn. |
| Behandling av endetarmsplager (proktologi) — `/proktologi/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (67 / 145) | Rettet etter Kristian 25.9. FAQ «Kommer hemoroidene tilbake?» er fjernet. Tittelen er over 60 tegn. |
| Sprekk i endetarmsåpningen (analfissur) — `/analfissur/` | UTKAST | 0 | 0 | 0 | ja / ja (59 / 155) | Rettet etter Kristian 25.9. Åpent punkt om spørsmål 57. |
| Blod i avføringen: hva det kan være og hva du bør gjøre — `/blod-i-avforingen/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (75 / 143) | Rettet etter Kristian 25.9. 40-årsgrensen står med åpent punkt. Tittelen er over 60 tegn. |
| Hemoroider: plager, undersøkelse og behandling — `/hemoroider/` | UTKAST | 0 | 0 | 0 | ja / ja (70 / 155) | Rettet etter Kristian 25.9. Tittelen er over 60 tegn. |
| Irritabel tarm (IBS): plager, utredning og råd — `/irritabel-tarm/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (75 / 153) | Tittelen er over 60 tegn. |
| Vondt i magen som ikke går over (magesmerter) — `/magesmerter/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (66 / 154) | Tittelen er over 60 tegn. |
| Halsbrann og sure oppstøt (refluks) — `/refluks/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (75 / 154) | Åpent punkt om gravide og ammende. Tittelen er over 60 tegn. |
| Priser og betaling — `/priser/` | UTKAST | 0 | 4: priser og hva som er inkludert; betalingsmåter; avbestillingsfrist og gebyr ved ikke møtt; kvittering til forsikring og skattefradrag | 0 | ja / ja (33 / 110) | Prislisten viser bare tjenestenavnene, med én samlet markør. «Vi følger Volvat» er ikke tatt inn. |
| Slik foregår det — `/slik-foregar-det/` | UTKAST | 0 | 0 | 0 | ja / ja (31 / 74) | Ingen endring. |
| Kontakt og bestill time — `/kontakt/` | UTKAST | 0 | 4: åpningstider; parkering, buss og holdeplass; tilgjengelighet (trinnfritt, heis, HC-parkering, teleslynge); priser og hva som er inkludert | 0 | ja / ja (49 / 94) | Telefonnummeret står nå på siden. Åpningstider og adkomst venter (lokalene er ikke avgjort). |
| Bestill time — `/bestill/` | UTKAST | 0 | 0 | 0 | ja / ja (27 / 73) | Portalen er ikke montert. Varselet ber besøkende ringe, og nummeret finnes nå. |
| Om klinikken og legen — `/om-klinikken/` | UTKAST | 0 | 3: dokumentert avklaring av bistilling; dokumentert avklaring av bistilling; dokumentert avklaring av bistilling | 0 | ja / ja (71 / 144) | All omtale av Haraldsplass er utelatt (tre markører, hvor like markører rett etter hverandre er slått sammen). Tittelen er over 60 tegn. |
| For henvisende leger — `/for-henvisende-leger/` | UTKAST | 0 | 7: henvisningskanal; henvisningskanal; øvrige avgrensninger for henvisninger; endoskopisk utstyr og desinfeksjonsrutiner; kvalitetsregistre; laboratorium for vevsprøver, svartid på vevsprøver; priser og hva som er inkludert | 0 | ja / ja (35 / 115) | Epikrise «Samme dag» vises. Eget lege-til-lege-nummer finnes ikke, og linjen er fjernet. «Ring lege-til-lege» bruker hovednummeret. |
| For forsikringsselskaper — `/for-forsikringsselskaper/` | UTKAST | 0 | 11: reisetid fra Bergen sentrum; avtaleform; priser og hva som er inkludert; antall undersøkelsesrom, dager per uke, undersøkelser per uke, svartid fra bestilling til time og til epikrise, format og kanal for rapportering, fakturering (format, betingelser, referanse, EHF), avbestillingsvilkår i avtalen, integrasjon mot selskapets systemer; endoskopisk utstyr og desinfeksjonsrutiner; laboratorium for vevsprøver, svartid på vevsprøver; kvalitetsregistre; dokumentasjon av internkontroll; avvikssystem og melderutiner; parkering, buss og holdeplass, tilgjengelighet (trinnfritt, heis, HC-parkering, teleslynge); e-post til avtaleansvarlig | 0 | ja / ja (39 / 138) | Kontaktperson (navn, rolle, telefon) vises, e-post venter. Hele «Kapasitet, svartid og rapportering» er utelatt som én samlet markør. |
| Personvern — `/personvern/` | UTKAST | 0 | 5: e-postadresse; personvernombud eller kontaktperson for personvern; øvrige databehandlere; øvrige lagringstider; e-postadresse | 0 | ja / ja (25 / 112) | Kontaktlinjene venter på e-post. Se «Til juridisk gjennomgang» i forrige rapport. |
| Medisinsk utredning og behandling av overvekt og fedme — `/overvekt-og-fedme/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (75 / 146) | Parkert 11.09.2026, med `noindex`. Ikke rørt. Bygges i forhåndsvisningen, men ingen side lenker hit. |
| Siden finnes ikke — `/ikke-funnet/` | UTKAST | 0 | 0 | 0 | ja / ja (32 / 83) | 404-siden, ikke en innholdsside. `noindex`. |
| Komponentkatalog — `/komponentkatalog/` | ikke innholdsside | 0 | 0 | 0 | ja / ja (31 / 71) | Internt utviklingsverktøy som aldri bygges i produksjon. |

Kortversjon: 0 plassholdere, 0 døde interne lenker, tittel og beskrivelse på alle sider. Det er 41 markører på 13 sider (forrige levering: 40 på 12).

## Hva som er nytt siden forrige levering

- **Satt:** telefon (920 33 690), kontaktperson for forsikring (navn, rolle, telefon), epikrise samme dag, og timelengder (avsatt tid: koloskopi 60, gastroskopi 30, konsultasjon 20, rektoskopi 30, anoskopi 30 minutter). Timelengden er brukt på koloskopi-, gastroskopi- og endetarmssiden. Konsultasjon (20 minutter) står bare i `klinikk.json`, siden ingen tekst oppgir lengden på en konsultasjon.
- **Fjernet:** eget lege-til-lege-nummer (finnes ikke).
- **Tekst rettet** etter Kristians svar 25.9 på endetarmsundersøkelse, strikkbehandling, analfissur, hemoroider, gravide og ammende, og rektalblødning. Ingen status er endret, og hver berørt side har åpent punkt om at Kristian ikke har lest den ennå.
- **Haraldsplass** er lagt bak `lege.bistilling_dokumentert` (`null`): ingen omtale i bygget.
- **Holdt på grunn av lokalene:** adresse, parkering, buss, tilgjengelighet, reisetid og åpningstider (se `docs/STEDSAVHENGIGHET.md`).

## 1. Manglende klinikkfakta, samlet

Feltene står i `src/_data/klinikk.json` som `null`, og er beskrevet i `docs/KLINIKKFELT.md`. «Hold» betyr at opplysningen er oppgitt for dagens lokaler og ikke skal brukes før lokalene er avgjort (12.–13. oktober).

### Malin (fakta)

| Opplysning | Felt | Sider | Merknad |
|---|---|---|---|
| E-postadresse | `epost` | `/personvern/` (to steder), bunntekst på alle sider | Lanseringskritisk. Malin vet ikke hvilken adresse som er opprettet. `post@enteroklinikken.no` er ikke bekreftet |
| Åpningstider | `apningstider` | `/kontakt/` | «9–15.30» er oppgitt uten ukedager. Hold (lokalene) |
| E-post til avtaleansvarlig | `avtale.kontakt.epost` | `/for-forsikringsselskaper/` | Ikke besvart |
| Mva-status | `mva_status` | Bunntekst på alle sider | Ikke besvart |
| Priser (totalpriser inkl. mva) og hva som er inkludert | `belop_nok` og `omfang` i innholdsfilene | `/priser/`, `/for-forsikringsselskaper/`, prisblokkene på `/`, `/undersokelser/`, `/gastroskopi/`, `/koloskopi/`, `/undersokelse-av-endetarmen/`, `/proktologi/`, `/kontakt/`, `/for-henvisende-leger/` | «Vi følger Volvat sine priser» er ikke en prisliste, og Volvats tall er ikke kopiert |
| Betalingsmåter | `betaling.betalingsmater` | `/priser/` | «Integrert betaling via EG», og EG er ikke på plass |
| Avbestillingsfrist og gebyr | `betaling.avbestilling` | `/priser/` | Svaret er tvetydig: gjelder det sen avbestilling, uteblivelse eller begge, og for hvilke timer |
| Kvittering til forsikring og skattefradrag | `betaling.kvittering` | `/priser/` | Svaret gjaldt bare betaling på klinikken |
| Parkering, buss og holdeplass, tilgjengelighet, reisetid fra Bergen sentrum | `adkomst.*` | `/kontakt/`, `/for-forsikringsselskaper/` | Hold (lokalene) |
| Fakturering (format, betingelser, referanse, EHF) | `avtale.fakturering` | `/for-forsikringsselskaper/` | Ikke besvart |
| Øvrige databehandlere (laboratorium, regnskap) | `personvern.databehandlere` | `/personvern/` | Ikke besvart |

### Kristian (drift og medisin)

| Opplysning | Felt | Sider | Merknad |
|---|---|---|---|
| Henvisningskanal | `henvisning.kanal` | `/for-henvisende-leger/` (to steder) | Kristian er usikker |
| Øvrige avgrensninger for henvisninger | `henvisning.ovrige_avgrensninger` | `/for-henvisende-leger/` | Medisinsk, fastsettes av fagansvarlig lege |
| Laboratorium og svartid på vevsprøver | `laboratorium.navn`, `laboratorium.svartid` | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` | Svaret «Furst, 4–6 uker» er uklart og motsier tidligere opplysning (1 til 4 uker). Leverandører navngis ikke uten avtale |
| Kvalitetsregistre | `kvalitet.kvalitetsregistre` | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` | Svarte «Nei» på Gastronet. En påstand om at klinikken *ikke* rapporterer skal ikke stå på siden |
| Avvikssystem og melderutiner | `kvalitet.avvikssystem` | `/for-forsikringsselskaper/` | Usikker |
| Dokumentasjon av internkontroll | `kvalitet.internkontroll_dokumentasjon` | `/for-forsikringsselskaper/` | Ikke besvart |
| Endoskopisk utstyr og desinfeksjonsrutiner | `utstyr` | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` | Ikke besvart |
| Kapasitet (rom, dager, undersøkelser per uke) | `kapasitet.*` | `/for-forsikringsselskaper/` | «5 dager i uka, ca. 5 koloskopier per dag» strider mot budsjettet (150 klinikkdager i år 1, 8 prosedyrer per dag). Avklares først |
| Avtaleform | `avtale.avtaleform` | `/for-forsikringsselskaper/` | Ikke besvart |
| Svartid fra bestilling til time og til epikrise | `avtale.svartid` | `/for-forsikringsselskaper/` | Ikke besvart (epikrise «samme dag» er satt for henviserne) |
| Rapportering, avbestillingsvilkår, journalintegrasjon | `avtale.rapportering`, `avtale.avbestilling`, `avtale.journalintegrasjon` | `/for-forsikringsselskaper/` | Ikke besvart |
| Personvernombud eller kontaktperson for personvern | `personvern.kontaktperson` | `/personvern/` | Ikke besvart |
| Øvrige lagringstider | `personvern.lagringstider` | `/personvern/` | Ikke besvart |
| Skriftlig avklaring av bistilling | `lege.bistilling_dokumentert` | `/om-klinikken/` | Kristians muntlige opplysning 25.9 er ikke nok |
| Skriftlig gjennomlesing og godkjenning | `status` på hver side | Alle sider som er rettet | Ingen status er endret |

Åpne medisinske spørsmål fra denne runden, også listet i `apne_punkter` på sidene: første time ved smertefull sprekk (spm. 57, svaret «JA» er tvetydig), 40-årsgrensen ved rektalblødning (ikke bekreftet), omfanget av at klinikken ikke behandler gravide og ammende for koloskopi, gastroskopi og refluks, og om hemoroider kommer tilbake etter behandling («vet ikke»).

### Ikke klinikken

- **Elevate:** Plausible-kontoen skal opprettes i klinikkens navn, og skriptet er ikke installert (se `docs/LANSERING.md`). Elevate verifiserer også overføringen til USA mot Netlifys databehandleravtale.
- **EG / integrasjonspartner:** `bestilling` (pasientportalen) er ikke svart på.

## 2. Hva som stopper et produksjonsbygg i dag

Kjørt lokalt med `PRODUKSJON=1`, uten `CI_SYNTETISK`. Bygget stopper ved første port. De neste portene er funnet ved å fylle den forrige med testverdier i en kopi utenfor repoet. Ingenting av det er lagret.

1. **`SITE_URL` mangler.** Uten den stopper bygget: «Produksjonsbygg uten SITE_URL.» I Netlify settes variabelen ved lansering.
2. **`epost` er `null`.** Med `SITE_URL` stopper bygget: «Produksjonsbygg med tomme lanseringskritiske klinikkfelter: epost.» Telefon er nå oppfylt.
3. **Ingen side er `GODKJENT`, heller ikke forsiden.** Med e-post fylt inn (bare som test) stopper bygget: «Produksjonsbygg uten GODKJENT forside.» 0 av 22 innholdsfiler er `GODKJENT`, og 6 står som `KLAR_FOR_MEDISINSK_GJENNOMGANG`.
4. **Forsiden kan ikke godkjennes alene.** Med forsiden simulert som godkjent stopper kontrakten på 5 feil: 3 prislinjer uten beløp (prisopplysningsforskriften § 10), og kort til `/gastroskopi/`, `/koloskopi/`, `/undersokelse-av-endetarmen/` og `/proktologi/`, som ikke er `GODKJENT`.

Det syntetiske produksjonsbygget (`CI_SYNTETISK=1`) og alle utdatavakter er grønne. `PRODUKSJON` og `SITE_URL` er ikke satt i Netlify.

## 3. Sidetelling

**Bygges i forhåndsvisningen: 23 HTML-sider.** Det er alle 22 filene i `src/innhold/` pluss komponentkatalogen.

- **20 innholdssider:** forsiden, undersøkelser, gastroskopi, koloskopi, anoskopi og rektoskopi, proktologi, analfissur, blod i avføringen, hemoroider, irritabel tarm, magesmerter, refluks, priser, slik foregår det, kontakt, bestill, om klinikken, for henvisende leger, for forsikringsselskaper og personvern.
- **Utenfor tellingen, men bygget:**
  - `/overvekt-og-fedme/` er parkert (arkivert i praksis) og ikke rørt. Den bygges i forhåndsvisningen med `noindex`, men ingen side lenker hit.
  - `/ikke-funnet/` er 404-siden. Netlify peker ukjente adresser hit, og den har `noindex`.
  - `/komponentkatalog/` er et internt utviklingsverktøy.

**Bygges ikke:** ingen innholdsfil er utelatt fra forhåndsvisningen. I et produksjonsbygg ville 0 sider blitt bygget i dag, fordi ingen er `GODKJENT`. Komponentkatalogen bygges aldri i produksjon.

## 4. Ordlisteskanning

`node vakter/kjor-alle.js --dist dist --historikk` er grønn: ingen preparatnavn, leverandører, forsikringsselskaper eller sporingssignaturer i kilder, bygget HTML eller commit-meldinger. «Haraldsplass» finnes bare i `src/innhold/om-klinikken.md`, bak `lege.bistilling_dokumentert`, og ikke i noen side i `dist/`.

## 5. Det som er verdt å se på

- **Telefonlinjen på kontaktsiden** er delt i to: «Telefon …» og «Åpen …» som egne linjer, siden åpningstidene mangler. Ordene er de samme som før, men oppsettet er nytt.
- **Kontaktlinjene på personvernsiden** krever både e-post og telefon, og venter derfor på e-post.
- **Strikkbehandling** står på tre sider (hemoroider, proktologi, endetarmsundersøkelsen) med samme formuleringer fra Kristian. Rektoskopi er omtalt med samme varighet som anoskopi (ca. 10 minutter), siden svaret var gitt for endetarmsundersøkelsen samlet.
- **Fjernet utover ordren:** FAQ-en «Kommer hemoroidene tilbake?» på proktologisiden, og setningen om at hemoroider kommer tilbake etter operasjon, på hemoroidesiden. Begge hadde samme påstand som Kristian svarte «vet ikke» på.
- **Gravide og ammende** er også omtalt med én setning på proktologisiden, som ikke hadde et slikt avsnitt fra før.
- **ERCP-setningen** («På sykehuset har han også utført ERCP …») er lagt bak samme felt som Haraldsplass, fordi «sykehuset» ellers peker på en arbeidsgiver som ikke er nevnt.
- **Gamle åpne punkter** som Kristians svar nå har besvart, er fjernet på endetarmssiden og analfissursiden (varighet, stilling, lengde på anoskopet). Andre åpne punkter på sidene er urørt, og noen kan være foreldet, for eksempel koloskopisidens punkt om at telefonnummeret ikke finnes.
