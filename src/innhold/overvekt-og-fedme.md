---
sidetype: "behandling"
url: "/overvekt-og-fedme/"
malgruppe: "selvbetalende"
tittel: "Medisinsk utredning og behandling av overvekt og fedme"
menytittel: "Overvekt og fedme"
meta_beskrivelse: "Overvekt er en medisinsk tilstand som utredes og behandles av lege. Utredningen kartlegger årsaker, andre sykdommer og hva som er aktuell behandling for …"
ingress: "Overvekt er en medisinsk tilstand som utredes og behandles av lege. Utredningen kartlegger årsaker, andre sykdommer og hva som er aktuell behandling for deg."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: "MedicalProcedure"
interne_lenker_ut:
  - "/priser/"
apne_punkter:
  - "Setningen om hvor bestillingen sendes navngir pasientportalen — navnet står ikke i repoet. Bestemmes av klinikken og settes i klinikk.json (bestilling.merknad) sammen med unntaket i ordlisten"
  - "Seksjonen «Hva utredningen er» har plassholdere som klinikken må fylle ut"
  - "Seksjonen «Slik foregår det» har plassholdere som klinikken må fylle ut"
  - "Seksjonen «Spørsmål og svar» har plassholdere som klinikken må fylle ut"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt — beløpene står som null og utelates fra siden"
i_navigasjon: false
i_bunntekst: false
rekkefolge: 14
overordnet: "/undersokelser/"
illustrasjon: "overvekt"
hode_knapper:
  - tekst: "Bestill time"
    handling: "bestilling"
  - tekst: "Ring oss"
    handling: "telefon"
    stil: "sekundaer"
seksjoner:
  - type: "tekst"
    tittel: "Hva utredningen er"
    avsnitt:
      - "Overvekt og fedme henger sammen med resten av kroppen. Utredningen hos oss er medisinsk: legen går gjennom sykehistorien din, undersøker deg, og vurderer om plagene dine har sammenheng med fordøyelsen, stoffskiftet, medisiner du bruker, eller andre tilstander."
      - "Behandlingen avtales etter utredningen, og følger nasjonale faglige retningslinjer. Hva som er aktuelt for deg avhenger av funnene. [PLASSHOLDER: hvilke behandlingsformer klinikken tilbyr — faglig godkjennes før publisering.]"
    merknad: "Klinikken tilbyr ikke slankekurer, kosttilskudd, dietter eller kosmetiske inngrep, og gir ingen løfter om vekttap."
  - type: "steg"
    tittel: "Slik foregår det"
    flate: "sand"
    steg:
      - tittel: "Første konsultasjon"
        tekst: "Sykehistorie, undersøkelse og blodprøver. Legen forklarer hva som skal utredes videre."
      - tittel: "Utredning"
        tekst: "[PLASSHOLDER: prøver og undersøkelser som inngår.] Funnene gjennomgås med deg."
      - tittel: "Behandling og oppfølging"
        tekst: "Dere avtaler et opplegg, og hvor ofte du skal til kontroll. [PLASSHOLDER: oppfølgingsintervall.]"
  - type: "sporsmal"
    tittel: "Spørsmål og svar"
    under: "Svarene under er utkast. De skal godkjennes av fagansvarlig lege før publisering."
    sporsmal:
      - sporsmal: "Trenger jeg henvisning?"
        svar: "Nei. Du kan bestille time selv. Fastlegen din kan også henvise deg, og en henvisning gir legen nyttig informasjon om sykehistorien din."
      - sporsmal: "Hva må jeg si fra om på forhånd?"
        svar: "Si fra om faste medisiner, kjente sykdommer, graviditet og tidligere behandling for overvekt. [PLASSHOLDER: klinikkens rutine.]"
      - sporsmal: "Får fastlegen min beskjed?"
        svar: "Vi sender epikrise til fastlegen din hvis du samtykker til det. [PLASSHOLDER: rutine og svartid.]"
      - sporsmal: "Hva koster utredningen?"
        svar: "Prisene står i [prislisten](/priser/). Klinikken har ingen offentlig driftsavtale, så du betaler selv eller bruker behandlingsforsikring."
      - sporsmal: "Kan behandlingen kombineres med undersøkelse av mage og tarm?"
        svar: "Legen vurderer om plagene dine tilsier undersøkelse av mage eller tarm i tillegg. Det avtales i så fall som egen time."
  - type: "pris"
    tittel: "Pris og betaling"
    avsnitt:
      - "Klinikken har ingen offentlig driftsavtale. Du betaler selv, eller behandlingsforsikring dekker undersøkelsen — sjekk vilkårene med forsikringsselskapet ditt før du bestiller."
      - "Fullstendig prisliste publiseres før åpning."
    knapper:
      - tekst: "Bestill time"
        handling: "bestilling"
        stil: "invers"
      - tekst: "Priser og betaling"
        handling: "intern"
        url: "/priser/"
        stil: "sekundaer"
    priser:
      - navn: "Første konsultasjon"
        belop_nok: null
      - navn: "Kontroll"
        belop_nok: null
      - navn: "Blodprøver og analyse"
        belop_nok: null
---
