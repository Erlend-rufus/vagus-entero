import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { lesMiljo } from './verktoy/miljo-logikk.js';
import { lagJsonld } from './verktoy/jsonld.js';
import { lagHeadersInnhold, lagRobotsInnhold } from './verktoy/headere.js';
import { lesInnhold, avvisKodeFrontmatter } from './vakter/lib/les-innhold.js';
import { validerInnhold } from './vakter/lib/innholdsvalidering.js';
import { lesOgValiderDatafiler } from './vakter/lib/datavalidering.js';
import { formaterTekst, brodsmuletekst } from './verktoy/tekst.js';

// Alle innholdssidetyper deler samme layout: forskjellene ligger i
// innholdets seksjonsblokker, ikke i malen. Bestillingsruten er den ene
// isolerte ruten: integrasjonspartneren kan bygge inn portalen der uten at
// innholdssidene røres (grensesnittavtale 02.09.2026).
const SIDELAYOUT = 'layouts/side.njk';
const BESTILLINGSLAYOUT = 'layouts/bestill.njk';

const LANSERINGSKRITISKE_KLINIKKFELT = ['juridisk_navn', 'org_nr', 'adresse', 'telefon', 'epost'];
const SYNTETISK_INNHOLD = 'vakter/tester/syntetisk-innhold';

export default function (eleventyConfig) {
  const miljo = lesMiljo();

  // «Aldri stille standardverdier» gjelder også malene: et oppslag mot en
  // udefinert variabel skal feile bygget, ikke rendre tom streng.
  eleventyConfig.setNunjucksEnvironmentOptions({ throwOnUndefined: true });

  eleventyConfig.setInputDirectory('src');
  eleventyConfig.setOutputDirectory('dist');
  eleventyConfig.setTemplateFormats(['md', 'njk']);

  // Frontmatter er YAML, aldri kode: gray-matter kan kjøre «---js»-blokker
  // som JavaScript under bygget. Den motoren er slått av her og i vaktenes
  // egen leser (les-innhold.js) — en innholdsfil skal ikke kunne kjøre noe.
  eleventyConfig.setFrontMatterParsingOptions({
    engines: {
      js: avvisKodeFrontmatter,
      javascript: avvisKodeFrontmatter,
      jsLegacy: avvisKodeFrontmatter,
      node: avvisKodeFrontmatter
    }
  });

  // Brødteksten under frontmatter er markdown uten rå HTML: <script>, on*-
  // attributter og skjema kan ikke skrives inn som tekst. Alt det innholdet
  // trenger (overskrifter, lister, interne lenker) finnes i markdown.
  eleventyConfig.amendLibrary('md', (md) => {
    md.set({ html: false, linkify: false });
    // Lenker i brødteksten går bare til egne sider: ingen eksterne adresser,
    // ingen mailto:/tel:, ingen protokollrelative «//»-mål. Alt annet
    // rendres som tekst.
    md.validateLink = (url) => /^\/(?!\/)[a-z0-9/-]*(?:#[a-z0-9-]+)?$/.test(url);
  });

  // Bare kjente filtyper kopieres rett gjennom — en HTML- eller JS-fil som
  // havner i src/bilder/ skal ikke bli en side i produksjon.
  eleventyConfig.addPassthroughCopy('src/fonter/**/*.{woff2,txt}');
  eleventyConfig.addPassthroughCopy('src/bilder/**/*.{svg,png,jpg,webp,avif,ico}');

  // Stilarket får innholdshash i filnavnet: da kan det mellomlagres i et år
  // (immutable), og ny HTML møter aldri gammel CSS etter et deploy.
  const cssHash = crypto
    .createHash('sha256')
    .update(fs.readFileSync('src/stiler/hoved.css'))
    .digest('hex')
    .slice(0, 10);
  const stilSti = `/stiler/hoved.${cssHash}.css`;
  eleventyConfig.addPassthroughCopy({ 'src/stiler/hoved.css': stilSti.slice(1) });
  eleventyConfig.addGlobalData('stilSti', stilSti);

  // Det syntetiske CI-bygget (CI_SYNTETISK=1) tester produksjonsstien med
  // et lite, godkjent innholdssett av ikke-språklig fylltekst i stedet for det
  // ekte innholdet: canonical, sitemap, JSON-LD og alle utdatavakter kjøres
  // da mot ekte HTML i hver PR, ikke første gang på lanseringsdagen.
  if (miljo.ciSyntetisk) {
    eleventyConfig.ignores.add('src/innhold/**');
    for (const navn of fs.readdirSync(SYNTETISK_INNHOLD).filter((f) => f.endsWith('.md'))) {
      eleventyConfig.addTemplate(`innhold/${navn}`, fs.readFileSync(path.join(SYNTETISK_INNHOLD, navn), 'utf8'));
    }
  }

  // ---- Validering FØR bygget: hele innholdssettet, samlet -----------------
  eleventyConfig.on('eleventy.before', () => {
    const sider = lesInnhold(miljo.ciSyntetisk ? SYNTETISK_INNHOLD : undefined);
    const feil = validerInnhold(sider);
    if (feil.length > 0) {
      throw new Error(
        `Innholdskontrakten er brutt (${feil.length} feil):\n  - ${feil.join('\n  - ')}\n` +
          'Bygget stopper med vilje. Se docs/INNHOLDSKONTRAKT.md.'
      );
    }

    // Datafilene valideres mot skjemaene sine i hvert bygg — klinikk.json og
    // ui.json er kontrakt, ikke fritekst.
    const datafeil = lesOgValiderDatafiler();
    if (datafeil.length > 0) {
      throw new Error(
        `Datafilene bryter skjemaet (${datafeil.length} feil):\n  - ${datafeil.join('\n  - ')}\n` +
          'Bygget stopper med vilje. Se skjema/klinikk.schema.json og skjema/ui.schema.json.'
      );
    }

    if (miljo.produksjon) {
      if (!miljo.siteUrl) {
        throw new Error('Produksjonsbygg uten SITE_URL. Sett variabelen — absolutte URL-er gjettes ikke.');
      }
      if (!miljo.ciSyntetisk) {
        const klinikk = JSON.parse(fs.readFileSync('src/_data/klinikk.json', 'utf8'));
        const mangler = LANSERINGSKRITISKE_KLINIKKFELT.filter((felt) => !klinikk[felt]);
        if (mangler.length > 0) {
          throw new Error(
            `Produksjonsbygg med tomme lanseringskritiske klinikkfelter: ${mangler.join(', ')}. ` +
              'Ehandelsloven § 9 krever disse i bunnteksten — fyll src/_data/klinikk.json først.'
          );
        }
        // Et nettsted uten forside er ikke et nettsted: produksjon krever at
        // forsiden er GODKJENT. (Det syntetiske CI-bygget tester stien uten
        // godkjent innhold, og er unntatt.)
        const forside = sider.find((side) => side.data.sidetype === 'forside');
        if (!forside || forside.data.status !== 'GODKJENT') {
          throw new Error(
            'Produksjonsbygg uten GODKJENT forside. Forsiden må være godkjent før noe som helst publiseres.'
          );
        }
      }
    }

  });

  // ---- Produksjonsgaten: UTKAST finnes ikke i produksjonsbygg -------------
  // addPreprocessor som returnerer false er Eleventy 3 sin kanoniske
  // drafts-mekanisme: filen går aldri inn i bygget (verken utdata, collections,
  // meny eller sitemap).
  // Gaten er en tillatelsesliste: i produksjon bygges KUN innholdssider
  // (filer med sidetype) med status GODKJENT. Alt annet — komponentkatalogen
  // eller en tilfeldig mal noen legger i src/ — faller bort uten unntak.
  const sidestatus = new Map();
  eleventyConfig.addPreprocessor('produksjonsgate', 'md,njk', (data, _innhold) => {
    if (data.sidetype) {
      // Innholdssider finnes bare som src/innhold/*.md — det er de filene
      // kontrakten validerer. En fil med sidetype et annet sted, eller en
      // .njk med sidetype, ville gått forbi valideringen usignert.
      const sti = data.page.inputPath.replace(/^\.\//, '');
      if (!/^src\/innhold\/[^/]+\.md$/.test(sti)) {
        throw new Error(
          `${sti}: har sidetype, men ligger utenfor src/innhold/ eller er ikke en .md-fil. Innholdssider valideres bare der — flytt filen.`
        );
      }
      sidestatus.set(data.page.inputPath, {
        url: data.url,
        status: data.status,
        sidetype: data.sidetype,
        tittel: data.tittel,
        noindex: data.noindex === true
      });
      if (miljo.produksjon && data.status !== 'GODKJENT') return false;
      return undefined;
    }
    if (miljo.produksjon) return false;
    return undefined;
  });

  // ---- Kontraktfelter → Eleventy-mekanikk ---------------------------------
  eleventyConfig.addGlobalData('eleventyComputed', {
    permalink: (data) => (data.sidetype ? data.url : data.permalink),
    layout: (data) => {
      if (!data.sidetype) return data.layout;
      return data.sidetype === 'bestilling' ? BESTILLINGSLAYOUT : SIDELAYOUT;
    }
  });

  eleventyConfig.addCollection('innhold', (api) =>
    api.getAll().filter((side) => side.data.sidetype)
  );
  eleventyConfig.addCollection('nav', (api) =>
    api
      .getAll()
      .filter((side) => side.data.sidetype && side.data.i_navigasjon)
      .sort((a, b) => a.data.rekkefolge - b.data.rekkefolge)
  );
  eleventyConfig.addCollection('bunn', (api) =>
    api
      .getAll()
      .filter((side) => side.data.sidetype && side.data.i_bunntekst)
      .sort((a, b) => a.data.rekkefolge - b.data.rekkefolge)
  );

  eleventyConfig.addFilter('jsonld', (side, klinikk) => lagJsonld(side, klinikk, miljo));
  eleventyConfig.addFilter(
    'forside',
    (sider) => (sider || []).find((side) => side.data.sidetype === 'forside') || null
  );
  eleventyConfig.addFilter('sidetype', (sider, type) =>
    (sider || [])
      .filter((side) => side.data.sidetype === type)
      .sort((a, b) => a.data.rekkefolge - b.data.rekkefolge)
  );
  eleventyConfig.addFilter('finnesUrl', (sider, url) =>
    (sider || []).some((side) => side.url === url)
  );
  // En knapp er synlig først når fakta finnes: bestillingsportalen i
  // klinikk.json, telefonnummeret, eller en intern side som er med i bygget.
  // Logikken bor her og ikke i malene, slik at malene bare rendrer.
  eleventyConfig.addFilter('synlige', (knapper, klinikk, sider) => {
    const urler = new Set((sider || []).map((side) => side.url));
    return (knapper || []).filter((k) => {
      if (k.handling === 'bestilling') return Boolean(klinikk.bestilling && klinikk.bestilling.url);
      if (k.handling === 'telefon') return Boolean(klinikk.telefon);
      return urler.has(k.url);
    });
  });
  eleventyConfig.addFilter(
    'finnSide',
    (sider, url) => (url ? (sider || []).find((side) => side.url === url) || null : null)
  );
  // Organisasjonsnummer skrives med mellomrom slik Brønnøysund gjør: 938 387 127.
  eleventyConfig.addFilter('orgnr', (nr) =>
    typeof nr === 'string' ? nr.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3') : nr
  );
  eleventyConfig.addFilter('kroner', (belop) =>
    new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0
    }).format(belop)
  );
  // Prisrader med beløp. Rader med null vises aldri — et beløp finnes eller
  // det finnes ikke.
  eleventyConfig.addFilter('medBelop', (priser) =>
    (priser || []).filter((p) => typeof p.belop_nok === 'number' && p.belop_nok > 0)
  );
  // Prosa: escapet, med [tekst](/sti/) som intern lenke og \n som <br>.
  eleventyConfig.addFilter('tekst', formaterTekst);
  eleventyConfig.addFilter('brodsmule', brodsmuletekst);

  // ---- Etter bygget: _headers, robots.txt, sitemap.xml, manifest ----------
  eleventyConfig.on('eleventy.after', ({ dir, directories, results }) => {
    const ut = ((directories && directories.output) || dir.output).replace(/\/+$/, '');

    fs.writeFileSync(path.join(ut, '_headers'), lagHeadersInnhold(miljo));
    fs.writeFileSync(path.join(ut, 'robots.txt'), lagRobotsInnhold(miljo));

    const sider = results
      .filter((r) => r.outputPath && r.outputPath.endsWith('.html'))
      .map((r) => {
        const meta = sidestatus.get(r.inputPath) || null;
        return {
          url: r.url,
          inputPath: r.inputPath,
          status: meta ? meta.status : null,
          sidetype: meta ? meta.sidetype : null,
          tittel: meta ? meta.tittel : null,
          noindex: meta ? meta.noindex : false
        };
      });

    if (miljo.produksjon && miljo.siteUrl) {
      const base = miljo.siteUrl.replace(/\/$/, '');
      const innholdssider = sider.filter((s) => s.sidetype && !s.noindex);
      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        innholdssider.map((s) => `  <url><loc>${base}${s.url}</loc></url>`).join('\n') +
        '\n</urlset>\n';
      fs.writeFileSync(path.join(ut, 'sitemap.xml'), sitemap);
    }

    // Manifestet er vaktenes fasit. Ingen hemmeligheter her.
    const manifest = {
      generert: new Date().toISOString(),
      produksjon: miljo.produksjon,
      context: miljo.context,
      ciSyntetisk: miljo.ciSyntetisk,
      basicAuthAktiv: miljo.basicAuthAktiv,
      siteUrl: miljo.siteUrl,
      sider
    };
    fs.writeFileSync(`${ut}.manifest.json`, JSON.stringify(manifest, null, 2));
  });

  // Pasienttekst er innhold, ikke kode: markdown skal ikke gjennom en
  // template-motor (stray {{ eller {% i teksten skal verken knekke bygget
  // eller tolkes).
  return { markdownTemplateEngine: false };
}
