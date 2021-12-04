import { Token } from '../token'
import { TokenAmount } from './tokenAmount'
import { currencyEquals } from '../token'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'

import { BigintIsh, Rounding, TEN } from '../../constants'
import { Currency } from '../currency'
import { Route } from '../route'
import { RouteV3 } from 'entities/routeV3'
import { RouteV4 } from 'entities/routeV4'
import { Fraction } from './fraction'
import { CurrencyAmount } from './currencyAmount'
// import { Pair } from 'entities'
import { StablePairWrapper } from 'entities/stablePairWrapper'
import { WeightedPair } from 'entities'
import { PoolType } from '../pool'

export class Price extends Fraction {
  public readonly baseCurrency: Currency // input i.e. denominator
  public readonly quoteCurrency: Currency // output i.e. numerator
  public readonly scalar: Fraction // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  public static fromRoute(route: Route): Price {
    const prices: Price[] = []
    for (const [i, pair] of route.pairs.entries()) {
      prices.push(
        route.path[i].equals(pair.token0)
          ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw)
          : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw)
      )
    }
    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  }

  // upgraded version to include StablePairWrappers in a Route
  public static fromRouteV3(route: RouteV3): Price {
    const prices: Price[] = []
    for (const [i, source] of route.sources.entries()) {
      // if (source.type !== 'Pair') {
      //   console.log("invariant", (source as StablePairWrapper).status)
      //   invariant((source as StablePairWrapper).status === 'PRICED', 'NOT PRICED')
      // }
      prices.push(
        route.path[i].equals(source.token0)
          ? (source.type === PoolType.Pair
            ? new Price(source.reserve0.currency, source.reserve1.currency, source.reserve0.raw, source.reserve1.raw)
            // here we need the recorded prcing bases
            : new Price(source.reserve0.currency, source.reserve1.currency,
              (source as StablePairWrapper).pricingBasesIn[0].raw,
              (source as StablePairWrapper).pricingBasesOut[1].raw))
          : (source.type === PoolType.Pair ?
            new Price(source.reserve1.currency, source.reserve0.currency, source.reserve1.raw, source.reserve0.raw)
            // pricing base for stablePriceWrapper
            : new Price(source.reserve1.currency, source.reserve0.currency,
              (source as StablePairWrapper).pricingBasesIn[1].raw,
              (source as StablePairWrapper).pricingBasesOut[0].raw))
      )
    }
    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  }

  // upgraded version to include StablePairWrappers in a Route
  // as well as weighted pairs
  public static fromRouteV4(route: RouteV4): Price {
    const prices: Price[] = []
    for (const [i, pool] of route.pools.entries()) {
      let price: any
      if (route.path[i].equals(pool.token0)) {
        switch (pool.type) {
          // regular UniswapV2 type pairs can be priced using just amounts
          case PoolType.Pair: {
            price = new Price(pool.reserve0.currency, pool.reserve1.currency, pool.reserve0.raw, pool.reserve1.raw)
            break;
          }
          // here we need the recorded prcing bases
          case PoolType.StablePairWrapper: {
            price = new Price(pool.reserve0.currency, pool.reserve1.currency,
              (pool as StablePairWrapper).pricingBasesIn[0].raw,
              (pool as StablePairWrapper).pricingBasesOut[1].raw)
            break;
          }
          // prcing for weighted pairs - not directly derivable from token amounts
          case PoolType.WeightedPair: {
            price = new Price(pool.reserve0.currency, pool.reserve1.currency,
              (pool as WeightedPair).pricingBasesIn[0].raw,
              (pool as WeightedPair).pricingBasesOut[1].raw)
            break;
          }
        }
      }
      else {
        switch (pool.type) {
          // regular UniswapV2 type pairs can be priced using just amounts
          case PoolType.Pair: {
            price = new Price(pool.reserve1.currency, pool.reserve0.currency, pool.reserve1.raw, pool.reserve0.raw)
            break;
          }
          // pricing base for stablePriceWrapper
          case PoolType.StablePairWrapper: {
            price = new Price(pool.reserve1.currency, pool.reserve0.currency,
              (pool as StablePairWrapper).pricingBasesIn[1].raw,
              (pool as StablePairWrapper).pricingBasesOut[0].raw)
            break;
          }
          // pricing base for weighted pairs
          case PoolType.WeightedPair: {
            price = new Price(pool.reserve1.currency, pool.reserve0.currency,
              (pool as WeightedPair).pricingBasesIn[1].raw,
              (pool as WeightedPair).pricingBasesOut[0].raw)
            break;
          }
        }
      }
      prices.push(price)
    }
    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  }

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(baseCurrency: Currency, quoteCurrency: Currency, denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator)

    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      JSBI.exponentiate(TEN, JSBI.BigInt(baseCurrency.decimals)),
      JSBI.exponentiate(TEN, JSBI.BigInt(quoteCurrency.decimals))
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
  public quote(currencyAmount: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(currencyAmount.currency, this.baseCurrency), 'TOKEN')
    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, super.multiply(currencyAmount.raw).quotient)
    }
    return CurrencyAmount.ether(super.multiply(currencyAmount.raw).quotient)
  }

  public toSignificant(significantDigits: number = 6, format?: object, rounding?: Rounding): string {
    return this.adjusted.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number = 4, format?: object, rounding?: Rounding): string {
    return this.adjusted.toFixed(decimalPlaces, format, rounding)
  }
}
