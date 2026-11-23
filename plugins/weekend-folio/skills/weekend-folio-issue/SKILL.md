---
name: weekend-folio-issue
description: Deliver the next issue of the user's Weekend Folio magazine as a PDF link or to a Kindle, and change an issue. Use when the user asks for their magazine, their next issue or something to read this weekend, asks to make, build or curate an issue, wants to change the title, the design or the articles of an issue, asks for the PDF of an issue, or wants an issue on their Kindle. Needs the Weekend Folio connector.
license: MIT
---

# Weekend Folio: deliver and change an issue

An issue is one number of the reader's magazine. It contains saved articles in reading order, grouped into sections, in one of six designs.

Nobody makes an issue. There is always a next issue. The readable articles that the reader saves go into it, oldest first, up to approximately 50 pages. Weekend Folio prepares its sections, its cover and its pages in the background. A delivery finishes it: it keeps its number, and the articles that the reader saves after that start the next one.

This skill delivers an issue as a PDF or to a Kindle, and changes an issue.

For a printed copy, use the `weekend-folio-print` skill. To save links, use the `weekend-folio` skill.

## Rules

- The tools come from the Weekend Folio connector at `https://weekendfolio.com/mcp`. If the tools are not available, tell the user to connect it and to sign in.
- Take each article, issue, link and number from a tool result. Do not invent one.
- No confirmation is necessary to deliver an issue that the user asked for.
- A delivery finishes the next issue. Do not deliver it only to look at it. Use `get_issue` for that.
- An explicit instruction from the user has priority over this skill.

## The next issue

In `get_issue`, `update_issue` and `deliver_issue`, leave out `issue_id` to work on the next issue.

1. Call `get_issue` without `issue_id` to see it. The result gives its `number`, its `design`, the articles in their `sections`, and `pages_ready`.
2. If the tool answers that nothing waits for the next issue, tell the user and offer to save links. Stop there.
3. When the user asks to make an issue, do not call `create_issue`. The next issue is there already. Tell the user what it contains, and deliver it when they ask for it.

`pages_ready: false` means that Weekend Folio is still preparing the pages. A Kindle delivery then takes up to one minute, and a PDF link can take that long to open.

## Deliver as a PDF

Call `deliver_issue` with `destination: "pdf"`. Give the user the link in `pdf_link`. The link works for 7 days, and the PDF can take some seconds to open.

## Deliver to a Kindle

Call `deliver_issue` with `destination: "kindle"`.

| Result | What you do |
| --- | --- |
| `sent: true` | Say that the issue is on its way to the address in `to`. It arrives in minutes if the sender in `approve_sender` is approved at Amazon. |
| `sent: false` | Give the reason in `reason`. Nothing was sent and the issue is unchanged. Offer the PDF link. |

When no Kindle address is set:

1. Call `kindle_setup`. It gives the Amazon links, the steps to do there, and the sender address that the reader must approve.
2. Show the user the steps as the tool gives them.
3. Ask for their Send to Kindle address. It ends in `@kindle.com`.
4. Save it with `update_account` and `kindle_email`.
5. Deliver the issue again.

If `kindle_setup` returns `available: false`, Kindle delivery is not possible now. Offer the PDF link.

## After a delivery

When the result has `finished`, the delivery finished the next issue. Tell the user its number (`number`). Say that the articles they save from now on go into the issue after it.

To deliver a finished issue again, give its `issue_id`. `list_issues` gives the finished issues in `finished_issues`, newest first.

## Only some articles

When the user wants only some of the articles that wait:

- **Keep the others for later.** Call `update_issue` without `issue_id` and with `remove_article_ids`. Those articles wait for the issue after. Then deliver the next issue. `add_article_ids` brings such an article back.
- **A separate issue.** When the user asks for a special issue with a subject, a title or an order of their own, call `create_issue` with `article_ids` in reading order. Use only articles with `readable: true`. Give a `title` or a `design` only when the user asks for one. The result gives the `issue_id`, the `number` and the link in `view_on_website`. If the result has `cover`, say that the cover art comes in approximately one minute. Deliver it with its `issue_id`.

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

- `list_issues` gives the next issue in `next_issue` and the finished issues in `finished_issues`, newest first, with the number of articles, the design and the print status.
- `get_issue` gives the articles of one issue, in order, with their sections.
- `update_issue` changes the `title` or the `design`, adds articles (`add_article_ids`) and removes articles (`remove_article_ids`). Leave out a field to keep its value.
- A new design keeps the cover art.
- Weekend Folio puts the articles into sections and into an order. The tools cannot change the order. The reader can move an article on the website, on the page of the issue.

## Do not

- Do not say that an issue is on the Kindle unless the result has `sent: true`.
- Do not call `create_issue` to make the usual issue. Deliver the next issue.
- Do not call `deliver_issue` with `destination: "print"` in this skill. The `weekend-folio-print` skill has the rules for printed copies.
