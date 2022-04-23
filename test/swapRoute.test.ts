import {
    ChainId,
    AmplifiedWeightedPair,

    Token,


    StablePool,
    WeightedSwapStorage,
    WeightedPool,
    TokenAmount,
    Percent,
} from '../src'

import { WRAPPED_NETWORK_TOKENS } from '../src/entities/token'
import { BigNumber } from 'ethers'
import { SwapStorage } from '../src/entities/calculators/swapStorage'
import { PairData } from '../src/entities/pools/pairData'
import { RouteProvider } from '../src/routeProvider'
import { SwapRoute } from '../src/entities/swapRoute'
import { Swap, SwapType } from '../src/entities/swap'

describe('SwapRoute', () => {
    // const chainId = ChainId.BSC_MAINNET
    const token0 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
    const token1 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
    const token2 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000003', 18, 't2')
    const token3 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000004', 18, 't3')


    const stable0 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000005', 18, 's0')
    const stable1 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000006', 18, 's1')
    const stable2 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000007', 18, 's2')
    const stable3 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000008', 18, 's3')


    //   const pair_0_1 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token1, BigNumber.from(1000)))
    //   const pair_0_2 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token2, BigNumber.from(1100)))
    //   const pair_0_3 = new Pair(new TokenAmount(token0, BigNumber.from(1000)), new TokenAmount(token3, BigNumber.from(900)))
    //   const pair_1_2 = new Pair(new TokenAmount(token1, BigNumber.from(1200)), new TokenAmount(token2, BigNumber.from(1000)))
    //   const pair_1_3 = new Pair(new TokenAmount(token1, BigNumber.from(1200)), new TokenAmount(token3, BigNumber.from(1300)))
    // const pair_weth_0 = new Pair(
    //     new TokenAmount(WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET], BigNumber.from(1000)),
    //     new TokenAmount(token0, BigNumber.from(1000))
    // )

    const pair_0_1 = AmplifiedWeightedPair.fromBigIntish([token0, token1], [1000, 1000], [1200, 1200], 40, 12, 12000)
    console.log("REF", pair_0_1.virtualReserve0.raw)
    const pair_0_2 = AmplifiedWeightedPair.fromBigIntish([token0, token2], [1000, 1100], [1200, 1320], 40, 12, 12000)
    const pair_0_3 = AmplifiedWeightedPair.fromBigIntish([token0, token3], [1000, 900], [1200, 1080], 60, 12, 12000)
    const pair_1_2 = AmplifiedWeightedPair.fromBigIntish([token1, token2], [1200, 1000], [1440, 1200], 40, 12, 12000)
    const pair_1_3 = AmplifiedWeightedPair.fromBigIntish([token1, token3], [1200, 1300], [1440, 1560], 40, 12, 12000)


    const pair_0_s3 = AmplifiedWeightedPair.fromBigIntish([token0, stable3], [1000, 900], [1200, 1080], 60, 12, 12000)
    const pair_1_s2 = AmplifiedWeightedPair.fromBigIntish([token1, stable2], [1200, 1000], [1440, 1200], 40, 12, 12000)
    const pair_1_s3 = AmplifiedWeightedPair.fromBigIntish([token1, stable3], [1200, 1300], [1440, 1560], 40, 12, 12000)
    const pair_s0_1 = AmplifiedWeightedPair.fromBigIntish([stable0, token1], [1000, 1000], [1200, 1200], 40, 12, 12000)

    const pair_weth_0 = AmplifiedWeightedPair.fromBigIntish(
        [WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET], token0], [1000, 1000], [1200, 1200], 50, 20, 12000)

    const empty_pair_0_1 = AmplifiedWeightedPair.fromBigIntish([token0, token1], [0, 0], [0, 0], 50, 1, 10000)



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
    const stables = [stable0, stable1, stable2, stable3]


    const balances = [BigNumber.from('10000'), BigNumber.from('11000'), BigNumber.from('10100'), BigNumber.from('11100')]

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
        BigNumber.from('0'),
        '0xDf65aC8079A71f5174A35dE3D29e5458d03D5787'
    )

    // weightedPool

    const poolTokens = [
        token1,
        token2,
        stable1
    ]

    const tokenBalances = [
        BigNumber.from('1000000'),
        BigNumber.from('2000000'),
        BigNumber.from('2200000')
    ]



    const multipliers = poolTokens.map((token) => BigNumber.from(10).pow(18 - token.decimals))
    console.log("MULTIPLIERS", multipliers)
    const weightedSwapStorage = new WeightedSwapStorage(
        multipliers,
        poolTokens.map(t => BigNumber.from(10).pow(18 - t.decimals)),
        BigNumber.from('0x12e296'),
        BigNumber.from('0x4c4b40')

    )

    console.log("--- withdrawl fee-----")

    const weightedPool = new WeightedPool(
        '0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E',
        poolTokens,
        tokenBalances,
        weightedSwapStorage,
        BigNumber.from(1e10)// lpTotalSupply
    )

    const poolDict = {
        [pair_0_1.address]: pair_0_1,
        [pair_0_2.address]: pair_0_2,
        [pair_0_3.address]: pair_0_3,
        [pair_1_2.address]: pair_1_2,
        [pair_1_3.address]: pair_1_3,
        [pair_weth_0.address]: pair_weth_0,
        [pair_0_s3.address]: pair_0_s3,
        [pair_1_s2.address]: pair_1_s2,
        [pair_1_s3.address]: pair_1_s3,
        [pair_s0_1.address]: pair_s0_1,
        [stablePool.address]: stablePool,
        [weightedPool.address]: weightedPool,
        [empty_pair_0_1.address]: empty_pair_0_1
    }


    it('creates swapRoute', () => {
        const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2])
        const result = RouteProvider.getRoutes(
            pairData,
            token0,
            token2
        )

        console.log(result.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
        console.log(result.map(r => r.path.map(p => p.symbol)))
        expect(result).toHaveLength(2)
    })

    it('creates swapRoute', () => {
        const pairData = PairData.dataFromPools([stablePool, weightedPool])
        const result = RouteProvider.getRoutes(
            pairData,
            stable0,
            token2
        )

        console.log(result.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
        console.log(result.map(r => r.path.map(p => p.symbol)))

        const agg = SwapRoute.cleanRoutes(result)
        console.log(agg.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
        console.log(agg.map(r => r.path.map(p => p.symbol)))
        // expect(result).toHaveLength(2)
    })

    it('creates swapRoute - pairs, weighted pool, stable pool', () => {
        const pairData = PairData.dataFromPools([stablePool, weightedPool, pair_0_s3, pair_0_2, pair_1_2])
        const result = RouteProvider.getRoutes(
            pairData,
            stable3,
            token2
        )

        console.log(result.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
        console.log(result.map(r => r.path.map(p => p.symbol)))

        const agg = SwapRoute.cleanRoutes(result)
        console.log(agg.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
        console.log(agg.map(r => r.path.map(p => p.symbol)))
        const amount = new TokenAmount(stable3, '200')
        const swaps = Swap.PriceRoutes(agg, amount, SwapType.EXACT_INPUT, poolDict)

        console.log(swaps.map(res => res.route.path.map(pd => pd.symbol)))

        console.log(swaps.map(res => res.outputAmount.toSignificant(18)))

        console.log(swaps.map(res => res.route.swapData.map(pd => [pd.tokenIn.symbol, pd.tokenOut.symbol])))

        // console.log(swaps.map(res => { return { price: res.route.midPrice.toSignificant(18), out: res.outputAmount.toSignificant(22) } }))


        // expect(result).toHaveLength(2)
    })


    describe('#bestTradeExactIn', () => {
        // it('throws with empty pairs', () => {
        //     expect(() => Trade.bestTradeExactIn([], new TokenAmount(token0, BigNumber.from(100)), token2, poolDict)).toThrow('PAIRS')
        // })
        // it('throws with max hops of 0', () => {
        //     const pairData = PairData.dataFromPool(pair_0_2)
        //     expect(() =>
        //         Trade.bestTradeExactIn(pairData, new TokenAmount(token0, BigNumber.from(100)), token2, poolDict, { maxHops: 0 })
        //     ).toThrow('MAX_HOPS')
        // })

        it('provides best route', () => {
            const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2])
            const result = RouteProvider.getRoutes(
                pairData,
                token0,
                token2
            )

            console.log(result.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
            console.log(result.map(r => r.path.map(p => p.symbol)))

            const agg = SwapRoute.cleanRoutes(result)
            console.log(agg.map(r => r.swapData.map(d => [d.tokenIn.symbol, d.tokenOut.symbol])))
            console.log(agg.map(r => r.path.map(p => p.symbol)))
            const amount = new TokenAmount(token0, '100')
            const swaps = Swap.PriceRoutes(agg, amount, SwapType.EXACT_INPUT, poolDict)

            console.log(swaps.map(res => res.route.path.map(pd => pd.symbol)))

            console.log(swaps.map(res => res.outputAmount.toSignificant(18)))

            console.log(swaps.map(res => res.route.swapData.map(pd => [pd.tokenIn.symbol, pd.tokenOut.symbol])))

            expect(swaps).toHaveLength(2)
            expect(swaps[0].route.swapData).toHaveLength(1) // 0 -> 2 at 10:11
            expect(swaps[0].route.path).toEqual([token0, token2])
            expect(swaps[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
            expect(swaps[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(68)))
            expect(swaps[1].route.swapData).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
            expect(swaps[1].route.path).toEqual([token0, token1, token2])
            expect(swaps[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
            expect(swaps[1].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(33)))
        })

        it('provides best route StablePool and WeightedPool', () => {

            const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2, pair_1_s2, stablePool, weightedPool])

            console.log("PDCHECK", pairData.map(pd => [pd.token0.symbol, pd.token1.symbol]))
            const result = RouteProvider.getRoutes(
                pairData,
                token0,
                token2,
                6
            )

            console.log('preClean swaps',result.map(r => r.swapData.map(d => [d.tokenIn.symbol + '-' + d.tokenOut.symbol])))
            console.log('preClean paths',result.map(r => r.path.map(p => p.symbol)))

            const agg = SwapRoute.cleanRoutes(result)
            console.log('postClean swaps',agg.map(r => r.swapData.map(d => [d.tokenIn.symbol + '-' + d.tokenOut.symbol, d.poolRef])))
            console.log('postClean route',agg.map(r => r.path.map(p => p.symbol).join('-')))
            const amount = new TokenAmount(token0, '100')
            const swaps = Swap.PriceRoutes(agg, amount, SwapType.EXACT_INPUT, poolDict)

            console.log(swaps.map(res => res.route.path.map(pd => pd.symbol).join('-')))

            console.log(swaps.map(res => res.outputAmount.toSignificant(18)))

            console.log(swaps.map(res => res.route.swapData.map(pd => [pd.tokenIn.symbol + '-' + pd.tokenOut.symbol])))

            // const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2, pair_1_s2, stablePool, weightedPool])
            // const result = Trade.bestTradeExactIn(
            //     pairData,
            //     new TokenAmount(token0, BigNumber.from(100)),
            //     token2,
            //     poolDict,
            //     { maxHops: 6 }
            // )
            // console.log(result.map(res => res.route.path.map(pd => pd.symbol)))

            // console.log(result.map(res => res.route.pairData.map(pd => [pd.token0.symbol, pd.token1.symbol])))

            // console.log(result.map(res => { return { price: res.route.midPrice.toSignificant(18), out: res.outputAmount.toSignificant(18) } }))

            expect(swaps).toHaveLength(9)
            expect(swaps[0].route.swapData).toHaveLength(5) // 0 -> 2 at 10:11
            expect(swaps[0].route.path).toEqual([token0, token1, stable1, stable2, token1, token2])
            expect(swaps[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
            expect(swaps[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(425)))
            expect(swaps[1].route.swapData).toHaveLength(6) // 0 -> 1 -> 2 at 12:12:10
            expect(swaps[1].route.path).toEqual([token0, token1, stable1, stable2, token1, token0, token2])
            expect(swaps[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
            expect(swaps[1].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(161)))
        })


        // it('provides best route StablePool and WeightedPool', () => {
        //     const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2, pair_1_s2, stablePool, weightedPool])
        //     const result = Trade.bestTradeExactIn(
        //         pairData,
        //         new TokenAmount(token0, BigNumber.from(100)),
        //         token1,
        //         poolDict,
        //         { maxHops: 6 }
        //     )
        //     console.log(result.map(res => res.route.path.map(pd => pd.symbol)))

        //     console.log(result.map(res => res.route.pairData.map(pd => [pd.token0.symbol, pd.token1.symbol])))

        //     console.log(result.map(res => { return { price: res.route.midPrice.toSignificant(18), out: res.outputAmount.toSignificant(18) } }))

        //     expect(result).toHaveLength(3)
        //     expect(result[0].route.pairData).toHaveLength(4) // 0 -> 2 at 10:11
        //     expect(result[0].route.path).toEqual([token0, token2, stable1, stable2, token1])
        //     expect(result[0].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
        //     expect(result[0].outputAmount).toEqual(new TokenAmount(token1, BigNumber.from(123)))
        //     expect(result[1].route.pairData).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
        //     expect(result[1].route.path).toEqual([token0, token2, token1])
        //     expect(result[1].inputAmount).toEqual(new TokenAmount(token0, BigNumber.from(100)))
        //     expect(result[1].outputAmount).toEqual(new TokenAmount(token1, BigNumber.from(114)))
        // })


        // // it('doesnt throw for zero liquidity pairs', () => {
        // //     expect(Trade.bestTradeExactIn(PairData.dataFromPools([empty_pair_0_1]), new TokenAmount(token0, BigNumber.from(100)), token1, poolDict)).toHaveLength(
        // //         0
        // //     )
        // // })

        it('respects maxHops', () => {
            const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2])
            console.log("PDCHECK", pairData.map(pd => [pd.token0.symbol, pd.token1.symbol]))
            const result = RouteProvider.getRoutes(
                pairData,
                token0,
                token2,
                1
            )

            console.log('preClean swaps',result.map(r => r.swapData.map(d => [d.tokenIn.symbol + '-' + d.tokenOut.symbol])))
            console.log('preClean paths',result.map(r => r.path.map(p => p.symbol)))

            const agg = SwapRoute.cleanRoutes(result)
            console.log('postClean swaps',agg.map(r => r.swapData.map(d => [d.tokenIn.symbol + '-' + d.tokenOut.symbol, d.poolRef])))
            console.log('postClean route',agg.map(r => r.path.map(p => p.symbol).join('-')))



            expect(agg).toHaveLength(1)
            expect(agg[0].swapData).toHaveLength(1) // 0 -> 2 at 10:11
            expect(agg[0].path).toEqual([token0, token2])
        })

        // // it('insufficient input for one pair', () => {
        // //     const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2])
        // //   const result = Trade.bestTradeExactIn(
        // //     pairData,
        // //     new TokenAmount(token0, BigNumber.from(1)),
        // //     token2,
        // //     poolDict
        // //   )
        // //   expect(result).toHaveLength(1)
        // // //   expect(result[0].route.pairs).toHaveLength(1) // 0 -> 2 at 10:11
        // //   expect(result[0].route.path).toEqual([token0, token2])
        // //   expect(result[0].outputAmount).toEqual(new TokenAmount(token2, BigNumber.from(1)))
        // // })

        // it('respects n', () => {
        //     const pairData = PairData.dataFromPools([pair_0_1, pair_0_2, pair_1_2])
        //     const result = Trade.bestTradeExactIn(
        //         pairData,
        //         new TokenAmount(token0, BigNumber.from(10)),
        //         token2,
        //         poolDict,
        //         { maxNumResults: 1 }
        //     )

        //     expect(result).toHaveLength(1)
        // })

        it('no path', () => {

            const pairData = PairData.dataFromPools([pair_0_1, pair_0_3, pair_1_3])
            console.log("PDCHECK", pairData.map(pd => [pd.token0.symbol, pd.token1.symbol]))
            const result = RouteProvider.getRoutes(
                pairData,
                token0,
                token2,
                1
            )

            expect(result).toHaveLength(0)
        })

        // it('works for NETWORK_CCY[ChainId.BSC_MAINNET] currency input', () => {
        //     const pairData = PairData.dataFromPools([pair_weth_0, pair_0_1, pair_0_3, pair_1_3])
        //     const result = Trade.bestTradeExactIn(
        //         pairData,
        //         CurrencyAmount.networkCCYAmount(chainId, BigNumber.from(100)),
        //         token3,
        //         poolDict
        //     )

        //     console.log(result.map(res => res.route.path.map(pd => pd.symbol)))

        //     console.log(result.map(res => res.route.pairData.map(pd => [pd.token0.symbol, pd.token1.symbol])))

        //     console.log(result.map(res => { return { price: res.route.midPrice.toSignificant(18), out: res.outputAmount.toSignificant(18) } }))

        //     expect(result).toHaveLength(2)
        //     expect(result[0].inputAmount.currency).toEqual(NETWORK_CCY[ChainId.BSC_MAINNET])
        //     expect(result[0].route.path).toEqual([WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET], token0, token3])
        //     expect(result[0].outputAmount.currency).toEqual(token3)
        //     expect(result[1].inputAmount.currency).toEqual(NETWORK_CCY[ChainId.BSC_MAINNET])
        //     expect(result[1].route.path).toEqual([WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET], token0, token1, token3])
        //     expect(result[1].outputAmount.currency).toEqual(token3)
        // })
        // it('works for NETWORK_CCY[ChainId.BSC_MAINNET] currency output', () => {
        //     const pairData = PairData.dataFromPools([pair_weth_0, pair_0_1, pair_0_3, pair_1_3])
        //     const result = Trade.bestTradeExactIn(
        //         pairData,
        //         new TokenAmount(token3, BigNumber.from(100)),
        //         NETWORK_CCY[ChainId.BSC_MAINNET],
        //         poolDict
        //     )

        //     console.log(result.map(res => res.route.path.map(pd => pd.symbol)))

        //     console.log(result.map(res => res.route.pairData.map(pd => [pd.token0.symbol, pd.token1.symbol])))

        //     console.log(result.map(res => { return { price: res.route.midPrice.toSignificant(18), out: res.outputAmount.toSignificant(18) } }))

        //     expect(result).toHaveLength(2)
        //     expect(result[0].inputAmount.currency).toEqual(token3)
        //     expect(result[0].route.path).toEqual([token3, token1, token0, WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET]])
        //     expect(result[0].outputAmount.currency).toEqual(NETWORK_CCY[ChainId.BSC_MAINNET])
        //     expect(result[1].inputAmount.currency).toEqual(token3)
        //     expect(result[1].route.path).toEqual([token3, token0, WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET]])
        //     expect(result[1].outputAmount.currency).toEqual(NETWORK_CCY[ChainId.BSC_MAINNET])
        // })
    })

    describe('#maximumAmountIn', () => {
        describe('tradeType = EXACT_INPUT', () => {
            
            const pairData = PairData.dataFromPools([pair_0_1, pair_1_2])
            const exactIn = new Swap(
                new SwapRoute(PairData.toSwapArrayFrom(pairData, token0)),
                new TokenAmount(token0, BigNumber.from(100)),
                SwapType.EXACT_INPUT,
                poolDict
            )

            it('throws if less than 0', () => {
                expect(() => exactIn.maximumAmountIn(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
                    'SLIPPAGE_TOLERANCE'
                )
            })
            it('returns exact if 0', () => {
                expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactIn.inputAmount)
            })
            it('returns exact if nonzero', () => {
                expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token0, BigNumber.from(100))
                )
                expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token0, BigNumber.from(100))
                )
                expect(exactIn.maximumAmountIn(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token0, BigNumber.from(100))
                )
            })
        })
        describe('tradeType = EXACT_OUTPUT', () => {
            const pairData = PairData.dataFromPools([pair_0_1, pair_1_2])
            const exactOut = new Swap(
                new SwapRoute(PairData.toSwapArrayTo(pairData, token2)),
                new TokenAmount(token2, BigNumber.from(100)),
                SwapType.EXACT_OUTPUT,
                poolDict
            )

            it('throws if less than 0', () => {
                expect(() => exactOut.maximumAmountIn(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
                    'SLIPPAGE_TOLERANCE'
                )
            })
            it('returns exact if 0', () => {
                expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactOut.inputAmount)
            })
            it('returns slippage amount if nonzero', () => {
                expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token0, BigNumber.from(383))
                )
                expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token0, BigNumber.from(402))
                )
                expect(exactOut.maximumAmountIn(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token0, BigNumber.from(1149))
                )
            })
        })
    })

    describe('#minimumAmountOut', () => {
        describe('tradeType = EXACT_INPUT', () => {
            const pairData = PairData.dataFromPools([pair_0_1, pair_1_2])
            const exactIn = new Swap(
                new SwapRoute(PairData.toSwapArrayFrom(pairData, token0)),
                new TokenAmount(token0, BigNumber.from(100)),
                SwapType.EXACT_INPUT,
                poolDict
            )
            it('throws if less than 0', () => {
                expect(() => exactIn.minimumAmountOut(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
                    'SLIPPAGE_TOLERANCE'
                )
            })
            it('returns exact if 0', () => {
                expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactIn.outputAmount)
            })
            it('returns exact if nonzero', () => {
                expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token2, BigNumber.from(33))
                )
                expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token2, BigNumber.from(31))
                )
                expect(exactIn.minimumAmountOut(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token2, BigNumber.from(11))
                )
            })
        })
        describe('tradeType = EXACT_OUTPUT', () => {
            const pairData = PairData.dataFromPools([pair_0_1, pair_1_2])
            const exactOut = new Swap(
                new SwapRoute(PairData.toSwapArrayFrom(pairData, token0)),
                new TokenAmount(token2, BigNumber.from(100)),
                SwapType.EXACT_OUTPUT,
                poolDict
            )

            it('throws if less than 0', () => {
                expect(() => exactOut.minimumAmountOut(new Percent(BigNumber.from(-1), BigNumber.from(100)))).toThrow(
                    'SLIPPAGE_TOLERANCE'
                )
            })
            it('returns exact if 0', () => {
                expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(exactOut.outputAmount)
            })
            it('returns slippage amount if nonzero', () => {
                expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(0), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token2, BigNumber.from(100))
                )
                expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(5), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token2, BigNumber.from(100))
                )
                expect(exactOut.minimumAmountOut(new Percent(BigNumber.from(200), BigNumber.from(100)))).toEqual(
                    new TokenAmount(token2, BigNumber.from(100))
                )
            })
        })
    })
})
