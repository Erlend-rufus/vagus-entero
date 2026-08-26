#!/usr/bin/env node
// Tilgjengelighetstest: kjører axe-core direkte mot alle sider i byggmanifestet,
// WCAG 2.2 AA. Erstatter pa11y-ci, som regnet axe sine «incomplete»-funn
// (uavklarte, f.eks. bakgrunnsfarge axe ikke kan beregne under lagvise/faste
// scener) som brudd. Her skilles de: bekreftede brudd feiler kjøringen,
// uavklarte funn listes som synlige advarsler for manuell sjekk — den manuelle
// sjekklisten i docs/ er uansett ikke valgfri.
//
// Bruk: node verktoy/a11y-test.mjs [dist-katalog] [port]
// Miljø: A11Y_CHROME (ev. CHROME_PATH) = sti til Chrome/Chromium-binær.

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';

const require = createRequire(import.meta.url);

const katalog = process.argv[2] || 'dist';
const port = Number(process.argv[3] || 8878);
const manifestSti = `${katalog.replace(/\/+$/, '')}.manifest.json`;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const CHROME_KANDIDATER = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/opt/pw-browsers/chromium'
];

function finnChrome() {
  const fraMiljo = process.env.A11Y_CHROME || process.env.CHROME_PATH;
  if (fraMiljo) {
    if (!fs.existsSync(fraMiljo)) {
      throw new Error(`A11Y_CHROME peker på «${fraMiljo}», men filen finnes ikke.`);
    }
    return fraMiljo;
  }
  const funnet = CHROME_KANDIDATER.find((sti) => fs.existsSync(sti));
  if (!funnet) {
    throw new Error(
      'Fant ingen Chrome/Chromium-binær. Sett miljøvariabelen A11Y_CHROME til stien.'
    );
  }
  return funnet;
}

function startServer() {
  const server = spawn(process.execPath, ['verktoy/server.js', katalog, String(port)], {
    stdio: 'ignore'
  });
  server.unref();
  return server;
}

async function ventPaServer() {
  for (let forsok = 0; forsok < 50; forsok += 1) {
    try {
      await fetch(`http://localhost:${port}/`);
      return;
    } catch {
      await new Promise((los) => setTimeout(los, 100));
    }
  }
  throw new Error(`Serveren på port ${port} svarte aldri.`);
}

function beskrivNoder(noder) {
  return noder
    .slice(0, 5)
    .map((node) => `      ${node.target.join(' ')}`)
    .join('\n');
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestSti, 'utf8'));
  const chromeSti = finnChrome();
  const axeSti = path.join(path.dirname(require.resolve('axe-core')), 'axe.min.js');

  const server = startServer();
  await ventPaServer();

  const browser = await puppeteer.launch({
    executablePath: chromeSti,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  let brudd = 0;
  let uavklarte = 0;

  try {
    for (const side of manifest.sider) {
      const url = `http://localhost:${port}${side.url}`;
      const fane = await browser.newPage();
      await fane.setViewport({ width: 1280, height: 800 });
      await fane.goto(url, { waitUntil: 'load', timeout: 30000 });
      await fane.addScriptTag({ path: axeSti });
      const resultat = await fane.evaluate(
        (tags) =>
          window.axe.run(document, {
            runOnly: { type: 'tag', values: tags },
            resultTypes: ['violations', 'incomplete']
          }),
        WCAG_TAGS
      );
      await fane.close();

      console.log(`\n${side.url}`);
      if (resultat.violations.length === 0 && resultat.incomplete.length === 0) {
        console.log('  OK — ingen funn');
        continue;
      }
      for (const funn of resultat.violations) {
        brudd += funn.nodes.length;
        console.log(`  BRUDD  ${funn.id} (${funn.impact}): ${funn.help}`);
        console.log(beskrivNoder(funn.nodes));
      }
      for (const funn of resultat.incomplete) {
        uavklarte += funn.nodes.length;
        console.log(`  ADVARSEL (uavklart, sjekk manuelt)  ${funn.id}: ${funn.help}`);
        console.log(beskrivNoder(funn.nodes));
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(
    `\n${manifest.sider.length} sider testet: ${brudd} brudd, ${uavklarte} uavklarte funn.`
  );
  if (brudd > 0) {
    console.error('Tilgjengelighetstesten FEILER — rett bruddene over.');
    process.exit(1);
  }
}

main().catch((feil) => {
  console.error(`Tilgjengelighetstesten kunne ikke kjøre: ${feil.message}`);
  process.exit(1);
});
