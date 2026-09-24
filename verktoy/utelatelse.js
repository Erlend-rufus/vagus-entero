// Utelatelse: et element i en innholdsfil kan erklære hvilke felt i
// klinikk.json det krever (krever: ["adkomst.parkering"]). Mangler ett av
// dem (null), bygges ikke elementet. Det er et eksplisitt valg per element i
// innholdsfilen, aldri en stille fallback: en {klinikk.felt}-referanse i et
// element som IKKE har erklært feltet, stopper fortsatt bygget (tekst.js).
//
// Uten PRODUKSJON erstattes et utelatt element av én merket linje
// ({ venter: «feltnavn, feltnavn» }) slik at klinikken ser hva som mangler.
// Med PRODUKSJON er elementet borte. En seksjon som står tom etter
// utelatelse, utelates helt med overskrift; i forhåndsvisningen står én
// merket linje for hele seksjonen i stedet.
//
// Feltnavnene i markøren er «title» i skjema/klinikk.schema.json — samme
// sted som feltene er dokumentert.

import fs from 'node:fs';

const KLINIKK = 'src/_data/klinikk.json';
const SKJEMA = 'skjema/klinikk.schema.json';

let etikettCache;

// Alle bladfelt i klinikkskjemaet, med title: { 'adkomst.parkering': 'parkering', … }.
export function klinikkfelt() {
  if (!etikettCache) {
    etikettCache = new Map();
    const gaa = (node, sti) => {
      if (node && node.properties) {
        for (const [navn, under] of Object.entries(node.properties)) {
          gaa(under, sti ? `${sti}.${navn}` : navn);
        }
      } else if (sti) {
        etikettCache.set(sti, node.title || null);
      }
    };
    gaa(JSON.parse(fs.readFileSync(SKJEMA, 'utf8')), '');
  }
  return etikettCache;
}

function hentVerdi(klinikk, sti) {
  return sti
    .split('.')
    .reduce((o, k) => (o != null && typeof o === 'object' ? o[k] : undefined), klinikk);
}

export function lesKlinikk() {
  return JSON.parse(fs.readFileSync(KLINIKK, 'utf8'));
}

// Feltene i krever som mangler (null, tom streng eller finnes ikke).
export function manglendeFelt(krever, klinikk) {
  return (krever || []).filter((sti) => {
    const verdi = hentVerdi(klinikk, sti);
    return verdi === null || verdi === undefined || verdi === '';
  });
}

function etiketter(stier) {
  const felt = klinikkfelt();
  return stier.map((sti) => felt.get(sti) || sti);
}

function markor(felt) {
  return { venter: felt.join(', '), felt };
}

// Én markør for flere elementer: feltnavnene i rekkefølge, uten dubletter.
function slaaSammen(markorer) {
  return markor([...new Set(markorer.flatMap((m) => m.felt))]);
}

function lagUtelater(klinikk, produksjon) {
  // Returnerer elementet slik det skal rendres, en markør, eller null.
  function vurder(krever, beholdt) {
    const mangler = manglendeFelt(krever, klinikk);
    if (mangler.length === 0) return beholdt;
    return produksjon ? null : markor(etiketter(mangler));
  }

  // avsnitt/liten: en streng, eller { tekst, krever }.
  function tekstelement(element) {
    if (element && typeof element === 'object' && 'krever' in element) {
      return vurder(element.krever, element.tekst);
    }
    return element;
  }

  function tekstliste(liste) {
    return (liste || []).map(tekstelement).filter((e) => e !== null);
  }

  // Punkter med egne felt (praktisk, fakta): krever fjernes fra det som rendres.
  function punktliste(liste) {
    return (liste || [])
      .map((punkt) => {
        if (!punkt.krever) return punkt;
        const { krever, ...resten } = punkt;
        return vurder(krever, resten);
      })
      .filter((p) => p !== null);
  }

  return { tekstelement, tekstliste, punktliste };
}

const erEkte = (e) => !(e && typeof e === 'object' && 'venter' in e);

function harBelop(priser) {
  return (priser || []).some((p) => typeof p.belop_nok === 'number' && p.belop_nok > 0);
}

export function utelatSeksjoner(blokker, { klinikk, produksjon }) {
  const u = lagUtelater(klinikk, produksjon);
  const ut = [];
  for (const original of blokker || []) {
    const blokk = { ...original };
    let innhold; // elementene som avgjør om seksjonen står tom

    if (blokk.avsnitt) {
      blokk.avsnitt = u.tekstliste(blokk.avsnitt);
      innhold = blokk.avsnitt;
    }
    if (blokk.type === 'praktisk') {
      blokk.punkter = u.punktliste(blokk.punkter);
      innhold = blokk.punkter;
    }
    if (blokk.type === 'veier') {
      blokk.veier = blokk.veier
        .map((vei) => {
          const ny = { ...vei, avsnitt: u.tekstliste(vei.avsnitt) };
          if ('liten' in vei) {
            const liten = u.tekstelement(vei.liten);
            if (liten === null) delete ny.liten;
            else ny.liten = liten;
          }
          return ny;
        })
        .filter((vei) => vei.avsnitt.some(erEkte) || !produksjon);
      innhold = blokk.veier.filter((vei) => vei.avsnitt.some(erEkte));
    }
    if (blokk.sidekolonne) {
      const avsnitt = u.tekstliste(blokk.sidekolonne.avsnitt);
      if (avsnitt.length === 0) delete blokk.sidekolonne;
      else blokk.sidekolonne = { ...blokk.sidekolonne, avsnitt };
    }
    if (blokk.priser) {
      // Prisrader følger samme regel: null betyr utelatt. Mangler alle
      // beløp, står én samlet markør for hele tabellen, ikke én per rad.
      blokk.venter_priser = !produksjon && !harBelop(blokk.priser);
      blokk.har_omfang = blokk.priser.some((rad) => rad.omfang);
    }

    const ekte = innhold ? innhold.filter(erEkte) : null;
    const tom =
      ekte !== null &&
      ekte.length === 0 &&
      !(blokk.type === 'pris' && (blokk.sidekolonne || blokk.knapper || harBelop(blokk.priser)));

    if (!tom) {
      ut.push(blokk);
    } else if (!produksjon) {
      const markorer = [];
      for (const e of innhold) {
        if (!erEkte(e)) markorer.push(e);
        if (e && e.avsnitt) markorer.push(...e.avsnitt.filter((a) => !erEkte(a)));
      }
      ut.push({ type: 'venter', ...slaaSammen(markorer) });
    }
  }
  return ut;
}

export function utelatFakta(fakta, { klinikk, produksjon }) {
  return lagUtelater(klinikk, produksjon).punktliste(fakta);
}
