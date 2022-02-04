import { ChainId, Token, TokenAmount, WeightedPair } from '../src'
import { valuation, sqrrt, getTotalValue } from '../src/entities/bonds/bondCalculator'
import JSBI from 'jsbi'
import { BigNumber } from '@ethersproject/bignumber'
import { payoutFor, fullPayoutFor } from '../src/entities/bonds/bondDepository'

describe('Bonding', () => {

  const DAI = new Token(ChainId.AVAX_TESTNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const REQT = new Token(ChainId.AVAX_TESTNET, '0x78e418385153177cB1c49e58eAB5997192998bf7', 18, 'REQT', 'RequiemToken')

  const weightREQT = JSBI.BigInt('80')
  const fee = JSBI.BigInt('14')

  const reqtPair = new WeightedPair(new TokenAmount(REQT, '8000000000000000000000'), new TokenAmount(DAI, '2000000000000000000000'), weightREQT, fee)

  const terms = {
    controlVariable: BigNumber.from(320), // scaling variable for price
    vesting: BigNumber.from(10000), // in blocks
    maxPayout: BigNumber.from('10000000000000000000000000'), // in thousandths of a %. i.e. 500 = 0.5%
    maxDebt: BigNumber.from('10000000000000000000000000'),
  }
  it('#calculations', () => {
    const x = BigNumber.from(100000000)
    const testSqrt = sqrrt(x)
    console.log("--sqrt res", testSqrt.toString())

    const totalSupply = sqrrt(reqtPair.reserve0.toBigNumber().mul(reqtPair.reserve1.toBigNumber()))

    const amount = totalSupply.div(BigNumber.from(100000))

    const z = getTotalValue(reqtPair, REQT)
    console.log("--total value", z.toString())

    const y = valuation(reqtPair, totalSupply, amount, REQT)
    console.log("--valuation res", y.toString())

    const val = BigNumber.from('325524309532532')

    const bp = BigNumber.from('3618243645352728374')

    const payout = payoutFor(val, bp)

    const manual = JSBI.divide(
      JSBI.BigInt(val.mul(BigNumber.from('1000000000000000000')).toString()),
      JSBI.BigInt(bp.toString())
    ).toString()
    console.log("payout", payout.toString(), manual.toString())

    const currentDebt = BigNumber.from('100000000000000')
    const fullPayout = fullPayoutFor(reqtPair, currentDebt, totalSupply, amount, REQT, terms)
    // expect(y).toEqual(BigNumber.from('39941507181798454000'))

    console.log("full payout", fullPayout.toString(), (new TokenAmount(REQT, fullPayout.toString())).toSignificant(9))

  })
})
