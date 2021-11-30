import { ChainId, Token, WeightedPair, TokenAmount, WETH, Price } from '../src'
import JSBI from 'jsbi'
import {power} from '../src/entities/weightedPairCalcJSBI'

describe('_WeightedPairCalc', () => {
  const USDC = new Token(ChainId.BSC_MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.BSC_MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const weightA = JSBI.BigInt('44')
  const fee = JSBI.BigInt('14')
  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(WETH[ChainId.BSC_TESTNET], '100'), weightA, fee)).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(WeightedPair.getAddress(USDC, DAI, weightA, fee)).toEqual('0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).token0).toEqual(DAI)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).token1).toEqual(USDC)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), weightA, fee).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), weightA, fee).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'), weightA, fee).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101'), weightA, fee).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'), weightA, fee).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101'), weightA, fee).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new WeightedPair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'), weightA, fee)
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.BSC_MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), weightA, fee).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserveOf(WETH[ChainId.BSC_MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).chainId).toEqual(ChainId.BSC_MAINNET)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).chainId).toEqual(ChainId.BSC_MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(USDC)).toEqual(true)
    expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(DAI)).toEqual(true)
    expect(
      new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(WETH[ChainId.BSC_MAINNET])
    ).toEqual(false)
  })

  describe('#calcualtes', () => {
    const weight50 = JSBI.BigInt(50)
    const fee20 = JSBI.BigInt(2)
    const pair = new WeightedPair(new TokenAmount(USDC, '10000'), new TokenAmount(DAI, '10000'), weight50, fee20)
    const amountIn = new TokenAmount(DAI, '12')
    console.log("In1: ", amountIn.raw.toString())
    const [out,] = pair.getOutputAmount(amountIn)
    console.log("Out1: ", out.raw.toString())

    const weight20 = JSBI.BigInt(20)
    const fee10 = JSBI.BigInt(10)
    const uu = power(JSBI.BigInt(12213),JSBI.BigInt(213), JSBI.BigInt(32), JSBI.BigInt(12))
    const uu1 = power(JSBI.BigInt(8000),JSBI.BigInt(200), JSBI.BigInt(4), JSBI.BigInt(2))
    console.log("power", uu.toString(), uu1.toString())
    console.log("TST JSBI", JSBI.leftShift(weight50, JSBI.BigInt(4)), JSBI.multiply(weight50, JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(4))))
    const pair2 = new WeightedPair(new TokenAmount(USDC, '10000000'), new TokenAmount(DAI, '10000000'), weight20, fee10)
    const amountIn2 = new TokenAmount(DAI, '1782')
    console.log("In1: ", amountIn2.raw.toString())
    const [out2,] = pair2.getOutputAmount(amountIn2)
    console.log("Out1: ", out2.raw.toString())
    // new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee)

    //   new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee)


  })
})
