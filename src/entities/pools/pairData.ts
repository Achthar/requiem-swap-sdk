import { ChainId } from "../currency";
import { TokenAmount } from "../fractions";
import { Token } from "../token";
import { Pool } from "./pool";
import { SwapData } from "./swapData";


// class that stores data for a Pair to swap through
// does not store any pricing or calculation functions - these are used through the poolId which is taken from a pool dictionary
// these pools are then used for pricing
export class PairData {

    public readonly token0: Token
    public readonly token1: Token
    public readonly poolRef: string
    constructor(token0: Token, token1: Token, poolRef: string) {
        this.token0 = token0
        this.token1 = token1
        this.poolRef = poolRef

    }

    public calculateSwapGivenOut(
        tokenOutAmount: TokenAmount,
        poolDict: { [id: string]: Pool }
    ): TokenAmount {
        const tokenIn = tokenOutAmount.token.equals(this.token0) ? this.token1 : this.token0
        return new TokenAmount(tokenIn, poolDict[this.poolRef].calculateSwapGivenOut(tokenIn, tokenOutAmount.token, tokenOutAmount.raw))
    }

    public calculateSwapGivenIn(
        tokenInAmount: TokenAmount,
        poolDict: { [id: string]: Pool }
    ): TokenAmount {
        const tokenOut = tokenInAmount.token.equals(this.token0) ? this.token1 : this.token0
        return new TokenAmount(tokenOut, poolDict[this.poolRef].calculateSwapGivenIn(tokenInAmount.token, tokenOut, tokenInAmount.raw))
    }

    public get chainId(): ChainId { return this.token0.chainId }

    public involvesToken(token: Token) {
        return this.token0.address === token.address || this.token1.address === token.address
    }

    /**
     *  Calculate the mid price for a pool - if possible
     * @param tokenIn in token for price
     * @param tokenOut out/ quote token for price
     * @param poolDict pool dictionary to fetch the underlying pool from
     * @returns price object
     */
    public poolPrice(tokenIn: Token, tokenOut: Token, poolDict: { [id: string]: Pool }) {
        return poolDict[this.poolRef].poolPrice(tokenIn, tokenOut)
    }

    /**
     * Pools with n > 2 tokens generate (n^2-n)/2 possible pair routes to trade
     * The fubnction creates these pair routes
     * @param pool input pool to generate pairs from
     * @returns pair routes
     */
    public static dataFromPool(pool: Pool): PairData[] {
        let pairData = []

        for (let i = 0; i < pool.tokenBalances.length; i++) {
            for (let j = 0; j < i; j++) {
                pairData.push(new PairData(pool.tokens[i], pool.tokens[j], pool.address))
            }
        }
        return pairData
    }

    /**
     * @param pool input pool to generate pair from
     * @returns pair route
     */
    public static singleDataFromPool(index0: number, index1: number, pool: Pool): PairData {
        return new PairData(pool.tokens[index0], pool.tokens[index1], pool.address)
    }

    /**
     * Pools with n > 2 tokens generate (n^2-n)/2 possible pair routes to trade
     * The fubnction creates these pair routes
     * @param pool input pool to generate pairs from
     * @returns pair routes
     */
    public static dataFromPools(pools: Pool[]): PairData[] {
        let pairData = []
        for (let k = 0; k < pools.length; k++) {
            const pool = pools[k]
            for (let i = 0; i < pool.tokenBalances.length; i++) {
                for (let j = 0; j < i; j++) {
                    pairData.push(new PairData(pool.tokens[i], pool.tokens[j], pool.address))
                }
            }
        }
        return pairData
    }

    /**
     * Converts unordered pair to directioned swap pair
     * @param tokenIn in token, the other will be tokenOut
     * @returns SwapData object
     */
    public toSwapDataFrom(tokenIn: Token): SwapData {
        return new SwapData(tokenIn, this.token0.equals(tokenIn) ? this.token1 : this.token0, this.poolRef)
    }

    /**
    * Converts unordered pair to directioned swap pair
    * @param tokenIn in token, the other will be tokenOut
    * @returns SwapData object
    */
    public toSwapDataTo(tokenOut: Token): SwapData {
        return new SwapData(this.token0.equals(tokenOut) ? this.token1 : this.token0, tokenOut, this.poolRef)
    }

    /**
     * Converts unordered swap pairs to swap route
     * @param pairData input pair array - has to be a route to make sense
     * @param tokenIn 
     * @returns 
     */
    public static toSwapArrayFrom(pairData: PairData[], tokenIn: Token): SwapData[] {
        let swaps = []
        let currentIn = tokenIn
        for (let i = 0; i < pairData.length; i++) {
            const swap = pairData[i].toSwapDataFrom(currentIn)
            swaps.push(swap)
            currentIn = swap.tokenOut
        }
        return swaps
    }

    /**
 * Converts unordered swap pairs to swap route
 * @param pairData input pair array - has to be a route to make sense
 * @param tokenIn 
 * @returns 
 */
    public static toSwapArrayTo(pairData: PairData[], tokenOut: Token): SwapData[] {
        let swaps = new Array(pairData.length)
        let currentOut = tokenOut
        for (let i = pairData.length - 1; i >= 0; i--) {
            const swap = pairData[i].toSwapDataTo(currentOut)
            swaps[i] = swap
            currentOut = swap.tokenIn
        }
        return swaps
    }


}