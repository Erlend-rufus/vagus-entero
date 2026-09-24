---
sidetype: "forsikring"
url: "/for-forsikringsselskaper/"
malgruppe: "forsikring"
tittel: "For forsikringsselskaper"
menytittel: "For forsikringsselskaper"
meta_beskrivelse: "Opplysninger for selskaper som vurderer Vagus Entero Klinikken som behandlingssted for gastroenterologiske undersøkelser i Bergensområdet."
ingress: "Opplysninger for selskaper som vurderer Vagus Entero Klinikken som behandlingssted for gastroenterologiske undersøkelser i Bergensområdet."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: null
interne_lenker_ut:
  - "/personvern/"
apne_punkter:
  - "Listeprisene mangler beløp og omfang (omfang: null). Forhåndsvisningen viser én samlet markør til de finnes"
  - "Reisetid fra Bergen sentrum og avtaleform i faktalisten utelates til adkomst.reisetid_bergen og avtale.avtaleform finnes i klinikk.json"
  - "Punktene i «Kapasitet, svartid og rapportering» utelates til kapasitet.*, avtale.svartid, avtale.rapportering, avtale.fakturering, avtale.avbestilling og avtale.journalintegrasjon finnes i klinikk.json"
  - "Avsnittene om utstyr, laboratorium og kvalitetsregistre i «Fagprofil, utstyr og lokaler» utelates til utstyr, laboratorium.* og kvalitet.kvalitetsregistre finnes i klinikk.json"
  - "«Internkontroll», «Avvik og pasientsikkerhet» og «Adkomst for pasienten» i «Kvalitet, internkontroll og dekning» utelates til kvalitet.internkontroll_dokumentasjon, kvalitet.avvikssystem og adkomst.* finnes i klinikk.json"
  - "Kontaktpersonen i «Kontakt om avtale» utelates til avtale.kontakt (navn, rolle, e-post, telefon) finnes i klinikk.json"
  - "Klinikken har én lege. Nye behandlere føres opp på siden når de er ansatt"
  - "Designets merknad under sidehodet («Avtalehenvendelser: [PLASSHOLDER: navn, rolle, e-post, telefon].») er utelatt til kontaktpunktet finnes, og settes som hode_merknad da"
  - "Designets knapper «Kontakt om avtale» og «Last ned som PDF» (sidehode og prisblokk) mangler mål. Avklar hvor de skal peke og om PDF-en skal finnes. Siden har derfor ingen knapper ennå; pasientknappene hører ikke hjemme her"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt. Beløpene står som null og utelates fra siden"
  - "Leveransens brødsmulesti går via en «For fagfolk»-side som ikke ble levert. Siden er derfor lagt rett under forsiden, og lenken ligger i bunnteksten i stedet for i hovedmenyen"
i_navigasjon: false
i_bunntekst: true
rekkefolge: 21
illustrasjon: "koloskopi"
fakta:
  - term: "Åpner"
    verdi: "1. januar 2027"
  - term: "Sted"
    verdi: "Straume, Øygarden"
  - term: "Fra Bergen sentrum"
    verdi: "{klinikk.adkomst.reisetid_bergen}"
    krever: ["adkomst.reisetid_bergen"]
  - term: "Avtaleform"
    verdi: "{klinikk.avtale.avtaleform}"
    krever: ["avtale.avtaleform"]
seksjoner:
  - type: "prisliste"
    tittel: "Dette leverer klinikken"
    under: "Avtalepriser fastsettes i avtalen. Beløpene under er klinikkens listepriser."
    kolonner:
      tjeneste: "Undersøkelse eller behandling"
      omfang: "Omfang"
      pris: "Listepris"
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
  - type: "praktisk"
    tittel: "Kapasitet, svartid og rapportering"
    flate: "sand"
    punkter:
      - tittel: "Kapasitet"
        tekst: "{klinikk.kapasitet.rom}\n{klinikk.kapasitet.dager_per_uke}\n{klinikk.kapasitet.undersokelser_per_uke}"
        krever: ["kapasitet.rom", "kapasitet.dager_per_uke", "kapasitet.undersokelser_per_uke"]
      - tittel: "Svartid"
        tekst: "{klinikk.avtale.svartid}"
        krever: ["avtale.svartid"]
      - tittel: "Rapportering"
        tekst: "Epikrise og dokumentasjon sendes selskapet etter avtale, forutsatt pasientens samtykke. {klinikk.avtale.rapportering}"
        krever: ["avtale.rapportering"]
      - tittel: "Fakturering"
        tekst: "{klinikk.avtale.fakturering}"
        krever: ["avtale.fakturering"]
      - tittel: "Avbestilling og ikke møtt"
        tekst: "{klinikk.avtale.avbestilling}"
        krever: ["avtale.avbestilling"]
      - tittel: "Journalsystem"
        tekst: "{klinikk.avtale.journalintegrasjon}"
        krever: ["avtale.journalintegrasjon"]
    merknad: "Klinikken oppgir ingen tall for kapasitet eller svartid før de er målt i egen drift."
  - type: "tekst"
    tittel: "Fagprofil, utstyr og lokaler"
    avsnitt:
      - "Fagansvarlig lege: {klinikk.lege.navn}, {klinikk.lege.spesialitet} (HPR {klinikk.lege.hpr_nummer})."
      - tekst: "{klinikk.utstyr}"
        krever: ["utstyr"]
      - tekst: "Vevsprøver analyseres ved {klinikk.laboratorium.navn}. Svartid {klinikk.laboratorium.svartid}."
        krever: ["laboratorium.navn", "laboratorium.svartid"]
      - tekst: "{klinikk.kvalitet.kvalitetsregistre}"
        krever: ["kvalitet.kvalitetsregistre"]
  - type: "praktisk"
    tittel: "Kvalitet, internkontroll og dekning"
    flate: "sand"
    punkter:
      - tittel: "Internkontroll"
        tekst: "Klinikken har internkontrollsystem etter forskrift om ledelse og kvalitetsforbedring i helsetjenesten. {klinikk.kvalitet.internkontroll_dokumentasjon}"
        krever: ["kvalitet.internkontroll_dokumentasjon"]
      - tittel: "Avvik og pasientsikkerhet"
        tekst: "{klinikk.kvalitet.avvikssystem}"
        krever: ["kvalitet.avvikssystem"]
      - tittel: "Tilsyn og tillatelser"
        tekst: "{klinikk.tilsyn.tillatelse}. Tilsynsmyndighet: {klinikk.tilsyn.myndighet}."
      - tittel: "Geografisk dekning"
        tekst: "Klinikken ligger på Straume i Øygarden og dekker Bergen vest, Øygarden, Askøy og Sotra."
      - tittel: "Adkomst for pasienten"
        tekst: "{klinikk.adkomst.parkering}\n{klinikk.adkomst.kollektiv}\n{klinikk.adkomst.tilgjengelighet}"
        krever: ["adkomst.parkering", "adkomst.kollektiv", "adkomst.tilgjengelighet"]
      - tittel: "Personvern"
        tekst: "Databehandling og pasientrettigheter er beskrevet på siden [Personvern](/personvern/)."
  - type: "pris"
    tittel: "Kontakt om avtale"
    avsnitt:
      - "Avtalehenvendelser og spørsmål om priser, kapasitet og rapportering rettes til klinikkens avtaleansvarlige."
      - tekst: "{klinikk.avtale.kontakt.navn}, {klinikk.avtale.kontakt.rolle}\n{klinikk.avtale.kontakt.epost} · {klinikk.avtale.kontakt.telefon}"
        krever: ["avtale.kontakt.navn", "avtale.kontakt.rolle", "avtale.kontakt.epost", "avtale.kontakt.telefon"]
    sidekolonne:
      etikett: "Om denne siden"
      avsnitt:
        - "Siden er ment for innkjøpere hos forsikringsselskaper, ikke for pasienter. Den inneholder ingen pasientrettet markedsføring, og alle tall fylles inn først når de er dokumentert."
---
