// Lighthouse CI: ytelsesbudsjettet som harde feilgrenser, målt mot lokalt
// servert dist med gzip (reell overført størrelse). Tall fra planens punkt 8.
const fs = require('node:fs');

const manifestSti = process.env.DIST_MANIFEST || 'dist.manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestSti, 'utf8'));
const port = process.env.LHCI_PORT || '8877';

module.exports = {
  ci: {
    collect: {
      url: manifest.sider.map((side) => `http://localhost:${port}${side.url}`),
      startServerCommand: `node verktoy/server.js ${process.env.LHCI_DIST || 'dist'} ${port}`,
      startServerReadyPattern: 'Serverer',
      // Tre kjøringer med median: delte CI-runnere gir enkeltmålinger med
      // stor støy (simulert throttling ganger observert CPU-tid med 4×) —
      // budsjettallene under er uendret, det er målingen som stabiliseres.
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      aggregationMethod: 'median-run',
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 20480 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 25600 }],
        'resource-summary:document:size': ['error', { maxNumericValue: 25600 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 61440 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 204800 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 307200 }],
        'is-crawlable': 'off'
      }
    },
    // Rapporter lagres lokalt (kan lastes opp som CI-artefakt) — aldri til
    // tredjeparts lagring.
    upload: { target: 'filesystem', outputDir: '.lighthouseci' }
  }
};
