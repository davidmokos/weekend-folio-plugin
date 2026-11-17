# Instructions for coding agents

This repository is the Weekend Folio plugin for AI assistants: one remote MCP connector (`https://weekendfolio.com/mcp`) and three skills, with a manifest for each assistant. There is no build and there are no packages. The Weekend Folio service is not here.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the table of which assistant reads which file.

## After each change

```text
node scripts/check.mjs
```

It must pass. If Claude Code is installed, also run `claude plugin validate --strict --profile directory plugins/weekend-folio`.

## Rules

- **Keep the copies the same.** The plugin name, the version, the description and the connector address are in more than one manifest. Change all of them together. The check script names the files that do not agree.
- **`plugin.json` is a closed format.** Agent Plugins 1.0.0 permits these fields only: `$schema`, `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, `extensions`. Settings for one assistant go in `extensions`, below a reverse-domain name such as `com.openai`.
- **Two connector files, two type names.** `mcp.json` uses `"type": "streamable-http"` (Agent Plugins). `.mcp.json` uses `"type": "http"` (Claude Code). Do not make them the same.
- **No secrets and no headers.** The sign-in is OAuth. A manifest must not hold a token.
- **No hooks, no scripts and no programs in `plugins/weekend-folio/`.** The public directories refuse them, and the README tells readers that the plugin runs nothing.
- **Skills do not name an assistant.** Each assistant reads the same `SKILL.md`. The header has `name`, `description` and `license` only.
- **Do not weaken a confirmation.** The skills ask before a payment and before a deletion.
- **Do not invent tool names or fields.** The 13 tools are in the README. Their inputs and results come from the connector.
- **Limits of the listing** (`extensions["com.openai"].interface`): `displayName` and `shortDescription` have 30 characters or fewer, and there are three default prompts or fewer, each of 128 characters or fewer.
- **A directory is in the README only after the listing is live.** Until then, its steps are in [docs/publishing.md](docs/publishing.md).

## Text style

Short sentences. One idea in each sentence. The same word for the same thing: "article", "issue", "design", "connector", "reader".
