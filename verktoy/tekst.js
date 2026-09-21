// Prosa fra innholdsfilene rendres alltid gjennom denne funksjonen. Den
// escaper alt, og tillater nøyaktig tre ting: interne lenker skrevet som
// [tekst](/sti/), linjeskift (\n → <br>), og datareferanser til
// klinikk.json skrevet som {klinikk.felt.underfelt}. Ingen annen HTML eller
// kode slipper inn i utdataene fra tekstfeltene — pasienttekst er innhold,
// ikke kode.

import fs from 'node:fs';

export const LENKE = /\[([^\]\n]+)\]\((\/(?!\/)[a-z0-9/-]*)\)/g;

// {klinikk.adresse.gate} osv. — en ren datareferanse, ikke kode. Bruker
// krøllparenteser, ikke hakeparenteser, slik at den aldri kan forveksles
// med [PLASSHOLDER ...]/[TEKST KOMMER] av vaktene som fanger «alt i
// hakeparenteser er en plassholder» (vakter/lib/innholdsvalidering.js).
// Løses opp her, sentralt, én gang — samme sted som lenkene over — slik at
// et felt oppdateres overalt på nettstedet når klinikk.json endres, uten at
// noen mal trenger å vite om det.
const KLINIKK_REFERANSE = /\{klinikk\.([a-z_]+(?:\.[a-z_]+)*)\}/g;
let klinikkCache;

function lastKlinikk() {
  if (!klinikkCache) {
    klinikkCache = JSON.parse(fs.readFileSync('src/_data/klinikk.json', 'utf8'));
  }
  return klinikkCache;
}

function hentKlinikkFelt(sti) {
  const verdi = sti
    .split('.')
    .reduce((o, k) => (o != null && typeof o === 'object' ? o[k] : undefined), lastKlinikk());
  // Feltet finnes ikke, eller er null/tomt (ukjent fakta): bygget stopper
  // høylytt i stedet for å gjette eller rendre «undefined»/tom streng.
  if (typeof verdi !== 'string' || verdi === '') {
    throw new Error(
      `Datareferansen «{klinikk.${sti}}» kan ikke løses: feltet finnes ikke, eller er null/tomt i src/_data/klinikk.json.`
    );
  }
  return verdi;
}

function settInnKlinikkReferanser(tekst) {
  return tekst.replace(KLINIKK_REFERANSE, (_, sti) => hentKlinikkFelt(sti));
}

function escapeHtml(tekst) {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formaterTekst(tekst) {
  if (typeof tekst !== 'string') return tekst;
  const medReferanser = settInnKlinikkReferanser(tekst);
  const escapet = escapeHtml(medReferanser);
  const medLenker = escapet.replace(LENKE, (_, t, url) => `<a href="${url}">${t}</a>`);
  return medLenker.replace(/\r?\n/g, '<br>');
}

// Alle interne lenkemål i en tekst — brukes av kontraktvalideringen, slik at
// en lenke til en side som ikke finnes stopper bygget før HTML-en er laget.
export function finnLenkemaal(tekst) {
  if (typeof tekst !== 'string') return [];
  return [...tekst.matchAll(LENKE)].map((m) => m[2]);
}

// Brødsmulestiens siste ledd er sidetittelen uten den medisinske termen i
// parentes: «Kikkertundersøkelse av tykktarmen (koloskopi)» → uten parentes.
export function brodsmuletekst(tittel) {
  return typeof tittel === 'string' ? tittel.replace(/\s*\([^)]*\)\s*$/, '') : tittel;
}
