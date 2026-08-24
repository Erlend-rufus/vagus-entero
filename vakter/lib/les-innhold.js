import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const INNHOLD_KATALOG = 'src/innhold';

// Leser alle innholdsfiler rått med gray-matter — samme parser som Eleventy
// bruker internt, så valideringen ser nøyaktig det bygget ser.
export function lesInnhold(katalog = INNHOLD_KATALOG) {
  if (!fs.existsSync(katalog)) return [];
  const filer = fs
    .readdirSync(katalog, { recursive: true })
    .filter((f) => String(f).endsWith('.md'))
    .map((f) => path.join(katalog, String(f)));

  return filer.map((fil) => {
    const raa = fs.readFileSync(fil, 'utf8');
    const { data, content } = matter(raa);
    return { fil, data, body: content };
  });
}
