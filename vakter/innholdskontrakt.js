import { lesInnhold } from './lib/les-innhold.js';
import { validerInnhold } from './lib/innholdsvalidering.js';

export const navn = 'innholdskontrakt';

// Samme modul som bygget bruker i eleventy.before — logikken finnes ett sted.
export function kjorKilde() {
  return validerInnhold(lesInnhold());
}
