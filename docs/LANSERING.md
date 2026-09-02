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
- [ ] `src/_data/klinikk.json` har org.nr, adresse, telefon og e-post
      (bygget nekter å produsere produksjonsbygg uten — ehandelsloven § 9)
- [ ] Prissiden er GODKJENT med utfylt prisliste (prisopplysningsforskriften § 10)
- [ ] Universell utforming-nivået bekreftet med Erlend (WCAG 2.2 AA er målet;
      lovkravet for private er per aug. 2026 WCAG 2.0 AA)
- [ ] Netlify-DPA-beslutningen signert (se `docs/NETLIFY-BESLUTNING.md`)
- [ ] CI helgrønn på main
- [ ] **Branch protection på `main`** med `CI / bygg-og-vakter` som påkrevd
      sjekk. Netlifys eget bygg kjører bare kontrakt og etterbyggvakter
      (`npm run bygg`); lenkesjekk, axe og Lighthouse gater deploy bare
      gjennom GitHub, og bare hvis ingenting kan merges rødt
- [ ] «Force HTTPS» slått på i Netlify (Domain management → HTTPS)
- [ ] Den manuelle tilgjengelighetslisten gjennomgått (`docs/TILGJENGELIGHET.md`)

## Dager i forveien (alt er fortsatt noindexet)

1. Domene registrert og DNS pekt til Netlify.
2. TLS-sertifikat provisjonert og verifisert i Netlify.
3. `SITE_URL` satt i Netlify-dashbordet (production-konteksten), f.eks.
   `https://www.<domene>.no` — uten den feiler produksjonsbygget med vilje.

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
