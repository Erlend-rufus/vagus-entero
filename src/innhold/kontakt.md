---
sidetype: "statisk"
url: "/kontakt/"
malgruppe: "selvbetalende"
tittel: "Kontakt og bestill time"
sidetittel: "Kontakt og bestill time på Straume"
menytittel: "Kontakt"
meta_beskrivelse: "Klinikken er privat, og du kan bestille time selv. Fastlegen din kan også henvise deg til oss."
ingress: "Klinikken er privat, og du kan bestille time selv. Fastlegen din kan også henvise deg til oss."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: null
interne_lenker_ut:
  - "/for-henvisende-leger/"
apne_punkter:
  - "Linjen med telefon og åpningstider i «To måter å bestille» utelates til telefon og apningstider finnes i klinikk.json"
  - "«Parkering og kollektiv» og «Tilgjengelighet» i «Finn fram» utelates til adkomst.parkering, adkomst.kollektiv og adkomst.tilgjengelighet finnes i klinikk.json"
  - "Designets kartflate i «Finn fram» er ikke bygget: kart fra tredjepart er forbudt, så et eget statisk kartbilde må leveres av klinikken"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt — beløpene står som null og utelates fra siden"
i_navigasjon: true
i_bunntekst: false
rekkefolge: 4
illustrasjon: "fordoyelse-hero"
seksjoner:
  - type: "veier"
    tittel: "To måter å bestille"
    flate: "sand"
    veier:
      - tittel: "Bestill selv i pasientportalen"
        avsnitt:
          - "Du velger undersøkelse og tid i pasientportalen vår, og logger inn med BankID."
        liten: "Du sendes til et nytt vindu, og pasientopplysningene dine behandles i klinikkens journalsystem."
        knapp:
          tekst: "Bestill time"
          handling: "bestilling"
      - tittel: "Ring oss"
        avsnitt:
          - "Vil du snakke med noen først, eller er du usikker på hvilken undersøkelse som passer, ringer du oss."
        liten:
          tekst: "Telefon {klinikk.telefon} · åpen {klinikk.apningstider}"
          krever: ["telefon", "apningstider"]
        knapp:
          tekst: "Ring oss"
          handling: "telefon"
          stil: "sekundaer"
  - type: "tekst"
    tittel: "Henvisning fra fastlege"
    avsnitt:
      - "Du trenger ikke henvisning for å komme til oss. Har du allerede en henvisning fra fastlegen din, tar vi imot den, og du kan legge den ved når du bestiller time. Er du lege og skal henvise en pasient, finner du praktiske opplysninger på siden [For henvisende leger](/for-henvisende-leger/)."
    merknad: "Send aldri helseopplysninger på e-post eller i sosiale medier. Bruk pasientportalen eller ring oss."
  - type: "praktisk"
    tittel: "Finn fram"
    flate: "sand"
    punkter:
      - tittel: "Adresse"
        tekst: "{klinikk.adresse.gate}\n{klinikk.adresse.postnummer} {klinikk.adresse.poststed}, Øygarden"
      - tittel: "Parkering og kollektiv"
        tekst: "{klinikk.adkomst.parkering}\n{klinikk.adkomst.kollektiv}"
        krever: ["adkomst.parkering", "adkomst.kollektiv"]
      - tittel: "Tilgjengelighet"
        tekst: "{klinikk.adkomst.tilgjengelighet}"
        krever: ["adkomst.tilgjengelighet"]
  - type: "pris"
    tittel: "Før du bestiller"
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
      - navn: "Gastroskopi"
        belop_nok: null
      - navn: "Koloskopi"
        belop_nok: null
      - navn: "Anoskopi og rektoskopi"
        belop_nok: null
---
