---
sidetype: "undersokelse"
url: "/koloskopi/"
malgruppe: "selvbetalende"
tittel: "Kikkertundersøkelse av tykktarmen (koloskopi)"
menytittel: "Koloskopi"
meta_beskrivelse: "Legen ser innsiden av tykktarmen med et bøyelig kamera. Her står hvordan du forbereder deg, hvordan undersøkelsen foregår, og hva som skjer etterpå."
ingress: "Legen ser innsiden av tykktarmen med et bøyelig kamera. Her står hvordan du forbereder deg, hvordan undersøkelsen foregår, og hva som skjer etterpå."
status: "UTKAST"
godkjent_av: null
godkjent_dato: null
jsonld_type: "MedicalProcedure"
interne_lenker_ut: []
apne_punkter:
  - "Setningen om hvor bestillingen sendes navngir pasientportalen — navnet står ikke i repoet. Bestemmes av klinikken og settes i klinikk.json (bestilling.merknad) sammen med unntaket i ordlisten"
  - "Seksjonen «Slik forbereder du deg» har plassholdere som klinikken må fylle ut"
  - "Seksjonen «Spørsmål og svar» har plassholdere som klinikken må fylle ut"
  - "Hele teksten skal gjennom medisinsk gjennomgang og signeres av fagansvarlig lege før status kan bli GODKJENT"
  - "Prisene er ikke fastsatt — beløpene står som null og utelates fra siden"
i_navigasjon: false
i_bunntekst: false
rekkefolge: 11
overordnet: "/undersokelser/"
illustrasjon: "koloskopi"
hode_knapper:
  - tekst: "Bestill time"
    handling: "bestilling"
  - tekst: "Ring oss"
    handling: "telefon"
    stil: "sekundaer"
fakta:
  - term: "Undersøkelsen tar"
    verdi: "20–45 minutter"
  - term: "Tømming av tarmen"
    verdi: "Dagen før"
  - term: "Bedøvelse"
    verdi: "Tilbys"
  - term: "Funnene"
    verdi: "Gjennomgås samme dag"
seksjoner:
  - type: "tidslinje"
    tittel: "Slik forbereder du deg"
    under: "Tarmen må være tom for at legen skal se tarmveggen. Du får tømmemiddel og skriftlig oppskrift i god tid før timen, og du kan ringe oss hvis noe er uklart."
    eksempelmerknad: "EKSEMPEL på tidsplan — venter faglig godkjenning. Preparat, dose og klokkeslett fastsettes av fagansvarlig lege."
    punkter:
      - naar: "Dagen før, fra morgenen"
        tekst: "Spis lett mat. Unngå frø, korn, nøtter og grove grønnsaker. Drikk rikelig med vann."
      - naar: "Dagen før, kl. 12"
        tekst: "Siste faste måltid. Etter dette bare klare væsker: vann, saft uten fruktkjøtt, buljong, te eller kaffe uten melk."
      - naar: "Kvelden før, kl. [KLOKKESLETT]"
        tekst: "Første del av tømmemiddelet [PREPARAT], oppløst i vann etter oppskriften du har fått. Fortsett å drikke klare væsker."
      - naar: "Timen-dagen, kl. [KLOKKESLETT]"
        tekst: "Andre del av tømmemiddelet. Du skal være ferdig med å drikke [ANTALL] timer før timen."
      - naar: "Selve timen"
        tekst: "Møt 15 minutter før avtalt tid. Ta med legitimasjon og oversikt over faste medisiner."
  - type: "steg"
    tittel: "Slik foregår undersøkelsen"
    flate: "sand"
    steg:
      - tittel: "Før vi begynner"
        tekst: "Du snakker med legen om plagene dine, medisiner og eventuell bedøvelse."
      - tittel: "Under undersøkelsen"
        tekst: "Legen fører et bøyelig kamera inn gjennom endetarmsåpningen og undersøker tykktarmen. Du ligger på siden."
      - tittel: "Etter undersøkelsen"
        tekst: "Du hviler litt, og legen går gjennom funnene med deg før du reiser hjem."
  - type: "sporsmal"
    tittel: "Spørsmål og svar"
    under: "Svarene under er utkast. De skal godkjennes av fagansvarlig lege før publisering."
    sporsmal:
      - sporsmal: "Hva du må si fra om på forhånd"
        svar: "Si fra hvis du bruker blodfortynnende medisiner, har diabetes, er gravid, har pacemaker eller kjent hjerte- eller lungesykdom. Noen medisiner må justeres før undersøkelsen. [PLASSHOLDER: klinikkens rutine]"
      - sporsmal: "Bedøvelse og smertestillende"
        svar: "Klinikken tilbyr bedøvelse og smertestillende. Legen går gjennom alternativene med deg før undersøkelsen. [PLASSHOLDER: hvilke former som tilbys]"
      - sporsmal: "Kan jeg kjøre bil etterpå?"
        svar: "Har du fått beroligende eller bedøvelse, skal du ikke kjøre bil selv resten av dagen. Uten bedøvelse kan du normalt kjøre. [PLASSHOLDER: klinikkens rutine]"
      - sporsmal: "Trenger jeg følge eller transport hjem?"
        svar: "Får du bedøvelse, bør du ha med noen som kan følge deg hjem, eller ordne transport på forhånd. [PLASSHOLDER: krav ved bedøvelse]"
      - sporsmal: "Hva skjer hvis noe må fjernes underveis?"
        svar: "Finner legen en polypp, kan den ofte fjernes i samme undersøkelse. Du får beskjed før og etter, og prøven sendes til analyse. [PLASSHOLDER: hva som gjøres i klinikken]"
      - sporsmal: "Vevsprøve og når svaret kommer"
        svar: "Tas det vevsprøve, blir den sendt til laboratorium for analyse. Du får beskjed om hvordan og når du får svar. [PLASSHOLDER: svarrutine og kanal]"
      - sporsmal: "Hva kan jeg spise og drikke etterpå?"
        svar: "De fleste kan spise og drikke som normalt kort tid etter undersøkelsen. [PLASSHOLDER: klinikkens råd]"
      - sporsmal: "Risiko og komplikasjoner"
        svar: "Koloskopi er en vanlig undersøkelse, men som ved alle inngrep finnes det risiko. De vanligste er ubehag, luftsmerter og små blødninger. Alvorlige komplikasjoner er sjeldne. Legen går gjennom risikoen med deg før du samtykker. [PLASSHOLDER: faglig godkjent tekst]"
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
      - navn: "Koloskopi"
        belop_nok: null
      - navn: "Koloskopi med vevsprøve"
        belop_nok: null
      - navn: "Gastroskopi og koloskopi samme dag"
        belop_nok: null
---
