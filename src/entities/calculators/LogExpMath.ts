// SPDX-License-Identifier: MIT
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the “Software”), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.

// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { BigNumber } from '@ethersproject/bignumber'
// import { ethers } from 'ethers'

/* solhint-disable */

/**
 * @dev Exponentiation and logarithm functions for 18 decimal fixed point numbers (both base and exponent/argument).
 *
 * Exponentiation and logarithm with arbitrary bases (x^y and log_x(y)) are implemented by conversion to natural
 * exponentiation and logarithm (where the base is Euler's number).
 *
 * @author Fernando Martinelli - @fernandomartinelli
 * @author Sergio Yuhjtman - @sergioyuhjtman
 * @author Daniel Fernandez - @dmf7z
 */

// All fixed point multiplications and divisions are inlined. This means we need to divide by ONE when multiplying
// two numbers, and multiply by ONE when dividing them.
export const ZERO = BigNumber.from(0)
// All arguments and return values are 18 decimal fixed point numbers.
export const ONE_18 = BigNumber.from('1000000000000000000');

// Internally, intermediate values are computed with higher precision as 20 decimal fixed point numbers, and in the
// case of ln36, 36 decimals.
const ONE_20 = BigNumber.from('100000000000000000000');
const ONE_36 = BigNumber.from('1000000000000000000000000000000000000');

// The domain of natural exponentiation is bound by the word size and number of decimals used.
//
// Because internally the result will be stored using 20 decimals, the largest possible result is
// (2^255 - 1) / 10^20, which makes the largest exponent ln((2^255 - 1) / 10^20) = 130.700829182905140221.
// The smallest possible result is 10^(-18), which makes largest negative argument
// ln(10^(-18)) = -41.446531673892822312.
// We use 130.0 and -41.0 to have some safety margin.
// const MAX_NATURAL_EXPONENT = BigNumber.from('130000000000000000000');
// const MIN_NATURAL_EXPONENT = BigNumber.from(-'41000000000000000000');

// Bounds for ln_36's argument. Both ln(0.9) and ln(1.1) can be represented with 36 decimal places in a fixed point
// 256 bit integer.
const LN_36_LOWER_BOUND = ONE_18.sub(BigNumber.from('100000000000000000'));
const LN_36_UPPER_BOUND = ONE_18.add(BigNumber.from('100000000000000000'));

// const MILD_EXPONENT_BOUND = ethers.constants.MaxUint256.div(ONE_20);

// 18 decimal constants
const x0 = BigNumber.from('128000000000000000000'); // 2ˆ7
const a0 = BigNumber.from('38877084059945950922200000000000000000000000000000000000'); // eˆ(x0) (no decimals)
const x1 = BigNumber.from('64000000000000000000'); // 2ˆ6
const a1 = BigNumber.from('6235149080811616882910000000'); // eˆ(x1) (no decimals)

// 20 decimal constants
const x2 = BigNumber.from('3200000000000000000000'); // 2ˆ5
const a2 = BigNumber.from('7896296018268069516100000000000000'); // eˆ(x2)
const x3 = BigNumber.from('1600000000000000000000'); // 2ˆ4
const a3 = BigNumber.from('888611052050787263676000000'); // eˆ(x3)
const x4 = BigNumber.from('800000000000000000000'); // 2ˆ3
const a4 = BigNumber.from('298095798704172827474000'); // eˆ(x4)
const x5 = BigNumber.from('400000000000000000000'); // 2ˆ2
const a5 = BigNumber.from('5459815003314423907810'); // eˆ(x5)
const x6 = BigNumber.from('200000000000000000000'); // 2ˆ1
const a6 = BigNumber.from('738905609893065022723'); // eˆ(x6)
const x7 = BigNumber.from('100000000000000000000'); // 2ˆ0
const a7 = BigNumber.from('271828182845904523536'); // eˆ(x7)
const x8 = BigNumber.from('50000000000000000000'); // 2ˆ-1
const a8 = BigNumber.from('164872127070012814685'); // eˆ(x8)
const x9 = BigNumber.from('25000000000000000000'); // 2ˆ-2
const a9 = BigNumber.from('128402541668774148407'); // eˆ(x9)
const x10 = BigNumber.from('12500000000000000000'); // 2ˆ-3
const a10 = BigNumber.from('113314845306682631683'); // eˆ(x10)
const x11 = BigNumber.from('6250000000000000000'); // 2ˆ-4
const a11 = BigNumber.from('106449445891785942956'); // eˆ(x11)

/**
 * @dev Exponentiation (x^y) with unsigned 18 decimal fixed point base and exponent.
 *
 * Reverts if ln(x) * y is smaller than `MIN_NATURAL_EXPONENT`, or larger than `MAX_NATURAL_EXPONENT`.
 */
export function pow(x: BigNumber, y: BigNumber): BigNumber {
    if (y.eq(0)) {
        // We solve the 0^0 indetermination by making it equal one.
        return ONE_18;
    }

    if (x.eq(0)) {
        return ZERO;
    }
    let x_int256 = x;
    let y_int256 = y
    let logx_times_y
    if (LN_36_LOWER_BOUND.lt(x_int256) && x_int256.lt(LN_36_UPPER_BOUND)) {
        let ln_36_x = _ln_36(x_int256);

        // ln_36_x has 36 decimal places, so multiplying by y_int256 isn't as straightforward, since we can't just
        // bring y_int256 to 36 decimal places, as it might overflow. Instead, we perform two 18 decimal
        // multiplications and add the results: one with the first 18 decimals of ln_36_x, and one with the
        // (downscaled) last 18 decimals.
        logx_times_y = (ln_36_x.div(ONE_18).mul(y_int256)).add(ln_36_x.mod(ONE_18).mul(y_int256).div(ONE_18))
    } else {
        logx_times_y = _ln(x_int256).mul(y_int256);
    }
    logx_times_y = logx_times_y.div(ONE_18);


    return exp(logx_times_y); // that +1 differs from the original variant
}

/**
 * @dev Natural exponentiation (e^x) with signed 18 decimal fixed point exponent.
 *
 * Reverts if `x` is smaller than MIN_NATURAL_EXPONENT, or larger than `MAX_NATURAL_EXPONENT`.
 */
export function exp(x: BigNumber): BigNumber {

    if (x.lt(ZERO)) {
        // We only handle positive exponents: e^(-x) is computed as 1 / e^x. We can safely make x positive since it
        // fits in the signed 256 bit range (as it is larger than MIN_NATURAL_EXPONENT).
        // Fixed point division requires multiplying by ONE_18.
        return (ONE_18.mul(ONE_18)).div(exp(x.mul(-1)));
    }
    // First, we use the fact that e^(x+y) = e^x * e^y to decompose x into a sum of powers of two, which we call x_n,
    // where x_n == 2^(7 - n), and e^x_n = a_n has been precomputed. We choose the first x_n, x0, to equal 2^7
    // because all larger powers are larger than MAX_NATURAL_EXPONENT, and therefore not present in the
    // decomposition.
    // At the end of this process we will have the product of all e^x_n = a_n that apply, and the remainder of this
    // decomposition, which will be lower than the smallest x_n.
    // exp(x) = k_0 * a_0 * k_1 * a_1 * ... + k_n * a_n * exp(remainder), where each k_n equals either 0 or 1.
    // We mutate x by subtracting x_n, making it the remainder of the decomposition.

    // The first two a_n (e^(2^7) and e^(2^6)) are too large if stored as 18 decimal numbers, and could cause
    // intermediate overflows. Instead we store them as plain integers, with 0 decimals.
    // Additionally, x0 + x1 is larger than MAX_NATURAL_EXPONENT, which means they will not both be present in the
    // decomposition.

    // For each x_n, we test if that term is present in the decomposition (if x is larger than it), and if so deduct
    // it and compute the accumulated product.

    let firstAN;
    if (x.gte(x0)) {
        x = x.sub(x0);
        firstAN = a0;
    } else if (x.gte(x1)) {
        x = x.sub(x1);
        firstAN = a1;
    } else {
        firstAN = BigNumber.from(1); // One with no decimal places
    }

    // We now transform x into a 20 decimal fixed point number, to have enhanced precision when computing the
    // smaller terms.
    x = x.mul(100);

    // `product` is the accumulated product of all a_n (except a0 and a1), which starts at 20 decimal fixed point
    // one. Recall that fixed point multiplication requires dividing by ONE_20.
    let product = ONE_20;

    if (x.gte(x2)) {
        x = x.sub(x2);
        product = product.mul(a2).div(ONE_20);
    }
    if (x.gte(x3)) {
        x = x.sub(x3);
        product = product.mul(a3).div(ONE_20);
    }
    if (x.gte(x4)) {
        x = x.sub(x4);
        product = product.mul(a4).div(ONE_20);
    }
    if (x.gte(x5)) {
        x = x.sub(x5);
        product = product.mul(a5).div(ONE_20);
    }
    if (x.gte(x6)) {
        x = x.sub(x6);
        product = product.mul(a6).div(ONE_20);
    }
    if (x.gte(x7)) {
        x = x.sub(x7);
        product = product.mul(a7).div(ONE_20);
    }
    if (x.gte(x8)) {
        x = x.sub(x8);
        product = product.mul(a8).div(ONE_20);
    }
    if (x.gte(x9)) {
        x = x.sub(x9);
        product = product.mul(a9).div(ONE_20);
    }

    // x10 and x11 are unnecessary here since we have high enough precision already.

    // Now we need to compute e^x, where x is small (in particular, it is smaller than x9). We use the Taylor series
    // expansion for e^x: 1 + x + (x^2 / 2!) + (x^3 / 3!) + ... + (x^n / n!).

    let seriesSum = ONE_20; // The initial one in the sum, with 20 decimal places.
    let term; // Each term in the sum, where the nth term is (x^n / n!).

    // The first term is simply x.
    term = x;
    seriesSum = seriesSum.add(term);

    // Each term (x^n / n!) equals the previous one times x, divided by n. Since x is a fixed point number,
    // multiplying by it requires dividing by ONE_20, but dividing by the non-fixed point n values does not.

    term = term.mul(x).div(ONE_20).div(2);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(3);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(4);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(5);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(6);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(7);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(8);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(9);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(10);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(11);
    seriesSum = seriesSum.add(term);

    term = term.mul(x).div(ONE_20).div(12);
    seriesSum = seriesSum.add(term);

    // 12 Taylor terms are sufficient for 18 decimal precision.

    // We now have the first a_n (with no decimals), and the product of all other a_n present, and the Taylor
    // approximation of the exponentiation of the remainder (both with 20 decimals). All that remains is to multiply
    // all three (one 20 decimal fixed point multiplication, dividing by ONE_20, and one integer multiplication),
    // and then drop two digits to return an 18 decimal value.

    return ((product.mul(seriesSum)).div(ONE_20).mul(firstAN)).div(100);
}

/**
 * @dev Logarithm (log(arg, base), with signed 18 decimal fixed point base and argument.
 */
export function log(arg: BigNumber, base: BigNumber): BigNumber {
    // This performs a simple base change: log(arg, base) = ln(arg) / ln(base).

    // Both logBase and logArg are computed as 36 decimal fixed point numbers, either by using ln_36, or by
    // upscaling.

    let logBase;
    if (LN_36_LOWER_BOUND.lt(base) && base.lt(LN_36_UPPER_BOUND)) {
        logBase = _ln_36(base);
    } else {
        logBase = _ln(base).mul(ONE_18);
    }

    let logArg;
    if (LN_36_LOWER_BOUND.lt(arg) && arg.lt(LN_36_UPPER_BOUND)) {
        logArg = _ln_36(arg);
    } else {
        logArg = _ln(arg).mul(ONE_18);
    }

    // When dividing, we multiply by ONE_18 to arrive at a result with 18 decimal places
    return logArg.mul(ONE_18).div(logBase);
}

/**
 * @dev Natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
 */
export function ln(a: BigNumber): BigNumber {
    // The real natural logarithm is not defined for negative numbers or zero.

    if (LN_36_LOWER_BOUND.lt(a) && a.lt(LN_36_UPPER_BOUND)) {
        return _ln_36(a).div(ONE_18);
    } else {
        return _ln(a);
    }
}

/**
 * @dev Internal natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
 */
export function _ln(a: BigNumber): BigNumber {
    if (a.lt(ONE_18)) {
        // Since ln(a^k) = k * ln(a), we can compute ln(a) as ln(a) = ln((1/a)^(-1)) = - ln((1/a)). If a is less
        // than one, 1/a will be greater than one, and this if statement will not be entered in the recursive call.
        // Fixed point division requires multiplying by ONE_18.
        return (_ln((ONE_18.mul(ONE_18)).div(a))).mul(-1);
    }

    // First, we use the fact that ln^(a * b) = ln(a) + ln(b) to decompose ln(a) into a sum of powers of two, which
    // we call x_n, where x_n == 2^(7 - n), which are the natural logarithm of precomputed quantities a_n (that is,
    // ln(a_n) = x_n). We choose the first x_n, x0, to equal 2^7 because the exponential of all larger powers cannot
    // be represented as 18 fixed point decimal numbers in 256 bits, and are therefore larger than a.
    // At the end of this process we will have the sum of all x_n = ln(a_n) that apply, and the remainder of this
    // decomposition, which will be lower than the smallest a_n.
    // ln(a) = k_0 * x_0 + k_1 * x_1 + ... + k_n * x_n + ln(remainder), where each k_n equals either 0 or 1.
    // We mutate a by subtracting a_n, making it the remainder of the decomposition.

    // For reasons related to how `exp` works, the first two a_n (e^(2^7) and e^(2^6)) are not stored as fixed point
    // numbers with 18 decimals, but instead as plain integers with 0 decimals, so we need to multiply them by
    // ONE_18 to convert them to fixed point.
    // For each a_n, we test if that term is present in the decomposition (if a is larger than it), and if so divide
    // by it and compute the accumulated sum.

    let sum = ZERO;
    if (a.gte(a0.mul(ONE_18))) {
        a = a.div(a0); // Integer, not fixed point division
        sum = sum.add(x0);
    }

    if (a.gte(a1.mul(ONE_18))) {
        a = a.div(a1); // Integer, not fixed point division
        sum = sum.add(x1);
    }

    // All other a_n and x_n are stored as 20 digit fixed point numbers, so we convert the sum and a to this format.
    sum = sum.mul(100);
    a = a.mul(100);

    // Because further a_n are  20 digit fixed point numbers, we multiply by ONE_20 when dividing by them.

    if (a.gte(a2)) {
        a = a.mul(ONE_20).div(a2);
        sum = sum.add(x2);
    }

    if (a.gte(a3)) {
        a = a.mul(ONE_20).div(a3);
        sum = sum.add(x3);
    }

    if (a.gte(a4)) {
        a = a.mul(ONE_20).div(a4);
        sum = sum.add(x4);
    }

    if (a.gte(a5)) {
        a = a.mul(ONE_20).div(a5);
        sum = sum.add(x5);
    }

    if (a.gte(a6)) {
        a = a.mul(ONE_20).div(a6);
        sum = sum.add(x6);
    }

    if (a.gte(a7)) {
        a = a.mul(ONE_20).div(a7);
        sum = sum.add(x7);
    }

    if (a.gte(a8)) {
        a = a.mul(ONE_20).div(a8);
        sum = sum.add(x8);
    }

    if (a.gte(a9)) {
        a = a.mul(ONE_20).div(a9);
        sum = sum.add(x9);
    }

    if (a.gte(a10)) {
        a = a.mul(ONE_20).div(a10);
        sum = sum.add(x10);
    }

    if (a.gte(a11)) {
        a = a.mul(ONE_20).div(a11);
        sum = sum.add(x11);
    }

    // a is now a small number (smaller than a_11, which roughly equals 1.06). This means we can use a Taylor series
    // that converges rapidly for values of `a` close to one - the same one used in ln_36.
    // Let z = (a - 1) / (a + 1).
    // ln(a) =2.mul((z + z^.div( 3) + z^5 / 5 + z^7 / 7 + ... + z^(2 * n + 1) / (2 * n + 1))

    // Recall that 20 digit fixed point division requires multiplying by ONE_20, and multiplication requires
    // division by ONE_20.
    let z = ((a.sub(ONE_20)).mul(ONE_20)).div(a.add(ONE_20));
    let z_squared = (z.mul(z)).div(ONE_20);

    // num is the numerator of the series: the z^(2 * n + 1) term
    let num = z;

    // seriesSum holds the accumulated sum of each term in the series, starting with the initial z
    let seriesSum = num;

    // In each step, the numerator is multiplied by z^2
    num = num.mul(z_squared).div(ONE_20);
    seriesSum = seriesSum.add(num.div(3));

    num = num.mul(z_squared).div(ONE_20);
    seriesSum = seriesSum.add(num.div(5));

    num = num.mul(z_squared).div(ONE_20);
    seriesSum = seriesSum.add(num.div(7));

    num = num.mul(z_squared).div(ONE_20);
    seriesSum = seriesSum.add(num.div(9));

    num = num.mul(z_squared).div(ONE_20);
    seriesSum = seriesSum.add(num.div(11));

    // 6 Taylor terms are sufficient for 36 decimal precision.

    // Finally, we multiply by 2 (non fixed point) to compute ln(remainder)
    seriesSum = seriesSum.mul(2);

    // We now have the sum of all x_n present, and the Taylor approximation of the logarithm of the remainder (both
    // with 20 decimals). All that remains is to sum these two, and then drop two digits to return a 18 decimal
    // value.

    return sum.add(seriesSum).div(100);
}

/**
 * @dev Intrnal high precision (36 decimal places) natural logarithm (ln(x)) with signed 18 decimal fixed point argument,
 * for x close to one.
 *
 * Should only be used if x is between LN_36_LOWER_BOUND and LN_36_UPPER_BOUND.
 */
export function _ln_36(x: BigNumber): BigNumber {
    // Since ln(1) = 0, a value of x close to one will yield a very small result, which makes using 36 digits
    // worthwhile.

    // First, we transform x to a 36 digit fixed point value.
    x = x.mul(ONE_18);

    // We will use the following Taylor expansion, which converges very rapidly. Let z = (x - 1) / (x + 1).
    // ln(x) = 2 * (z + z^3 / 3 + z^5 / 5 + z^7 / 7 + ... + z^(2 * n + 1) / (2 * n + 1))

    // Recall that 36 digit fixed point division requires multiplying by ONE_36, and multiplication requires
    // division by ONE_36.
    let z = x.sub(ONE_36).mul(ONE_36).div(x.add(ONE_36));
    let z_squared = z.mul(z).div(ONE_36);

    // num is the numerator of the series: the z^(2 * n + 1) term
    let num = z;

    // seriesSum holds the accumulated sum of each term in the series, starting with the initial z
    let seriesSum = num;

    // In each step, the numerator is multiplied by z^2
    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(3));

    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(5));

    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(7));

    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(9));

    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(11));

    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(13));

    num = num.mul(z_squared).div(ONE_36);
    seriesSum = seriesSum.add(num.div(15));

    // 8 Taylor terms are sufficient for 36 decimal precision.

    // All that remains is multiplying by 2 (non fixed point).
    return seriesSum.mul(2);
}

