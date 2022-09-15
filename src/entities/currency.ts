/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly decimals: number
  public readonly chainId: number
  public readonly symbol?: string
  public readonly name?: string

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  constructor(chainId: number, decimals: number, symbol?: string, name?: string) {
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.chainId = chainId
  }
}


export enum ChainId {
  TT_MAINNET = 108,
  TT_TESTNET = 18,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  AVAX_MAINNET = 43114,
  AVAX_TESTNET = 43113,
  ARBITRUM_MAINNET = 42161,
  ARBITRUM_TETSNET_RINKEBY = 421611,
  MATIC_MAINNET = 137,
  MATIC_TESTNET = 80001,
  OASIS_TESTNET = 42261,
  OASIS_MAINNET = 42262,
  QUARKCHAIN_DEV_S0 = 110001,
}

export const NETWORK_CCY: { [chainId: number]: Currency } = {
  [ChainId.TT_MAINNET]: new Currency(ChainId.TT_MAINNET, 18, 'TT', 'TT'),
  [ChainId.TT_TESTNET]: new Currency(ChainId.TT_TESTNET, 18, 'TT', 'TT'),
  [ChainId.BSC_MAINNET]: new Currency(ChainId.BSC_MAINNET, 18, 'BNB', 'BNB'),
  [ChainId.BSC_TESTNET]: new Currency(ChainId.BSC_TESTNET, 18, 'BNB', 'BNB'),
  [ChainId.ARBITRUM_MAINNET]: new Currency(ChainId.ARBITRUM_MAINNET, 18, 'ETH', 'ETH'),
  [ChainId.ARBITRUM_TETSNET_RINKEBY]: new Currency(ChainId.ARBITRUM_TETSNET_RINKEBY, 18, 'ETH', 'ETH'),
  [ChainId.AVAX_MAINNET]: new Currency(ChainId.AVAX_MAINNET, 18, 'AVAX', 'AVAX'),
  [ChainId.AVAX_TESTNET]: new Currency(ChainId.AVAX_TESTNET, 18, 'AVAX', 'AVAX'),
  [ChainId.MATIC_MAINNET]: new Currency(ChainId.MATIC_MAINNET, 18, 'MATIC', 'MATIC'),
  [ChainId.MATIC_TESTNET]: new Currency(ChainId.MATIC_TESTNET, 18, 'MATIC', 'MATIC'),
  [ChainId.OASIS_MAINNET]: new Currency(ChainId.OASIS_MAINNET, 18, 'ROSE', 'ROSE'),
  [ChainId.OASIS_TESTNET]: new Currency(ChainId.OASIS_TESTNET, 18, 'ROSE', 'ROSE'),
  [ChainId.QUARKCHAIN_DEV_S0]: new Currency(ChainId.QUARKCHAIN_DEV_S0, 18, 'QKC', 'QKC')
}
