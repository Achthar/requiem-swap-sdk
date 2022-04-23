import { BigNumber } from 'ethers';
import { Token } from '../token';
import { AmplifiedWeightedPair } from '../pools/weightedPair';
export interface BondTerms {
    controlVariable: BigNumber;
    vesting: BigNumber;
    maxPayout: BigNumber;
    maxDebt: BigNumber;
}
export declare function payoutFor(value: BigNumber, bondPrice: BigNumber): BigNumber;
export declare function fullPayoutFor(pair: AmplifiedWeightedPair, currentDebt: BigNumber, totalSupply: BigNumber, amount: BigNumber, payoutToken: Token, terms: BondTerms): BigNumber;
/**
 *  @notice calculate current ratio of debt to REQT supply
 *  @return debtRatio_ uint
 */
export declare function debtRatio(totalSupply: BigNumber, currentDebt: BigNumber): BigNumber;
/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */
export declare function bondPrice(controlVariable: BigNumber, totalSupply: BigNumber, currentDebt: BigNumber): BigNumber;
/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */
export declare function bondPriceUsingDebtRatio(controlVariable: BigNumber, debtRatio: BigNumber): BigNumber;
export declare function fullPayoutForUsingDebtRatio(pair: AmplifiedWeightedPair, debtRatio: BigNumber, totalSupply: BigNumber, amount: BigNumber, payoutToken: Token, terms: BondTerms): BigNumber;
