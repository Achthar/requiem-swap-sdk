import { ChainId, Token, WeightedPair, TokenAmount, WETH, Price } from '../src'
import {
  //  getAmountIn, 
  //  getAmountOut,
  power,
  generalLog,
  generalExp,
  optimalExp,
  optimalLog
} from '../src/entities/weightedPairCalc'
import JSBI from 'jsbi'
import { BigNumber } from '@ethersproject/bignumber'

describe('WeightedPair', () => {
  const USDC = new Token(ChainId.AVAX_TESTNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.AVAX_TESTNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
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
      expect(() => pair.priceOf(WETH[ChainId.AVAX_TESTNET])).toThrow('TOKEN')
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
        new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserveOf(WETH[ChainId.AVAX_TESTNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).chainId).toEqual(ChainId.AVAX_TESTNET)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).chainId).toEqual(ChainId.AVAX_TESTNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(USDC)).toEqual(true)
    expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(DAI)).toEqual(true)
    expect(
      new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(WETH[ChainId.AVAX_TESTNET])
    ).toEqual(false)
  })

  describe('#calcualtes', () => {
    const weight50 = JSBI.BigInt(50)
    const fee20 = JSBI.BigInt(2)
    const pair = new WeightedPair(new TokenAmount(USDC, '100000000000'), new TokenAmount(DAI, '100000000000'), weight50, fee20)
    const amountIn = new TokenAmount(DAI, '20000')
    console.log("In1: ", amountIn.raw.toString())
    const [out,] = pair.getOutputAmount(amountIn)
    console.log("Out1: ", out.raw.toString())

    const weight20 = JSBI.BigInt(52)
    const fee10 = JSBI.BigInt(10)

    // console.log("TST JSBI", JSBI.leftShift(weight50, JSBI.BigInt(4)), JSBI.multiply(weight50, JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(4))))
    const pair2 = new WeightedPair(new TokenAmount(USDC, '100000000000'), new TokenAmount(DAI, '100000000000'), weight20, fee10)
    const amountIn2 = new TokenAmount(USDC, '200234500')
    console.log("In2: ", amountIn2.raw.toString())
    const [out2,] = pair2.getOutputAmount(amountIn2)
    console.log("Out2: ", out2.raw.toString())

    const [in1,] = pair2.getInputAmount(new TokenAmount(DAI, '216253170'))
    console.log("in: ", in1.raw.toString())
    const bN = BigNumber.from(120000)
    const bD = BigNumber.from(10000)
    console.log("div", bN.div(bD).toString())
    const eN = BigNumber.from(48)
    const eD = BigNumber.from(52)
    console.log("exp", eN.div(eD).toString())
    console.log("manual", (bN.div(bD)).pow(eN.div(eD)).toString())
    console.log("power", power(bN, bD, eN, eD).toString())
    console.log("glog", generalLog(BigNumber.from('21323433243224523433243242332432433435433')).toString())
    console.log("gexp", generalExp(BigNumber.from('2353'),BigNumber.from(6)).toString())
    console.log("olog", optimalLog(BigNumber.from('17014118346046923173168730371588410572824324432')).toString())
    console.log("oexp", optimalExp(BigNumber.from('2353')).toString())
    // new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee)

    //   new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee)


  })
})
