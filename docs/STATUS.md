# Statusrapport

**Dato:** 2026-10-14. **`origin/main`:** `c74c38e` (merge av PR #25, 20:51 +0200; innhold fra `4bdf016`). **Oppdatert** etter merge. Tallene i seksjon 3–5 er målt på `0102240` (før `4bdf016`, som bare endrer fire innholdsfiler, se seksjon 1), med mindre annet står. Alt er kjørt og lest av i denne økten, hvis ikke annet står.

## 1. Avvik, hopp over og ikke verifisert (først)

**Ikke verifisert**
- **Nettstedet er ikke åpnet.** Sandkassens proxy gir 403 på `*.netlify.app`. Om den er passordbeskyttet er derfor ukjent. Netlify-prosjektet har ikke Netlify-passord (`requiresPassword: false`). Basic-Auth styres av `PREVIEW_BRUKER` og `PREVIEW_PASSORD` i Netlify, og de kan jeg ikke lese. Bygget mitt uten variablene har ingen Basic-Auth (`basicAuthAktiv: false`).
- **Axe er ikke kjørt i denne økten** (sist 2026-10-08: 0 brudd på `0102240`-innholdet).
- **Netlifys databehandleravtale** er ikke sjekket (Elevates oppgave).

**Netlify (lest via Netlify-API 2026-10-14, etter merge)**
- `vagusentero-no.netlify.app` viser deploy `6acfcb5061a5bea9bf4be93f`, `state: ready`, `context: production`, bygget fra commit **`4bdf0165822ae3a343871d441fb4b794d5078014`** på grenen **`claude/vagus-entero-website-0eiqim`** (publisert 18:35 UTC). Det er innholdet i `main`, men ikke merge-commiten `c74c38e`.
- **Produksjonsgren:** Deployen har `context: production` og kommer fra arbeidsgrenen, ikke fra `main`. Det tyder sterkt på at produksjonsgrenen i Netlify er `claude/vagus-entero-website-0eiqim`. Jeg kan ikke lese selve innstillingen (API-et viser ikke «production branch»). Merge-commiten ble pushet til `main` 18:51 UTC. Ved to sjekker (rett etter og noen minutter senere) var den aktive deployen fortsatt `6acfcb50…` fra arbeidsgrenen, og ingen deploy fra `main` var vist.
- Forhåndsvisningen av PR #25 er `deploy-preview-25`, nå uten PR.

**Gjort utover arbeidsordrene** (alt i PR #20/#25, ingen status endret)
- 24.9: flere `klinikk.json`-felt enn listet (`adkomst.reisetid_bergen`, `henvisning.ovrige_avgrensninger`, `kvalitet.internkontroll_dokumentasjon`, `utstyr`, `avtale.*`, `personvern.*`). `apningstider` ble endret fra liste til streng og er ikke lenger reservert. Ny `ui.json`-nøkkel `venter_priser`, ikke godkjent av Erlend. Sifferfyll i `src/komponentkatalog.njk` byttet til X. Pristabellen bruker `<td>` i stedet for `<th>` når bare navnet vises (axe).
- 8.10: feltet `henvisning.lege_til_lege` fjernet. `false` regnes som manglende i utelatelsesmekanismen, og like markører etter hverandre slås sammen. Fjernet FAQ «Kommer hemoroidene tilbake?» (proktologi) og setningen om tilbakefall etter operasjon (hemoroider), begge utover ordren. Ny FAQ «Trenger jeg kontroll etter strikk?» (hemoroider.md). Én setning om gravide og ammende på proktologi (ingen slik fantes). ERCP-setningen i om-klinikken ligger bak `lege.bistilling_dokumentert`. `undersokelser.md` endret til «ca. 10 minutter» for anoskopi/rektoskopi. Tre foreldede åpne punkter fjernet (to på endetarm, ett på analfissur) og ett omskrevet (endetarm). «Etter noen uker» omdøpt til «Etter noen måneder» (proktologi).
- Timelengdene: ingen eksisterende tekst hadde dem. Jeg la til «Timen er satt av N minutter» på koloskopi, gastroskopi, endetarm og blod i avføringen. Konsultasjon (20) står bare i `klinikk.json`.
- Kontaktsiden: telefon og åpningstider delt i to linjer (kontakt.md).

**Ikke gjort / gjenstår**
- PR #25 er merget (se seksjon 2). Plausible-skriptet er ikke installert (etter ordre).
- Foreldede åpne punkter: de to jeg nevnte (`koloskopi.md` «telefonnummeret finnes ikke» og `for-forsikringsselskaper.md` «[PLASSHOLDER: …]») er fjernet i `4bdf016`. `koloskopi.md` har fortsatt et åpent punkt om at tømmesetningen skal peke til telefonnummeret «når det finnes»; telefon finnes nå. Andre kan finnes.
- Spm. 57, 40-årsgrensen og gravide for øvrige undersøkelser er bare åpne punkter, som ordren ba om.
- Dobbelt «som» i Plausible-setningen er rettet i `4bdf016` (første setning står verbatim, andre er delt: «… informasjonskapsler. Verktøyet identifiserer ikke deg som person.»). Behandlingslisten i `proktologi.md` er omsortert til strikk, salve, injeksjon. Fakta-stripen og innledningen i samme fil nevner fortsatt injeksjon før salver.

## 2. Git

`origin/main`, nyeste først: `c74c38e` 2026-10-14 Merge #25 · `4bdf016` 10-14 Rettelser · `a476fc2` 10-14 · `f2d16e6` 10-14 STATUS.md · `0102240` 10-08 Del 4 · `95c1122` 10-08 Del 3 · `a318b3d` 10-08 Del 2 · `76da8e9` 10-08 Del 1 · `044f657` 09-24 Merge #20 · `392bbfc` · `0681741` · `eb76e26` · `b57bbba` Merge #19 · `d855600` (09-24) · `49eed0a` (09-21).

| PR | Tittel | Status |
|---|---|---|
| #25 | Svar fra klinikken … (8.10-ordren) | **merget 2026-10-14** (`c74c38e`) |
| #21–24 | Dependabot (setup-node, upload-artifact, checkout, alle-gruppen) | åpne, 2026-10-01 |
| #20 | Leveringsklart forhåndsbygg (24.9-ordren) | merget 2026-09-24 |
| #19 | Trinn 2-svarene inn | merget 2026-09-24 |
| #18, #17, #16, #15, #14, #13, #11, #9, #7, #6, #5, #4 | tidligere arbeid | merget 2026-08-24 til 2026-09-15 |
| #12, #10, #3, #2, #1 | Dependabot | lukket, ikke merget |
| #8 | Installer Claude Code-skills, plugins og MCP-servere | åpen, 2026-08-28 |

CI på `4bdf016` (merget hode): `bygg-og-vakter` (inkl. Lighthouse) og `historikk` = success, Netlify-sjekkene = success (lest 2026-10-14).

## 3. Arbeidsordrene

| Ordre | Status | Commit |
|---|---|---|
| 24.9: `klinikk.json`-felt, `krever`-mekanisme, omskrevne plassholdere (kontakt, priser, leger, forsikring, personvern), vakt mot sifferplassholdere, Plausible-tekst (skript ikke installert, `docs/LANSERING.md:92`), `docs/LEVERINGSSJEKK.md` | ferdig, merget | `eb76e26`, `0681741`, `392bbfc`, merge `044f657` |
| 8.10 del 1: telefon, kontaktperson, epikrise, `timelengde` | ferdig, merget (`c74c38e`) | `76da8e9` |
| 8.10 del 2: Kristians rettelser | ferdig (se under), merget (`c74c38e`) | `a318b3d` |
| 8.10 del 3: `docs/STEDSAVHENGIGHET.md` | ferdig, merget (`c74c38e`) | `95c1122` |
| 8.10 del 4: regenerert `docs/LEVERINGSSJEKK.md` | ferdig, merget (`c74c38e`) | `0102240` |

**Del 2, punkt for punkt** (alle i `src/innhold/`, verifisert med søk)
- **2a** ca. 5 cm: `undersokelse-av-endetarmen.md:83,145`. Ca. 10 minutter: `undersokelse-av-endetarmen.md:9,85,115,120,157`, `blod-i-avforingen.md:104,114,127,158`, `hemoroider.md:115`, `proktologi.md:121`, `analfissur.md:105,147`, `undersokelser.md:61`. Timen satt av 30: `undersokelse-av-endetarmen.md:120,157`, `blod-i-avforingen.md:114`. Beinholdere: `undersokelse-av-endetarmen.md:125`, `hemoroider.md:115`, `proktologi.md:123`. «Vanligvis ikke vondt»: teksten sto allerede slik (`undersokelse-av-endetarmen.md:115`), ikke endret.
- **2b** to måneder: `proktologi.md:101,103,141,163`, `hemoroider.md:138`, `undersokelse-av-endetarmen.md:153`. Grad 2 og 3 (og grad 1 ved blødning): `proktologi.md:102`, `hemoroider.md:137`, `undersokelse-av-endetarmen.md:153`. «Opptil en av fem» borte (0 treff), erstattet av «mer enn én behandling»: `proktologi.md:102,146,163`, `hemoroider.md:138,166`. Ubehag/døgn: `proktologi.md:102`, `hemoroider.md:164`. Sykmelding: `proktologi.md:161`, `hemoroider.md:164`. Ingen rutinekontroll: `proktologi.md:141`, `hemoroider.md:166`.
- **2c** Salve først: ikke endret, `analfissur.md` har salve før injeksjon, men listen i `proktologi.md` har injeksjon før salve (salve har liten «Ofte det første som prøves»). Jeg har ikke vurdert om det er avvik. Uten tall (0 treff på «6 av 100»/«4 av 100»): `analfissur.md:125`, `proktologi.md:108,147`. Kontroll etter 3 måneder: `analfissur.md:125`, `proktologi.md:108,141,147,163`. Henvisning til operasjon, uten sted: `analfissur.md:135`, `proktologi.md:147`. Salve 6 uker: `analfissur.md:119`, `proktologi.md:113`. Hodepine + alternativ behandling: `analfissur.md:120`, `proktologi.md:113,148`. Gel krever resept: søk gir 0 treff. Spm. 57: teksten ikke endret, åpent punkt i `analfissur.md`.
- **2d** Én av tre og 45–65 står (`hemoroider.md:67,79`). Påstanden om svak slimhinne er borte (0 treff). Vaselin står (`hemoroider.md:128`). Blodpropp lokalt, smertestillende: `hemoroider.md:168`, `proktologi.md:175`.
- **2e** Gravide/ammende: `hemoroider.md:172`, `analfissur.md:151`, `proktologi.md:91`. `koloskopi.md`, `gastroskopi.md`, `refluks.md`: kun nytt åpent punkt (diff verifisert).
- **2f** `blod-i-avforingen.md:103` (den nye setningen om voksne står i samme avsnitt som den beholdte 40 år-setningen). Åpent punkt `blod-i-avforingen.md:22`.
- **2g** `lege.bistilling_dokumentert` (`null`) i `klinikk.json`. `om-klinikken.md:71,86,88,93` er betinget. `grep -ri haraldsplass dist` = 0 treff.

## 4. Tilstand nå

**Bygg uten `PRODUKSJON`** (`npm run bygg` på `0102240`): 23 sider, **0 synlige plassholdere**, 0 døde interne lenker, alle sider har title og description, **41 markører på 13 sider**. Per side: forsikring 11, leger 7, kontakt 4, personvern 5, priser 4, om-klinikken 3, og 1 hver på `/`, undersøkelser, gastroskopi, koloskopi, endetarm, proktologi og overvekt (alle «priser og hva som er inkludert»). Feltene er alle `null`-felt i `klinikk.json` (åpningstider, adkomst, e-post, henvisning, utstyr, laboratorium, kvalitet, kapasitet, avtale, betaling, personvern, bistilling) pluss «priser og hva som er inkludert». Fullt per side: `docs/LEVERINGSSJEKK.md`.

**Vakter:** `npm test` grønn. Alle 20 kjøringer OK i `npm run bygg`, `--historikk` grønn, syntetisk produksjonsbygg (`CI_SYNTETISK=1`) grønn. Ingen feiler.

**`PRODUKSJON=1` (ekte):** (1) uten `SITE_URL`: «Produksjonsbygg uten SITE_URL.» (2) med `SITE_URL`: «tomme lanseringskritiske klinikkfelter: epost». Videre (simulert i kopi, ikke lagret): «uten GODKJENT forside». Med forsiden godkjent: 3 prislinjer uten beløp og 4 kort til sider som ikke er GODKJENT.

**`klinikk.json`, felt ≠ null:** `juridisk_navn` Vagus Entero AS · `visningsnavn` Vagus Entero Klinikken · `kortnavn` Vagus Entero · `domene` enteroklinikken.no · `org_nr` 938387127 · `adresse` Sartorvegen 8, 5354 Straume, bygg Sartor Helsehus · `telefon` 920 33 690 · `lege` Kristian Eeg Storli, HPR 7070373, spesialitet generell kirurgi og gastroenterologisk kirurgi · `tilsyn` (yrkestittel, land Norge, tillatelse, myndighet Statsforvalteren i Vestland og Statens helsetilsyn) · `henvisning.epikrise_svartid` Samme dag · `avtale.kontakt` Malin Pamer, Daglig leder, 920 33 690 · `timelengde` koloskopi 60, gastroskopi 30, konsultasjon 20, rektoskopi 30, anoskopi 30. Alt annet er `null`.

**Status og åpne punkter per side** (ingen `status` endret siden `b57bbba`: 0 differ)

| Side | Status | Åpne | Side | Status | Åpne |
|---|---|---|---|---|---|
| `/` | UTKAST | 2 | `/koloskopi/` | KLAR | 59 |
| `/undersokelser/` | UTKAST | 4 | `/magesmerter/` | KLAR | 43 |
| `/gastroskopi/` | KLAR | 41 | `/refluks/` | KLAR | 38 |
| `/undersokelse-av-endetarmen/` | UTKAST | 35 | `/blod-i-avforingen/` | KLAR | 37 |
| `/proktologi/` | UTKAST | 42 | `/irritabel-tarm/` | KLAR | 37 |
| `/hemoroider/` | UTKAST | 36 | `/analfissur/` | UTKAST | 30 |
| `/priser/` | UTKAST | 4 | `/kontakt/` | UTKAST | 5 |
| `/slik-foregar-det/` | UTKAST | 1 | `/bestill/` | UTKAST | 2 |
| `/om-klinikken/` | UTKAST | 15 | `/for-henvisende-leger/` | UTKAST | 10 |
| `/for-forsikringsselskaper/` | UTKAST | 12 | `/personvern/` | UTKAST | 10 |
| `/overvekt-og-fedme/` (parkert) | UTKAST | 31 | `/ikke-funnet/` | UTKAST | 1 |

KLAR = KLAR_FOR_MEDISINSK_GJENNOMGANG. Totalt 6 KLAR, 16 UTKAST, 0 GODKJENT. Titlene er ikke listet per punkt. Nye siden 24.9: «Rettet etter Kristians svar 25.9 …» (6 sider), «Avsatt tid for timen …» (koloskopi, gastroskopi), «Om klinikken behandler gravide og ammende …» (koloskopi, gastroskopi, refluks), «40-årsgrensen ikke bekreftet», «Spørsmål 57 … tvetydig», Haraldsplass, Plausible-konto og Netlify-avtale.

## 5. Søk etter risikoord (publisert tekst, `apne_punkter` utelatt)

- **Haraldsplass:** 3 treff i kilden (`om-klinikken.md:70,85,87`), alle betinget. 0 i `dist/`.
- **«5 minutter»/«rundt 5»/«omtrent 5»:** 0 publiserte treff (7 i åpne punkter).
- **«venstre side»:** 5 publiserte treff, ingen om endetarmsundersøkelse: `gastroskopi.md:144`, `koloskopi.md:162`, `magesmerter.md:100,199`, `refluks.md:126`.
- **«noen ukers mellomrom»/«noen uker senere»:** 0 publiserte (4 i åpne punkter).
- **Preparat-, leverandør- og forsikringsnavn:** ordlisteskanningen er grønn. Egne søk på Volvat, Furst, Paracet, Gastronet og «EG»: 0 treff. «Netlify» og «Plausible» står i `personvern.md:52,61` (bevisst, fra 24.9-ordren).
- **Priser:** 0 kronebeløp i tekst. Alle `belop_nok` er `null`.
- **Adresse:** `om-klinikken.md:51,62` (Sartor Helsehus, Straume) i tillegg til `klinikk.json`. Fullt oversikt i `docs/STEDSAVHENGIGHET.md`.

## 6. Indeksering (lest i lokal `dist/`, bygget uten `PRODUKSJON` på `4bdf016`)

- **23 av 23 HTML-sider** har `<meta name="robots" content="noindex, nofollow">` (eksakt, én unik verdi).
- **`dist/_headers`** har under `/*`: `X-Robots-Tag: noindex, nofollow` (linje 10), og `Cache-Control: private, max-age=0, must-revalidate`.
- **`dist/robots.txt`** er nøyaktig to linjer: `User-agent: *` og `Disallow: /`.
- Dette er lokalt bygg. Jeg har ikke hentet headere eller `robots.txt` fra `vagusentero-no.netlify.app` (proxyen gir 403 mot `*.netlify.app`), så det som faktisk serveres er ikke bekreftet.

## Hva jeg ikke har sjekket

Om nettstedet er passordbeskyttet, og hva som står i Netlify-variablene. Om nettstedet faktisk serverer innholdet og indekseringsheaderne (jeg har bare deploy-metadata). Selve innstillingen for produksjonsgren (bare utledet av deploy-konteksten). Om en deploy fra `main` kommer etter merge. Axe i denne økten. Medisinsk riktighet av noe innhold. Om Kristian har lest sidene. Om foreldede åpne punkter utover de jeg nevner finnes. Dependabot-PR-ene (#21–24) og PR #8.
