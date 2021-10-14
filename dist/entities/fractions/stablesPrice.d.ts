import { BigintIsh } from '../../constants';
import { Currency } from '../currency';
import { Fraction } from './fraction';
export declare class StablesPrice extends Fraction {
    readonly currencies: Currency[];
    constructor(currencies: Currency[], denominator: BigintIsh, numerator: BigintIsh);
    get raw(): Fraction;
}
