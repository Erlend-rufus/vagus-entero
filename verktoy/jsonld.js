// Genererer strukturerte data fra klinikk.json + sidens frontmatter.
// Regler (innholdskontrakten, byggregel 6):
// - Kun for GODKJENT-sider med jsonld_type satt.
// - null-felter UTELATES — det gjettes aldri.
// - MedicalClinic sendes ikke ut før navn + adresse + telefon finnes.
// - Physician sendes ikke ut før lege er bekreftet.
// - Tilstands- og symptomsider får MedicalCondition/MedicalSignOrSymptom
//   med kun navn, beskrivelse og url — aldri behandlingspåstander.
// - Andre typer enn de tillatte kan ikke oppstå (skjema-enum + vakt).

function fjernTomme(objekt) {
  if (Array.isArray(objekt)) {
    const liste = objekt.map(fjernTomme).filter((v) => v !== undefined);
    return liste.length > 0 ? liste : undefined;
  }
  if (objekt !== null && typeof objekt === 'object') {
    const ut = {};
    for (const [nokkel, verdi] of Object.entries(objekt)) {
      const renset = fjernTomme(verdi);
      if (renset !== undefined) ut[nokkel] = renset;
    }
    return Object.keys(ut).some((k) => !k.startsWith('@')) ? ut : undefined;
  }
  if (objekt === null || objekt === '') return undefined;
  return objekt;
}

export function lagJsonld(side, klinikk, miljo) {
  if (!side || side.status !== 'GODKJENT' || !side.jsonld_type) return null;

  const absoluttUrl =
    miljo && miljo.siteUrl && side.url ? `${miljo.siteUrl.replace(/\/$/, '')}${side.url}` : null;

  let objekt = null;

  if (['MedicalProcedure', 'MedicalCondition', 'MedicalSignOrSymptom'].includes(side.jsonld_type)) {
    objekt = {
      '@context': 'https://schema.org',
      '@type': side.jsonld_type,
      name: side.tittel,
      description: side.meta_beskrivelse,
      url: absoluttUrl
    };
  }

  if (side.jsonld_type === 'MedicalClinic') {
    if (!klinikk.juridisk_navn || !klinikk.adresse || !klinikk.telefon) return null;
    objekt = {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      name: klinikk.juridisk_navn,
      telephone: klinikk.telefon,
      email: klinikk.epost,
      address: {
        '@type': 'PostalAddress',
        streetAddress: klinikk.adresse.gate,
        postalCode: klinikk.adresse.postnummer,
        addressLocality: klinikk.adresse.poststed,
        addressCountry: 'NO'
      },
      url: absoluttUrl
    };
  }

  if (side.jsonld_type === 'Physician') {
    if (!klinikk.lege || !klinikk.lege.navn) return null;
    objekt = {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: klinikk.lege.navn,
      medicalSpecialty: klinikk.lege.spesialitet,
      url: absoluttUrl
    };
  }

  const renset = fjernTomme(objekt);
  return renset ? JSON.stringify(renset, null, 0) : null;
}
