# Weekend Folio

Save articles from any conversation and turn them into your own magazine: a PDF, a Kindle issue, or a printed copy by post.

[Weekend Folio](https://weekendfolio.com) makes a magazine from the articles that you save. This plugin connects it to your AI assistant.

## What is in the plugin

**A connector.** One remote MCP server at `https://weekendfolio.com/mcp`, with 13 tools for your reading list, your issues and your settings. You sign in with your Weekend Folio account through OAuth. There is no API key.

**Three skills.**

| Skill | Use |
| --- | --- |
| `weekend-folio` | Save links and look after the reading list |
| `weekend-folio-issue` | Make an issue, change it, and get it as a PDF or on a Kindle |
| `weekend-folio-print` | Get a print quote and order a printed copy, with a confirmation before each payment |

## Set-up

1. Install the plugin in your assistant. In Claude Code:

   ```text
   /plugin install weekend-folio --marketplace davidmokos/weekend-folio-plugin
   ```

   The [full guide](https://github.com/davidmokos/weekend-folio-plugin#install) has the steps for the other assistants.
2. Ask for something, for example "What is waiting on my reading list?"
3. The assistant sends you to weekendfolio.com. Sign in and allow the connection.

On that page you can also tick the permission to order printed copies with your saved card. It is off by default. Without it, the assistant sends you a link and you pay on the website.

## What the plugin runs, sends and gets

- It runs nothing on your computer. The plugin has no scripts, no hooks and no programs.
- It talks to one address: `https://weekendfolio.com`.
- It sends what the assistant puts in a tool call: the links that you ask it to save, the articles and issues that you name, and the settings that you change.
- It gets data from your own library: titles, sites, reading times, the start of an article's text, your issues, print quotes, and links to your PDF and EPUB files.

## More

- The full guide, with the steps for each assistant: [github.com/davidmokos/weekend-folio-plugin](https://github.com/davidmokos/weekend-folio-plugin#readme)
- [Privacy policy](https://weekendfolio.com/privacy) and [terms](https://weekendfolio.com/terms)
- Help: the [support page](https://weekendfolio.com/support), or [hello@weekendfolio.com](mailto:hello@weekendfolio.com)

## License

MIT
