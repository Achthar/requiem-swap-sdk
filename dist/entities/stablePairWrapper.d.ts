import { StablePool } from "./stablePool";
import { Token } from "./token";
import { Price } from "./fractions/price";
import { TokenAmount } from "./fractions/tokenAmount";
import { BigNumber } from "@ethersproject/bignumber";
import { Source } from './source';
import { ChainId } from "./../constants";
import { PoolType } from "./pool";
export declare class StablePairWrapper implements Source {
    tokenAmounts: TokenAmount[];
    readonly stableIndexes: number[];
    pricingBasesIn: TokenAmount[];
    pricingBasesOut: TokenAmount[];
    readonly type: PoolType;
    readonly referenceMidPrices: Price[];
    readonly liquidityToken: Token;
    status: string;
    constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount, indexA: number, indexB: number);
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): ChainId;
    get token0(): Token;
    get token1(): Token;
    get reserve0(): TokenAmount;
    get reserve1(): TokenAmount;
    reserveOf(token: Token): TokenAmount;
    involvesToken(token: Token): boolean;
    priceOf(token: Token, stablePool: StablePool, volume: BigNumber): Price;
    /**
 * Returns the current price at given volume of the pair in terms of token0, i.e. the ratio calculated by the stableSwap
 */
    token0Price(stablePool: StablePool, volume: BigNumber): Price;
    /**
 * Returns the current mid price of the pair in terms of token1, i.e. the ratio calculated by the stableSwap
 */
    token1Price(stablePool: StablePool, volume: BigNumber): Price;
    priceFromReserve(outToken: Token): Price;
    /**
     * function that wraps the output calculation based on a stablePool
     * @param inputAmount input amount that is used for calculating the output amount
     * @param stablePool input stablePool: IMPORTANT NOTE: the balances of that object change according to the trade logic
     * this is required as multiple trades will lead to adjusted balances in case it is routed twice or more through the pool
     * @returns the output amount as TokenAmount and the StableWrappedPair with the adjusted balances
     */
    getOutputAmount(inputAmount: TokenAmount, stablePool: StablePool): [TokenAmount, StablePairWrapper];
    /**
     * function that wraps the input calculation based on a stablePool
     * @param outputAmount output amount to calculate the input with
     * @param stablePool  input stablePool: IMPORTANT NOTE: the balances of that object change according to the trade logic
     * this is required as multiple trades will lead to adjusted balances in case it is routed twice or more through the pool
     * @returns the input TokenAmount required to obtain the target output
     */
    getInputAmount(outputAmount: TokenAmount, stablePool: StablePool): [TokenAmount, StablePairWrapper];
    static wrapPairsFromPool(stablePool: StablePool): StablePairWrapper[];
    static wrapSinglePairFromPool(stablePool: StablePool, i: number, j: number): StablePairWrapper;
}
