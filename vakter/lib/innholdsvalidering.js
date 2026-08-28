import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { tilNorsk } from './norske-meldinger.js';

const skjema = JSON.parse(fs.readFileSync('skjema/innhold.schema.json', 'utf8'));

// discriminator lar ajv velge riktig seksjonsblokk ut fra «type», slik at en
// feil i én blokk gir én forståelig melding og ikke én per blokktype.
const ajv = new Ajv({ allErrors: true, strict: true, discriminator: true });
addFormats(ajv);
const validerMotSkjema = ajv.compile(skjema);

// Samler alle knappene på en side: sidehodet, veiene og prisblokkene.
function alleKnapper(data) {
  const knapper = [...(data.hode_knapper || [])];
  for (const blokk of data.seksjoner || []) {
    knapper.push(...(blokk.knapper || []));
    if (blokk.knapp) knapper.push(blokk.knapp);
    for (const vei of blokk.veier || []) {
      if (vei.knapp) knapper.push(vei.knapp);
    }
  }
  return knapper;
}

// Validerer HELE innholdssettet: skjema per fil pluss kontekstreglene som
// krever kjennskap til alle filene. Returnerer en liste norske feilmeldinger —
// tom liste betyr at kontrakten holder.
export function validerInnhold(sider) {
  const feil = [];
  const meld = (fil, tekst) => feil.push(`${fil}: ${tekst}`);

  const setteUrler = new Map();

  for (const { fil, data } of sider) {
    if (!validerMotSkjema(data)) {
      for (const m of tilNorsk(validerMotSkjema.errors)) meld(fil, m);
      continue; // kontekstregler gir bare støy når skjemaet allerede feiler
    }

    if (setteUrler.has(data.url)) {
      meld(fil, `url «${data.url}» er allerede brukt av ${setteUrler.get(data.url)}`);
    } else {
      setteUrler.set(data.url, fil);
    }

    if (data.status === 'GODKJENT') {
      if (!data.godkjent_av) {
        meld(fil, 'status er GODKJENT, men godkjent_av mangler — ingen signatur, ingen publisering');
      }
      if (!data.godkjent_dato) {
        meld(fil, 'status er GODKJENT, men godkjent_dato mangler — ingen signatur, ingen publisering');
      }
      if (Array.isArray(data.apne_punkter) && data.apne_punkter.length > 0) {
        meld(
          fil,
          `status er GODKJENT, men apne_punkter har ${data.apne_punkter.length} uavklarte punkter — de må lukkes før godkjenning`
        );
      }
      if (data.sidetype === 'pris') {
        if (!Array.isArray(data.priser) || data.priser.length === 0) {
          meld(
            fil,
            'en prisside kan ikke være GODKJENT uten utfylt priser-blokk — prislisten er lovpålagt (prisopplysningsforskriften § 10)'
          );
        } else {
          const uavklarte = data.priser.filter((p) => p.belop_nok === null).length;
          if (uavklarte > 0) {
            meld(
              fil,
              `prissiden har ${uavklarte} prislinjer uten beløp — en GODKJENT prisside må ha totalpris på alt som tilbys (prisopplysningsforskriften § 10)`
            );
          }
        }
      }
    }

    for (const knapp of alleKnapper(data)) {
      if (knapp.handling === 'intern' && !knapp.url) {
        meld(fil, `knappen «${knapp.tekst}» har handling: intern, men mangler url`);
      }
      if (knapp.handling !== 'intern' && knapp.url) {
        meld(
          fil,
          `knappen «${knapp.tekst}» har url, men handling er «${knapp.handling}» — url gjelder kun intern`
        );
      }
    }

    if (Array.isArray(data.bilder)) {
      for (const bilde of data.bilder) {
        if (bilde.alt === '' && bilde.dekorativt !== true) {
          meld(
            fil,
            `bildet «${bilde.fil}» har tom alt-tekst uten dekorativt: true — alt-tekst er innhold og kan ikke utelates stille`
          );
        }
      }
    }
  }

  // Alle interne pekere — brødsmulesti, knapper og kort — må treffe en side
  // som faktisk finnes i settet.
  for (const { fil, data } of sider) {
    const pekere = [];
    if (data.overordnet) pekere.push(['overordnet', data.overordnet]);
    for (const knapp of alleKnapper(data)) {
      if (knapp.url) pekere.push([`knappen «${knapp.tekst}»`, knapp.url]);
    }
    for (const blokk of data.seksjoner || []) {
      for (const kort of blokk.kort || []) {
        if (kort.url) pekere.push([`kortet «${kort.tittel}»`, kort.url]);
      }
    }
    for (const [hva, url] of pekere) {
      if (!setteUrler.has(url)) {
        meld(fil, `${hva} peker på «${url}», som ingen innholdsside har som url`);
      }
    }
  }

  // Lenkemål: deklarerte interne lenker må peke på sider som finnes.
  // (Den autoritative lenkesjekken går i tillegg mot rendret HTML — vakter/lenker.js.)
  for (const { fil, data } of sider) {
    if (!Array.isArray(data.interne_lenker_ut)) continue;
    for (const lenke of data.interne_lenker_ut) {
      if (!setteUrler.has(lenke)) {
        meld(fil, `interne_lenker_ut peker på «${lenke}», som ingen innholdsside har som url`);
      }
    }
  }

  return feil;
}
