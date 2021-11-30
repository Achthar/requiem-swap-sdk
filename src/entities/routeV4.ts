import { ChainId } from '../constants'
import invariant from 'tiny-invariant'
import { Pool } from './pool'
import { Currency, NETWORK_CCY } from './currency'
import { Token, WRAPPED_NETWORK_TOKENS } from './token'
import { Price } from './fractions/price'
import { StablePool } from './stablePool'
import { StablePairWrapper } from './stablePairWrapper'

// new version of the route 
// the first verion to include the stable pool for less friction
export class RouteV4 {
  public readonly stablePool: StablePool
  public readonly pools: Pool[]
  public readonly path: Token[]
  public readonly input: Currency
  public readonly output: Currency
  public readonly midPrice: Price
  public readonly pathMatrix: Token[][]
  public readonly routerIds: number[]

  public constructor(pools: Pool[], stablePool: StablePool, input: Currency, output?: Currency) {
    invariant(pools.length > 0, 'poolS')
    invariant(
      pools.every(pool => pool.chainId === pools[0].chainId),
      'CHAIN_IDS'
    )
    invariant(
      (input instanceof Token && pools[0].involvesToken(input)) ||
      (input === NETWORK_CCY[pools[0].chainId] && pools[0].involvesToken(WRAPPED_NETWORK_TOKENS[pools[0].chainId])),
      'INPUT'
    )
    invariant(
      typeof output === 'undefined' ||
      (output instanceof Token && pools[pools.length - 1].involvesToken(output)) ||
      (output === NETWORK_CCY[pools[0].chainId] && pools[pools.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[pools[0].chainId])),
      'OUTPUT'
    )

    const path: Token[] = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[pools[0].chainId]]
    for (const [i, pool] of pools.entries()) {
      const currentInput = path[i]
      invariant(currentInput.equals(pool.token0) || currentInput.equals(pool.token1), 'PATH')
      const output = currentInput.equals(pool.token0) ? pool.token1 : pool.token0
      path.push(output)
    }
    this.stablePool = stablePool
    this.pools = pools
    this.path = path
    this.midPrice = Price.fromRouteV4(this)
    this.input = input
    this.output = output ?? path[path.length - 1]

    // generate new inputs for aggregator 

    const pathMatrix: Token[][] = []
    const routerIds: number[] = []
    let currentInput = this.path[0]
    let currentRouterId: number = -1
    let lastRouterId: number = -1
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i]
      currentRouterId = pools[i] instanceof StablePairWrapper ? 0 : 1
      invariant(currentInput.equals(pool.token0) || currentInput.equals(pool.token1), 'PATH')
      const output = currentInput.equals(pool.token0) ? pool.token1 : pool.token0

      if (i === 0) {
        pathMatrix.push([currentInput, output])
        routerIds.push(pool instanceof StablePairWrapper ? 0 : 1)
      }
      else {
        if (pool instanceof StablePairWrapper) { // current item is stablePool
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
    return this.pools[0].chainId
  }
}
