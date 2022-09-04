import { BigNumber } from "ethers";
import invariant from "tiny-invariant";
import { ChainId } from "../currency";
import { TokenAmount } from "../fractions";
import { Token } from "../token";
import { Pool, PoolDictionary } from "./pool";

export interface SwapReturn {
    amount: TokenAmount;
    pool: { [id: string]: Pool };
}

// class that stores data for a Pair to swap through
// does not store any pricing or calculation functions - these are used through the poolId which is taken from a pool dictionary
// these pools are then used for pricing
export class SwapData {

    public readonly tokenIn: Token
    public readonly tokenOut: Token
    public readonly poolRef: string
    public pool: Pool | null

    // these are for saving the pool price with not using the price class as it would store the token object twice
    public priceBaseIn: BigNumber | undefined
    public priceBaseOut: BigNumber | undefined

    constructor(tokenIn: Token, tokenOut: Token, poolRef: string) {
        // invariant(!tokenIn.equals(tokenOut), 'TOKEN')
        this.tokenIn = tokenIn
        this.tokenOut = tokenOut
        this.poolRef = poolRef
        this.pool = null;

    }

    public calculateSwapGivenOut(
        tokenOutAmount: TokenAmount,
        poolDict: { [id: string]: Pool }
    ): TokenAmount {
        return new TokenAmount(this.tokenIn, poolDict[this.poolRef].calculateSwapGivenOut(this.tokenIn, tokenOutAmount.token, tokenOutAmount.raw))
    }

    public calculateSwapGivenIn(
        tokenInAmount: TokenAmount,
        poolDict: { [id: string]: Pool }
    ): TokenAmount {
        return new TokenAmount(this.tokenOut, poolDict[this.poolRef].calculateSwapGivenIn(tokenInAmount.token, this.tokenOut, tokenInAmount.raw))
    }


    public calculateSwapGivenOutAmendingPool(
        tokenOutAmount: TokenAmount,
        poolDict: { [id: string]: Pool }
    ): TokenAmount {
        // const poolDictCopy = { ...poolDict }
        const refPool: Pool = Object.assign({}, poolDict[this.poolRef]);
        const amount = new TokenAmount(this.tokenIn, refPool.calculateSwapGivenOut(this.tokenIn, tokenOutAmount.token, tokenOutAmount.raw))
        poolDict[this.poolRef] = refPool;
        return amount
    }

    public calculateSwapGivenInAmendingPool(
        tokenInAmount: TokenAmount,
        poolDict: { [id: string]: Pool }
    ): TokenAmount {
        // const poolDictCopy = { ...poolDict }
        const refPool: Pool = Object.assign({}, poolDict[this.poolRef]);
        const amount = new TokenAmount(this.tokenOut, refPool.calculateSwapGivenIn(tokenInAmount.token, this.tokenOut, tokenInAmount.raw))
        refPool.adjustForSwap(tokenInAmount, amount)
        poolDict[this.poolRef] = refPool;
        return amount

    }

    public get chainId(): ChainId { return this.tokenIn.chainId }

    public involvesToken(token: Token) {
        return this.tokenIn.address === token.address || this.tokenOut.address === token.address
    }

    /**
     *  Calculate the mid price for a pool - if possible
     * @param tokenIn in token for price
     * @param tokenOut out/ quote token for price
     * @param poolDict pool dictionary to fetch the underlying pool from
     * @returns price object
     */
    public poolPrice(poolDict: { [id: string]: Pool }) {
        return poolDict[this.poolRef].poolPrice(this.tokenIn, this.tokenOut)
    }


    /**
 * @param pool input pool to generate pair from
 * @returns pair route
 */
    public static singleDataFromPool(tokenIn: Token, tokenOut: Token, pool: Pool): SwapData {
        invariant(pool.tokens.includes(tokenIn) && pool.tokens.includes(tokenOut))
        const data = new SwapData(tokenIn, tokenOut, pool.address)
        data.pool = pool
        return data;

    }

    public fetchPoolPrice(poolDict: PoolDictionary) {
        const { priceBaseIn, priceBaseOut } = poolDict[this.poolRef].poolPriceBases(this.tokenIn, this.tokenOut)
        this.priceBaseIn = priceBaseIn
        this.priceBaseOut = priceBaseOut
    }

    public setPool(pool: Pool) {
        this.pool = pool;
    }

}