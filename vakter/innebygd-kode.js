import { finnDistFiler, lesTekst } from './lib/felles.js';
import { forHvertElement, erJsonldBlokk, normaliserUrl } from './lib/html.js';

export const navn = 'innebygd-kode';

// Nettstedet har ingen JavaScript, ingen skjema og ingen innebygde rammer.
// Skulle noe av det dukke opp i bygde HTML-filer — via en innholdsfil, en
// mal eller en avhengighet — skal bygget stoppe, ikke CSP-en i nettleseren
// være siste skanse. Åpnes det for skript senere (bestillingsportalen), er
// det en bevisst endring av denne listen. Lest med ekte HTML-parser: se
// vakter/lib/html.js.

const FORBUDTE_ELEMENTER = new Set([
  'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet',
  'form', 'input', 'textarea', 'select', 'button', 'base'
]);

export function skannHtml(kilde, fil, { fragment = false } = {}) {
  const feil = [];
  const meld = (hva, el) => {
    const attr = [...el.attributter].map(([k, v]) => `${k}="${v}"`).join(' ').slice(0, 60);
    feil.push(`${fil}: ${hva} (<${el.navn} ${attr}>) — nettstedet skal ikke ha innebygd kode`);
  };
  forHvertElement(
    kilde,
    (el) => {
      if (el.navn === 'script' && !erJsonldBlokk(el)) meld('<script> utenfor JSON-LD', el);
      if (FORBUDTE_ELEMENTER.has(el.navn)) meld(`<${el.navn}>-element (innebygd kode, ramme eller skjemaelement)`, el);
      if (el.navn === 'meta') {
        const httpEquiv = (el.attributter.get('http-equiv') || '').trim().toLowerCase();
        if (httpEquiv === 'refresh') meld('meta refresh', el);
        if (httpEquiv === 'content-security-policy') meld('CSP i meta (policyen bor i _headers)', el);
      }
      if (el.navn === 'link') {
        const rel = (el.attributter.get('rel') || '').toLowerCase().split(/\s+/);
        for (const r of ['import', 'prefetch', 'prerender', 'modulepreload']) {
          if (rel.includes(r)) meld(`<link rel="${r}">`, el);
        }
      }
      for (const [attrNavn, verdi] of el.attributter) {
        if (/^on[a-z]/.test(attrNavn)) meld(`${attrNavn}-hendelsesattributt`, el);
        if (attrNavn === 'style') meld('style=-attributt (CSP blokkerer det stille)', el);
        if (attrNavn === 'ping') meld('ping-attributt', el);
        if (attrNavn === 'srcdoc') meld('srcdoc-attributt', el);
        const url = normaliserUrl(verdi).toLowerCase();
        if (/^(javascript|vbscript|data):/.test(url)) meld(`${attrNavn}="${url.slice(0, 20)}…" (kode-/data-URL)`, el);
      }
    },
    { fragment }
  );
  return feil;
}

export function kjorDist(distKatalog) {
  const feil = [];
  for (const fil of finnDistFiler(distKatalog, ['.html', '.htm', '.xhtml'])) {
    feil.push(...skannHtml(lesTekst(fil), fil));
  }
  for (const fil of finnDistFiler(distKatalog, ['.svg'])) {
    feil.push(...skannHtml(lesTekst(fil), fil, { fragment: true }));
  }
  return feil;
}
