---
sidetype: "statisk"
url: "/personvern/"
malgruppe: "selvbetalende"
tittel: "Personvern"
menytittel: "Personvern"
meta_beskrivelse: "Hvordan Vagus Entero AS behandler personopplysninger om deg, hvilke rettigheter du har, og hvem du kan kontakte."
ingress: "Hvordan Vagus Entero AS behandler personopplysninger om deg, hvilke rettigheter du har, og hvem du kan kontakte."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: null
interne_lenker_ut:
  - "/kontakt/"
apne_punkter:
  - "Personvernombud eller kontaktperson for personvern: avsnittet i «Behandlingsansvarlig» utelates til personvern.kontaktperson finnes i klinikk.json"
  - "Øvrige databehandlere (laboratorium, regnskap): avsnittet i «Databehandlere og utlevering» utelates til personvern.databehandlere finnes i klinikk.json"
  - "Øvrige lagringstider: avsnittet i «Lagring og sletting» utelates til personvern.lagringstider finnes i klinikk.json"
  - "«Sist oppdatert» settes automatisk til byggedatoen ({bygg.dato})"
  - "Plausible Analytics er ikke installert. Kontoen må først opprettes i klinikkens navn. Deretter legges skriptet inn, og CSP og eksterne-verter-hvitlisten oppdateres (forberedt i docs/LANSERING.md)"
  - "Overføringen til USA (IP-adresser i serverlogger hos Netlify, Inc.): Elevate verifiserer mot Netlifys databehandleravtale. Setningen «Opplysninger lagres i EØS» i samme avsnitt må vurderes opp mot dette"
  - "Seksjonen «Dine rettigheter» har plassholdere som klinikken må fylle ut"
  - "Kontaktlinjene i «Behandlingsansvarlig» og «Spørsmål om personvern» utelates til epost og telefon finnes i klinikk.json"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt — beløpene står som null og utelates fra siden"
i_navigasjon: false
i_bunntekst: true
rekkefolge: 30
hode_merknad: "Sist oppdatert {bygg.dato}. Denne erklæringen skal gjennomgås juridisk før publisering."
seksjoner:
  - type: "tekst"
    tittel: "Behandlingsansvarlig"
    avsnitt:
      - "Vagus Entero AS, {klinikk.adresse.gate}, {klinikk.adresse.postnummer} {klinikk.adresse.poststed}, org.nr {klinikk.org_nr}, er behandlingsansvarlig for personopplysningene som behandles i klinikken."
      - tekst: "Kontakt: {klinikk.epost} eller telefon {klinikk.telefon}."
        krever: ["epost", "telefon"]
      - tekst: "{klinikk.personvern.kontaktperson}"
        krever: ["personvern.kontaktperson"]
  - type: "praktisk"
    tittel: "Hva vi behandler, og hvorfor"
    flate: "sand"
    punkter:
      - tittel: "Pasientjournal"
        tekst: "Navn, fødselsnummer, kontaktopplysninger, helseopplysninger, henvisninger, prøvesvar og bilder fra undersøkelser. Grunnlag: journalføringsplikten i helsepersonelloven § 39 og pasientjournalloven."
      - tittel: "Timebestilling"
        tekst: "Opplysninger du oppgir i pasientportalen for å få en time. Behandles i klinikkens journalsystem."
      - tittel: "Betaling og faktura"
        tekst: "Betalingsopplysninger og kvitteringer. Grunnlag: bokføringsplikt og avtalen med deg."
      - tittel: "Forsikringssaker"
        tekst: "Er undersøkelsen dekket av behandlingsforsikring, utleveres nødvendig dokumentasjon til selskapet — bare når du har samtykket."
      - tittel: "Nettstedet"
        tekst: "Nettstedet bruker ingen sporing som krever samtykke etter ekomloven § 3-15 — ingen Meta Pixel, TikTok-pixel eller annen tredjepartssporing. Vi bruker Plausible Analytics, som er driftet i EU og ikke bruker informasjonskapsler, som ikke identifiserer deg som person."
      - tittel: "Henvendelser"
        tekst: "Ringer du oss, noteres det som er nødvendig for å hjelpe deg. Send aldri helseopplysninger på e-post."
  - type: "tekst"
    tittel: "Databehandlere og utlevering"
    avsnitt:
      - "Databehandleravtale inngås med alle som behandler personopplysninger på våre vegne, inkludert leverandøren som drifter nettstedet."
      - tekst: "{klinikk.personvern.databehandlere}"
        krever: ["personvern.databehandlere"]
      - "Vi utleverer opplysninger til fastlege, sykehus, laboratorium eller forsikringsselskap bare når du har samtykket, eller når loven pålegger oss det. Opplysninger lagres i EØS. Nettstedet driftes av Netlify, Inc. i USA. Når du besøker nettstedet, behandles IP-adressen din i serverlogger hos Netlify."
  - type: "tekst"
    tittel: "Lagring og sletting"
    flate: "sand"
    avsnitt:
      - "Pasientjournal oppbevares så lenge det er nødvendig av hensyn til helsehjelpen, og deretter etter reglene i pasientjournalforskriften. Regnskapsopplysninger oppbevares fem år etter regnskapsårets slutt."
      - tekst: "{klinikk.personvern.lagringstider}"
        krever: ["personvern.lagringstider"]
  - type: "sporsmal"
    tittel: "Dine rettigheter"
    sporsmal:
      - sporsmal: "Innsyn i journalen din"
        svar: "Du har rett til å se hva som er registrert om deg, og få kopi. Kontakt klinikken, eller bruk innsynsløsningen i pasientportalen."
      - sporsmal: "Retting og sletting"
        svar: "Du kan kreve at feil rettes. Opplysninger i pasientjournal kan bare slettes i særlige tilfeller, jf. pasientjournalloven § 25."
      - sporsmal: "Begrensning og innsigelse"
        svar: "Du kan i noen tilfeller kreve at behandlingen begrenses, eller protestere mot den. Ta kontakt, så vurderer vi det etter personopplysningsloven og pasientjournalloven."
      - sporsmal: "Trekke tilbake samtykke"
        svar: "Har du samtykket til utlevering, kan du trekke samtykket tilbake. Det påvirker ikke utlevering som allerede er gjort."
      - sporsmal: "Klage til Datatilsynet"
        svar: "Mener du at vi behandler opplysningene dine feil, kan du klage til klinikken eller til Datatilsynet."
      - sporsmal: "Logg over innsyn"
        svar: "Du kan be om innsyn i loggen over hvem som har åpnet journalen din."
  - type: "pris"
    tittel: "Spørsmål om personvern"
    avsnitt:
      - tekst: "Kontakt klinikken på {klinikk.epost} eller telefon {klinikk.telefon}."
        krever: ["epost", "telefon"]
      - "Send aldri helseopplysninger på e-post — bruk pasientportalen eller ring oss."
    sidekolonne:
      etikett: "Merk"
      avsnitt:
        - "Denne erklæringen er et utkast satt opp av designhensyn. Innholdet skal gjennomgås av jurist og fagansvarlig lege før publisering, og lagringstider og databehandlere må bekreftes."
    knapper:
      - tekst: "Kontakt oss"
        handling: "intern"
        url: "/kontakt/"
        stil: "invers"
---
