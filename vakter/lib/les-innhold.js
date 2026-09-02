import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const INNHOLD_KATALOG = 'src/innhold';

// gray-matter kan kjøre frontmatter som JavaScript («---js»). Innholdsfiler
// skal aldri kunne kjøre kode — verken i bygget eller i vaktene. Den motoren
// erstattes derfor av en funksjon som stopper alt. Samme funksjon brukes av
// eleventy.config.js.
export function avvisKodeFrontmatter() {
  throw new Error(
    'Frontmatter må være YAML. «---js»/«---javascript» er slått av: innholdsfiler kan ikke kjøre kode.'
  );
}

const PARSEOPSJONER = {
  engines: {
    js: avvisKodeFrontmatter,
    javascript: avvisKodeFrontmatter,
    jsLegacy: avvisKodeFrontmatter,
    node: avvisKodeFrontmatter
  }
};

// Leser én innholdsfil rått. Første linje må være nøyaktig «---» — en fil som
// starter med «---js» eller annen språkmarkør avvises før parseren ser den.
export function lesInnholdsfil(fil) {
  const raa = fs.readFileSync(fil, 'utf8');
  const forsteLinje = raa.split(/\r?\n/, 1)[0];
  if (forsteLinje !== '---') {
    throw new Error(`${fil}: filen må starte med en ren «---»-linje (YAML-frontmatter), fant «${forsteLinje}»`);
  }
  const { data, content } = matter(raa, PARSEOPSJONER);
  return { fil, data, body: content };
}

// Leser alle innholdsfiler rått med gray-matter — samme parser som Eleventy
// bruker internt, så valideringen ser nøyaktig det bygget ser.
export function lesInnhold(katalog = INNHOLD_KATALOG) {
  if (!fs.existsSync(katalog)) return [];
  const filer = fs
    .readdirSync(katalog, { recursive: true })
    .filter((f) => String(f).endsWith('.md'))
    .map((f) => path.join(katalog, String(f)));

  return filer.map((fil) => lesInnholdsfil(fil));
}
