import { lesInnhold } from './lib/les-innhold.js';

export const navn = 'priser-i-tekst';

// Prisopplysningsforskriften § 10 og prosjektets egen regel: beløp står kun
// i prisfeltene (belop_nok), aldri i løpende tekst. Da kan de ikke stå
// utdatert ett sted og riktig et annet. Vakten leser alle tekstfelt i
// innholdsfilene og stopper på kroner-mønstre.
const KRONER = /(?:\bkr\.?\s?\d[\d\s.]*|\d[\d\s.]*\s?(?:kr\b|kroner\b|,-))/iu;
const TEKSTFELT = new Set([
  'tittel', 'sidetittel', 'meta_beskrivelse', 'ingress', 'avsnitt', 'tekst', 'under',
  'merknad', 'eksempelmerknad', 'svar', 'sporsmal', 'liten', 'verdi', 'naar', 'menytittel'
]);

function* tekster(node, sti = []) {
  if (typeof node === 'string') {
    if (TEKSTFELT.has(sti[sti.length - 1]) || TEKSTFELT.has(sti[sti.length - 2])) {
      yield [sti.join('.'), node];
    }
  } else if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) yield* tekster(node[i], [...sti, String(i)]);
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'priser') continue; // beløpene skal stå her
      yield* tekster(v, [...sti, k]);
    }
  }
}

export function skannData(data) {
  const treff = [];
  for (const [sti, tekst] of tekster(data)) {
    const m = KRONER.exec(tekst);
    if (m) treff.push({ sti, funn: m[0].trim() });
  }
  return treff;
}

export function kjorKilde() {
  const feil = [];
  for (const { fil, data } of lesInnhold()) {
    for (const { sti, funn } of skannData(data)) {
      feil.push(`${fil}: beløp «${funn}» i løpende tekst (${sti}) — priser hører kun hjemme i pristabellen`);
    }
  }
  return feil;
}
