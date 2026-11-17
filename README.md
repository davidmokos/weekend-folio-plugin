<p align="center">
  <a href="https://weekendfolio.com">
    <img src="assets/banner.png" alt="Weekend Folio. Tell your assistant what you meant to read." width="100%" />
  </a>
</p>

<h3 align="center">Weekend Folio for AI assistants</h3>

<p align="center">
  Save links from any conversation. Get them back as your own magazine:<br />
  a PDF, a Kindle issue, or a printed copy in the post.
</p>

<p align="center">
  <a href="https://weekendfolio.com"><img src="https://img.shields.io/badge/site-weekendfolio.com-161614?style=flat-square&labelColor=d9d6ce" alt="weekendfolio.com" /></a>
  <img src="https://img.shields.io/badge/connector-MCP_with_OAuth-161614?style=flat-square&labelColor=d9d6ce" alt="An MCP connector with OAuth" />
  <img src="https://img.shields.io/badge/skills-3-161614?style=flat-square&labelColor=d9d6ce" alt="Three skills" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-161614?style=flat-square&labelColor=d9d6ce" alt="MIT license" /></a>
</p>

## What it is

[Weekend Folio](https://weekendfolio.com) turns the articles you save into a magazine with your name on it. This repository is the plugin that connects it to an AI assistant. The plugin has two parts:

- **A connector.** One MCP server at `https://weekendfolio.com/mcp`. It gives the assistant 13 tools for your reading list, your issues and your settings. You sign in with your Weekend Folio account. There is no API key.
- **Three skills.** Short instructions that teach the assistant the work: how to save links, how to make an issue, and how to order a printed copy without a mistake.

A conversation can go like this:

> **You:** Save these three for the weekend. *(three links)*
>
> **Assistant:** Saved. 3 articles, 41 minutes of reading. 9 articles wait for your next issue.
>
> **You:** Make the issue in the Poster design and send it to my Kindle.
>
> **Assistant:** Issue No. 13 is ready: 9 articles, about 2 hours of reading. It is on its way to your Kindle.
>
> **You:** What does a printed copy cost?
>
> **Assistant:** 52 pages, sent to Prague. There are two shipping options, each with its total. Which one do you want?

The numbers above are an example. The assistant takes the real ones from your library.

## Install

Each assistant gets the connector. Some also load the skills.

| Assistant | You get | How |
| --- | --- | --- |
| [Claude Code](#claude-code) | Connector and skills | Plugin |
| [Claude](#claude) (web, desktop, mobile) | Connector | Custom connector |
| [ChatGPT](#chatgpt) | Connector | Custom MCP server |
| [Codex](#codex) | Connector and skills | Plugin |
| [Cursor](#cursor) | Connector | Install link |
| [Grok](#grok) | Connector, and skills in Grok Build | Custom connector or plugin |
| [Gemini CLI](#gemini-cli) | Connector | Extension |
| [VS Code and GitHub Copilot](#vs-code-and-github-copilot) | Connector, and skills in Copilot CLI | Install link or plugin |
| [Other assistants](#other-assistants) | Connector | The address |

The first time the assistant uses a tool, it sends you to weekendfolio.com to sign in and to allow the connection.

### Claude Code

```text
/plugin install weekend-folio --marketplace davidmokos/weekend-folio-plugin
```

Then run `/mcp`, select `weekend-folio`, and sign in.

Before Claude Code 2.1.275, use two steps: `/plugin marketplace add davidmokos/weekend-folio-plugin`, then `/plugin install weekend-folio@weekend-folio`.

### Claude

Open **Customize**, then **Connectors**. Select **Add**, then **Add custom connector**. Paste `https://weekendfolio.com/mcp`.

On a Team or Enterprise plan, an owner adds the connector first, in the organization settings. Claude has [the steps](https://claude.com/docs/connectors/custom/remote-mcp).

### ChatGPT

Open [chatgpt.com/plugins](https://chatgpt.com/plugins), select the plus button, then **Add custom MCP server**. Paste `https://weekendfolio.com/mcp`.

### Codex

```text
codex plugin marketplace add davidmokos/weekend-folio-plugin
codex plugin add weekend-folio@weekend-folio
```

### Cursor

**[Add Weekend Folio to Cursor](https://cursor.com/link/mcp/install?name=weekend-folio&config=eyJ1cmwiOiJodHRwczovL3dlZWtlbmRmb2xpby5jb20vbWNwIn0%3D)**

To add the skills too, see [Skills only](#skills-only).

### Grok

- **Grok** (grok.com): open **Connectors**, select **New Connector**, then **Custom**. Paste `https://weekendfolio.com/mcp`.
- **Grok Bot**: select **Add a custom connector**, type **Remote HTTPS**. Paste `https://weekendfolio.com/mcp` as the server URL.
- **Grok Build**:

  ```text
  grok plugin marketplace add davidmokos/weekend-folio-plugin
  grok plugin install weekend-folio --trust
  ```

### Gemini CLI

```text
gemini extensions install https://github.com/davidmokos/weekend-folio-plugin
```

Then run `/mcp auth weekend-folio` in Gemini CLI to sign in.

### VS Code and GitHub Copilot

- **VS Code**: [install the connector](https://vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522weekend-folio%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fweekendfolio.com%252Fmcp%2522%257D).
- **Copilot CLI**:

  ```text
  copilot plugin install davidmokos/weekend-folio-plugin:plugins/weekend-folio
  ```

### Other assistants

Add a remote MCP server with this address. The assistant finds the sign-in from there.

```json
{
  "mcpServers": {
    "weekend-folio": {
      "type": "http",
      "url": "https://weekendfolio.com/mcp"
    }
  }
}
```

| | |
| --- | --- |
| Transport | Streamable HTTP |
| Sign-in | OAuth 2.1 with PKCE. The server answers `401` and points to its OAuth metadata. |
| Client registration | Dynamic client registration, or a client ID metadata document |
| Scopes | `library`, and `print` if the reader allows it |

### Skills only

The [skills CLI](https://skills.sh/docs/cli) copies the three skills into the assistant that you select. The skills need the connector.

```text
npx skills@latest add davidmokos/weekend-folio-plugin
```

## Try it

- "Save this for the weekend: *(a link)*"
- "What is waiting on my reading list?"
- "Make an issue from the five longest articles and call it The Long Ones."
- "Send my latest issue to my Kindle."
- "What does it cost to print issue 12?"

## Sign-in and permissions

You sign in on weekendfolio.com. The assistant does not see your password. On the same page you decide what the assistant can do:

| Permission | What it lets the assistant do | Default |
| --- | --- | --- |
| Library | Read and change your reading list, your issues and your settings | Always on |
| Print | Order printed copies, paid with your saved card | Off until you tick it |

Without the print permission, the assistant can still get a quote. It then sends you a link, and you pay on the website.

With the print permission, the assistant pays only after you say yes to one shipping option and its total.

You can disconnect an assistant at any time in **Settings** on weekendfolio.com. A connection also ends by itself after 90 days without use.

## The tools

| Tool | What it does | Changes data |
| --- | --- | --- |
| `save_links` | Saves links to your library | Yes |
| `list_articles` | Lists your articles: up next, all, printed, failed or archived | No |
| `get_article` | Gives the details of one article and the start of its text | No |
| `update_articles` | Archives, restores or deletes articles | Yes |
| `create_issue` | Makes a new issue from the articles that wait, or from the ones you name | Yes |
| `list_issues` | Lists your issues | No |
| `get_issue` | Gives the articles of one issue, in order | No |
| `update_issue` | Changes the title, the design or the articles of an issue | Yes |
| `deliver_issue` | Gives a PDF link, sends the issue to your Kindle, or gets a print quote | Yes |
| `pay_for_print` | Pays for a printed copy with your saved card. Only with the print permission. | Yes |
| `get_account` | Gives your settings | No |
| `kindle_setup` | Gives the steps to connect a Kindle | No |
| `update_account` | Changes your name, your default design or your Kindle address | Yes |

## The skills

| Skill | Use |
| --- | --- |
| [`weekend-folio`](plugins/weekend-folio/skills/weekend-folio/SKILL.md) | Save links and look after the reading list |
| [`weekend-folio-issue`](plugins/weekend-folio/skills/weekend-folio-issue/SKILL.md) | Make an issue, change it, and get it as a PDF or on a Kindle |
| [`weekend-folio-print`](plugins/weekend-folio/skills/weekend-folio-print/SKILL.md) | Get a print quote and order a printed copy, with a confirmation before each payment |

An issue comes in one of six designs: Folio, Feature, Poster, Margin, Still and Grid. The banner above shows the covers of three of them.

## What the plugin runs, sends and gets

- **It runs nothing on your computer.** The plugin has no scripts, no hooks and no programs. It is a set of manifests and three text files.
- **It talks to one address:** `https://weekendfolio.com`, for the tools and for the sign-in.
- **It sends** what the assistant puts in a tool call: the links that you ask it to save, the articles and issues that you name, and the settings that you change.
- **It gets** data from your own library: titles, sites, reading times, the start of an article's text, your issues, print quotes, and links to your PDF and EPUB files.

Weekend Folio has a [privacy policy](https://weekendfolio.com/privacy) and [terms](https://weekendfolio.com/terms). Your assistant has its own.

This repository is the plugin: the manifests, the skills and the documents. The Weekend Folio service is not in this repository.

## What is in the repository

```text
plugins/weekend-folio/        The plugin that assistants install
  plugin.json                 Manifest: Agent Plugins format (ChatGPT, Codex, Cursor, Grok Build, Copilot)
  mcp.json                    The connector, in the Agent Plugins format
  .claude-plugin/plugin.json  Manifest for Claude Code
  .mcp.json                   The connector, for Claude Code
  .cursor-plugin/plugin.json  Manifest for the Cursor Marketplace
  skills/                     The three skills
  assets/                     The logo
.claude-plugin/               Catalog for Claude Code, Grok Build and Copilot CLI
.agents/plugins/              Catalog for Codex
.cursor-plugin/               Catalog for Cursor
gemini-extension.json         Extension manifest for Gemini CLI
server.json                   Entry for the MCP Registry
docs/publishing.md            How to submit the plugin to each directory
scripts/check.mjs             Checks that all of the above agree
```

## Directories

Weekend Folio is not in a public plugin directory yet. [docs/publishing.md](docs/publishing.md) has the steps and the status for each directory.

## Contribute

A better skill, a manifest for one more assistant, a correction: all are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Before you open a pull request, run:

```text
node scripts/check.mjs
```

## Support

For your account, your issues or an order, write to [hello@weekendfolio.com](mailto:hello@weekendfolio.com). For a problem with the plugin, [open an issue](https://github.com/davidmokos/weekend-folio-plugin/issues). [SUPPORT.md](SUPPORT.md) has the details. To report a security problem, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
