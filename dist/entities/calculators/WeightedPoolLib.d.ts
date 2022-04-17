import { WeightedSwapStorage } from "./weightedSwapStorage";
import { BigNumber } from '@ethersproject/bignumber';
export declare function calculateRemoveLiquidityOneTokenExactIn(self: WeightedSwapStorage, outIndex: number, lpAmount: BigNumber, lpSupply: BigNumber, tokenBalances: BigNumber[]): {
    amountOut: BigNumber;
    swapFee: BigNumber;
};
export declare function calculateRemoveLiquidityExactIn(self: WeightedSwapStorage, lpAmount: BigNumber, lpSupply: BigNumber, tokenBalances: BigNumber[]): BigNumber[];
/**
 * Estimate amount of LP token minted or burned at deposit or withdrawal
 */
export declare function calculateTokenAmount(self: WeightedSwapStorage, amounts: BigNumber[], lpSupply: BigNumber, deposit: boolean, tokenBalances: BigNumber[]): BigNumber;
export declare function calculateSwapGivenIn(self: WeightedSwapStorage, inIndex: number, outIndex: number, amountIn: BigNumber, tokenBalances: BigNumber[]): BigNumber;
export declare function calculateSwapGivenOut(self: WeightedSwapStorage, inIndex: number, outIndex: number, amountOut: BigNumber, tokenBalances: BigNumber[]): BigNumber;
export declare function _xp(balances: BigNumber[], rates: BigNumber[]): BigNumber[];
