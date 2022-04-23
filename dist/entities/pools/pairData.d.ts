import { ChainId } from "../currency";
import { TokenAmount } from "../fractions";
import { Token } from "../token";
import { Pool } from "./pool";
import { SwapData } from "./swapData";
export declare class PairData {
    readonly token0: Token;
    readonly token1: Token;
    readonly poolRef: string;
    constructor(token0: Token, token1: Token, poolRef: string);
    calculateSwapGivenOut(tokenOutAmount: TokenAmount, poolDict: {
        [id: string]: Pool;
    }): TokenAmount;
    calculateSwapGivenIn(tokenInAmount: TokenAmount, poolDict: {
        [id: string]: Pool;
    }): TokenAmount;
    get chainId(): ChainId;
    involvesToken(token: Token): boolean;
    /**
     *  Calculate the mid price for a pool - if possible
     * @param tokenIn in token for price
     * @param tokenOut out/ quote token for price
     * @param poolDict pool dictionary to fetch the underlying pool from
     * @returns price object
     */
    poolPrice(tokenIn: Token, tokenOut: Token, poolDict: {
        [id: string]: Pool;
    }): import("../fractions").Price;
    /**
     * Pools with n > 2 tokens generate (n^2-n)/2 possible pair routes to trade
     * The fubnction creates these pair routes
     * @param pool input pool to generate pairs from
     * @returns pair routes
     */
    static dataFromPool(pool: Pool): PairData[];
    /**
     * @param pool input pool to generate pair from
     * @returns pair route
     */
    static singleDataFromPool(index0: number, index1: number, pool: Pool): PairData;
    /**
     * Pools with n > 2 tokens generate (n^2-n)/2 possible pair routes to trade
     * The fubnction creates these pair routes
     * @param pool input pool to generate pairs from
     * @returns pair routes
     */
    static dataFromPools(pools: Pool[]): PairData[];
    /**
     * Converts unordered pair to directioned swap pair
     * @param tokenIn in token, the other will be tokenOut
     * @returns SwapData object
     */
    toSwapDataFrom(tokenIn: Token): SwapData;
    /**
    * Converts unordered pair to directioned swap pair
    * @param tokenIn in token, the other will be tokenOut
    * @returns SwapData object
    */
    toSwapDataTo(tokenOut: Token): SwapData;
    /**
     * Converts unordered swap pairs to swap route
     * @param pairData input pair array - has to be a route to make sense
     * @param tokenIn
     * @returns
     */
    static toSwapArrayFrom(pairData: PairData[], tokenIn: Token): SwapData[];
    /**
 * Converts unordered swap pairs to swap route
 * @param pairData input pair array - has to be a route to make sense
 * @param tokenIn
 * @returns
 */
    static toSwapArrayTo(pairData: PairData[], tokenOut: Token): SwapData[];
}
