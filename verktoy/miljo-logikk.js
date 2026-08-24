// Én kilde til sannhet for miljøtolkning. Brukes av Eleventy-konfig,
// datafilen src/_data/miljo.js og vaktene.
//
// Regler (jf. docs/LANSERING.md):
// - PRODUKSJON er den ene bevisste bryteren. Settes kun i Netlify-dashbordet,
//   scopet til production-konteksten, på lanseringsdagen.
// - CONTEXT settes av Netlify (production | deploy-preview | branch-deploy).
//   Er CONTEXT satt og ulik "production", tvinges noindex uansett PRODUKSJON —
//   previews kan aldri indekseres, uansett feilkonfigurasjon.
// - Basic-Auth er VALGFRI (besluttet av Erlend 24.08.2026): settes
//   PREVIEW_BRUKER/PREVIEW_PASSORD i Netlify, beskyttes alle ikke-produksjons-
//   bygg automatisk; uten dem bygges de åpne, men alltid noindexet.

export function lesMiljo(env = process.env) {
  const produksjonSatt = Boolean(env.PRODUKSJON);
  const context = env.CONTEXT || null;
  const kontekstErProduksjon = context === null || context === 'production';

  const produksjon = produksjonSatt && kontekstErProduksjon;
  const noindex = !produksjon;

  const siteUrl = env.SITE_URL || null;
  const ciSyntetisk = Boolean(env.CI_SYNTETISK);

  const basicAuthBruker = env.PREVIEW_BRUKER || null;
  const basicAuthPassord = env.PREVIEW_PASSORD || null;
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
