import { finnDistFiler, lesTekst, lesOrdliste, lesManifest } from './lib/felles.js';

export const navn = 'eksterne-verter';

// Ingenting i bygde utdata får peke på et annet domene enn eget. Hvitelisten
// (vakter/ordlister/eksterne-hvitliste.txt) er tom med vilje. data:-URI-er
// stoppes også — CSP-en (img-src 'self') ville uansett blokkert dem stille.

const ATTRIBUTT = /(?:src|href|action|formaction|poster|ping|data|content)\s*=\s*["']([^"']+)["']/gi;
const SRCSET = /srcset\s*=\s*["']([^"']+)["']/gi;
const CSS_URL = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
const CSS_IMPORT = /@import\s+['"]([^'"]+)['"]/gi;
const ABSOLUTT_I_JS = /(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s'"`)]*/gi;
const INLINE_STYLE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const INLINE_SCRIPT = /<script\b(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi;

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

function vurderUrl(url, kilde, verter, feil) {
  const trimmet = url.trim();
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
    trimmet.startsWith('mailto:') ||
    trimmet.startsWith('tel:')
  ) {
    return;
  }
  if (trimmet.startsWith('data:')) {
    feil.push(`${kilde}: data:-URI («${trimmet.slice(0, 40)}…») — CSP-en tillater kun 'self'`);
    return;
  }
  // <meta content="…"> og data="…" bærer ofte vanlig tekst — bare det som
  // faktisk er en URL med vert vurderes.
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
    feil.push(`${kilde}: ekstern vert «${host}» («${trimmet}») — hvitelisten er tom med vilje`);
  }
}

// JSON-LD-skript inneholder https://schema.org som identifikator (aldri
// hentet av nettleseren) — de fjernes før skann av HTML.
function utenJsonld(html) {
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
}

export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const verter = tillatteVerter(manifest);
  const feil = [];

  const skannCss = (css, fil) => {
    for (const monster of [CSS_URL, CSS_IMPORT]) {
      monster.lastIndex = 0;
      let m;
      while ((m = monster.exec(css)) !== null) {
        vurderUrl(m[1], fil, verter, feil);
      }
    }
  };
  const skannJs = (js, fil) => {
    ABSOLUTT_I_JS.lastIndex = 0;
    let m;
    while ((m = ABSOLUTT_I_JS.exec(js)) !== null) {
      // XML-navnerom (createElementNS) er identifikatorer, aldri
      // nettverksressurser — samme unntak som schema.org i JSON-LD.
      if (m[0] === 'http://www.w3.org/2000/svg') continue;
      vurderUrl(m[0], fil, verter, feil);
    }
  };

  for (const fil of finnDistFiler(distKatalog, ['.html'])) {
    const html = utenJsonld(lesTekst(fil));
    for (const monster of [ATTRIBUTT, SRCSET]) {
      monster.lastIndex = 0;
      let m;
      while ((m = monster.exec(html)) !== null) {
        if (monster === SRCSET) {
          for (const del of m[1].split(',')) {
            vurderUrl(del.trim().split(/\s+/)[0], fil, verter, feil);
          }
        } else {
          vurderUrl(m[1], fil, verter, feil);
        }
      }
    }
    // Innebygde <style>- og <script>-blokker skannes som CSS og JS: en
    // @import eller fetch() gjemt i HTML-en skal fanges her, ikke bare i
    // egne filer. (innebygd-kode-vakten forbyr dem uansett.)
    for (const monster of [INLINE_STYLE, INLINE_SCRIPT]) {
      monster.lastIndex = 0;
      let m;
      while ((m = monster.exec(html)) !== null) {
        if (monster === INLINE_STYLE) skannCss(m[1], `${fil} (<style>)`);
        else skannJs(m[1], `${fil} (<script>)`);
      }
    }
  }

  for (const fil of finnDistFiler(distKatalog, ['.css'])) skannCss(lesTekst(fil), fil);
  for (const fil of finnDistFiler(distKatalog, ['.js'])) skannJs(lesTekst(fil), fil);
  // SVG-filer kan bære <image href>, <use href>, <script> og @import.
  for (const fil of finnDistFiler(distKatalog, ['.svg'])) {
    const svg = lesTekst(fil);
    ATTRIBUTT.lastIndex = 0;
    let m;
    while ((m = ATTRIBUTT.exec(svg)) !== null) vurderUrl(m[1], fil, verter, feil);
    const XLINK = /xlink:href\s*=\s*["']([^"']+)["']/gi;
    while ((m = XLINK.exec(svg)) !== null) vurderUrl(m[1], fil, verter, feil);
    skannCss(svg, fil);
    if (/<script\b/i.test(svg)) feil.push(`${fil}: <script> i SVG — bildefiler skal ikke inneholde kode`);
  }

  return feil;
}
