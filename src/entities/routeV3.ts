import { ChainId } from '../constants'
import invariant from 'tiny-invariant'

import { Currency, NETWORK_CCY } from './currency'
import { Token, WRAPPED_NETWORK_TOKENS } from './token'
import { Pair } from './pair'
import { Price } from './fractions/price'
import { StablePool } from './stablePool'
import { StablePairWrapper } from './stablePairWrapper'

// new version of the route 
// the first verion to include the stable pool for less friction
export class RouteV3 {
  public readonly stablePool: StablePool
  public readonly sources: (Pair|StablePairWrapper)[]
  public readonly path: Token[]
  public readonly input: Currency
  public readonly output: Currency
  public readonly midPrice: Price

  public constructor(sources: (Pair|StablePairWrapper)[], stablePool: StablePool, input: Currency, output?: Currency) {
    invariant(sources.length > 0, 'SOURCES')
    invariant(
      sources.every(source => source.chainId === sources[0].chainId),
      'CHAIN_IDS'
    )
    invariant(
      (input instanceof Token && sources[0].involvesToken(input)) ||
      (input === NETWORK_CCY[sources[0].chainId] && sources[0].involvesToken(WRAPPED_NETWORK_TOKENS[sources[0].chainId])),
      'INPUT'
    )
    invariant(
      typeof output === 'undefined' ||
      (output instanceof Token && sources[sources.length - 1].involvesToken(output)) ||
      (output === NETWORK_CCY[sources[0].chainId] && sources[sources.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[sources[0].chainId])),
      'OUTPUT'
    )

    const path: Token[] = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[sources[0].chainId]]
    for (const [i, source] of sources.entries()) {
      const currentInput = path[i]
      invariant(currentInput.equals(source.token0) || currentInput.equals(source.token1), 'PATH')
      const output = currentInput.equals(source.token0) ? source.token1 : source.token0
      path.push(output)
    }
    this.stablePool = stablePool
    this.sources = sources
    this.path = path
    this.midPrice = Price.fromRouteV3(this)
    this.input = input
    this.output = output ?? path[path.length - 1]
  }

  public get chainId(): ChainId {
    return this.sources[0].chainId
  }
}
