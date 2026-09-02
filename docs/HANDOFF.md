# HANDOFF — grensesnittet mellom kode, tekst og design

Leses av innholdsprosessen ved hver ny zip, og limes inn i Claude Design
ved neste designrunde. Vedlikeholdes av kodesesjonen. Sist endret 02.09.2026
(etter revisjonen).

## Det viktigste først: repoet er Eleventy, ikke Next

Det har ikke skjedd noen migrering til Next.js. Repoet er det samme
Eleventy-prosjektet, og alt som ble bygget inn i det er intakt og kjører:

| Hva | Hvor | Kjøres av |
|---|---|---|
| Innholdskontrakten | `skjema/innhold.schema.json`, forklart i `docs/INNHOLDSKONTRAKT.md` | hvert bygg (`eleventy.before`) — bygget stopper på brudd |
| Forbudslistene | `vakter/ordlister/*.txt` (preparatnavn, ventetidsfraser, superlativer, leverandører, forsikringsselskaper, omtalesignaler, sporingssignaturer) | `vakter/ordliste-skann.js` mot kildefiler, bygd HTML og commit-meldinger |
| Alle vaktene (18) | `vakter/*.js`, orkestrert av `vakter/kjor-alle.js` | GitHub Actions (`.github/workflows/ci.yml`) **og** Netlifys eget bygg (`npm run bygg`) |
| Selvtestene (156) | `vakter/tester/kjor-selvtester.js` | `npm test`, i CI |

ClickUp-oppgaven «Next.js besluttet» (28.08) er ikke gjennomført. Ingen av
rammene i den krever Next: statisk generering, JS-fri navigasjon, null
tredjepart, ytelsesbudsjett og WCAG er alt oppfylt i dag og bevist i CI.
En migrering ville bety å porte kontrakten, vaktene, gaten, headerne og
testene på nytt. Bookingflyten er isolert på egen rute (`/bestill/`) og kan
bygges av integrasjonspartneren uten at innholdssidene røres. **Beslutningen
om rammeverk må tas eksplisitt** — se «Blokkert».

## Innholdsformatet

Én markdown-fil per side i `src/innhold/`, all tekst i YAML-frontmatter.
Tekstpakkens felter er frontmatterens felter — ingen oversettelse
(tabellen står i `docs/INNHOLDSKONTRAKT.md`). Der tekst mangler skrives
nøyaktig `[TEKST KOMMER]`: godtatt i forhåndsvisning, kan aldri bli
GODKJENT, stopper produksjonsbygget. Komplett, virkelig eksempel:
`src/innhold/proktologi.md`. Kortversjon med alle felt:

```yaml
---
sidetype: tilstand              # forside|undersokelse|tilstand|behandling|pris|henviser|forsikring|statisk|bestilling
url: /hemoroider/
malgruppe: selvbetalende        # selvbetalende|henviser|forsikring
tittel: "[TEKST KOMMER]"        # H1, 10–60 tegn
sidetittel: "[TEKST KOMMER]"    # <title> uten suffiks; bygget legger til « | Vagus Entero»
menytittel: Hemoroider          # kort etikett i meny og brødsmulesti
meta_beskrivelse: "[TEKST KOMMER]"   # 70–155 tegn
ingress: "[TEKST KOMMER]"       # 30–300 tegn
status: UTKAST                  # UTKAST|KLAR_FOR_MEDISINSK_GJENNOMGANG|GODKJENT
godkjent_av: null               # navn ved GODKJENT
godkjent_dato: null             # ÅÅÅÅ-MM-DD ved GODKJENT
jsonld_type: MedicalCondition   # MedicalProcedure|MedicalCondition|MedicalSignOrSymptom|MedicalClinic|Physician|null
interne_lenker_ut: [/undersokelse-av-endetarmen/, /priser/]
apne_punkter: ["[MEDISINSK GJENNOMGANG KREVES]"]
i_navigasjon: false
i_bunntekst: false
rekkefolge: 40
overordnet: /undersokelser/     # valgfri, brødsmulestiens forelder
illustrasjon: endetarm          # valgfri: gastroskopi|koloskopi|endetarm|proktologi|overvekt|fordoyelse-hero
hode_knapper:                   # rendres bare når fakta finnes i klinikk.json
  - { tekst: Bestill time, handling: bestilling }
  - { tekst: Ring oss, handling: telefon }
fakta:                          # valgfri stripe, 2–4 punkter
  - { term: "[TEKST KOMMER]", verdi: "[TEKST KOMMER]" }
seksjoner:                      # hver blokk = én H2. Typer: tekst, tidslinje, steg, sporsmal, veier, praktisk, kort, kort_bred, pris, prisliste
  - { type: tekst, tittel: "[TEKST KOMMER]", avsnitt: ["[TEKST KOMMER]"] }
  - { type: sporsmal, tittel: "[TEKST KOMMER]", flate: sand, sporsmal: [{ sporsmal: "[TEKST KOMMER]", svar: "[TEKST KOMMER]" }] }
  - { type: pris, tittel: "[TEKST KOMMER]", avsnitt: ["[TEKST KOMMER]"], priser: [{ navn: "[TEKST KOMMER]", belop_nok: null }] }
---
```

I prosafelt skrives interne lenker som `[tekst](/sti/)` og linjeskift som
`\n`. Prislisten er en seksjon av type `prisliste` (kolonnehoder, omfang,
beløp). `bilder` er reservert til visningen finnes.

Fakta om klinikken (org.nr, adresse, telefon, e-post, lege, tilsyn, bestilling)
skrives aldri i innholdsfiler — de ligger i `src/_data/klinikk.json`, og
`null` utelates fra nettstedet.

## Rutekartet slik det er bygget (02.09.2026)

Alle URL-er har avsluttende skråstrek (Netlify omdirigerer `/koloskopi` dit).

| # | ClickUp | Rute | Fil i `src/innhold/` | Kilde |
|---|---|---|---|---|
| 01 | Forside | `/` | `forside.md` | design + tekst |
| — | (ikke i ClickUp) | `/undersokelser/` | `undersokelser.md` | design |
| 02 | Gastroskopi | `/gastroskopi/` | `gastroskopi.md` | design + tekst |
| 03 | Koloskopi | `/koloskopi/` | `koloskopi.md` | design + tekst |
| 04 | Anoskopi og rektoskopi | `/undersokelse-av-endetarmen/` | `undersokelse-av-endetarmen.md` | design + tekst (omdøpt til ClickUps sti) |
| — | (ikke i ClickUp) | `/proktologi/` | `proktologi.md` | design + tekst |
| 05 | Hemoroider | `/hemoroider/` | `hemoroider.md` | skjelett, `[TEKST KOMMER]` |
| 06 | Analfissur | `/analfissur/` | `analfissur.md` | skjelett |
| 07 | Blod i avføringen | `/blod-i-avforingen/` | `blod-i-avforingen.md` | skjelett |
| 08 | Magesmerter | `/magesmerter/` | `magesmerter.md` | skjelett |
| 09 | IBS | `/irritabel-tarm/` | `irritabel-tarm.md` | skjelett |
| 10 | Refluks og halsbrann | `/refluks/` | `refluks.md` | skjelett |
| 11 | Overvekt og fedme | `/overvekt-og-fedme/` | `overvekt-og-fedme.md` | design + tekst |
| 12 | Priser | `/priser/` | `priser.md` | design + tekst |
| 13 | Om klinikken og behandlerne | `/om-klinikken/` | `om-klinikken.md` | design + tekst |
| 14 | Slik foregår det | `/slik-foregar-det/` | `slik-foregar-det.md` | skjelett |
| 15 | For henvisende leger | `/for-henvisende-leger/` | `for-henvisende-leger.md` | design + tekst |
| 16 | For forsikringsselskaper | `/for-forsikringsselskaper/` | `for-forsikringsselskaper.md` | design + tekst (`noindex: true` kan settes) |
| 17 | Kontakt og timebestilling | `/kontakt/` | `kontakt.md` | design + tekst |
| 18 | Personvernerklæring | `/personvern/` | `personvern.md` | design + tekst |
| — | (bookingen) | `/bestill/` | `bestill.md` | isolert rute, egen mal `layouts/bestill.njk` |

Spriket: designet har `/undersokelser/` og `/proktologi/`, som ClickUp ikke
har; ClickUp har sju sider designet ikke har (05–10 og 14) — de ligger nå som
ruteskjeletter og venter på tekstpakke og på designrunde 3. Alle 21 rutene
står som UTKAST og finnes bare i forhåndsvisning.

## Besluttet, og hvor det står i koden

| Beslutning | I koden |
|---|---|
| Bare GODKJENT-sider når produksjon | `eleventy.config.js` (preprocessor returnerer `false`), vakten `godkjent-status`, selvtestet |
| Null tredjepart, selvhostet skrift, tom hviteliste | `sikkerhet/policy.json` (CSP `default-src 'none'`), vaktene `eksterne-verter`, `sporing`, `lagring` |
| Tittelformat `Koloskopi på Straume \| Vagus Entero` | `layouts/base.njk` (`sidetittel`, suffiks fra `klinikk.kortnavn`) |
| Ordmerke i tekst, tom kvadratisk plass til venstre, tekstbasert favicon | `komponenter/header.njk` (`.merke-plass`), `src/bilder/favicon.svg`. Den tegnede logoen fra designrunde 2 ligger urørt i `merkevare/` som kandidat |
| `enteroklinikken.no` synlig i bunn; org.nr 938 387 127 | `src/_data/klinikk.json` (`domene`, `org_nr`), `komponenter/footer.njk` |
| Bunntekst etter ehandelsloven § 8 | `footer.njk` — adresse, e-post, mva-status, yrkestittel med land, tillatelse, tilsynsmyndighet rendres når `klinikk.json` har dem |
| «Ring oss» primær til bookingen er live; «Bestill time» primær etterpå, med varsellinje | `komponenter/knapper.njk` — tilstanden avledes av `klinikk.bestilling.url`; linjen er `ui.bestilling_apner` (tekst kommer) |
| Priser aldri i løpende tekst | vakten `priser-i-tekst`; prislisten har én kilde (`prisliste`-seksjonen), pristabellen rendres med caption og kolonnehoder |
| Lenker i tekst bare internt; brødtekst uten rå HTML; frontmatter uten kode | `verktoy/tekst.js` (filteret `tekst`), `eleventy.config.js` (markdown `html: false`, `---js` avvist), vakten `innebygd-kode` |
| Ingen innebygd kode, ingen ekstern last i noen form | vaktene `innebygd-kode`, `eksterne-verter`, `lenker` og `jsonld` leser HTML med ekte parser (`parse5`): attributter, `<meta content>`, `//`- og `\\`-adresser, entiteter, dupliserte attributter, innebygde blokker, SVG |
| Datafilene er kontrakt | `vakter/lib/datavalidering.js` — `klinikk.json` og `ui.json` valideres mot skjema i hvert bygg og i CI |
| Forsiden må være GODKJENT før noe publiseres | `eleventy.config.js` (`eleventy.before`), vakten `godkjent-status` |
| CI-forsyningskjede låst | `.github/workflows/ci.yml`: actions pinnet til commit-SHA, `permissions: contents: read`, `npm ci --ignore-scripts` |
| Egennavn i forbudslistene fanges også bøyd | `vakter/lib/felles.js` (`*`-endelse), se `docs/VAKTER.md` |
| Bookingen isolert, innholdssidene statiske | `layouts/bestill.njk`, monteringspunkt `#bestilling-portal`. Å laste portalen krever bevisst oppføring i `sikkerhet/policy.json` og `vakter/ordlister/eksterne-hvitliste.txt` |
| Ingen hemmeligheter i koden | alt i miljøvariabler (`PRODUKSJON`, `SITE_URL`); `docs/LANSERING.md` |
| WCAG: nettstedet testes mot 2.2 AA (superset av 2.1 AA) | `verktoy/a11y-test.mjs` (axe, alle sider, 0 brudd), Lighthouse-budsjett i `verktoy/lighthouserc.cjs` |

## Blokkert, og av hva

- **Rammeverk.** ClickUp sier Next.js (28.08); repoet er Eleventy med alt
  bevist. Trenger en eksplisitt beslutning før mer bygges.
- **Bookingportalen.** Integrasjonspartneren venter på API-dokumentasjon.
  Til da: `bestilling: null`, ingen «Bestill time», `/bestill/` viser telefon.
- **Klinikkfakta.** Adresse (leiekontrakt), telefon, e-post, fagansvarlig
  lege med HPR, tilsynsopplysninger, mva-status, priser, åpningstider — alt
  `null` i `klinikk.json` til det foreligger. Produksjonsbygget nekter å
  starte uten de lanseringskritiske.
- **Analyse og samtykke.** Ikke bygget. Nettstedet lagrer ingenting og laster
  ingenting eksternt, så det finnes ingenting å samtykke til i dag. Når
  analyse velges (databehandleravtale, EU-hosting), må CSP-en åpnes bevisst
  og en samtykkeløsning bygges der «avvis» er like lett som «godta».
- **Logo.** Klinikken leverer fil innen 1. november, ellers ordmerke.
- **Fedmetilbudet.** Siden finnes, men tilbudet er uavklart.
- **Forhåndsvisningene.** `Disallow: /` hindrer crawling, så noindex-signalet
  leses ikke; Basic-Auth (`PREVIEW_BRUKER`/`PREVIEW_PASSORD` i Netlify) er
  den reelle beskyttelsen og bør slås på nå. Alternativet står i
  `docs/LANSERING.md`.
- **Branch protection.** `main` må kreve `CI / bygg-og-vakter` — Netlify
  kjører ikke lenkesjekk, axe og Lighthouse selv.
- **Knapper uten mål på fagfolk-sidene.** «Skriv ut som A4» (henvisende
  leger), «Kontakt om avtale» og «Last ned som PDF» (forsikringsselskaper)
  finnes i designet uten mål — ikke bygget, står i sidenes `apne_punkter`.
- **Kart i «Finn fram».** Kart fra tredjepart er forbudt; klinikken må levere
  et eget, statisk kartbilde.

## Til designprosessen — avvik i designleveransen (02.09)

Kilden motsier seg selv noen steder; bygget følger artboardene og noterer
valget i `src/stiler/hoved.css`:

- Typografitokenene (`tokens/typografi.css`: `--tekst-5` 76 px) mot
  artboardenes faktiske størrelser (58 px for undersidenes H1) — tokenfil og
  type-skala bør harmoniseres.
- `readme.md` sier maks-bredde 70 rem *og* sidepadding 72 px; artboardene
  ignorerer maks-bredden (1296 px innhold). Bygget beholder 70 rem/48 px.
- `--farge-flate-markert` (nedtonet veikort «Vi tar ikke imot») er ikke
  definert i tokenfilen.
- Kort-bred-radius er 24 px på forsiden og 18 px på Undersøkelser; mobil
  seksjonspadding 48 px på forsiden og 40 px på undersidene. Bygget bruker
  undersidenes verdier.
- `.sporsmal` har 75ch i både design-CSS og artboard, mot readme-regelen
  65ch.
- Mobil-artboardet for Undersøkelser lar fedmekortet stå i rad med 142 px
  tekstbredde — trolig en forglemmelse; bygget stabler.
- Fontene mangler tegnet «↗» i latin-subsettet; pilen i «Bestill time» er
  derfor inline SVG.

## Til innholdsprosessen — funn fra revisjonen 02.09

Tekst er ikke kodesesjonens; dette er observasjoner, ikke endringer:

- `personvern.md`: punktet «Nettstedet» lover samtykkeløsning og
  «sporing uten samtykke»-forbehold som ikke finnes — nettstedet setter ingen
  informasjonskapsler og laster ingenting eksternt. Den eneste reelle
  persondatastrømmen (Netlifys tilgangslogger med IP-adresse, USA, 30 dager,
  jf. `docs/NETLIFY-BESLUTNING.md`) er ikke nevnt.
- Klinikkfakta står i tekst med plassholdere (adresse, telefon, e-post,
  org.nr, autorisasjonsnummer) i `personvern.md`, `om-klinikken.md`,
  `kontakt.md` og fagfolk-sidene. Når visningen fra `klinikk.json` er
  bygget, bør setningene peke dit i stedet.
- `meta_beskrivelse` er ordrett lik `ingress` på alle sider fra designet.
- `sidetittel` er ikke satt på noen side; formatet er «Koloskopi på
  Straume | Vagus Entero».
- Designets telefonknapp i «Ring oss»-kortet på `/kontakt/` viser
  telefonnummeret som knappetekst; bygget bruker «Ring oss».
- Designets samleside «For fagfolk» i toppmenyen ble ikke levert — de to
  fagfolk-sidene ligger i bunnteksten.
- `for-henvisende-leger.md`: designets merknad om utskriftsversjonen er
  utelatt fordi utskriftsversjonen ikke finnes.

## Endringer

- **02.09.2026 (revisjon)** — 45 agenter gjennomgikk paritet mot designfilen,
  kode, kontrakt, vakter og sikkerhet; 227 bekreftede funn rettet eller
  avgjort. Kode: prisliste-seksjonen rendres (tidligere aldri), byggkrasj ved
  første beløp fjernet, lenker/linjeskift i tekst, sidekolonne og
  hode-merknad, `aria-current` for seksjon, bunn-overskrift, `noreferrer`.
  Sikkerhet: frontmatter kan ikke være kode, markdown uten rå HTML,
  JSON-LD-escaping, vakt mot innebygd kode, eksterne-verter tetter
  `//`/meta/style/script/SVG, `PRODUKSJON` godtar bare `1`, `CI_SYNTETISK`
  ugyldig i Netlify, Basic-Auth ute av maldata, actions pinnet, `permissions`,
  `--ignore-scripts`, Cache-Control. Kontrakt: `klinikk.json`/`ui.json`
  håndheves, plassholdere stopper GODKJENT, prisregelen ser alle seksjoner,
  `rekkefolge` entydig, `bilder`/`ventetid`/`apningstider` reservert,
  `*`-endelse i ordlister, historikk-baseline i selvtestene, 111 selvtester.
  Innhold gjenopprettet ordrett fra designet (avsnitt, merknader, lenker,
  linjeskift, knappetekster på fagfolk-sidene, «Øygarden»). CSS-paritet mot
  artboardene (mobilrytme, prisblokk, pristabell, steg, faktastripe, hero).
  Fontsubsettet har nå midtprikk; pilen i «Bestill time» er inline SVG.
  Etter adversarial etterprøving: HTML-vaktene lest med ekte parser
  (`parse5`), alle JavaScript-motorer for frontmatter slått av, innholdssider
  bare som `src/innhold/*.md`, passthrough bare for kjente filtyper,
  markdown-lenker bare interne, produksjonsvakten sjekker disken mot
  manifestet. Andre runde: plassholderregelen er «alt i hakeparentes»,
  GODKJENT kan ikke lenke til UTKAST, prisblokk enten sidekolonne eller
  tabell, `SITE_URL` og `PREVIEW_*` valideres, `noindex: true` virker i
  produksjon, CSS-filnavnet er innholdshashet (immutable), HTML utenfor
  produksjon er `private`, og CI-ens syntetiske produksjonsbygg bygger nå
  tre godkjente fylltekst-sider så hele produksjonsstien testes i hver PR. Selvtestene sjekker nå meldingen, ikke bare at noe feilet; headere-vakten krever nøyaktig policy (ingen påhengte direktiver eller dupliserte linjer); klinikk-lansering-testen er uavhengig av den ekte klinikk.json.
- **02.09.2026** — Lighthouse i CI aggregerer per audit-median (to av tre
  kjøringer må bryte budsjettet); rapportene lastes opp som artefakt ved brudd.
- **02.09.2026** — Grensesnittavtalen tatt inn: `[TEKST KOMMER]` i kontrakten
  med produksjonsvakt; tittelsuffiks; ordmerke uten logo; org.nr; mva-felt;
  to bestillingstilstander; isolert `/bestill/`; `noindex` per side;
  JSON-LD-typene MedicalCondition og MedicalSignOrSymptom; vakt mot priser i
  tekst; ruten for anoskopi/rektoskopi omdøpt til ClickUps sti; sju
  ruteskjeletter; ajv oppdatert (0 sårbarheter i produksjonsavhengigheter).
- **28.08.2026** — Hele designleveransen (Utkast 08) bygget: forside og tolv
  undersider, ny palett og typografi, kontrakt med seksjonsblokker.
