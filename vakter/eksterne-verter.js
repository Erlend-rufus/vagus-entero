import { finnDistFiler, lesTekst, lesOrdliste, lesManifest } from './lib/felles.js';
import { forHvertElement, erJsonldBlokk, normaliserUrl, urlerIAttributter } from './lib/html.js';

export const navn = 'eksterne-verter';

// Ingenting i bygde utdata får peke på et annet domene enn eget. Hvitelisten
// (vakter/ordlister/eksterne-hvitliste.txt) er tom med vilje. data:-URI-er
// stoppes også — CSP-en (img-src 'self') ville uansett blokkert dem stille.
// HTML og SVG leses med ekte parser (vakter/lib/html.js); CSS og JS med
// mønstre som også dekker image-set(), src() og protokollrelative adresser.

const CSS_URL = /(?:url|src|image-set|image)\(\s*['"]?([^'")\s,]+)['"]?/gi;
const CSS_IMPORT = /@import\s+(?:url\(\s*)?['"]?([^'")\s;]+)['"]?/gi;
const ABSOLUTT_I_JS = /(?:https?:|wss?:)?\/\/(?:(?:[a-z0-9-]+\.)+[a-z]{2,}|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?[^\s'"`)]*/gi;

function tillatteVerter(manifest) {
  const verter = new Set();
  if (manifest && manifest.siteUrl) {
    try {
      verter.add(new URL(manifest.siteUrl).host);
    } catch {
      /* ugyldig SITE_URL fanges av bygget */
    }
  }
  for (const oppforing of lesOrdliste('vakter/ordlister/eksterne-hvitliste.txt')) {
    verter.add(oppforing.tekst);
  }
  return verter;
}

// Fjerner CSS-escapes (\2f → /, \/ → /) slik nettleseren gjør, før vurdering.
function avEscapCss(tekst) {
  return tekst
    .replace(/\\([0-9a-f]{1,6})\s?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\(.)/g, '$1');
}

export function vurderUrl(url, kilde, verter, feil) {
  const trimmet = normaliserUrl(url);
  // Protokollrelative URL-er («//vert/…») er eksterne, ikke interne stier.
  if (trimmet.startsWith('//')) {
    vurderUrl(`https:${trimmet}`, kilde, verter, feil);
    return;
  }
  if (
    trimmet === '' ||
    trimmet.startsWith('/') ||
    trimmet.startsWith('#') ||
    trimmet.startsWith('./') ||
    trimmet.startsWith('../') ||
    /^mailto:/i.test(trimmet) ||
    /^tel:/i.test(trimmet)
  ) {
    return;
  }
  if (/^data:/i.test(trimmet)) {
    feil.push(`${kilde}: data:-URI («${trimmet.slice(0, 40)}…») — CSP-en tillater kun 'self'`);
    return;
  }
  // Bare det som faktisk er en URL med skjema vurderes: <meta content> og
  // data="…" bærer ofte vanlig tekst.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmet)) return;
  let host;
  try {
    host = new URL(trimmet).host;
  } catch {
    feil.push(`${kilde}: uforståelig URL «${trimmet}»`);
    return;
  }
  if (host === '') return;
  if (!verter.has(host)) {
    feil.push(`${kilde}: ekstern vert «${host}» («${trimmet.slice(0, 80)}») — hvitelisten er tom med vilje`);
  }
}

export function skannCss(css, fil, verter, feil) {
  const ren = avEscapCss(css);
  for (const monster of [CSS_URL, CSS_IMPORT]) {
    monster.lastIndex = 0;
    let m;
    while ((m = monster.exec(ren)) !== null) vurderUrl(m[1], fil, verter, feil);
  }
}

export function skannJs(js, fil, verter, feil) {
  // \u- og \x-escaping i strenger dekodes før skann.
  const ren = js
    .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  ABSOLUTT_I_JS.lastIndex = 0;
  let m;
  while ((m = ABSOLUTT_I_JS.exec(ren)) !== null) {
    // XML-navnerom (createElementNS) er identifikatorer, aldri
    // nettverksressurser — samme unntak som schema.org i JSON-LD.
    if (m[0].startsWith('http://www.w3.org/')) continue;
    vurderUrl(m[0], fil, verter, feil);
  }
}

export function skannHtml(kilde, fil, verter, feil, { fragment = false } = {}) {
  forHvertElement(
    kilde,
    (el) => {
      if (erJsonldBlokk(el)) return; // https://schema.org er identifikator, hentes aldri
      for (const { attributt, url } of urlerIAttributter(el)) {
        // <meta http-equiv="refresh" content="0;url=…"> bærer målet bak «url=».
        const omdirigering = attributt === 'content' && /^\s*\d*\s*[;,]\s*url\s*=/i.test(url)
          ? url.replace(/^\s*\d*\s*[;,]\s*url\s*=\s*['"]?/i, '').replace(/['"]\s*$/, '')
          : url;
        vurderUrl(omdirigering, fil, verter, feil);
      }
      if (el.attributter.has('style')) skannCss(el.attributter.get('style'), `${fil} (style=)`, verter, feil);
      if (el.navn === 'style') skannCss(el.tekst(), `${fil} (<style>)`, verter, feil);
      if (el.navn === 'script') skannJs(el.tekst(), `${fil} (<script>)`, verter, feil);
    },
    { fragment }
  );
}

export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const verter = tillatteVerter(manifest);
  const feil = [];

  for (const fil of finnDistFiler(distKatalog, ['.html', '.htm', '.xhtml'])) {
    skannHtml(lesTekst(fil), fil, verter, feil);
  }
  for (const fil of finnDistFiler(distKatalog, ['.css'])) skannCss(lesTekst(fil), fil, verter, feil);
  for (const fil of finnDistFiler(distKatalog, ['.js', '.mjs'])) skannJs(lesTekst(fil), fil, verter, feil);
  // SVG-filer kan bære <image href>, <use href>, <script> og @import.
  for (const fil of finnDistFiler(distKatalog, ['.svg'])) {
    const svg = lesTekst(fil);
    skannHtml(svg, fil, verter, feil, { fragment: true });
    if (/<script\b/i.test(svg)) feil.push(`${fil}: <script> i SVG — bildefiler skal ikke inneholde kode`);
  }

  return feil;
}
