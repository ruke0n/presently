# Presently

**Send USDC as a gift.** Presently turns USDC into claimable gift vouchers on
Arc: lock an amount, share a link or a short code, and anyone can redeem it
straight into their wallet. No account, no separate gas token, just USDC on Arc.

A *present* that arrives *presently*.

## Status

Frontend (this repo). A polished marketing site with:

- a **LiquidMetal** shader hero (`@paper-design/shaders-react`),
- how-it-works, a bento feature grid, use cases, and a big-wordmark footer,
- a custom ribbon-bow logo + favicon.

The on-chain voucher contract and wallet-wired create/redeem flow are the next
step; the Create / Redeem buttons are placeholders until then.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- shadcn-style `components/ui` (button, badge, card)
- framer-motion, lucide-react

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Layout

```
app/                 routes, layout, favicon (icon.svg)
components/
  ui/                logo, liquid-metal-hero, bento-grid, button/badge/card
  site-nav.tsx       sticky nav
  site-footer.tsx    footer
  sections.tsx       how-it-works, features, use cases, CTA
lib/utils.ts         cn()
```
