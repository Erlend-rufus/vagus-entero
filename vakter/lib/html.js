import { parse, parseFragment } from 'parse5';

// Vaktene som leser bygd HTML går gjennom en ekte HTML-parser (parse5, samme
// algoritme som nettleserne), ikke regulære uttrykk: entiteter dekodes,
// attributter uten anførselstegn og med tab/linjeskift leses riktig, og ved
// dupliserte attributter gjelder det første — akkurat som i nettleseren.

export function parseDokument(kilde, { fragment = false } = {}) {
  return fragment ? parseFragment(kilde) : parse(kilde);
}

// Går gjennom alle elementer i dokumentrekkefølge. Tilbakekallet får
// { navn, attributter (Map, første forekomst vinner), tekst() for
// script/style-innhold, node }.
export function forHvertElement(kilde, tilbakekall, opsjoner) {
  const dokument = parseDokument(kilde, opsjoner);
  const gaa = (node) => {
    if (node.tagName) {
      const attributter = new Map();
      for (const a of node.attrs || []) {
        const navn = a.name.toLowerCase();
        if (!attributter.has(navn)) attributter.set(navn, a.value);
      }
      tilbakekall({
        navn: node.tagName.toLowerCase(),
        attributter,
        tekst: () => (node.childNodes || []).map((b) => b.value || '').join(''),
        node
      });
    }
    for (const barn of node.childNodes || []) gaa(barn);
    if (node.content) gaa(node.content); // <template>
  };
  gaa(dokument);
}

// Elementet er en JSON-LD-datablokk bare når det FØRSTE type-attributtet sier
// det — et duplisert type-attributt lenger bak teller ikke i nettleseren.
export function erJsonldBlokk(element) {
  return (
    element.navn === 'script' &&
    (element.attributter.get('type') || '').trim().toLowerCase() === 'application/ld+json'
  );
}

export function hentJsonldBlokker(html) {
  const blokker = [];
  forHvertElement(html, (el) => {
    if (erJsonldBlokk(el)) blokker.push(el.tekst());
  });
  return blokker;
}

// Nettleseren behandler «\» som «/» i URL-er og stripper kontrolltegn og
// mellomrom rundt skjemaet. Normaliseres før vurdering.
export function normaliserUrl(url) {
  return String(url)
    .replace(/[\x00-\x20\x7f]/g, '')
    .replace(/\\/g, '/');
}

// Alle attributter som kan peke på en ressurs eller et navigasjonsmål.
export const URL_ATTRIBUTTER = new Set([
  'src', 'href', 'action', 'formaction', 'poster', 'ping', 'data', 'content',
  'xlink:href', 'cite', 'background', 'longdesc', 'manifest', 'icon'
]);
export const SRCSET_ATTRIBUTTER = new Set(['srcset', 'imagesrcset']);

export function* urlerIAttributter(element) {
  for (const [navn, verdi] of element.attributter) {
    if (SRCSET_ATTRIBUTTER.has(navn)) {
      for (const del of verdi.split(',')) {
        const url = del.trim().split(/\s+/)[0];
        if (url) yield { attributt: navn, url };
      }
    } else if (URL_ATTRIBUTTER.has(navn)) {
      // <meta content> bærer ofte vanlig tekst; mottakeren vurderer bare
      // verdier som faktisk har et URL-skjema.
      yield { attributt: navn, url: verdi };
    }
  }
}
