# Security

## Report a problem

Write to [hello@weekendfolio.com](mailto:hello@weekendfolio.com) with the subject "Security". Do not open a public issue.

Tell us what you found, how to see it, and what a person could do with it. We will answer you.

## What is in scope

- The connector at `https://weekendfolio.com/mcp` and its sign-in.
- The files in this repository: a manifest that points to a wrong address, or a skill that makes an assistant do something unsafe.

## What the plugin can do

- The plugin runs no code on the computer of the reader. It has no scripts, no hooks and no programs.
- It connects to `https://weekendfolio.com` only.
- Access is an OAuth token for one reader. The reader can stop it in Settings on weekendfolio.com.
- A payment needs a permission that is off by default. The reader gives it on the sign-in page.
