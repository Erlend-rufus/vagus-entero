# Hosting-beslutning: Netlify — dokumentert aksept

Besluttet av Erlend Bognøy (Elevate Marketing) 24.08.2026, på vegne av
Vagus Entero AS. Dette dokumentet er grunnlaget klinikken signerer på, og
skal gjennomgås med klinikken før lansering. `[BEKREFT: klinikkens
signatur før lansering]`

## Hva som er valgt

- **Netlify, Pro-nivå ($20/mnd).** Grunner: gratisnivåets harde
  kredittgrense kan pause nettstedet (uakseptabelt for en klinikk i drift),
  passordbeskyttelse og Basic-Auth via `_headers` krever Pro.
- GitHub-repoet er koblet til Netlify; produksjonsbranch `main`.
- Ingen Netlify-tilleggsfunksjoner som behandler persondata: ikke skjemaer,
  ikke statistikk, ikke identitetsløsning. Kun statisk filutlevering.

## Databehandleravtale og overføringsgrunnlag (verifisert 24.08.2026)

- Netlifys standard-DPA er inkorporert i vilkårene:
  netlify.com/pdf/netlify-dpa.pdf (sist oppdatert 09.06.2026).
- Netlify, Inc. er sertifisert under EU-US Data Privacy Framework
  (+ UK Extension og Swiss-US DPF) — verifiserbart på
  dataprivacyframework.gov. Standard kontraktsklausuler (SCC) gjelder som
  reserve hvis DPF faller.
- DPF-status: rammeverket står per aug. 2026, men er under press
  (verserende ankesak C-703/25 P; EDPB har bedt Kommisjonen vurdere
  konsekvensene av svekket amerikansk tilsynsuavhengighet). Arkitekturen er
  derfor bygget som om DPF kan falle: nettstedet selv skaper ingen
  dataoverføringer.

## Det som aksepteres — beskrevet ærlig

Netlify behandler backend og logger på amerikansk infrastruktur (AWS,
us-east). Access-logger med IP-adresser lagres i 30 dager. Det finnes ingen
EU-avgrenset databehandling på selvbetjente plannivåer.

**Den reelle risikoen skal navngis presist:** en access-logg-linje kobler
IP-adresse med besøkt URL-sti. På dette nettstedet kan URL-stien antyde
hvilken tilstand den besøkende er opptatt av — samme kobling som gjorde at
Datatilsynet i vedtaket mot nhi.no (10.06.2025) la til grunn at besøksdata
på helsesider kan utgjøre særlige kategorier av personopplysninger etter
GDPR art. 9. Det er denne koblingen, i 30 dager på amerikansk
infrastruktur under DPF/SCC-grunnlag, som aksepteres ved valget av Netlify.

Avbøtende tiltak som ER bygget inn:

- Nettstedet lagrer ingenting i brukerutstyr og laster ingenting fra
  tredjepart — access-loggene er eneste persondatastrøm overhodet.
- `Referrer-Policy: no-referrer` hindrer at diagnoseantydende URL-er lekker
  videre til andre nettsteder.
- CSP med `default-src 'none'` gjør tredjepartssporing teknisk umulig i
  nettleseren, også ved fremtidige feilgrep.
- Ingen analyse-/statistikkverktøy uten eget vedtak, samtykkevurdering
  etter ekomloven § 3-15 og databehandleravtale.

## Eierskap

Netlify-teamet opprettes slik at Vagus Entero AS kan overta det. Elevate
Marketing har tilgang, ikke eierskap — se README-ens
overføringsforpliktelse.

## Regulatorisk faktagrunnlag (kilder verifisert 24.08.2026)

- Ekomloven § 3-15 (i kraft 01.01.2025): samtykkekrav for all lagring i
  brukerutstyr; et nettsted som ikke lagrer noe, utløser ikke kravet.
- Datatilsynets vedtak mot Norsk helseinformatikk AS 10.06.2025:
  irettesettelse etter GDPR art. 58(2)(b) for sporingsverktøy på
  helsenettsted; brudd på art. 6 og 9. Del av tilsyn med seks nettsteder;
  strengere reaksjoner varslet.
- Prisopplysningsforskriften § 10: oppdatert prisliste skal fremgå av
  hjemmesiden når virksomheten har en.
- Helsepersonelloven § 13: markedsføring av helse- og omsorgstjenester og
  av virksomheten skal være forsvarlig, nøktern og saklig.
- Forskrift om universell utforming av IKT (FOR-2013-06-21-732): WCAG 2.0
  AA er lovkravet for private per aug. 2026; EAA er ikke gjennomført i
  norsk rett ennå. Nettstedet sikter mot WCAG 2.2 AA — over lovkravet.
