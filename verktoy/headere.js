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

  return linjer.join('\n') + '\n';
}

export function lagRobotsInnhold(miljo) {
  if (miljo.produksjon && miljo.siteUrl) {
    return `User-agent: *\nAllow: /\n\nSitemap: ${miljo.siteUrl.replace(/\/$/, '')}/sitemap.xml\n`;
  }
  return 'User-agent: *\nDisallow: /\n';
}
