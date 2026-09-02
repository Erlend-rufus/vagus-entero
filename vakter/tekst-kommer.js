import { finnDistFiler, lesTekst, lesManifest } from './lib/felles.js';

export const navn = 'tekst-kommer';

// «[TEKST KOMMER]» er den avtalte plassholderen der innholdsprosessen ennå
// ikke har levert tekst (grensesnittavtale 02.09.2026). Den er laget for å
// være umulig å forveksle med godkjent innhold — og skal derfor aldri kunne
// nå et produksjonsbygg, uansett hvor den står: innholdsfil, ui.json eller
// klinikk.json.
export const PLASSHOLDER = '[TEKST KOMMER]';

export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const feil = [];
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
