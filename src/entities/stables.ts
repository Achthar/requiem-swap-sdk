import { Token } from './token'
import { ChainId } from '../constants'

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