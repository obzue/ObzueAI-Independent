# Northroom

Original full-stack hall for independent artists. Music, merch, member stalls, a per-member profile assistant, community guidelines, and a privacy policy.

This is **not** a copy of VOXSHOP360 or of any of the GitHub projects it was patterned after. Names, catalog, and copy are original. The public feature map it answers is the same family: marketplace, artist stalls, albums and tracks, merch, basket, plans, studio (publish, splits, inbox, sales, mailing-list count), and legal pages.

## Patterns studied, not forked

- joschan21/digitalhippo
- paulkochuiev/audio-vault
- zlema/Artist-CMS-Platform
- Ankit-2145/multi-vendor-marketplace
- mercurjs/mercur
- lyes-mersel/megashop

The build skill that captures the updated stack is `.grok/skills/artist-marketplace/SKILL.md`.

## What is in this repo

- `src/` — TanStack Start routes, hall server functions, guidelines, privacy, terms
- `migrations/0002_northroom.sql` — catalog, stalls, ledger, assistant notes
- `public/` — mark and share card

Accounts, the database helper, and the dev server live in the app-builder project this was built inside. Sign-in is Google or X. Checkout writes a ledger and does not charge a card. The profile assistant calls Grok only when a signed-in member asks, and only with that member's profile.
