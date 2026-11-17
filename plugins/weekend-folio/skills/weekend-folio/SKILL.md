---
name: weekend-folio
description: Save links to Weekend Folio and look after the reading list that becomes the user's own magazine. Use when the user asks to save a link or read it later, asks to keep the articles or sources from this conversation, asks what is on their reading list or what waits for the next issue, or wants to find, archive, restore or delete saved articles. Also use for Weekend Folio account settings. Needs the Weekend Folio connector.
license: MIT
---

# Weekend Folio: the reading list

Weekend Folio turns the articles a reader saves into their own magazine. The reader gets each issue as a PDF, on a Kindle, or as a printed copy by post.

This skill covers the library: how to save links and how to look after the reading list. Two more skills cover the rest:

- `weekend-folio-issue`: make an issue and deliver it as a PDF or to a Kindle.
- `weekend-folio-print`: order a printed copy.

## Before you start

- The tools come from the Weekend Folio connector at `https://weekendfolio.com/mcp`. If the tools are not available, tell the user to add that address as a connector (an MCP server) in their assistant and to sign in. Do not do the work in a different way.
- Each tool works on the library of the reader who signed in.
- Take each article, issue, link, count and price from a tool result. Do not invent one.
- An explicit instruction from the user has priority over this skill.

## Words

| Word | Meaning |
| --- | --- |
| Article | A saved link. Weekend Folio reads it and cleans it up for print. |
| Up next | Articles that are saved and not yet in an issue. The next issue contains them. |
| Issue | One number of the reader's magazine. |
| Design | The look of an issue: `folio`, `feature`, `poster`, `margin`, `still` or `grid`. |

## Save links

Save a link when the user asks you to save it, to keep it, or to read it later. A link that the user gives you for a different task is not a request to save it. You can offer one time. Do not save it without a request.

1. Call `save_links` with `urls`. Give each link exactly as the user gave it.
2. Send a maximum of 10 links in one call. For more links, make more calls.
3. Read each entry of `saved` and tell the user the result:
   - `readable: true`: the article is ready. Give the title, the site and the reading time (`minutes`).
   - `status: "processing"`: Weekend Folio is still reading the article. It is not ready and it has not failed. Say that it is saved and still in work.
   - `error`: Weekend Folio could not read the link. Give the reason. Do not say that the article is ready.
4. Tell the user what waits for the next issue: `waiting_for_next_issue` articles and `waiting_minutes` of reading.

A save needs no confirmation.

When the user asks you to save the sources of the conversation, first list the links that you will save. Then save them.

## Look at the reading list

Call `list_articles`.

| Input | Use |
| --- | --- |
| `filter` | `up_next` for what waits for the next issue. Also `all`, `printed`, `needs_attention` (could not be read) and `archived`. |
| `query` | Words to find in titles, sites and links. Leave it out to get all articles. |
| `limit` | 1 to 50, newest first. The default is 20. |

The result has `counts` for the library and a list of `articles`. Each article has an `id`, a `title`, a `site`, a reading time and the flags `printed` and `readable`.

For one article, call `get_article` with its `article_id`. The result gives the link, the author, an excerpt and only the start of the text (`text_start`). Do not show `text_start` as the full article. For the full text, give the user the link.

## Tidy the reading list

Call `update_articles` with `article_ids` and an `action`.

| Action | Result |
| --- | --- |
| `archive` | Puts the articles in the archive. They stay in the library. |
| `restore` | Brings archived articles back. |
| `delete` | Removes the articles permanently. |

Before a `delete`, tell the user the titles and ask. Delete only after the user says yes. `archive` and `restore` need no confirmation.

For articles in `needs_attention`, tell the user which articles they are and why they failed (`error`).

## Account settings

- `get_account` gives the reader's name, the name of the magazine, the default design, the Kindle address, the saved card, and if a delivery address is set.
- `update_account` changes the name, the default design or the Kindle address. The magazine gets its name from the reader's name. Leave out a field to keep its value.
- The delivery address and the card are not in the tools. The reader changes them on the website, in Settings. `get_account` gives the link in `website`.

## What you tell the user

- Use titles, not ids. Ids are for tool calls.
- Give times as reading minutes, as the tools return them.
- Be brief: what you saved or found, then what waits for the next issue.
