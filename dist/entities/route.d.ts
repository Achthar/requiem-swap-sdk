import { Pool, PoolDictionary } from './pools/pool';
import { ChainId, Currency } from './currency';
import { Token } from './token';
import { Price } from './fractions/price';
import { PairData } from './pools/pairData';
/**
 *
 * @param pools pools to generate pairData with, i.e. a 3-Pool generating the respective 6 pairs
 * @returns an array of the pairData
 */
export declare function pairDataFromPools(pools: Pool[]): PairData[];
export declare class Route {
    readonly pairData: PairData[];
    readonly path: Token[];
    readonly input: Currency;
    readonly output: Currency;
    readonly midPrice: Price;
    constructor(poolDict: PoolDictionary, pairData: PairData[], input: Currency, output?: Currency);
    get chainId(): ChainId;
}
