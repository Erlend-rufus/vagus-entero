# Lanseringssekvensen — ikke én dag, men en rekkefølge

Målet: lansert og indeksert **senest medio november 2026**. Indeksering tar
tid (robots.txt caches i inntil ~24 timer, opptak i indeksen tar dager), så
selve flippen skal skje **1–2 uker før** fristen.

Frem til flippen er alt automatisk trygt: alle bygg uten `PRODUKSJON` er
noindexet, `robots.txt` sier `Disallow: /`, og alt er bak Basic-Auth.

## Forutsetninger som må være grønne FØR flippen

- [ ] Alle sider som skal ut har `status: GODKJENT` med signatur og dato
- [ ] `src/_data/klinikk.json` har org.nr, adresse, telefon og e-post
      (bygget nekter å produsere produksjonsbygg uten — ehandelsloven § 9)
- [ ] Prissiden er GODKJENT med utfylt prisliste (prisopplysningsforskriften § 10)
- [ ] Universell utforming-nivået bekreftet med Erlend (WCAG 2.2 AA er målet;
      lovkravet for private er per aug. 2026 WCAG 2.0 AA)
- [ ] Netlify-DPA-beslutningen signert (se `docs/NETLIFY-BESLUTNING.md`)
- [ ] CI helgrønn på main

## Dager i forveien (innholdet er fortsatt bak passord)

1. Domene registrert og DNS pekt til Netlify.
2. TLS-sertifikat provisjonert og verifisert i Netlify.
3. `SITE_URL` satt i Netlify-dashbordet (production-konteksten), f.eks.
   `https://www.<domene>.no` — uten den feiler produksjonsbygget med vilje.

## Selve flippen (én gjennomgått økt)

1. Sett `PRODUKSJON=1` i Netlify-dashbordet, **scopet til
   production-konteksten**. Dobbeltsjekk scopingen — previews skal aldri ha
   den (bygget tvinger uansett noindex utenfor production-konteksten).
2. Skru av Netlifys passordbeskyttelse for produksjon.
   (`PREVIEW_BRUKER`/`PREVIEW_PASSORD` beholdes — previews forblir beskyttet.)
3. **Trigg et deploy manuelt.** Endring av miljøvariabler bygger ikke på nytt
   av seg selv.
4. Verifiser live med curl mot produksjonsdomenet:
   - `curl -sI https://<domene>/ | grep -i x-robots` → skal være TOMT
   - `curl -sI https://<domene>/ | grep -i content-security-policy` → CSP-en fra
     `sikkerhet/policy.json`
   - `curl -s https://<domene>/robots.txt` → `Allow: /` + sitemap-lenke
   - `curl -s https://<domene>/sitemap.xml` → kun GODKJENT-sider
5. Verifiser at en preview-URL fortsatt krever Basic-Auth og svarer med
   noindex.

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
