import { BigNumber } from 'ethers'
import invariant from 'tiny-invariant'
import { SwapStorage } from './swapStorage'

const MAX_ITERATION = 256
export const A_PRECISION = BigNumber.from(100)
const FEE_DENOMINATOR = BigNumber.from(1e10)
const ONE = BigNumber.from(1)

export function _xp(balances: BigNumber[], rates: BigNumber[]): BigNumber[] {
    let result = []
    for (let i = 0; i < balances.length; i++) {
        result.push(rates[i].mul(balances[i]))
    }
    return result
}


export function _getAPrecise(blockTimestamp: BigNumber,
    swapStorage: SwapStorage
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
    swapStorage: SwapStorage,
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
    blockTimestamp: BigNumber,
    swapStorage: SwapStorage
): BigNumber {
    let normalizedBalances = _xp(balances, swapStorage.tokenMultipliers)
    let newInBalance = normalizedBalances[inIndex].add(inAmount.mul(swapStorage.tokenMultipliers[inIndex]))
    let outBalance = _getY(
        inIndex,
        outIndex,
        newInBalance,
        blockTimestamp,
        swapStorage,
        normalizedBalances
    )

    let outAmount = ((normalizedBalances[outIndex].sub(outBalance)).sub(ONE)).div(swapStorage.tokenMultipliers[outIndex])
    let _fee = swapStorage.fee.mul(outAmount).div(FEE_DENOMINATOR)
    return outAmount.sub(_fee)
}

export function calculateSwapGivenOut(inIndex: number, outIndex: number, outAmount: BigNumber, // standard fields
    balances: BigNumber[],
    blockTimestamp: BigNumber,
    swapStorage: SwapStorage
): BigNumber {

    let normalizedBalances = _xp(balances, swapStorage.tokenMultipliers)

    let _amountOutInclFee = outAmount.mul(FEE_DENOMINATOR).div(FEE_DENOMINATOR.sub(swapStorage.fee));
    let newOutBalance = normalizedBalances[outIndex].sub(_amountOutInclFee.mul(swapStorage.tokenMultipliers[outIndex]));

    let inBalance = _getY(
        outIndex,
        inIndex,
        newOutBalance,
        blockTimestamp,
        swapStorage,
        normalizedBalances
    )

    const inAmount = ((inBalance.sub(normalizedBalances[inIndex]).sub(ONE)).div(swapStorage.tokenMultipliers[inIndex])).add(ONE)
    return inAmount;
}

// function to calculate the amounts of stables from the amounts of LP
export function _calculateRemoveLiquidity(
    amount: BigNumber,
    swapStorage: SwapStorage,
    totalSupply: BigNumber,
    currentWithdrawFee: BigNumber,
    balances: BigNumber[]
): BigNumber[] {

    invariant(amount.lte(totalSupply), "Cannot exceed total supply");

    let feeAdjustedAmount = amount.mul(FEE_DENOMINATOR.sub(currentWithdrawFee)).div(
        FEE_DENOMINATOR)

    let amounts = []

    for (let i = 0; i < swapStorage.tokenMultipliers.length; i++) {
        amounts.push((balances[i].mul(feeAdjustedAmount)).div(totalSupply))
    }
    return amounts;
}


function _getYD(
    A: BigNumber,
    index: number,
    xp: BigNumber[],
    D: BigNumber
): BigNumber {
    let nCoins = xp.length;
    invariant(index < nCoins, "INDEX");
    let Ann = A.mul(nCoins)
    let c = D;
    let s = BigNumber.from(0)
    let _x = BigNumber.from(0)
    let yPrev = BigNumber.from(0)

    for (let i = 0; i < nCoins; i++) {
        if (i == index) {
            continue;
        }
        _x = xp[i];
        s = s.add(_x)
        c = (c.mul(D)).div(_x.mul(nCoins))
    }

    c = (c.mul(D).mul(A_PRECISION)).div(Ann.mul(nCoins))
    let b = s.add(D.mul(A_PRECISION).div(Ann))
    let y = D;

    for (let i = 0; i < MAX_ITERATION; i++) {
        yPrev = y;
        y = ((y.mul(y)).add(c)).div(((y.mul(2)).add(b)).sub(D))
        if (_distance(yPrev, y).lt(1)) {
            return y;
        }
    }
    invariant("invariantCalculationFailed")
    return BigNumber.from(0)
}

function _feePerToken(swapStorage: SwapStorage): BigNumber {
    let nCoins = swapStorage.tokenMultipliers.length;
    return (swapStorage.fee.mul(nCoins)).div(4 * (nCoins - 1));
}


export function _calculateRemoveLiquidityOneToken(
    swapStorage: SwapStorage,
    tokenAmount: BigNumber,
    index: number,
    blockTimestamp: BigNumber,
    balances: BigNumber[],
    totalSupply: BigNumber,
    currentWithdrawFee: BigNumber
): { [returnVal: string]: BigNumber }// {dy:BigNumber, fee:BigNumber} 
{
    invariant(index < swapStorage.tokenMultipliers.length, "indexOutOfRange")

    let amp = _getAPrecise(blockTimestamp, swapStorage)
    let xp = _xp(balances, swapStorage.tokenMultipliers)
    let D0 = _getD(xp, amp);
    let D1 = D0.sub((tokenAmount.mul(D0)).div(totalSupply))
    let newY = _getYD(amp, index, xp, D1);
    let reducedXP = xp;
    let _fee = _feePerToken(swapStorage);

    for (let i = 0; i < swapStorage.tokenMultipliers.length; i++) {
        let expectedDx = BigNumber.from(0)
        if (i == index) {
            expectedDx = ((xp[i].mul(D1)).div(D0)).sub(newY)
        } else {
            expectedDx = xp[i].sub(xp[i].mul(D1).div(D0))
        }
        reducedXP[i] = reducedXP[i].sub(_fee.mul(expectedDx).div(FEE_DENOMINATOR))
    }

    let dy = reducedXP[index].sub(_getYD(amp, index, reducedXP, D1))
    dy = (dy.sub(1)).div(swapStorage.tokenMultipliers[index])
    let fee = ((xp[index].sub(newY)).div(swapStorage.tokenMultipliers[index])).sub(dy)
    dy = dy.mul(FEE_DENOMINATOR.sub(currentWithdrawFee)).div(FEE_DENOMINATOR)
    return { "dy": dy, "fee": fee }
}


/**
 * Estimate amount of LP token minted or burned at deposit or withdrawal
 * without taking fees into account
 */
export function _calculateTokenAmount(
    swapStorage: SwapStorage,
    amounts: BigNumber[],
    deposit: boolean,
    balances: BigNumber[],
    blockTimestamp: BigNumber,
    totalSupply: BigNumber
): BigNumber {
    let nCoins = swapStorage.tokenMultipliers.length;
    invariant(amounts.length == nCoins, "invalidAmountsLength");
    let amp = _getAPrecise(blockTimestamp, swapStorage);
    let D0 = _getD(_xp(balances, swapStorage.tokenMultipliers), amp);

    let newBalances = balances;
    for (let i = 0; i < nCoins; i++) {
        if (deposit) {
            newBalances[i] = newBalances[i].add(amounts[i])
        } else {
            newBalances[i] = newBalances[i].sub(amounts[i])
        }
    }

    let D1 = _getD(_xp(newBalances, swapStorage.tokenMultipliers), amp);


    if (totalSupply.eq(0)) {
        return D1; // first depositor take it all
    }

    let diff = deposit ? D1.sub(D0) : D0.sub(D1)
    return (diff.mul(totalSupply)).div(D0)
}