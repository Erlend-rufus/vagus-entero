import fs from 'node:fs';
import path from 'node:path';
import { lesTekst } from './lib/felles.js';
import { lesPolicy } from '../verktoy/headere.js';

export const navn = 'headere';

// Sikkerhetsheaderne har ÉN kilde: sikkerhet/policy.json. Denne vakten
// verifiserer at bygde _headers inneholder policyen uendret — limes en
// sporingspiksel inn om atten måneder, blokkerer CSP-en den i nettleseren.
export function kjorDist(distKatalog) {
  const sti = path.join(distKatalog, '_headers');
  if (!fs.existsSync(sti)) return [`${sti} mangler`];

  const policy = lesPolicy();
  const headers = lesTekst(sti);
  const feil = [];

  const forventetCsp = `Content-Security-Policy: ${policy.csp.join('; ')}`;
  if (!headers.includes(forventetCsp)) {
    feil.push('_headers: CSP-linjen avviker fra sikkerhet/policy.json');
  }
  for (const [navnet, verdi] of Object.entries(policy.faste)) {
    if (!headers.includes(`${navnet}: ${verdi}`)) {
      feil.push(`_headers: «${navnet}» mangler eller avviker fra sikkerhet/policy.json`);
    }
  }
  return feil;
}
