import { BigNumber } from 'ethers'
import { ChainId, Token, AmplifiedWeightedPair } from '../src'

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
  describe('#correctPrice', () => {
    const inAm = pair.calculateSwapGivenOut(WAVAX, USDC, amountOut)
    it('calcs the correct val', () => {
      console.log("INEXP", inExp.toString(), inAm.toString())
      expect(inExp).toEqual(inAm)

    })
  })
})
