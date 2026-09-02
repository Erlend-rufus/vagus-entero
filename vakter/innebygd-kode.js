import { finnDistFiler, lesTekst } from './lib/felles.js';

export const navn = 'innebygd-kode';

// Nettstedet har ingen JavaScript, ingen skjema og ingen innebygde rammer.
// Skulle noe av det dukke opp i bygde HTML-filer — via en innholdsfil, en
// mal eller en avhengighet — skal bygget stoppe, ikke CSP-en i nettleseren
// være siste skanse. Åpnes det for skript senere (bestillingsportalen), er
// det en bevisst endring av denne listen.
const FORBUDT = [
  {
    monster: /<script\b(?![^>]*type="application\/ld\+json")[^>]*>/gi,
    melding: '<script> utenfor JSON-LD'
  },
  { monster: /<style\b[^>]*>/gi, melding: '<style>-blokk (CSP tillater bare /stiler/hoved.css)' },
  { monster: /\sstyle\s*=\s*["']/gi, melding: 'style=-attributt (CSP blokkerer det stille)' },
  { monster: /\son[a-z]+\s*=\s*["']/gi, melding: 'on*-hendelsesattributt' },
  { monster: /\b(?:href|src|action|formaction)\s*=\s*["']\s*javascript:/gi, melding: 'javascript:-URL' },
  { monster: /<(?:iframe|frame|object|embed|form|input|textarea|select|button)\b/gi, melding: 'innebygd ramme, objekt eller skjemaelement' },
  { monster: /<meta\b[^>]*http-equiv\s*=\s*["']refresh["']/gi, melding: 'meta refresh' },
  { monster: /<a\b[^>]*\sping\s*=/gi, melding: 'ping-attributt på lenke' },
  { monster: /<base\b/gi, melding: '<base>-element' }
];

export function kjorDist(distKatalog) {
  const feil = [];
  for (const fil of finnDistFiler(distKatalog, ['.html'])) {
    const html = lesTekst(fil);
    for (const { monster, melding } of FORBUDT) {
      monster.lastIndex = 0;
      const m = monster.exec(html);
      if (m) {
        feil.push(`${fil}: ${melding} («${m[0].slice(0, 60)}») — nettstedet skal ikke ha innebygd kode`);
      }
    }
  }
  return feil;
}
