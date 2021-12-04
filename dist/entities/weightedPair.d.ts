import { Price } from './fractions/price';
import { TokenAmount } from './fractions/tokenAmount';
import JSBI from 'jsbi';
import { BigintIsh, ChainId } from '../constants';
import { Token } from './token';
import { PoolType } from './pool';
export declare class WeightedPair {
    readonly liquidityToken: Token;
    private readonly tokenAmounts;
    pricingBasesIn: TokenAmount[];
    pricingBasesOut: TokenAmount[];
    private readonly weights;
    private readonly fee;
    readonly type: PoolType;
    static getAddress(tokenA: Token, tokenB: Token, weightA: JSBI, fee: JSBI): string;
    constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount, weightA: JSBI, fee: JSBI);
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */
    get token0Price(): Price;
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    get token1Price(): Price;
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    priceOf(token: Token): Price;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): ChainId;
    get token0(): Token;
    get token1(): Token;
    get reserve0(): TokenAmount;
    get reserve1(): TokenAmount;
    get weight0(): JSBI;
    get weight1(): JSBI;
    reserveOf(token: Token): TokenAmount;
    weightOf(token: Token): JSBI;
    getOutputAmount(inputAmount: TokenAmount): [TokenAmount, WeightedPair];
    getInputAmount(outputAmount: TokenAmount): [TokenAmount, WeightedPair];
    getLiquidityMinted(totalSupply: TokenAmount, tokenAmountA: TokenAmount, tokenAmountB: TokenAmount): TokenAmount;
    getLiquidityValue(token: Token, totalSupply: TokenAmount, liquidity: TokenAmount, feeOn?: boolean, kLast?: BigintIsh): TokenAmount;
    clone(): WeightedPair;
}
