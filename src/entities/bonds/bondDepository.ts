import { BigNumber } from 'ethers'
import { Token } from '../token';
import {  AmplifiedWeightedPair } from '../pools/weightedPair';
import { valuation } from './bondCalculator';
// import JSBI from 'jsbi';
import { fraction, decode112with18 } from './fixedPoint';

const ONE_E16 = BigNumber.from('10000000000000000')
const ONE_E18 = BigNumber.from('10000000000000000')
const ONE_E9 = BigNumber.from('1000000000')

export interface BondTerms {
    controlVariable: BigNumber; // scaling variable for price
    vesting: BigNumber; // in blocks
    maxPayout: BigNumber; // in thousandths of a %. i.e. 500 = 0.5%
    maxDebt: BigNumber;
}

export function payoutFor(value: BigNumber, bondPrice: BigNumber): BigNumber {
    return value.mul(ONE_E18.mul(ONE_E18)).div(bondPrice).div(ONE_E18)
}


export function fullPayoutFor(
    pair: AmplifiedWeightedPair,
    currentDebt: BigNumber,
    totalSupply: BigNumber,
    amount: BigNumber,
    payoutToken: Token,
    terms: BondTerms
): BigNumber {
    const value = valuation(pair, totalSupply, amount, payoutToken)
    const bondPrice_ = bondPrice(terms.controlVariable, totalSupply, currentDebt)
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
export function bondPrice(controlVariable: BigNumber, totalSupply: BigNumber, currentDebt: BigNumber): BigNumber {
    let price_ = (controlVariable.mul(debtRatio(totalSupply, currentDebt)).add(ONE_E18)).div(ONE_E16);
    return price_
}


/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */
export function bondPriceUsingDebtRatio(controlVariable: BigNumber, debtRatio: BigNumber): BigNumber {
    return controlVariable.mul(debtRatio).div(ONE_E18);

}

export function fullPayoutForUsingDebtRatio(
    pair: AmplifiedWeightedPair,
    debtRatio: BigNumber,
    totalSupply: BigNumber,
    amount: BigNumber,
    payoutToken: Token,
    terms: BondTerms
): BigNumber {
    const value = valuation(pair, totalSupply, amount, payoutToken)
    const bondPrice_ = bondPriceUsingDebtRatio(terms.controlVariable, debtRatio)
    return payoutFor(value, bondPrice_)
}