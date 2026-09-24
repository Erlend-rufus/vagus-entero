import { finnDistFiler, lesTekst, lesManifest } from './lib/felles.js';
import { KONTAKTPLASSHOLDER } from './lib/innholdsvalidering.js';

export const navn = 'tekst-kommer';

// «[TEKST KOMMER]» er den avtalte plassholderen der innholdsprosessen ennå
// ikke har levert tekst (grensesnittavtale 02.09.2026). Den er laget for å
// være umulig å forveksle med godkjent innhold — og skal derfor aldri kunne
// nå et produksjonsbygg, uansett hvor den står: innholdsfil, ui.json eller
// klinikk.json.
//
// Oppdiktet kontaktinfo ([00 00 00 00], [E-post] …) skal ikke finnes i NOEN
// bygg: forhåndsvisningen går til klinikken, og et nummer som ser ekte ut
// kan bli ringt. Kildesjekken står i innholdsvalideringen; her fanges det
// som likevel skulle nå den rendrede teksten.
export const PLASSHOLDER = '[TEKST KOMMER]';

const GLOBAL_KONTAKTPLASSHOLDER = new RegExp(KONTAKTPLASSHOLDER.source, 'giu');

function synligTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
}

export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const feil = [];

  for (const fil of finnDistFiler(distKatalog, ['.html'])) {
    const funn = synligTekst(lesTekst(fil)).match(GLOBAL_KONTAKTPLASSHOLDER) || [];
    if (funn.length > 0) {
      feil.push(`${fil}: oppdiktet kontaktinfo i synlig tekst (${[...new Set(funn)].join(', ')}) — bruk klinikkfeltet med krever`);
    }
  }

  if (!manifest.produksjon) return feil;

  for (const fil of finnDistFiler(distKatalog, ['.html', '.xml', '.txt', '.json'])) {
    const tekst = lesTekst(fil);
    let fra = 0;
    let antall = 0;
    while ((fra = tekst.indexOf(PLASSHOLDER, fra)) !== -1) {
      antall += 1;
      fra += PLASSHOLDER.length;
    }
    if (antall > 0) {
      feil.push(`${fil}: «${PLASSHOLDER}» forekommer ${antall} ganger i produksjonsbygget — teksten er ikke levert`);
    }
  }
  return feil;
}
