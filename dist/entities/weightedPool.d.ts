import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import { WeightedSwapStorage } from './calculators/weightedSwapStorage';
import { BigintIsh, ChainId } from '../constants';
import { Token } from './token';
import { TokenAmount } from './fractions/tokenAmount';
/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export declare class WeightedPool {
    readonly poolAddress: string;
    readonly liquidityToken: Token;
    readonly tokens: {
        [index: number]: Token;
    };
    tokenBalances: BigNumber[];
    swapStorage: WeightedSwapStorage;
    blockTimestamp: BigNumber;
    lpTotalSupply: BigNumber;
    static getRouterAddress(chainId: number): string;
    static getLpAddress(chainId: number): string;
    constructor(poolAddress: string, tokens: {
        [index: number]: Token;
    }, tokenBalances: BigNumber[], swapStorage: WeightedSwapStorage, blockTimestamp: number, lpTotalSupply: BigNumber);
    static mock(): WeightedPool;
    getAddressForRouter(): string;
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    tokenFromIndex(index: number): Token;
    indexFromToken(token: Token): number;
    getBalances(): BigNumber[];
    calculateSwapViaPing(inIndex: number, outIndex: number, inAmount: BigNumber | BigintIsh, provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh>;
    calculateSwapGivenIn(inIndex: number, outIndex: number, inAmount: BigNumber): BigNumber;
    calculateSwapGivenOut(inIndex: number, outIndex: number, outAmount: BigNumber): BigNumber;
    getOutputAmount(inputAmount: TokenAmount, outIndex: number): TokenAmount;
    getInputAmount(outputAmount: TokenAmount, inIndex: number): TokenAmount;
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
    setBlockTimestamp(blockTimestamp: BigNumber): void;
    setLpTotalSupply(totalSupply: BigNumber): void;
    setBalanceValueByIndex(index: number, newBalance: BigNumber): void;
    setBalanceValue(tokenAmount: TokenAmount): void;
    addBalanceValue(tokenAmount: TokenAmount): void;
    subtractBalanceValue(tokenAmount: TokenAmount): void;
    clone(): WeightedPool;
}
