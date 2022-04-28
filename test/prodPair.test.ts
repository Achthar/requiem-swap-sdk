import { BigNumber } from 'ethers'
import { ChainId, Token, AmplifiedWeightedPair, PairData, RouteProvider, SwapRoute, TokenAmount, Swap, SwapType } from '../src'

describe('ProdPair', () => {
  const USDC = new Token(ChainId.BSC_MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const WAVAX = new Token(ChainId.BSC_MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'WAVAX', 'WAVAX')

  const tokens = [USDC, WAVAX]
  const amounts = [BigNumber.from('108200301454'), BigNumber.from('432532629036961440363')]

  const amp = BigNumber.from(20000)
  const fee = BigNumber.from(10)
  const weight = BigNumber.from(50)
  const amountOut = BigNumber.from(1000000000)
  const inExp = BigNumber.from('4038846801353259126')
  const pair = new AmplifiedWeightedPair(tokens, amounts, amounts, weight, fee, amp)


  const poolDict = {
    [pair.address]: pair
  }

  describe('#correctPrice', () => {
    const inAm = pair.calculateSwapGivenOut(WAVAX, USDC, amountOut)
    it('calcs the correct val', () => {
      console.log("INEXP", inExp.toString(), inAm.toString())
      expect(inExp).toEqual(inAm)

    })
    it('calcs the correct val using the route', () => {
      const pairData = PairData.dataFromPools([pair])
      const result = RouteProvider.getRoutes(
        pairData,
        WAVAX,
        USDC
      )

      console.log(result.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
      console.log(result.map(r => r.path.map(p => p.symbol)))

      const agg = SwapRoute.cleanRoutes(result)
      console.log(agg.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
      console.log(agg.map(r => r.path.map(p => p.symbol)))
      const outA = new TokenAmount(USDC, amountOut)
      const swaps = Swap.PriceRoutes(agg, outA, SwapType.EXACT_OUTPUT, poolDict)


      console.log("SWAPS calced in ", swaps[0].inputAmount.toSignificant(18), "from out", (new TokenAmount(USDC, amountOut)).toSignificant(18))
      expect(inExp).toEqual( swaps[0].inputAmount.raw)

    })
  })
})
