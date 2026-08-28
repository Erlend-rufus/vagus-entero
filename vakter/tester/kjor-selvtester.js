#!/usr/bin/env node
// Selvtester for vaktene: hver test PLANTER et brudd og krever at vakten
// fanger det. En vakt som stille slutter å virke, feiler dermed CI selv.
// Kun syntetiske testord brukes — aldri reelle oppføringer fra ordlistene.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { sokIOrdliste } from '../lib/felles.js';
import { tilNorsk } from '../lib/norske-meldinger.js';
import { validerInnhold } from '../lib/innholdsvalidering.js';
import * as ordliste from '../ordliste-skann.js';
import * as sporing from '../sporing.js';
import * as lagring from '../lagring.js';
import * as norskIMaler from '../norsk-i-maler.js';
import * as eksterneVerter from '../eksterne-verter.js';
import * as jsonld from '../jsonld.js';
import * as lenker from '../lenker.js';
import * as godkjentStatus from '../godkjent-status.js';
import * as noindex from '../noindex.js';

let feilede = 0;
function krev(betingelse, beskrivelse) {
  if (betingelse) {
    console.log(`  OK   ${beskrivelse}`);
  } else {
    feilede += 1;
    console.error(`  FEIL ${beskrivelse}`);
  }
}

const SYNTETISK = [{ tekst: 'TESTFORBUDTORD', delstreng: false }];
const SYNTETISK_KATEGORI = [
  { kategori: 'testkategori', oppforinger: SYNTETISK, unntak: [] }
];

// --- Ordgrensesemantikk ------------------------------------------------------
krev(
  sokIOrdliste('her står TESTFORBUDTORD midt i', SYNTETISK).length === 1,
  'ordliste: treffer ordet med ordgrenser'
);
krev(
  sokIOrdliste('her står XTESTFORBUDTORDX inne i et annet ord', SYNTETISK).length === 0,
  'ordliste: treffer IKKE inne i andre ord (ordgrense)'
);
krev(
  sokIOrdliste('liten testforbudtord skrivemåte', SYNTETISK).length === 1,
  'ordliste: case-ufølsom'
);
krev(
  sokIOrdliste(' æTESTFORBUDTORD', SYNTETISK).length === 0,
  'ordliste: norske bokstaver teller som ordtegn i grensen'
);
krev(
  sokIOrdliste('ren delstreng: XTESTDELX', [{ tekst: 'TESTDEL', delstreng: true }]).length === 1,
  'ordliste: ~delstreng-oppføring matcher rått'
);
krev(
  sokIOrdliste('frasen TESTFORBUDTORD i godkjent sammenheng', SYNTETISK, [
    { tekst: 'TESTFORBUDTORD i godkjent sammenheng', delstreng: false }
  ]).length === 0,
  'ordliste: unntaksfrase nuller treffet'
);

// --- ordliste-skann.skannTekst ----------------------------------------------
krev(
  ordliste.skannTekst('linje med TESTFORBUDTORD her', 'testfil', SYNTETISK_KATEGORI).length === 1,
  'ordliste-skann: fanger plantet brudd i tekst'
);

// --- sporing -----------------------------------------------------------------
krev(
  sporing.skannTekst('var x = SYNTETISKSPORING("id");', 'testfil', [
    { tekst: 'SYNTETISKSPORING', delstreng: true }
  ]).length === 1,
  'sporing: fanger plantet signatur'
);

// --- lagring -----------------------------------------------------------------
const lagringsToken = ['local', 'Storage'].join('');
krev(
  lagring.skannTekst(`vindu.${lagringsToken}.setItem('a', 'b')`, 'testfil').length === 1,
  'lagring: fanger plantet lagrings-API'
);

// --- norsk-i-maler -----------------------------------------------------------
krev(
  norskIMaler.skannMal('<p>Les mer om dette</p>', 'testmal').length === 1,
  'norsk-i-maler: fanger litterær tekst i mal (også uten æøå)'
);
krev(
  norskIMaler.skannMal('<p>{{ ui.testnokkel }}</p>', 'testmal').length === 0,
  'norsk-i-maler: godtar rene ui.json-oppslag'
);
krev(
  norskIMaler.skannMal('<nav aria-label="Meny lokalt"></nav>', 'testmal').length === 1,
  'norsk-i-maler: fanger hardkodet aria-label'
);

// --- innholdskontrakt --------------------------------------------------------
const gyldigSide = {
  sidetype: 'undersokelse',
  url: '/testside/',
  malgruppe: 'selvbetalende',
  tittel: 'Tittel på testsiden her',
  meta_beskrivelse:
    'En beskrivelse som er akkurat lang nok til å passere kontraktens krav til meta-beskrivelser.',
  status: 'UTKAST',
  godkjent_av: null,
  godkjent_dato: null,
  jsonld_type: null,
  interne_lenker_ut: [],
  apne_punkter: [],
  i_navigasjon: true,
  i_bunntekst: false,
  rekkefolge: 1
};
krev(
  validerInnhold([{ fil: 'test.md', data: gyldigSide }]).length === 0,
  'innholdskontrakt: gyldig side passerer'
);
// --- seksjonsblokker ---------------------------------------------------------
const medSeksjoner = (seksjoner, ekstra = {}) => ({
  ...gyldigSide,
  ...ekstra,
  seksjoner
});
krev(
  validerInnhold([
    {
      fil: 'test.md',
      data: medSeksjoner([
        { type: 'tekst', tittel: 'En overskrift', avsnitt: ['Et avsnitt med tekst.'] }
      ])
    }
  ]).length === 0,
  'seksjoner: gyldig tekstblokk passerer'
);
krev(
  validerInnhold([
    { fil: 'test.md', data: medSeksjoner([{ type: 'finnespaaikke', tittel: 'Noe' }]) }
  ]).length > 0,
  'seksjoner: ukjent blokktype feiler'
);
krev(
  validerInnhold([
    { fil: 'test.md', data: medSeksjoner([{ type: 'tidslinje', tittel: 'Uten punkter' }]) }
  ]).length > 0,
  'seksjoner: tidslinje uten punkter feiler'
);
krev(
  validerInnhold([
    {
      fil: 'test.md',
      data: {
        ...gyldigSide,
        hode_knapper: [{ tekst: 'Les mer', handling: 'intern' }]
      }
    }
  ]).length > 0,
  'knapper: intern handling uten url feiler'
);
krev(
  validerInnhold([
    {
      fil: 'test.md',
      data: {
        ...gyldigSide,
        hode_knapper: [{ tekst: 'Les mer', handling: 'intern', url: '/finnes-ikke/' }]
      }
    }
  ]).length > 0,
  'knapper: intern lenke uten mål feiler'
);
krev(
  validerInnhold([
    {
      fil: 'pris.md',
      data: {
        ...gyldigSide,
        sidetype: 'pris',
        status: 'GODKJENT',
        godkjent_av: 'Testlege',
        godkjent_dato: '2026-01-01',
        priser: [{ navn: 'Undersøkelse', belop_nok: null }]
      }
    }
  ]).length > 0,
  'pris: GODKJENT prisside med uavklart beløp feiler'
);
krev(
  validerInnhold([
    {
      fil: 'test.md',
      data: { ...gyldigSide, overordnet: '/finnes-ikke/' }
    }
  ]).length > 0,
  'brødsmulesti: overordnet uten mål feiler'
);

const { tittel: _utelatt, ...utenTittel } = gyldigSide;
krev(
  validerInnhold([{ fil: 'test.md', data: utenTittel }]).length > 0,
  'innholdskontrakt: manglende obligatorisk felt feiler'
);
krev(
  validerInnhold([
    { fil: 'test.md', data: { ...gyldigSide, status: 'GODKJENT' } }
  ]).some((m) => m.includes('godkjent_av')),
  'innholdskontrakt: GODKJENT uten signatur feiler'
);
krev(
  validerInnhold([
    {
      fil: 'test.md',
      data: { ...gyldigSide, status: 'GODKJENT', godkjent_av: 'Test Person', godkjent_dato: '2026-08-24', apne_punkter: ['x'] }
    }
  ]).some((m) => m.includes('apne_punkter')),
  'innholdskontrakt: GODKJENT med åpne punkter feiler'
);
krev(
  validerInnhold([
    { fil: 'a.md', data: gyldigSide },
    { fil: 'b.md', data: { ...gyldigSide, tittel: 'En annen tittel her ja' } }
  ]).some((m) => m.includes('allerede brukt')),
  'innholdskontrakt: duplikat url feiler'
);
krev(
  tilNorsk([{ keyword: 'required', instancePath: '', params: { missingProperty: 'tittel' } }])[0].includes(
    'obligatorisk'
  ),
  'norske-meldinger: required-feil formidles på norsk'
);

// --- dist-vakter mot plantet midlertidig bygg -------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vakt-test-'));
const dist = path.join(tmp, 'dist');
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(
  `${dist}.manifest.json`,
  JSON.stringify({
    produksjon: false,
    context: 'deploy-preview',
    ciSyntetisk: false,
    basicAuthAktiv: true,
    siteUrl: null,
    sider: [{ url: '/testside/', sidetype: 'undersokelse', status: 'UTKAST' }]
  })
);
fs.writeFileSync(
  path.join(dist, 'index.html'),
  '<!doctype html><html><head><script src="https://ekstern.example/sporing.js"></script></head>' +
    '<body><a href="/finnes-ikke/">x</a>' +
    '<script type="application/ld+json">{"@type":"Review","x":null}</script></body></html>'
);
fs.writeFileSync(path.join(dist, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n');
fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n');

krev(
  eksterneVerter.kjorDist(dist).some((m) => m.includes('ekstern.example')),
  'eksterne-verter: fanger plantet ekstern vert'
);
krev(
  jsonld.kjorDist(dist).some((m) => m.includes('Review')),
  'jsonld: fanger forbudt type'
);
krev(
  jsonld.kjorDist(dist).some((m) => m.includes('null')),
  'jsonld: fanger null-verdi som skulle vært utelatt'
);
krev(
  lenker.kjorDist(dist).some((m) => m.includes('/finnes-ikke/')),
  'lenker: fanger intern lenke uten mål'
);
const noindexFeil = noindex.kjorDist(dist);
krev(
  noindexFeil.some((m) => m.includes('X-Robots-Tag')),
  'noindex: fanger manglende noindex-header utenfor produksjon'
);
krev(
  noindexFeil.some((m) => m.includes('Disallow')),
  'noindex: fanger manglende Disallow utenfor produksjon'
);
krev(
  noindexFeil.some((m) => m.includes('Basic-Auth')),
  'noindex: krever Basic-Auth-linjen når den var aktiv i bygget'
);

// Produksjonsmanifest med UTKAST-side → godkjent-status skal feile.
const distProd = path.join(tmp, 'dist-prod');
fs.mkdirSync(distProd, { recursive: true });
fs.writeFileSync(
  `${distProd}.manifest.json`,
  JSON.stringify({
    produksjon: true,
    context: 'production',
    ciSyntetisk: true,
    basicAuthAktiv: false,
    siteUrl: 'https://example.invalid',
    sider: [{ url: '/testside/', sidetype: 'undersokelse', status: 'UTKAST' }]
  })
);
krev(
  godkjentStatus.kjorDist(distProd).some((m) => m.includes('UTKAST')),
  'godkjent-status: fanger UTKAST-side i produksjonsmanifest'
);

// --- historikk-skann mot midlertidig git-repo -------------------------------
const repo = path.join(tmp, 'repo');
fs.mkdirSync(repo, { recursive: true });
const git = (...a) =>
  execFileSync('git', a, {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 'test@example.invalid',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 'test@example.invalid'
    }
  });
git('init', '-q');
fs.writeFileSync(path.join(repo, 'fil.txt'), 'x');
git('add', '.');
git('commit', '-q', '-m', 'melding som inneholder TESTFORBUDTORD her');
krev(
  ordliste
    .kjorHistorikk({ repoRot: repo, kategorier: SYNTETISK_KATEGORI })
    .some((m) => m.includes('TESTFORBUDTORD')),
  'historikk: fanger plantet ord i commit-melding'
);

fs.rmSync(tmp, { recursive: true, force: true });

if (feilede > 0) {
  console.error(`\n${feilede} selvtester feilet — en eller flere vakter virker ikke.`);
  process.exit(1);
}
console.log('\nAlle selvtester grønne — vaktene beviselig i live.');
