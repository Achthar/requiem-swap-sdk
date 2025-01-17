// import JSBI from 'jsbi'
// import {
//   ChainId,
//   CurrencyAmount,
//   Percent,
//   Token,
//   TokenAmount,
//   TradeType,
// } from '../src'

// import { WRAPPED_NETWORK_TOKENS } from '../src/entities/token'
// import { NETWORK_CCY } from '../src/entities/currency'
// import { StablePool } from '../src/entities/pools/stable/stablePool'
// import { SwapStorage } from '../src/entities/calculators/swapStorage'
// import { StablePairWrapper } from '../src/entities/pools/stable/stablePairWrapper'
// import { AmplifiedWeightedPair } from '../src/entities/pools/weightedPair/amplifiedWeightedPair'
// import { RouteV4 } from '../src/entities/routeV4'
// import { BigNumber } from 'ethers'
// import { TradeV4 } from '../src/entities/tradeV4'


// describe('TradeV4', () => {

//   const chainId = ChainId.AVAX_TESTNET
//   const token0 = new Token(chainId, '0x0000000000000000000000000000000000000001', 18, 't0')
//   const token1 = new Token(chainId, '0x0000000000000000000000000000000000000002', 18, 't1')
//   const token2 = new Token(chainId, '0x0000000000000000000000000000000000000003', 18, 't2')
//   const token3 = new Token(chainId, '0x0000000000000000000000000000000000000004', 18, 't3')

//   const pair_t0_t1 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token1, BigNumber.from(1000)))
//   const pair_t0_t2 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token2, BigNumber.from(1100)))
//   const pair_t0_t3 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token3, BigNumber.from(900)))
//   const pair_t1_t2 = new Pair(new TokenAmount(token1, BigNumber.from(1200)), new TokenAmount(token2, BigNumber.from(1000)))
//   const pair_t1_t3 = new Pair(new TokenAmount(token1, BigNumber.from(1200)), new TokenAmount(token3, BigNumber.from(1300)))

//   const pair_weth_0 = new Pair(
//     new TokenAmount(WRAPPED_NETWORK_TOKENS[chainId], BigNumber.from(1000)),
//     new TokenAmount(token0, BigNumber.from(1000))
//   )


//   const stable0 = new Token(chainId, '0x0000000000000000000000000000000000000005', 18, 's0')
//   const stable1 = new Token(chainId, '0x0000000000000000000000000000000000000006', 18, 's1')
//   const stable2 = new Token(chainId, '0x0000000000000000000000000000000000000007', 18, 's2')
//   const stable3 = new Token(chainId, '0x0000000000000000000000000000000000000008', 18, 's3')



//   const manualSS = {
//     "lpToken": '0xDf65aC8079A71f5174A35dE3D29e5458d03D5787',
//     "fee": BigNumber.from('0x0f4240'),
//     "adminFee": BigNumber.from('0x012a05f200'),
//     "initialA": BigNumber.from('0xea60'),
//     "futureA": BigNumber.from('0xea60'),
//     "initialATime": BigNumber.from('0x00'),
//     "futureATime": BigNumber.from('0x00'),
//     "defaultWithdrawFee": BigNumber.from('0x02faf080'),
//   }
//   const stables = {
//     0: stable0, 1: stable1, 2: stable2, 3: stable3
//   }

//   const balances = [BigNumber.from('1000'), BigNumber.from('1000'), BigNumber.from('1000'), BigNumber.from('1000')]

//   const swapStorage = new SwapStorage(
//     Object.values([stable0, stable1, stable2, stable3]).map((token) => (BigNumber.from(10)).pow(18 - token.decimals)),
//     manualSS.fee,
//     manualSS.adminFee,
//     manualSS.initialA,
//     manualSS.futureA,
//     manualSS.initialATime,
//     manualSS.futureATime,
//     manualSS.lpToken)

//   const stablePool = new StablePool(
//     stables,
//     balances,
//     BigNumber.from('0xea60'),
//     swapStorage,
//     98999999999,
//     BigNumber.from('4000000000000000000000'),
//     BigNumber.from('0')
//   )



//   // const pair_t0_s0 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(stable0, BigNumber.from(1000)))
//   const pair_t0_s1 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(stable1, BigNumber.from(1100)))

//   const pair_t0_s1_w = new AmplifiedWeightedPair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(stable1, BigNumber.from(1100)), BigNumber.from(40), BigNumber.from(15))
//   // const pair_s0_s1 = new StablePairWrapper(new TokenAmount(stable0, BigNumber.from(1000)), new TokenAmount(stable1, BigNumber.from(900)), 0, 1)
//   // const pair_s1_t2 = new Pair(new TokenAmount(stable1, BigNumber.from(1200)), new TokenAmount(token2, BigNumber.from(1000)))
//   // const pair_t2_t3 = new Pair(new TokenAmount(token2, BigNumber.from(1200)), new TokenAmount(token3, BigNumber.from(1300)))
//   // const pair_s1_s3 = new StablePairWrapper(new TokenAmount(stable1, BigNumber.from(1000)), new TokenAmount(stable3, BigNumber.from(900)), 1, 3)
//   // const pair_s1_s2 = new StablePairWrapper(new TokenAmount(stable1, BigNumber.from(1000)), new TokenAmount(stable2, BigNumber.from(900)), 1, 2)
//   const pair_s2_t2 = new Pair(new TokenAmount(stable2, BigNumber.from(1000)), new TokenAmount(token2, BigNumber.from(1100)))

//   const pair_s0_s1 = StablePairWrapper.wrapSinglePairFromPool(stablePool, 0, 1)
//   const pair_s1_s2 = StablePairWrapper.wrapSinglePairFromPool(stablePool, 1, 2)
//   const pair_s0_s2 = StablePairWrapper.wrapSinglePairFromPool(stablePool, 0, 2)

//   const empty_pair_0_1 = new Pair(new TokenAmount(token0, BigNumber.from(0)), new TokenAmount(token1, BigNumber.from(0)))

//   it('can be constructed with NETWORK_CCY[chainId] as input', () => {
//     const trade = new TradeV4(
//       new RouteV4([pair_weth_0], stablePool.clone(), NETWORK_CCY[chainId]),
//       CurrencyAmount.networkCCYAmount(chainId, BigNumber.from(100)),
//       TradeType.EXACT_INPUT
//     )

//     expect(trade.inputAmount.currency).toEqual(NETWORK_CCY[chainId])
//     expect(trade.outputAmount.currency).toEqual(token0)
//   })
//   it('can be constructed with NETWORK_CCY[chainId] as input for exact output', () => {
//     const trade = new TradeV4(
//       new RouteV4([pair_weth_0], stablePool.clone(), NETWORK_CCY[chainId], token0),
//       new TokenAmount(token0, BigNumber.from(100)),
//       TradeType.EXACT_OUTPUT
//     )

//     expect(trade.inputAmount.currency).toEqual(NETWORK_CCY[chainId])
//     expect(trade.outputAmount.currency).toEqual(token0)
//   })

//   it('can be constructed with NETWORK_CCY[chainId] as output', () => {
//     const trade = new TradeV4(
//       new RouteV4([pair_weth_0], stablePool, token0, NETWORK_CCY[chainId]),
//       CurrencyAmount.networkCCYAmount(chainId, BigNumber.from(100)),
//       TradeType.EXACT_OUTPUT
//     )
//     expect(trade.inputAmount.currency).toEqual(token0)
//     expect(trade.outputAmount.currency).toEqual(NETWORK_CCY[chainId])
//   })
//   it('can be constructed with NETWORK_CCY[chainId] as output for exact input', () => {
//     const trade = new TradeV4(
//       new RouteV4([pair_weth_0], stablePool, token0, NETWORK_CCY[chainId]),
//       new TokenAmount(token0, BigNumber.from(100)),
//       TradeType.EXACT_INPUT
//     )
//     expect(trade.inputAmount.currency).toEqual(token0)
//     expect(trade.outputAmount.currency).toEqual(NETWORK_CCY[chainId])
//   })

//   describe('#bestTradeExactIn', () => {
//     it('throws with empty pools', () => {
//       expect(() => TradeV4.bestTradeExactIn(stablePool, [], new TokenAmount(token0, BigNumber.from(100)), token2)).toThrow('PAIRS')
//     })
//     it('throws with max hops of 0', () => {
//       expect(() =>
//         TradeV4.bestTradeExactIn(stablePool, [pair_t0_t2], new TokenAmount(token0, BigNumber.from(100)), token2, { maxHops: 0 })
//       ).toThrow('MAX_HOPS')
//     })

//     it('provides best route', () => {
//       console.log('-----provides best route-----')
//       console.log("stable balances before", stablePool.tokenBalances.map(value => value.toBigInt()))
//       // console.log("PAIRS1S2 before", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       console
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,

//         [pair_t0_s1, pair_s1_s2, pair_s2_t2, pair_t0_t2],
//         new TokenAmount(token0, BigNumber.from(100)),
//         token2
//       )
//       console.log("stable balances after", stablePool.tokenBalances.map(value => value.toBigInt()))

//       // console.log("PAIRS1S2 afters", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))

//       const dummyStablePool = stablePool.clone()

//       const [s1Amount,] = pair_t0_s1.getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))
//       console.log("obtained s1 from s0", s1Amount.raw)
//       const [s2Amount,] = pair_s1_s2.getOutputAmount(s1Amount, dummyStablePool)
//       console.log("obtained s2 from s1", s2Amount.raw)
//       const [t2Amount,] = pair_s2_t2.getOutputAmount(s2Amount)
//       console.log("obtained t2 from s2", t2Amount.raw)

//       const s2AmountTest = stablePool.clone().getOutputAmount(s1Amount, 2)
//       console.log("T2 through stablePool direct test", s2AmountTest.raw)

//       const [t2AmountDirect,] = pair_t0_t2.getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))

//       // console.log("PAIRS1S2", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       console.log("T2 through stablePool", t2Amount.raw) // should be 99
//       console.log("T2 via Pair", t2AmountDirect.raw) // should be 99
//       console.log("-- Wrapped pair calc for S2", s2Amount.raw)
//       console.log("-- direct SP calc for S2", stablePool.clone().getOutputAmount(s1Amount, 2).raw)
//       console.log("result0", result[0].outputAmount.raw)
//       console.log("result1", result[1].outputAmount.raw)
//       // console.log('provides best route result', result)
//       expect(result).toHaveLength(2)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//       expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
//       expect(result[0].outputAmount).toEqual(new TokenAmount(token2, t2AmountDirect.raw))
//       expect(result[1].route.pools).toHaveLength(3) // 0 -> 1 -> 2 at 12:12:10
//       expect(result[1].route.path).toEqual([token0, stable1, stable2, token2])
//       expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
//       expect(result[1].outputAmount).toEqual(t2Amount)

//     })

//     it('provides best route with weightedPair', () => {
//       console.log('-----provides best route  WEIGHTED PAIR exact in-----')
//       // console.log("stable balances before", stablePool.tokenBalances.map(value => value.toBigInt()))
//       // console.log("PAIRS1S2 before", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       const pools = [pair_t0_s1_w.clone(), pair_s1_s2, pair_s2_t2, pair_t0_t2]
//       console.log("PS", pools)
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         pools,
//         new TokenAmount(token0, BigNumber.from(100)),
//         token2
//       )
//       // console.log("stable balances after", stablePool.tokenBalances.map(value => value.toBigInt()))

//       // console.log("PAIRS1S2 afters", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))

//       const dummyStablePool = stablePool.clone()

//       const [s1Amount1,] = (pair_t0_s1_w.clone() as any as Pair).getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))
//       console.log("obtained s1 from t0 regular pair", s1Amount1.raw)
//       const [s1Amount,] = (pair_t0_s1_w).clone().getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))
//       console.log("obtained s1 from t0", s1Amount.raw)
//       const [s2Amount,] = pair_s1_s2.getOutputAmount(s1Amount, dummyStablePool)
//       console.log("obtained s2 from s1", s2Amount.raw)
//       const [t2Amount,] = pair_s2_t2.getOutputAmount(s2Amount)
//       console.log("obtained t2 from s2", t2Amount.raw)

//       const s2AmountTest = stablePool.clone().getOutputAmount(s1Amount, 2)
//       console.log("T2 through stablePool direct test", s2AmountTest.raw)

//       const [t2AmountDirect,] = pair_t0_t2.getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))

//       // console.log("PAIRS1S2", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       console.log("T2 through stablePool", t2Amount.raw) // should be 99
//       console.log("T2 via Pair", t2AmountDirect.raw) // should be 99
//       console.log("-- Wrapped pair calc for S2", s2Amount.raw)
//       console.log("-- direct SP calc for S2", stablePool.clone().getOutputAmount(s1Amount, 2).raw)
//       console.log("result0", result[0].outputAmount.raw)
//       console.log("result1", result[1].outputAmount.raw)
//       // console.log('provides best route result', result)
//       expect(result).toHaveLength(2)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//       expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
//       expect(result[0].outputAmount).toEqual(new TokenAmount(token2, t2AmountDirect.raw))
//       expect(result[1].route.pools).toHaveLength(3) // 0 -> 1 -> 2 at 12:12:10
//       expect(result[1].route.path).toEqual([token0, stable1, stable2, token2])
//       expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
//       expect(result[1].outputAmount).toEqual(t2Amount)

//     })

//     it('provides best route with single weightedPair', () => {
//       console.log('-----provides best route  SINGLE WEIGHTED PAIR-----')
//       // console.log("stable balances before", stablePool.tokenBalances.map(value => value.toBigInt()))
//       // console.log("PAIRS1S2 before", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       const pools = [pair_t0_s1_w.clone()]
//       console.log("PS", pools)
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         pools,
//         new TokenAmount(token0, BigNumber.from(100)),
//         stable1
//       )
//       // console.log("stable balances after", stablePool.tokenBalances.map(value => value.toBigInt()))

//       // console.log("PAIRS1S2 afters", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))

//       // const dummyStablePool = stablePool.clone()

//       const [s1Amount1,] = (pair_t0_s1_w.clone() as any as Pair).getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))
//       console.log("obtained s1 from t0 regular pair", s1Amount1.raw)
//       const [s1Amount,] = (pair_t0_s1_w).getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))
//       console.log("obtained s1 from t0", s1Amount.raw)
//       const [s1Amount2,] = (pair_t0_s1_w).getOutputAmount(new TokenAmount(token0, BigNumber.from(100)))
//       console.log("obtained s1 from t0 after first ee", s1Amount2.raw)



//       console.log("result0", result[0].outputAmount.raw)
//       // console.log("result1", result[1].outputAmount.raw)
//       // console.log('provides best route result', result)
//       expect(result).toHaveLength(1)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, stable1])
//       expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
//       expect(result[0].outputAmount).toEqual(new TokenAmount(stable1, s1Amount1.raw))
//       // expect(result[1].route.pools).toHaveLength(3) // 0 -> 1 -> 2 at 12:12:10
//       // expect(result[1].route.path).toEqual([token0, stable1, stable2, token2])
//       // expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
//       // expect(result[1].outputAmount).toEqual(t2Amount)

//     })


//     it('respects stables only', () => {
//       console.log('-----respects stables only-----')
//       console.log("stable balances before", stablePool.tokenBalances.map(value => value.toBigInt()))
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,

//         [pair_s0_s1, pair_s1_s2, pair_s0_s2],
//         new TokenAmount(stable0, BigNumber.from(100)),
//         stable2
//       )
//       console.log("stable balances after", stablePool.tokenBalances.map(value => value.toBigInt()))
//       const dummyStablePool = stablePool.clone()
//       console.log("dummystable balances before", dummyStablePool.tokenBalances.map(value => value.toBigInt()))
//       const [s1Amount,] = pair_s0_s1.getOutputAmount(new TokenAmount(stable0, BigNumber.from(100)), dummyStablePool)
//       console.log("s1 amount obtained", s1Amount.raw)
//       console.log("dummystable balances mid", dummyStablePool.tokenBalances.map(value => value.toBigInt()))
//       const [s2Amount,] = pair_s1_s2.getOutputAmount(s1Amount, dummyStablePool)
//       console.log("s2 amount obtained", s2Amount.raw)
//       console.log("dummy balances after", dummyStablePool.tokenBalances.map(value => value.toBigInt()))

//       console.log("manual calculation 2 trade", s2Amount.raw, result[0].outputAmount.raw)
//       // const [amountManual,] = pair_s0_s2.getOutputAmount(new TokenAmount(stable0, BigNumber.from(100)), stablePool)
//       // console.log("wow", amountManual.raw, result[0].outputAmount.raw)
//       console.log("manual calculation 1 trade", stablePool.clone().getOutputAmount(new TokenAmount(stable0, BigNumber.from(100)), 2).raw)
//       console.log("trade calculation 2 trades", result[0].outputAmount.raw)
//       // console.log("trade calculation 2 trades other", result[1].outputAmount.raw)
//       // console.log("manualT2 n", s3AmountBad) // should be 98
//       expect(result).toHaveLength(1)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 1 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([stable0, stable2])
//       expect(result[0].inputAmount).toEqual(new TokenAmount(stable0, BigNumber.from(100)))
//       expect(result[0].outputAmount).toEqual(stablePool.clone().getOutputAmount(new TokenAmount(stable0, BigNumber.from(100)), 2))
//       // expect(result[1].route.pools).toHaveLength(1) // 0 -> 2 at 12:12:10
//       // expect(result[1].route.path).toEqual([stable0, stable2])
//       // expect(result[1].inputAmount).toEqual(new TokenAmount(stable0, BigNumber.from(100)))
//       // expect(result[1].outputAmount).toEqual(stablePool.clone().getOutputAmount(new TokenAmount(stable0, BigNumber.from(100)), 2))
//     })


//     it('doesnt throw for zero liquidity pools', () => {
//       expect(TradeV4.bestTradeExactIn(stablePool, [empty_pair_0_1], new TokenAmount(token0, BigNumber.from(100)), token1)).toHaveLength(
//         0
//       )
//     })

//     it('respects maxHops', () => {
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         [pair_t0_s1, pair_s1_s2, pair_s2_t2, pair_t0_t2],
//         new TokenAmount(token0, BigNumber.from(10)),
//         token2,
//         { maxHops: 1 }
//       )
//       expect(result).toHaveLength(1)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//     })

//     it('insufficient input for one pair', () => {
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         new TokenAmount(token0, BigNumber.from(1)),
//         token2
//       )
//       expect(result).toHaveLength(1)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//       expect(result[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(1)))
//     })

//     it('respects n', () => {
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         new TokenAmount(token0, BigNumber.from(10)),
//         token2,
//         { maxNumResults: 1 }
//       )

//       expect(result).toHaveLength(1)
//     })

//     it('no path', () => {
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         [pair_t0_t1, pair_t0_t3, pair_t1_t3],
//         new TokenAmount(token0, BigNumber.from(10)),
//         token2
//       )
//       expect(result).toHaveLength(0)
//     })

//     it('works for NETWORK_CCY[chainId] currency input', () => {
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         [pair_weth_0, pair_t0_t1, pair_t0_t3, pair_t1_t3],
//         CurrencyAmount.networkCCYAmount(chainId, BigNumber.from(100)),
//         token3
//       )
//       expect(result).toHaveLength(2)
//       expect(result[0].inputAmount.currency).toEqual(NETWORK_CCY[chainId])
//       expect(result[0].route.path).toEqual([WRAPPED_NETWORK_TOKENS[chainId], token0, token1, token3])
//       expect(result[0].outputAmount.currency).toEqual(token3)
//       expect(result[1].inputAmount.currency).toEqual(NETWORK_CCY[chainId])
//       expect(result[1].route.path).toEqual([WRAPPED_NETWORK_TOKENS[chainId], token0, token3])
//       expect(result[1].outputAmount.currency).toEqual(token3)
//     })
//     it('works for NETWORK_CCY[chainId] currency output', () => {
//       const result = TradeV4.bestTradeExactIn(
//         stablePool,
//         [pair_weth_0, pair_t0_t1, pair_t0_t3, pair_t1_t3],
//         new TokenAmount(token3, BigNumber.from(100)),
//         NETWORK_CCY[chainId]
//       )
//       expect(result).toHaveLength(2)
//       expect(result[0].inputAmount.currency).toEqual(token3)
//       expect(result[0].route.path).toEqual([token3, token0, WRAPPED_NETWORK_TOKENS[chainId]])
//       expect(result[0].outputAmount.currency).toEqual(NETWORK_CCY[chainId])
//       expect(result[1].inputAmount.currency).toEqual(token3)
//       expect(result[1].route.path).toEqual([token3, token1, token0, WRAPPED_NETWORK_TOKENS[chainId]])
//       expect(result[1].outputAmount.currency).toEqual(NETWORK_CCY[chainId])
//     })
//   })

//   describe('#maximumAmountIn', () => {
//     describe('tradeType = EXACT_INPUT', () => {
//       const exactIn = new TradeV4(
//         new RouteV4([pair_t0_t1, pair_t1_t2], stablePool, token0),
//         new TokenAmount(token0, BigNumber.from(100)),
//         TradeType.EXACT_INPUT
//       )
//       it('throws if less than 0', () => {
//         expect(() => exactIn.maximumAmountIn(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
//           'SLIPPAGE_TOLERANCE'
//         )
//       })
//       it('returns exact if 0', () => {
//         expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactIn.inputAmount)
//       })
//       it('returns exact if nonzero', () => {
//         expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token0, BigNumber.from(100))
//         )
//         expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token0, BigNumber.from(100))
//         )
//         expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token0, BigNumber.from(100))
//         )
//       })
//     })
//     describe('tradeType = EXACT_OUTPUT', () => {
//       const exactOut = new TradeV4(
//         new RouteV4([pair_t0_t1, pair_t1_t2], stablePool, token0),
//         new TokenAmount(token2, BigNumber.from(100)),
//         TradeType.EXACT_OUTPUT
//       )

//       it('throws if less than 0', () => {
//         expect(() => exactOut.maximumAmountIn(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
//           'SLIPPAGE_TOLERANCE'
//         )
//       })
//       it('returns exact if 0', () => {
//         expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactOut.inputAmount)
//       })
//       it('returns slippage amount if nonzero', () => {
//         expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token0, BigNumber.from(156))
//         )
//         expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token0, BigNumber.from(163))
//         )
//         expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token0, BigNumber.from(468))
//         )
//       })
//     })
//   })

//   describe('#minimumAmountOut', () => {
//     describe('tradeType = EXACT_INPUT', () => {
//       const exactIn = new TradeV4(
//         new RouteV4([pair_t0_t1, pair_t1_t2], stablePool, token0),
//         new TokenAmount(token0, BigNumber.from(100)),
//         TradeType.EXACT_INPUT
//       )
//       it('throws if less than 0', () => {
//         expect(() => exactIn.minimumAmountOut(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
//           'SLIPPAGE_TOLERANCE'
//         )
//       })
//       it('returns exact if 0', () => {
//         expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactIn.outputAmount)
//       })
//       it('returns exact if nonzero', () => {
//         expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token2, BigNumber.from(69))
//         )
//         expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token2, BigNumber.from(65))
//         )
//         expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token2, BigNumber.from(23))
//         )
//       })
//     })
//     describe('tradeType = EXACT_OUTPUT', () => {
//       const exactOut = new TradeV4(
//         new RouteV4([pair_t0_t1, pair_t1_t2], stablePool, token0),
//         new TokenAmount(token2, BigNumber.from(100)),
//         TradeType.EXACT_OUTPUT
//       )

//       it('throws if less than 0', () => {
//         expect(() => exactOut.minimumAmountOut(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
//           'SLIPPAGE_TOLERANCE'
//         )
//       })
//       it('returns exact if 0', () => {
//         expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactOut.outputAmount)
//       })
//       it('returns slippage amount if nonzero', () => {
//         expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token2, BigNumber.from(100))
//         )
//         expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token2, BigNumber.from(100))
//         )
//         expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
//           new TokenAmount(token2, BigNumber.from(100))
//         )
//       })
//     })
//   })

//   describe('#bestTradeExactOut', () => {
//     it('throws with empty pools', () => {
//       expect(() => TradeV4.bestTradeExactOut(stablePool, [], token0, new TokenAmount(token2, BigNumber.from(100)))).toThrow('PAIRS')
//     })
//     it('throws with max hops of 0', () => {
//       expect(() =>
//         TradeV4.bestTradeExactOut(stablePool, [pair_t0_t2], token0, new TokenAmount(token2, BigNumber.from(100)), { maxHops: 0 })
//       ).toThrow('MAX_HOPS')
//     })

//     it('provides best route exact OUT', () => {
//       console.log('-----provides best route exact OUT-----')
//       console.log("stable balances before", stablePool.tokenBalances.map(value => value.toBigInt()))
//       // console.log("PAIRS1S2 before", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       const t2Amount = new TokenAmount(token2, BigNumber.from(100))
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,

//         [pair_t0_s1, pair_s1_s2, pair_s2_t2, pair_t0_t2],
//         token0,
//         t2Amount
//       )
//       console.log("stable balances after", stablePool.tokenBalances.map(value => value.toBigInt()))

//       // console.log("PAIRS1S2 afters", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))

//       const dummyStablePool = stablePool.clone()

//       const [s2Amount,] = pair_s2_t2.getInputAmount(t2Amount)
//       console.log("input s2 from t2", s2Amount.raw)
//       const [s1Amount,] = pair_s1_s2.getInputAmount(s2Amount, dummyStablePool)
//       console.log("input s1 from s2", s1Amount.raw)
//       const [t0Amount,] = pair_t0_s1.getInputAmount(s1Amount)
//       console.log("input t0 from s1", t0Amount.raw)

//       // const s2AmountTest = stablePool.clone().getInputAmount(s1Amount, 2)
//       // console.log("T2 through stablePool direct test", s2AmountTest.raw)

//       const [t0AmountDirect,] = pair_t0_t2.getInputAmount(t2Amount)

//       // console.log("PAIRS1S2", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       console.log("T2 through stablePool", t2Amount.raw) // should be 99
//       console.log("T2 via Pair", t0AmountDirect.raw) // should be 99
//       console.log("-- Wrapped pair calc for S2", s2Amount.raw)
//       console.log("-- direct SP calc for S2", stablePool.clone().getOutputAmount(s1Amount, 2).raw)
//       console.log("result0", result[0].outputAmount.raw)
//       console.log("result1", result[1].outputAmount.raw)

//       // for (let j = 0; j < result[1].route.pathMatrix.length; j++) {
//       //   console.log(result[1].route.pathMatrix[j].map(token => token.symbol))
//       // }
//       // console.log('provides best route result', result)
//       expect(result).toHaveLength(2)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//       expect(result[0].inputAmount).toEqual(t0AmountDirect)
//       expect(result[0].outputAmount).toEqual(t2Amount)
//       expect(result[1].route.pools).toHaveLength(3) // 0 -> 1 -> 2 at 12:12:10
//       expect(result[1].route.path).toEqual([token0, stable1, stable2, token2])
//       expect(result[1].inputAmount).toEqual(t0Amount)
//       expect(result[1].outputAmount).toEqual(t2Amount)
//     })

//     it('provides best route exact OUT WITH WEIGHTED PAIR', () => {
//       console.log('-----provides best route exact OUT including a WEIGHTED PAIR-----')
//       console.log("stable balances before", stablePool.tokenBalances.map(value => value.toBigInt()))
//       // console.log("PAIRS1S2 before", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       const t2Amount = new TokenAmount(token2, BigNumber.from(100))
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,

//         [pair_t0_s1, pair_s1_s2, pair_s2_t2, pair_t0_t2],
//         token0,
//         t2Amount
//       )
//       console.log("--------------------------------------")

//       // console.log("PAIRS1S2 afters", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))

//       const dummyStablePool = stablePool.clone()

//       const [s2Amount,] = pair_s2_t2.getInputAmount(t2Amount)
//       console.log("input s2 from t2", s2Amount.raw)
//       const [s1Amount,] = pair_s1_s2.getInputAmount(s2Amount, dummyStablePool)
//       console.log("input s1 from s2", s1Amount.raw)
//       console.log("RESERVES", pair_t0_s1_w.reserve0.raw.toString(), pair_t0_s1_w.reserve1.raw.toString())
//       console.log("OUT AMOUNT", s1Amount.raw.toString())
//       const [t0Amount,] = pair_t0_s1_w.clone().getInputAmount(s1Amount)
//       console.log("input t0 from s1", t0Amount.raw)

//       // const s2AmountTest = stablePool.clone().getInputAmount(s1Amount, 2)
//       // console.log("T2 through stablePool direct test", s2AmountTest.raw)

//       const [t0AmountDirect,] = pair_t0_t2.getInputAmount(t2Amount)

//       // console.log("PAIRS1S2", pair_s1_s2.token0, pair_s1_s2.token1, pair_s1_s2.tokenAmounts.map(amount => amount.raw))
//       console.log("T2 through stablePool", t2Amount.raw) // should be 99
//       console.log("T2 via Pair", t0AmountDirect.raw) // should be 99
//       console.log("-- Wrapped pair calc for S2", s2Amount.raw)
//       console.log("-- direct SP calc for S2", stablePool.clone().getOutputAmount(s1Amount, 2).raw)
//       console.log("result0", result[0].outputAmount.raw)
//       console.log("result1", result[1].outputAmount.raw)

//       // for (let j = 0; j < result[1].route.pathMatrix.length; j++) {
//       //   console.log(result[1].route.pathMatrix[j].map(token => token.symbol))
//       // }
//       // console.log('provides best route result', result)
//       expect(result).toHaveLength(2)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//       expect(result[0].inputAmount).toEqual(t0AmountDirect)
//       expect(result[0].outputAmount).toEqual(t2Amount)
//       expect(result[1].route.pools).toHaveLength(3) // 0 -> 1 -> 2 at 12:12:10
//       expect(result[1].route.path).toEqual([token0, stable1, stable2, token2])
//       expect(result[1].inputAmount).toEqual(t0Amount)
//       expect(result[1].outputAmount).toEqual(t2Amount)
//     })


//     it('provides best route', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         token0,
//         new TokenAmount(token2, BigNumber.from(100))
//       )
//       expect(result).toHaveLength(2)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//       expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(101)))
//       expect(result[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(100)))
//       expect(result[1].route.pools).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
//       expect(result[1].route.path).toEqual([token0, token1, token2])
//       expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(156)))
//       expect(result[1].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(100)))
//     })

//     it('doesnt throw for zero liquidity pools', () => {
//       expect(TradeV4.bestTradeExactOut(stablePool, [empty_pair_0_1], token1, new TokenAmount(token1, BigNumber.from(100)))).toHaveLength(
//         0
//       )
//     })

//     it('respects maxHops', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         token0,
//         new TokenAmount(token2, BigNumber.from(10)),
//         { maxHops: 1 }
//       )
//       expect(result).toHaveLength(1)
//       expect(result[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
//       expect(result[0].route.path).toEqual([token0, token2])
//     })

//     it('insufficient liquidity', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         token0,
//         new TokenAmount(token2, BigNumber.from(1200))
//       )
//       expect(result).toHaveLength(0)
//     })

//     it('insufficient liquidity in one pair but not the other', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         token0,
//         new TokenAmount(token2, BigNumber.from(1050))
//       )
//       expect(result).toHaveLength(1)
//     })

//     it('respects n', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_t0_t1, pair_t0_t2, pair_t1_t2],
//         token0,
//         new TokenAmount(token2, BigNumber.from(10)),
//         { maxNumResults: 1 }
//       )

//       expect(result).toHaveLength(1)
//     })

//     it('no path', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_t0_t1, pair_t0_t3, pair_t1_t3],
//         token0,
//         new TokenAmount(token2, BigNumber.from(10))
//       )
//       expect(result).toHaveLength(0)
//     })

//     it('works for NETWORK_CCY[chainId] currency input', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_weth_0, pair_t0_t1, pair_t0_t3, pair_t1_t3],
//         NETWORK_CCY[chainId],
//         new TokenAmount(token3, BigNumber.from(100))
//       )
//       expect(result).toHaveLength(2)
//       expect(result[0].inputAmount.currency).toEqual(NETWORK_CCY[chainId])
//       expect(result[0].route.path).toEqual([WRAPPED_NETWORK_TOKENS[chainId], token0, token1, token3])
//       expect(result[0].outputAmount.currency).toEqual(token3)
//       expect(result[1].inputAmount.currency).toEqual(NETWORK_CCY[chainId])
//       expect(result[1].route.path).toEqual([WRAPPED_NETWORK_TOKENS[chainId], token0, token3])
//       expect(result[1].outputAmount.currency).toEqual(token3)
//     })
//     it('works for NETWORK_CCY[chainId] currency output', () => {
//       const result = TradeV4.bestTradeExactOut(
//         stablePool,
//         [pair_weth_0, pair_t0_t1, pair_t0_t3, pair_t1_t3],
//         token3,
//         CurrencyAmount.networkCCYAmount(chainId, BigNumber.from(100))
//       )
//       expect(result).toHaveLength(2)
//       expect(result[0].inputAmount.currency).toEqual(token3)
//       expect(result[0].route.path).toEqual([token3, token0, WRAPPED_NETWORK_TOKENS[chainId]])
//       expect(result[0].outputAmount.currency).toEqual(NETWORK_CCY[chainId])
//       expect(result[1].inputAmount.currency).toEqual(token3)
//       expect(result[1].route.path).toEqual([token3, token1, token0, WRAPPED_NETWORK_TOKENS[chainId]])
//       expect(result[1].outputAmount.currency).toEqual(NETWORK_CCY[chainId])
//     })
//   })
// })
