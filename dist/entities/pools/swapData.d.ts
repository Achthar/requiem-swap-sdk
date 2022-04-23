import { BigNumber } from "ethers";
import { ChainId } from "../currency";
import { TokenAmount } from "../fractions";
import { Token } from "../token";
import { Pool, PoolDictionary } from "./pool";
export declare class SwapData {
    readonly tokenIn: Token;
    readonly tokenOut: Token;
    readonly poolRef: string;
    priceBaseIn: BigNumber | undefined;
    priceBaseOut: BigNumber | undefined;
    constructor(tokenIn: Token, tokenOut: Token, poolRef: string);
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
 * @param pool input pool to generate pair from
 * @returns pair route
 */
    static singleDataFromPool(tokenIn: Token, tokenOut: Token, pool: Pool): SwapData;
    fetchPoolPrice(poolDict: PoolDictionary): void;
}
