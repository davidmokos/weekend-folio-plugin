# Contribute

Thank you for your help. This repository is small: manifests, three skills and documents. Most changes are one file.

## What belongs here

- A correction or an improvement to a skill.
- A manifest or a catalog for one more assistant.
- A correction to the README or to [docs/publishing.md](docs/publishing.md).

The Weekend Folio service is not in this repository. For a problem with the tools, with your library or with an order, write to hello@weekendfolio.com.

## Which file is for which assistant

One plugin folder serves all assistants. Each assistant reads its own manifest and ignores the others.

| File | Read by |
| --- | --- |
| `plugins/weekend-folio/plugin.json` | Agent Plugins clients: ChatGPT and Codex (with `extensions["com.openai"]`), Cursor, Grok Build, GitHub Copilot, VS Code |
| `plugins/weekend-folio/mcp.json` | The same clients. The connector, with the type `streamable-http`. |
| `plugins/weekend-folio/.claude-plugin/plugin.json` | Claude Code and the Claude directory |
| `plugins/weekend-folio/.mcp.json` | Claude Code and Grok Build. The connector, with the type `http`. |
| `plugins/weekend-folio/.cursor-plugin/plugin.json` | The Cursor Marketplace and Grok Bot |
| `plugins/weekend-folio/skills/*/SKILL.md` | All assistants |
| `plugins/weekend-folio/skills/*/agents/openai.yaml` | Codex: the name of the skill in its interface, and the connector that the skill needs |
| `.claude-plugin/marketplace.json` | Claude Code, Grok Build, Copilot CLI |
| `.agents/plugins/marketplace.json` | Codex |
| `.cursor-plugin/marketplace.json` | Cursor |
| `gemini-extension.json` | Gemini CLI |
| `server.json` | The MCP Registry |

The connector address, the version and the description are each in more than one file. `scripts/check.mjs` fails when the copies do not agree.

## Rules for skills

- Write for all assistants. Do not name an assistant in a skill.
- Use the tool names and the field names exactly as the connector returns them. To see them, connect `https://weekendfolio.com/mcp` and list the tools.
- State what the assistant must not invent, and when it must ask.
- Keep the confirmation before a payment and before a deletion. A change must not make it weaker.
- The header has `name`, `description` and `license` only. The name is the name of the folder. Do not add a `version`.
- The description says what the skill does and when to use it, in 1024 characters or fewer. The body has 500 lines or fewer.
- A new skill needs a row in the two README files and an `agents/openai.yaml`.

## Check your change

```text
node scripts/check.mjs
```

The script needs Node.js 20 or later and no packages. The same script runs on each pull request.

If you have Claude Code, these two commands run the checks of the Claude directory:

```text
claude plugin validate --strict .
claude plugin validate --strict --profile directory plugins/weekend-folio
```

## Try the plugin from your copy

**Claude Code**

```text
claude --plugin-dir plugins/weekend-folio
```

**Codex**, with a home folder that does not touch your own configuration:

```text
mkdir -p .context/codex-home
CODEX_HOME="$PWD/.context/codex-home" codex plugin marketplace add "$PWD"
CODEX_HOME="$PWD/.context/codex-home" codex plugin add weekend-folio@weekend-folio
```

**Cursor**: copy `plugins/weekend-folio` to `~/.cursor/plugins/local/weekend-folio`, then restart Cursor.

`.context/` is in `.gitignore`.

## The pictures

`assets/brand.html` is the source of the banner and of the two logo files. To draw them again:

```text
scripts/render-assets.sh
```

## Pull requests

- One subject for each pull request.
- Say which assistant you tested with.
- If you change what the plugin does, change the version. [docs/publishing.md](docs/publishing.md#release-a-new-version) lists the files.

By contributing, you agree that your contribution has the [MIT license](LICENSE).
