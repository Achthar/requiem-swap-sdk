import { ethers, BigNumber } from 'ethers'
import { _getAPrecise, _xp, _distance, _getD, _sumOf, _getY } from '../src/entities/stableCalc'

import { TokenAmount } from '../src/entities/fractions/tokenAmount'
import { WeightedPool } from '../src/entities/weightedPool'
import IERC20 from '../src/abis/IERC20.json'
import WeightedSwap from '../src/abis/WeightedPool.json'
import { Token } from '../src'
import { WeightedSwapStorage } from '../src/entities/calculators/weightedSwapStorage'

describe('WeightedPool', () => {
  jest.setTimeout(30000);

  describe('fetcher', () => {
    it('constructor test', async () => {


      const jsonProv = await new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")


      const address = '0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E'

      // const tokenAddresses = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap), jsonProv).getTokens()

      const tokenReserves = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).getTokenBalances()

      let indexes = []
      for (let i = 0; i < 3; i++) {
        indexes.push(i)
      }

      const swapStorageRaw = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).swapStorage()
      const weights = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).getTokenWeights()
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

      const swapStorage = new WeightedSwapStorage(
        poolTokens.map((token) => (BigNumber.from(10)).pow(18 - token.decimals)),
        weights,
        swapStorageRaw.fee,
        swapStorageRaw.adminFee,

      )

      const blockNumber = await jsonProv.getBlockNumber()

      console.log("--- withdrawl fee-----")

      const weightedPool = new WeightedPool(
        '0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E',
        Object.assign({}, ...poolTokens.map((x, index) => { return { [index]: x } })),
        tokenReserves,
        swapStorage,
        blockNumber,
        lpTotalSupply
      )

      const inIndex = 0
      const outIndex = 1
      const inAmount = BigNumber.from('10000')
      console.log("--- swap via png----", "BALSS", weightedPool.getBalances().map(x => x.toString()), "\nMULS", swapStorage.tokenMultipliers.map(x => x.toString()))
      const swapActual = await weightedPool.calculateSwapViaPing(inIndex, outIndex, inAmount, jsonProv)

      console.log("calculate swap", swapActual.toString())
      const swapManual = weightedPool.calculateSwapGivenIn(inIndex, outIndex, inAmount)
      console.log("manual value", swapManual.toString())
      expect(swapManual).toEqual(swapActual)

      const x = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateRemoveLiquidityExactIn('100000')
      console.log("calculateRemoveLiquidity original", x)

      console.log("calculateRemoveLiquidity manual", weightedPool.calculateRemoveLiquidity(BigNumber.from('100000')))
      expect(x).toEqual(weightedPool.calculateRemoveLiquidity(BigNumber.from('100000')))


      const a = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateRemoveLiquidityOneToken('100000', 3)
      console.log("calculateRemoveLiquidityOne original", a)

      console.log("calculateRemoveLiquidityOne manual", weightedPool.calculateRemoveLiquidityOneToken(BigNumber.from('100000'), 3))


      const b = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateTokenAmount(['100000', '1000000', '100000', '1000000'], true)
      console.log("getLiquidityAmount original", b)


      console.log("getLiquidityAmount manual", weightedPool.getLiquidityAmount([BigNumber.from('100000'), BigNumber.from('1000000'), BigNumber.from('100000'), BigNumber.from('1000000')], true))


      console.log("getLiquidityAmount manual", weightedPool.getLiquidityAmount([BigNumber.from('0'), BigNumber.from('0'), BigNumber.from('0'), BigNumber.from('0')], true))

      const inputTokenAmount = new TokenAmount(weightedPool.tokenFromIndex(inIndex), inAmount.toBigInt())

      const output = weightedPool.getOutputAmount(inputTokenAmount, outIndex)
      console.log("input", inputTokenAmount.toFixed())
      console.log("output Token Amount Manual", output.toFixed())


      const amountsIn = ['0', '0', '1000000000000000000', '1000000000000000000'].map((num) => BigNumber.from(num))
      const bench = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateTokenAmount(amountsIn, 'false')
      console.log("getLiquidityAmount original FALSE", bench)
      console.log("getLiquidityAmount manual FALSE", weightedPool.getLiquidityAmount(amountsIn, false))



      const valueInUSDC = weightedPool.getLiquidityValue(0, ['1000000', '1000000', '1000000000000000000', '1000000000000000000'].map((num) => BigNumber.from(num)))
      console.log("USDCVAL", valueInUSDC.toSignificant(6))


      const testmounts1 = [
        BigNumber.from('1000000'),
        BigNumber.from('1000000'),
        BigNumber.from('1000000000000000000'),
        BigNumber.from('1000000000000000000')
      ]
      console.log('[1000000,1000000,1000000000000000000,1000000000000000000]')
      const bench4 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateTokenAmount(testmounts1, 'false')

      console.log("real Benchmark from chain", bench4.toString())
      console.log(" manual", weightedPool.getLiquidityAmount(testmounts1, false))


      const testmounts = [
        BigNumber.from('4271223161'),
        BigNumber.from('4873535604'),
        BigNumber.from('4832883727052462339141'),
        BigNumber.from('1391067960274494353613')
      ]

      const bench1 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateTokenAmount(testmounts, 'false')

      console.log("real Benchmark from chain", bench1.toString())

      console.log("---- calulate swap given out")
      const y = weightedPool.calculateSwapGivenOut(0, 1, BigNumber.from("1239123"))

      const bench5 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateSwapGivenOut(
        '0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA',
        '0xffB3ed4960Cac85372e6838fbc9ce47bcF2D073E',
        BigNumber.from("1239123"))
      console.log("GIVEN OUT", y.toString(), bench5.toString())

      const y1 = weightedPool.calculateSwapGivenOut(1, 2, BigNumber.from("1239123"))

      console.log("IN", BigNumber.from("0xf4240").toString())
      const bench6 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv).calculateSwapGivenOut(
        '0xffB3ed4960Cac85372e6838fbc9ce47bcF2D073E', '0xaEA51E4FEe50a980928B4353E852797b54deacd8',
        BigNumber.from("0xf4240"))
      console.log("GIVEN OUT", y1.toString(), bench6.toString())


      // const bench2 = await new ethers.Contract(address, new ethers.utils.Interface(WeightedSwap.abi), jsonProv)
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
