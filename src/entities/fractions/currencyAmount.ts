import { currencyEquals } from '../token'
import { Currency, ChainId, NETWORK_CCY } from '../currency'
import invariant from 'tiny-invariant'
import _Big from 'big.js'
import toFormat from 'toformat'
import { BigNumber } from '@ethersproject/bignumber'
import { BigintIsh, TEN, SolidityType } from '../../constants'
import { parseBigintIsh, validateSolidityTypeInstance } from '../../helperUtils'
import { Fraction, Rounding } from './fraction'

const Big = toFormat(_Big)

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  /**
   * Helper that calls the constructor with the more flexible network currency
   * dependent on the selected chainId
   * @param amount ether amount in wei
   */
  public static networkCCYAmount(chainId: ChainId, amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(NETWORK_CCY[chainId], amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, TEN.pow(currency.decimals))
    this.currency = currency
  }

  public get raw(): BigNumber {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.raw.add(other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.raw.sub(other.raw))
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }

  public toBigNumber(): BigNumber { return BigNumber.from(this.numerator.toString()) }
}
