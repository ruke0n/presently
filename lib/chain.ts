import { defineChain, getAddress, keccak256, toBytes, type Address } from "viem";

export const CHAIN_ID = 5042002;
export const RPC_URL = "https://rpc.testnet.arc.network";
export const USDC: Address = getAddress("0x3600000000000000000000000000000000000000");
export const GIFT_VOUCHER: Address = getAddress("0xec1399B695cA96e3f98927c59d01D3141086716C");
export const USDC_DECIMALS = 6;

export const arcTestnet = defineChain({
  id: CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: [RPC_URL] } },
});

/** keccak256 of the code's UTF-8 bytes, matching the contract's keccak256(bytes(code)). */
export function hashCode(code: string) {
  return keccak256(toBytes(code));
}

/** A shareable voucher code like PRES-4F9A-Q27K (crockford-ish, no ambiguous chars). */
export function generateCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const part = (i: number) =>
    Array.from({ length: 4 }, (_, k) => alphabet[bytes[i * 4 + k] % alphabet.length]).join("");
  return `PRES-${part(0)}-${part(1)}`;
}

export const giftVoucherAbi = [
  {
    type: "function",
    name: "createVoucher",
    stateMutability: "nonpayable",
    inputs: [
      { name: "codeHash", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "redeem",
    stateMutability: "nonpayable",
    inputs: [{ name: "code", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "reclaim",
    stateMutability: "nonpayable",
    inputs: [{ name: "codeHash", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "isClaimable",
    stateMutability: "view",
    inputs: [{ name: "codeHash", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "vouchers",
    stateMutability: "view",
    inputs: [{ name: "codeHash", type: "bytes32" }],
    outputs: [
      { name: "sender", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "closed", type: "bool" },
    ],
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
