# Presently

**Send USDC as a gift.** Presently turns USDC into claimable gift vouchers on
Arc: lock an amount, share a link or a short code, and anyone can redeem it
straight into their wallet. No account, no separate gas token, just USDC on Arc.

A *present* that arrives *presently*.

## How it works

1. **Create** a voucher: pick a USDC amount. The app generates a random code
   (`PRES-XXXX-XXXX`), hashes it, and locks the USDC against that hash on-chain.
2. **Share** the code, or the `/?claim=CODE` link.
3. **Redeem**: whoever presents the code claims the USDC into their own wallet.
   The sender can reclaim a voucher that hasn't been redeemed.

The code is a bearer instrument, treat it like cash. It is only revealed at
redeem time, so creating a voucher leaks nothing.

## Contract

`GiftVoucher` ([contract/src/GiftVoucher.sol](contract/src/GiftVoucher.sol)) is a
single, unowned contract, no factory, no admin keys.

| Function | Who | What |
|---|---|---|
| `createVoucher(bytes32 codeHash, uint256 amount)` | sender | pulls `amount` USDC and locks it against `codeHash = keccak256(bytes(code))` |
| `redeem(string code)` | anyone | hashes the code, pays the voucher to the caller |
| `reclaim(bytes32 codeHash)` | sender | takes back an unredeemed voucher |
| `isClaimable(bytes32 codeHash)` | view | whether a voucher exists and is unclaimed |

`ReentrancyGuard` + `SafeERC20`. 10 Foundry tests in
[contract/test](contract/test).

## Live deployment

Arc testnet (chain `5042002`), see
[deployments/arc-testnet.json](deployments/arc-testnet.json):

| | |
|---|---|
| GiftVoucher | `0xec1399B695cA96e3f98927c59d01D3141086716C` |
| USDC (ERC-20, 6 decimals) | `0x3600000000000000000000000000000000000000` |

## Stack

- Next.js (App Router, static export) + TypeScript
- Tailwind CSS v4, shadcn-style `components/ui`
- wagmi + RainbowKit + viem for the create/redeem flow
- `@paper-design/shaders-react` (LiquidMetal hero), framer-motion, lucide-react
- Foundry for the contract

## Run

```bash
npm install
npm run dev        # http://localhost:3000

# contract (needs Foundry)
cd contract && forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts
forge test
```

## Layout

```
app/                 routes, layout, providers (wallet + dialog), favicon
components/
  ui/                logo, liquid-metal-hero, bento-grid, button/badge/card
  voucher-dialog.tsx create / redeem flow
  hero-section.tsx   hero wired to the dialog
  site-nav / site-footer / sections
lib/
  chain.ts           Arc config, addresses, ABIs, code hashing
contract/            Foundry: GiftVoucher.sol + tests + deploy script
deployments/         recorded on-chain addresses
```
