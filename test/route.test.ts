import { Token, AmplifiedWeightedPair, WRAPPED_NETWORK_TOKENS, ChainId, WeightedSwapStorage, WeightedPool, NETWORK_CCY } from '../src'

import { StablePool } from '../src/entities/pools/stable/stablePool'
import { SwapStorage } from '../src/entities/calculators/swapStorage'
import { Route } from '../src/entities/route'
import { BigNumber } from 'ethers'
import { PairData } from '../src/entities/pools/pairData'

describe('Route', () => {
    const chainId = ChainId.BSC_MAINNET
    const token0 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
    const token1 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
    const token2 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000007', 18, 't2')

    const stable0 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000003', 18, 's0')
    const stable1 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000004', 18, 's1')
    const stable2 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000005', 18, 's2')
    const stable3 = new Token(ChainId.BSC_MAINNET, '0x0000000000000000000000000000000000000006', 18, 's3')

    const weth = WRAPPED_NETWORK_TOKENS[ChainId.BSC_MAINNET]
    const amp = BigNumber.from(12000)

    const _100 = BigNumber.from(100)

    const _200 = BigNumber.from(200)
    const _175 = BigNumber.from(200)

    const _200Amp = _200.mul(amp).div(10000)
    const _100Amp = _100.mul(amp).div(10000)

    const _175Amp = _175.mul(amp).div(10000)
    const weight = BigNumber.from(30)
    const fee = BigNumber.from(12)
    const pair_t0_t1 = new AmplifiedWeightedPair([token0, token1], [_100, _200], [_100Amp, _200Amp], weight, fee, amp
        // new TokenAmount(token0, '100'), new TokenAmount(token1, '200')
    )

    const pair_t1_s0 = new AmplifiedWeightedPair(
        [token1, stable0], [_100, _200], [_100Amp, _200Amp], weight, fee, amp
        // new TokenAmount(token1, '100'), new TokenAmount(stable0, '200')
    )
    const pair_t1_t2 = new AmplifiedWeightedPair(
        [token1, token2], [_100, _200], [_100Amp, _200Amp], weight, fee, amp
    )
    // (new TokenAmount(token1, '100'), new TokenAmount(token2, '200')
    // )
    const pair_t2_s0 = new AmplifiedWeightedPair(
        [token2, stable0], [_100, _200], [_100Amp, _200Amp], weight, fee, amp
        // new TokenAmount(token2, '100'), new TokenAmount(stable0, '200')
    )

    const pair_s1_t0 = new AmplifiedWeightedPair(
        [stable1, token0], [_100, _200], [_100Amp, _200Amp], weight, fee, amp

        // new TokenAmount(stable1, '100'), new TokenAmount(token0, '200')
    )

    // const pair_t0_s0 = new AmplifiedWeightedPair(new TokenAmount(token0, '100'), new TokenAmount(stable0, '200'))

    const pair_s0_weth = new AmplifiedWeightedPair(
        [stable0, weth], [_100, _100], [_100Amp, _100Amp], weight, fee, amp

        // new TokenAmount(stable0, '100'), new TokenAmount(weth, '100')
    )
    const pair_s1_weth = new AmplifiedWeightedPair(
        [stable1, weth], [_175, _100], [_175Amp, _100Amp], weight, fee, amp
        // new TokenAmount(stable1, '175'), new TokenAmount(weth, '100')
    )

    // stable pool

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
        BigNumber.from('0x028fa6ae00'),
        BigNumber.from('0x0400b0050ef1'),
        BigNumber.from('0x3b9e1b84663afc1eaa')
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
        [pair_t0_t1.address]: pair_t0_t1,
        [pair_t1_s0.address]: pair_t1_s0,
        [pair_t1_t2.address]: pair_t1_t2,
        [pair_t2_s0.address]: pair_t2_s0,
        [pair_s1_t0.address]: pair_s1_t0,
        [pair_s0_weth.address]: pair_s0_weth,
        [pair_s1_weth.address]: pair_s1_weth,
        [stablePool.address]: stablePool,
        [weightedPool.address]: weightedPool
    }


    it('constructs a path from the tokens', () => {
        const route = new Route(poolDict, PairData.dataFromPool(pair_t0_t1), token0)
        console.log("R", route)
        expect(route.pairData).toEqual(PairData.dataFromPool(pair_t0_t1))
        expect(route.path).toEqual([token0, token1])
        expect(route.input).toEqual(token0)
        expect(route.output).toEqual(token1)
        expect(route.chainId).toEqual(ChainId.BSC_MAINNET)
        expect(route.midPrice).toEqual(PairData.dataFromPool(pair_t0_t1)[0].poolPrice(token0, token1, poolDict))
    })

    it('can have a token as both input and output', () => {
        console.log("=========PD", PairData.singleDataFromPool(0, 1, stablePool))
        const pairData = [...PairData.dataFromPool(pair_s0_weth), PairData.singleDataFromPool(0, 1, stablePool), ...PairData.dataFromPool(pair_s1_t0)]
        const route = new Route(poolDict, pairData, weth)
        expect(route.pairData).toEqual(pairData)
        expect(route.input).toEqual(weth)
        expect(route.output).toEqual(token0)
        console.log("----routes ----")

    })


    it('supports multiple pairs mixed withg stable', () => {
        const pairData = [...PairData.dataFromPool(pair_s0_weth),
        ...PairData.dataFromPool(pair_t1_s0),
        ...PairData.dataFromPool(pair_t1_t2),
        ...PairData.dataFromPool(pair_t2_s0),
        PairData.singleDataFromPool(0, 1, stablePool), ...PairData.dataFromPool(pair_s1_t0)]
        const route = new Route(poolDict, pairData, weth)
        // expect(route.sources).toEqual([pair_s0_weth, pair_s0_s1, pair_s1_weth])
        expect(route.input).toEqual(weth)
        expect(route.output).toEqual(token0)

    })

    it('supports multiple pairs mixed withg stable and weighted pool', () => {
        const pairData = [...PairData.dataFromPool(pair_s0_weth),
        ...PairData.dataFromPool(pair_t1_s0),
        PairData.singleDataFromPool(0, 1, weightedPool),
        ...PairData.dataFromPool(pair_t2_s0),
        PairData.singleDataFromPool(0, 1, stablePool), ...PairData.dataFromPool(pair_s1_t0)]
        const route = new Route(poolDict, pairData, weth)
        expect(route.pairData).toEqual(pairData)
        expect(route.input).toEqual(weth)
        expect(route.output).toEqual(token0)

    })


    it('supports ether input', () => {
        const pairData = PairData.dataFromPool(pair_s0_weth)
        const route = new Route(poolDict, pairData, NETWORK_CCY[chainId])
        expect(route.pairData).toEqual(pairData)
        expect(route.input).toEqual(NETWORK_CCY[chainId])
        expect(route.output).toEqual(stable0)
    })

    it('supports ether output', () => {
        const pairData = PairData.dataFromPool(pair_s0_weth)
        const route = new Route(poolDict, pairData, stable0, NETWORK_CCY[chainId])
        expect(route.pairData).toEqual(pairData)
        expect(route.input).toEqual(stable0)
        expect(route.output).toEqual(NETWORK_CCY[chainId])
    })
})
