// Oversetter ajv-valideringsfeil til håndskrevne norske meldinger.
// better-ajv-errors o.l. formaterer kun engelsk — dette laget gir full
// kontroll over ordlyden overfor tekstprodusenten, og selvtestes.

const FELTMELDINGER = {
  sidetype:
    'sidetype må være en av: forside, undersokelse, tilstand, behandling, pris, henviser, forsikring, statisk, bestilling',
  url: 'url må starte og slutte med «/» og kun bruke små bokstaver, tall og bindestrek (f.eks. /koloskopi/)',
  malgruppe: 'malgruppe må være en av: selvbetalende, henviser, forsikring',
  tittel: 'tittel (blir <title> og H1) må være 10–60 tegn',
  meta_beskrivelse: 'meta_beskrivelse må være 70–155 tegn',
  status: 'status må være UTKAST, KLAR_FOR_MEDISINSK_GJENNOMGANG eller GODKJENT',
  godkjent_av: 'godkjent_av må være null eller et navn (minst 2 tegn)',
  godkjent_dato: 'godkjent_dato må være null eller en dato på formen ÅÅÅÅ-MM-DD',
  jsonld_type: 'jsonld_type må være MedicalProcedure, MedicalCondition, MedicalSignOrSymptom, MedicalClinic, Physician eller null',
  interne_lenker_ut: 'interne_lenker_ut må være en liste av interne url-er (f.eks. /koloskopi/)',
  apne_punkter: 'apne_punkter må være en liste av tekstpunkter',
  i_navigasjon: 'i_navigasjon må være true eller false',
  rekkefolge: 'rekkefolge må være et heltall (0 eller høyere) for menyrekkefølgen',
  sist_oppdatert: 'sist_oppdatert må være en dato på formen ÅÅÅÅ-MM-DD',
  noindex: 'noindex må være true eller false (true holder siden ute av søk også i produksjon)',
  sidetittel: 'sidetittel (valgfri <title> uten suffiks, f.eks. «Koloskopi på Straume») må være 10–70 tegn',
  menytittel: 'menytittel (kort etikett i menyen, f.eks. «Undersøkelser») må være 3–30 tegn',
  ingress: 'ingress (vises under overskriften på forsiden) må være 30–300 tegn',
  illustrasjon:
    'illustrasjon må være navnet på en av strektegningene: gastroskopi, koloskopi, endetarm, proktologi, overvekt eller fordoyelse-hero',
  hode_knapper:
    'hode_knapper er 1–2 knapper, hver med tekst og handling (bestilling, telefon eller intern). Intern handling krever i tillegg url',
  fakta:
    'fakta er 2–4 punkter, hvert med term og verdi (f.eks. term: «Undersøkelsen tar», verdi: «15–30 minutter»)',
  overordnet:
    'overordnet må være url-en til siden over i brødsmulestien (f.eks. /undersokelser/)',
  seksjoner:
    'seksjoner er sidens innholdsblokker. Hver blokk må ha en type: tekst, tidslinje, steg, sporsmal, veier, praktisk, kort, kort_bred, pris eller prisliste — se docs/INNHOLDSKONTRAKT.md',
  bilder: 'hvert bilde må ha fil og alt (alt kan bare være tom sammen med dekorativt: true) — feltet er reservert og skal være tomt til visningen finnes',
  hode_merknad: 'hode_merknad (valgfri merknadslinje under knappene i sidehodet) må være 10–300 tegn',
  i_bunntekst: 'i_bunntekst må være true eller false (true legger siden i bunntekstens lenkeliste)',
  priser:
    'priser hører hjemme i en seksjon av type prisliste (eller pris), ikke på toppnivå — hver linje har navn, belop_nok (hele kroner inkl. mva, eller null) og eventuelt omfang'
};

// Blokktypene og hva de krever, brukt når feilen ligger inne i en seksjon.
const BLOKKMELDINGER = {
  tekst: 'krever tittel og avsnitt (1–8 avsnitt)',
  tidslinje: 'krever tittel og punkter (2–8 punkter med naar og tekst), og kan ha eksempelmerknad og etter',
  steg: 'krever tittel og steg (2–4 steg med tittel og tekst)',
  sporsmal: 'krever tittel og sporsmal (2–14 par av sporsmal og svar)',
  veier: 'krever tittel og veier (2–4 veier med tittel og avsnitt; liten, knapp og illustrasjon er valgfrie)',
  praktisk: 'krever tittel og punkter (2–6 punkter med tittel og tekst), og kan ha merknad',
  kort: 'krever tittel og kort (2–6 kort med tittel)',
  kort_bred: 'krever tittel og avsnitt',
  pris: 'krever tittel og avsnitt, og kan ha knapper, sidekolonne (etikett + avsnitt) eller priser',
  prisliste:
    'krever tittel og priser (navn, belop_nok og eventuelt omfang per linje; belop_nok er hele kroner eller null), og kan ha kolonner (tjeneste, omfang, pris), tabellmerknad og merknad'
};

function feltFraSti(instancePath, params) {
  if (params && params.missingProperty) return params.missingProperty;
  const deler = instancePath.split('/').filter(Boolean);
  return deler.length > 0 ? deler[0] : null;
}

// Seksjonsfeil peker på /seksjoner/<nr>/... — nummeret er det tekstprodusenten
// trenger for å finne blokken igjen i filen.
function seksjonsmelding(feil) {
  const treff = /^\/seksjoner\/(\d+)(.*)$/.exec(feil.instancePath || '');
  if (!treff) return null;
  const nr = Number(treff[1]) + 1;
  const rest = treff[2].split('/').filter(Boolean);
  if (feil.keyword === 'required') {
    return `seksjon nr. ${nr}: obligatorisk felt «${feil.params.missingProperty}» mangler`;
  }
  if (feil.keyword === 'discriminator') {
    return `seksjon nr. ${nr}: ukjent eller manglende type — velg tekst, tidslinje, steg, sporsmal, veier, praktisk, kort, kort_bred, pris eller prisliste`;
  }
  if (feil.keyword === 'additionalProperties') {
    return `seksjon nr. ${nr}: ukjent felt «${feil.params.additionalProperty}»`;
  }
  const felt = rest.length > 0 ? rest.join(' → ') : 'blokken';
  const type = feil.parentSchema && feil.parentSchema.properties && feil.parentSchema.properties.type
    ? feil.parentSchema.properties.type.const
    : null;
  const krav = type && BLOKKMELDINGER[type] ? ` — ${type} ${BLOKKMELDINGER[type]}` : '';
  return `seksjon nr. ${nr}: «${felt}» er ugyldig (${feil.keyword})${krav}`;
}

export function tilNorsk(ajvFeil) {
  const meldinger = new Set();
  for (const feil of ajvFeil || []) {
    if (feil.keyword === 'additionalProperties') {
      meldinger.add(
        `ukjent felt «${feil.params.additionalProperty}» — kontrakten tillater ingen felter utenfor skjemaet`
      );
      continue;
    }
    const iSeksjon = seksjonsmelding(feil);
    if (iSeksjon) {
      meldinger.add(iSeksjon);
      continue;
    }
    const felt = feltFraSti(feil.instancePath, feil.params);
    if (feil.keyword === 'required') {
      meldinger.add(
        `obligatorisk felt «${feil.params.missingProperty}» mangler — bygget har ingen standardverdier, med vilje`
      );
      continue;
    }
    if (felt && FELTMELDINGER[felt]) {
      meldinger.add(FELTMELDINGER[felt]);
    } else {
      meldinger.add(`feltet «${felt || feil.instancePath}» er ugyldig (${feil.keyword})`);
    }
  }
  return [...meldinger];
}
