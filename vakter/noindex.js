import fs from 'node:fs';
import path from 'node:path';
import { finnDistFiler, lesTekst, lesManifest } from './lib/felles.js';

export const navn = 'noindex';

// Miljøgaten etterprøvd mot faktiske utdata:
// - Uten PRODUKSJON: noindex overalt (header + meta), Disallow i robots.txt,
//   ingen sitemap, og Basic-Auth når bygget skjer hos Netlify.
// - Med PRODUKSJON: ingen gjenglemt noindex/Disallow/Basic-Auth, sitemap finnes.
export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  const feil = [];

  const headersSti = path.join(distKatalog, '_headers');
  const robotsSti = path.join(distKatalog, 'robots.txt');
  const sitemapSti = path.join(distKatalog, 'sitemap.xml');

  if (!fs.existsSync(headersSti)) return [`${headersSti} mangler — bygget skal alltid skrive den`];
  if (!fs.existsSync(robotsSti)) return [`${robotsSti} mangler — bygget skal alltid skrive den`];

  const headers = lesTekst(headersSti);
  const robots = lesTekst(robotsSti);
  const htmlFiler = finnDistFiler(distKatalog, ['.html']);

  if (manifest.produksjon) {
    if (headers.includes('X-Robots-Tag')) {
      feil.push('_headers: gjenglemt X-Robots-Tag i produksjonsbygg — nettstedet blir ikke indeksert');
    }
    if (headers.includes('Basic-Auth')) {
      feil.push('_headers: gjenglemt Basic-Auth i produksjonsbygg — nettstedet blir utilgjengelig');
    }
    if (robots.includes('Disallow: /\n') || robots.trim().endsWith('Disallow: /')) {
      feil.push('robots.txt: gjenglemt «Disallow: /» i produksjonsbygg');
    }
    if (!fs.existsSync(sitemapSti)) {
      feil.push('sitemap.xml mangler i produksjonsbygg');
    }
    for (const fil of htmlFiler) {
      if (/<meta name="robots" content="noindex/.test(lesTekst(fil))) {
        feil.push(`${fil}: gjenglemt meta-robots noindex i produksjonsbygg`);
      }
    }
  } else {
    if (!headers.includes('X-Robots-Tag: noindex, nofollow')) {
      feil.push('_headers: mangler X-Robots-Tag noindex i bygg uten PRODUKSJON');
    }
    if (!robots.includes('Disallow: /')) {
      feil.push('robots.txt: mangler «Disallow: /» i bygg uten PRODUKSJON');
    }
    if (fs.existsSync(sitemapSti)) {
      feil.push('sitemap.xml finnes i bygg uten PRODUKSJON — den skal ikke genereres der');
    }
    if (manifest.basicAuthPakrevd && !headers.includes('Basic-Auth: ')) {
      feil.push('_headers: mangler Basic-Auth i Netlify-bygg utenfor production-konteksten');
    }
    for (const fil of htmlFiler) {
      if (!/<meta name="robots" content="noindex, nofollow">/.test(lesTekst(fil))) {
        feil.push(`${fil}: mangler meta-robots noindex i bygg uten PRODUKSJON`);
      }
    }
  }
  return feil;
}
