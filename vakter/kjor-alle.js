#!/usr/bin/env node
// Kjører alle vaktene. Feiler høylytt — aldri advarsler.
//
// Bruk:
//   node vakter/kjor-alle.js                     kildevakter
//   node vakter/kjor-alle.js --dist [katalog]    + utdatavakter (standard: dist)
//   node vakter/kjor-alle.js --historikk         + skann av commit-meldinger
//
// Erlend utvider forbudslistene ved å redigere tekstfilene i
// vakter/ordlister/ — se docs/VAKTER.md. Ingen byggkunnskap nødvendig.

import * as innholdskontrakt from './innholdskontrakt.js';
import * as ordliste from './ordliste-skann.js';
import * as sporing from './sporing.js';
import * as lagring from './lagring.js';
import * as norskIMaler from './norsk-i-maler.js';
import * as uiKryssjekk from './ui-kryssjekk.js';
import * as eksterneVerter from './eksterne-verter.js';
import * as jsonld from './jsonld.js';
import * as lenker from './lenker.js';
import * as godkjentStatus from './godkjent-status.js';
import * as klinikkLansering from './klinikk-lansering.js';
import * as noindex from './noindex.js';
import * as headere from './headere.js';

const args = process.argv.slice(2);
const distKataloger = [];
let historikk = false;

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--dist') {
    const neste = args[i + 1];
    if (neste && !neste.startsWith('--')) {
      distKataloger.push(neste);
      i += 1;
    } else {
      distKataloger.push('dist');
    }
  } else if (args[i] === '--historikk') {
    historikk = true;
  } else {
    console.error(`Ukjent argument: ${args[i]}`);
    process.exit(2);
  }
}

const kjoringer = [
  { navn: 'innholdskontrakt', fn: () => innholdskontrakt.kjorKilde() },
  { navn: 'ordliste-skann (kildefiler)', fn: () => ordliste.kjorKilde() },
  { navn: 'sporing (kildefiler)', fn: () => sporing.kjorKilde() },
  { navn: 'lagring (kildefiler)', fn: () => lagring.kjorKilde() },
  { navn: 'norsk-i-maler', fn: () => norskIMaler.kjorKilde() },
  { navn: 'ui-kryssjekk', fn: () => uiKryssjekk.kjorKilde() }
];

if (historikk) {
  kjoringer.push({ navn: 'ordliste-skann (commit-meldinger)', fn: () => ordliste.kjorHistorikk() });
}

for (const dist of distKataloger) {
  kjoringer.push(
    { navn: `eksterne-verter (${dist})`, fn: () => eksterneVerter.kjorDist(dist) },
    { navn: `sporing (${dist})`, fn: () => sporing.kjorDist(dist) },
    { navn: `lagring (${dist})`, fn: () => lagring.kjorDist(dist) },
    { navn: `ordliste-skann (${dist})`, fn: () => ordliste.kjorDist(dist) },
    { navn: `jsonld (${dist})`, fn: () => jsonld.kjorDist(dist) },
    { navn: `lenker (${dist})`, fn: () => lenker.kjorDist(dist) },
    { navn: `godkjent-status (${dist})`, fn: () => godkjentStatus.kjorDist(dist) },
    { navn: `klinikk-lansering (${dist})`, fn: () => klinikkLansering.kjorDist(dist) },
    { navn: `noindex (${dist})`, fn: () => noindex.kjorDist(dist) },
    { navn: `headere (${dist})`, fn: () => headere.kjorDist(dist) }
  );
}

let sumFeil = 0;
for (const { navn, fn } of kjoringer) {
  let feil;
  try {
    feil = fn();
  } catch (unntak) {
    feil = [`vakten kræsjet: ${unntak.message}`];
  }
  if (feil.length === 0) {
    console.log(`  OK   ${navn}`);
  } else {
    sumFeil += feil.length;
    console.error(`  FEIL ${navn} (${feil.length}):`);
    for (const melding of feil) console.error(`       - ${melding}`);
  }
}

if (sumFeil > 0) {
  console.error(`\nVaktene fant ${sumFeil} brudd. Bygget skal ikke ut i denne tilstanden.`);
  process.exit(1);
}
console.log('\nAlle vakter grønne.');
