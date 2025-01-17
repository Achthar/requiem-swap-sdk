import { ethers, BigNumber } from 'ethers'
import { StableSwapStorage } from '../src/entities/calculators/stableSwapStorage'
import { _getAPrecise, _xp, _distance, _getD, _sumOf, _getY } from '../src/entities/calculators/stableCalc'
// import HDWalletProvider from '@truffle/hdwallet-provider'
// import JSBI from 'jsbi'
// import { getNetwork } from '@ethersproject/networks'
// import { getDefaultProvider } from '@ethersproject/providers'
import { TokenAmount } from '../src/entities/fractions/tokenAmount'
// import { Pair } from './entities/pair'
import { StablePool } from '../src/entities/pools/stable/stablePool'
// import IPancakePair from '@pancakeswap-libs/pancake-swap-core/build/IPancakePair.json'
// import invariant from 'tiny-invariant'
import IERC20 from '../src/abis/IERC20.json'
import StableSwap from '../src/abis/RequiemStableSwap.json'
import { STABLES_INDEX_MAP } from '../src'
// import * as dotenv from 'dotenv';

describe('StablePool', () => {
  jest.setTimeout(30000);

  describe('fetcher', () => {
    it('constructor test', async () => {
      // dotenv.config();
      // console.log('start fetchings', dotenv)
      // start set up
      const chainId = 43113
      // const pk: string = '0x' + process.env.PK_1 || '';

      // const mn = process.env.MNEMONIC as string
      // const wallet = ethers.Wallet.fromMnemonic(mn)

      // const ethersNode = ethers.HDNode.fromMnemonic(mn)
      const jsonProv = await new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
      // console.log("provider", jsonProv)
      // let wallet = new ethers.Wallet(pk, jsonProv);
      // const signer = await jsonProv.getSigner(wallet.address)
      // const signer = new ethers.providers.JsonRpcSigner(jsonProv )
      // let prov = ethers.providers.getDefaultProvider(new ethers.providers.JsonRpcSigner());
      // let walletWithProvider = new ethers.Wallet(pk, prov);
      //console.log("wallet", walletWithProvider)
      // console.log("signer", await signer.getBalance())

      // const tx = {
      //   to: "0xf67c17F9eB5CB0eB71628714E2bA0bDe8d92d5CC",
      //   value: ethers.constants.One
      // }

      // end setup providers

      const address = '0x0Be60C571BdA7841D8F6eE68afDBa648EC710fD7'
      // console.log("address", address)
      const tokenAddresses = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getTokens()
      // console.log("TokenAddresses", tokenAddresses)
      const tokenReserves = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getTokenBalances()
      // console.log("TokenReserves", tokenReserves)
      let indexes = []
      for (let i = 0; i < tokenAddresses.length; i++) {
        indexes.push(i)
      }

      const lpAddress = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getLpToken()
      const lpTotalSupply = await new ethers.Contract(lpAddress, new ethers.utils.Interface(IERC20), jsonProv).totalSupply()
      // console.log("Total Suopply LP", lpTotalSupply)
      // const tokenMap = Object.assign({},
      //   ...(tokenAddresses as string[]).map((_, index) => ({
      //     [index]: new TokenAmount(
      //       STABLES_INDEX_MAP[chainId][index],
      //       tokenReserves[index])
      //   })))
      const _A = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getA()
      // console.log("_A", _A)

      const swapStorageRaw = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).swapStorage()
      console.log("SS", swapStorageRaw)
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

      console.log("SSComp", manualSS)
      // console.log("swapStorage RAW", swapStorageRaw)
      // console.log("MUltis", Object.values(STABLES_INDEX_MAP[chainId]).map((token) => (BigNumber.from(10)).pow(18 - token.decimals).toString()))
      const swapStorage = new StableSwapStorage(
        Object.values(STABLES_INDEX_MAP[chainId]).map((token) => (BigNumber.from(10)).pow(18 - token.decimals)),
        swapStorageRaw.fee,
        swapStorageRaw.adminFee,
        swapStorageRaw.initialA,
        swapStorageRaw.futureA,
        swapStorageRaw.initialATime,
        swapStorageRaw.futureATime,
        swapStorageRaw.lpToken)

      const blockNumber = await jsonProv.getBlockNumber()
      // console.log("BN", blockNumber)
      // console.log("Swap Storage Class", swapStorage)
      console.log("--- withdrawl fee-----")
      const currentWithdrawFee = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateCurrentWithdrawFee('0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B')
      const stablePool = new StablePool(Object.values(STABLES_INDEX_MAP[chainId]), tokenReserves, _A, swapStorage, blockNumber, lpTotalSupply, currentWithdrawFee, '')
      // console.log("Balances manual", stablePool.getBalances())
      // console.log("Balances manual numbers", stablePool.getBalances().map(val => val.toString()))
      // console.log("NBALS manual", swapStorage.tokenMultipliers.map((_, index) => stablePool.tokenBalances[index].mul(swapStorage.tokenMultipliers[index]).toString()))
      // console.log(stablePool)
      const inIndex = STABLES_INDEX_MAP[chainId][0]
      const outIndex = STABLES_INDEX_MAP[chainId][1]
      console.log("--- swap via png----")
      const swapActual = await stablePool.calculateSwapViaPing(inIndex, outIndex, BigNumber.from('10000'), jsonProv)

      console.log("calculate swap", swapActual.toString())
      const inAmount = BigNumber.from('10000')
      const swapManual = stablePool.calculateSwapGivenIn(inIndex, outIndex, inAmount)
      console.log("manual value", swapManual.toString())

      const x = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateRemoveLiquidity('0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', '100000')
      console.log("calculateRemoveLiquidity original", x)

      console.log("calculateRemoveLiquidity manual", stablePool.calculateRemoveLiquidity(BigNumber.from('100000')))


      const a = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateRemoveLiquidityOneToken('0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', '100000', 3)
      console.log("calculateRemoveLiquidityOne original", a)

      console.log("calculateRemoveLiquidityOne manual", stablePool.calculateRemoveLiquidityOneToken(BigNumber.from('100000'), 3))


      const b = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateTokenAmount(['100000', '1000000', '100000', '1000000'], true)
      console.log("getLiquidityAmount original", b)


      console.log("getLiquidityAmount manual", stablePool.getLiquidityAmount([BigNumber.from('100000'), BigNumber.from('1000000'), BigNumber.from('100000'), BigNumber.from('1000000')], true))


      console.log("getLiquidityAmount manual", stablePool.getLiquidityAmount([BigNumber.from('0'), BigNumber.from('0'), BigNumber.from('0'), BigNumber.from('0')], true))

      const inputTokenAmount = new TokenAmount(inIndex, inAmount.toBigInt())

      const output = stablePool.getOutputAmount(inputTokenAmount, outIndex)
      console.log("input", inputTokenAmount.toFixed())
      console.log("output Token Amount Manual", output.toFixed())


      const amountsIn = ['0', '0', '1000000000000000000', '1000000000000000000'].map((num) => BigNumber.from(num))
      const bench = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateTokenAmount(amountsIn, 'false')
      console.log("getLiquidityAmount original FALSE", bench)
      console.log("getLiquidityAmount manual FALSE", stablePool.getLiquidityAmount(amountsIn, false))



      const valueInUSDC = stablePool.getLiquidityValue(0, ['1000000', '1000000', '1000000000000000000', '1000000000000000000'].map((num) => BigNumber.from(num)))
      console.log("USDCVAL", valueInUSDC.toSignificant(6))


      const testmounts1 = [
        BigNumber.from('1000000'),
        BigNumber.from('1000000'),
        BigNumber.from('1000000000000000000'),
        BigNumber.from('1000000000000000000')
      ]
      console.log('[1000000,1000000,1000000000000000000,1000000000000000000]')
      const bench4 = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateTokenAmount(testmounts1, 'false')

      console.log("real Benchmark from chain", bench4.toString())
      console.log(" manual", stablePool.getLiquidityAmount(testmounts1, false))


      const testmounts = [
        BigNumber.from('4271223161'),
        BigNumber.from('4873535604'),
        BigNumber.from('4832883727052462339141'),
        BigNumber.from('1391067960274494353613')
      ]

      const bench1 = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateTokenAmount(testmounts, 'false')

      console.log("real Benchmark from chain", bench1.toString())

      console.log("---- calulate swap given out")
      const y = stablePool.calculateSwapGivenOut(inIndex, outIndex, BigNumber.from("1239123"))

      const bench5 = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateSwapGivenOut(
        '0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA',
        '0xffB3ed4960Cac85372e6838fbc9ce47bcF2D073E',
        BigNumber.from("1239123"))
      console.log("GIVEN OUT", y.toString(), bench5.toString())

      const y1 = stablePool.calculateSwapGivenOut(outIndex, STABLES_INDEX_MAP[chainId][3], BigNumber.from("1239123"))

      console.log("IN", BigNumber.from("0xf4240").toString())
      const bench6 = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateSwapGivenOut(
        '0xffB3ed4960Cac85372e6838fbc9ce47bcF2D073E', '0xaEA51E4FEe50a980928B4353E852797b54deacd8',
        BigNumber.from("0xf4240"))
      console.log("GIVEN OUT", y1.toString(), bench6.toString())


      // const bench2 = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv)
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
      // const data = await StablesFetcher.fetchStablePoolData(43113,
      //   wallet.)
      // console.log(data)
      // let z = BigNumber.from(2)
      // const y = z.mul(BigNumber.from(0))
      // console.log("x", z, "y", y)
    }
    )

  })
})
