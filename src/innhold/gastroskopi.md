---
sidetype: "undersokelse"
url: "/gastroskopi/"
malgruppe: "selvbetalende"
tittel: "Kikkertundersøkelse av spiserør og magesekk (gastroskopi)"
menytittel: "Gastroskopi"
meta_beskrivelse: "Legen ser innsiden av spiserøret, magesekken og øverste del av tolvfingertarmen med et tynt, bøyelig kamera gjennom munnen."
ingress: "Legen ser innsiden av spiserøret, magesekken og øverste del av tolvfingertarmen med et tynt, bøyelig kamera gjennom munnen."
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
rekkefolge: 10
overordnet: "/undersokelser/"
illustrasjon: "gastroskopi"
hode_knapper:
  - tekst: "Bestill time"
    handling: "bestilling"
  - tekst: "Ring oss"
    handling: "telefon"
    stil: "sekundaer"
fakta:
  - term: "Undersøkelsen tar"
    verdi: "10–20 minutter"
  - term: "Faste"
    verdi: "Fra kvelden før"
  - term: "Bedøvelse"
    verdi: "Tilbys"
  - term: "Funnene"
    verdi: "Gjennomgås samme dag"
seksjoner:
  - type: "tidslinje"
    tittel: "Slik forbereder du deg"
    under: "Magesekken må være tom for at legen skal se slimhinnen. Du får skriftlig beskjed i god tid før timen, og du kan ringe oss hvis noe er uklart."
    eksempelmerknad: "EKSEMPEL på tidsplan — venter faglig godkjenning. Fastetid og medisinjusteringer fastsettes av fagansvarlig lege."
    punkter:
      - naar: "Dagen før"
        tekst: "Spis og drikk som normalt. Si fra til klinikken hvis du bruker blodfortynnende medisiner eller medisiner mot diabetes."
      - naar: "Kvelden før, kl. [KLOKKESLETT]"
        tekst: "Siste måltid. Etter dette skal du ikke spise."
      - naar: "Timen-dagen, fram til [ANTALL] timer før"
        tekst: "Du kan drikke klare væsker: vann, saft uten fruktkjøtt, te eller kaffe uten melk."
      - naar: "[ANTALL] timer før timen"
        tekst: "Ikke drikk mer. Faste medisiner tas med litt vann hvis legen har sagt det er i orden."
      - naar: "Selve timen"
        tekst: "Møt 15 minutter før avtalt tid. Ta med legitimasjon og oversikt over faste medisiner."
  - type: "steg"
    tittel: "Slik foregår undersøkelsen"
    flate: "sand"
    steg:
      - tittel: "Før vi begynner"
        tekst: "Du snakker med legen om plagene dine, medisiner og eventuell bedøvelse. Du får tilbud om bedøvende spray i halsen."
      - tittel: "Under undersøkelsen"
        tekst: "Du ligger på siden med et munnstykke mellom tennene. Legen fører kameraet ned gjennom spiserøret. Du puster normalt hele tiden."
      - tittel: "Etter undersøkelsen"
        tekst: "Du hviler litt, og legen går gjennom funnene med deg før du reiser hjem."
  - type: "sporsmal"
    tittel: "Spørsmål og svar"
    under: "Svarene under er utkast. De skal godkjennes av fagansvarlig lege før publisering."
    sporsmal:
      - sporsmal: "Hva du må si fra om på forhånd"
        svar: "Si fra hvis du bruker blodfortynnende medisiner, har diabetes, er gravid, har pacemaker eller kjent hjerte- eller lungesykdom. Noen medisiner må justeres før undersøkelsen. [PLASSHOLDER: klinikkens rutine]"
      - sporsmal: "Bedøvelse og smertestillende"
        svar: "Klinikken tilbyr bedøvende spray i halsen, og beroligende medisin hvis du ønsker det. Legen går gjennom alternativene med deg. [PLASSHOLDER: hvilke former som tilbys]"
      - sporsmal: "Er det vondt?"
        svar: "De fleste opplever undersøkelsen som ubehagelig, men ikke smertefull. Brekningsfølelse er vanlig og går over. [PLASSHOLDER: faglig godkjent formulering]"
      - sporsmal: "Kan jeg kjøre bil etterpå?"
        svar: "Har du fått beroligende, skal du ikke kjøre bil selv resten av dagen. Har du bare fått bedøvende spray, kan du normalt kjøre. [PLASSHOLDER: klinikkens rutine]"
      - sporsmal: "Trenger jeg følge eller transport hjem?"
        svar: "Får du beroligende, bør du ha med noen som kan følge deg hjem, eller ordne transport på forhånd."
      - sporsmal: "Hva skjer hvis noe må fjernes underveis?"
        svar: "Finner legen noe som bør undersøkes nærmere, kan det tas vevsprøve i samme undersøkelse. Du får beskjed før og etter. [PLASSHOLDER: hva som gjøres i klinikken]"
      - sporsmal: "Vevsprøve og når svaret kommer"
        svar: "Tas det vevsprøve, sendes den til laboratorium for analyse. Du får beskjed om hvordan og når du får svar. [PLASSHOLDER: svarrutine og kanal]"
      - sporsmal: "Hva kan jeg spise og drikke etterpå?"
        svar: "Har du fått bedøvelse i halsen, må du vente til svelgen fungerer normalt igjen før du spiser eller drikker. [PLASSHOLDER: klinikkens råd]"
      - sporsmal: "Risiko og komplikasjoner"
        svar: "Gastroskopi er en vanlig undersøkelse, men som ved alle inngrep finnes det risiko. De vanligste er sår hals og ubehag. Alvorlige komplikasjoner er sjeldne. Legen går gjennom risikoen med deg før du samtykker. [PLASSHOLDER: faglig godkjent tekst]"
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
      - navn: "Gastroskopi"
        belop_nok: null
      - navn: "Gastroskopi med vevsprøve"
        belop_nok: null
      - navn: "Gastroskopi og koloskopi samme dag"
        belop_nok: null
---
