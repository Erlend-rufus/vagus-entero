// Validerer ÉN innholdsfil mot kontrakten, ordlistene, pris-i-tekst-regelen
// og prosjektets tegnsettingsregel (ingen tankestreker). Bruk:
//   node verktoy/valider-en.mjs <sti-til-fil.md>
// Kjøres fra repo-roten. Avslutter med kode 1 ved feil.
import fs from 'node:fs';
import matter from 'gray-matter';
import { validerInnhold } from '../vakter/lib/innholdsvalidering.js';
import { lesInnhold } from '../vakter/lib/les-innhold.js';
import { skannData } from '../vakter/priser-i-tekst.js';
import { skannTekst } from '../vakter/ordliste-skann.js';
import { lesOrdliste } from '../vakter/lib/felles.js';

const fil = process.argv[2];
if (!fil || !fs.existsSync(fil)) {
  console.error('Oppgi sti til én markdown-fil.');
  process.exit(2);
}
const raa = fs.readFileSync(fil, 'utf8');
let data, body;
try {
  ({ data, content: body } = matter(raa));
} catch (e) {
  console.error(`YAML-feil: ${e.message}`);
  process.exit(1);
}
const feil = [];

// 1. Skjema og kontekstregler, med resten av nettstedet som kontekst
//    (lenkemål må finnes). Filen som valideres erstatter siden med samme url.
const andre = lesInnhold().filter((s) => s.data.url !== data.url);
const alleFeil = validerInnhold([...andre, { fil, data, body }]);
feil.push(...alleFeil.filter((m) => m.startsWith(`${fil}:`)));

// 2. Beløp i løpende tekst
for (const { sti, funn } of skannData(data)) {
  feil.push(`${fil}: beløp «${funn}» i løpende tekst (${sti}) — priser hører kun hjemme i pristabellen`);
}

// 3. Ordlister
const KATEGORIER = [
  ['vakter/ordlister/preparatnavn.txt', 'preparatnavn'],
  ['vakter/ordlister/ventetidsfraser.txt', 'ventetidsfrase'],
  ['vakter/ordlister/superlativer.txt', 'superlativ'],
  ['vakter/ordlister/leverandorer.txt', 'leverandornavn'],
  ['vakter/ordlister/forsikringsselskaper.txt', 'forsikringsselskap'],
  ['vakter/ordlister/vurderingssignaler.txt', 'vurderingssignal']
].map(([sti, kategori]) => ({
  kategori,
  oppforinger: lesOrdliste(sti),
  unntak: lesOrdliste(sti.replace('/ordlister/', '/ordlister/unntak/'))
}));
feil.push(...skannTekst(raa, fil, KATEGORIER));

// 4. Tankestreker og andre tegn prosjektet ikke bruker
raa.split('\n').forEach((linje, i) => {
  if (/[—–]/u.test(linje)) feil.push(`${fil}:${i + 1}: tankestrek (— eller –) — skriv om med komma, punktum eller kolon`);
});

// 5. Plassholdere som ligner ekte tekst
raa.split('\n').forEach((linje, i) => {
  if (/\[PLASSHOLDER|\[KLOKKESLETT\]|\[ANTALL\]|\[PREPARAT\]|\bTODO\b|\bTBD\b/u.test(linje)) {
    feil.push(`${fil}:${i + 1}: plassholder i teksten — skriv beste kildebaserte formulering og før forbeholdet i apne_punkter i stedet`);
  }
});

// 6. Brødtekst etter frontmatter skal være tom (alt innhold ligger i seksjoner)
if (body.trim().length > 0) {
  feil.push(`${fil}: det ligger tekst etter frontmatteren (${body.trim().length} tegn) — alt innhold skal ligge i seksjoner`);
}

// 7. interne_lenker_ut må dekke alle interne url-er i knapper og kort
const brukte = new Set();
const samle = (node) => {
  if (Array.isArray(node)) node.forEach(samle);
  else if (node && typeof node === 'object') {
    if (typeof node.url === 'string' && node !== data) brukte.add(node.url);
    for (const [k, v] of Object.entries(node)) if (k !== 'url') samle(v);
  }
};
samle(data.seksjoner || []);
samle(data.hode_knapper || []);
if (data.overordnet) brukte.add(data.overordnet);
for (const u of brukte) {
  if (!(data.interne_lenker_ut || []).includes(u)) {
    feil.push(`${fil}: lenken «${u}» brukes på siden, men står ikke i interne_lenker_ut`);
  }
}

if (feil.length) {
  console.log(`FEIL (${feil.length}):`);
  for (const f of feil) console.log('  - ' + f);
  process.exit(1);
}
const tekst = JSON.stringify(data);
const ord = tekst.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).length;
console.log(`OK: ${fil} (${data.url}, status ${data.status}, ca. ${ord} ord, ${(data.apne_punkter || []).length} åpne punkter)`);
