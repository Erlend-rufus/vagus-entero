import path from 'node:path';
import { finnRepoTekstfiler, finnDistFiler, lesTekst } from './lib/felles.js';

export const navn = 'lagring';

// Nettstedet skal ikke lagre noe som helst i brukerutstyr (ekomloven § 3-15,
// GDPR art. 9-kontekst). Ingen unntak, ingen samtykkebanner — funksjoner som
// «trenger» lagring er feil valgt.
const MONSTRE = [/localStorage/g, /sessionStorage/g, /document\.cookie/g, /indexedDB/gi];

export function skannTekst(tekst, kilde) {
  const feil = [];
  tekst.split('\n').forEach((linje, indeks) => {
    for (const monster of MONSTRE) {
      monster.lastIndex = 0;
      const m = monster.exec(linje);
      if (m) feil.push(`${kilde}:${indeks + 1}: lagring i brukerutstyr «${m[0]}»`);
    }
  });
  return feil;
}

// Kildeskann er avgrenset til koden som blir til nettstedet (src/) — vaktene
// selv må få nevne API-navnene de leter etter.
export function kjorKilde() {
  const feil = [];
  for (const fil of finnRepoTekstfiler()) {
    const normalisert = fil.split(path.sep).join('/');
    if (!normalisert.startsWith('src/')) continue;
    feil.push(...skannTekst(lesTekst(fil), fil));
  }
  return feil;
}

export function kjorDist(distKatalog) {
  const feil = [];
  for (const fil of finnDistFiler(distKatalog, ['.html', '.js'])) {
    feil.push(...skannTekst(lesTekst(fil), fil));
  }
  return feil;
}
