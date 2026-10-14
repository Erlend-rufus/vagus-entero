# Stedsavhengighet: alt som er knyttet til dagens adresse

**Dato:** 08.10.2026 (arbeidsordre «innlemming av svar fra klinikken», del 3)
**Status:** Rapport. Ingenting er endret. Klinikken skal avklare nye lokaler 12.–13. oktober. Dagens adresse er Sartor Helsehus, Sartorvegen 8, 5354 Straume.

Rapporten er laget ved å søke i `src/` (innhold og maler), `verktoy/` og `src/_data/` etter **Straume, Sartor, Helsehus, Sartorvegen, Øygarden, Sotra, Askøy** og postnummeret **5354**. «Bergen» er tatt med for seg. Fedmesiden (`overvekt-og-fedme.md`) er parkert og ikke telt. Linjenumrene gjelder filene slik de står på `main` etter denne leveransen. Finn forekomstene på nytt med søket nederst før du endrer noe.

## Rutine når adressen er avgjort

1. **Adressen:** oppdater `adresse.gate`, `adresse.postnummer`, `adresse.poststed` og `adresse.bygg` i `src/_data/klinikk.json`. `bygg` er valgfritt: ta bort feltet hvis det nye stedet ikke har bygningsnavn. Dette oppdaterer automatisk bunnteksten, kontaktsiden, henvisersiden, personvernsiden og JSON-LD for forsiden.
2. **Adkomst og tilgjengelighet:** fyll `adkomst.parkering`, `adkomst.kollektiv`, `adkomst.tilgjengelighet` og `adkomst.reisetid_bergen`, og `apningstider`, for den nye adressen. Feltene står som `null` i dag og er knyttet til dagens lokaler. Svarene som kom fra klinikken gjaldt Sartor Helsehus og skal ikke brukes for nye lokaler.
3. **Stedsnavn i tekst (tabell A og B under):** disse er skrevet rett inn i innholdsfilene og følger **ikke** av punkt 1. Gå gjennom hver rad. Titler og metabeskrivelser (tabell A1) påvirker søk, så de oppdateres sammen med canonical-planen. Tabell B inneholder konkrete adressedata, og tabell A3 inneholder påstander om dekningsområde som må vurderes mot det nye stedet.
4. **Fedmesiden** (parkert) har egne stedsnavn og må sjekkes den dagen den settes inn igjen.
5. Kjør `npm run bygg` og søket nederst. Det skal ikke finnes treff på det gamle stedet utenfor `apne_punkter`.
6. **Forslag, ikke gjort:** et felt `sted` i `klinikk.json` (for eksempel «Straume») som kan settes inn med `{klinikk.sted}` i tekst. Da blir stedsnavn i løpende tekst datadrevet. Titler og metabeskrivelser ligger i frontmatter og kan ikke bruke referansen uten at skjema og validering utvides.

## Skillet

- **(a) Bare stedsnavn.** «Straume», «ved Bergen», «Øygarden» i sidetittel, metabeskrivelse, ingress eller løpende tekst. Teksten stemmer så lenge klinikken ligger i samme område.
- **(b) Konkrete adressedata.** Gateadresse, bygningsnavn, postnummer, adkomst, parkering, buss, tilgjengelighet. Disse **må** oppdateres hvis lokalene flyttes.

## Alt som allerede hentes fra `klinikk.json`

Disse endres ved å redigere `klinikk.json`, ikke i innholdsfilene:

| Fil og linje | Hva |
|---|---|
| `src/_data/klinikk.json` | `adresse.gate` (Sartorvegen 8), `adresse.postnummer` (5354), `adresse.poststed` (Straume), `adresse.bygg` (Sartor Helsehus) |
| `src/_includes/komponenter/footer.njk:16-17` | Bunntekstens adresse, med bygg foran |
| `verktoy/jsonld.js:47-58` | Adresse i JSON-LD for forsiden, som bare lages når siden er GODKJENT |
| `src/innhold/kontakt.md` («Adresse») | `{klinikk.adresse.*}`, men med **fast** «, Øygarden» etter poststedet (tabell A2) |
| `src/innhold/for-henvisende-leger.md` («Adresse») | `{klinikk.adresse.*}` |
| `src/innhold/personvern.md` («Behandlingsansvarlig») | `{klinikk.adresse.*}` |
| `src/innhold/kontakt.md`, `src/innhold/for-forsikringsselskaper.md` | `adkomst.parkering`, `adkomst.kollektiv`, `adkomst.tilgjengelighet`, `adkomst.reisetid_bergen` (alle `null` i dag, utelatt) |

## Tabell B: konkrete adressedata (b)

| Fil og linje | Felt | Det som står |
|---|---|---|
| `src/innhold/om-klinikken.md:51` | fakta | verdi: "Sartor Helsehus, Straume" |
| `src/innhold/om-klinikken.md:62` | seksjoner | - "Klinikken holder til i Sartor Helsehus på Straume i Øygarden, vest for Bergen. Den drives av én leg… |

## Tabell A1: stedsnavn i sidetittel, metabeskrivelse, ingress og tittel (a)

Disse styrer det som vises i søkeresultater.

| Fil og linje | Felt | Det som står |
|---|---|---|
| `src/innhold/analfissur.md:6` | sidetittel | sidetittel: "Analfissur: behandling på Straume ved Bergen" |
| `src/innhold/analfissur.md:8` | meta_beskrivelse | …lyst rødt blod ved avføring. Undersøkelse og behandling på Straume ved Bergen, uten henvisning." |
| `src/innhold/blod-i-avforingen.md:6` | sidetittel | sidetittel: "Blod i avføringen: undersøkelse privat på Straume ved Bergen" |
| `src/innhold/blod-i-avforingen.md:8` | meta_beskrivelse | …er en rift, men skal alltid undersøkes. Utredning privat på Straume ved Bergen, uten henvisning." |
| `src/innhold/forside.md:6` | sidetittel | sidetittel: "Klinikk for mage, tarm og endetarm på Straume" |
| `src/innhold/forside.md:8` | meta_beskrivelse | …behandling av plager i mage, tarm og endetarm. Vi åpner på Straume i Øygarden 1. januar 2027." |
| `src/innhold/forside.md:9` | ingress | …behandling av plager i mage, tarm og endetarm. Vi åpner på Straume i Øygarden 1. januar 2027." |
| `src/innhold/gastroskopi.md:6` | sidetittel | sidetittel: "Gastroskopi privat på Straume ved Bergen" |
| `src/innhold/gastroskopi.md:8` | meta_beskrivelse | meta_beskrivelse: "Gastroskopi privat på Straume ved Bergen. Kikkertundersøkelse av spiserør og magesekk med bedøvende… |
| `src/innhold/hemoroider.md:6` | sidetittel | sidetittel: "Hemoroider: behandling med strikk på Straume ved Bergen" |
| `src/innhold/hemoroider.md:8` | meta_beskrivelse | …a du kan gjøre selv, og strikkbehandling (strikkligatur) på Straume ved Bergen." |
| `src/innhold/hemoroider.md:9` | ingress | …ger som varer ved, kan behandles med strikk på klinikken på Straume, uten henvisning." |
| `src/innhold/irritabel-tarm.md:6` | sidetittel | sidetittel: "Irritabel tarm (IBS): utredning privat på Straume ved Bergen" |
| `src/innhold/irritabel-tarm.md:8` | meta_beskrivelse | …ellom løs og treg, uten skade i tarmen. Utredning privat på Straume ved Bergen." |
| `src/innhold/koloskopi.md:6` | sidetittel | sidetittel: "Koloskopi privat på Straume ved Bergen" |
| `src/innhold/koloskopi.md:8` | meta_beskrivelse | meta_beskrivelse: "Koloskopi privat på Straume ved Bergen. Kikkertundersøkelse av tykktarmen, med lett sedasjon ved… |
| `src/innhold/kontakt.md:6` | sidetittel | sidetittel: "Kontakt og bestill time på Straume" |
| `src/innhold/magesmerter.md:6` | sidetittel | sidetittel: "Magesmerter: utredning privat på Straume ved Bergen" |
| `src/innhold/magesmerter.md:8` | meta_beskrivelse | meta_beskrivelse: "Langvarige magesmerter utredes privat på Straume ved Bergen: samtale, undersøkelse, blodprøver og gastroskopi eller ko… |
| `src/innhold/om-klinikken.md:6` | sidetittel | sidetittel: "Om Vagus Entero Klinikken på Straume: legen og klinikken" |
| `src/innhold/om-klinikken.md:8` | meta_beskrivelse | …_beskrivelse: "Privat klinikk for mage, tarm og endetarm på Straume ved Bergen. Legen er Kristian Eeg Storli, spesialist i mage- og tarmk… |
| `src/innhold/om-klinikken.md:9` | ingress | …linikken er en privat klinikk for mage, tarm og endetarm på Straume i Øygarden, vest for Bergen. Klinikken åpner i januar 2027. Legen er… |
| `src/innhold/proktologi.md:6` | sidetittel | sidetittel: "Proktologisk behandling privat på Straume ved Bergen" |
| `src/innhold/proktologi.md:8` | meta_beskrivelse | …g salver på resept. Privat behandling av endetarmsplager på Straume ved Bergen." |
| `src/innhold/refluks.md:6` | sidetittel | sidetittel: "Refluks og halsbrann: utredning privat på Straume ved Bergen" |
| `src/innhold/refluks.md:8` | meta_beskrivelse | …n gjøre selv og når gastroskopi trengs. Utredning privat på Straume ved Bergen, uten henvisning." |
| `src/innhold/undersokelse-av-endetarmen.md:6` | sidetittel | sidetittel: "Anoskopi og rektoskopi privat på Straume ved Bergen" |
| `src/innhold/undersokelse-av-endetarmen.md:8` | meta_beskrivelse | meta_beskrivelse: "Anoskopi og rektoskopi privat på Straume ved Bergen. Kort undersøkelse av endetarmen ved blod i avføringen, he… |

## Tabell A2: stedsnavn i løpende tekst og faktalister (a)

| Fil og linje | Felt | Det som står |
|---|---|---|
| `src/innhold/blod-i-avforingen.md:109` | seksjoner | …sning er nødvendig. Du bestiller time selv hos klinikken på Straume, og utredningen starter med en samtale hos legen, som er spesialist i… |
| `src/innhold/for-forsikringsselskaper.md:36` | fakta | verdi: "Straume, Øygarden" |
| `src/innhold/for-forsikringsselskaper.md:113` | seksjoner | tekst: "Klinikken ligger på Straume i Øygarden og dekker Bergen vest, Øygarden, Askøy og Sotra." |
| `src/innhold/gastroskopi.md:89` | seksjoner | - "Undersøkelsen gjøres på klinikken på Straume, uten innleggelse, og du reiser hjem samme dag. Legen er spesialist i… |
| `src/innhold/irritabel-tarm.md:135` | seksjoner | …vorlig sykdom er stor. Undersøkelsen gjøres på klinikken på Straume. Er koloskopien 1 til 2 år gammel, trenger den som regel ikke gjentas… |
| `src/innhold/koloskopi.md:109` | seksjoner | - "Undersøkelsen gjøres på klinikken på Straume, uten innleggelse, og du reiser hjem samme dag. Legen er spesialist i… |
| `src/innhold/kontakt.md:59` | seksjoner | …}\n{klinikk.adresse.postnummer} {klinikk.adresse.poststed}, Øygarden" |
| `src/innhold/magesmerter.md:89` | seksjoner | - "Klinikken på Straume utreder langvarige magesmerter hos voksne: samtale, undersøkelse og b… |
| `src/innhold/proktologi.md:89` | seksjoner | …nnen medisin på resept. Behandlingen gjøres på klinikken på Straume, uten innleggelse, og du reiser hjem samme dag." |
| `src/innhold/refluks.md:112` | seksjoner | …rgi, og gjør både samtalen og gastroskopien på klinikken på Straume. Er gastroskopi aktuelt, settes den opp som en egen time, og du må mø… |
| `src/innhold/refluks.md:138` | seksjoner | …e årsaker til plagene. Undersøkelsen gjøres på klinikken på Straume, og du reiser hjem samme dag." |
| `src/innhold/undersokelse-av-endetarmen.md:85` | seksjoner | …er tømme hele tarmen på forhånd. Den gjøres på klinikken på Straume, uten sedasjon, og du reiser hjem, kjører bil og spiser som vanlig et… |

## Tabell A3: dekningsområde

`src/innhold/for-forsikringsselskaper.md` («Geografisk dekning») sier hvilke områder klinikken dekker. Det er en påstand om området rundt adressen, ikke bare et stedsnavn. Den står i tabell A2 over, og må vurderes mot det nye stedet.

## Tabell R: «Bergen» og regionen

Bergen er regionen klinikken ligger i, og stemmer trolig også for nye lokaler, men reisetid og «vest for Bergen» gjør det.

| Fil og linje | Felt | Det som står |
|---|---|---|
| `src/innhold/analfissur.md:6` | sidetittel | sidetittel: "Analfissur: behandling på Straume ved Bergen" |
| `src/innhold/analfissur.md:8` | meta_beskrivelse | …lod ved avføring. Undersøkelse og behandling på Straume ved Bergen, uten henvisning." |
| `src/innhold/blod-i-avforingen.md:6` | sidetittel | …tel: "Blod i avføringen: undersøkelse privat på Straume ved Bergen" |
| `src/innhold/blod-i-avforingen.md:8` | meta_beskrivelse | …men skal alltid undersøkes. Utredning privat på Straume ved Bergen, uten henvisning." |
| `src/innhold/for-forsikringsselskaper.md:7` | meta_beskrivelse | …som behandlingssted for gastroenterologiske undersøkelser i Bergensområdet." |
| `src/innhold/for-forsikringsselskaper.md:8` | ingress | …som behandlingssted for gastroenterologiske undersøkelser i Bergensområdet." |
| `src/innhold/for-forsikringsselskaper.md:37` | fakta | - term: "Fra Bergen sentrum" |
| `src/innhold/for-forsikringsselskaper.md:113` | seksjoner | …tekst: "Klinikken ligger på Straume i Øygarden og dekker Bergen vest, Øygarden, Askøy og Sotra." |
| `src/innhold/gastroskopi.md:6` | sidetittel | sidetittel: "Gastroskopi privat på Straume ved Bergen" |
| `src/innhold/gastroskopi.md:8` | meta_beskrivelse | meta_beskrivelse: "Gastroskopi privat på Straume ved Bergen. Kikkertundersøkelse av spiserør og magesekk med bedøvende halsspray.… |
| `src/innhold/hemoroider.md:6` | sidetittel | …detittel: "Hemoroider: behandling med strikk på Straume ved Bergen" |
| `src/innhold/hemoroider.md:8` | meta_beskrivelse | …re selv, og strikkbehandling (strikkligatur) på Straume ved Bergen." |
| `src/innhold/irritabel-tarm.md:6` | sidetittel | …tel: "Irritabel tarm (IBS): utredning privat på Straume ved Bergen" |
| `src/innhold/irritabel-tarm.md:8` | meta_beskrivelse | …treg, uten skade i tarmen. Utredning privat på Straume ved Bergen." |
| `src/innhold/koloskopi.md:6` | sidetittel | sidetittel: "Koloskopi privat på Straume ved Bergen" |
| `src/innhold/koloskopi.md:8` | meta_beskrivelse | meta_beskrivelse: "Koloskopi privat på Straume ved Bergen. Kikkertundersøkelse av tykktarmen, med lett sedasjon ved behov. Om t… |
| `src/innhold/magesmerter.md:6` | sidetittel | sidetittel: "Magesmerter: utredning privat på Straume ved Bergen" |
| `src/innhold/magesmerter.md:8` | meta_beskrivelse | …else: "Langvarige magesmerter utredes privat på Straume ved Bergen: samtale, undersøkelse, blodprøver og gastroskopi eller koloskopi ved… |
| `src/innhold/om-klinikken.md:8` | meta_beskrivelse | …: "Privat klinikk for mage, tarm og endetarm på Straume ved Bergen. Legen er Kristian Eeg Storli, spesialist i mage- og tarmkirurgi med… |
| `src/innhold/om-klinikken.md:9` | ingress | …for mage, tarm og endetarm på Straume i Øygarden, vest for Bergen. Klinikken åpner i januar 2027. Legen er Kristian Eeg Storli, spesial… |
| `src/innhold/om-klinikken.md:62` | seksjoner | …older til i Sartor Helsehus på Straume i Øygarden, vest for Bergen. Den drives av én lege og én sykepleier, og den er laget for at du sk… |
| `src/innhold/om-klinikken.md:72` | seksjoner | - "Han har doktorgrad fra Universitetet i Bergen på kirurgisk behandling av tykktarmskreft." |
| `src/innhold/om-klinikken.md:74` | seksjoner | - "Han er født i Bergen i 1971." |
| `src/innhold/om-klinikken.md:87` | seksjoner | …iakonale Sykehus og Klinisk institutt 1 ved Universitetet i Bergen." |
| `src/innhold/om-klinikken.md:99` | seksjoner | - tittel: "Doktoravhandling, Universitetet i Bergen, 2014" |
| `src/innhold/proktologi.md:6` | sidetittel | sidetittel: "Proktologisk behandling privat på Straume ved Bergen" |
| `src/innhold/proktologi.md:8` | meta_beskrivelse | …resept. Privat behandling av endetarmsplager på Straume ved Bergen." |
| `src/innhold/refluks.md:6` | sidetittel | …tel: "Refluks og halsbrann: utredning privat på Straume ved Bergen" |
| `src/innhold/refluks.md:8` | meta_beskrivelse | …og når gastroskopi trengs. Utredning privat på Straume ved Bergen, uten henvisning." |
| `src/innhold/undersokelse-av-endetarmen.md:6` | sidetittel | sidetittel: "Anoskopi og rektoskopi privat på Straume ved Bergen" |
| `src/innhold/undersokelse-av-endetarmen.md:8` | meta_beskrivelse | …_beskrivelse: "Anoskopi og rektoskopi privat på Straume ved Bergen. Kort undersøkelse av endetarmen ved blod i avføringen, hemoroider og… |

## `apne_punkter` (ikke publisert)

Det finnes 3 treff i `apne_punkter`. De vises ikke på nettstedet og trenger ikke endres for at siden skal stemme, men bør leses når adressen er avgjort:

| Fil og linje | Felt | Det som står |
|---|---|---|
| `src/innhold/for-forsikringsselskaper.md:17` | apne_punkter | - "Reisetid fra Bergen sentrum og avtaleform i faktalisten utelates til adkomst.reisetid_ber… |
| `src/innhold/om-klinikken.md:24` | apne_punkter | …rbeidet som overlege ved kirurgisk avdeling på et sykehus i Bergen.»" |
| `src/innhold/om-klinikken.md:27` | apne_punkter | …fra hans egen tekst og bør kontrolleres mot Universitetet i Bergens database. Kristian kan bytte ut eller legge til inntil to publikasjo… |

## Søk som finner alt på nytt

```
grep -rn -E "Straume|Sartor|Helsehus|Øygarden|Sotra|Askøy|5354" src verktoy --include=*.md --include=*.njk --include=*.js --include=*.json
```

Sjekk også `docs/` og `netlify.toml` (ingen treff på stedsnavn per 08.10.2026), og at ingen mal i `src/_includes/` har stedsnavn skrevet inn (ingen treff per 08.10.2026).
