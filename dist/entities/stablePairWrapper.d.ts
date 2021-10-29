import { StablePool } from "./stablePool";
import { Token } from "./token";
import { Price } from "./fractions/price";
import { TokenAmount } from "./fractions/tokenAmount";
import { BigNumber } from "@ethersproject/bignumber";
import { Source } from './source';
import { ChainId } from "./../constants";
export declare class StablePairWrapper implements Source {
    readonly tokenAmounts: TokenAmount[];
    readonly stableIndexes: number[];
    readonly pricingBasesIn: TokenAmount[];
    readonly pricingBasesOut: TokenAmount[];
    readonly type: string;
    readonly referenceMidPrices: Price[];
    readonly liquidityToken: Token;
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
    getOutputAmount(inputAmount: TokenAmount, stablePool: StablePool): [TokenAmount, StablePairWrapper];
    getInputAmount(outputAmount: TokenAmount, stablePool: StablePool): [TokenAmount, StablePairWrapper];
    static wrapPairsFromPool(stablePool: StablePool): StablePairWrapper[];
}
