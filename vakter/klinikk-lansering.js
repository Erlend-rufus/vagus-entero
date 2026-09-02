import fs from 'node:fs';
import { lesManifest } from './lib/felles.js';

export const navn = 'klinikk-lansering';

// Null-utelatelse er riktig frem til lansering — men på lanseringsdagen er
// utelatt org.nr/adresse/kontaktinfo i bunnteksten et brudd på ehandelsloven
// § 9. Denne vakten gjør LANSERING.md-punktet håndhevet i stedet for antatt.
// (Bygget feiler også selv; vakten er belte og bukser.)
const LANSERINGSKRITISKE = ['juridisk_navn', 'org_nr', 'adresse', 'telefon', 'epost'];

export function kjorDist(distKatalog, { klinikkSti = 'src/_data/klinikk.json' } = {}) {
  const manifest = lesManifest(distKatalog);
  // CI_SYNTETISK finnes bare for CI. Har bygget en Netlify-kontekst, er det
  // et ekte deploy — da er «syntetisk» en feilkonfigurasjon, ikke et unntak.
  if (manifest.ciSyntetisk && manifest.context !== null) {
    return [
      `byggmanifestet er merket ciSyntetisk i en Netlify-kontekst («${manifest.context}») — CI_SYNTETISK skal aldri settes i et deploy`
    ];
  }
  if (!manifest.produksjon || manifest.ciSyntetisk) return [];

  const klinikk = JSON.parse(fs.readFileSync(klinikkSti, 'utf8'));
  return LANSERINGSKRITISKE.filter((felt) => !klinikk[felt]).map(
    (felt) =>
      `klinikk.json-feltet «${felt}» er tomt i et ekte produksjonsbygg — ehandelsloven § 9 krever det i bunnteksten`
  );
}
