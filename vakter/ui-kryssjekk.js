import fs from 'node:fs';
import path from 'node:path';
import { finnRepoTekstfiler, lesTekst } from './lib/felles.js';

export const navn = 'ui-kryssjekk';

// ui.json og malene skal aldri drifte fra hverandre:
// - hvert ui.*-oppslag i en mal må finnes i ui.json (throwOnUndefined fanger
//   det også i bygget, men her fanges det uten å bygge)
// - hver nøkkel i ui.json må faktisk brukes (døde nøkler er uadministrert
//   norsk tekst)
export function kjorKilde({ rot = '.' } = {}) {
  const feil = [];
  const nokler = new Set(
    Object.keys(JSON.parse(fs.readFileSync(path.join(rot, 'src/_data/ui.json'), 'utf8')))
  );
  const brukte = new Set();

  for (const fil of finnRepoTekstfiler(rot)) {
    const normalisert = fil.split(path.sep).join('/');
    if (!normalisert.startsWith('src/') || !normalisert.endsWith('.njk')) continue;
    for (const m of lesTekst(path.join(rot, fil)).matchAll(/(?<![\p{L}\p{N}_.])ui\.([a-zA-Z_][a-zA-Z0-9_]*)/gu)) {
      brukte.add(m[1]);
      if (!nokler.has(m[1])) {
        feil.push(`${fil}: ui.${m[1]} finnes ikke i src/_data/ui.json`);
      }
    }
  }

  for (const nokkel of nokler) {
    if (!brukte.has(nokkel)) {
      feil.push(`src/_data/ui.json: nøkkelen «${nokkel}» brukes ikke i noen mal — fjern den eller ta den i bruk`);
    }
  }
  return feil;
}
