// import { Token } from '../token'
// import { TokenAmount } from './tokenAmount'
// import { currencyEquals } from '../token'
// import invariant from 'tiny-invariant'
// import JSBI from 'jsbi'

import { BigintIsh } from '../../constants'
import { Currency } from '../currency'
import { Fraction } from './fraction'
// import { CurrencyAmount } from './currencyAmount'

export class StablesPrice extends Fraction {
  public readonly currencies: Currency[] // input i.e. denominator

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(currencies: Currency[], denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator)
    this.currencies = currencies
  }

  public get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }
}
