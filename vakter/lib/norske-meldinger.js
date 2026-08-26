// Oversetter ajv-valideringsfeil til håndskrevne norske meldinger.
// better-ajv-errors o.l. formaterer kun engelsk — dette laget gir full
// kontroll over ordlyden overfor tekstprodusenten, og selvtestes.

const FELTMELDINGER = {
  sidetype:
    'sidetype må være en av: forside, undersokelse, tilstand, behandling, pris, henviser, forsikring, statisk',
  url: 'url må starte og slutte med «/» og kun bruke små bokstaver, tall og bindestrek (f.eks. /koloskopi/)',
  malgruppe: 'malgruppe må være en av: selvbetalende, henviser, forsikring',
  tittel: 'tittel (blir <title> og H1) må være 15–60 tegn',
  meta_beskrivelse: 'meta_beskrivelse må være 70–155 tegn',
  status: 'status må være UTKAST, KLAR_FOR_MEDISINSK_GJENNOMGANG eller GODKJENT',
  godkjent_av: 'godkjent_av må være null eller et navn (minst 2 tegn)',
  godkjent_dato: 'godkjent_dato må være null eller en dato på formen ÅÅÅÅ-MM-DD',
  jsonld_type: 'jsonld_type må være MedicalProcedure, MedicalClinic, Physician eller null',
  interne_lenker_ut: 'interne_lenker_ut må være en liste av interne url-er (f.eks. /koloskopi/)',
  apne_punkter: 'apne_punkter må være en liste av tekstpunkter',
  i_navigasjon: 'i_navigasjon må være true eller false',
  rekkefolge: 'rekkefolge må være et heltall (0 eller høyere) for menyrekkefølgen',
  sist_oppdatert: 'sist_oppdatert må være en dato på formen ÅÅÅÅ-MM-DD',
  ingress: 'ingress (vises under overskriften på forsiden) må være 30–300 tegn',
  reisen:
    'reisen-blokken (forsidens scrollfortelling) mangler noe eller har ugyldig struktur — se docs/INNHOLDSKONTRAKT.md for feltene (intro, avslutning, stasjoner med punkter, rutekart, billetter, pris_seksjon, etiketter)',
  undersokelser_tittel:
    'undersokelser_tittel (overskrift for det automatiske undersøkelsesutvalget) må være 3–60 tegn',
  bilder: 'hvert bilde må ha fil og alt (alt kan bare være tom sammen med dekorativt: true)',
  priser: 'hver prislinje må ha navn og belop_nok (kroner inkl. mva, over 0)'
};

function feltFraSti(instancePath, params) {
  if (params && params.missingProperty) return params.missingProperty;
  const deler = instancePath.split('/').filter(Boolean);
  return deler.length > 0 ? deler[0] : null;
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
