---
sidetype: "henviser"
url: "/for-henvisende-leger/"
malgruppe: "henviser"
tittel: "For henvisende leger"
menytittel: "For henvisende leger"
meta_beskrivelse: "Praktiske opplysninger for fastleger og annet helsepersonell som skal henvise pasienter til Vagus Entero Klinikken."
ingress: "Praktiske opplysninger for fastleger og annet helsepersonell som skal henvise pasienter til Vagus Entero Klinikken."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: null
interne_lenker_ut:
  - "/priser/"
apne_punkter:
  - "Henvisningskanal, svartid på epikrise og lege-til-lege-nummer i faktalisten, og «Kanal» i «Slik henviser du», utelates til henvisning.kanal, henvisning.epikrise_svartid og henvisning.lege_til_lege finnes i klinikk.json. Lege-til-lege-nummeret er valgfritt"
  - "Seksjonen «Hva klinikken tar imot» har plassholdere som klinikken må fylle ut"
  - "Avsnittene om utstyr og kvalitetsregistre i «Faglig profil og utstyr» utelates til utstyr og kvalitet.kvalitetsregistre finnes i klinikk.json"
  - "«Prøvesvar» i «Hva pasienten og du får tilbake» utelates til laboratorium.navn og laboratorium.svartid finnes i klinikk.json"
  - "Klinikken har én lege. Nye behandlere føres opp på siden når de er ansatt"
  - "Designets knapp «Skriv ut som A4» med merknaden om utskriftsversjonen er ikke bygget: en JS-fri utskriftsvei (utskrifts-CSS eller egen A4-side) må besluttes først"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt. Beløpene står som null og utelates fra siden"
  - "Leveransens brødsmulesti går via en «For fagfolk»-side som ikke ble levert. Siden er derfor lagt rett under forsiden, og lenken ligger i bunnteksten i stedet for i hovedmenyen"
i_navigasjon: false
i_bunntekst: true
rekkefolge: 20
illustrasjon: "gastroskopi"
hode_knapper:
  - tekst: "Ring lege-til-lege"
    handling: "telefon"
    stil: "sekundaer"
fakta:
  - term: "Henvisningskanal"
    verdi: "{klinikk.henvisning.kanal}"
    krever: ["henvisning.kanal"]
  - term: "Epikrise"
    verdi: "{klinikk.henvisning.epikrise_svartid}"
    krever: ["henvisning.epikrise_svartid"]
  - term: "Lege-til-lege"
    verdi: "{klinikk.henvisning.lege_til_lege}"
    krever: ["henvisning.lege_til_lege"]
  - term: "Driftsavtale"
    verdi: "Ingen offentlig"
seksjoner:
  - type: "praktisk"
    tittel: "Slik henviser du"
    punkter:
      - tittel: "Kanal"
        tekst: "{klinikk.henvisning.kanal}"
        krever: ["henvisning.kanal"]
      - tittel: "Adresse"
        tekst: "Vagus Entero AS\n{klinikk.adresse.gate}\n{klinikk.adresse.postnummer} {klinikk.adresse.poststed}"
      - tittel: "Hva henvisningen bør inneholde"
        tekst: "Aktuell problemstilling, varighet, tidligere utredning, faste medisiner (særlig blodfortynnende), kjente sykdommer og relevante prøvesvar."
    merknad: "Pasienten trenger ikke henvisning for å bestille time hos oss. En henvisning gir likevel legen nyttig sykehistorie, og pasienten kan legge den ved bestillingen."
  - type: "veier"
    tittel: "Hva klinikken tar imot"
    flate: "sand"
    veier:
      - tittel: "Vi tar imot"
        avsnitt:
          - "Utredning av dyspepsi, refluks, endret avføringsmønster, blod i avføringen, jernmangelanemi til utredning, magesmerter og endetarmsplager."
        liten: "Gastroskopi, koloskopi, anoskopi, rektoskopi og små proktologiske inngrep."
      - tittel: "Vi tar ikke imot"
        avsnitt:
          - "Øyeblikkelig hjelp, akutte blødninger, pasienter som trenger innleggelse eller anestesiberedskap, og barn."
          - tekst: "{klinikk.henvisning.ovrige_avgrensninger}"
            krever: ["henvisning.ovrige_avgrensninger"]
        liten: "Pasienter med behov for øyeblikkelig hjelp skal til legevakt eller sykehus."
  - type: "tekst"
    tittel: "Faglig profil og utstyr"
    avsnitt:
      - "Fagansvarlig lege: {klinikk.lege.navn}, {klinikk.lege.spesialitet} (HPR {klinikk.lege.hpr_nummer})."
      - tekst: "{klinikk.utstyr}"
        krever: ["utstyr"]
      - tekst: "{klinikk.kvalitet.kvalitetsregistre}"
        krever: ["kvalitet.kvalitetsregistre"]
    merknad: "Klinikken oppgir ingen tall for volum, ventetid eller kvalitet før de er dokumentert i egen drift."
  - type: "praktisk"
    tittel: "Hva pasienten og du får tilbake"
    flate: "sand"
    punkter:
      - tittel: "Epikrise"
        tekst: "Du får epikrise etter undersøkelsen, forutsatt pasientens samtykke."
      - tittel: "Prøvesvar"
        tekst: "Vevsprøver analyseres ved {klinikk.laboratorium.navn}. Svartid {klinikk.laboratorium.svartid}."
        krever: ["laboratorium.navn", "laboratorium.svartid"]
      - tittel: "Videre oppfølging"
        tekst: "Legen avtaler kontroll med pasienten der det er indisert, og angir i epikrisen hva som overlates til fastlegen."
  - type: "pris"
    tittel: "Priser du kan oppgi til pasienten"
    avsnitt:
      - "Klinikken har ingen offentlig driftsavtale. Pasienten betaler selv, eller bruker behandlingsforsikring. Utgiftene teller ikke mot egenandelstaket."
      - "Fullstendig prisliste ligger på [priser og betaling](/priser/)."
    knapper:
      - tekst: "Ring lege-til-lege"
        handling: "telefon"
        stil: "invers"
      - tekst: "Se hele prislisten"
        handling: "intern"
        url: "/priser/"
        stil: "sekundaer"
    priser:
      - navn: "Gastroskopi"
        belop_nok: null
      - navn: "Koloskopi"
        belop_nok: null
      - navn: "Anoskopi og rektoskopi"
        belop_nok: null
---
