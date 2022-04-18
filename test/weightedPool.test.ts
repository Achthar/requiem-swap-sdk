import { ethers, BigNumber } from 'ethers'
import { _getAPrecise, _xp, _distance, _getD, _sumOf, _getY } from '../src/entities/calculators/stableCalc'

import { TokenAmount } from '../src/entities/fractions/tokenAmount'
import { WeightedPool } from '../src/entities/pools/weightedPool/weightedPool'
import IERC20 from '../src/abis/IERC20.json'
import WeightedSwap from '../src/abis/WeightedPool.json'
import { Token } from '../src/entities/token'
import { WeightedSwapStorage } from '../src/entities/calculators/weightedSwapStorage'

describe('WeightedPool', () => {
  jest.setTimeout(30000);

  describe('fetcher', () => {
    it('constructor test', async () => {


      const jsonProv = await new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")


      const address = '0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E'

      // const tokenAddresses = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap), jsonProv).getTokens()

      const tokenReserves = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).getTokenBalances()

      let indexes = []
      for (let i = 0; i < 3; i++) {
        indexes.push(i)
      }

      const swapStorageRaw = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).swapStorage()
      const weights = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).getTokenWeights()
      const lpAddress = swapStorageRaw.lpToken
      const lpTotalSupply = await new ethers.Contract(lpAddress, new ethers.utils.Interface(IERC20), jsonProv).totalSupply()


      console.log("SS", swapStorageRaw)
      const manualSS = {
        "lpToken": '0x2d78E2E1483E8b494E02aD5BB53E67b4f920B8FF',
        "fee": BigNumber.from('0x0f4240'),
        "adminFee": BigNumber.from('0x012a05f200'),
        "defaultWithdrawFee": BigNumber.from('0x02faf080'),
      }

      console.log("SSComp", manualSS)

      const poolTokens = [
        new Token(43113, '0x31AbD3aA54cb7bdda3f52e304A5Ed9c1a783D289', 8, "WBTC"),
        new Token(43113, '0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e', 6, "USDT"),
        new Token(43113, '0x70dC2c5F81BC18e115759398aF197e99f228f713', 18, "WETH")
      ]

      const multipliers = poolTokens.map((token) => BigNumber.from(10).pow(18 - token.decimals))
      console.log("MULTIPLIERS", multipliers)
      const swapStorage = new WeightedSwapStorage(
        multipliers,
        weights,
        swapStorageRaw.fee,
        swapStorageRaw.adminFee,

      )

      console.log("--- withdrawl fee-----")

      const weightedPool = new WeightedPool(
        '0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E',
        poolTokens,
        tokenReserves,
        swapStorage,
        lpTotalSupply
      )
      console.log("======== WEIGHTED POOL ================\n", weightedPool)
      const inToken = poolTokens[0]
      const outToken = poolTokens[1]
      const inAmount = BigNumber.from('10000')
      console.log("--- swap via png----", "BALSS", weightedPool.getBalances().map(x => x.toString()), "\nMULS", swapStorage.tokenMultipliers.map(x => x.toString()))
      const swapActual = await weightedPool.calculateSwapViaPing(inToken, outToken, inAmount, jsonProv)

      console.log("calculate swap", swapActual.toString())
      const swapManual = weightedPool.calculateSwapGivenIn(inToken, outToken, inAmount)
      console.log("manual value", swapManual.toString())
      expect(swapManual).toEqual(swapActual)

      const x = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateRemoveLiquidityExactIn('100000')
      console.log("calculateRemoveLiquidity original", x)

      console.log("calculateRemoveLiquidity manual", weightedPool.calculateRemoveLiquidity(BigNumber.from('100000')))
      expect(x).toEqual(weightedPool.calculateRemoveLiquidity(BigNumber.from('100000')))


      const a = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateRemoveLiquidityOneToken(BigNumber.from('1000000000000'), 2)
      console.log("calculateRemoveLiquidityOne original", a)

      console.log("calculateRemoveLiquidityOne manual", weightedPool.calculateRemoveLiquidityOneToken(BigNumber.from('1000000000000'), 2))


      const b = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateTokenAmount(['100000', '1000000', '100000'], 1)
      console.log("getLiquidityAmount original", b)


      console.log("getLiquidityAmount manual", weightedPool.getLiquidityAmount([BigNumber.from('100000'), BigNumber.from('1000000'), BigNumber.from('100000')], true))


      console.log("getLiquidityAmount manual zero", weightedPool.getLiquidityAmount([BigNumber.from('0'), BigNumber.from('0'), BigNumber.from('0')], true))

      const inputTokenAmount = new TokenAmount(inToken, inAmount.toBigInt())

      const output = weightedPool.getOutputAmount(inputTokenAmount, outToken)
      console.log("input", inputTokenAmount.toFixed())
      console.log("output Token Amount Manual", output.toFixed())


      const amountsIn = ['0', '0', '1000000000000000000'].map((num) => BigNumber.from(num))
      const bench = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateTokenAmount(amountsIn, 0)
      console.log("getLiquidityAmount original FALSE", bench.toString())
      console.log("getLiquidityAmount manual FALSE", weightedPool.getLiquidityAmount(amountsIn, false).toString())



      const valueInUSDC = weightedPool.getLiquidityValue(0, ['1000000', '1000000', '1000000000000000000'].map((num) => BigNumber.from(num)))
      console.log("USDCVAL", valueInUSDC.toSignificant(6))


      const testmounts1 = [
        BigNumber.from('1000000'),
        BigNumber.from('1000000'),
        BigNumber.from('1000000000000000000')
      ]
      console.log('[1000000,1000000,1000000000000000000]')
      const bench4 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateTokenAmount(testmounts1, false)

      console.log("real Benchmark from chain", bench4.toString())
      console.log(" manual", weightedPool.getLiquidityAmount(testmounts1, false).toString())


      const testmounts = [
        BigNumber.from('427161'),
        BigNumber.from('487604'),
        BigNumber.from('48328837270524')
      ]

      const bench1 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateTokenAmount(testmounts, 0)

      console.log("real Benchmark from chain", bench1.toString(), weightedPool.getLiquidityAmount(testmounts, false).toString())

      console.log("---- calulate swap given out")
      const y = weightedPool.calculateSwapGivenOut(inToken, outToken, BigNumber.from("1239123"))

      const bench5 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateSwapGivenOut(
        '0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA',
        '0xffB3ed4960Cac85372e6838fbc9ce47bcF2D073E',
        BigNumber.from("1239123"))
      console.log("GIVEN OUT", y.toString(), bench5.toString())

      const y1 = weightedPool.calculateSwapGivenOut(outToken, poolTokens[2], BigNumber.from("1239123"))

      console.log("IN", BigNumber.from("0xf4240").toString())
      const bench6 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv).calculateSwapGivenOut(
        '0xffB3ed4960Cac85372e6838fbc9ce47bcF2D073E', '0xaEA51E4FEe50a980928B4353E852797b54deacd8',
        BigNumber.from("0xf4240"))
      console.log("GIVEN OUT", y1.toString(), bench6.toString())


      // const bench2 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap as any), jsonProv)
      // .removeLiquidityImbalance(testmounts,
      //    BigNumber.from('471156368702411645588335'), BigNumber.from('99999999999999999999999999999999999999'))

      // console.log("real Benchmark from chain remimb", bench2.toString())
      // const amp = _getAPrecise(stablePool.blockTimestamp,
      //   swapStorage)
      // console.log("APREC", amp)
      // const xp = _xp(stablePool.getBalances(), stablePool.swapStorage.tokenMultipliers)

      // console.log("XP", xp.map(val => val.toString()))

      // console.log("SUMXP", _sumOf(xp))
      // // console.log("dist 3,5", _distance(BigNumber.from(3), BigNumber.from(5)))


      // // console.log("AMP mul 4", amp.mul(4))
      // console.log("getD", _getD(xp, amp))

      // console.log("getY", _getY(inIndex,
      // outIndex,
      // BigNumber.from(blockNumber),
      // xp[inIndex].add(inAmount.mul(stablePool.swapStorage.tokenMultipliers[inIndex])),
      // swapStorage,
      // xp))

      // const provider = new HDWalletProvider({ privateKeys: [pk], providerOrUrl: "https://api.avax-test.network/ext/bc/C/rpc" })
      // const data = await StablesFetcher.fetchWeightedPoolData(43113,
      //   wallet.)
      // console.log(data)
      // let z = BigNumber.from(2)
      // const y = z.mul(BigNumber.from(0))
      // console.log("x", z, "y", y)
    }
    )

  })
})
