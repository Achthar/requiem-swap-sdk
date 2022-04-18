import { BigNumber } from 'ethers'
import { ChainId, Token, AmplifiedWeightedPair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const USDC = new Token(ChainId.BSC_MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.BSC_MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  const tokens = [USDC, DAI]
  const tokensF = [USDC, WETH[43113]]
  const tokens2 = [DAI, USDC]
  const amounts = [BigNumber.from(100), BigNumber.from(100)]
  const amounts1 = [BigNumber.from(100), BigNumber.from(101)]
  const amounts2 = [BigNumber.from(101), BigNumber.from(100)]
  const amp = BigNumber.from(10000)
  const fee = BigNumber.from(1)
  const weight = BigNumber.from(50)

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new AmplifiedWeightedPair(tokensF, amounts, amounts,weight, fee,amp)).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(AmplifiedWeightedPair.getAddress(USDC, DAI, fee)).toEqual('0x055c48E954361b3193Fc92aF29427FfE8eEf80Cc')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).token0).toEqual(DAI)
      expect(new AmplifiedWeightedPair(tokens2, amounts, amounts,weight, fee,amp).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).token1).toEqual(USDC)
      expect(new AmplifiedWeightedPair(tokens2, amounts, amounts,weight, fee,amp).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new AmplifiedWeightedPair(tokens2, [BigNumber.from(100), BigNumber.from(101)], amounts,weight, fee,amp).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new AmplifiedWeightedPair(tokens, [BigNumber.from(101), BigNumber.from(100)], amounts,weight, fee,amp).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new AmplifiedWeightedPair(tokens, [BigNumber.from(100), BigNumber.from(101)], amounts,weight, fee,amp).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new AmplifiedWeightedPair(tokens, [BigNumber.from(100), BigNumber.from(101)], amounts,weight, fee,amp).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
      expect(new AmplifiedWeightedPair(tokens2, amounts, amounts,weight, fee,amp).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new AmplifiedWeightedPair(tokens, amounts2, amounts2, weight, fee, amp).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
      expect(new AmplifiedWeightedPair(tokens, amounts2, amounts2, weight, fee, amp).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new AmplifiedWeightedPair(tokens, amounts2, amounts2, weight, fee, amp)
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
      expect(new AmplifiedWeightedPair(tokens, amounts, amounts, weight, fee, amp).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new AmplifiedWeightedPair(tokens, amounts1, amounts1, weight, fee, amp).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new AmplifiedWeightedPair(tokens, amounts1, amounts1, weight, fee, amp).reserveOf(WETH[ChainId.BSC_MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).chainId).toEqual(ChainId.BSC_MAINNET)
      expect(new AmplifiedWeightedPair(tokens2, amounts, amounts,weight, fee,amp).chainId).toEqual(ChainId.BSC_MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).involvesToken(USDC)).toEqual(true)
    expect(new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).involvesToken(DAI)).toEqual(true)
    expect(
      new AmplifiedWeightedPair(tokens, amounts, amounts,weight, fee,amp).involvesToken(WETH[ChainId.BSC_MAINNET])
    ).toEqual(false)
  })
})
