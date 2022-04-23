import { ChainId } from './currency';
import { Token } from './token';
import { SwapData } from './pools/swapData';
export declare class SwapRoute {
    readonly swapData: SwapData[];
    readonly path: Token[];
    readonly input: Token;
    readonly output: Token;
    readonly identifier: string;
    constructor(swapData: SwapData[]);
    get chainId(): ChainId;
    equals(otherRoute: SwapRoute): boolean;
    static cleanRoutes(swapRoutes: SwapRoute[]): SwapRoute[];
}
