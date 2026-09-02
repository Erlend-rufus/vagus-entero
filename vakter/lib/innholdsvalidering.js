import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { tilNorsk } from './norske-meldinger.js';
import { finnLenkemaal } from '../../verktoy/tekst.js';

const skjema = JSON.parse(fs.readFileSync('skjema/innhold.schema.json', 'utf8'));

// discriminator lar ajv velge riktig seksjonsblokk ut fra «type», slik at en
// feil i én blokk gir én forståelig melding og ikke én per blokktype.
const ajv = new Ajv({ allErrors: true, strict: true, discriminator: true });
addFormats(ajv);
const validerMotSkjema = ajv.compile(skjema);

// Plassholdere i innholdet: [TEKST KOMMER], [PLASSHOLDER …], [PREPARAT],
// [KLOKKESLETT] — alt i hakeparentes er plassholder, uansett store eller små
// bokstaver. Unntaket er lenkesyntaksen [tekst](/sti/). En GODKJENT side kan
// ikke inneholde noen plassholder.
const PLASSHOLDER = /\[[^\]\n]+\](?!\()/;

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

// Alle prisrader på siden, med hvilken blokk de står i.
function allePrisrader(data) {
  const rader = [];
  (data.seksjoner || []).forEach((blokk, i) => {
    if (blokk.type === 'pris' || blokk.type === 'prisliste') {
      for (const rad of blokk.priser || []) rader.push({ blokk: i + 1, type: blokk.type, rad });
    }
  });
  return rader;
}

// Går gjennom alle strengverdier i frontmatter, rekursivt, med sti.
function alleStrenger(verdi, sti, ut) {
  if (typeof verdi === 'string') {
    ut.push({ sti, tekst: verdi });
  } else if (Array.isArray(verdi)) {
    verdi.forEach((v, i) => alleStrenger(v, `${sti}[${i + 1}]`, ut));
  } else if (verdi && typeof verdi === 'object') {
    for (const [k, v] of Object.entries(verdi)) alleStrenger(v, sti ? `${sti}.${k}` : k, ut);
  }
  return ut;
}

// Validerer HELE innholdssettet: skjema per fil pluss kontekstreglene som
// krever kjennskap til alle filene. Returnerer en liste norske feilmeldinger —
// tom liste betyr at kontrakten holder.
export function validerInnhold(sider) {
  const feil = [];
  const meld = (fil, tekst) => feil.push(`${fil}: ${tekst}`);

  const setteUrler = new Map();
  const statusForUrl = new Map(sider.map(({ data }) => [data.url, data.status]));
  const rekkefolger = { i_navigasjon: new Map(), i_bunntekst: new Map() };

  for (const { fil, data, body } of sider) {
    if (!validerMotSkjema(data)) {
      for (const m of tilNorsk(validerMotSkjema.errors)) meld(fil, m);
      continue; // kontekstregler gir bare støy når skjemaet allerede feiler
    }

    if (setteUrler.has(data.url)) {
      meld(fil, `url «${data.url}» er allerede brukt av ${setteUrler.get(data.url)}`);
    } else {
      setteUrler.set(data.url, fil);
    }

    // Menyrekkefølgen skal være entydig — ellers blir den filnavnavhengig.
    for (const felt of ['i_navigasjon', 'i_bunntekst']) {
      if (data[felt] === true) {
        const brukt = rekkefolger[felt].get(data.rekkefolge);
        if (brukt) {
          meld(fil, `rekkefolge ${data.rekkefolge} er allerede brukt av ${brukt} (begge har ${felt}: true) — rekkefølgen må være entydig`);
        } else {
          rekkefolger[felt].set(data.rekkefolge, fil);
        }
      }
    }

    if (data.sidetype === 'forside' && data.overordnet) {
      meld(fil, 'forsiden kan ikke ha overordnet — den er toppen av brødsmulestien');
    }

    (data.seksjoner || []).forEach((blokk, i) => {
      if (blokk.type === 'pris' && blokk.sidekolonne && Array.isArray(blokk.priser)) {
        meld(fil, `seksjon nr. ${i + 1}: prisblokken har både sidekolonne og priser — bare én av dem vises i høyre kolonne, velg`);
      }
      if (blokk.type === 'prisliste' && !blokk.kolonner && (blokk.priser || []).some((rad) => rad.omfang)) {
        meld(fil, `seksjon nr. ${i + 1}: prislisten har omfang på rader, men mangler kolonner — omfang vises bare med kolonnehoder`);
      }
    });

    if (Array.isArray(data.bilder) && data.bilder.length > 0) {
      meld(fil, 'bilder er et reservert felt: ingen mal viser bilder ennå, så listen må være tom til visningen finnes (ellers ville bildene forsvinne stille)');
    }

    if (data.status === 'GODKJENT') {
      const strenger = alleStrenger(data, '', []);
      if (typeof body === 'string') strenger.push({ sti: 'brødtekst', tekst: body });
      const medPlassholder = strenger.filter((s) => PLASSHOLDER.test(s.tekst));
      if (medPlassholder.length > 0) {
        const eksempel = PLASSHOLDER.exec(medPlassholder[0].tekst)[0];
        meld(
          fil,
          `status er GODKJENT, men siden inneholder ${medPlassholder.length} plassholder(e) — f.eks. «${eksempel}» i ${medPlassholder[0].sti}. Plassholdere kan ikke godkjennes`
        );
      }
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
      const rader = allePrisrader(data);
      if (data.sidetype === 'pris') {
        const prislister = (data.seksjoner || []).filter((b) => b.type === 'prisliste');
        if (prislister.length === 0) {
          meld(
            fil,
            'en prisside kan ikke være GODKJENT uten en prisliste-seksjon — prislisten er lovpålagt (prisopplysningsforskriften § 10)'
          );
        }
      }
      const uavklarte = rader.filter((r) => r.rad.belop_nok === null);
      if (uavklarte.length > 0) {
        meld(
          fil,
          `status er GODKJENT, men ${uavklarte.length} prislinje(r) mangler beløp (første: «${uavklarte[0].rad.navn}» i seksjon nr. ${uavklarte[0].blokk}) — en godkjent side kan ikke ha priser som «kommer» (prisopplysningsforskriften § 10)`
        );
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
  }

  // Alle interne pekere — brødsmulesti, knapper, kort og lenker i teksten —
  // må treffe en side som faktisk finnes i settet.
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
    for (const { sti, tekst } of alleStrenger(data, '', [])) {
      for (const url of finnLenkemaal(tekst)) pekere.push([`lenken i ${sti}`, url]);
    }
    for (const [hva, url] of pekere) {
      if (!setteUrler.has(url)) {
        meld(fil, `${hva} peker på «${url}», som ingen innholdsside har som url`);
      } else if (data.status === 'GODKJENT' && statusForUrl.get(url) !== 'GODKJENT') {
        // I produksjon finnes ikke målet — lenken ville blitt død (tekst) eller
        // forsvunnet stille (knapp). Godkjenning må skje i riktig rekkefølge.
        meld(fil, `status er GODKJENT, men ${hva} peker på «${url}», som ikke er GODKJENT — målet må godkjennes først`);
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
