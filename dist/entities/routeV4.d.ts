import { ChainId } from '../constants';
import { Pool } from './pool';
import { Currency } from './currency';
import { Token } from './token';
import { Price } from './fractions/price';
import { StablePool } from './stablePool';
export declare class RouteV4 {
    readonly stablePool: StablePool;
    readonly pools: Pool[];
    readonly path: Token[];
    readonly input: Currency;
    readonly output: Currency;
    readonly midPrice: Price;
    constructor(pools: Pool[], stablePool: StablePool, input: Currency, output?: Currency);
    get chainId(): ChainId;
}
