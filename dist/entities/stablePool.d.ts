import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import { SwapStorage } from './swapStorage';
import { BigintIsh, ChainId } from '../constants';
import { Token } from './token';
import { TokenAmount } from '../entities/fractions/tokenAmount';
import { Pair } from './pair';
/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export declare class StablePool {
    readonly liquidityToken: Token;
    readonly tokens: {
        [index: number]: Token;
    };
    tokenBalances: BigNumber[];
    _A: BigNumber;
    swapStorage: SwapStorage;
    blockTimestamp: BigNumber;
    readonly lpTotalSupply: BigNumber;
    currentWithdrawFee: BigNumber;
    static getAddress(chainId: number): string;
    constructor(tokens: {
        [index: number]: Token;
    }, tokenBalances: BigNumber[], _A: BigNumber, swapStorage: SwapStorage, blockTimestamp: number, lpTotalSupply: BigNumber, currentWithdrawFee: BigNumber);
    static mock(): StablePool;
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    set setCurrentWithdrawFee(feeToSet: BigNumber);
    tokenFromIndex(index: number): Token;
    indexFromToken(token: Token): number;
    getBalances(): BigNumber[];
    generatePairs(pairs: Pair[]): Pair[];
    calculateSwapViaPing(inIndex: number, outIndex: number, inAmount: BigintIsh, provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh>;
    calculateSwap(inIndex: number, outIndex: number, inAmount: BigNumber): BigNumber;
    getOutputAmount(inputAmount: TokenAmount, outIndex: number): TokenAmount;
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
    setSwapStorage(swapStorage: SwapStorage): void;
    setTokenBalances(tokenBalances: BigNumber[]): void;
    setBlockTimestamp(blockTimestamp: BigNumber): void;
}
