import { ChainId } from '../constants';
import { Currency } from './currency';
import { Token } from './token';
import { Pair } from './pair';
import { Price } from './fractions/price';
import { StablePool } from './stablePool';
import { StablePairWrapper } from './stablePairWrapper';
export declare class RouteV3 {
    readonly stablePool: StablePool;
    readonly sources: (Pair | StablePairWrapper)[];
    readonly path: Token[];
    readonly input: Currency;
    readonly output: Currency;
    readonly midPrice: Price;
    readonly pathMatrix: Token[][];
    readonly routerIds: number[];
    constructor(sources: (Pair | StablePairWrapper)[], stablePool: StablePool, input: Currency, output?: Currency);
    get chainId(): ChainId;
}
