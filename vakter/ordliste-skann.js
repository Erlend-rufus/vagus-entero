import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import {
  finnRepoTekstfiler,
  finnDistFiler,
  lesTekst,
  lesOrdliste,
  sokIOrdliste
} from './lib/felles.js';

export const navn = 'ordliste-skann';

const KATEGORIER = [
  { fil: 'vakter/ordlister/preparatnavn.txt', kategori: 'preparatnavn' },
  { fil: 'vakter/ordlister/ventetidsfraser.txt', kategori: 'ventetidsfrase' },
  { fil: 'vakter/ordlister/superlativer.txt', kategori: 'superlativ' },
  { fil: 'vakter/ordlister/leverandorer.txt', kategori: 'leverandornavn' },
  { fil: 'vakter/ordlister/forsikringsselskaper.txt', kategori: 'forsikringsselskap' },
  { fil: 'vakter/ordlister/vurderingssignaler.txt', kategori: 'vurderingssignal' }
];

function lesKategorier(kategorier = KATEGORIER) {
  return kategorier.map(({ fil, kategori }) => ({
    kategori,
    oppforinger: lesOrdliste(fil),
    unntak: lesOrdliste(fil.replace('/ordlister/', '/ordlister/unntak/'))
  }));
}

export function skannTekst(tekst, kilde, kategorier) {
  const feil = [];
  for (const { kategori, oppforinger, unntak } of kategorier) {
    for (const treff of sokIOrdliste(tekst, oppforinger, unntak)) {
      feil.push(
        `${kilde}:${treff.linjenummer}: forbudt ${kategori} «${treff.funn}» (ordliste-oppføring: «${treff.oppforing}»)`
      );
    }
  }
  return feil;
}

export function kjorKilde() {
  const kategorier = lesKategorier();
  const feil = [];
  for (const fil of finnRepoTekstfiler()) {
    feil.push(...skannTekst(lesTekst(fil), fil, kategorier));
  }
  return feil;
}

export function kjorDist(distKatalog) {
  const kategorier = lesKategorier();
  const feil = [];
  for (const fil of finnDistFiler(distKatalog, ['.html', '.xml', '.txt', '.css', '.js'])) {
    feil.push(...skannTekst(lesTekst(fil), fil, kategorier));
  }
  return feil;
}

// Skann av commit-meldinger. Krever full klon (fetch-depth: 0 i Actions) —
// en grunn klon gir stille tomt resultat, og det er nettopp den typen stille
// vakt-død vi ikke aksepterer: da feiler vi i stedet.
export function kjorHistorikk({ repoRot = '.', kategorier = lesKategorier() } = {}) {
  const git = (args) => execFileSync('git', args, { cwd: repoRot, encoding: 'utf8' });

  const grunn = git(['rev-parse', '--is-shallow-repository']).trim();
  if (grunn === 'true') {
    return [
      'git-klonen er grunn (shallow) — historikkskannet ser ingenting. Sett fetch-depth: 0 i workflow-en.'
    ];
  }

  const baselineFil = 'vakter/ordlister/historikk-baseline.txt';
  const baseline = fs.existsSync(baselineFil)
    ? lesTekst(baselineFil)
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))[0] || null
    : null;

  const args = ['log', '--all', '--format=%H%x00%B%x01'];
  if (baseline) args.push('--not', baseline);

  const logg = git(args);
  const feil = [];
  for (const blokk of logg.split('\x01')) {
    if (!blokk.trim()) continue;
    const [sha, melding] = blokk.split('\x00');
    for (const funn of skannTekst(melding || '', `commit ${sha.trim().slice(0, 10)}`, kategorier)) {
      feil.push(`${funn} — se prosedyren i docs/VAKTER.md`);
    }
  }
  return feil;
}
