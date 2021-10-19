import { Token } from './token'
import { ChainId } from '../constants'

export const STABLECOINS: { [chainId: number]: Token[] } = {
  43113: [
    new Token(ChainId.AVAX_TESTNET, '0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA', 6, 'USDC', 'USD Coin'),
    new Token(ChainId.AVAX_TESTNET, '0x0bE04001Ad4725c697b6c6bD8Bc23d9848992CA0', 6, 'USDT', 'Tether USD'),
    new Token(ChainId.AVAX_TESTNET, '0x66960440491bCc68BD30B2b0B08fF9e7aB3F9078', 18, 'DAI', 'Dai Stablecoin'),
    new Token(ChainId.AVAX_TESTNET, '0xCCf7ed44c5A0f3Cb5c9a9B9f765F8D836fb93BA1', 18, 'TUSD', 'True USD'),
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
  }
}