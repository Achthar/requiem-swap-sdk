import { BigNumber } from 'ethers'
import { Token, WeightedPair } from '../..';
import { valuation } from './bondCalculator';
// import JSBI from 'jsbi';
import { fraction, decode112with18 } from './fixedPoint';

const ONE_E16 = BigNumber.from('10000000000000000')
// const ONE_E18 = JSBI.BigInt('10000000000000000')

const ONE_E18 = BigNumber.from('10000000000000000')



export function payoutFor(value: BigNumber, bondPrice: BigNumber): BigNumber {
    // return BigNumber.from(
    //     JSBI.divide(
    //         JSBI.multiply(JSBI.BigInt(value.toString()), ONE_E18),
    //         JSBI.BigInt(bondPrice.toString())
    //     ).toString()
    // ).div(ONE_E16)

    return decode112with18(fraction(
        value.mul(ONE_E18),
        bondPrice
    )).div(ONE_E16)
}


export function fullPayoutFor(value: BigNumber, pair: WeightedPair, totalSupply: BigNumber, amount: BigNumber, reqt: Token): BigNumber {

    const bondPrice = valuation(pair, totalSupply, amount, reqt)

    return payoutFor(value, bondPrice)
}