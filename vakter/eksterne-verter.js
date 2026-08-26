import { finnDistFiler, lesTekst, lesOrdliste, lesManifest } from './lib/felles.js';

export const navn = 'eksterne-verter';

// Ingenting i bygde utdata får peke på et annet domene enn eget. Hvitelisten
// (vakter/ordlister/eksterne-hvitliste.txt) er tom med vilje. data:-URI-er
// stoppes også — CSP-en (img-src 'self') ville uansett blokkert dem stille.

const ATTRIBUTT = /(?:src|href|action|formaction|poster)\s*=\s*["']([^"']+)["']/gi;
const SRCSET = /srcset\s*=\s*["']([^"']+)["']/gi;
const CSS_URL = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
const CSS_IMPORT = /@import\s+['"]([^'"]+)['"]/gi;
const ABSOLUTT_I_JS = /https?:\/\/[^\s'"`)]+/gi;

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
  let host;
  try {
    host = new URL(trimmet).host;
  } catch {
    feil.push(`${kilde}: uforståelig URL «${trimmet}»`);
    return;
  }
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
  }

  for (const fil of finnDistFiler(distKatalog, ['.css'])) {
    const css = lesTekst(fil);
    for (const monster of [CSS_URL, CSS_IMPORT]) {
      monster.lastIndex = 0;
      let m;
      while ((m = monster.exec(css)) !== null) {
        vurderUrl(m[1], fil, verter, feil);
      }
    }
  }

  for (const fil of finnDistFiler(distKatalog, ['.js'])) {
    const js = lesTekst(fil);
    ABSOLUTT_I_JS.lastIndex = 0;
    let m;
    while ((m = ABSOLUTT_I_JS.exec(js)) !== null) {
      // XML-navnerom (createElementNS) er identifikatorer, aldri
      // nettverksressurser — samme unntak som schema.org i JSON-LD.
      if (m[0] === 'http://www.w3.org/2000/svg') continue;
      vurderUrl(m[0], fil, verter, feil);
    }
  }

  return feil;
}
