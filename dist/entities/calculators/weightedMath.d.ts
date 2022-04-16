import { BigNumber } from '@ethersproject/bignumber';
export declare function _calculateInvariant(normalizedWeights: BigNumber[], balances: BigNumber[]): BigNumber;
export declare function _calcOutGivenIn(balanceIn: BigNumber, weightIn: BigNumber, balanceOut: BigNumber, weightOut: BigNumber, amountIn: BigNumber): BigNumber;
export declare function _calcInGivenOut(balanceIn: BigNumber, weightIn: BigNumber, balanceOut: BigNumber, weightOut: BigNumber, amountOut: BigNumber): BigNumber;
export declare function _calcLpOutGivenExactTokensIn(balances: BigNumber[], normalizedWeights: BigNumber[], amountsIn: BigNumber[], lpTotalSupply: BigNumber, swapFeePercentage: BigNumber): {
    lpOut: BigNumber;
    swapFees: BigNumber[];
};
/**
 * @dev Intermediate function to avoid stack-too-deep "
 */
export declare function _computeJoinExactTokensInInvariantRatio(balances: BigNumber[], normalizedWeights: BigNumber[], amountsIn: BigNumber[], balanceRatiosWithFee: BigNumber[], invariantRatioWithFees: BigNumber, swapFeePercentage: BigNumber): {
    invariantRatio: BigNumber;
    swapFees: BigNumber[];
};
export declare function _calcTokenInGivenExactLpOut(balance: BigNumber, normalizedWeight: BigNumber, lpAmountOut: BigNumber, lpTotalSupply: BigNumber, swapFeePercentage: BigNumber): {
    amountIn: BigNumber;
    swapFee: BigNumber;
};
export declare function _calcAllTokensInGivenExactLpOut(balances: BigNumber[], lpAmountOut: BigNumber, totalBPT: BigNumber): BigNumber[];
export declare function _calcLpInGivenExactTokensOut(balances: BigNumber[], normalizedWeights: BigNumber[], amountsOut: BigNumber[], lpTotalSupply: BigNumber, swapFeePercentage: BigNumber): {
    lpIn: BigNumber;
    swapFees: BigNumber[];
};
/**
 * @dev Intermediate function to avoid stack-too-deep "
 */
export declare function _computeExitExactTokensOutInvariantRatio(balances: BigNumber[], normalizedWeights: BigNumber[], amountsOut: BigNumber[], balanceRatiosWithoutFee: BigNumber[], invariantRatioWithoutFees: BigNumber, swapFeePercentage: BigNumber): {
    invariantRatio: BigNumber;
    swapFees: BigNumber[];
};
export declare function _calcTokenOutGivenExactLpIn(balance: BigNumber, normalizedWeight: BigNumber, lpAmountIn: BigNumber, lpTotalSupply: BigNumber, swapFeePercentage: BigNumber): {
    amountOut: BigNumber;
    swapFee: BigNumber;
};
export declare function _calcTokensOutGivenExactLpIn(balances: BigNumber[], lpAmountIn: BigNumber, totalBPT: BigNumber): BigNumber[];
export declare function _calcDueTokenProtocolSwapFeeAmount(balance: BigNumber, normalizedWeight: BigNumber, previousInvariant: BigNumber, currentInvariant: BigNumber, protocolSwapFeePercentage: BigNumber): BigNumber;
