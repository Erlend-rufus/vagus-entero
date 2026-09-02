import { lesManifest } from './lib/felles.js';

export const navn = 'godkjent-status';

// Produksjonsbygget skal KUN inneholde GODKJENT-innhold (medisinsk innhold
// passerer ett sted: signert godkjenning). Alt som ikke er en innholdsside —
// komponentkatalogen, en mal noen legger i src/ — skal aldri finnes der.
// Gaten i eleventy.config.js er en tillatelsesliste; vakten er fasiten mot
// det som faktisk ble skrevet til disk.
export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const feil = [];

  if (!manifest.produksjon) return feil;

  for (const side of manifest.sider) {
    if (!side.sidetype) {
      feil.push(
        `${side.url}: finnes i produksjonsbygget uten å være en innholdsside (ingen sidetype) — gaten har sviktet`
      );
      continue;
    }
    if (side.status !== 'GODKJENT') {
      feil.push(
        `${side.url}: bygget i produksjon med status «${side.status}» — kun GODKJENT skal ut`
      );
    }
  }
  if (!manifest.ciSyntetisk && !manifest.sider.some((side) => side.url === '/')) {
    feil.push('produksjonsbygget mangler forsiden («/») — et nettsted uten forside skal ikke ut');
  }
  return feil;
}
