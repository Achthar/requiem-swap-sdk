import { Currency, ChainId } from '../currency';
import { BigNumber } from '@ethersproject/bignumber';
import { BigintIsh } from '../../constants';
import { Fraction, Rounding } from './fraction';
export declare class CurrencyAmount extends Fraction {
    readonly currency: Currency;
    /**
     * Helper that calls the constructor with the more flexible network currency
     * dependent on the selected chainId
     * @param amount ether amount in wei
     */
    static networkCCYAmount(chainId: ChainId, amount: BigintIsh): CurrencyAmount;
    protected constructor(currency: Currency, amount: BigintIsh);
    get raw(): BigNumber;
    add(other: CurrencyAmount): CurrencyAmount;
    subtract(other: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: object): string;
    toBigNumber(): BigNumber;
}
