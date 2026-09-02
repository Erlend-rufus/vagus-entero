# Nettside for Vagus Entero AS

Statisk nettsted (Eleventy) for Vagus Entero AS — privat mage-, tarm- og
endetarmsklinikk på Straume i Øygarden kommune. Bygget og driftet i henhold til
startbriefen av 24.08.2026 fra Elevate Marketing.

## Eierskap og overføringsforpliktelse

**Domene, kode, kontoer og innhold eies av Vagus Entero AS.**

Elevate Marketing (org.: Elevate Marketing v/ Erlend Bognøy) har *tilgang*, ikke
*eierskap*. Fordi Vagus Entero AS på opprettelsestidspunktet ennå ikke var
verifisert registrert i Enhetsregisteret, ligger følgende midlertidig hos
Elevate Marketing, med bindende forpliktelse om vederlagsfri overføring til
Vagus Entero AS så snart selskapet er registrert og senest på selskapets
forespørsel:

1. **Dette kodearkivet** (GitHub-repoet) med full historikk.
2. **Netlify-teamet/-kontoen** som drifter nettstedet, inkludert
   miljøvariabler og domenekonfigurasjon.
3. **Domenenavnet**, dersom det i mellomtiden er registrert med Elevate
   Marketing eller tredjepart som abonnent («bytte av abonnent» hos
   Norid-registraren gjennomføres da for Elevates regning).
4. **Alt innhold**: tekster, bilder, strukturerte data og designfiler.

Etter overføring beholder Elevate Marketing kun den tilgangen Vagus Entero AS
selv tildeler.

## Arbeidsdeling — hvem eier hva i dette repoet

- **All norsk pasienttekst** ligger utelukkende i `src/innhold/` og eies av
  Vagus Entero AS via innholdsprosessen (tekstproduksjon → Erlend Bognøy →
  skriftlig godkjenning av klinikkens fagansvarlige lege). Utviklere skriver
  aldri norsk pasienttekst — heller ikke midlertidig.
- **Grensesnittstrenger** («Meny», «Lukk» osv.) finnes kun i
  `src/_data/ui.json`. Nye strenger krever godkjenning. Ingen norske strenger
  hardkodes i maler, komponenter eller JS — CI håndhever dette.
- **Fakta om klinikken** (org.nr, adresse, telefon, e-post, lege, tilsyn,
  timebestilling) finnes kun i `src/_data/klinikk.json`, validert mot
  `skjema/klinikk.schema.json` i hvert bygg. Ukjente verdier er `null`, og
  bygget utelater feltet — det gjettes aldri. En knapp som peker på et fakta
  som mangler, rendres ikke i det hele tatt. Priser står bare i
  prisliste-seksjoner i innholdsfilene, aldri i løpende tekst.
- **Merkevarefilene** (logopakken fra designrunde 2) ligger urørt i
  `merkevare/` og følger med nettstedet til klinikken. Nettstedet selv bruker
  ordmerke i tekst, en tekstbasert favicon og strektegningene i `src/bilder/`
  (beslutning 02.09.2026).

Se `docs/HANDOFF.md` for grensesnittet mot tekst- og designprosessen
(rutekart, innholdsformat, hva som er blokkert), `docs/INNHOLDSKONTRAKT.md`
for leveranseformatet og `docs/VAKTER.md` for hvordan CI-vaktene utvides.

## Kom i gang

```bash
nvm use            # Node-versjon fra .nvmrc
npm ci             # installer låste avhengigheter
npm run bygg       # validering → Eleventy → etterbyggvakter
npm run vakter     # alle CI-vakter mot kildekode og bygde utdata
npm test           # vaktenes selvtester
```

Bygget feiler med vilje høylytt: manglende obligatorisk innhold, brudd på
innholdskontrakten eller treff i forbudslistene stopper alt. Det er en
egenskap, ikke en feil — se `docs/VAKTER.md`.

## Miljøer

Alt styres av én variabel, `PRODUKSJON` (`1` = produksjonsbygg; enhver annen
verdi stopper bygget), pluss Netlifys `CONTEXT`. Uten `PRODUKSJON`: alle sider
bygges (også utkast, med banner), alt er noindexet, og Basic-Auth-beskyttet
når `PREVIEW_BRUKER`/`PREVIEW_PASSORD` er satt i Netlify (valgfritt, anbefalt
— se `docs/LANSERING.md`). Previews kan aldri indekseres, uansett
variabelverdier. Med `PRODUKSJON=1` bygges bare GODKJENT-sider, og bare når
forsiden er en av dem.
