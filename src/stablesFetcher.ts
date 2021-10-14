import { ethers } from 'ethers'
import { BigNumber } from 'ethers'
// import { getNetwork } from '@ethersproject/networks'
// import { getDefaultProvider } from '@ethersproject/providers'
import { TokenAmount } from './entities/fractions/tokenAmount'
// import { Pair } from './entities/pair'
import { StablePool } from './entities/stablePool'
// import IPancakePair from '@pancakeswap-libs/pancake-swap-core/build/IPancakePair.json'
// import invariant from 'tiny-invariant'
// import ERC20 from './abis/ERC20.json'
import StableSwap from './abis/RequiemStableSwap.json'
import { STABLES_INDEX_MAP } from './entities/stables'
// import { Token } from './entities/token'


/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
export abstract class StablesFetcher {
  /**
   * Cannot be constructed.
   */
  private constructor() { }

  /**
   * Fetches information about the stablePool and constructs a StablePool Object from the contract deployed.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */
  public static async fetchStablePoolData(
    chainId: number,
    provider: ethers.providers.Provider
  ): Promise<StablePool> {
    const address = StablePool.getAddress(chainId)
    console.log("address", address)
    const tokenAddresses = await new ethers.Contract(address, StableSwap, provider).getTokens()
    console.log("TokenAddresses", tokenAddresses)
    const tokenReserves = await new ethers.Contract(address, StableSwap, provider).getTokenBalances()
    let indexes = []
    for (let i = 0; i < tokenAddresses.length; i++) {
      indexes.push(i)
    }
    const tokenMap = Object.assign({},
      ...(tokenAddresses as string[]).map((_, index) => ({
        [index]: new TokenAmount(
          STABLES_INDEX_MAP[chainId][index],
          tokenReserves[index])
      })))
    return new StablePool(tokenMap, BigNumber.from(0), BigNumber.from(0), BigNumber.from(0), 0)
  }

}
