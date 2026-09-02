// Én kilde til sannhet for miljøtolkning. Brukes av Eleventy-konfig,
// datafilen src/_data/miljo.js og vaktene.
//
// Regler (jf. docs/LANSERING.md):
// - PRODUKSJON er den ene bevisste bryteren. Settes kun i Netlify-dashbordet,
//   scopet til production-konteksten, på lanseringsdagen. Den godtar bare
//   verdien «1»: «0», «false» eller «nei» stopper bygget i stedet for å bli
//   tolket som produksjon.
// - CONTEXT settes av Netlify (production | deploy-preview | branch-deploy).
//   Er CONTEXT satt og ulik "production", tvinges noindex uansett PRODUKSJON —
//   previews kan aldri indekseres, uansett feilkonfigurasjon.
// - CI_SYNTETISK lar CI teste produksjonsstien uten klinikkfakta. Den er
//   ugyldig i et Netlify-bygg (NETLIFY=true): der finnes ingen «syntetisk»
//   produksjon.
// - Basic-Auth er VALGFRI (besluttet av Erlend 24.08.2026): settes
//   PREVIEW_BRUKER/PREVIEW_PASSORD i Netlify, beskyttes alle ikke-produksjons-
//   bygg automatisk; uten dem bygges de åpne, men alltid noindexet.

function lesBryter(navn, verdi) {
  if (verdi === undefined || verdi === '') return false;
  if (String(verdi) === '1') return true;
  throw new Error(
    `${navn}=${verdi} er ikke en gyldig verdi. Sett ${navn}=1 for å slå på, eller fjern variabelen — «${verdi}» tolkes ikke stille som noe som helst.`
  );
}

export function lesMiljo(env = process.env) {
  const produksjonSatt = lesBryter('PRODUKSJON', env.PRODUKSJON);
  const context = env.CONTEXT || null;
  const kontekstErProduksjon = context === null || context === 'production';

  const produksjon = produksjonSatt && kontekstErProduksjon;
  const noindex = !produksjon;

  // SITE_URL er nettstedets opprinnelse: https, bare vertsnavn, ingen sti og
  // ingen skråstrek på slutten — den limes rett foran sidenes url-er.
  const siteUrl = env.SITE_URL || null;
  if (siteUrl !== null && !/^https:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(siteUrl)) {
    throw new Error(
      `SITE_URL=${siteUrl} er ikke gyldig. Skriv https://vertsnavn uten sti og uten skråstrek til slutt (f.eks. https://www.eksempel.no).`
    );
  }

  const ciSyntetisk = lesBryter('CI_SYNTETISK', env.CI_SYNTETISK);
  if (ciSyntetisk && env.NETLIFY) {
    throw new Error(
      'CI_SYNTETISK er satt i et Netlify-bygg. Den bryteren finnes bare for CI-testing av produksjonsstien og skrur av lanseringsvaktene — fjern den fra Netlify-miljøet.'
    );
  }

  const basicAuthBruker = env.PREVIEW_BRUKER || null;
  const basicAuthPassord = env.PREVIEW_PASSORD || null;
  // Verdiene skrives på én linje i _headers som «bruker:passord» — kolon,
  // mellomrom og kontrolltegn ville ødelagt formatet stille.
  for (const [navn, verdi] of [['PREVIEW_BRUKER', basicAuthBruker], ['PREVIEW_PASSORD', basicAuthPassord]]) {
    if (verdi !== null && !/^[\x21-\x39\x3b-\x7e]{1,128}$/.test(verdi)) {
      throw new Error(`${navn} inneholder kolon, mellomrom eller tegn utenfor ASCII — bruk bare bokstaver, tall og vanlige tegn.`);
    }
  }
  const basicAuthAktiv = !produksjon && Boolean(basicAuthBruker && basicAuthPassord);

  return {
    produksjon,
    produksjonSatt,
    context,
    noindex,
    siteUrl,
    ciSyntetisk,
    basicAuthAktiv,
    basicAuthBruker,
    basicAuthPassord
  };
}
