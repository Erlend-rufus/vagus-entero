import path from 'node:path';
import { finnRepoTekstfiler, lesTekst } from './lib/felles.js';

export const navn = 'norsk-i-maler';

// Whitelist-prinsipp: maler får ikke inneholde LITTERÆR tekst i det hele
// tatt — alt synlig språk skal komme fra ui.json (grensesnitt) eller
// src/innhold/ (pasienttekst). Dermed fanges også norsk uten æøå.
//
// Unntatt, dokumentert i docs/VAKTER.md:
// - src/komponentkatalog.njk: internt utviklingsverktøy med ikke-språklig
//   fylltekst, finnes aldri i produksjonsbygg (gate + vakt).
const UNNTATTE_MALER = new Set(['src/komponentkatalog.njk']);

const SPRAAKLIGE_ATTRIBUTTER = /(aria-label|aria-description|alt|title|placeholder)\s*=\s*["']([^"']*)["']/gi;

function fjernTemplating(tekst) {
  return tekst
    .replace(/\{#[\s\S]*?#\}/g, '')
    .replace(/\{%[\s\S]*?%\}/g, '')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

export function skannMal(tekst, kilde) {
  const feil = [];
  const uten = fjernTemplating(tekst);

  // Tekstnoder: alt mellom > og < som inneholder to eller flere bokstaver.
  const tekstnoder = uten.matchAll(/>([^<>]+)</g);
  for (const m of tekstnoder) {
    const node = m[1].replace(/\s+/g, ' ').trim();
    if (/\p{L}{2,}/u.test(node)) {
      feil.push(
        `${kilde}: litterær tekst «${node.slice(0, 60)}» i mal — synlig språk skal komme fra ui.json eller innholdsfiler`
      );
    }
  }

  // Språkbærende attributter skal aldri ha hardkodet verdi.
  SPRAAKLIGE_ATTRIBUTTER.lastIndex = 0;
  let a;
  while ((a = SPRAAKLIGE_ATTRIBUTTER.exec(uten)) !== null) {
    if (/\p{L}{2,}/u.test(a[2])) {
      feil.push(`${kilde}: hardkodet ${a[1]}=«${a[2]}» — bruk ui.json`);
    }
  }
  return feil;
}

// JS og CSS: heuristisk — norske tegn eller vanlige norske småord i
// strengliterale/content-egenskaper.
const NORSK_HEURISTIKK = /[æøåÆØÅ]|(?<![\p{L}])(og|eller|ikke|med|til|fra|hos|våre|dine)(?![\p{L}])/u;

export function skannJsOgCss(tekst, kilde) {
  const feil = [];
  const literaler =
    kilde.endsWith('.css')
      ? [...tekst.matchAll(/content\s*:\s*["']([^"']+)["']/g)].map((m) => m[1])
      : [...tekst.matchAll(/["'`]([^"'`\n]{2,})["'`]/g)].map((m) => m[1]);
  for (const literal of literaler) {
    if (NORSK_HEURISTIKK.test(literal)) {
      feil.push(`${kilde}: norsk streng «${literal.slice(0, 60)}» utenfor ui.json`);
    }
  }
  return feil;
}

export function kjorKilde() {
  const feil = [];
  for (const fil of finnRepoTekstfiler()) {
    const normalisert = fil.split(path.sep).join('/');
    if (UNNTATTE_MALER.has(normalisert)) continue;
    if (normalisert.startsWith('src/_includes/') && normalisert.endsWith('.njk')) {
      feil.push(...skannMal(lesTekst(fil), fil));
    } else if (normalisert.startsWith('src/') && normalisert.endsWith('.njk')) {
      feil.push(...skannMal(lesTekst(fil), fil));
    } else if (
      (normalisert.startsWith('src/js/') && normalisert.endsWith('.js')) ||
      (normalisert.startsWith('src/stiler/') && normalisert.endsWith('.css'))
    ) {
      feil.push(...skannJsOgCss(lesTekst(fil), fil));
    }
  }
  return feil;
}
