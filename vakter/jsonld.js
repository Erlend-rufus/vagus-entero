import { finnDistFiler, lesTekst } from './lib/felles.js';
import { hentJsonldBlokker } from './lib/html.js';

export const navn = 'jsonld';

// Strukturerte data blir crawlet og cachet — feil her lever lenge. Kun de tre
// tillatte typene kan forekomme, omtale-/vurderingstyper er strukturelt
// forbudt, og null/tomme verdier skal være utelatt av generatoren.
const TILLATTE_TOPPTYPER = new Set([
  'MedicalProcedure',
  'MedicalCondition',
  'MedicalSignOrSymptom',
  'MedicalClinic',
  'Physician'
]);
const TILLATTE_NOSTEDE = new Set(['PostalAddress']);
const FORBUDTE_TYPER = new Set(['Review', 'AggregateRating', 'Rating']);

function sjekkVerdier(node, sti, kilde, feil) {
  if (Array.isArray(node)) {
    node.forEach((element, i) => sjekkVerdier(element, `${sti}[${i}]`, kilde, feil));
    return;
  }
  if (node !== null && typeof node === 'object') {
    for (const [nokkel, verdi] of Object.entries(node)) {
      if (nokkel === '@type') {
        const typer = Array.isArray(verdi) ? verdi : [verdi];
        for (const type of typer) {
          if (FORBUDTE_TYPER.has(type)) {
            feil.push(`${kilde}: forbudt JSON-LD-type «${type}»`);
          } else if (sti === '' && !TILLATTE_TOPPTYPER.has(type)) {
            feil.push(`${kilde}: JSON-LD-toppnivåtype «${type}» er utenfor tillatt-listen`);
          } else if (sti !== '' && !TILLATTE_TOPPTYPER.has(type) && !TILLATTE_NOSTEDE.has(type)) {
            feil.push(`${kilde}: nøstet JSON-LD-type «${type}» er utenfor tillatt-listen`);
          }
        }
      }
      if (verdi === null || verdi === '') {
        feil.push(`${kilde}: JSON-LD-feltet «${sti}${nokkel}» er ${verdi === null ? 'null' : 'tomt'} — null-felter skal utelates, aldri sendes`);
      }
      sjekkVerdier(verdi, `${sti}${nokkel}.`, kilde, feil);
    }
  }
}

export function kjorDist(distKatalog) {
  const feil = [];

  for (const fil of finnDistFiler(distKatalog, ['.html'])) {
    for (const blokk of hentJsonldBlokker(lesTekst(fil))) {
      let objekt;
      try {
        objekt = JSON.parse(blokk);
      } catch {
        feil.push(`${fil}: JSON-LD er ikke gyldig JSON`);
        continue;
      }
      sjekkVerdier(objekt, '', fil, feil);
    }
  }
  return feil;
}
