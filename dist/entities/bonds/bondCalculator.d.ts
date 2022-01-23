import { BigNumber } from 'ethers';
import { Token, WeightedPair } from '..';
export declare function sqrrt(a: BigNumber): BigNumber;
export declare function getTotalValue(pair: WeightedPair, payoutToken: Token): BigNumber;
/**
* - calculates the value in payoutToken of the input LP amount provided
* @param _pair general pair that has the RequiemSwap interface implemented
* @param amount_ the amount of LP to price in REQT
*  - is consistent with the uniswapV2-type case
*/
export declare function valuation(pair: WeightedPair, totalSupply: BigNumber, amount: BigNumber, payoutToken: Token): BigNumber;
export declare function markdown(pair: WeightedPair, payoutToken: Token): BigNumber;
