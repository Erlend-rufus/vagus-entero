---
sidetype: "pris"
url: "/priser/"
malgruppe: "selvbetalende"
tittel: "Priser og betaling"
menytittel: "Priser"
meta_beskrivelse: "Klinikken har ingen offentlig driftsavtale. Du betaler selv, eller behandlingsforsikring dekker undersøkelsen."
ingress: "Klinikken har ingen offentlig driftsavtale. Du betaler selv, eller behandlingsforsikring dekker undersøkelsen."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: null
interne_lenker_ut: []
apne_punkter:
  - "Prislisten mangler beløp og hva som er inkludert (omfang: null). Forhåndsvisningen viser én samlet markør til de finnes"
  - "«Slik betaler du», «Avbestilling» og «Kvittering» utelates til betaling.betalingsmater, betaling.avbestilling og betaling.kvittering finnes i klinikk.json"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt. Beløpene står som null og utelates fra siden"
i_navigasjon: true
i_bunntekst: false
rekkefolge: 2
illustrasjon: "overvekt"
hode_knapper:
  - tekst: "Bestill time"
    handling: "bestilling"
  - tekst: "Ring oss"
    handling: "telefon"
    stil: "sekundaer"
seksjoner:
  - type: "prisliste"
    tittel: "Prisliste"
    under: "Fullstendig prisliste med totalpriser publiseres på denne siden før klinikken åpner, med tydelig beskjed om hva som er inkludert."
    tabellmerknad: "Alle beløp er totalpriser inkludert merverdiavgift."
    kolonner:
      tjeneste: "Undersøkelse eller behandling"
      omfang: "Inkludert"
      pris: "Pris"
    priser:
      - navn: "Kikkertundersøkelse av spiserør og magesekk (gastroskopi)"
        omfang: null
        belop_nok: null
      - navn: "Kikkertundersøkelse av tykktarmen (koloskopi)"
        omfang: null
        belop_nok: null
      - navn: "Gastroskopi og koloskopi samme dag"
        omfang: null
        belop_nok: null
      - navn: "Undersøkelse av endetarmen (anoskopi og rektoskopi)"
        omfang: null
        belop_nok: null
      - navn: "Små inngrep ved endetarmsplager (proktologi)"
        omfang: null
        belop_nok: null
      - navn: "Vevsprøve og analyse"
        omfang: null
        belop_nok: null
  - type: "praktisk"
    tittel: "Betaling, forsikring og avbestilling"
    flate: "sand"
    punkter:
      - tittel: "Slik betaler du"
        tekst: "{klinikk.betaling.betalingsmater} Du betaler i klinikken etter timen."
        krever: ["betaling.betalingsmater"]
      - tittel: "Behandlingsforsikring"
        tekst: "Har du behandlingsforsikring, kan undersøkelsen være dekket. Sjekk vilkårene med forsikringsselskapet ditt før du bestiller."
      - tittel: "Avbestilling"
        tekst: "{klinikk.betaling.avbestilling}"
        krever: ["betaling.avbestilling"]
      - tittel: "Ingen driftsavtale"
        tekst: "Klinikken har ingen avtale med Helfo. Utgifter hos oss teller ikke mot egenandelstaket, og du får ikke frikort-refusjon."
      - tittel: "Henvisning"
        tekst: "Henvisning fra fastlege endrer ikke prisen hos oss. Du kan bestille time med eller uten henvisning."
      - tittel: "Kvittering"
        tekst: "{klinikk.betaling.kvittering}"
        krever: ["betaling.kvittering"]
  - type: "pris"
    tittel: "Er du usikker på hva du trenger?"
    avsnitt:
      - "Ring oss, eller la fastlegen din henvise deg. Vi går gjennom plagene dine og hvilken undersøkelse som er aktuell, før du bestiller."
    sidekolonne:
      etikett: "Lovpålagt prisopplysning"
      avsnitt:
        - "Prislisten over følger prisopplysningsforskriften § 10: totalpriser inkludert merverdiavgift, og hva som er inkludert i hver pris. Priser oppgis ikke i løpende tekst andre steder på nettstedet."
    knapper:
      - tekst: "Bestill time"
        handling: "bestilling"
        stil: "invers"
      - tekst: "Ring oss"
        handling: "telefon"
        stil: "sekundaer"
---
