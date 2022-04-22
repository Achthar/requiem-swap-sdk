import invariant from 'tiny-invariant'
import { Pool, PoolDictionary } from './pools/pool'
import { ChainId, Currency, NETWORK_CCY } from './currency'
import { Token, WRAPPED_NETWORK_TOKENS } from './token'
import { Price } from './fractions/price'
import { PairData } from './pools/pairData'


/**
 * 
 * @param pools pools to generate pairData with, i.e. a 3-Pool generating the respective 6 pairs
 * @returns an array of the pairData
 */
export function pairDataFromPools(pools: Pool[]): PairData[] {
  let pairData = PairData.dataFromPool(pools[0])
  for (let i = 1; i < pools.length; i++) {
    pairData = pairData.concat(PairData.dataFromPool(pools[i]))
  }

  return pairData
}

// new version of the route 
// the first verion to include the stable pool for less friction
export class Route {
  public readonly pairData: PairData[]
  public readonly path: Token[]
  public readonly input: Currency
  public readonly output: Currency
  public readonly midPrice: Price

  public constructor(poolDict: PoolDictionary, pairData: PairData[], input: Currency, output?: Currency) {
    invariant(pairData.length > 0, 'pairData')

    invariant(
      (input instanceof Token && pairData[0].involvesToken(input)) ||
      (input === NETWORK_CCY[pairData[0].chainId] && pairData[0].involvesToken(WRAPPED_NETWORK_TOKENS[pairData[0].chainId])),
      'INPUT'
    )
    invariant(
      typeof output === 'undefined' ||
      (output instanceof Token && pairData[pairData.length - 1].involvesToken(output)) ||
      (output === NETWORK_CCY[pairData[0].chainId] && pairData[pairData.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[pairData[0].chainId])),
      'OUTPUT'
    )
    const path: Token[] = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[pairData[0].chainId]]
    for (const [i, pool] of pairData.entries()) {
      const currentInput = path[i]
      invariant(currentInput.equals(pool.token0) || currentInput.equals(pool.token1), 'PATH')
      const output = currentInput.equals(pool.token0) ? pool.token1 : pool.token0
      path.push(output)
    }

    this.pairData = pairData
    this.path = path
    this.midPrice = Price.fromRoute(this, poolDict)
    this.input = input
    this.output = output ?? path[path.length - 1]
  }

  public get chainId(): ChainId {
    return this.pairData[0].chainId
  }
}
