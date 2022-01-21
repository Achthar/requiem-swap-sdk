import { BigNumber } from 'ethers';
import { Token, WeightedPair } from '../..';
export declare function payoutFor(value: BigNumber, bondPrice: BigNumber): BigNumber;
export declare function fullPayoutFor(value: BigNumber, pair: WeightedPair, totalSupply: BigNumber, amount: BigNumber, reqt: Token): BigNumber;
