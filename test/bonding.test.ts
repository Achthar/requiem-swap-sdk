import { ChainId, Token, TokenAmount, WeightedPair } from '../src'
import { valuation, sqrrt, getTotalValue } from '../src/entities/bonding'
import JSBI from 'jsbi'
import { BigNumber } from '@ethersproject/bignumber'

describe('Bonding', () => {

  const DAI = new Token(ChainId.AVAX_TESTNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const REQT = new Token(ChainId.AVAX_TESTNET, '0x78e418385153177cB1c49e58eAB5997192998bf7', 18, 'REQT', 'RequiemToken')

  const weightREQT = JSBI.BigInt('80')
  const fee = JSBI.BigInt('14')

  const reqtPair = new WeightedPair(new TokenAmount(REQT, '8000000000000000000000'), new TokenAmount(DAI, '2000000000000000000000'), weightREQT, fee)

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
    // expect(y).toEqual(BigNumber.from('39941507181798454000'))

  })
})
