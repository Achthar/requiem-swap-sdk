import { ChainId } from '../constants';
import { Currency } from './currency';
import { Token } from './token';
import { Pair } from './pair';
import { Price } from './fractions/price';
import { StablePool } from './stablePool';
export declare class RouteV3 {
    readonly stablePool: StablePool;
    readonly pairs: Pair[];
    readonly path: Token[];
    readonly input: Currency;
    readonly output: Currency;
    readonly midPrice: Price;
    constructor(pairs: Pair[], input: Currency, output?: Currency, stablePool?: StablePool);
    connectPairs(): void;
    get chainId(): ChainId;
}
