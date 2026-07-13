# Presently

Money is a lousy gift when it shows up as a bank transfer with a memo line.
Presently makes it a gift again: you wrap some USDC, hand over a code, and the
other person unwraps it into their own wallet. A *present* that arrives
*presently*.

It lives on Arc, where USDC is the native asset, so a voucher is one clean thing
from start to finish. Nothing to bridge, no gas token to top up, no account to
sign anyone up for.

## Follow one voucher

Say you want to give a friend 25 USDC.

**You wrap it.** You pick the amount and Presently rolls a code like
`PRES-7QK4-M2W9`. It hashes that code and locks your 25 USDC in the GiftVoucher
contract against the hash. The code itself never touches the chain yet, so at
this point it is a secret only you hold.

**You hand it over.** Text them the code, or the `?claim=` link that pre-fills
it. However it reaches them is up to you. The code is the bearer, whoever has it
can claim the money, so it travels like a folded bill, not like a bank detail.

**They unwrap it.** They open the link, connect any wallet, and hit redeem. The
contract sees the code hashes to a real, unclaimed voucher and moves the 25 USDC
to them. Once. A second attempt finds it already claimed.

**Or you take it back.** Changed your mind, or they never showed up? As long as
it is unredeemed, you reclaim it and the USDC returns to you.

That is the whole product. Four verbs: wrap, hand over, unwrap, take back.

## Under the hood

The rules live in one small, unowned contract,
[`GiftVoucher.sol`](contract/src/GiftVoucher.sol): no factory, no proxy, no admin
switch, just `createVoucher`, `redeem`, and `reclaim`, guarded by
`ReentrancyGuard` and moving funds with `SafeERC20`. Ten Foundry tests cover the
happy paths and the ways people try to cheat (wrong code, double redeem, reclaim
after redeem). The frontend is a static Next app; wagmi and viem do the reads and
writes, and the code hashing on the client matches the contract's
`keccak256(bytes(code))` exactly, so a voucher made in the browser is redeemable
by the browser.

It is live on Arc testnet (chain 5042002). GiftVoucher sits at
`0xec1399B695cA96e3f98927c59d01D3141086716C`, spending the USDC ERC-20 interface
at `0x3600000000000000000000000000000000000000`. Full record in
[deployments/arc-testnet.json](deployments/arc-testnet.json).

## Run it yourself

```bash
npm install
npm run dev
```

The contract half needs [Foundry](https://book.getfoundry.sh):

```bash
cd contract
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts
forge test
```

The app is in `app/` and `components/`, the chain glue (addresses, ABIs, the code
hasher) in `lib/chain.ts`, and the contract and its tests in `contract/`.

## Worth knowing

This is testnet software and it has not been audited. And because the code is a
bearer instrument, anyone who sees it can claim the voucher, so share it the way
you would share cash, not the way you would share an address.
