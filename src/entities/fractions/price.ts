import { Token } from '../token'
import { TokenAmount } from './tokenAmount'
import { currencyEquals } from '../token'
import invariant from 'tiny-invariant'

import { BigintIsh, TEN } from '../../constants'
import { Currency } from '../currency'

import { Fraction, Rounding } from './fraction'
import { CurrencyAmount } from './currencyAmount'

import { Pool } from '../pools/pool'
import { Route } from '../route'


export class Price extends Fraction {
  public readonly baseCurrency: Currency // input i.e. denominator
  public readonly quoteCurrency: Currency // output i.e. numerator
  public readonly scalar: Fraction // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token


  // upgraded version to include StablePairWrappers in a Route
  // as well as weighted pairs
  public static fromRoute(route: Route, poolDict: { [id: string]: Pool }): Price {
    const prices: Price[] = []
    // console.log("=========PATH", route.path.map(x=>x.symbol))
    // console.log("=========PATH PAIRs", route.pairData.map(x=>[x.token0.symbol, x.token1.symbol]))
    for (const [i, pool] of route.pairData.entries()) {
      const price = pool.poolPrice(route.path[i], route.path[i + 1], poolDict)
      prices.push(price)
    }
    // console.log("=========PRICE", prices.map(p=>[p.baseCurrency.symbol, p.quoteCurrency.symbol]))
    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  }

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(baseCurrency: Currency, quoteCurrency: Currency, denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator)

    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      TEN.pow(baseCurrency.decimals),
      TEN.pow(quoteCurrency.decimals)
    )
  }

  public get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }

  public get adjusted(): Fraction {
    return super.multiply(this.scalar)
  }

  public invert(): Price {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator)
  }

  public multiply(other: Price): Price {
    invariant(currencyEquals(this.quoteCurrency, other.baseCurrency), 'TOKEN')
    const fraction = super.multiply(other)
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator)
  }

  // performs floor division on overflow
  public quote(chainId: number, currencyAmount: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(currencyAmount.currency, this.baseCurrency), 'TOKEN')
    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, super.multiply(currencyAmount.raw).quotient)
    }
    return CurrencyAmount.networkCCYAmount(chainId, super.multiply(currencyAmount.raw).quotient)
  }

  public toSignificant(significantDigits: number = 6, format?: object, rounding?: Rounding): string {
    return this.adjusted.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number = 4, format?: object, rounding?: Rounding): string {
    return this.adjusted.toFixed(decimalPlaces, format, rounding)
  }
}
