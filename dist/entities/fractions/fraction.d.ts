import { BigintIsh } from '../../constants';
import { BigNumber } from 'ethers';
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare class Fraction {
    readonly numerator: BigNumber;
    readonly denominator: BigNumber;
    constructor(numerator: BigintIsh, denominator?: BigintIsh);
    get quotient(): BigNumber;
    get remainder(): Fraction;
    invert(): Fraction;
    add(other: Fraction | BigintIsh): Fraction;
    subtract(other: Fraction | BigintIsh): Fraction;
    lessThan(other: Fraction | BigintIsh): boolean;
    equalTo(other: Fraction | BigintIsh): boolean;
    greaterThan(other: Fraction | BigintIsh): boolean;
    multiply(other: Fraction | BigintIsh): Fraction;
    divide(other: Fraction | BigintIsh): Fraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
}
