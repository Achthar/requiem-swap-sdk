import invariant from 'tiny-invariant'
import { validateAndParseAddress } from '../helperUtils'
import { Currency, ChainId } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string
  public readonly projectLink?: string

  public constructor(
    chainId: ChainId,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    projectLink?: string
  ) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
    this.projectLink = projectLink
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const WETH = {
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.ARBITRUM_MAINNET]: new Token(
    ChainId.ARBITRUM_MAINNET,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped ETH',
    'https://www.binance.org'
  ),
  [ChainId.ARBITRUM_TETSNET_RINKEBY]: new Token(
    ChainId.ARBITRUM_TETSNET_RINKEBY,
    '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.AVAX_MAINNET]: new Token(
    ChainId.AVAX_MAINNET,
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    18,
    'WAVAX',
    'Wrapped AVAX',
    'https://www.binance.org'
  ),
  [ChainId.AVAX_TESTNET]: new Token(
    ChainId.AVAX_TESTNET,
    '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    18,
    'WAVAX',
    'Wrapped AVAX',
    'https://www.binance.org'
  ),
  [ChainId.MATIC_MAINNET]: new Token(
    ChainId.MATIC_MAINNET,
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    18,
    'WMATIC',
    'Wrapped MATIC',
    'https://www.binance.org'
  ),
  [ChainId.MATIC_TESTNET]: new Token(
    ChainId.MATIC_TESTNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC',
    'https://www.binance.org'
  ),

}
// this has not to be mixed up with the ERC20 token WETH on BSC or MATIC
// these are the respective wrapped network tokens, e.g. WBNB for Binance
// or WMATIC for Polygon
export const WRAPPED_NETWORK_TOKENS = {
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.ARBITRUM_MAINNET]: new Token(
    ChainId.ARBITRUM_MAINNET,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped ETH',
    'https://www.binance.org'
  ),
  [ChainId.ARBITRUM_TETSNET_RINKEBY]: new Token(
    ChainId.ARBITRUM_TETSNET_RINKEBY,
    '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.AVAX_MAINNET]: new Token(
    ChainId.AVAX_MAINNET,
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    18,
    'WAVAX',
    'Wrapped AVAX',
    'https://www.binance.org'
  ),
  [ChainId.AVAX_TESTNET]: new Token(
    ChainId.AVAX_TESTNET,
    '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    18,
    'WAVAX',
    'Wrapped AVAX',
    'https://www.binance.org'
  ),
  [ChainId.MATIC_MAINNET]: new Token(
    ChainId.MATIC_MAINNET,
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    18,
    'WMATIC',
    'Wrapped MATIC',
    'https://www.binance.org'
  ),
  [ChainId.MATIC_TESTNET]: new Token(
    ChainId.MATIC_TESTNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC',
    'https://www.binance.org'
  ),
  [ChainId.OASIS_TESTNET]:
  new Token( ChainId.OASIS_TESTNET,
    '0x792296e2a15e6Ceb5f5039DecaE7A1f25b00B0B0',
    18,
    'wROSE',
    'Wrapped ROSE',
    'https://docs.oasis.dev/'
  ),
  [ChainId.OASIS_MAINNET]:
  new Token( ChainId.OASIS_MAINNET,
    '0xfb40cd35C0cF322fA3cfB8D67b533Bd9ad7df056',
    18,
    'wROSE',
    'Wrapped ROSE',
    'https://docs.oasis.dev/'
  ),
  [ChainId.QUARKCHAIN_DEV_S0]:
  new Token( ChainId.OASIS_MAINNET,
    '0x56fB4da0E246003DEc7dD108e47f5d8e8F4cC493',
    18,
    'wQKC',
    'Wrapped QKC',
    'https://docs.oasis.dev/'
  ),

}



export const STABLECOINS: { [chainId: number]: Token[] } = {
  43113: [
    new Token(ChainId.AVAX_TESTNET, '0xca9ec7085ed564154a9233e1e7d8fef460438eea', 6, 'USDC', 'USD Coin'),
    new Token(ChainId.AVAX_TESTNET, '0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e', 6, 'USDT', 'Tether USD'),
    new Token(ChainId.AVAX_TESTNET, '0xaea51e4fee50a980928b4353e852797b54deacd8', 18, 'DAI', 'Dai Stablecoin'),
    new Token(ChainId.AVAX_TESTNET, '0xccf7ed44c5a0f3cb5c9a9b9f765f8d836fb93ba1', 18, 'TUSD', 'True USD'),
  ],
  42261 :[
    new Token(ChainId.OASIS_TESTNET, '0x9aEeeD65aE87e3b28793aefAeED59c3f10ef956b', 6, 'USDC', 'USD Coin'),
    new Token(ChainId.OASIS_TESTNET, '0xfA0D8065755Fb3b6520149e86Ac5A3Dc3ee5Dc92', 6, 'USDT', 'Tether USD'),
    new Token(ChainId.OASIS_TESTNET, '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4', 18, 'DAI', 'Dai Stablecoin'),
    new Token(ChainId.OASIS_TESTNET, '0x4e8848da06E40E866b82f6b52417494936c9509b', 18, 'TUSD', 'True USD'),
  ],
  110001 :[
    new Token(ChainId.QUARKCHAIN_DEV_S0, '0xE59c1Ddf4fAAC4Fa7C8c93d9392d4bBa55383268', 6, 'USDC', 'USD Coin'),
    new Token(ChainId.QUARKCHAIN_DEV_S0, '0x1a69a6e206c680A8559c59b951527437CBCe6Ed7', 6, 'USDT', 'Tether USD'),
    new Token(ChainId.QUARKCHAIN_DEV_S0, '0x51b90a5Bc99B7c76EDf3863E1d61ca6197a6e542', 18, 'DAI', 'Dai Stablecoin'),
    new Token(ChainId.QUARKCHAIN_DEV_S0, '0xD71C821a373E16D607277DB6C1356c1209C7d866', 18, 'TUSD', 'True USD'),
  ],
  0: [// dummy value
    new Token(-1, '0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA', 6, 'USDC', 'USD Coin')]
}


export const STABLES_INDEX_MAP: { [chainId: number]: { [index: number]: Token } } = {
  43113: {
    0: STABLECOINS[43113][0],
    1: STABLECOINS[43113][1],
    2: STABLECOINS[43113][2],
    3: STABLECOINS[43113][3]
  },
  42261: {
    0: STABLECOINS[42261][0],
    1: STABLECOINS[42261][1],
    2: STABLECOINS[42261][2],
    3: STABLECOINS[42261][3]
  },
  110001: {
    0: STABLECOINS[110001][0],
    1: STABLECOINS[110001][1],
    2: STABLECOINS[110001][2],
    3: STABLECOINS[110001][3]
  }
}

export const STABLES_LP_TOKEN: { [chainId: number]: { [index: number]: Token } } = {
  43113: {
    0: STABLECOINS[43113][0],
    1: STABLECOINS[43113][1],
    2: STABLECOINS[43113][2],
    3: STABLECOINS[43113][3]
  }
}