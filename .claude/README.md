# Claude Code-oppsett

Alt Claude Code trenger for dette prosjektet ligger her og i `.mcp.json` i rota.
Det meste settes opp automatisk når du stoler på (trust) mappa — ingen manuelle
`/plugin`-kommandoer.

## Plugins (`settings.json`)

`extraKnownMarketplaces` registrerer to marketplaces, og `enabledPlugins` slår på
fire plugins:

| Plugin | Marketplace | Kommandoer | Innhold |
|---|---|---|---|
| [`code-foundations`](https://github.com/ryanthedev/code-foundations) | [`rtd`](https://github.com/ryanthedev/rtd-claude-inn) | `/code-foundations:research`, `:plan`, `:build`, `:debug` | 19 skills fra Code Complete, APOSD, GoF og Clean Architecture |
| [`design-for-ai`](https://github.com/ryanthedev/design-for-ai) | `rtd` | `/design-for-ai:research`, `:plan`, `:mock`, `:build` | Designdoktrine + skills: `prototype`, `clarify`, `usability`, `data-viz` |
| [`oberskills`](https://github.com/ryanthedev/oberskills) | `rtd` | `/oberskills:shot` | Skills: `browser`, `web-research`, `prompt`, `agent`, `write`, `skill-craft`, `shot`, `clarify` |
| [`taste-skill`](https://github.com/Leonxlnx/taste-skill) | [`taste-skill`](https://github.com/Leonxlnx/taste-skill) | — | 13 frontend-design-skills, bl.a. `design-taste-frontend` og `image-to-code` |

Taste Skill dekker både **Taste Skill** og **Image to Code** — begge ligger i
samme plugin. Skillsene finnes også via `npx skills add https://github.com/Leonxlnx/taste-skill`
hvis du heller vil ha dem uten plugin-mekanikken.

## Skills sjekket inn direkte (`skills/`)

Disse to distribueres ikke som Claude Code-plugins, så de ligger som filer i
repoet. Det er nøyaktig det installasjonsverktøyene deres gjør — de kopierer
`SKILL.md` inn i `.claude/skills/` — bare versjonskontrollert.

| Skill | Kilde | Gjør |
|---|---|---|
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Reviewer UI-kode mot 100+ regler for uu, ytelse og UX |
| `playwright-cli` | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) | Browserautomatisering og testing via `playwright-cli` |

`playwright-cli`-skillen kaller CLI-et, som må installeres separat:

```bash
npm install -g @playwright/cli@latest
```

Oppdater en av dem ved å hente inn nyeste `SKILL.md` på nytt
(`npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines`,
eller `playwright-cli install --skills`) og committe diffen.

## Designreferanser (`design-md/`)

74 ferdiganalyserte `DESIGN.md`-profiler fra [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
— designspråket til kjente nettsteder (Apple, Linear, Notion, Stripe, Vercel,
Figma, Spotify, Nike, Wise m.fl.) skrevet som tokens og regler en AI-agent kan
lese direkte.

Dette er et referansebibliotek, ikke en skill. Slik brukes det:

```bash
cp .claude/design-md/linear.app/DESIGN.md DESIGN.md
```

Legg profilen du vil låne fra i prosjektrota som `DESIGN.md`, så plukker
kodeagenter den opp av seg selv. Hver mappe har også en `README.md` som
oppsummerer profilen, så du kan bla før du velger.

Filene er hentet uendret fra kildeprosjektet; `design-md/LICENSE` følger med.

## MCP-servere

`.mcp.json` i prosjektrota registrerer **21st MCP** (tidligere Magic MCP) —
komponentsøk og UI-generering fra [21st.dev](https://21st.dev).

Den krever en API-nøkkel, som *ikke* ligger i repoet. Hent en på
[21st.dev/mcp](https://21st.dev/mcp) og eksporter den før du starter Claude Code:

```bash
export TWENTY_FIRST_API_KEY="..."
```

Uten nøkkelen feiler serveren ved oppstart; resten av oppsettet virker som normalt.

`oberskills` har i tillegg to egne MCP-servere (`skill-eval`, `mcp-browser`) som
krever [`bun`](https://bun.sh) på PATH; `mcp-browser` krever også Chrome/Chromium.
Uten `bun` avslutter SessionStart-hooken stille, og skillsene virker fortsatt —
kun MCP-verktøyene mangler.

## Etter første oppstart

- `/plugin` viser om alle fire pluginene er installert; `/reload-plugins` hvis
  de ikke dukker opp med en gang.
- `/mcp` viser om 21st-serveren fikk koblet seg opp.

Personlige overstyringer hører hjemme i `.claude/settings.local.json`
(ikke sjekket inn).
