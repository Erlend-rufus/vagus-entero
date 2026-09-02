import fs from 'node:fs';
import path from 'node:path';
import { finnDistFiler, lesTekst } from './lib/felles.js';
import { forHvertElement, normaliserUrl, urlerIAttributter } from './lib/html.js';

export const navn = 'lenker';

// Autoritativ intern lenkesjekk mot RENDRET HTML: en GODKJENT side kan ikke
// lenke i brødteksten til en side som ikke finnes i bygget (i produksjon:
// som ikke er GODKJENT — den finnes da ikke i dist). Deklarasjonsfeltet
// interne_lenker_ut valideres separat; det er HTML-en som er fasit. Lest med
// ekte HTML-parser: attributter uten anførselstegn, srcset og poster telles.
function finnesSomFil(sti) {
  return fs.existsSync(sti) && fs.statSync(sti).isFile();
}

export function kjorDist(distKatalog) {
  const feil = [];

  for (const fil of finnDistFiler(distKatalog, ['.html', '.htm'])) {
    forHvertElement(lesTekst(fil), (el) => {
      for (const { attributt, url } of urlerIAttributter(el)) {
        if (attributt === 'content') continue; // <meta content> er tekst, ikke sti
        const normalisert = normaliserUrl(url);
        if (!normalisert.startsWith('/') || normalisert.startsWith('//')) continue;
        const raa = normalisert.split('#')[0].split('?')[0];
        // «.» og «..» i en intern sti er aldri legitimt i et statisk bygg — de
        // kan bare peke ut av dist, og normaliseres ellers stille bort.
        if (raa.split('/').some((del) => del === '..' || del === '.')) {
          feil.push(`${fil}: intern lenke «${raa}» inneholder «.»/«..» — stier skal være absolutte fra rot`);
          continue;
        }
        if (raa === '' || raa === '/') {
          if (raa === '/' && !finnesSomFil(path.join(distKatalog, 'index.html'))) {
            feil.push(`${fil}: lenker til «/», men forsiden finnes ikke i dette bygget`);
          }
          continue;
        }
        const kandidater = raa.endsWith('/')
          ? [path.join(distKatalog, raa, 'index.html')]
          : [path.join(distKatalog, raa), path.join(distKatalog, raa, 'index.html')];
        if (!kandidater.some(finnesSomFil)) {
          feil.push(`${fil}: intern lenke «${raa}» peker på noe som ikke finnes i bygget`);
        }
      }
    });
  }
  return feil;
}
