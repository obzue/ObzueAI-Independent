---
name: artist-marketplace
description: >
  Build a complete-stack independent-artist marketplace: public catalog,
  member stalls, music and merch, basket and library ledger, per-member
  profile AI, extensive community guidelines, and a privacy policy. Use when
  asked for a music marketplace, direct-to-fan shop, Bandcamp-style hall,
  artist storefront, or a full-stack site in that family.
metadata:
  short-description: "Full-stack direct-to-fan music and merch hall with profile AI and legal pages"
user-invocable: false
---

# Artist marketplace (full stack)

Use this when the product is a **direct hall**: artists sell music and merch,
fans buy into a library, every account has a private assistant, and the site
ships real community guidelines plus a privacy policy.

This skill was loaded in this workspace from public marketplace patterns
(not copied code):

- `joschan21/digitalhippo` — digital goods, cart, sellers, admin review
- `paulkochuiev/audio-vault` — catalog, cart, orders, role dashboards
- `zlema/Artist-CMS-Platform` — artist CMS plus a store
- `Ankit-2145/multi-vendor-marketplace` — isolated vendor storefronts
- `mercurjs/mercur` — multi-vendor commerce surfaces (store, vendor, admin)
- `lyes-mersel/megashop` — customer, vendor, and assistant-shaped support

The live app in this workspace is **ObzueAI Independent**. Do not reuse another
company's name, catalog, or copy. House artists here are original.

## Stack in this workspace

- TanStack Start routes in `src/routes/`
- Neon or PGLite via `@/lib/db`, schema in `migrations/0002_*.sql`
- Auth on: `authMiddleware` + `context.userId` on every per-member function
- Profile assistant: server-only `XAI_API_KEY`, model `grok-4.5`, button press
  only, `max_tokens` capped, per-minute note cap, notes stored on that user

## Surfaces a complete hall needs

1. Home with a real catalog, not a wireframe.
2. Marketplace search (music / merch / genre).
3. Artist stall, release page, merch page.
4. Basket, ledger checkout (say clearly if no card is charged), library.
5. Studio: publish release, publish merch, inbox, sales, list count.
6. Profile: identity, plan, and an assistant that only sees that member.
7. Plans with an honest share, not a fake charge.
8. Community guidelines and privacy policy long enough to govern uploads,
   merch, messages, minors, copyright, AI, moderation, retention, and sharing.
9. Sign-in through the workspace auth skill. No invented OAuth providers.

## Data rules

- Public catalog rows may have a null owner (house artists).
- Member rows always filter with `context.userId`.
- Never return another member's email to a stall. Sales lines are title,
  quantity, and amount. Inbox shows the sender's display name only.
- Reserve house handles so a member cannot claim them.
- Cast `timestamptz` to text in selects. Pass JSON with `::jsonb`.

## Assistant rules

- System prompt names exactly one member and refuses other members' data.
- Kinds that earn their place: bio, pitch, fan reply, merch copy, guidelines
  check, free chat.
- Guidelines check is advice. The page must say it is not a moderation ruling.
- Do not call the model on load, in a loop, or for anonymous traffic.

## Legal pages

Write original policy text for **this** product. State that it is not legal
advice. Cover age, copyright, harassment, sexual content, the ledger, what
artists can see, assistant retention, and how to ask for a correction.
Link guidelines, privacy, and terms from the footer and from sign-in.
