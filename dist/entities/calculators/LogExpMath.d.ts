import { BigNumber } from '@ethersproject/bignumber';
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
export declare const ZERO: BigNumber;
export declare const ONE_18: BigNumber;
/**
 * @dev Exponentiation (x^y) with unsigned 18 decimal fixed point base and exponent.
 *
 * Reverts if ln(x) * y is smaller than `MIN_NATURAL_EXPONENT`, or larger than `MAX_NATURAL_EXPONENT`.
 */
export declare function pow(x: BigNumber, y: BigNumber): BigNumber;
/**
 * @dev Natural exponentiation (e^x) with signed 18 decimal fixed point exponent.
 *
 * Reverts if `x` is smaller than MIN_NATURAL_EXPONENT, or larger than `MAX_NATURAL_EXPONENT`.
 */
export declare function exp(x: BigNumber): BigNumber;
/**
 * @dev Logarithm (log(arg, base), with signed 18 decimal fixed point base and argument.
 */
export declare function log(arg: BigNumber, base: BigNumber): BigNumber;
/**
 * @dev Natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
 */
export declare function ln(a: BigNumber): BigNumber;
/**
 * @dev Internal natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
 */
export declare function _ln(a: BigNumber): BigNumber;
/**
 * @dev Intrnal high precision (36 decimal places) natural logarithm (ln(x)) with signed 18 decimal fixed point argument,
 * for x close to one.
 *
 * Should only be used if x is between LN_36_LOWER_BOUND and LN_36_UPPER_BOUND.
 */
export declare function _ln_36(x: BigNumber): BigNumber;
