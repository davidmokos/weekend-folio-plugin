---
name: weekend-folio-issue
description: Make an issue of the user's Weekend Folio magazine from saved articles and deliver it as a PDF link or to a Kindle. Use when the user asks to make, build or curate an issue, asks for their magazine or for something to read this weekend, wants to change the title, the design or the articles of an issue, asks for the PDF of an issue, or wants an issue on their Kindle. Needs the Weekend Folio connector.
license: MIT
---

# Weekend Folio: make and deliver an issue

An issue is one number of the reader's magazine. It contains saved articles in reading order, in one of six designs. This skill makes an issue, changes it, and delivers it as a PDF or to a Kindle.

For a printed copy, use the `weekend-folio-print` skill. To save links, use the `weekend-folio` skill.

## Rules

- The tools come from the Weekend Folio connector at `https://weekendfolio.com/mcp`. If the tools are not available, tell the user to connect it and to sign in.
- Take each article, issue, link and number from a tool result. Do not invent one.
- No confirmation is necessary to make an issue or to send a PDF link.
- An explicit instruction from the user has priority over this skill.

## Make an issue

1. Call `list_articles` with `filter: "up_next"` to see what waits. If nothing waits, tell the user and offer to save links. Stop there.
2. Select the articles:
   - **The usual issue.** Call `create_issue` without `article_ids`. Weekend Folio takes the articles that wait, oldest first, up to approximately 50 pages.
   - **A selected issue.** When the user asks for specific articles, a subject or an order, give `article_ids` in reading order. Use only articles with `readable: true`.
3. Give a `title` only when the user asks for one. Without a title, the issue has the name of the magazine.
4. Give a `design` only when the user asks for one. Without a design, the issue has the reader's default design.
5. Tell the user the result: the issue number, the articles, the reading time (`minutes`) and the link in `view_on_website`. If the result has `cover`, say that the cover art comes in approximately one minute.

## The designs

| Design | Look |
| --- | --- |
| `folio` | Warm grey paper, the reader's name in a lowercase serif, black-and-white pictures. |
| `feature` | A tall Didone masthead, the cover story on its picture, column rules, one red. |
| `poster` | Very heavy sans headlines, big page numbers in the contents, bold quotes. |
| `margin` | A very large light serif in lowercase, small text, a wide empty margin. |
| `still` | Serif capitals in soft grey, small grey text, pale pictures, a lot of air. |
| `grid` | Ruled boxes and number blocks, sans capitals, a bold italic deck, column rules. |

When the user asks which designs there are, give this list. When the user describes a look, propose the nearest design and ask before you change it.

## Change an issue

- `list_issues` gives the reader's issues, newest first, with the number of articles, the design and the print status.
- `get_issue` gives the articles of one issue, in order.
- `update_issue` changes the `title` or the `design`, adds articles at the end (`add_article_ids`) and removes articles (`remove_article_ids`). Leave out a field to keep its value.
- A new design keeps the cover art.
- `update_issue` adds articles only at the end. For a different order, make a new issue with `article_ids` in that order.

## Deliver as a PDF

Call `deliver_issue` with `destination: "pdf"`. Give the user the link in `pdf_link`. The link works for 7 days, and the PDF can take some seconds to open.

## Deliver to a Kindle

Call `deliver_issue` with `destination: "kindle"`.

| Result | What you do |
| --- | --- |
| `sent: true` | Say that the issue is on its way to the address in `to`. It arrives in minutes if the sender in `approve_sender` is approved at Amazon. |
| `sent: false` | Give the reason in `reason`. Offer the EPUB link in `epub_link`, which the user can open or send to the Kindle themselves. |

When no Kindle address is set:

1. Call `kindle_setup`. It gives the Amazon links, the steps to do there, and the sender address that the reader must approve.
2. Show the user the steps as the tool gives them.
3. Ask for their Send to Kindle address. It ends in `@kindle.com`.
4. Save it with `update_account` and `kindle_email`.
5. Deliver the issue again.

If `kindle_setup` returns `available: false`, Kindle delivery is not possible now. Offer the EPUB link.

## Do not

- Do not say that an issue is on the Kindle unless the result has `sent: true`.
- Do not call `deliver_issue` with `destination: "print"` in this skill. The `weekend-folio-print` skill has the rules for printed copies.
