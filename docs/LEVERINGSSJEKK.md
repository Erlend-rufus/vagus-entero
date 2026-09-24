# Leveringssjekk: forhåndsbygget til gjennomlesning

**Dato:** 24.09.2026
**Arbeidsordre:** «leveringsklart forhåndsbygg»
**Grunnlag:** `npm run bygg` uten `PRODUKSJON`. Alle tall er telt i den
**rendrede HTML-en i `dist/`**, i synlig tekst med tagger, `<script>` og
`<style>` fjernet, ikke i kildefilene.

**Akseptkriteriet er oppfylt:** ingen synlige plassholdere i
forhåndsbygget. Tellingen dekker `[PLASSHOLDER`, `[TEKST KOMMER`,
`[BEKREFT` og sifferplassholdere som `[00 00 00 00]`, og gir 0 på alle 23
bygde sider.

Kolonnene:

- **Plassholdere:** synlige plassholdere av typene over.
- **Markører:** linjer med «Venter på opplysning fra klinikken: …». Antall,
  og feltene hver markør venter på, skilt med semikolon.
- **Døde lenker:** interne `href` uten mål i `dist/`.
- **Tittel / beskrivelse:** om `<title>` og `<meta name="description">`
  finnes, med lengde i tegn. Tittelen er målt med suffikset
  «| Vagus Entero».

| Side og URL | Status | Plassholdere | Markører «Venter på klinikken» | Døde lenker | Tittel / beskrivelse | Merknad |
|---|---|---|---|---|---|---|
| Klinikk for mage, tarm og endetarm — `/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (60 / 125) | Prisblokken venter på beløp. |
| Undersøkelser og behandling — `/undersokelser/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (42 / 142) | |
| Gastroskopi — `/gastroskopi/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (55 / 140) | |
| Koloskopi — `/koloskopi/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (53 / 152) | |
| Anoskopi og rektoskopi — `/undersokelse-av-endetarmen/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (66 / 152) | Tittelen er over 60 tegn og kan bli avkortet i søk. |
| Proktologi — `/proktologi/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (67 / 145) | Tittelen er over 60 tegn. |
| Analfissur — `/analfissur/` | UTKAST | 0 | 0 | 0 | ja / ja (59 / 155) | |
| Blod i avføringen — `/blod-i-avforingen/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (75 / 143) | Tittelen er over 60 tegn. |
| Hemoroider — `/hemoroider/` | UTKAST | 0 | 0 | 0 | ja / ja (70 / 155) | Tittelen er over 60 tegn. |
| Irritabel tarm — `/irritabel-tarm/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (75 / 153) | Tittelen er over 60 tegn. |
| Magesmerter — `/magesmerter/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (66 / 154) | Tittelen er over 60 tegn. |
| Refluks — `/refluks/` | KLAR_FOR_MEDISINSK_GJENNOMGANG | 0 | 0 | 0 | ja / ja (75 / 154) | Tittelen er over 60 tegn. |
| Priser og betaling — `/priser/` | UTKAST | 0 | 4: priser og hva som er inkludert; betalingsmåter; avbestillingsfrist og gebyr ved ikke møtt; kvittering til forsikring og skattefradrag | 0 | ja / ja (33 / 110) | Prislisten viser bare tjenestenavnene, med én samlet markør. Sidehodet har illustrasjonen «overvekt», selv om fedmedelen er parkert (ikke rørt). |
| Slik foregår det — `/slik-foregar-det/` | UTKAST | 0 | 0 | 0 | ja / ja (31 / 74) | Del 3: den stale linjen er borte (rettet i `d855600`). |
| Kontakt og bestill time — `/kontakt/` | UTKAST | 0 | 4: telefonnummer, åpningstider; parkering, buss og holdeplass; tilgjengelighet (trinnfritt, heis, HC-parkering, teleslynge); priser og hva som er inkludert | 0 | ja / ja (49 / 94) | Telefonlinjen i «Ring oss» er utelatt. Knappen vises ikke før `telefon` finnes. |
| Bestill time — `/bestill/` | UTKAST | 0 | 0 | 0 | ja / ja (27 / 73) | Portalen er ikke montert. Varselet ber besøkende ringe, men nummeret mangler ennå (gjelder også varselet under «Bestill time» på andre sider). |
| Om klinikken og legen — `/om-klinikken/` | UTKAST | 0 | 0 | 0 | ja / ja (71 / 144) | Tittelen er over 60 tegn. |
| For henvisende leger — `/for-henvisende-leger/` | UTKAST | 0 | 9: henvisningskanal; svartid på epikrise; lege-til-lege-nummer; henvisningskanal; øvrige avgrensninger for henvisninger; endoskopisk utstyr og desinfeksjonsrutiner; kvalitetsregistre; laboratorium for vevsprøver, svartid på vevsprøver; priser og hva som er inkludert | 0 | ja / ja (35 / 115) | Faktalisten viser bare «Driftsavtale». «Øvrige leger» er fjernet (del 1e). |
| For forsikringsselskaper — `/for-forsikringsselskaper/` | UTKAST | 0 | 11: reisetid fra Bergen sentrum; avtaleform; priser og hva som er inkludert; antall undersøkelsesrom, dager per uke, undersøkelser per uke, svartid fra bestilling til time og til epikrise, format og kanal for rapportering, fakturering (format, betingelser, referanse, EHF), avbestillingsvilkår i avtalen, integrasjon mot selskapets systemer; endoskopisk utstyr og desinfeksjonsrutiner; laboratorium for vevsprøver, svartid på vevsprøver; kvalitetsregistre; dokumentasjon av internkontroll; avvikssystem og melderutiner; parkering, buss og holdeplass, tilgjengelighet (trinnfritt, heis, HC-parkering, teleslynge); navn på avtaleansvarlig, rolle for avtaleansvarlig, e-post til avtaleansvarlig, telefon til avtaleansvarlig | 0 | ja / ja (39 / 138) | Hele «Kapasitet, svartid og rapportering» er utelatt med overskrift: én samlet markør. «Øvrige leger og sykepleiere» er fjernet (del 1e). |
| Personvern — `/personvern/` | UTKAST | 0 | 5: e-postadresse, telefonnummer; personvernombud eller kontaktperson for personvern; øvrige databehandlere; øvrige lagringstider; e-postadresse, telefonnummer | 0 | ja / ja (25 / 112) | Se «Til juridisk gjennomgang» under. |
| Overvekt og fedme — `/overvekt-og-fedme/` | UTKAST | 0 | 1: priser og hva som er inkludert | 0 | ja / ja (75 / 146) | Parkert 11.09.2026, med `noindex`. Bygges i forhåndsvisningen, men ingen side lenker hit. |
| Siden finnes ikke — `/ikke-funnet/` | UTKAST | 0 | 0 | 0 | ja / ja (32 / 83) | 404-siden, ikke en innholdsside. `noindex`. |
| Komponentkatalog — `/komponentkatalog/` | ikke innholdsside | 0 | 0 | 0 | ja / ja (31 / 71) | Internt utviklingsverktøy som aldri bygges i produksjon. Fyllordene er X-er, og sifferfyllet er byttet til X-er. |

Kortversjon: 0 plassholdere, 0 døde interne lenker, og tittel og beskrivelse
på alle sider. Det er 40 markører på 12 sider.

## 1. Manglende klinikkfakta, samlet

Feltene står i `src/_data/klinikk.json` som `null`, og er beskrevet i
`docs/KLINIKKFELT.md`. Fordelingen på Malin og Kristian er et forslag.

### Malin (fakta)

| Opplysning | Felt | Sider |
|---|---|---|
| Telefonnummer | `telefon` | `/kontakt/`, `/personvern/`, «Ring oss» og bunntekst på alle sider. Lanseringskritisk |
| E-postadresse | `epost` | `/personvern/`, bunntekst på alle sider. Lanseringskritisk |
| Åpningstider for telefonen | `apningstider` | `/kontakt/` |
| Betalingsmåter | `betaling.betalingsmater` | `/priser/` |
| Avbestillingsfrist og gebyr ved ikke møtt | `betaling.avbestilling` | `/priser/` |
| Kvittering til forsikring og skattefradrag | `betaling.kvittering` | `/priser/` |
| Parkering | `adkomst.parkering` | `/kontakt/`, `/for-forsikringsselskaper/` |
| Buss og holdeplass | `adkomst.kollektiv` | `/kontakt/`, `/for-forsikringsselskaper/` |
| Tilgjengelighet (trinnfritt, heis, HC-parkering, teleslynge) | `adkomst.tilgjengelighet` | `/kontakt/`, `/for-forsikringsselskaper/` |
| Reisetid fra Bergen sentrum | `adkomst.reisetid_bergen` | `/for-forsikringsselskaper/` |
| Kontaktperson for forsikringsavtaler (navn, rolle, e-post, telefon) | `avtale.kontakt.*` | `/for-forsikringsselskaper/` |
| Fakturering (format, betingelser, referanse, EHF) | `avtale.fakturering` | `/for-forsikringsselskaper/` |
| Øvrige databehandlere (laboratorium, regnskap) | `personvern.databehandlere` | `/personvern/` |

### Kristian (drift og medisin)

| Opplysning | Felt | Sider |
|---|---|---|
| Priser og hva som er inkludert | `belop_nok` og `omfang` i innholdsfilene | `/priser/`, `/for-forsikringsselskaper/`, prisblokkene på `/`, `/undersokelser/`, `/gastroskopi/`, `/koloskopi/`, `/undersokelse-av-endetarmen/`, `/proktologi/`, `/kontakt/`, `/for-henvisende-leger/`, `/overvekt-og-fedme/` |
| Henvisningskanal | `henvisning.kanal` | `/for-henvisende-leger/` |
| Svartid på epikrise | `henvisning.epikrise_svartid` | `/for-henvisende-leger/` |
| Eget lege-til-lege-nummer (valgfritt) | `henvisning.lege_til_lege` | `/for-henvisende-leger/` |
| Øvrige avgrensninger for henvisninger (medisinsk) | `henvisning.ovrige_avgrensninger` | `/for-henvisende-leger/` |
| Laboratorium for vevsprøver og svartid | `laboratorium.navn`, `laboratorium.svartid` | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| Kvalitetsregistre | `kvalitet.kvalitetsregistre` | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| Endoskopisk utstyr og desinfeksjonsrutiner | `utstyr` | `/for-henvisende-leger/`, `/for-forsikringsselskaper/` |
| Avvikssystem og melderutiner | `kvalitet.avvikssystem` | `/for-forsikringsselskaper/` |
| Dokumentasjon av internkontroll | `kvalitet.internkontroll_dokumentasjon` | `/for-forsikringsselskaper/` |
| Kapasitet (rom, dager, undersøkelser per uke) | `kapasitet.*` | `/for-forsikringsselskaper/` |
| Avtaleform | `avtale.avtaleform` | `/for-forsikringsselskaper/` |
| Svartid fra bestilling til time og til epikrise | `avtale.svartid` | `/for-forsikringsselskaper/` |
| Rapportering (format og kanal) | `avtale.rapportering` | `/for-forsikringsselskaper/` |
| Avbestillingsvilkår i avtalen | `avtale.avbestilling` | `/for-forsikringsselskaper/` |
| Integrasjon mot selskapets systemer | `avtale.journalintegrasjon` | `/for-forsikringsselskaper/` |
| Personvernombud eller kontaktperson for personvern | `personvern.kontaktperson` | `/personvern/` |
| Øvrige lagringstider | `personvern.lagringstider` | `/personvern/` |

### Ikke klinikken

- **Elevate:** Plausible-kontoen skal opprettes i klinikkens navn, og
  skriptet er ikke installert (se `docs/LANSERING.md`). Elevate verifiserer
  også overføringen til USA mot Netlifys databehandleravtale.
- **Integrasjonspartner:** `bestilling` (pasientportalen).
- **Innholdsprosessen:** `mva_status`, setningen om merverdiavgift i
  bunnteksten.

## 2. Hva som stopper et produksjonsbygg i dag

Kjørt lokalt med `PRODUKSJON=1`, uten `CI_SYNTETISK`. Bygget stopper ved
første port, så de neste portene er funnet ved å fylle den forrige med
testverdier i en kopi utenfor repoet. Ingenting av det er lagret.

1. **`SITE_URL` mangler.** Uten den stopper bygget:
   «Produksjonsbygg uten SITE_URL.» Dette er ventet lokalt; i Netlify
   settes variabelen ved lansering.
2. **`telefon` og `epost` er `null`.** Med `SITE_URL` stopper bygget:
   «Produksjonsbygg med tomme lanseringskritiske klinikkfelter: telefon,
   epost.» Ehandelsloven § 8 krever dem.
3. **Ingen side er `GODKJENT`, heller ikke forsiden.** Med telefon og
   e-post fylt inn (bare som test) stopper bygget: «Produksjonsbygg uten
   GODKJENT forside.» 0 av 22 innholdsfiler er `GODKJENT`, og 6 står som
   `KLAR_FOR_MEDISINSK_GJENNOMGANG`.
4. **Forsiden kan ikke godkjennes alene.** Med forsiden simulert som
   godkjent stopper kontrakten på 5 feil:
   - 3 prislinjer uten beløp (prisopplysningsforskriften § 10);
   - kort til `/gastroskopi/`, `/koloskopi/`,
     `/undersokelse-av-endetarmen/` og `/proktologi/`, som ikke er
     `GODKJENT`. Målene må godkjennes først.

   Hver side som skal bli `GODKJENT`, må ha signatur (`godkjent_av`,
   `godkjent_dato`), ingen `apne_punkter`, ingen plassholdere og ingen
   priser uten beløp.

`PRODUKSJON` er ikke satt i Netlify og er ikke rørt.

## 3. Sidetelling

**Bygges i forhåndsvisningen: 23 HTML-sider.** Det er alle 22 filene i
`src/innhold/` pluss komponentkatalogen.

- **20 innholdssider:** forsiden, undersøkelser, gastroskopi, koloskopi,
  anoskopi og rektoskopi, proktologi, analfissur, blod i avføringen,
  hemoroider, irritabel tarm, magesmerter, refluks, priser, slik foregår
  det, kontakt, bestill, om klinikken, for henvisende leger, for
  forsikringsselskaper og personvern.
- **Utenfor tellingen, men bygget:**
  - `/overvekt-og-fedme/` er parkert. Den bygges i forhåndsvisningen med
    `noindex`, men lenkes ikke fra noen side. Arbeidsordren kaller den
    arkivert; i repoet er den parkert, ikke fjernet.
  - `/ikke-funnet/` er 404-siden. Netlify peker ukjente adresser hit, og
    den har `noindex`.
  - `/komponentkatalog/` er et internt utviklingsverktøy.

**Bygges ikke:** ingen innholdsfil er utelatt fra forhåndsvisningen. I et
produksjonsbygg ville 0 sider blitt bygget i dag, fordi ingen er
`GODKJENT` (se punkt 2). Komponentkatalogen bygges aldri i produksjon.

## Til juridisk gjennomgang (personvern)

Disse punktene er tatt ordrett fra arbeidsordren og ikke endret. De flagges
her:

- «Vi bruker Plausible Analytics, som er driftet i EU og ikke bruker
  informasjonskapsler, som ikke identifiserer deg som person.» Innsatt
  ordrett i den eksisterende setningen. Resultatet har to «som» etter
  hverandre.
- Samme avsnitt sier nå både «Opplysninger lagres i EØS» og at Netlify i
  USA behandler IP-adressen. Står som åpent punkt sammen med
  verifiseringen mot Netlifys databehandleravtale.
- Plausible er nevnt i teksten, men er ikke installert. Nettstedet måler
  ingenting før det er gjort.

## Endringer utenfor sidene

- Ny nøkkel i `ui.json`: `venter_pa_klinikken` («Venter på opplysning fra
  klinikken:»), ordrett fra arbeidsordren.
- Ny nøkkel i `ui.json`: `venter_priser` («priser og hva som er
  inkludert»). Den er ordlagt av utvikleren og **trenger Erlends
  godkjenning**. Begge vises bare i forhåndsvisningen.
- Pristabellen: når ingen rad har beløp eller omfang, er tjenestenavnet en
  datacelle, ikke radoverskrift. Årsaken er at axe flagget
  radoverskrifter uten dataceller.
