import { lesOgValiderDatafiler } from './lib/datavalidering.js';

export const navn = 'datafiler';

// klinikk.json og ui.json mot skjemaene sine. Bygget gjør det samme i
// eleventy.before — vakten er belte og bukser, og gir Erlend beskjed i CI
// når han redigerer datafilene direkte i GitHub.
export function kjorKilde() {
  return lesOgValiderDatafiler();
}
