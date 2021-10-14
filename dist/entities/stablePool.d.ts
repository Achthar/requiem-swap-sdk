import { Price } from './fractions/price';
import { TokenAmount } from './fractions/tokenAmount';
import { BigintIsh, ChainId } from '../constants';
import { Token } from './token';
/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export declare class StablePool {
    readonly liquidityToken: Token;
    private readonly tokenAmounts;
    static getAddress(chainId: number): string;
    constructor(tokenAmounts: {
        [index: number]: TokenAmount;
    });
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    currencyFromIndex(index: number): Token;
    calculateSwapViaIndex(inIndex: number, outIndex: number, inAmount: BigintIsh, chainId: number, provider?: import("@ethersproject/providers").BaseProvider): Promise<Price>;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): ChainId;
    token(index: number): Token;
    reserveOf(token: Token): TokenAmount;
}
