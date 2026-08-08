# Web Adapter (placeholder)

This directory is reserved for the future **Web / Blog adapter** of the ZJ
design language. It is intentionally not implemented yet.

## How the future adapter should plug in

The design language lives in [`../shared/tokens.css`](../shared/tokens.css)
(colors, typography, spacing, radius, heading scale). A web adapter should:

1. Copy the `--zj-*` token block verbatim into its entry CSS file
   (e.g. `web/zj-web.css`), the same way `typora/zj.css` and
   `obsidian/theme.css` do — no runtime `@import` across directories,
   so every platform stays self-contained and copy-paste installable.
2. Map the tokens onto its own selectors (`body`, `article`, `pre`, …).
   Do **not** reuse Typora or Obsidian selectors; only the tokens are shared.
3. Keep the token block in sync with `node scripts/check-tokens.mjs`
   (add the new file to the adapter list in that script).

What should *not* live here: framework code, static-site scaffolding, or
anything that pulls build tooling into this repository. Plain CSS is enough.
