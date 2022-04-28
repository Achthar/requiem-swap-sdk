import { Percent } from './fractions/percent';
import { Price } from './fractions/price';
import { TokenAmount, InputOutput } from './fractions/tokenAmount';
import { Pool, PoolDictionary } from './pools/pool';
import { SwapRoute } from './swapRoute';
export declare enum SwapType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
export declare function inputOutputComparator(a: InputOutput, b: InputOutput): number;
export declare function tradeComparator(a: Swap, b: Swap): number;
export interface BestTradeOptions {
    maxNumResults?: number;
    maxHops?: number;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export declare class Swap {
    /**
     * The route of the trade, i.e. which pairs the trade goes through.
     */
    readonly route: SwapRoute;
    /**
     * The type of the trade, either exact in or exact out.
     */
    readonly tradeType: SwapType;
    /**
     * The input amount for the trade assuming no slippage.
     */
    readonly swapAmounts: TokenAmount[];
    /**
     * The input amount for the trade assuming no slippage.
     */
    readonly inputAmount: TokenAmount;
    /**
     * The output amount for the trade assuming no slippage.
     */
    readonly outputAmount: TokenAmount;
    readonly isValid: boolean;
    /**
     * The price expressed in terms of output amount/input amount.
     */
    readonly executionPrice: Price;
    /**
     * The percent difference between the mid price before the trade and the trade execution price.
     */
    /**
     * Constructs an exact in trade with the given amount in and route
     * @param route route of the exact in trade
     * @param amountIn the amount being passed in
     */
    static exactIn(route: SwapRoute, amountIn: TokenAmount, poolDict: {
        [id: string]: Pool;
    }): Swap;
    /**
     * Constructs an exact out trade with the given amount out and route
     * @param route route of the exact out trade
     * @param amountOut the amount returned by the trade
     */
    static exactOut(route: SwapRoute, amountOut: TokenAmount, poolDict: {
        [id: string]: Pool;
    }): Swap;
    constructor(route: SwapRoute, amount: TokenAmount, tradeType: SwapType, poolDict: {
        [id: string]: Pool;
    });
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    minimumAmountOut(slippageTolerance: Percent): TokenAmount;
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    maximumAmountIn(slippageTolerance: Percent): TokenAmount;
    /**
     *
     * @param swapRoutes input routes - should already not include duplicates
     * @param swapType determines in which direction the swap will be calculated
     * @param poolDict dictionary used to price the trade routes
     * @returns trades in an array
     */
    static PriceRoutes(swapRoutes: SwapRoute[], amount: TokenAmount, swapType: SwapType, poolDict: PoolDictionary): Swap[];
}
