import { BigNumber } from '@ethersproject/bignumber';
export declare const ONE: BigNumber;
export declare const MIN_POW_BASE_FREE_EXPONENT: BigNumber;
export declare function mulDown(a: BigNumber, b: BigNumber): BigNumber;
export declare function mulUp(a: BigNumber, b: BigNumber): BigNumber;
export declare function divDown(a: BigNumber, b: BigNumber): BigNumber;
export declare function divUp(a: BigNumber, b: BigNumber): BigNumber;
/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding down. The result is guaranteed to not be above
 * the true value (that is, the error function expected - actual is always positive).
 */
export declare function powDown(x: BigNumber, y: BigNumber): BigNumber;
/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding up. The result is guaranteed to not be below
 * the true value (that is, the error function expected - actual is always negative).
 */
export declare function powUp(x: BigNumber, y: BigNumber): BigNumber;
/**
 * @dev Returns the complement of a value (1 - x), capped to 0 if x is larger than 1.
 *
 * Useful when computing the complement for values with some level of relative error, as it strips this error and
 * prevents intermediate negative values.
 */
export declare function complement(x: BigNumber): BigNumber;
/**
 * @dev Returns the largest of two numbers of 256 bits.
 */
export declare function max(a: BigNumber, b: BigNumber): BigNumber;
/**
 * @dev Returns the smallest of two numbers of 256 bits.
 */
export declare function min(a: BigNumber, b: BigNumber): BigNumber;
