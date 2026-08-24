import { lesManifest } from './lib/felles.js';

export const navn = 'godkjent-status';

// Produksjonsbygget skal KUN inneholde GODKJENT-innhold (medisinsk innhold
// passerer ett sted: signert godkjenning). Komponentkatalogen er et
// utviklingsverktøy og skal aldri finnes der.
export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const feil = [];

  if (!manifest.produksjon) return feil;

  for (const side of manifest.sider) {
    if (side.sidetype && side.status !== 'GODKJENT') {
      feil.push(
        `${side.url}: bygget i produksjon med status «${side.status}» — kun GODKJENT skal ut`
      );
    }
    if (side.url === '/komponentkatalog/') {
      feil.push('/komponentkatalog/ finnes i produksjonsbygget — gaten har sviktet');
    }
  }
  return feil;
}
