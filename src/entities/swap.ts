import invariant from 'tiny-invariant'

import { ONE, ZERO } from '../constants'
// import { sortedInsert } from '../helperUtils'
import { ChainId, NETWORK_CCY } from './currency'
import { CurrencyAmount } from './fractions/currencyAmount'
import { Fraction } from './fractions/fraction'
import { Percent } from './fractions/percent'
import { Price } from './fractions/price'
import { TokenAmount, InputOutput } from './fractions/tokenAmount'
import { currencyEquals, WRAPPED_NETWORK_TOKENS } from './token'
import {
  PoolDictionary
} from './pools/pool'
import { SwapRoute } from './swapRoute'
import * as _ from "lodash";
// import { SwapRoute } from './swapRoute'
// import { SwapData } from './pools/swapData'

export enum SwapType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
// function computePriceImpact(midPrice: Price, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
//   const exactQuote = midPrice.raw.multiply(inputAmount.raw)
//   // calculate slippage := (exactQuote - outputAmount) / exactQuote
//   const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
//   return new Percent(slippage.numerator, slippage.denominator)
// }

// function computePriceImpactWeightedPair(pair: WeightedPair, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
//   const artificialMidPrice = new Price(
//     inputAmount.currency,
//     outputAmount.currency,
//     pair.reserveOf(wrappedCurrency(inputAmount.currency, pair.chainId)).raw,
//     pair.reserveOf(wrappedCurrency(outputAmount.currency, pair.chainId)).raw)
//   const exactQuote = artificialMidPrice.raw.multiply(inputAmount.raw)
//   // calculate slippage := (exactQuote - outputAmount) / exactQuote
//   const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
//   return new Percent(slippage.numerator, slippage.denominator)
// }

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparator(a: InputOutput, b: InputOutput): number {
  // must have same input and output token for comparison
  invariant(currencyEquals(a.inputAmount.currency, b.inputAmount.currency), 'INPUT_CURRENCY')
  invariant(currencyEquals(a.outputAmount.currency, b.outputAmount.currency), 'OUTPUT_CURRENCY')
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0
    }
    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1
    } else {
      return 1
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1
    } else {
      return -1
    }
  }
}

// extension of the input output comparator that also considers other dimensions of the trade in ranking them
export function tradeComparator(a: Swap, b: Swap) {
  const ioComp = inputOutputComparator(a, b)
  if (ioComp !== 0) {
    return ioComp
  }

  // // consider lowest slippage next, since these are less likely to fail
  // if (a.priceImpact.lessThan(b.priceImpact)) {
  //   return -1
  // } else if (a.priceImpact.greaterThan(b.priceImpact)) {
  //   return 1
  // }

  // finally consider the number of hops since each hop costs gas
  return a.route.path.length - b.route.path.length
}

export interface BestTradeOptions {
  // how many results to return
  maxNumResults?: number
  // the maximum number of hops a trade should contain
  maxHops?: number
}

/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */
function wrappedAmount(currencyAmount: CurrencyAmount, chainId: ChainId): TokenAmount {
  if (currencyAmount instanceof TokenAmount) return currencyAmount
  if (currencyAmount.currency === NETWORK_CCY[chainId]) return new TokenAmount(WRAPPED_NETWORK_TOKENS[chainId], currencyAmount.raw)
  invariant(false, 'CURRENCY')
}

/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class Swap {
  /**
   * The route of the trade, i.e. which pairs the trade goes through.
   */
  public readonly route: SwapRoute
  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: SwapType
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly swapAmounts: TokenAmount[]
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: TokenAmount
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: TokenAmount

  public readonly isValid: boolean

  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price
  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  // public readonly priceImpact: Percent

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn(route: SwapRoute, amountIn: TokenAmount, poolDict: PoolDictionary): Swap {
    return new Swap(route, amountIn, SwapType.EXACT_INPUT, poolDict)
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut(route: SwapRoute, amountOut: TokenAmount, poolDict: PoolDictionary): Swap {
    return new Swap(route, amountOut, SwapType.EXACT_OUTPUT, poolDict)
  }

  public constructor(route: SwapRoute, amount: TokenAmount, tradeType: SwapType, poolDict: PoolDictionary) {
    const amounts: TokenAmount[] = new Array(route.path.length)
    let _isValid = true
    if (tradeType === SwapType.EXACT_INPUT) {
      invariant(currencyEquals(amount.currency, route.input), 'INPUT')
      amounts[0] = wrappedAmount(amount, route.chainId)
      let poolDictCopy: PoolDictionary = _.cloneDeep(poolDict);
      for (let i = 0; i < route.path.length - 1; i++) {
        const pair = route.swapData[i]
        try {
          const outputAmount = pair.calculateSwapGivenIn(amounts[i], poolDictCopy);
          // clone pool and adjust it for the swapped amount
          const pool = _.cloneDeep(poolDictCopy[pair.poolRef]);
          pool.adjustForSwap(amounts[i], outputAmount)
          // assign to cloned pool
          poolDictCopy[pair.poolRef] = pool;
          amounts[i + 1] = outputAmount;
        } catch {
          _isValid = false
          break;
        }
      }
    } else {
      invariant(currencyEquals(amount.currency, route.output), 'OUTPUT')
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId)
      let poolDictCopy: PoolDictionary = _.cloneDeep(poolDict);
      for (let i = route.path.length - 1; i > 0; i--) {
        const pair = route.swapData[i - 1]
        try {
          const inputAmount = pair.calculateSwapGivenOut(amounts[i], poolDictCopy)
          // clone pool and adjust it for the swapped amount
          const pool = _.cloneDeep(poolDictCopy[pair.poolRef]);
          pool.adjustForSwap(inputAmount, amounts[i])
          // assign to cloned pool
          poolDictCopy[pair.poolRef] = pool;
          amounts[i - 1] = inputAmount
        } catch {
          _isValid = false
          break;
        }
      }
    }
    this.isValid = _isValid
    this.route = route
    this.tradeType = tradeType
    this.swapAmounts = amounts
    if (this.isValid) {
      this.inputAmount = tradeType === SwapType.EXACT_INPUT ? amount : amounts[0]
      this.outputAmount = tradeType === SwapType.EXACT_OUTPUT ? amount : amounts[amounts.length - 1]
    } else { // default
      this.inputAmount = tradeType === SwapType.EXACT_INPUT ? amount : new TokenAmount(this.route.swapData[0].tokenIn, '0')
      this.outputAmount = tradeType === SwapType.EXACT_OUTPUT ? amount : new TokenAmount(this.route.swapData[this.route.swapData.length - 1].tokenIn, '0')
    }
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw
    )
    // this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)

  }

  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public minimumAmountOut(slippageTolerance: Percent): TokenAmount {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === SwapType.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.raw).quotient
      return new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
    }
  }

  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public maximumAmountIn(slippageTolerance: Percent): TokenAmount {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === SwapType.EXACT_INPUT) {
      return this.inputAmount
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient
      return new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
    }
  }
  /**
   * 
   * @param swapRoutes input routes - should already not include duplicates
   * @param swapType determines in which direction the swap will be calculated
   * @param poolDict dictionary used to price the trade routes
   * @returns trades in an array
   */
  public static PriceRoutes(swapRoutes: SwapRoute[], amount: TokenAmount, swapType: SwapType, poolDict: PoolDictionary): Swap[] {
    const swaps: Swap[] = []
    for (let i = 0; i < swapRoutes.length; i++) {
      const swap = new Swap(swapRoutes[i], amount, swapType, poolDict)
      if (swap.isValid)
        swaps.push(swap)
    }
    if (swapType === SwapType.EXACT_INPUT)
      return swaps.sort((a, b) => (a.outputAmount.raw.lt(b.outputAmount.raw) ? 1 : -1))
    else
      return swaps.filter(s => Swap.validateRouteForExactOut(s.route)).sort((a, b) => (a.inputAmount.raw.gt(b.inputAmount.raw)) ? 1 : -1)
  }

  /**
   * @notice the solidity router cannot calculate exact out swaps whewn routing twice through the same pool
   * -> this function returns false if the route is of that kind
   * @param route 
   * @returns 
   */
  public static validateRouteForExactOut(route: SwapRoute): boolean {
    const refs = route.swapData.map(sd => sd.poolRef)
    return (new Set(refs)).size === refs.length;
  }

}







