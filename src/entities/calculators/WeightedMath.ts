
import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'tiny-invariant'
import { mulDown, powUp, powDown, divUp, divDown, complement, ONE, mulUp, max, MIN_POW_BASE_FREE_EXPONENT } from './FixedPoint'
import { ZERO } from './LogExpMath';
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


// These functions start with an underscore, as if they were part of a contract and not a library. At some point this
// should be fixed.
// solhint-disable private-vars-leading-underscore



// A minimum normalized weight imposes a maximum weight ratio. We need this due to limitations in the
// implementation of the power function, as these ratios are often exponents.
// const _MIN_WEIGHT = BigNumber.from(0.01e18);
// Having a minimum normalized weight imposes a limit on the maximum number of tokens;
// i.e., the largest possible pool is one where all tokens have exactly the minimum weight.
// const _MAX_WEIGHTED_TOKENS = BigNumber.from(100);

// Pool limits that arise from limitations in the fixed point power function (and the imposed 1:100 maximum weight
// ratio).

// Swap limits: amounts swapped may not be larger than this percentage of total balance.
const _MAX_IN_RATIO = BigNumber.from('300000000000000000'); //0.3e18
const _MAX_OUT_RATIO = BigNumber.from('300000000000000000'); //0.3e18

// Invariant growth limit: non-proportional joins cannot cause the invariant to increase by more than this ratio.
const _MAX_INVARIANT_RATIO = BigNumber.from('3000000000000000000'); //3e18
// Invariant shrink limit: non-proportional exits cannot cause the invariant to decrease by less than this ratio.
const _MIN_INVARIANT_RATIO = BigNumber.from('700000000000000000'); //0.7e18

// About swap fees on joins and exits:
// Any join or exit that is not perfectly balanced (e.g. all single token joins or exits) is mathematically
// equivalent to a perfectly balanced join or  exit followed by a series of swaps. Since these swaps would charge
// swap fees, it follows that (some) joins and exits should as well.
// On these operations, we split the token amounts in 'taxable' and 'non-taxable' portions, where the 'taxable' part
// is the one to which swap fees are applied.

// Invariant is used to collect protocol swap fees by comparing its value between two times.
// So we can round always to the same direction. It is also used to initiate the BPT amount
// and, because there is a minimum BPT, we round down the invariant.
export function _calculateInvariant(normalizedWeights: BigNumber[], balances: BigNumber[]): BigNumber {
    /**********************************************************************************************
    // invariant               _____                                                             //
    // wi = weight index i      | |      wi                                                      //
    // bi = balance index i     | |  bi ^   = i                                                  //
    // i = invariant                                                                             //
    **********************************************************************************************/

    let _invariant = ONE;
    for (let i = 0; i < normalizedWeights.length; i++) {
        _invariant = mulDown(_invariant, powUp(balances[i], normalizedWeights[i]));
    }

    invariant(_invariant.gt(0), "ZERO_INVARIANT");

    return _invariant
}



// Computes how many tokens can be taken out of a pool if `amountIn` are sent, given the
// current balances and weights.
export function _calcOutGivenIn(
    balanceIn: BigNumber,
    weightIn: BigNumber,
    balanceOut: BigNumber,
    weightOut: BigNumber,
    amountIn: BigNumber
): BigNumber {
    /**********************************************************************************************
    // outGivenIn                                                                                //
    // aO = amountOut                                                                            //
    // bO = balanceOut                                                                           //
    // bI = balanceIn              /      /            bI             \    (wI / wO) \           //
    // aI = amountIn    aO = bO * |  1 - | --------------------------  | ^            |          //
    // wI = weightIn               \      \       ( bI + aI )         /              /           //
    // wO = weightOut                                                                            //
    **********************************************************************************************/

    // Amount out, so we round down overall.

    // The multiplication rounds down, and the subtrahend (power) rounds up (so the base rounds up too).
    // Because bI / (bI + aI) <= 1, the exponent rounds down.

    // Cannot exceed maximum in ratio
    invariant(amountIn.lte(mulDown(balanceIn, _MAX_IN_RATIO)), "MAX_IN_RATIO");

    const denominator = balanceIn.add(amountIn);
    const base = divUp(balanceIn, denominator);
    const exponent = divDown(weightIn, weightOut);
    const power = powUp(base, exponent);

    return mulDown(balanceOut, complement(power));
}

// Computes how many tokens must be sent to a pool in order to take `amountOut`, given the
// current balances and weights.
export function _calcInGivenOut(
    balanceIn: BigNumber,
    weightIn: BigNumber,
    balanceOut: BigNumber,
    weightOut: BigNumber,
    amountOut: BigNumber
): BigNumber {
    /**********************************************************************************************
    // inGivenOut                                                                                //
    // aO = amountOut                                                                            //
    // bO = balanceOut                                                                           //
    // bI = balanceIn              /  /            bO             \    (wO / wI)      \          //
    // aI = amountIn    aI = bI * |  | --------------------------  | ^            - 1  |         //
    // wI = weightIn               \  \       ( bO - aO )         /                   /          //
    // wO = weightOut                                                                            //
    **********************************************************************************************/

    // Amount in, so we round up overall.

    // The multiplication rounds up, and the power rounds up (so the base rounds up too).
    // Because b0 / (b0 - a0) >= 1, the exponent rounds up.

    // Cannot exceed maximum out ratio
    invariant(amountOut.lte(mulDown(balanceOut, _MAX_OUT_RATIO)), "MAX_OUT_RATIO");

    const base = divUp(balanceOut, balanceOut.sub(amountOut));
    const exponent = divUp(weightOut, weightIn);
    const power = powUp(base, exponent);

    // Because the base is larger than one (and the power rounds up), the power should always be larger than one, so
    // the following subtraction should never revert.
    const ratio = power.sub(ONE);

    return mulUp(balanceIn, ratio);
}

export function _calcLpOutGivenExactTokensIn(
    balances: BigNumber[],
    normalizedWeights: BigNumber[],
    amountsIn: BigNumber[],
    lpTotalSupply: BigNumber,
    swapFeePercentage: BigNumber
): { lpOut: BigNumber, swapFees: BigNumber[] } {
    // BPT out, so we round down overall.

    let balanceRatiosWithFee = [];

    let invariantRatioWithFees = ZERO;
    for (let i = 0; i < balances.length; i++) {
        balanceRatiosWithFee.push(divDown(balances[i].add(amountsIn[i]), balances[i]));
        invariantRatioWithFees = mulDown(invariantRatioWithFees.add(balanceRatiosWithFee[i]), normalizedWeights[i]);
    }

    const { invariantRatio, swapFees } = _computeJoinExactTokensInInvariantRatio(
        balances,
        normalizedWeights,
        amountsIn,
        balanceRatiosWithFee,
        invariantRatioWithFees,
        swapFeePercentage
    );

    const lpOut = invariantRatio.gt(ONE) ? mulDown(lpTotalSupply, invariantRatio.sub(ONE)) : ZERO;
    return { lpOut, swapFees };
}

/**
 * @dev Intermediate function to avoid stack-too-deep "
 */
export function _computeJoinExactTokensInInvariantRatio(
    balances: BigNumber[],
    normalizedWeights: BigNumber[],
    amountsIn: BigNumber[],
    balanceRatiosWithFee: BigNumber[],
    invariantRatioWithFees: BigNumber,
    swapFeePercentage: BigNumber
): { invariantRatio: BigNumber, swapFees: BigNumber[] } {
    // Swap fees are charged on all tokens that are being added in a larger proportion than the overall invariant
    // increase.
    let swapFees = [];
    let invariantRatio = ONE;

    for (let i = 0; i < balances.length; i++) {
        let amountInWithoutFee;

        if (balanceRatiosWithFee[i].gt(invariantRatioWithFees)) {
            const nonTaxableAmount = mulDown(balances[i], invariantRatioWithFees.sub(ONE));
            const taxableAmount = amountsIn[i].sub(nonTaxableAmount);
            const swapFee = mulUp(taxableAmount, swapFeePercentage);

            amountInWithoutFee = nonTaxableAmount.add(taxableAmount.sub(swapFee));
            swapFees[i] = swapFee;
        } else {
            amountInWithoutFee = amountsIn[i];
        }

        const balanceRatio = divDown(balances[i].add(amountInWithoutFee), balances[i]);

        invariantRatio = mulDown(invariantRatio, powDown(balanceRatio, normalizedWeights[i]));
    }

    return { invariantRatio, swapFees }
}

export function _calcTokenInGivenExactLpOut(
    balance: BigNumber,
    normalizedWeight: BigNumber,
    lpAmountOut: BigNumber,
    lpTotalSupply: BigNumber,
    swapFeePercentage: BigNumber
): { amountIn: BigNumber, swapFee: BigNumber } {
    /******************************************************************************************
    // tokenInForExactLpOut                                                                 //
    // a = amountIn                                                                          //
    // b = balance                      /  /    totalBPT + LpOut      \    (1 / w)       \  //
    // LpOut = lpAmountOut   a = b * |  | --------------------------  | ^          - 1  |  //
    // lp = totalBPT                   \  \       totalBPT            /                  /  //
    // w = weight                                                                            //
    ******************************************************************************************/

    // Token in, so we round up overall.

    // Calculate the factor by which the invariant will increase after minting BPTAmountOut
    const invariantRatio = divUp(lpTotalSupply.add(lpAmountOut), lpTotalSupply);
    invariant(invariantRatio.lte(_MAX_INVARIANT_RATIO), "MAX_OUT_LP");

    // Calculate by how much the token balance has to increase to match the invariantRatio
    const balanceRatio = powUp(invariantRatio, divUp(ONE, normalizedWeight));

    const amountInWithoutFee = mulUp(balance, balanceRatio.sub(ONE));

    // We can now compute how much extra balance is being deposited and used in virtual swaps, and charge swap fees
    // accordingly.
    const taxablePercentage = complement(normalizedWeight);
    const taxableAmount = mulUp(amountInWithoutFee, taxablePercentage);
    const nonTaxableAmount = amountInWithoutFee.sub(taxableAmount);

    const taxableAmountPlusFees = divUp(taxableAmount, ONE.sub(swapFeePercentage));

    return {
        swapFee: taxableAmountPlusFees.sub(taxableAmount),
        amountIn: nonTaxableAmount.add(taxableAmountPlusFees)
    }
}

export function _calcAllTokensInGivenExactLpOut(
    balances: BigNumber[],
    lpAmountOut: BigNumber,
    totalBPT: BigNumber
): BigNumber[] {
    /************************************************************************************
    // tokensInForExactLpOut                                                          //
    // (per token)                                                                     //
    // aI = amountIn                   /   LpOut   \                                  //
    // b = balance           aI = b * | ------------ |                                 //
    // LpOut = lpAmountOut           \  totalBPT  /                                  //
    // lp = totalBPT                                                                  //
    ************************************************************************************/

    // Tokens in, so we round up overall.
    const lpRatio = divUp(lpAmountOut, totalBPT);

    let amountsIn = [];
    for (let i = 0; i < balances.length; i++) {
        amountsIn.push(mulUp(balances[i], lpRatio));
    }

    return amountsIn;
}

export function _calcLpInGivenExactTokensOut(
    balances: BigNumber[],
    normalizedWeights: BigNumber[],
    amountsOut: BigNumber[],
    lpTotalSupply: BigNumber,
    swapFeePercentage: BigNumber
): { lpIn: BigNumber, swapFees: BigNumber[] } {
    // BPT in, so we round up overall.

    let balanceRatiosWithoutFee = [];
    let invariantRatioWithoutFees = ZERO;
    for (let i = 0; i < balances.length; i++) {
        balanceRatiosWithoutFee.push(divUp(balances[i].sub(amountsOut[i]), balances[i]));
        invariantRatioWithoutFees = invariantRatioWithoutFees.add(mulUp(balanceRatiosWithoutFee[i], normalizedWeights[i]));
    }

    const { invariantRatio, swapFees } = _computeExitExactTokensOutInvariantRatio(
        balances,
        normalizedWeights,
        amountsOut,
        balanceRatiosWithoutFee,
        invariantRatioWithoutFees,
        swapFeePercentage
    );

    const lpIn = mulUp(lpTotalSupply, complement(invariantRatio));
    return { lpIn, swapFees };
}

/**
 * @dev Intermediate function to avoid stack-too-deep "
 */
export function _computeExitExactTokensOutInvariantRatio(
    balances: BigNumber[],
    normalizedWeights: BigNumber[],
    amountsOut: BigNumber[],
    balanceRatiosWithoutFee: BigNumber[],
    invariantRatioWithoutFees: BigNumber,
    swapFeePercentage: BigNumber
): { invariantRatio: BigNumber, swapFees: BigNumber[] } {
    let swapFees = [];
    let invariantRatio = ONE;

    for (let i = 0; i < balances.length; i++) {
        // Swap fees are typically charged on 'token in', but there is no 'token in' here, so we apply it to
        // 'token out'. This results in slightly larger price impact.

        let amountOutWithFee;
        if (invariantRatioWithoutFees.gt(balanceRatiosWithoutFee[i])) {
            const nonTaxableAmount = mulDown(balances[i], complement(invariantRatioWithoutFees));
            const taxableAmount = amountsOut[i].sub(nonTaxableAmount);
            const taxableAmountPlusFees = divUp(taxableAmount, ONE.sub(swapFeePercentage));

            swapFees[i] = taxableAmountPlusFees.sub(taxableAmount);
            amountOutWithFee = nonTaxableAmount.add(taxableAmountPlusFees);
        } else {
            amountOutWithFee = amountsOut[i];
        }

        const balanceRatio = divDown(balances[i].sub(amountOutWithFee), balances[i]);

        invariantRatio = mulDown(invariantRatio, powDown(balanceRatio, normalizedWeights[i]));
    }

    return { invariantRatio, swapFees }
}

export function _calcTokenOutGivenExactLpIn(
    balance: BigNumber,
    normalizedWeight: BigNumber,
    lpAmountIn: BigNumber,
    lpTotalSupply: BigNumber,
    swapFeePercentage: BigNumber
): { amountOut: BigNumber, swapFee: BigNumber } {
    /*****************************************************************************************
    // exactBPTInForTokenOut                                                                //
    // a = amountOut                                                                        //
    // b = balance                     /      /    totalBPT - lpIn       \    (1 / w)  \   //
    // lpIn = lpAmountIn    a = b * |  1 - | --------------------------  | ^           |  //
    // lp = totalBPT                  \      \       totalBPT            /             /   //
    // w = weight                                                                           //
    *****************************************************************************************/

    // Token out, so we round down overall. The multiplication rounds down, but the power rounds up (so the base
    // rounds up). Because (totalBPT - lpIn) / totalBPT <= 1, the exponent rounds down.

    // Calculate the factor by which the invariant will decrease after burning BPTAmountIn
    const invariantRatio = divUp(lpTotalSupply.sub(lpAmountIn), lpTotalSupply);
    invariant(invariantRatio >= _MIN_INVARIANT_RATIO, "MIN_LP_IN");

    // Calculate by how much the token balance has to decrease to match invariantRatio
    const balanceRatio = powUp(invariantRatio, divDown(ONE, normalizedWeight));

    // Because of rounding up, balanceRatio can be greater than one. Using complement prevents reverts.
    const amountOutWithoutFee = mulDown(balance, complement(balanceRatio));

    // We can now compute how much excess balance is being withdrawn as a result of the virtual swaps, which result
    // in swap fees.
    const taxablePercentage = complement(normalizedWeight);

    // Swap fees are typically charged on 'token in', but there is no 'token in' here, so we apply it
    // to 'token out'. This results in slightly larger price impact. Fees are rounded up.
    const taxableAmount = mulUp(amountOutWithoutFee, taxablePercentage);
    const nonTaxableAmount = amountOutWithoutFee.sub(taxableAmount);

    const swapFee = mulUp(taxableAmount, swapFeePercentage)
    return {
        swapFee,
        amountOut: nonTaxableAmount.add(taxableAmount.sub(swapFee))
    }
}

export function _calcTokensOutGivenExactLpIn(
    balances: BigNumber[],
    lpAmountIn: BigNumber,
    totalBPT: BigNumber
): BigNumber[] {
    /**********************************************************************************************
    // exactBPTInForTokensOut                                                                    //
    // (per token)                                                                               //
    // aO = amountOut                  /        lpIn         \                                  //
    // b = balance           a0 = b * | ---------------------  |                                 //
    // lpIn = lpAmountIn             \       totalBPT       /                                  //
    // lp = totalBPT                                                                            //
    **********************************************************************************************/

    // Since we're computing an amount out, we round down overall. This means rounding down on both the
    // multiplication and division.

    const lpRatio = divDown(lpAmountIn, totalBPT);

    let amountsOut = [];
    for (let i = 0; i < balances.length; i++) {
        amountsOut.push(mulDown(balances[i], lpRatio));
    }

    return amountsOut;
}

export function _calcDueTokenProtocolSwapFeeAmount(
    balance: BigNumber,
    normalizedWeight: BigNumber,
    previousInvariant: BigNumber,
    currentInvariant: BigNumber,
    protocolSwapFeePercentage: BigNumber
): BigNumber {
    /*********************************************************************************
    /*  protocolSwapFeePercentage * balanceToken * ( 1 - (previousInvariant / currentInvariant) ^ (1 / weightToken))
    *********************************************************************************/

    if (currentInvariant.lte(previousInvariant)) {
        // This shouldn't happen outside of rounding errors, but have this safeguard nonetheless to prevent the Pool
        // from entering a locked state in which joins and exits revert while computing accumulated swap fees.
        return ZERO;
    }

    // We round down to prevent issues in the Pool's accounting, even if it means paying slightly less in protocol
    // fees to the Vault.

    // Fee percentage and balance multiplications round down, while the subtrahend (power) rounds up (as does the
    // base). Because previousInvariant / currentInvariant <= 1, the exponent rounds down.

    let base = divUp(previousInvariant, currentInvariant);
    const exponent = divDown(ONE, normalizedWeight);

    // Because the exponent is larger than one, the base of the power function has a lower bound. We cap to this
    // value to avoid numeric issues, which means in the extreme case (where the invariant growth is larger than
    // 1 / min exponent) the Pool will pay less in protocol fees than it should.
    base = max(base, MIN_POW_BASE_FREE_EXPONENT);

    const power = powUp(base, exponent);

    const tokenAccruedFees = mulDown(balance, complement(power));
    return mulDown(tokenAccruedFees, protocolSwapFeePercentage);
}

