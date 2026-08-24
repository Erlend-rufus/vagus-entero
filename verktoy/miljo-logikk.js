// Én kilde til sannhet for miljøtolkning. Brukes av Eleventy-konfig,
// datafilen src/_data/miljo.js og vaktene.
//
// Regler (jf. docs/LANSERING.md):
// - PRODUKSJON er den ene bevisste bryteren. Settes kun i Netlify-dashbordet,
//   scopet til production-konteksten, på lanseringsdagen.
// - CONTEXT settes av Netlify (production | deploy-preview | branch-deploy).
//   Er CONTEXT satt og ulik "production", tvinges noindex uansett PRODUKSJON —
//   previews kan aldri indekseres, uansett feilkonfigurasjon.
// - Basic-Auth kreves på alle Netlify-bygg som ikke er produksjonsbygg.

export function lesMiljo(env = process.env) {
  const produksjonSatt = Boolean(env.PRODUKSJON);
  const context = env.CONTEXT || null;
  const kontekstErProduksjon = context === null || context === 'production';

  const produksjon = produksjonSatt && kontekstErProduksjon;
  const noindex = !produksjon;

  const siteUrl = env.SITE_URL || null;
  const ciSyntetisk = Boolean(env.CI_SYNTETISK);

  const basicAuthPakrevd = !produksjon && context !== null;
  const basicAuthBruker = env.PREVIEW_BRUKER || null;
  const basicAuthPassord = env.PREVIEW_PASSORD || null;

  return {
    produksjon,
    produksjonSatt,
    context,
    noindex,
    siteUrl,
    ciSyntetisk,
    basicAuthPakrevd,
    basicAuthBruker,
    basicAuthPassord
  };
}
