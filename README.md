# Savasaachi Flix BD

A Next.js shop for streaming plans, AI tools, gift cards, and software keys in Bangladesh. It follows the catalog and checkout flow of a local OTT store: collections, variants, cart, coupons, bKash / Nagad / Rocket / card, WhatsApp delivery, account, order tracking, guides, and policies.

The interface, copy, and artwork are original. Brand names on products belong to their owners.

## Stack

- Next.js 16.3.8 (the latest 16.3 security release; 16.3.6 was the prior patch)
- React 19.2
- Tailwind CSS 4
- App Router, TypeScript, Turbopack

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm start
```

## Before you take real payments

Edit `src/lib/site.ts`:

- phone and WhatsApp
- bKash, Nagad, and Rocket numbers
- email, address, and social links

Checkout stores the order in this browser. It does not charge a wallet or a card. Card checkout is a simulated approval and never asks for a card number. Connect SSLCommerz, bKash, or another gateway before launch.

## Shop flow

- Coupons: `SAVA10` (10% off), `WELCOME50` (Tk 50 off from Tk 300), `COMBO100` (Tk 100 off when a combo is in the cart)
- Accounts and orders stay in local storage on the device
- Track an order at `/track` with the `SFX-` id
- Press `/` to search

## Catalog

Product data is in `src/data/products.ts`. Collections are in `src/data/collections.ts`.
