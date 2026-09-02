import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

// klinikk.json og ui.json valideres mot sine skjema i hvert bygg og som
// kildevakt — skjemaene er ikke dokumentasjon, de håndheves. Feil oversettes
// til norsk med samme ordlyd overfor den som redigerer datafilene.

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const klinikkSkjema = JSON.parse(fs.readFileSync('skjema/klinikk.schema.json', 'utf8'));
const uiSkjema = JSON.parse(fs.readFileSync('skjema/ui.schema.json', 'utf8'));
const validerKlinikkSkjema = ajv.compile(klinikkSkjema);
const validerUiSkjema = ajv.compile(uiSkjema);

// Felter som er avtalt i kontrakten, men som ingen mal viser ennå. De skal
// stå som null til visningen finnes — ellers ville fakta forsvinne stille.
const RESERVERTE_KLINIKKFELT = ['apningstider', 'ventetid'];

function tilNorsk(fil, feilliste) {
  const meldinger = new Set();
  for (const feil of feilliste || []) {
    const sti = (feil.instancePath || '').replace(/^\//, '').replace(/\//g, '.') || '(rot)';
    if (feil.keyword === 'required') {
      meldinger.add(`${fil}: obligatorisk felt «${sti === '(rot)' ? '' : sti + '.'}${feil.params.missingProperty}» mangler${sti === '(rot)' ? ' — bruk null når verdien er ukjent' : ' — et utfylt objekt må ha alle feltene sine'}`);
    } else if (feil.keyword === 'additionalProperties') {
      meldinger.add(`${fil}: ukjent felt «${feil.params.additionalProperty}» — skjemaet tillater ingen felter utenfor kontrakten`);
    } else if (feil.keyword === 'pattern' || feil.keyword === 'format') {
      meldinger.add(`${fil}: feltet «${sti}» har feil form (${feil.keyword === 'format' ? feil.params.format : 'mønster ' + feil.params.pattern})`);
    } else if (feil.keyword === 'type') {
      meldinger.add(`${fil}: feltet «${sti}» skal være ${feil.params.type}`);
    } else {
      meldinger.add(`${fil}: feltet «${sti}» er ugyldig (${feil.keyword})`);
    }
  }
  return [...meldinger];
}

export function validerKlinikk(data, fil = 'src/_data/klinikk.json') {
  const feil = validerKlinikkSkjema(data) ? [] : tilNorsk(fil, validerKlinikkSkjema.errors);
  for (const felt of RESERVERTE_KLINIKKFELT) {
    if (data && data[felt] !== null && data[felt] !== undefined) {
      feil.push(
        `${fil}: feltet «${felt}» er reservert — ingen mal viser det ennå, så verdien ville forsvunnet stille. Hold det som null til visningen er bygget`
      );
    }
  }
  return feil;
}

export function validerUi(data, fil = 'src/_data/ui.json') {
  return validerUiSkjema(data) ? [] : tilNorsk(fil, validerUiSkjema.errors);
}

export function lesOgValiderDatafiler() {
  const klinikk = JSON.parse(fs.readFileSync('src/_data/klinikk.json', 'utf8'));
  const ui = JSON.parse(fs.readFileSync('src/_data/ui.json', 'utf8'));
  return [...validerKlinikk(klinikk), ...validerUi(ui)];
}
