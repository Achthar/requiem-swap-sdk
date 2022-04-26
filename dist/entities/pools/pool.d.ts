import { BigNumber } from 'ethers';
import { Token } from '../token';
import { Price, TokenAmount } from '../fractions';
/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export declare abstract class Pool {
    abstract readonly tokens: Token[];
    abstract tokenBalances: BigNumber[];
    abstract readonly address: string;
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    tokenFromIndex(index: number): Token;
    indexFromToken(token: Token): number;
    getBalances(): BigNumber[];
    abstract calculateSwapGivenIn(tokenIn: Token, tokenOut: Token, inAmount: BigNumber): BigNumber;
    abstract calculateSwapGivenOut(tokenIn: Token, tokenOut: Token, outAmount: BigNumber): BigNumber;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): number;
    token(index: number): Token;
    reserveOf(token: Token): BigNumber;
    setBalanceValueByIndex(index: number, newBalance: BigNumber): void;
    getTokenBalances(): TokenAmount[];
    setTokenBalances(tokenBalances: BigNumber[]): void;
    subtractBalanceValue(tokenAmount: TokenAmount): void;
    abstract poolPrice(tokenIn: Token, tokenOut: Token): Price;
    abstract poolPriceBases(tokenIn: Token, tokenOut: Token): {
        priceBaseIn: BigNumber;
        priceBaseOut: BigNumber;
    };
}
export declare enum PoolType {
    Pair = "Pair",
    StablePairWrapper = "StablePairWrapper",
    AmplifiedWeightedPair = "AmplifiedWeightedPair",
    PoolPairWrapper = "PoolPairWrapper"
}
export declare type PoolDictionary = {
    [id: string]: Pool;
};
export declare type PoolHops = {
    [tokenAddress: string]: Set<Token>;
};
