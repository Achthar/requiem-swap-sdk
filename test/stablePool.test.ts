// import { ChainId, Token} from '../src'
// import { StablesFetcher } from '../src/stablesFetcher'
// import { ethers } from 'ethers'
// import { SwapStorage } from '../src/entities/swapStorage'
// import { _getAPrecise, _xp, _distance, _getD, _sumOf, _getY } from '../src/entities/stableCalc'
// // import HDWalletProvider from '@truffle/hdwallet-provider'
// // import JSBI from 'jsbi'
// // import { getNetwork } from '@ethersproject/networks'
// // import { getDefaultProvider } from '@ethersproject/providers'
// // import { TokenAmount } from '../src/entities/fractions/tokenAmount'
// // import { Pair } from './entities/pair'
// import { StablePool } from '../src/entities/stablePool'
// import { BigNumber } from 'ethers'
// // import IPancakePair from '@pancakeswap-libs/pancake-swap-core/build/IPancakePair.json'
// // import invariant from 'tiny-invariant'
// import IERC20 from '../src/abis/IERC20.json'
// import StableSwap from '../src/abis/RequiemStableSwap.json'
// import * as dotenv from 'dotenv';
// import { TokenAmount } from '../src//entities'
// import { STABLES_INDEX_MAP } from '../src/entities/stables'

describe('StablePool',  () => {
  jest.setTimeout(30000);

  describe('fetcher',  () => {
    it('constructor test', async () => {
    //   dotenv.config();
    //   console.log('start fetchings', dotenv)
    //   // start set up
    //   const chainId = 43113
    //   // const pk: string = '0x' + process.env.PK_1 || '';

    //   // const mn = process.env.MNEMONIC as string
    //   // const wallet = ethers.Wallet.fromMnemonic(mn)

    //   // const ethersNode = ethers.HDNode.fromMnemonic(mn)
    //   const jsonProv = await new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
    //   // console.log("provider", jsonProv)
    //   // let wallet = new ethers.Wallet(pk, jsonProv);
    //   // const signer = await jsonProv.getSigner(wallet.address)
    //   // const signer = new ethers.providers.JsonRpcSigner(jsonProv )
    //   // let prov = ethers.providers.getDefaultProvider(new ethers.providers.JsonRpcSigner());
    //   // let walletWithProvider = new ethers.Wallet(pk, prov);
    //   //console.log("wallet", walletWithProvider)
    //   // console.log("signer", await signer.getBalance())

    //   // const tx = {
    //   //   to: "0xf67c17F9eB5CB0eB71628714E2bA0bDe8d92d5CC",
    //   //   value: ethers.constants.One
    //   // }

    //   // end setup providers

    //   const address = StablePool.getAddress(chainId)
    //   // console.log("address", address)
    //   const tokenAddresses = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getTokens()
    //   // console.log("TokenAddresses", tokenAddresses)
    //   const tokenReserves = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getTokenBalances()
    //   // console.log("TokenReserves", tokenReserves)
    //   let indexes = []
    //   for (let i = 0; i < tokenAddresses.length; i++) {
    //     indexes.push(i)
    //   }

    //   const lpAddress = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getLpToken()
    //   const lpTotalSupply = await new ethers.Contract(lpAddress, new ethers.utils.Interface(IERC20), jsonProv).totalSupply()
    //   // console.log("Total Suopply LP", lpTotalSupply)
    //   // const tokenMap = Object.assign({},
    //   //   ...(tokenAddresses as string[]).map((_, index) => ({
    //   //     [index]: new TokenAmount(
    //   //       STABLES_INDEX_MAP[chainId][index],
    //   //       tokenReserves[index])
    //   //   })))
    //   const _A = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).getA()
    //   // console.log("_A", _A)

    //   const swapStorageRaw = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).swapStorage()
    //   console.log("SS", swapStorageRaw)
    //   const manualSS= {
    //     "lpToken": '0xDf65aC8079A71f5174A35dE3D29e5458d03D5787',
    //     "fee": BigNumber.from('0x0f4240'),
    //     "adminFee": BigNumber.from('0x012a05f200'),
    //     "initialA": BigNumber.from('0xea60'),
    //     "futureA": BigNumber.from('0xea60'),
    //     "initialATime": BigNumber.from('0x00'),
    //     "futureATime": BigNumber.from('0x00'),
    //     "defaultWithdrawFee": BigNumber.from('0x02faf080'),
    // }
    // console.log("SSComp", manualSS)
    //   // console.log("swapStorage RAW", swapStorageRaw)
    //   // console.log("MUltis", Object.values(STABLES_INDEX_MAP[chainId]).map((token) => (BigNumber.from(10)).pow(18 - token.decimals).toString()))
    //   const swapStorage = new SwapStorage(
    //     Object.values(STABLES_INDEX_MAP[chainId]).map((token) => (BigNumber.from(10)).pow(18 - token.decimals)),
    //     swapStorageRaw.fee,
    //     swapStorageRaw.adminFee,
    //     swapStorageRaw.initialA,
    //     swapStorageRaw.futureA,
    //     swapStorageRaw.initialATime,
    //     swapStorageRaw.futureATime,
    //     swapStorageRaw.lpToken)

    //   const blockNumber = await jsonProv.getBlockNumber()
    //   // console.log("BN", blockNumber)
    //   // console.log("Swap Storage Class", swapStorage)
    //   const currentWithdrawFee = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateCurrentWithdrawFee('0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B')
    //   const stablePool = new StablePool(STABLES_INDEX_MAP[chainId], tokenReserves, _A, swapStorage, blockNumber, lpTotalSupply, currentWithdrawFee)
    //   // console.log("Balances manual", stablePool.getBalances())
    //   // console.log("Balances manual numbers", stablePool.getBalances().map(val => val.toString()))
    //   // console.log("NBALS manual", swapStorage.tokenMultipliers.map((_, index) => stablePool.tokenBalances[index].mul(swapStorage.tokenMultipliers[index]).toString()))
    //   // console.log(stablePool)
    //   const inIndex = 0
    //   const outIndex = 3
    //   const swapActual = await stablePool.calculateSwapViaPing(inIndex, outIndex, '100', jsonProv)

    //   console.log("calculate swap", swapActual.toString())
    //   const inAmount = BigNumber.from('10000')
    //   const swapManual = stablePool.calculateSwap(inIndex, outIndex, inAmount)
    //   console.log("manual value", swapManual.toString())

    //   const x = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateRemoveLiquidity('0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', '100000')
    //   console.log("calculateRemoveLiquidity original", x)

    //   console.log("calculateRemoveLiquidity manual", stablePool.calculateRemoveLiquidity(BigNumber.from('100000')))


    //   const a = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateRemoveLiquidityOneToken('0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', '100000', 3)
    //   console.log("calculateRemoveLiquidityOne original", a)

    //   console.log("calculateRemoveLiquidityOne manual", stablePool.calculateRemoveLiquidityOneToken(BigNumber.from('100000'), 3))

    //   const b = await new ethers.Contract(address, new ethers.utils.Interface(StableSwap), jsonProv).calculateTokenAmount(['100000', '1000000', '100000', '1000000'], true)
    //   console.log("getLiquidityMinted original", b)

    //   console.log("getLiquidityMinted manual", stablePool.getLiquidityMinted([BigNumber.from('100000'), BigNumber.from('1000000'), BigNumber.from('100000'), BigNumber.from('1000000')], true))


    //   const inputTokenAmount = new TokenAmount(stablePool.tokenFromIndex(inIndex), inAmount.toBigInt())

    //   const output = stablePool.getOutputAmount(inputTokenAmount, outIndex)
    //   console.log("input", inputTokenAmount.toFixed())
    //   console.log("output Token Amount Manual", output.toFixed())
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
