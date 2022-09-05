import { Price } from '../../fractions/price';
import { TokenAmount } from '../../fractions/tokenAmount';
import { BigNumber } from '@ethersproject/bignumber';
import { BigintIsh } from '../../../constants';
import { Token } from '../../token';
import { PoolType, Pool } from '../pool';
import { ChainId } from '../../currency';
export declare class AmplifiedWeightedPair extends Pool {
    readonly address: string;
    readonly tokens: Token[];
    tokenBalances: BigNumber[];
    virtualReserves: BigNumber[];
    readonly liquidityToken: Token;
    private readonly weights;
    private readonly fee;
    private readonly ampBPS;
    readonly type: PoolType;
    _name: string;
    static getAddress(tokenA: Token, tokenB: Token, weightA: BigNumber): string;
    constructor(tokens: Token[], tokenBalances: BigNumber[], virtualReserves: BigNumber[], weightA: BigNumber, fee: BigNumber, amp: BigNumber, address?: string);
    static fromBigIntish(tokens: Token[], tokenBalances: BigintIsh[], virtualReserves: BigintIsh[], weightA: BigintIsh, fee: BigintIsh, amp: BigintIsh, address?: string): AmplifiedWeightedPair;
    getAddressForRouter(): string;
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    get amp(): BigNumber;
    /**
     * Returns the current mid price of the pair in terms of token0 in virtual reserves
     */
    get token0Price(): Price;
    /**
     * Returns the current mid price of the pair in terms of token1 in virtual reserves
     */
    get token1Price(): Price;
    poolPrice(tokenIn: Token, _: Token): Price;
    get fee0(): BigNumber;
    poolPriceBases(tokenIn: Token, _: Token): {
        priceBaseIn: BigNumber;
        priceBaseOut: BigNumber;
    };
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
    get virtualReserve0(): TokenAmount;
    get virtualReserve1(): TokenAmount;
    get weight0(): BigNumber;
    get weight1(): BigNumber;
    reserveOf(token: Token): BigNumber;
    virtualReserveOf(token: Token): BigNumber;
    weightOf(token: Token): BigNumber;
    getLiquidityMinted(totalSupply: TokenAmount, tokenAmountA: TokenAmount, tokenAmountB: TokenAmount): TokenAmount;
    getLiquidityValue(token: Token, totalSupply: TokenAmount, liquidity: TokenAmount, feeOn?: boolean, kLast?: BigintIsh): TokenAmount;
    /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
    get token0PriceRaw(): Price;
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    get token1PriceRaw(): Price;
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    priceRatioOf(token: Token): Price;
    calculateSwapGivenIn(tokenIn: Token, tokenOut: Token, inAmount: BigNumber): BigNumber;
    calculateSwapGivenOut(tokenIn: Token, tokenOut: Token, outAmount: BigNumber): BigNumber;
    getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pool];
    getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pool];
    adjustForSwap(amountIn: TokenAmount, amountOut: TokenAmount): void;
    clone(): AmplifiedWeightedPair;
    getName(): string;
}
