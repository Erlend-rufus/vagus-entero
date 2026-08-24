import { finnRepoTekstfiler, finnDistFiler, lesTekst, lesOrdliste, sokIOrdliste } from './lib/felles.js';

export const navn = 'sporing';

function signaturer() {
  return lesOrdliste('vakter/ordlister/sporingssignaturer.txt');
}

export function skannTekst(tekst, kilde, liste = signaturer()) {
  return sokIOrdliste(tekst, liste).map(
    (treff) => `${kilde}:${treff.linjenummer}: sporingssignatur «${treff.funn}»`
  );
}

export function kjorKilde() {
  const liste = signaturer();
  const feil = [];
  for (const fil of finnRepoTekstfiler()) {
    feil.push(...skannTekst(lesTekst(fil), fil, liste));
  }
  return feil;
}

export function kjorDist(distKatalog) {
  const liste = signaturer();
  const feil = [];
  for (const fil of finnDistFiler(distKatalog, ['.html', '.css', '.js'])) {
    feil.push(...skannTekst(lesTekst(fil), fil, liste));
  }
  return feil;
}
