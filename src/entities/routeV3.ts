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
  public readonly sources: (Pair | StablePairWrapper)[]
  public readonly path: Token[]
  public readonly input: Currency
  public readonly output: Currency
  public readonly midPrice: Price
  public readonly pathMatrix: Token[][]
  public readonly routerIds: number[]

  public constructor(sources: (Pair | StablePairWrapper)[], stablePool: StablePool, input: Currency, output?: Currency) {
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

    // generate new inputs for aggregator 

    const pathMatrix: Token[][] = []
    const routerIds: number[] = []
    let currentInput = this.path[0]
    let currentRouterId: number = -1
    let lastRouterId: number = -1
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]
      currentRouterId = sources[i] instanceof StablePairWrapper ? 0 : 1
      invariant(currentInput.equals(source.token0) || currentInput.equals(source.token1), 'PATH')
      const output = currentInput.equals(source.token0) ? source.token1 : source.token0

      if (i === 0) {
        pathMatrix.push([currentInput, output])
        routerIds.push(source instanceof StablePairWrapper ? 0 : 1)
      }
      else {
        if (source instanceof StablePairWrapper) { // current item is stablePool
          pathMatrix.push([currentInput, output])
          routerIds.push(0)
        }
        else { // current item is a pair
          if (lastRouterId === 0) {
            pathMatrix.push([currentInput, output])
            routerIds.push(1)
          } else {
            pathMatrix[pathMatrix.length - 1].push(output)
          }
        }
      }
      currentInput = output
      lastRouterId = currentRouterId
    }

    this.pathMatrix = pathMatrix
    this.routerIds = routerIds
  }

  public get chainId(): ChainId {
    return this.sources[0].chainId
  }
}
