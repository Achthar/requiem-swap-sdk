import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import { StableSwapStorage } from '../../calculators/stableSwapStorage';
import { BigintIsh } from '../../../constants';
import { Token } from '../../token';
import { TokenAmount } from '../../fractions/tokenAmount';
import { Pool } from '../pool';
import { Price } from '../../fractions';
/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export declare class StablePool extends Pool {
    readonly address: string;
    readonly liquidityToken: Token;
    readonly tokens: Token[];
    tokenBalances: BigNumber[];
    _A: BigNumber;
    swapStorage: StableSwapStorage;
    blockTimestamp: BigNumber;
    lpTotalSupply: BigNumber;
    currentWithdrawFee: BigNumber;
    _name: string;
    constructor(tokens: Token[], tokenBalances: BigNumber[], _A: BigNumber, swapStorage: StableSwapStorage, blockTimestamp: number, lpTotalSupply: BigNumber, currentWithdrawFee: BigNumber, poolAddress: string, lpAddress?: string);
    static mock(): StablePool;
    getAddressForRouter(): string;
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    set setCurrentWithdrawFee(feeToSet: BigNumber);
    tokenFromIndex(index: number): Token;
    indexFromToken(token: Token): number;
    getBalances(): BigNumber[];
    calculateSwapViaPing(inToken: Token, outToken: Token, inAmount: BigNumber | BigintIsh, provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh>;
    calculateSwapGivenIn(tokenIn: Token, tokenOut: Token, inAmount: BigNumber): BigNumber;
    calculateSwapGivenOut(tokenIn: Token, tokenOut: Token, outAmount: BigNumber): BigNumber;
    getOutputAmount(inputAmount: TokenAmount, tokenOut: Token): TokenAmount;
    getInputAmount(outputAmount: TokenAmount, tokenIn: Token): TokenAmount;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): number;
    token(index: number): Token;
    reserveOf(token: Token): BigNumber;
    calculateRemoveLiquidity(amountLp: BigNumber): BigNumber[];
    calculateRemoveLiquidityOneToken(amount: BigNumber, index: number): {
        [returnVal: string]: BigNumber;
    };
    getLiquidityAmount(amounts: BigNumber[], deposit: boolean): BigNumber;
    getLiquidityValue(outIndex: number, userBalances: BigNumber[]): TokenAmount;
    setSwapStorage(swapStorage: StableSwapStorage): void;
    setTokenBalances(tokenBalances: BigNumber[]): void;
    setBlockTimestamp(blockTimestamp: BigNumber): void;
    setLpTotalSupply(totalSupply: BigNumber): void;
    setBalanceValueByIndex(index: number, newBalance: BigNumber): void;
    setBalanceValue(tokenAmount: TokenAmount): void;
    addBalanceValue(tokenAmount: TokenAmount): void;
    subtractBalanceValue(tokenAmount: TokenAmount): void;
    clone(): StablePool;
    poolPrice(tokenIn: Token, tokenOut: Token): Price;
    poolPriceBases(tokenIn: Token, tokenOut: Token): {
        priceBaseIn: BigNumber;
        priceBaseOut: BigNumber;
    };
}
