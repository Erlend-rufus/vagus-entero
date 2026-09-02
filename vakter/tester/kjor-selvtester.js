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
import * as priserITekst from '../priser-i-tekst.js';
import * as tekstKommer from '../tekst-kommer.js';
import * as noindex from '../noindex.js';
import * as innebygdKode from '../innebygd-kode.js';
import * as headere from '../headere.js';
import * as klinikkLansering from '../klinikk-lansering.js';
import * as uiKryssjekk from '../ui-kryssjekk.js';
import { validerKlinikk, validerUi } from '../lib/datavalidering.js';
import { lesInnholdsfil } from '../lib/les-innhold.js';
import { lesMiljo } from '../../verktoy/miljo-logikk.js';
import { formaterTekst, brodsmuletekst } from '../../verktoy/tekst.js';
import { lagJsonld } from '../../verktoy/jsonld.js';

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

// --- priser-i-tekst ----------------------------------------------------------
krev(
  priserITekst.skannData({ seksjoner: [{ type: 'tekst', avsnitt: ['Undersøkelsen koster 4 500 kr.'] }] }).length === 1,
  'priser-i-tekst: fanger beløp i avsnitt'
);
krev(
  priserITekst.skannData({ seksjoner: [{ type: 'sporsmal', sporsmal: [{ sporsmal: 'Pris?', svar: 'Fra kr 900' }] }] }).length === 1,
  'priser-i-tekst: fanger «kr 900» i svar'
);
krev(
  priserITekst.skannData({ seksjoner: [{ type: 'pris', tittel: 'Pris', avsnitt: ['Du betaler selv.'], priser: [{ navn: 'X', belop_nok: 4500 }] }] }).length === 0,
  'priser-i-tekst: godtar beløp i priser-feltet og tekst uten tall'
);
krev(
  priserITekst.skannData({ ingress: 'Vi åpner 1. januar 2027, og du er hjemme samme dag.' }).length === 0,
  'priser-i-tekst: årstall og datoer er ikke beløp'
);

// --- tekst-kommer ------------------------------------------------------------
{
  const midl = fs.mkdtempSync(path.join(os.tmpdir(), 'tekst-kommer-'));
  fs.mkdirSync(path.join(midl, 'dist', 'side'), { recursive: true });
  fs.writeFileSync(path.join(midl, 'dist', 'side', 'index.html'), '<p>[TEKST KOMMER]</p>');
  fs.writeFileSync(path.join(midl, 'dist.manifest.json'), JSON.stringify({ produksjon: true, sider: [] }));
  krev(tekstKommer.kjorDist(path.join(midl, 'dist')).length === 1, 'tekst-kommer: fanger plassholder i produksjonsbygg');
  fs.writeFileSync(path.join(midl, 'dist.manifest.json'), JSON.stringify({ produksjon: false, sider: [] }));
  krev(tekstKommer.kjorDist(path.join(midl, 'dist')).length === 0, 'tekst-kommer: tillater plassholder i forhåndsvisning');
  fs.rmSync(midl, { recursive: true, force: true });
}

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


// --- ordliste: «*»-endelse for egennavn ---------------------------------------
krev(
  sokIOrdliste('utstyret er TESTNAVNETS og TESTNAVN-utstyr', [{ tekst: 'TESTNAVN', delstreng: false, endelse: true }]).length === 2,
  'ordliste: *-oppføring treffer bøyning og sammensetning'
);
krev(
  sokIOrdliste('ordet XTESTNAVN inne i annet', [{ tekst: 'TESTNAVN', delstreng: false, endelse: true }]).length === 0,
  'ordliste: *-oppføring krever fortsatt ordgrense foran'
);

// --- tekst-filteret: escaping, interne lenker, linjeskift -------------------
krev(
  formaterTekst('a <b>b</b> & "c"') === 'a &lt;b&gt;b&lt;/b&gt; &amp; &quot;c&quot;',
  'tekst: all HTML escapes'
);
krev(
  formaterTekst('se [priser](/priser/) her') === 'se <a href="/priser/">priser</a> her',
  'tekst: intern lenke rendres'
);
krev(
  !formaterTekst('se [x](https://ekstern.example/) her').includes('<a '),
  'tekst: ekstern lenke blir ikke lenke'
);
krev(
  !formaterTekst('[x](javascript:alert(1))').includes('<a '),
  'tekst: javascript:-lenke blir ikke lenke'
);
krev(formaterTekst('linje 1\nlinje 2') === 'linje 1<br>linje 2', 'tekst: linjeskift blir <br>');
krev(
  brodsmuletekst('Kikkertundersøkelse av tykktarmen (koloskopi)') === 'Kikkertundersøkelse av tykktarmen',
  'brødsmule: parentesen til slutt fjernes'
);

// --- JSON-LD: «<» kan aldri lukke script-elementet -------------------------
{
  const ld = lagJsonld(
    { status: 'GODKJENT', jsonld_type: 'MedicalCondition', tittel: 'x</script><b>', meta_beskrivelse: 'y', url: '/x/' },
    {},
    { siteUrl: 'https://example.invalid' }
  );
  krev(ld && !ld.includes('</script>') && ld.includes('\\u003c/script>'), 'jsonld: «<» i verdier escapes');
}

// --- innholdsleser: frontmatter kan ikke være kode --------------------------
{
  const midl = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-'));
  const fil = path.join(midl, 'kode.md');
  fs.writeFileSync(fil, '---js\n{ sidetype: "statisk" }\n---\n');
  let kastet = false;
  try {
    lesInnholdsfil(fil);
  } catch (e) {
    kastet = /---/.test(e.message);
  }
  krev(kastet, 'les-innhold: «---js»-frontmatter avvises');
  fs.rmSync(midl, { recursive: true, force: true });
}

// --- miljøtolkning -----------------------------------------------------------
{
  let kastet = false;
  try {
    lesMiljo({ PRODUKSJON: '0' });
  } catch (e) {
    kastet = e.message.includes('PRODUKSJON');
  }
  krev(kastet, 'miljo: PRODUKSJON=0 stopper bygget i stedet for å tolkes');
  krev(lesMiljo({ PRODUKSJON: '1', CONTEXT: 'deploy-preview' }).produksjon === false, 'miljo: preview-kontekst overstyrer PRODUKSJON');
  krev(lesMiljo({ PRODUKSJON: '1', CONTEXT: 'production' }).produksjon === true, 'miljo: PRODUKSJON=1 i production-kontekst er produksjon');
  let kastet2 = false;
  try {
    lesMiljo({ CI_SYNTETISK: '1', NETLIFY: 'true' });
  } catch (e) {
    kastet2 = e.message.includes('CI_SYNTETISK');
  }
  krev(kastet2, 'miljo: CI_SYNTETISK i Netlify-bygg stopper bygget');
}

// --- datafiler: klinikk.json og ui.json mot skjema --------------------------
{
  const gyldigKlinikk = {
    juridisk_navn: 'Testklinikken AS', visningsnavn: 'Testklinikken', kortnavn: 'Test', domene: 'test.invalid',
    org_nr: '123456789', mva_status: null, adresse: null, telefon: null, epost: null, lege: null, tilsyn: null,
    bestilling: null, apningstider: null, ventetid: null
  };
  krev(validerKlinikk(gyldigKlinikk, 'test.json').length === 0, 'datafiler: gyldig klinikk.json passerer');
  krev(
    validerKlinikk({ ...gyldigKlinikk, org_nr: '12345678' }, 'test.json').some((m) => m.includes('org_nr')),
    'datafiler: org.nr med åtte siffer feiler'
  );
  krev(
    validerKlinikk({ ...gyldigKlinikk, ventetid: { uker: 2, oppdatert: '2026-09-01' } }, 'test.json').some((m) => m.includes('reservert')),
    'datafiler: reservert felt (ventetid) må være null'
  );
  krev(validerUi({ hopp_til_innhold: 'x' }, 'test.json').some((m) => m.includes('mangler')), 'datafiler: ui.json uten påkrevd nøkkel feiler');
}

// --- innholdskontrakt: nye kontekstregler -----------------------------------
const godkjent = { status: 'GODKJENT', godkjent_av: 'Testlege', godkjent_dato: '2026-01-01' };
krev(
  validerInnhold([{ fil: 'a.md', data: { ...gyldigSide, ...godkjent, ingress: 'En ingress med [PLASSHOLDER: noe] som ikke er avklart ennå.' } }]).some((m) => m.includes('plassholder')),
  'innholdskontrakt: GODKJENT med [PLASSHOLDER] feiler'
);
krev(
  validerInnhold([{ fil: 'a.md', data: { ...gyldigSide, ...godkjent, seksjoner: [{ type: 'pris', tittel: 'Pris og betaling', avsnitt: ['Du betaler selv.'], priser: [{ navn: 'Undersøkelse', belop_nok: null }] }] } }]).some((m) => m.includes('mangler beløp')),
  'innholdskontrakt: GODKJENT med prisrad uten beløp i seksjon feiler'
);
krev(
  validerInnhold([{ fil: 'a.md', data: { ...gyldigSide, ...godkjent, sidetype: 'pris', seksjoner: [{ type: 'tekst', tittel: 'Bare tekst', avsnitt: ['Ingen prisliste her.'] }] } }]).some((m) => m.includes('prisliste')),
  'innholdskontrakt: GODKJENT prisside uten prisliste-seksjon feiler'
);
krev(
  validerInnhold([
    { fil: 'a.md', data: gyldigSide },
    { fil: 'b.md', data: { ...gyldigSide, url: '/annen/', tittel: 'En annen tittel her ja' } }
  ]).some((m) => m.includes('rekkefolge')),
  'innholdskontrakt: to menysider med samme rekkefolge feiler'
);
krev(
  validerInnhold([{ fil: 'a.md', data: { ...gyldigSide, bilder: [{ fil: 'x.avif', alt: 'Et bilde' }] } }]).some((m) => m.includes('reservert')),
  'innholdskontrakt: bilder-feltet er reservert og må være tomt'
);
krev(
  validerInnhold([{ fil: 'a.md', data: { ...gyldigSide, seksjoner: [{ type: 'tekst', tittel: 'Med lenke', avsnitt: ['Se [siden](/finnes-ikke/) her.'] }] } }]).some((m) => m.includes('/finnes-ikke/')),
  'innholdskontrakt: lenke i tekst uten mål feiler'
);
krev(
  validerInnhold([{ fil: 'a.md', data: { ...gyldigSide, priser: [{ navn: 'X', belop_nok: 100 }] } }]).some((m) => m.includes('priser')),
  'innholdskontrakt: priser på toppnivå avvises (hører i prisliste-seksjon)'
);
krev(
  validerInnhold([{ fil: 'a.md', data: medSeksjoner([{ type: 'prisliste', tittel: 'Prisliste', kolonner: { tjeneste: 'Tjeneste', omfang: 'Omfang', pris: 'Pris' }, priser: [{ navn: 'Undersøkelse', omfang: 'Alt inkludert', belop_nok: 4500 }] }]) }]).length === 0,
  'innholdskontrakt: gyldig prisliste med kolonner passerer'
);
krev(
  validerInnhold([{ fil: 'a.md', data: medSeksjoner([{ type: 'prisliste', tittel: 'Prisliste', priser: [{ navn: 'Undersøkelse', belop_nok: 4500.5 }] }]) }]).length > 0,
  'innholdskontrakt: desimalbeløp avvises'
);

// --- dist-vakter: innebygd kode, eksterne verter i flere former -------------
{
  const midl = fs.mkdtempSync(path.join(os.tmpdir(), 'innebygd-'));
  const d = path.join(midl, 'dist');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(`${d}.manifest.json`, JSON.stringify({ produksjon: false, context: null, ciSyntetisk: false, basicAuthAktiv: false, siteUrl: null, sider: [] }));
  fs.writeFileSync(
    path.join(d, 'index.html'),
    '<html><head><meta property="og:image" content="https://cdn.example/x.png"><style>@import "https://fonts.example/a.css";</style></head>' +
      '<body style="color:red" onload="x()"><img src="//bilder.example/a.png"><form action="/x"></form><iframe src="/y"></iframe>' +
      '<script>fetch("https://api.example/")</script></body></html>'
  );
  fs.writeFileSync(path.join(d, 'x.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://bilde.example/a.png"/><script>1</script></svg>');
  const ik = innebygdKode.kjorDist(d);
  for (const [tekst, navn] of [['<script>', 'script'], ['<style>', 'style'], ['style=', 'style-attributt'], ['on*', 'on-attributt'], ['skjemaelement', 'form/iframe']]) {
    krev(ik.some((m) => m.includes(tekst)), `innebygd-kode: fanger ${navn}`);
  }
  const ev = eksterneVerter.kjorDist(d);
  for (const vert of ['cdn.example', 'fonts.example', 'bilder.example', 'api.example', 'bilde.example']) {
    krev(ev.some((m) => m.includes(vert)), `eksterne-verter: fanger «${vert}»`);
  }
  krev(ev.some((m) => m.includes('<script> i SVG')), 'eksterne-verter: fanger skript i SVG-fil');
  krev(lenker.kjorDist(d).length === 0 || !lenker.kjorDist(d).some((m) => m.includes('..')), 'lenker: ingen «..»-treff uten «..»');
  fs.writeFileSync(path.join(d, 'index.html'), '<a href="/bilder/../../package.json">x</a>');
  krev(lenker.kjorDist(d).some((m) => m.includes('..')), 'lenker: «..» i intern sti avvises');
  fs.rmSync(midl, { recursive: true, force: true });
}

// --- headere, klinikk-lansering, ui-kryssjekk -------------------------------
{
  const midl = fs.mkdtempSync(path.join(os.tmpdir(), 'headere-'));
  const d = path.join(midl, 'dist');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n');
  const hf = headere.kjorDist(d);
  krev(hf.some((m) => m.includes('CSP')), 'headere: fanger manglende CSP-linje');
  krev(hf.some((m) => m.includes('Referrer-Policy')), 'headere: fanger manglende fast header');
  krev(hf.some((m) => m.includes('Cache-Control')), 'headere: fanger manglende Cache-Control');

  fs.writeFileSync(`${d}.manifest.json`, JSON.stringify({ produksjon: true, context: 'production', ciSyntetisk: false, sider: [] }));
  krev(klinikkLansering.kjorDist(d).some((m) => m.includes('adresse')), 'klinikk-lansering: fanger tomt lovpålagt felt i ekte produksjonsbygg');
  fs.writeFileSync(`${d}.manifest.json`, JSON.stringify({ produksjon: true, context: 'deploy-preview', ciSyntetisk: true, sider: [] }));
  krev(klinikkLansering.kjorDist(d).some((m) => m.includes('CI_SYNTETISK')), 'klinikk-lansering: CI_SYNTETISK i Netlify-kontekst feiler');
  fs.writeFileSync(`${d}.manifest.json`, JSON.stringify({ produksjon: true, context: null, ciSyntetisk: true, sider: [] }));
  krev(klinikkLansering.kjorDist(d).length === 0, 'klinikk-lansering: syntetisk CI-bygg utenfor Netlify passerer');

  const rot = path.join(midl, 'repo');
  fs.mkdirSync(path.join(rot, 'src/_data'), { recursive: true });
  fs.mkdirSync(path.join(rot, 'src/_includes'), { recursive: true });
  fs.writeFileSync(path.join(rot, 'src/_data/ui.json'), JSON.stringify({ brukt: 'x', dod_nokkel: 'y' }));
  fs.writeFileSync(path.join(rot, 'src/_includes/mal.njk'), '<p>{{ ui.brukt }} {{ ui.finnes_ikke }}</p>');
  const uf = uiKryssjekk.kjorKilde({ rot });
  krev(uf.some((m) => m.includes('finnes_ikke')), 'ui-kryssjekk: fanger oppslag uten nøkkel');
  krev(uf.some((m) => m.includes('dod_nokkel')), 'ui-kryssjekk: fanger død nøkkel');
  fs.rmSync(midl, { recursive: true, force: true });
}

// --- godkjent-status: ikke-innholdsside og manglende forside i produksjon --
{
  const midl = fs.mkdtempSync(path.join(os.tmpdir(), 'godkjent-'));
  const d = path.join(midl, 'dist');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(`${d}.manifest.json`, JSON.stringify({ produksjon: true, context: 'production', ciSyntetisk: false, sider: [{ url: '/katalog/', sidetype: null, status: null }] }));
  const gf = godkjentStatus.kjorDist(d);
  krev(gf.some((m) => m.includes('ingen sidetype')), 'godkjent-status: side uten sidetype i produksjon feiler');
  krev(gf.some((m) => m.includes('forsiden')), 'godkjent-status: produksjon uten forside feiler');
  fs.rmSync(midl, { recursive: true, force: true });
}

// --- historikk: baseline unntar eldre commits -------------------------------
fs.writeFileSync(path.join(repo, 'fil.txt'), 'y');
git('add', '.');
git('commit', '-q', '-m', 'uskyldig melding etter baseline');
const baselineSha = git('rev-parse', 'HEAD').trim();
krev(
  ordliste.kjorHistorikk({ repoRot: repo, kategorier: SYNTETISK_KATEGORI, baseline: baselineSha }).length === 0,
  'historikk: commits før baseline skannes ikke'
);
krev(
  ordliste.kjorHistorikk({ repoRot: repo, kategorier: SYNTETISK_KATEGORI }).some((m) => m.includes('TESTFORBUDTORD')),
  'historikk: uten baseline i testrepoet skannes hele historikken'
);

fs.rmSync(tmp, { recursive: true, force: true });

if (feilede > 0) {
  console.error(`\n${feilede} selvtester feilet — en eller flere vakter virker ikke.`);
  process.exit(1);
}
console.log('\nAlle selvtester grønne — vaktene beviselig i live.');
