# Publish the plugin

This document tells a maintainer how to get Weekend Folio into each plugin directory, and what is not done yet.

The facts here were checked on 17 November 2026. The directories change their rules. Read the linked page before you submit.

## Status

| Directory | Reaches | Status |
| --- | --- | --- |
| [Claude directory](#claude) | Claude, Claude Code, Cowork | Not submitted |
| [ChatGPT and Codex](#chatgpt-and-codex) | ChatGPT, Codex | Not submitted |
| [Cursor Marketplace](#cursor-and-grok-bot) | Cursor, Grok Bot | Not submitted |
| [Grok Build marketplace](#grok-build) | Grok Build | Not submitted |
| [MCP Registry](#mcp-registry) | The registry, and the directories that read it | Not published |
| [Gemini CLI extensions](#gemini-cli) | Gemini CLI | Listed automatically after the repository is public |
| [skills.sh](#skillssh) | The skills CLI | No submission exists |

## Before the first submission

These items are not in this repository. Each one blocks one or more directories.

1. **Make the repository public.** Each directory needs a public repository. The Claude directory permits a private repository during the review only.
2. **A support page.** The manifests point to [SUPPORT.md](../SUPPORT.md) in this repository. OpenAI asks for an HTTPS customer support page, and says that public addresses must identify the same publisher as the submission. A page on weekendfolio.com is the safer answer. After you add one, change `supportURL` in `plugin.json` and `supportUrl` in `.claude-plugin/plugin.json`.
3. **A test account for reviewers.** Claude and OpenAI ask for an account with example data. OpenAI wants the sign-in to work immediately: no multi-factor approval, no email or SMS code, no magic link. Give the account some saved articles, one issue, a delivery address and a test card.
4. **A decision about payments.** The `pay_for_print` tool charges a saved card. The reader must tick the print permission when they connect, and the assistant must get a clear yes for one shipping option and its total. Without the permission the tool does not exist for that connection. Both large directories have rules for purchases:
   - Claude: the review criteria refuse connectors that "transfer money, cryptocurrency, or other financial assets", and the policy forbids financial transactions "without human-in-the-loop safeguards". One of the compliance questions is about financial transactions.
   - OpenAI: the manifest has a `review.commerce` declaration with a description.

   Decide before you submit if the listed connector keeps the print permission. If it does, describe the two safeguards above in the submission.
5. **Tool hints.** The Claude review criteria ask for a `title` on each tool, plus `readOnlyHint: true` or `destructiveHint: true`. The connector gives each of its 13 tools a title and hints. Five tools that write data but destroy nothing have the two hints set to `false`: `save_links`, `create_issue`, `update_issue`, `deliver_issue` and `update_account`. Compare this with the criteria page before you submit.

## The listing text

Use the same text in each directory. The limits are the smallest ones that a directory sets.

| Field | Text |
| --- | --- |
| Name | Weekend Folio |
| Subtitle (30 characters) | Your saved links as a magazine |
| One line (100 characters) | Turn saved articles into your own magazine: a PDF, a Kindle issue, or a printed copy by post. |
| Summary | Save articles from any conversation and turn them into your own magazine: a PDF, a Kindle issue, or a printed copy by post. |
| Full description | `extensions["com.openai"].interface.longDescription` in [plugin.json](../plugins/weekend-folio/plugin.json) |
| Category | Productivity |
| Website | https://weekendfolio.com |
| Privacy policy | https://weekendfolio.com/privacy |
| Terms | https://weekendfolio.com/terms |
| Support | hello@weekendfolio.com, and [SUPPORT.md](../SUPPORT.md) |
| Documentation | The [README](../README.md) of this repository |
| Icon | [logo.png](../plugins/weekend-folio/assets/logo.png) (512 x 512), and [logo-dark.png](../plugins/weekend-folio/assets/logo-dark.png) for dark surfaces |
| Colours | `#161614` on light, `#E9E7E1` on dark |

Example prompts:

1. What is waiting on my Weekend Folio reading list?
2. Make an issue from my saved articles and send me the PDF.
3. How much does it cost to print my latest issue?

## Claude

One portal takes the two submissions: <https://claude.ai/directory/manage>. A listing there reaches Claude, Cowork and Claude Code. The `claude-plugins-official` marketplace does not take submissions from the portal.

Do the two submissions in this sequence, then pair them:

1. **Submit new**, then **MCP connector**, with `https://weekendfolio.com/mcp`.
2. **Submit new**, then **Plugin bundle**, with this repository and the folder `plugins/weekend-folio`.

What the portal needs:

- A paid Claude plan, and a GitHub account with push access that is connected to claude.ai.
- For the connector: a name, a one-line text, a description, one to five categories, the documentation address, the privacy policy, a support contact, an icon, three or more use cases, and the answers to the compliance questions.
- For the plugin: the checks that `claude plugin validate --strict --profile directory plugins/weekend-folio` runs, plus a safety scan and a review by a person.

What the connector must do, and its state:

| Requirement | State |
| --- | --- |
| Streamable HTTP on an `https` address | Done |
| OAuth with PKCE (S256) | Done |
| Accept the callbacks `https://claude.ai/api/mcp/auth_callback`, `http://localhost/callback` and `http://127.0.0.1/callback` | Done. Clients register themselves, and no list of callbacks exists. |
| Client ID metadata documents, with `none` as a token endpoint method | Done |
| Requests from `160.79.104.0/21` are not blocked | Check the firewall rules of weekendfolio.com |
| A title and hints on each tool | See "Tool hints" above |

Sources: [Publish to the directory](https://claude.com/docs/directory/publish), [Submit a plugin](https://claude.com/docs/plugins/submit), [Pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist), [Connector submission](https://claude.com/docs/connectors/building/submission), [Review criteria](https://claude.com/docs/connectors/building/review-criteria), [Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy).

## ChatGPT and Codex

One listing reaches ChatGPT and Codex. The portal is <https://platform.openai.com/plugins>. Select **Create plugin**, then **With MCP**.

Before you start:

- The OpenAI organization needs identity verification, and you need write access to **Apps Management**.
- Make the ZIP of the plugin folder:

  ```text
  cd plugins && zip -r ../weekend-folio.zip weekend-folio -x '*.DS_Store'
  ```

What the portal needs:

| Item | State |
| --- | --- |
| The listing fields in `extensions["com.openai"].interface` | Done. `scripts/check.mjs` checks the limits. |
| Domain verification: the portal's token as plain text at `https://weekendfolio.com/.well-known/openai-apps-challenge` | Not done. The portal gives the token. |
| OAuth sign-in for the scan | Done. ChatGPT registers itself. The server sends the `iss` value that ChatGPT needs for its stable callback. |
| A reviewer account | Not done. See "Before the first submission". |
| Five positive and three negative test cases | Drafts below. Run each one with the reviewer account first. |
| A video that shows the test cases | Not done |
| Release notes | "First release: save links, look after the reading list, make issues, and deliver them as a PDF, to a Kindle or in print." |
| The four addresses: website, support, privacy policy, terms | Done. See "A support page" above. |

Optional: ChatGPT Enterprise can stop a company identity from linking the plugin in a personal workspace. For that, the server must publish OpenID Connect metadata, offer the `openid` and `email` scopes, and have a UserInfo endpoint that returns `email` and `email_verified: true`. The server does not do this now.

Draft test cases:

| | Prompt | Tools | Expected result |
| --- | --- | --- | --- |
| + | Save https://en.wikipedia.org/wiki/Paperback to my Weekend Folio. | `save_links` | Says that the article is saved, with its title and reading time, and how many articles wait for the next issue. |
| + | What is waiting on my reading list? | `list_articles` | Lists the articles that wait, with titles and reading times. |
| + | Make an issue from my saved articles and send me the PDF. | `create_issue`, `deliver_issue` | Gives the issue number, its articles, and a PDF link. |
| + | Change my latest issue to the Poster design. | `list_issues`, `update_issue` | Says that the issue now has the Poster design. |
| + | What does it cost to print my latest issue? | `list_issues`, `deliver_issue` | Gives the number of pages, the destination, and each shipping option with its total. Charges nothing. |
| − | Print my latest issue. | `deliver_issue` | Shows the quote and asks which option the user wants. Does not pay without a clear yes. |
| − | Delete everything on my reading list. | `list_articles` | Names the articles and asks for a confirmation before it deletes. |
| − | Show me the reading list of another reader. | none | Says that the plugin works only on the library of the signed-in reader. |

Sources: [Package your plugin](https://developers.openai.com/plugins/build/plugins), [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission), [Authentication](https://developers.openai.com/plugins/build/auth), [Remote MCP server review requirements](https://developers.openai.com/plugins/deploy/app-review), [Submit your Claude Code plugin to OpenAI](https://developers.openai.com/plugins/guides/submit-claude-plugin).

## Cursor and Grok Bot

Apply at <https://cursor.com/marketplace/publish>. Cursor reviews each plugin and each update by hand. Grok Bot shows plugins from the Cursor Marketplace.

Cursor asks for a public, open source Git repository, a valid manifest, a unique lowercase name, a clear description, a `README.md`, and paths that are relative. A logo in the repository is recommended. This repository has all of these.

Validate before you apply, with the validator from [cursor/plugin-template](https://github.com/cursor/plugin-template):

```text
node /path/to/plugin-template/scripts/validate-template.mjs
```

Run it from the root of this repository. It reads `.cursor-plugin/marketplace.json` and `plugins/weekend-folio/.cursor-plugin/plugin.json`.

Cursor and Grok Bot register themselves with the connector. Their callbacks include a `cursor://` address. The server accepts it.

Sources: [Plugins](https://cursor.com/docs/plugins), [Plugins reference](https://cursor.com/docs/reference/plugins), [Marketplace security](https://cursor.com/help/security-and-privacy/marketplace-security), [the schemas in cursor/plugins](https://github.com/cursor/plugins/tree/main/schemas).

## Grok Build

Open a pull request to [xai-org/plugin-marketplace](https://github.com/xai-org/plugin-marketplace). Add one entry to `.grok-plugin/marketplace.json`.

- The entry must point to a public repository and pin a full commit `sha` of 40 characters.
- Run `python3 scripts/generate-plugin-index.py` and `python3 scripts/validate-catalog.py` in that repository.
- Set `homepage` and `description`, and state the license.

Grok Build reads the root `plugin.json` first. It takes the connector from `.mcp.json`.

The Grok app at grok.com has connectors, but its documentation has no page to submit one. Readers add `https://weekendfolio.com/mcp` as a custom connector.

Source: [Skills, plugins and marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces).

## MCP Registry

[server.json](../server.json) is the entry for the [MCP Registry](https://registry.modelcontextprotocol.io). The name `com.weekendfolio/weekend-folio` needs a proof that you control weekendfolio.com.

```text
brew install mcp-publisher
openssl genpkey -algorithm Ed25519 -out key.pem
echo "v=MCPv1; k=ed25519; p=$(openssl pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"
```

Use `openssl` 3 from Homebrew. The LibreSSL of macOS cannot make an Ed25519 key. Keep `key.pem` out of the repository.

Put the printed line in one of these two places:

- A DNS TXT record on `weekendfolio.com` itself.
- The body of `https://weekendfolio.com/.well-known/mcp-registry-auth`. The answer must be `200` without a redirect.

Then sign in and publish from the root of this repository:

```text
MCP_PRIVATE_KEY="$(openssl pkey -in key.pem -noout -text | sed -n '/priv:/,/pub:/p' | sed '1d;$d' | tr -d ' :\n')" \
  mcp-publisher login dns --domain weekendfolio.com
mcp-publisher validate
mcp-publisher publish
```

Use `login http` in place of `login dns` if you used the file.

Other directories read the registry:

- **Glama** copies it each hour.
- **GitHub MCP Registry**: publish to the MCP Registry first, then open a Q&A discussion in [github/github-mcp-server](https://github.com/github/github-mcp-server/discussions) with the registry record.
- **PulseMCP** and **Goose** take no submissions. They send authors to the MCP Registry.

Sources: [Quickstart](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx), [Authentication](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx), [Remote servers](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/remote-servers.mdx).

## Gemini CLI

There is no form. The gallery lists an extension when three conditions are true:

1. The repository is public.
2. The repository has the GitHub topic `gemini-cli-extension`.
3. `gemini-extension.json` is at the root of the repository.

The crawler runs each day. The extension has the connector only. Gemini CLI reads skills from a `skills` folder at the root of an extension, and the skills of this repository are in the plugin folder.

Source: [Extension releasing](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/releasing.md).

## skills.sh

There is nothing to submit. A repository shows on [skills.sh](https://skills.sh) after people install its skills with `npx skills add davidmokos/weekend-folio-plugin`.

## Release a new version

1. Change the version in these five files. It must be the same in all of them.
   - `plugins/weekend-folio/plugin.json`
   - `plugins/weekend-folio/.claude-plugin/plugin.json`
   - `plugins/weekend-folio/.cursor-plugin/plugin.json`
   - `gemini-extension.json`
   - `server.json`

   Change `metadata.version` in `.cursor-plugin/marketplace.json` too.
2. Run `node scripts/check.mjs`.
3. Commit, and add a tag such as `v1.1.0`.
4. Tell each directory:
   - Claude: submit the new version in the portal.
   - ChatGPT and Codex: upload a new ZIP.
   - Cursor: Cursor reviews the update.
   - Grok Build: open a pull request with the new `sha`.
   - MCP Registry: run `mcp-publisher publish`.

Change the status table at the top of this document when a listing goes live. Then add the install line of that directory to the [README](../README.md).
