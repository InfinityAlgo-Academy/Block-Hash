// ============================================
// Block-Hash Common — Event Signatures
// ============================================

/**
 * Keccak256 hashes of common Solidity event signatures.
 * Used for fast topic[0] matching during log filtering.
 */
export const EVENT_SIGNATURES = {
  // ── ERC20 ──
  ERC20_TRANSFER: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  ERC20_APPROVAL: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',

  // ── ERC721 ──
  ERC721_TRANSFER: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // same as ERC20 but with indexed tokenId
  ERC721_APPROVAL: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  ERC721_APPROVAL_FOR_ALL: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',

  // ── ERC1155 ──
  ERC1155_TRANSFER_SINGLE: '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
  ERC1155_TRANSFER_BATCH: '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',

  // ── Uniswap V2 ──
  UNISWAP_V2_SWAP: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
  UNISWAP_V2_MINT: '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
  UNISWAP_V2_BURN: '0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496',
  UNISWAP_V2_SYNC: '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
  UNISWAP_V2_PAIR_CREATED: '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9',

  // ── Uniswap V3 ──
  UNISWAP_V3_SWAP: '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
  UNISWAP_V3_MINT: '0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde',
  UNISWAP_V3_BURN: '0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c',
  UNISWAP_V3_POOL_CREATED: '0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118',

  // ── WETH ──
  WETH_DEPOSIT: '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
  WETH_WITHDRAWAL: '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
} as const;

/** Method selectors (first 4 bytes of keccak256) */
export const METHOD_SELECTORS = {
  // ── ERC20 ──
  ERC20_TRANSFER: '0xa9059cbb',
  ERC20_APPROVE: '0x095ea7b3',
  ERC20_TRANSFER_FROM: '0x23b872dd',

  // ── Uniswap V2 Router ──
  SWAP_EXACT_TOKENS_FOR_TOKENS: '0x38ed1739',
  SWAP_TOKENS_FOR_EXACT_TOKENS: '0x8803dbee',
  SWAP_EXACT_ETH_FOR_TOKENS: '0x7ff36ab5',
  SWAP_TOKENS_FOR_EXACT_ETH: '0x4a25d94a',
  SWAP_EXACT_TOKENS_FOR_ETH: '0x18cbafe5',
  SWAP_ETH_FOR_EXACT_TOKENS: '0xfb3bdb41',
  ADD_LIQUIDITY: '0xe8e33700',
  ADD_LIQUIDITY_ETH: '0xf305d719',
  REMOVE_LIQUIDITY: '0xbaa2abde',
  REMOVE_LIQUIDITY_ETH: '0x02751cec',

  // ── Multicall ──
  MULTICALL: '0xac9650d8',
} as const;

/** Zero address */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/** Dead address (burn) */
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD';

/** Check if an address is a burn/zero address */
export function isBurnAddress(address: string): boolean {
  const lower = address.toLowerCase();
  return lower === ZERO_ADDRESS || lower === DEAD_ADDRESS.toLowerCase();
}
