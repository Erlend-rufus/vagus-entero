import fs from 'node:fs';
import path from 'node:path';

// Kataloger og filer som aldri skannes av innholdsvaktene. Unntakene er
// bevisste og dokumentert i docs/VAKTER.md:
// - vakter/ordlister: listene må nødvendigvis inneholde ordene de forbyr
// - vakter/tester: bruker kun syntetiske testord, og tester vaktene selv
// - package-lock.json: base64-hasher gir meningsløse delstrengtreff
// - binærkataloger (fonter, bilder) og genererte kataloger
const ALLTID_UNNTATT = [
  '.git',
  'node_modules',
  'dist',
  'dist-produksjon',
  '.lighthouseci',
  'vakter/ordlister',
  'vakter/tester',
  'package-lock.json',
  'src/fonter',
  'src/bilder'
];

const TEKSTENDELSER = new Set([
  '.md', '.njk', '.js', '.mjs', '.cjs', '.json', '.css', '.txt', '.yml',
  '.yaml', '.toml', '.html', '.xml', '.svg', '.py', '.editorconfig'
]);

export function erUnntatt(relativSti) {
  const normalisert = relativSti.split(path.sep).join('/');
  return ALLTID_UNNTATT.some(
    (unntak) => normalisert === unntak || normalisert.startsWith(`${unntak}/`)
  );
}

// Alle tekstfiler i repoet, minus unntakene.
export function finnRepoTekstfiler(rot = '.') {
  const funn = [];
  const gaa = (katalog) => {
    for (const navn of fs.readdirSync(katalog)) {
      const full = path.join(katalog, navn);
      const relativ = path.relative(rot, full);
      if (erUnntatt(relativ)) continue;
      const info = fs.statSync(full);
      if (info.isDirectory()) {
        gaa(full);
      } else if (TEKSTENDELSER.has(path.extname(navn)) || navn.startsWith('.')) {
        funn.push(relativ);
      }
    }
  };
  gaa(rot);
  return funn;
}

// Filer i en bygd utdatakatalog, filtrert på endelser.
export function finnDistFiler(distKatalog, endelser) {
  if (!fs.existsSync(distKatalog)) return [];
  const funn = [];
  const gaa = (katalog) => {
    for (const navn of fs.readdirSync(katalog)) {
      const full = path.join(katalog, navn);
      if (fs.statSync(full).isDirectory()) {
        gaa(full);
      } else if (endelser.some((e) => navn.endsWith(e))) {
        funn.push(full);
      }
    }
  };
  gaa(distKatalog);
  return funn;
}

export function lesTekst(fil) {
  return fs.readFileSync(fil, 'utf8');
}

export function lesManifest(distKatalog) {
  const sti = `${distKatalog}.manifest.json`;
  if (!fs.existsSync(sti)) {
    throw new Error(`Finner ikke byggmanifestet ${sti} — kjør bygget først.`);
  }
  return JSON.parse(fs.readFileSync(sti, 'utf8'));
}

// Leser en ordliste: én oppføring per linje, # er kommentar, tom linje hoppes
// over. Prefikset ~ betyr bevisst delstrengtreff (ellers ordgrense).
export function lesOrdliste(sti) {
  if (!fs.existsSync(sti)) return [];
  return lesTekst(sti)
    .split('\n')
    .map((linje) => linje.trim())
    .filter((linje) => linje.length > 0 && !linje.startsWith('#'))
    .map((linje) =>
      linje.startsWith('~')
        ? { tekst: linje.slice(1).trim(), delstreng: true }
        : { tekst: linje, delstreng: false }
    );
}

function unnslipp(tekst) {
  return tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Ordgrensetreff som forstår norske bokstaver: en oppføring treffer aldri
// inne i et lengre ord (norske bokstaver teller som ordtegn i grensen).
// Delstreng-oppføringer (~) matcher rått.
export function lagMonster(oppforing) {
  const kjerne = unnslipp(oppforing.tekst).replace(/\s+/g, '\\s+');
  if (oppforing.delstreng) {
    return new RegExp(kjerne, 'giu');
  }
  return new RegExp(`(?<![\\p{L}\\p{N}])${kjerne}(?![\\p{L}\\p{N}])`, 'giu');
}

// Søk i tekst; unntaksfraser (fra unntakslisten) nuller ut treff som inngår i
// en godkjent frase på samme linje.
export function sokIOrdliste(tekst, oppforinger, unntaksfraser = []) {
  const treff = [];
  const linjer = tekst.split('\n');
  const unntaksMonstre = unntaksfraser.map((frase) => lagMonster(frase));

  linjer.forEach((linje, indeks) => {
    for (const oppforing of oppforinger) {
      const monster = lagMonster(oppforing);
      let m;
      while ((m = monster.exec(linje)) !== null) {
        const dekketAvUnntak = unntaksMonstre.some((um) => {
          um.lastIndex = 0;
          let u;
          while ((u = um.exec(linje)) !== null) {
            if (u.index <= m.index && um.lastIndex >= m.index + m[0].length) return true;
          }
          return false;
        });
        if (!dekketAvUnntak) {
          treff.push({ linjenummer: indeks + 1, funn: m[0], oppforing: oppforing.tekst });
        }
      }
    }
  });
  return treff;
}
