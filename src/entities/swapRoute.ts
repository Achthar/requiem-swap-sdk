import { ChainId } from './currency'
import { Token } from './token'
import { SwapData } from './pools/swapData'



// new version of the route 
// the first verion to include the stable pool for less friction
export class SwapRoute {
  public readonly swapData: SwapData[]
  public readonly path: Token[]
  public readonly input: Token
  public readonly output: Token
  public readonly identifier: string
  // public readonly midPrice: Price

  public constructor(swapData: SwapData[]) {

    const path: Token[] = [swapData[0].tokenIn]

    // it can happen that the pool is traded through consecutively, we want to remove this case 
    const swapDataAggregated = []
    for (let i = 0; i < swapData.length; i++) {
      let currentSwap = swapData[i]
      const tokenIn = currentSwap.tokenIn
      let relevantOut = currentSwap.tokenOut
      for (let j = i + 1; j < swapData.length; j++) {
        if (swapData[j].poolRef === currentSwap.poolRef) {
          currentSwap = swapData[j]
          relevantOut = currentSwap.tokenOut
          i++
        } else {
          break;
        }
      }
      const swap = new SwapData(tokenIn, relevantOut, currentSwap.poolRef)
      swapDataAggregated.push(swap)
      // const currentInput = path[i]
      // invariant(currentInput.equals(currentSwap.tokenIn), 'PATH')
      const output = currentSwap.tokenOut
      path.push(output)
    }


    this.swapData = swapDataAggregated

    this.identifier = swapDataAggregated.map(x => x.poolRef).join('') + path.map(p => p.address).join('')
    this.path = path
    // this.midPrice = Price.fromRoute(this, poolDict)
    this.input = path[0]
    this.output = path[path.length - 1]
  }

  public get chainId(): ChainId {
    return this.swapData[0].chainId
  }

  public equals(otherRoute: SwapRoute): boolean {
    for (let i = 0; i < this.swapData.length; i++) {
      if (!this.swapData[i].tokenIn.equals(otherRoute.swapData[i].tokenIn) && !this.swapData[i].tokenOut.equals(otherRoute.swapData[i].tokenOut) && !(this.swapData[i].poolRef === otherRoute.swapData[i].poolRef))
        return false
    }
    return true
  }

  public static cleanRoutes(swapRoutes: SwapRoute[]): SwapRoute[] {
    var routeIds: string[] = []
    var routes: SwapRoute[] = []
    for (var i = 0; i < swapRoutes.length; i++) {
      if (!routeIds.includes(swapRoutes[i].identifier)) {
        routeIds.push(swapRoutes[i].identifier)
        routes.push(swapRoutes[i])
      }
    }
    return routes
  }

}
