import fs from 'node:fs';
import { lesManifest } from './lib/felles.js';

export const navn = 'klinikk-lansering';

// Null-utelatelse er riktig frem til lansering — men på lanseringsdagen er
// utelatt org.nr/adresse/kontaktinfo i bunnteksten et brudd på ehandelsloven
// § 9. Denne vakten gjør LANSERING.md-punktet håndhevet i stedet for antatt.
// (Bygget feiler også selv; vakten er belte og bukser.)
const LANSERINGSKRITISKE = ['juridisk_navn', 'org_nr', 'adresse', 'telefon', 'epost'];

export function kjorDist(distKatalog) {
  const manifest = lesManifest(distKatalog);
  if (!manifest.produksjon || manifest.ciSyntetisk) return [];

  const klinikk = JSON.parse(fs.readFileSync('src/_data/klinikk.json', 'utf8'));
  return LANSERINGSKRITISKE.filter((felt) => !klinikk[felt]).map(
    (felt) =>
      `klinikk.json-feltet «${felt}» er tomt i et ekte produksjonsbygg — ehandelsloven § 9 krever det i bunnteksten`
  );
}
