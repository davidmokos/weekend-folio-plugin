# Publish the plugin

This document tells a maintainer how to get Weekend Folio into each plugin directory, and what is not done yet.

The facts here were checked on 17 November 2026. The Claude rules for tool hints were checked again on 19 November 2026. The directories change their rules. Read the linked page before you submit.

## Status

| Directory | Reaches | Status |
| --- | --- | --- |
| [Claude directory](#claude) | Claude, Claude Code, Cowork | Not submitted |
| [ChatGPT and Codex](#chatgpt-and-codex) | ChatGPT, Codex | Not submitted |
| [Cursor Marketplace](#cursor-and-grok-bot) | Cursor, Grok Bot | Not submitted |
| [Grok Build marketplace](#grok-build) | Grok Build | Not submitted |
| [MCP Registry](#mcp-registry) | The registry, and the directories that read it | Not published |
| [Gemini CLI extensions](#gemini-cli) | Gemini CLI | Waits for the daily crawler. The repository is public and has the topic. |
| [skills.sh](#skillssh) | The skills CLI | No submission exists |

## Before the first submission

### Done

These items were done on 19 November 2026.

- **The repository is public.** Each directory needs a public repository.
- **A support page:** <https://weekendfolio.com/support>. It names the publisher, DCTR s.r.o., as the privacy policy and the terms do. `supportURL` in `plugin.json` and `supportUrl` in `.claude-plugin/plugin.json` point to it.
- **The privacy policy and the terms describe connected assistants**, in their sections "Assistants you connect": what the connector sends to an assistant, what it keeps, and the confirmation before a payment.
- **Tool hints.** The Claude directory asks for a `title` on each tool, `readOnlyHint: true` on each tool that only reads, and `destructiveHint: true` on each tool that changes data. The connector does this for its 13 tools. Claude then asks the reader before each call that changes data.
- **Saving links.** The connector tells the assistant to save a link only when the reader asks. The Claude directory refuses instructions that make the assistant call tools that the user did not request.
- **Payments.** The listed connector keeps the print permission. See [Payments](#payments) for the safeguards and the text for the forms.
- **Domain proofs.** weekendfolio.com serves `/.well-known/mcp-registry-auth` now, and serves `/.well-known/openai-apps-challenge` when the token is set. See [ChatGPT and Codex](#chatgpt-and-codex).
- **The firewall.** weekendfolio.com has no IP rules and no custom firewall rules. Bot Fight Mode and the blocking of AI bots are off. The Cloudflare security level is "medium", and Browser Integrity Check is on. No rule refers to `160.79.104.0/21`.

### Left for a person

1. **A test account for reviewers.** Claude and OpenAI ask for an account with example data. OpenAI wants the sign-in to work immediately: no multi-factor approval, no email or SMS code, no magic link. Password sign-in is on in the production Clerk instance. To make the account:
   1. In the Clerk dashboard, production instance, open **Users**, then **Create user**. Use an address on weekendfolio.com, such as `reviewer@weekendfolio.com`, and a long random password. Mail to weekendfolio.com goes to the team inbox.
   2. Sign in with it once in a private browser window. Make sure that Clerk asks for no code.
   3. Save five or six articles, make one issue, and add a delivery address in **Settings**.
   4. Do not save a card. The live Stripe account refuses test cards. A reviewer can get a print quote without a card, and the assistant then sends the link to pay on the website.

   Give the email and the password only in the OpenAI dashboard form, or by email when a Claude reviewer asks. Never put them in this repository.
2. **The OpenAI domain token.** The portal shows a token. In the repository of the service, run `npm run wrangler -- secret put OPENAI_APPS_CHALLENGE` and paste the token. No deploy is necessary.
3. **A video.** OpenAI needs a video of the test cases, made with the reviewer account. Put its address in the dashboard, or in `review.demo_recording_url` in `plugin.json`.

### Payments

`pay_for_print` charges the saved card of the reader for one printed copy of an issue of their own magazine. The price is the printer's quote for printing, shipping and tax, with no markup. Stripe processes the payment. These safeguards keep a person in the loop:

1. The tool exists only on a connection where the reader ticked the print permission on the consent page. That box is never ticked for them.
2. `deliver_issue` with `"print"` gets the quote and charges nothing.
3. `pay_for_print` takes the order and the shipping option from that quote, and the total that the reader confirmed. The server refuses a total that is different from the quote, and a quote that expires in less than 20 minutes.
4. The tool has `destructiveHint: true`. Claude asks the reader before each call.
5. The reader can disconnect the assistant in **Settings**. Its access stops at once.

The directories have these rules:

- **Claude.** The review criteria refuse connectors that "transfer money, cryptocurrency, or other financial assets", and the policy forbids financial transactions "without human-in-the-loop safeguards". The connector sells a product to the reader and transfers no money between people. One of the seven compliance acknowledgments is about financial transactions. Describe the five safeguards in the submission.
- **OpenAI.** `review.commerce` is `true` in `plugin.json`, and `review.commerce_description` describes the same safeguards.

If a reviewer refuses the payment tool, a connection without the print permission is the fallback: the server then does not offer `print` in `scopes_supported`, and readers pay on the website.

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
| Support | https://weekendfolio.com/support, and hello@weekendfolio.com |
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
| Requests from `160.79.104.0/21` are not blocked | Done. No rule refers to these addresses. See "The firewall" above. |
| A title and hints on each tool | Done |
| A test account, when the listing goes to Verified review | Not done. A reviewer asks for it by email. See "Left for a person". |

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
| Domain verification: the portal's token as plain text at `https://weekendfolio.com/.well-known/openai-apps-challenge` | Ready. Put the token in the Worker secret `OPENAI_APPS_CHALLENGE`. Until then, the address answers `404`. |
| OAuth sign-in for the scan | Done. ChatGPT registers itself. The server sends the `iss` value that ChatGPT needs for its stable callback. |
| A reviewer account | Not done. See "Left for a person". |
| Five positive and three negative test cases | Done, in `review.test_cases` in `plugin.json`. Run each one with the reviewer account first. |
| The commerce declaration | Done, in `review.commerce` and `review.commerce_description` |
| A video that shows the test cases | Not done |
| Release notes | Done, in `publication.release_notes` |
| The four addresses: website, support, privacy policy, terms | Done |

Optional: ChatGPT Enterprise can stop a company identity from linking the plugin in a personal workspace. For that, the server must publish OpenID Connect metadata, offer the `openid` and `email` scopes, and have a UserInfo endpoint that returns `email` and `email_verified: true`. The server does not do this now.

The test cases are in `plugin.json`. Each positive case has its expected result there. A negative case has no field for the result, so these are the expected results:

| Negative case | Expected result |
| --- | --- |
| Send 20 euros to my friend. | Calls no tool. Says that Weekend Folio cannot send money. |
| Summarize this article for me: https://en.wikipedia.org/wiki/Paperback | Does not call `save_links`. The link is not saved. |
| Show me the Weekend Folio reading list of another reader. | Calls no tool. Says that the connection works only on the library of the signed-in reader. |

Show two more checks in the video, because they show the safeguards:

| Prompt | Expected result |
| --- | --- |
| Print my latest issue. | Gets the quote with `deliver_issue` and asks which option the reader wants. Does not pay. |
| Delete everything on my reading list. | Names the articles and asks for a confirmation before it deletes. |

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

The proof is ready. <https://weekendfolio.com/.well-known/mcp-registry-auth> answers `200` with the public half of an Ed25519 key, from the Worker secret `MCP_REGISTRY_AUTH`. The maintainer keeps the private half, as 64 hexadecimal characters, with the other secrets of the service. It is never in this repository.

To publish, sign in with the private key, then publish from the root of this repository:

```text
brew install mcp-publisher
MCP_PRIVATE_KEY="<the private key in hexadecimal>" mcp-publisher login http --domain weekendfolio.com
mcp-publisher validate
mcp-publisher publish
```

To replace the key, make a new pair and put the new public line in the Worker secret `MCP_REGISTRY_AUTH`:

```text
openssl genpkey -algorithm Ed25519 -out key.pem
echo "v=MCPv1; k=ed25519; p=$(openssl pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"
openssl pkey -in key.pem -noout -text | sed -n '/priv:/,/pub:/p' | sed '1d;$d' | tr -d ' :\n'
```

Use `openssl` 3 from Homebrew. The LibreSSL of macOS cannot make an Ed25519 key. The last command prints the private key in hexadecimal. Delete `key.pem` when the key is stored.

Other directories read the registry:

- **Glama** copies it each hour.
- **GitHub MCP Registry**: publish to the MCP Registry first, then open a Q&A discussion in [github/github-mcp-server](https://github.com/github/github-mcp-server/discussions) with the registry record.
- **PulseMCP** and **Goose** take no submissions. They send authors to the MCP Registry.

Sources: [Quickstart](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx), [Authentication](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx), [Remote servers](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/remote-servers.mdx).

## Gemini CLI

There is no form. The gallery lists an extension when three conditions are true. All three are true for this repository:

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
