import { BigNumber } from 'ethers'
import { Token, WeightedPair } from '../..';
import { valuation } from './bondCalculator';
// import JSBI from 'jsbi';
import { fraction, decode112with18 } from './fixedPoint';

const ONE_E16 = BigNumber.from('10000000000000000')
const ONE_E18 = BigNumber.from('10000000000000000')
const ONE_E9 = BigNumber.from('1000000000')

export interface BondTerms {
    controlVariable: BigNumber; // scaling variable for price
    vestingTerm: BigNumber; // in blocks
    minimumPrice: BigNumber; // vs principle value
    maxPayout: BigNumber; // in thousandths of a %. i.e. 500 = 0.5%
    fee: BigNumber; // as % of bond payout, in hundreths. ( 500 = 5% = 0.05 for every 1 paid)
    maxDebt: BigNumber;
}

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


export function fullPayoutFor(
    pair: WeightedPair,
    currentDebt: BigNumber,
    totalSupply: BigNumber,
    amount: BigNumber,
    payoutToken: Token,
    terms: BondTerms
): BigNumber {
    const value = valuation(pair, totalSupply, amount, payoutToken)
    const bondPrice_ = bondPrice(terms.controlVariable, totalSupply, currentDebt, terms.minimumPrice)
    return payoutFor(value, bondPrice_)
}


/**
 *  @notice calculate current ratio of debt to REQT supply
 *  @return debtRatio_ uint
 */
export function debtRatio(totalSupply: BigNumber, currentDebt: BigNumber): BigNumber {

    return decode112with18(fraction(currentDebt.mul(ONE_E9), totalSupply)).div(
        ONE_E18);
}


/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */
export function bondPrice(controlVariable: BigNumber, totalSupply: BigNumber, currentDebt: BigNumber, minimumPrice: BigNumber): BigNumber {
    let price_ = (controlVariable.mul(debtRatio(totalSupply, currentDebt)).add(ONE_E18)).div(ONE_E16);
    if (price_.lt(minimumPrice)) {
        price_ = minimumPrice;
    }
    return price_
}
