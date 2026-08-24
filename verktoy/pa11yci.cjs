// pa11y-ci-konfigurasjon: tester ALLE sider fra byggmanifestet mot WCAG 2.2 AA
// med axe-motoren (HTML_CodeSniffer henger etter på 2.2 og er støyete).
// Kjøres mot lokalt servert dist (verktoy/server.js).
const fs = require('node:fs');

const manifestSti = process.env.DIST_MANIFEST || 'dist.manifest.json';
const port = process.env.PA11Y_PORT || '8878';
const manifest = JSON.parse(fs.readFileSync(manifestSti, 'utf8'));

const chromeLaunchConfig = { args: ['--no-sandbox', '--disable-dev-shm-usage'] };
if (process.env.PA11Y_CHROME) {
  chromeLaunchConfig.executablePath = process.env.PA11Y_CHROME;
}

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    runners: ['axe'],
    timeout: 30000,
    chromeLaunchConfig
  },
  urls: manifest.sider.map((side) => `http://localhost:${port}${side.url}`)
};
