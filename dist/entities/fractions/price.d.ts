import { BigintIsh } from '../../constants';
import { Currency } from '../currency';
import { Fraction, Rounding } from './fraction';
import { CurrencyAmount } from './currencyAmount';
import { Pool } from '../pools/pool';
import { Route } from '../route';
export declare class Price extends Fraction {
    readonly baseCurrency: Currency;
    readonly quoteCurrency: Currency;
    readonly scalar: Fraction;
    static fromRoute(route: Route, poolDict: {
        [id: string]: Pool;
    }): Price;
    constructor(baseCurrency: Currency, quoteCurrency: Currency, denominator: BigintIsh, numerator: BigintIsh);
    get raw(): Fraction;
    get adjusted(): Fraction;
    invert(): Price;
    multiply(other: Price): Price;
    quote(chainId: number, currencyAmount: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}
