import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'
import { StablePairWrapper } from '../src/entities/stablePairWrapper'
import { SwapStorage } from '../src/entities/swapStorage'
import { StablePool } from '../src/entities/stablePool'
import { BigNumber } from 'ethers'

describe('StablePairWrapper', () => {
  const chainId = ChainId.BSC_MAINNET
  const USDC = new Token(ChainId.BSC_MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.BSC_MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  const stable0 = new Token(chainId, '0x0000000000000000000000000000000000000005', 18, 's0')
  const stable1 = new Token(chainId, '0x0000000000000000000000000000000000000006', 18, 's1')
  const stable2 = new Token(chainId, '0x0000000000000000000000000000000000000007', 18, 's2')
  const stable3 = new Token(chainId, '0x0000000000000000000000000000000000000008', 18, 's3')

  const manualSS = {
    "lpToken": '0xDf65aC8079A71f5174A35dE3D29e5458d03D5787',
    "fee": BigNumber.from('0x0f4240'),
    "adminFee": BigNumber.from('0x012a05f200'),
    "initialA": BigNumber.from('0xea60'),
    "futureA": BigNumber.from('0xea60'),
    "initialATime": BigNumber.from('0x00'),
    "futureATime": BigNumber.from('0x00'),
    "defaultWithdrawFee": BigNumber.from('0x02faf080'),
  }
  const stables = {
    0: stable0, 1: stable1, 2: stable2, 3: stable3
  }

  const balances = [BigNumber.from('1000'), BigNumber.from('1000'), BigNumber.from('1000'), BigNumber.from('1000')]

  const swapStorage = new SwapStorage(
    Object.values([stable0, stable1, stable2, stable3]).map((token) => (BigNumber.from(10)).pow(18 - token.decimals)),
    manualSS.fee,
    manualSS.adminFee,
    manualSS.initialA,
    manualSS.futureA,
    manualSS.initialATime,
    manualSS.futureATime,
    manualSS.lpToken)

  const stablePool = new StablePool(
    stables,
    balances,
    BigNumber.from('0xea60'),
    swapStorage,
    98999999999,
    BigNumber.from('4000000000000000000000'),
    BigNumber.from('0')
  )

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new StablePairWrapper(new TokenAmount(USDC, '100'), new TokenAmount(WETH[ChainId.BSC_TESTNET], '100'), 0, 1)).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new StablePairWrapper(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), 0, 1).token0).toEqual(DAI)
      expect(new StablePairWrapper(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), 0, 1).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new StablePairWrapper(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), 0, 1).token1).toEqual(USDC)
      expect(new StablePairWrapper(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), 0, 1).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new StablePairWrapper(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), 0, 1).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new StablePairWrapper(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), 0, 1).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new StablePairWrapper(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), 0, 1).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new StablePairWrapper(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), 0, 1).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#creationViaStablePoll', () => {
    const wrappedPairs = StablePairWrapper.wrapPairsFromPool(stablePool)
    it('correct amount of WrappedPairs created', () => {
      expect(wrappedPairs.length).toEqual(
        (stablePool.tokenBalances.length * stablePool.tokenBalances.length - stablePool.tokenBalances.length) / 2
      )

    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'))
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
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserveOf(WETH[ChainId.BSC_MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).chainId).toEqual(ChainId.BSC_MAINNET)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).chainId).toEqual(ChainId.BSC_MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(USDC)).toEqual(true)
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(DAI)).toEqual(true)
    expect(
      new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(WETH[ChainId.BSC_MAINNET])
    ).toEqual(false)
  })
})
