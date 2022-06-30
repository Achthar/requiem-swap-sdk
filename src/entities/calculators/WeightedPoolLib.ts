// SPDX-License-Identifier: MIT

import { WeightedSwapStorage } from "./weightedSwapStorage";

import { BigNumber } from '@ethersproject/bignumber'
import { _calcAllTokensInGivenExactLpOut, _calcInGivenOut, _calcLpInGivenExactTokensOut, _calcLpOutGivenExactTokensIn, _calcOutGivenIn, _calcTokenOutGivenExactLpIn } from "./WeightedMath";
import { ONE_18, ZERO } from "./LogExpMath";

const FEE_DENOMINATOR = ONE_18

export function calculateRemoveLiquidityOneTokenExactIn(
    self: WeightedSwapStorage,
    outIndex: number,
    lpAmount: BigNumber,
    lpSupply:BigNumber,
    tokenBalances: BigNumber[]
): { amountOut: BigNumber, swapFee: BigNumber } {
    return _calcTokenOutGivenExactLpIn(
        tokenBalances[outIndex].mul(self.tokenMultipliers[outIndex]),
        self.normalizedWeights[outIndex],
        lpAmount,
        lpSupply,
        self.fee
    );
}

export function calculateRemoveLiquidityExactIn(
    self: WeightedSwapStorage,
    lpAmount: BigNumber,
    lpSupply:BigNumber,
     tokenBalances: BigNumber[]
): BigNumber[] {

    return _calcAllTokensInGivenExactLpOut(
        _xp(tokenBalances, self.tokenMultipliers),
        lpAmount,
        lpSupply
    );
}

/**
 * Estimate amount of LP token minted or burned at deposit or withdrawal
 */
export function calculateTokenAmount(
    self: WeightedSwapStorage,
    amounts: BigNumber[],
    lpSupply:BigNumber,
    deposit: boolean,
    tokenBalances: BigNumber[]
): BigNumber {
    let lpTokenAmount = ZERO
    if (deposit) {
        const { lpOut } = _calcLpOutGivenExactTokensIn(
            _xp(tokenBalances, self.tokenMultipliers),
            self.normalizedWeights,
            _xp(amounts, self.tokenMultipliers),
            lpSupply,
            self.fee
        );
        lpTokenAmount = lpOut
    } else {
        const { lpIn } = _calcLpInGivenExactTokensOut(
            _xp(tokenBalances, self.tokenMultipliers),
            self.normalizedWeights,
            _xp(amounts, self.tokenMultipliers),
            lpSupply,
            self.fee
        );
        lpTokenAmount = lpIn
    }

    return lpTokenAmount
}

export function calculateSwapGivenIn(self: WeightedSwapStorage, inIndex: number, outIndex: number, amountIn: BigNumber, tokenBalances: BigNumber[]): BigNumber {
    // use in amount with fee alredy deducted
    const amountInWithFee = amountIn.mul(self.tokenMultipliers[inIndex]).mul(FEE_DENOMINATOR.sub(self.fee));

    // calculate out amount
    let amountOut = _calcOutGivenIn(
        tokenBalances[inIndex].mul(self.tokenMultipliers[inIndex]).mul(FEE_DENOMINATOR),
        self.normalizedWeights[inIndex],
        tokenBalances[outIndex].mul(self.tokenMultipliers[outIndex]).mul(FEE_DENOMINATOR),
        self.normalizedWeights[outIndex],
        amountInWithFee
    );

    // downscale out amount
    return amountOut.div(FEE_DENOMINATOR).div(self.tokenMultipliers[outIndex]);

}


export function calculateSwapGivenOut(self: WeightedSwapStorage, inIndex: number, outIndex: number, amountOut: BigNumber,tokenBalances: BigNumber[]): BigNumber {
    // calculate in amount with upscaled balances
    const amountIn = _calcInGivenOut(
        tokenBalances[inIndex].mul(self.tokenMultipliers[inIndex]).mul(FEE_DENOMINATOR),
        self.normalizedWeights[inIndex],
        tokenBalances[outIndex].mul(self.tokenMultipliers[outIndex]).mul(FEE_DENOMINATOR),
        self.normalizedWeights[outIndex],
        amountOut.mul(self.tokenMultipliers[outIndex]).mul(FEE_DENOMINATOR)
    );
    // adjust for fee and scale down - rounding up
    return amountIn.div(FEE_DENOMINATOR.sub(self.fee)).div(self.tokenMultipliers[inIndex]).add(1);
}


export function _xp(balances: BigNumber[], rates: BigNumber[]): BigNumber[] {
    let result = []
    for (let i = 0; i < balances.length; i++) {
        result.push(rates[i].mul(balances[i]))
    }
    return result
}