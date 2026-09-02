# Tilgjengelighet — den manuelle sjekklisten

Automatikken (axe i `verktoy/a11y-test.mjs`, Lighthouse-budsjettet i
`verktoy/lighthouserc.cjs`) fanger erfaringsmessig under halvparten av
reelle brudd. Denne listen gjennomgås derfor **manuelt** ved hver milepæl
(ny mal, ny komponent, før lansering) og resultatet noteres i `docs/HANDOFF.md`
under «Endringer». Målet er WCAG 2.2 AA; lovkravet for private virksomheter
er i dag WCAG 2.0 AA (se `docs/LANSERING.md`).

## Slik kjører du automatikken lokalt

```bash
npx eleventy
A11Y_CHROME=/sti/til/chromium node verktoy/a11y-test.mjs dist 8878   # 0 brudd er kravet
CHROME_PATH=/sti/til/chromium npx lhci autorun --config=verktoy/lighthouserc.cjs
```

## Sjekkliste per milepæl

Kun tastatur (uten mus):
- [ ] Tab-rekkefølgen følger leserekkefølgen på alle sidetyper.
- [ ] Fokus er synlig overalt (3 px mørk petrol, 2 px offset) — også på kort,
      knapper på petrol-flate og i bunnteksten.
- [ ] Hopp-lenken («Hopp til innhold») dukker opp som første tabstopp og virker.
- [ ] Spørsmål og svar (`<details>`) kan åpnes og lukkes med Enter/mellomrom.

Skjermleser (VoiceOver på Mac eller NVDA på Windows):
- [ ] Landemerkene leses: topp, hovednavigasjon, brødsmulesti, hovedinnhold, bunntekst.
- [ ] Overskriftshierarkiet er H1 → H2 → H3 uten hopp på hver side.
- [ ] Nåværende side og seksjon i menyen annonseres (`aria-current`).
- [ ] Strektegningene er stille (tom alt-tekst) og pristabellen leses med
      kolonnehoder.
- [ ] Knappen «Bestill time» sier at den åpner et nytt vindu (setningen under
      knappen), og pilen leses ikke opp.

Forstørrelse og små skjermer:
- [ ] 200 % zoom i nettleseren: ingen tekst kappes, ingen overlapp.
- [ ] 320 px bredde (reflow, WCAG 1.4.10): ingen horisontal rulling på noen
      side — sjekk faktastripen, pristabellen og de lengste overskriftene.
- [ ] Alle klikkflater er minst 44 × 44 px på mobil.

Innhold og farge:
- [ ] Kontrast målt for nye fargepar (tekst ≥ 4,5:1, grafikk ≥ 3:1) —
      terrakotta brukes bare til stegnummer ≥ 24 px og strekdetaljer.
- [ ] Lenketekst gir mening alene («priser og betaling», ikke «her»).
- [ ] Ingen informasjon formidles bare med farge.

Bevegelse og innstillinger:
- [ ] `prefers-reduced-motion` respekteres (nettstedet har ingen animasjon;
      sjekk at ingen nye overganger er kommet til).
- [ ] Nettstedet fungerer identisk med JavaScript slått av (det har ingen).

## Hva som ikke kan testes før innholdet finnes

Lesbarhet og klarspråk i pasientteksten vurderes av innholdsprosessen og
fagansvarlig lege, ikke her. Alt-tekster til eventuelle fotografier kommer
med innholdet (feltet `bilder` er reservert til visningen er bygget).
