import fs from 'node:fs';
import path from 'node:path';
import { lesTekst } from './lib/felles.js';
import { lesPolicy } from '../verktoy/headere.js';

export const navn = 'headere';

// Sikkerhetsheaderne har ÉN kilde: sikkerhet/policy.json. Denne vakten
// verifiserer at bygde _headers inneholder policyen UENDRET — ikke bare at
// linjene finnes, men at hver styrt header står nøyaktig én gang med nøyaktig
// den verdien policyen sier. Et påhengt CSP-direktiv, en ekstra CSP-linje
// eller en svakere Referrer-Policy stopper bygget.

// Deler _headers i blokker per sti: { '/*': [[navn, verdi], …], '/fonter/*': … }
export function lesHeaderBlokker(tekst) {
  const blokker = new Map();
  let gjeldende = null;
  for (const raa of tekst.split('\n')) {
    if (raa.trim() === '') continue;
    if (!/^\s/.test(raa)) {
      gjeldende = raa.trim();
      blokker.set(gjeldende, []);
      continue;
    }
    const m = /^\s+([^:]+):\s*(.*)$/.exec(raa);
    if (m && gjeldende) blokker.get(gjeldende).push([m[1].trim(), m[2].trim()]);
  }
  return blokker;
}

function kravOmNoyaktigEn(linjer, navnet, forventet, feil) {
  const treff = linjer.filter(([n]) => n.toLowerCase() === navnet.toLowerCase());
  if (treff.length === 0) {
    feil.push(`_headers: «${navnet}» mangler i /*-blokken (sikkerhet/policy.json)`);
  } else if (treff.length > 1) {
    feil.push(`_headers: «${navnet}» står ${treff.length} ganger i /*-blokken — nettleseren kan velge den svakeste`);
  } else if (treff[0][1] !== forventet) {
    feil.push(`_headers: «${navnet}» avviker fra sikkerhet/policy.json (er «${treff[0][1].slice(0, 80)}», skal være «${forventet.slice(0, 80)}»)`);
  }
}

export function kjorDist(distKatalog) {
  const sti = path.join(distKatalog, '_headers');
  if (!fs.existsSync(sti)) return [`${sti} mangler`];

  const policy = lesPolicy();
  const blokker = lesHeaderBlokker(lesTekst(sti));
  const feil = [];
  const rot = blokker.get('/*');
  if (!rot) return ['_headers: /*-blokken mangler'];

  kravOmNoyaktigEn(rot, 'Content-Security-Policy', policy.csp.join('; '), feil);
  for (const [navnet, verdi] of Object.entries(policy.faste)) {
    kravOmNoyaktigEn(rot, navnet, verdi, feil);
  }

  const manifestSti = `${distKatalog}.manifest.json`;
  const produksjon = fs.existsSync(manifestSti) ? JSON.parse(lesTekst(manifestSti)).produksjon === true : false;
  const forventetHtmlCache = produksjon ? policy.cache.html : policy.cache.html.replace('public', 'private');
  kravOmNoyaktigEn(rot, 'Cache-Control', forventetHtmlCache, feil);

  for (const [blokkSti, verdi] of Object.entries(policy.cache.stier)) {
    const blokk = blokker.get(blokkSti);
    if (!blokk) {
      feil.push(`_headers: blokken «${blokkSti}» mangler (sikkerhet/policy.json)`);
      continue;
    }
    kravOmNoyaktigEn(blokk, 'Cache-Control', verdi, feil);
  }
  return feil;
}
