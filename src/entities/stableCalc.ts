import { BigNumber } from 'ethers'
import invariant from 'tiny-invariant'
import { SwapStorage } from './swapStorage'

const MAX_ITERATION = 256
export const A_PRECISION = BigNumber.from(100)
const FEE_DENOMINATOR = BigNumber.from(1e10)


export function _xp(balances: BigNumber[], rates: BigNumber[]): BigNumber[] {
    let result = []
    for (let i = 0; i < balances.length; i++) {
        result.push(rates[i].mul(balances[i]))
    }
    return result
}


export function _getAPrecise(blockTimestamp: BigNumber,
    swapStorage:SwapStorage
): BigNumber {
    if (blockTimestamp.gte(swapStorage.futureATime)) {
        return swapStorage.futureA;
    }

    if (swapStorage.futureA.gt(swapStorage.initialA)) {
        return swapStorage.initialA.add(
            swapStorage.futureA.sub(swapStorage.initialA).mul(blockTimestamp.sub(swapStorage.initialATime)).div(
                swapStorage.futureATime.sub(swapStorage.initialATime)))
    }

    return swapStorage.initialA.sub(swapStorage.initialA.sub(swapStorage.futureA).mul(blockTimestamp.sub(swapStorage.initialATime))).div(
        swapStorage.futureATime.sub(swapStorage.initialATime))
}

export function _sumOf(x: BigNumber[]): BigNumber {
    let sum = BigNumber.from(0);
    for (let i = 0; i < x.length; i++) {
        sum = sum.add(x[i])
    }
    return sum
}


export function _distance(x: BigNumber, y: BigNumber): BigNumber {
    return x.gt(y) ? x.sub(y) : y.sub(x)
}

/**
 * Calculate D for *NORMALIZED* balances of each tokens
 * @param xp normalized balances of token
 */
export function _getD(xp: BigNumber[], amp: BigNumber): BigNumber {
    const nCoins = xp.length;
    let sum = _sumOf(xp)
    if (sum.eq(0)) {
        return BigNumber.from(0)
    }

    let Dprev = BigNumber.from(0)
    let D = sum;
    let Ann = amp.mul(nCoins)

    for (let i = 0; i < MAX_ITERATION; i++) {
        let D_P = D;
        for (let j = 0; j < xp.length; j++) {
            D_P = D_P.mul(D).div(xp[j].mul(nCoins))
        }

        Dprev = D;
        D = ((Ann.mul(sum)).div(A_PRECISION).add(D_P.mul(nCoins)).mul(D)).div(
            ((Ann.sub(A_PRECISION)).mul(D).div(A_PRECISION)).add(D_P.mul(nCoins + 1)))

        if (_distance(D, Dprev).lte(1)) {
            return D;
        }
    }

    // Convergence should occur in 4 loops or less. If this is reached, there may be something wrong
    // with the pool. If this were to occur repeatedly, LPs should withdraw via `removeLiquidity()`
    // function which does not rely on D.
    invariant("invariantCalculationFailed");
    return D
}

export function _getY(
    inIndex: number,
    outIndex: number,
    inBalance: BigNumber,
    // self, shoudl be replaced with swapStorage object
    blockTimestamp: BigNumber, 
    swapStorage:SwapStorage,
    normalizedBalances: BigNumber[]

): BigNumber {
    invariant(inIndex != outIndex, "sameToken");
    const nCoins = normalizedBalances.length;
    invariant(inIndex < nCoins && outIndex < nCoins, "indexOutOfRange");

    let amp = _getAPrecise(blockTimestamp, swapStorage);
    let Ann = amp.mul(nCoins)
    let D = _getD(normalizedBalances, amp);
    let sum = BigNumber.from(0) // sum of new balances except output token
    let c = D;
    for (let i = 0; i < nCoins; i++) {
        if (i == outIndex) {
            continue;
        }

        let x = i == inIndex ? inBalance : normalizedBalances[i];
        console.log(x)
        sum = sum.add(x)
        c = (c.mul(D)).div(x.mul(nCoins))
    }

    c = c.mul(D.mul(A_PRECISION)).div(Ann.mul(nCoins))
    let b = sum.add(D.mul(A_PRECISION).div(Ann))

    let lastY = BigNumber.from(0)
    let y = D;
    for (let index = 0; index < MAX_ITERATION; index++) {
        lastY = y;
        y = ((y.mul(y)).add(c)).div(y.mul(2).add(b).sub(D))
        if (_distance(lastY, y).lte(1)) {
            return y;
        }
    }

    invariant("yCalculationFailed")
    return BigNumber.from(0)
}

export function calculateSwap(inIndex: number, outIndex: number, inAmount: BigNumber, // standard fields
    balances: BigNumber[],
    tokenMultipliers: BigNumber[],
    blockTimestamp: BigNumber,
    swapStorage:SwapStorage
): BigNumber {
    let normalizedBalances = _xp(balances, tokenMultipliers)
    let newInBalance = normalizedBalances[inIndex].add(inAmount.mul(tokenMultipliers[inIndex]))
    let outBalance = _getY(
        inIndex,
        outIndex,
        newInBalance,
        blockTimestamp, swapStorage,
        normalizedBalances
    )

    let outAmount = ((normalizedBalances[outIndex].sub(outBalance)).sub(1)).div(tokenMultipliers[outIndex])
    let _fee = swapStorage.fee.mul(outAmount).div(FEE_DENOMINATOR)
    return outAmount.sub(_fee)
}


// function calculateRemoveLiquidity(
//      account:string,
//      amount:BigNumber
// ) :BigNumber[] {
//     let totalSupply = self.lpToken.totalSupply();
//     require(amount <= totalSupply, "Cannot exceed total supply");

//     uint256 feeAdjustedAmount = (amount * (FEE_DENOMINATOR - _calculateCurrentWithdrawFee(self, account))) /
//         FEE_DENOMINATOR;

//     uint256[] memory amounts = new uint256[](self.pooledTokens.length);

//     for (uint256 i = 0; i < self.pooledTokens.length; i++) {
//         amounts[i] = (self.balances[i] * (feeAdjustedAmount)) / (totalSupply);
//     }
//     return amounts;
// }