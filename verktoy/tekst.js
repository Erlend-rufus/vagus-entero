// Prosa fra innholdsfilene rendres alltid gjennom denne funksjonen. Den
// escaper alt, og tillater nøyaktig to ting: interne lenker skrevet som
// [tekst](/sti/) og linjeskift (\n → <br>). Ingen annen HTML slipper inn i
// utdataene fra tekstfeltene — pasienttekst er innhold, ikke kode.

export const LENKE = /\[([^\]\n]+)\]\((\/[a-z0-9/-]*)\)/g;

function escapeHtml(tekst) {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formaterTekst(tekst) {
  if (typeof tekst !== 'string') return tekst;
  const escapet = escapeHtml(tekst);
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
