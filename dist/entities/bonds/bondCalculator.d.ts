import { BigNumber } from 'ethers';
import { Token, WeightedPair } from '..';
export declare function sqrrt(a: BigNumber): BigNumber;
export declare function getTotalValue(pair: WeightedPair, reqt: Token): BigNumber;
/**
* - calculates the value in reqt of the input LP amount provided
* @param _pair general pair that has the RequiemSwap interface implemented
* @param amount_ the amount of LP to price in REQT
*  - is consistent with the uniswapV2-type case
*/
export declare function valuation(pair: WeightedPair, totalSupply: BigNumber, amount: BigNumber, reqt: Token): BigNumber;
export declare function markdown(pair: WeightedPair, reqt: Token): BigNumber;
