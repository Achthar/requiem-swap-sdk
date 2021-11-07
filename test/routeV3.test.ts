import { Token, ChainId, Pair, TokenAmount, NETWORK_CCY, WRAPPED_NETWORK_TOKENS } from '../src'

import { StablePool } from '../src/entities/stablePool'
import { SwapStorage } from '../src/entities/swapStorage'
import { StablePairWrapper } from '../src/entities/stablePairWrapper'
import { RouteV3 } from '../src/entities/routeV3'
import { BigNumber } from 'ethers'

describe('RouteV3', () => {
  const chainId = ChainId.BSC_MAINNET
  const token0 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
  const token2 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000007', 18, 't2')

  const stable0 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000003', 18, 's0')
  const stable1 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000004', 18, 's1')
  const stable2 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000005', 18, 's2')
  const stable3 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000006', 18, 's3')

  const weth = WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET]

  const pair_t0_t1 = new Pair(new TokenAmount(token0, '100'), new TokenAmount(token1, '200'))

  const pair_t1_s0 = new Pair(new TokenAmount(token1, '100'), new TokenAmount(stable0, '200'))
  const pair_t1_t2 = new Pair(new TokenAmount(token1, '100'), new TokenAmount(token2, '200'))
  const pair_t2_s0 = new Pair(new TokenAmount(token2, '100'), new TokenAmount(stable0, '200'))

  const pair_s1_t0 = new Pair(new TokenAmount(stable1, '100'), new TokenAmount(token0, '200'))

  // const pair_t0_s0 = new Pair(new TokenAmount(token0, '100'), new TokenAmount(stable0, '200'))

  const pair_s0_s1 = new StablePairWrapper(new TokenAmount(stable0, '100'), new TokenAmount(stable1, '200'), 0, 1)

  const pair_s0_weth = new Pair(new TokenAmount(stable0, '100'), new TokenAmount(weth, '100'))
  const pair_s1_weth = new Pair(new TokenAmount(stable1, '175'), new TokenAmount(weth, '100'))

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

  const balances = [BigNumber.from('1000000000000000000000'), BigNumber.from('1000000000000000000000'), BigNumber.from('1000000000000000000000'), BigNumber.from('1000000000000000000000')]

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


  it('constructs a path from the tokens', () => {
    const route = new RouteV3([pair_t0_t1], stablePool, token0)
    expect(route.sources).toEqual([pair_t0_t1])
    expect(route.path).toEqual([token0, token1])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(token1)
    expect(route.chainId).toEqual(ChainId.BSC_MAINNET)
  })

  it('can have a token as both input and output', () => {
    const route = new RouteV3([pair_s0_weth, pair_s0_s1, pair_s1_weth], stablePool, weth)
    expect(route.sources).toEqual([pair_s0_weth, pair_s0_s1, pair_s1_weth])
    expect(route.input).toEqual(weth)
    expect(route.output).toEqual(weth)
    console.log("----routes ----")
    for (let j = 0; j < route.pathMatrix.length; j++) {
      console.log(route.routerIds[j], route.pathMatrix[j].map(token => token.symbol))
    }
  })


  it('supports multiple pairs mixed withg stable', () => {
    const route = new RouteV3([pair_s0_weth, pair_t1_s0, pair_t1_t2, pair_t2_s0, pair_s0_s1, pair_s1_t0], stablePool, weth)
    // expect(route.sources).toEqual([pair_s0_weth, pair_s0_s1, pair_s1_weth])
    expect(route.input).toEqual(weth)
    expect(route.output).toEqual(token0)

    console.log("----routes long test----")
    for (let j = 0; j < route.pathMatrix.length; j++) {
      console.log(route.routerIds[j], route.pathMatrix[j].map(token => token.symbol))
    }
  })


  it('supports ether input', () => {
    const route = new RouteV3([pair_s0_weth], stablePool, NETWORK_CCY[chainId])
    expect(route.sources).toEqual([pair_s0_weth as (Pair | StablePairWrapper)])
    expect(route.input).toEqual(NETWORK_CCY[chainId])
    expect(route.output).toEqual(stable0)
  })

  it('supports ether output', () => {
    const route = new RouteV3([pair_s0_weth], stablePool, stable0, NETWORK_CCY[chainId])
    expect(route.sources).toEqual([pair_s0_weth])
    expect(route.input).toEqual(stable0)
    expect(route.output).toEqual(NETWORK_CCY[chainId])
  })
})
