
// import invariant from 'tiny-invariant'
import { BigNumber } from '@ethersproject/bignumber'


import { pow, ZERO, ONE_18 } from "./LogExpMath";

export const ONE = ONE_18
/* solhint-disable private-vars-leading-underscore */

// const ONE = BigNumber.from(1e18); // 18 decimal places
const MAX_POW_RELATIVE_ERROR = BigNumber.from(10000); // 10^(-14)

// Minimum base for the power function when the exponent is 'free' (larger than ONE).
export const MIN_POW_BASE_FREE_EXPONENT = BigNumber.from('700000000000000000');


export function mulDown(a: BigNumber, b: BigNumber): BigNumber {
    const product = a.mul(b);

    return product.div(ONE);
}

export function mulUp(a: BigNumber, b: BigNumber): BigNumber {
    const product = a.mul(b);

    if (product.eq(0)) {
        return BigNumber.from(0);
    } else {
        // The traditional divUp formula is:
        // divUp(x, y) := (x + y - 1) / y
        // To avoid intermediate overflow in the addition, we distribute the division and get:
        // divUp(x, y) := (x - 1) / y + 1
        // Note that this requires x != 0, which we already tested for.

        return (product.sub(1).div(ONE)).add(1);
    }
}

export function divDown(a: BigNumber, b: BigNumber): BigNumber {

    if (a.eq(ZERO)) {
        return ZERO;
    } else {
        let aInflated = a.mul(ONE);
        return aInflated.div(b);
    }
}

export function divUp(a: BigNumber, b: BigNumber): BigNumber {

    if (a.eq(ZERO)) {
        return ZERO;
    } else {
        let aInflated = a.mul(ONE);

        // The traditional divUp formula is:
        // divUp(x, y) := (x + y - 1) / y
        // To avoid intermediate overflow in the addition, we distribute the division and get:
        // divUp(x, y) := (x - 1) / y + 1
        // Note that this requires x != 0, which we already tested for.

        return aInflated.sub(1).div(b).add(1);
    }
}

/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding down. The result is guaranteed to not be above
 * the true value (that is, the error function expected - actual is always positive).
 */
export function powDown(x: BigNumber, y: BigNumber): BigNumber {
    let raw = pow(x, y);
    let maxError = mulUp(raw, MAX_POW_RELATIVE_ERROR).add(1);

    if (raw < maxError) {
        return ZERO;
    } else {
        return raw.sub(maxError);
    }
}

/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding up. The result is guaranteed to not be below
 * the true value (that is, the error function expected - actual is always negative).
 */
export function powUp(x: BigNumber, y: BigNumber): BigNumber {
    const raw = pow(x, y);
    const maxError = mulUp(raw, MAX_POW_RELATIVE_ERROR).add(1);

    return raw.add(maxError);
}

/**
 * @dev Returns the complement of a value (1 - x), capped to 0 if x is larger than 1.
 *
 * Useful when computing the complement for values with some level of relative error, as it strips this error and
 * prevents intermediate negative values.
 */
export function complement(x: BigNumber): BigNumber {
    return x.lt(ONE) ? ONE.sub(x) : ZERO;
}


/**
 * @dev Returns the largest of two numbers of 256 bits.
 */
export function max(a: BigNumber, b: BigNumber): BigNumber {
    return a.gte(b) ? a : b;
}

/**
 * @dev Returns the smallest of two numbers of 256 bits.
 */
export function min(a: BigNumber, b: BigNumber): BigNumber {
    return a.lt(b) ? a : b;
}

