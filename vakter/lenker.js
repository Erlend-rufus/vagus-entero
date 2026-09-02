import fs from 'node:fs';
import path from 'node:path';
import { finnDistFiler, lesTekst } from './lib/felles.js';

export const navn = 'lenker';

// Autoritativ intern lenkesjekk mot RENDRET HTML: en GODKJENT side kan ikke
// lenke i brødteksten til en side som ikke finnes i bygget (i produksjon:
// som ikke er GODKJENT — den finnes da ikke i dist). Deklarasjonsfeltet
// interne_lenker_ut valideres separat; det er HTML-en som er fasit.
export function kjorDist(distKatalog) {
  const feil = [];
  const monster = /(?:href|src)\s*=\s*["'](\/[^"']*)["']/gi;

  for (const fil of finnDistFiler(distKatalog, ['.html'])) {
    const html = lesTekst(fil);
    monster.lastIndex = 0;
    let m;
    while ((m = monster.exec(html)) !== null) {
      const raa = m[1].split('#')[0].split('?')[0];
      // «..» i en intern sti er aldri legitimt i et statisk bygg — det kan
      // bare peke ut av dist, og normaliseres ellers stille bort.
      if (raa.split('/').includes('..') || raa.split('/').includes('.')) {
        feil.push(`${fil}: intern lenke «${raa}» inneholder «.»/«..» — stier skal være absolutte fra rot`);
        continue;
      }
      if (raa === '' || raa === '/') {
        if (!fs.existsSync(path.join(distKatalog, 'index.html')) && raa === '/') {
          feil.push(`${fil}: lenker til «/», men forsiden finnes ikke i dette bygget`);
        }
        continue;
      }
      const kandidater = raa.endsWith('/')
        ? [path.join(distKatalog, raa, 'index.html')]
        : [path.join(distKatalog, raa), path.join(distKatalog, raa, 'index.html')];
      if (!kandidater.some((k) => fs.existsSync(k))) {
        feil.push(`${fil}: intern lenke «${raa}» peker på noe som ikke finnes i bygget`);
      }
    }
  }
  return feil;
}
