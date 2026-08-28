# Claude Code-oppsett

`settings.json` registrerer marketplace-et `rtd`
([ryanthedev/rtd-claude-inn](https://github.com/ryanthedev/rtd-claude-inn)) og
slår på tre plugins for dette prosjektet. Claude Code installerer dem
automatisk når du stoler på (trust) mappa — ingen manuelle `/plugin`-kommandoer.

| Plugin | Kommandoer | Innhold |
|---|---|---|
| [`code-foundations`](https://github.com/ryanthedev/code-foundations) | `/code-foundations:research`, `:plan`, `:build`, `:debug` | 19 skills fra Code Complete, APOSD, GoF og Clean Architecture |
| [`design-for-ai`](https://github.com/ryanthedev/design-for-ai) | `/design-for-ai:research`, `:plan`, `:mock`, `:build` | Designdoktrine + skills: `prototype`, `clarify`, `usability`, `data-viz` |
| [`oberskills`](https://github.com/ryanthedev/oberskills) | `/oberskills:shot` | Skills: `browser`, `web-research`, `prompt`, `agent`, `write`, `skill-craft`, `shot`, `clarify` |

## Etter første oppstart

- Kjør `/plugin` for å bekrefte at alle tre står som installert, eller
  `/reload-plugins` hvis de ikke dukker opp med en gang.
- `oberskills` har to MCP-servere (`skill-eval`, `mcp-browser`) som krever
  [`bun`](https://bun.sh) på PATH. Uten `bun` avslutter SessionStart-hooken
  stille, og skillsene virker fortsatt — kun MCP-verktøyene mangler.
  `mcp-browser` krever i tillegg Chrome/Chromium.

Personlige overstyringer hører hjemme i `.claude/settings.local.json`
(ikke sjekket inn).
