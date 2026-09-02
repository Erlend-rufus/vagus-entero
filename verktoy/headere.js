import fs from 'node:fs';

// Bygger innholdet i Netlify-_headers fra sikkerhet/policy.json + miljøet.
// Samme funksjon brukes av bygget (generering) og vaktene (fasit) — generator
// og kontroll kan ikke drifte fra hverandre.

export function lesPolicy() {
  return JSON.parse(fs.readFileSync('sikkerhet/policy.json', 'utf8'));
}

export function lagHeadersInnhold(miljo, policy = lesPolicy()) {
  const linjer = ['/*'];
  linjer.push(`  Content-Security-Policy: ${policy.csp.join('; ')}`);
  for (const [navn, verdi] of Object.entries(policy.faste)) {
    linjer.push(`  ${navn}: ${verdi}`);
  }

  if (miljo.noindex) {
    linjer.push('  X-Robots-Tag: noindex, nofollow');
  }

  if (!miljo.produksjon && miljo.basicAuthBruker && miljo.basicAuthPassord) {
    linjer.push(`  Basic-Auth: ${miljo.basicAuthBruker}:${miljo.basicAuthPassord}`);
  }

  // Mellomlagring: HTML revalideres alltid (innhold kan trekkes tilbake),
  // fonter, stiler og bilder er stabile filer og kan ligge en uke i
  // nettleseren. Ingen «immutable» — filnavnene er ikke innholdshashet.
  linjer.push(`  Cache-Control: ${policy.cache.html}`);
  for (const [sti, verdi] of Object.entries(policy.cache.stier)) {
    linjer.push(sti, `  Cache-Control: ${verdi}`);
  }

  return linjer.join('\n') + '\n';
}

export function lagRobotsInnhold(miljo) {
  if (miljo.produksjon && miljo.siteUrl) {
    return `User-agent: *\nAllow: /\n\nSitemap: ${miljo.siteUrl.replace(/\/$/, '')}/sitemap.xml\n`;
  }
  return 'User-agent: *\nDisallow: /\n';
}
