---
name: weekend-folio-print
description: Order a printed copy of a Weekend Folio issue by post. Get the live quote for printing and shipping, show the options and totals, and pay only after the user confirms one option. Use when the user asks to print an issue, wants a paper copy, asks what a printed copy costs, or asks about a print order. Needs the Weekend Folio connector.
license: MIT
---

# Weekend Folio: order a printed copy

A printed copy is one issue on A4 paper, printed and sent to the reader by post.

A printed copy has no subscription. The reader pays for each copy separately, at the printer's cost for printing, shipping and tax. Thus each order has a live quote, and the reader must agree to it.

This skill moves money. Obey the rules exactly.

## Rules

- Get the quote from `deliver_issue`. Do not estimate a price, and do not use a price from an earlier quote.
- `deliver_issue` with `destination: "print"` does not charge the reader. Only `pay_for_print` charges the reader.
- Call `pay_for_print` only when the user's latest message clearly says yes to one shipping option and its total.
- Do not say that an issue is ordered unless `pay_for_print` returned `paid: true`.
- An explicit instruction from the user has priority over this skill, but an instruction cannot remove the confirmation before a payment.

## 1. Find the issue

Call `list_issues`, or `get_issue` when you know the issue. If it is not clear which issue the user wants, ask. The `print_status` of each issue in `list_issues` shows if it has a print order.

## 2. Get the quote

Call `deliver_issue` with the `issue_id` and `destination: "print"`. Weekend Folio typesets the issue on A4 first. This can take a minute. Tell the user that you are getting the quote.

| Result | What you do |
| --- | --- |
| `quoted: false` | No quote is possible. Give the reason in `reason`. If the delivery address is missing, give the link in `settings`. The reader adds the address on the website. The tools cannot set it. |
| `quoted: true` | Continue with step 3. |

## 3. Show the quote

Tell the user all of these items from the result:

- The number of pages (`pages`).
- Where the copy goes (`deliver_to`).
- Each shipping option in `options`, with its `label` and its `total`.
- The saved card (`saved_card`), if there is one.
- That the quote is valid until `pay_before`.

Then ask which option the user wants. Read `next_step` in the result. It tells you which of the two paths in step 4 applies.

## 4. Pay

**Path A: the user pays on the website.** Use this path when one of these conditions is true:

- The `pay_for_print` tool is not available. The reader did not give this connection the permission to pay.
- `saved_card` is empty.
- The user prefers to pay themselves.

Give the user the link in `issue_link`. They select the shipping option and pay there. On this path, you are done.

**Path B: you pay with the saved card.** Use this path only when all of these conditions are true:

- The `pay_for_print` tool is available.
- `saved_card` has a card.
- You showed the option, its total and the card to the user.
- The user's latest message clearly says yes to that option and that total.

Then call `pay_for_print` with these values, exactly as the quote gave them:

| Input | Value |
| --- | --- |
| `order_id` | `order_id` of the quote. |
| `shipping_option_id` | `shipping_option_id` of the option that the user selected. |
| `total_minor` | `total_minor` of that option. |

These are not a yes: "ok" without a specified option when there are two or more options, an agreement from earlier in the conversation, an agreement to a different total, or silence. If you are not sure, ask again.

## 5. Tell the user the result

| Result | What you do |
| --- | --- |
| `paid: true` | Tell the user the amount in `charged` and the status in `status`. The printer prints the issue and sends it by post. The status and the tracking are on the website, in Settings, below Print orders. |
| `paid: false` | Tell the user the reason in `reason` and give the link in `pay_on_website`. Do not try the payment again unless the user asks. |

## Do not

- Do not order two copies for one confirmation.
- Do not pay after `pay_before`. Get a new quote and show it again.
- Do not change `total_minor`. If the user wants a different price or address, the reader changes the address on the website and you get a new quote.
- Do not call `pay_for_print` to "check" if it works.
