# Lanseringssekvensen — ikke én dag, men en rekkefølge

Målet: lansert og indeksert **senest medio november 2026**. Indeksering tar
tid (robots.txt caches i inntil ~24 timer, opptak i indeksen tar dager), så
selve flippen skal skje **1–2 uker før** fristen.

Frem til flippen er alt automatisk uindekserbart: alle bygg uten `PRODUKSJON`
er noindexet (header + meta) og `robots.txt` sier `Disallow: /`. Merk at
`Disallow` hindrer crawling, ikke at en URL noen lenker til kan dukke opp som
ren adresse i søk — det er noindex-headeren som hindrer indeksering, og den
leses bare av en crawler som får hente siden. Basic-Auth er valgfri
(besluttet 24.08.2026): settes `PREVIEW_BRUKER`/`PREVIEW_PASSORD` i Netlify,
beskyttes alt utenfor produksjon automatisk — **anbefales slått på senest når
pasienttekst i UTKAST begynner å flyte inn**, siden noindex hindrer
indeksering, ikke tilgang. Vil dere heller la crawlere lese noindex-signalet,
er beslutningen å fjerne `Disallow` fra `verktoy/headere.js` for
forhåndsvisninger — men da er Basic-Auth ikke lenger valgfri.

## Forutsetninger som må være grønne FØR flippen

- [ ] Alle sider som skal ut har `status: GODKJENT` med signatur og dato
- [ ] `src/_data/klinikk.json` har juridisk navn, org.nr, adresse, telefon og
      e-post (bygget nekter å produsere produksjonsbygg uten — ehandelsloven § 8)
- [ ] `src/_data/ui.json` har ingen `[TEKST KOMMER]` igjen (`bestilling_apner`,
      `apner_nytt_vindu`) — vakten `tekst-kommer` stopper produksjonsbygget ellers
- [ ] `bestilling.merknad` er skrevet når `bestilling.url` settes (setningen
      om hvor brukeren sendes og BankID)
- [ ] Prissiden er GODKJENT med utfylt prisliste (prisopplysningsforskriften § 10)
- [ ] Siden `/ikke-funnet/` (404) er GODKJENT — ellers viser Netlify sin
      engelske standardside for ukjente adresser
- [ ] Universell utforming-nivået bekreftet med Erlend (WCAG 2.2 AA er målet;
      lovkravet for private er per aug. 2026 WCAG 2.0 AA)
- [ ] Netlify-DPA-beslutningen signert (se `docs/NETLIFY-BESLUTNING.md`)
- [ ] CI helgrønn på main
- [ ] **Branch protection på `main`** med `CI / bygg-og-vakter` som påkrevd
      sjekk. Netlifys eget bygg kjører kontrakten og alle vaktene
      (`npm run bygg`), men ikke selvtestene, ankersjekken (lychee), axe
      eller Lighthouse — de gater deploy bare gjennom GitHub, og bare hvis
      ingenting kan merges rødt
- [ ] «Force HTTPS» slått på i Netlify (Domain management → HTTPS)
- [ ] Den manuelle tilgjengelighetslisten gjennomgått (`docs/TILGJENGELIGHET.md`)

## Dager i forveien (alt er fortsatt noindexet)

1. Domene registrert og DNS pekt til Netlify.
2. TLS-sertifikat provisjonert og verifisert i Netlify.
3. `SITE_URL` satt i Netlify-dashbordet (production-konteksten), nøyaktig
   `https://www.<domene>.no` — https, bare vertsnavn, ingen skråstrek til
   slutt. Uten den, eller med feil form, feiler produksjonsbygget med vilje.
4. `SECRETS_SCAN_OMIT_KEYS` står i `netlify.toml`: forhåndsvisningspassordet
   skrives med vilje til `_headers`, og Netlifys hemmelighetsskann skal ikke
   stoppe bygget for det. `PREVIEW_BRUKER`/`PREVIEW_PASSORD` kan ikke
   inneholde kolon eller mellomrom.

## Selve flippen (én gjennomgått økt)

1. Sett `PRODUKSJON=1` i Netlify-dashbordet, **scopet til
   production-konteksten**. Verdien må være nøyaktig `1` — `0`, `false` eller
   `nei` stopper bygget i stedet for å bli tolket. Dobbeltsjekk scopingen —
   previews skal aldri ha den (bygget tvinger uansett noindex utenfor
   production-konteksten). `CI_SYNTETISK` skal aldri finnes i Netlify.
2. Er passordvariablene i bruk: la dem stå — produksjonsbygget utelater
   Basic-Auth-linjen av seg selv, previews forblir beskyttet.
3. **Trigg et deploy manuelt.** Endring av miljøvariabler bygger ikke på nytt
   av seg selv.
4. Verifiser live med curl mot produksjonsdomenet:
   - `curl -sI https://<domene>/ | grep -i x-robots` → skal være TOMT
   - `curl -sI https://<domene>/ | grep -i content-security-policy` → CSP-en fra
     `sikkerhet/policy.json`
   - `curl -s https://<domene>/robots.txt` → `Allow: /` + sitemap-lenke
   - `curl -s https://<domene>/sitemap.xml` → kun GODKJENT-sider
5. Verifiser at en preview-URL fortsatt svarer med noindex (og krever
   Basic-Auth hvis passordvariablene er i bruk).

## Når bookingportalen skrus på (uavhengig av lanseringsdagen)

`bestilling.url` i `src/_data/klinikk.json` gjør bygget **rødt** til tre ting
er gjort samtidig — det er meningen, hver av dem er en beslutning:

1. Portalens vertsnavn føres opp i `vakter/ordlister/eksterne-hvitliste.txt`
   (vakten `eksterne-verter` stopper ellers hver side med «Bestill time»).
2. Skal leverandøren navngis i `bestilling.merknad`, føres den godkjente
   setningen opp i `vakter/ordlister/unntak/leverandorer.txt`.
3. `bestilling.merknad` skrives (setningen om hvor brukeren sendes og
   BankID) — bygget krever den sammen med url.

For en ren lenke i nytt vindu trenger `sikkerhet/policy.json` ingen endring.
Skal portalen **bygges inn** på `/bestill/` (skript eller ramme), må
`script-src`, `connect-src` og `frame-src` åpnes der — en egen
personvernbeslutning, jf. `docs/NETLIFY-BESLUTNING.md`.

## Når analyseverktøyet skal på (forberedt, ikke aktivert)

Personvernerklæringen sier fra 24.09.2026 at nettstedet bruker Plausible
Analytics. Skriptet er **ikke** installert. Rekkefølgen:

1. Kontoen opprettes i klinikkens navn, ikke Elevates (åpent punkt på
   `personvern.md`).
2. Innlasting av skript bryter to faste regler: nettstedet har ingen
   JavaScript, og det refererer ingenting utenfor eget domene. Regelen
   oppheves bare med en beslutning fra Erlend. Beslutningen skal også si om
   skriptet lastes fra Plausibles vert, eller via en proxy på eget domene
   gjennom Netlify-omskriving. Med proxy trengs verken ny vert i
   hvitelisten eller ny vert i CSP.
3. Lastes skriptet fra Plausibles vert:
   - vertsnavnet føres opp i `vakter/ordlister/eksterne-hvitliste.txt`;
   - `sikkerhet/policy.json` får verten i `script-src` og `connect-src`,
     som i dag står som `'none'` og `'self'`. Vakten `headere` holder
     `_headers` og policyen i takt.
4. Vakten `innebygd-kode` stopper hver `<script>` utenfor JSON-LD. Skriptet
   må derfor legges inn som en bevisst endring i vakten, med selvtest, og
   ikke som et unntak i en mal.
5. Vakten `sporing` må fortsatt være grønn. Plausible setter ingen
   informasjonskapsler og krever ikke samtykke, og det er grunnen til valget.

Til alt dette er gjort, er erklæringen riktig om verktøyet, men nettstedet
måler ingenting.

## Etter flippen

- [ ] Send inn sitemap (f.eks. via Search Console) — eget sjekkpunkt,
      krever egen vurdering av kontooppsett
- [ ] Overvåk at forsiden dukker opp i indeksen i løpet av få dager
- [ ] Vurder HSTS `preload` først når driften har vist seg stabil
      (semi-irreversibel beslutning — står som åpent punkt)

## Hvis noe går galt

Sett `PRODUKSJON` tilbake (fjern variabelen), trigg deploy manuelt, og
nettstedet er igjen noindexet og lukket. Det er hele poenget med at én
variabel styrer gaten.
