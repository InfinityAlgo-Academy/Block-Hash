// ============================================
// Block-Hash Common — Known Addresses
// ============================================

import { Chain } from '../types/blockchain.types';
import { WalletType } from '../types/analysis.types';

/** Known address entry */
export interface KnownAddress {
  address: string;
  chain: Chain;
  label: string;
  type: WalletType;
  tags: string[];
}

/** Known exchange addresses (hot wallets) */
export const KNOWN_EXCHANGES: KnownAddress[] = [
  // ── Binance ──
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', chain: Chain.ETHEREUM, label: 'Binance Hot Wallet', type: WalletType.EXCHANGE_HOT, tags: ['binance', 'cex'] },
  { address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', chain: Chain.ETHEREUM, label: 'Binance Cold Wallet', type: WalletType.EXCHANGE_COLD, tags: ['binance', 'cex'] },
  { address: '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d', chain: Chain.ETHEREUM, label: 'Binance Hot Wallet 2', type: WalletType.EXCHANGE_HOT, tags: ['binance', 'cex'] },
  { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC', chain: Chain.ETHEREUM, label: 'Binance Cold Wallet 2', type: WalletType.EXCHANGE_COLD, tags: ['binance', 'cex'] },
  { address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', chain: Chain.ETHEREUM, label: 'Binance Cold Wallet 3', type: WalletType.EXCHANGE_COLD, tags: ['binance', 'cex'] },

  // ── Coinbase ──
  { address: '0x71660c4005BA85c37ccec55d0C4493E66Fe775d3', chain: Chain.ETHEREUM, label: 'Coinbase Hot Wallet', type: WalletType.EXCHANGE_HOT, tags: ['coinbase', 'cex'] },
  { address: '0x503828976D22510aad0201ac7EC88293211D23Da', chain: Chain.ETHEREUM, label: 'Coinbase Cold Wallet', type: WalletType.EXCHANGE_COLD, tags: ['coinbase', 'cex'] },
  { address: '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43', chain: Chain.ETHEREUM, label: 'Coinbase Commerce', type: WalletType.EXCHANGE, tags: ['coinbase', 'cex'] },

  // ── Kraken ──
  { address: '0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2', chain: Chain.ETHEREUM, label: 'Kraken Hot Wallet', type: WalletType.EXCHANGE_HOT, tags: ['kraken', 'cex'] },
  { address: '0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0', chain: Chain.ETHEREUM, label: 'Kraken Cold Wallet', type: WalletType.EXCHANGE_COLD, tags: ['kraken', 'cex'] },

  // ── OKX ──
  { address: '0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b', chain: Chain.ETHEREUM, label: 'OKX Hot Wallet', type: WalletType.EXCHANGE_HOT, tags: ['okx', 'cex'] },

  // ── Bybit ──
  { address: '0xf89d7b9c864f589bbF53a82105107622B35EaA40', chain: Chain.ETHEREUM, label: 'Bybit Hot Wallet', type: WalletType.EXCHANGE_HOT, tags: ['bybit', 'cex'] },

  // ── BNB Chain exchanges ──
  { address: '0x8894E0a0c962CB723c1ef8a1B63d28AAF8965242', chain: Chain.BNB, label: 'Binance Hot Wallet BSC', type: WalletType.EXCHANGE_HOT, tags: ['binance', 'cex'] },

  // ── Polygon exchanges ──
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', chain: Chain.POLYGON, label: 'Binance Hot Wallet Polygon', type: WalletType.EXCHANGE_HOT, tags: ['binance', 'cex'] },
];

/** Known DEX routers */
export const KNOWN_DEX_ROUTERS: KnownAddress[] = [
  // ── Uniswap ──
  { address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', chain: Chain.ETHEREUM, label: 'Uniswap V2 Router', type: WalletType.DEX_ROUTER, tags: ['uniswap', 'dex'] },
  { address: '0xE592427A0AEce92De3Edee1F18E0157C05861564', chain: Chain.ETHEREUM, label: 'Uniswap V3 Router', type: WalletType.DEX_ROUTER, tags: ['uniswap', 'dex'] },
  { address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', chain: Chain.ETHEREUM, label: 'Uniswap V3 Router 2', type: WalletType.DEX_ROUTER, tags: ['uniswap', 'dex'] },
  { address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', chain: Chain.ETHEREUM, label: 'Uniswap Universal Router', type: WalletType.DEX_ROUTER, tags: ['uniswap', 'dex'] },

  // ── PancakeSwap ──
  { address: '0x10ED43C718714eb63d5aA57B78B54704E256024E', chain: Chain.BNB, label: 'PancakeSwap V2 Router', type: WalletType.DEX_ROUTER, tags: ['pancakeswap', 'dex'] },
  { address: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4', chain: Chain.BNB, label: 'PancakeSwap V3 Router', type: WalletType.DEX_ROUTER, tags: ['pancakeswap', 'dex'] },

  // ── SushiSwap ──
  { address: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', chain: Chain.ETHEREUM, label: 'SushiSwap Router', type: WalletType.DEX_ROUTER, tags: ['sushiswap', 'dex'] },

  // ── 1inch ──
  { address: '0x1111111254EEB25477B68fb85Ed929f73A960582', chain: Chain.ETHEREUM, label: '1inch Router V5', type: WalletType.DEX_ROUTER, tags: ['1inch', 'dex', 'aggregator'] },
];

/** Known bridge contracts */
export const KNOWN_BRIDGES: KnownAddress[] = [
  { address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35', chain: Chain.ETHEREUM, label: 'Base Bridge', type: WalletType.BRIDGE, tags: ['base', 'bridge'] },
  { address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a', chain: Chain.ETHEREUM, label: 'Arbitrum Bridge', type: WalletType.BRIDGE, tags: ['arbitrum', 'bridge'] },
  { address: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', chain: Chain.ETHEREUM, label: 'Polygon Bridge', type: WalletType.BRIDGE, tags: ['polygon', 'bridge'] },
];

/** Build address lookup map for O(1) checks */
export function buildAddressLookup(
  addresses: KnownAddress[]
): Map<string, KnownAddress> {
  const map = new Map<string, KnownAddress>();
  for (const entry of addresses) {
    map.set(`${entry.chain}:${entry.address.toLowerCase()}`, entry);
  }
  return map;
}

/** All known addresses combined */
export const ALL_KNOWN_ADDRESSES: KnownAddress[] = [
  ...KNOWN_EXCHANGES,
  ...KNOWN_DEX_ROUTERS,
  ...KNOWN_BRIDGES,
];

/** Pre-built lookup map */
export const ADDRESS_LOOKUP = buildAddressLookup(ALL_KNOWN_ADDRESSES);

/** Check if an address is a known exchange */
export function isKnownExchange(chain: Chain, address: string): KnownAddress | undefined {
  const key = `${chain}:${address.toLowerCase()}`;
  const known = ADDRESS_LOOKUP.get(key);
  return known && (known.type === WalletType.EXCHANGE || known.type === WalletType.EXCHANGE_HOT || known.type === WalletType.EXCHANGE_COLD)
    ? known
    : undefined;
}

/** Check if an address is a known DEX router */
export function isKnownDexRouter(chain: Chain, address: string): KnownAddress | undefined {
  const key = `${chain}:${address.toLowerCase()}`;
  const known = ADDRESS_LOOKUP.get(key);
  return known && known.type === WalletType.DEX_ROUTER ? known : undefined;
}
