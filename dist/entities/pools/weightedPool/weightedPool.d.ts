import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import { WeightedSwapStorage } from '../../calculators/weightedSwapStorage';
import { BigintIsh } from '../../../constants';
import { Token } from '../../token';
import { TokenAmount } from '../../fractions/tokenAmount';
import { Pool } from '../pool';
import { Price } from '../../fractions';
import { ChainId } from '../../currency';
/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export declare class WeightedPool extends Pool {
    readonly address: string;
    readonly liquidityToken: Token;
    readonly tokens: Token[];
    tokenBalances: BigNumber[];
    swapStorage: WeightedSwapStorage;
    lpTotalSupply: BigNumber;
    static getRouterAddress(chainId: number): string;
    static getLpAddress(chainId: number): string;
    constructor(poolAddress: string, tokens: Token[], tokenBalances: BigNumber[], swapStorage: WeightedSwapStorage, lpTotalSupply: BigNumber);
    static mock(): WeightedPool;
    getAddressForRouter(): string;
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    tokenFromIndex(index: number): Token;
    indexFromToken(token: Token): number;
    calculateSwapViaPing(inToken: Token, outToken: Token, inAmount: BigNumber | BigintIsh, provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh>;
    calculateSwapGivenIn(tokenIn: Token, tokenOut: Token, inAmount: BigNumber): BigNumber;
    calculateSwapGivenOut(tokenIn: Token, tokenOut: Token, outAmount: BigNumber): BigNumber;
    getOutputAmount(inputAmount: TokenAmount, tokenOut: Token): TokenAmount;
    getInputAmount(outputAmount: TokenAmount, tokenIn: Token): TokenAmount;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): ChainId;
    token(index: number): Token;
    reserveOf(token: Token): BigNumber;
    calculateRemoveLiquidity(amountLp: BigNumber): BigNumber[];
    calculateRemoveLiquidityOneToken(amount: BigNumber, index: number): {
        [returnVal: string]: BigNumber;
    };
    getLiquidityAmount(amounts: BigNumber[], deposit: boolean): BigNumber;
    getLiquidityValue(outIndex: number, userBalances: BigNumber[]): TokenAmount;
    setSwapStorage(swapStorage: WeightedSwapStorage): void;
    setTokenBalances(tokenBalances: BigNumber[]): void;
    setLpTotalSupply(totalSupply: BigNumber): void;
    setBalanceValueByIndex(index: number, newBalance: BigNumber): void;
    setBalanceValue(tokenAmount: TokenAmount): void;
    addBalanceValue(tokenAmount: TokenAmount): void;
    subtractBalanceValue(tokenAmount: TokenAmount): void;
    clone(): WeightedPool;
    poolPrice(tokenIn: Token, tokenOut: Token): Price;
    poolPriceBases(tokenIn: Token, tokenOut: Token): {
        priceBaseIn: BigNumber;
        priceBaseOut: BigNumber;
    };
}