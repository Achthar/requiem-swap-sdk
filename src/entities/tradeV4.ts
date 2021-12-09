import invariant from 'tiny-invariant'

import { ChainId, ONE, TradeType, ZERO } from '../constants'
import { sortedInsert } from '../utils'
import { Currency, NETWORK_CCY } from './currency'
import { CurrencyAmount } from './fractions/currencyAmount'
import { Fraction } from './fractions/fraction'
import { Percent } from './fractions/percent'
import { Price } from './fractions/price'
import { TokenAmount, InputOutput } from './fractions/tokenAmount'
import { Pair } from './pair'
import { WeightedPair } from './weightedPair'
import { StablePairWrapper } from './stablePairWrapper'
import { Pool, PoolType } from './pool'
import { RouteV4 } from './routeV4'
import { StablePool } from './stablePool'
import { currencyEquals, Token, WRAPPED_NETWORK_TOKENS } from './token'

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
function computePriceImpact(midPrice: Price, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
  const exactQuote = midPrice.raw.multiply(inputAmount.raw)
  // calculate slippage := (exactQuote - outputAmount) / exactQuote
  const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
  return new Percent(slippage.numerator, slippage.denominator)
}

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparatorV4(a: InputOutput, b: InputOutput): number {
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
export function tradeComparatorV4(a: TradeV4, b: TradeV4) {
  const ioComp = inputOutputComparatorV4(a, b)
  if (ioComp !== 0) {
    return ioComp
  }

  // consider lowest slippage next, since these are less likely to fail
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1
  }

  // finally consider the number of hops since each hop costs gas
  return a.route.path.length - b.route.path.length
}

export interface BestTradeOptionsV4 {
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

function wrappedCurrency(currency: Currency, chainId: ChainId): Token {
  if (currency instanceof Token) return currency
  if (currency === NETWORK_CCY[chainId]) return WRAPPED_NETWORK_TOKENS[chainId]
  invariant(false, 'CURRENCY')
}

/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class TradeV4 {
  /**
   * The route of the trade, i.e. which pairs the trade goes through.
   */
  public readonly route: RouteV4
  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: TradeType
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: CurrencyAmount
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: CurrencyAmount
  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price
  /**
   * The mid price after the trade executes assuming no slippage.
   */
  public readonly nextMidPrice: Price
  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  public readonly priceImpact: Percent

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn(route: RouteV4, amountIn: CurrencyAmount): TradeV4 {
    return new TradeV4(route, amountIn, TradeType.EXACT_INPUT)
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut(route: RouteV4, amountOut: CurrencyAmount): TradeV4 {
    return new TradeV4(route, amountOut, TradeType.EXACT_OUTPUT)
  }

  public constructor(route: RouteV4, amount: CurrencyAmount, tradeType: TradeType) {
    const amounts: TokenAmount[] = new Array(route.path.length)
    const nextpools: Pool[] = new Array(route.pools.length)
    const stablePool = route.stablePool.clone()
    if (tradeType === TradeType.EXACT_INPUT) {
      invariant(currencyEquals(amount.currency, route.input), 'INPUT')
      amounts[0] = wrappedAmount(amount, route.chainId)
      for (let i = 0; i < route.path.length - 1; i++) {
        const pool = route.pools[i]
        const [outputAmount, nextpool] = pool instanceof Pair || pool instanceof WeightedPair ?
          pool.getOutputAmount(amounts[i]) :
          pool.getOutputAmount(amounts[i], stablePool)
        amounts[i + 1] = outputAmount
        nextpools[i] = nextpool
      }
    } else {
      invariant(currencyEquals(amount.currency, route.output), 'OUTPUT')
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId)
      for (let i = route.path.length - 1; i > 0; i--) {
        const pool = route.pools[i - 1]
        const [inputAmount, nextpool] = pool instanceof Pair || pool instanceof WeightedPair ?
          pool.getInputAmount(amounts[i]) :
          pool.getInputAmount(amounts[i], stablePool)
        amounts[i - 1] = inputAmount
        nextpools[i - 1] = nextpool
      }
    }

    this.route = route
    this.tradeType = tradeType
    this.inputAmount =
      tradeType === TradeType.EXACT_INPUT
        ? amount
        : route.input === NETWORK_CCY[route.chainId]
          ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[0].raw)
          : amounts[0]
    this.outputAmount =
      tradeType === TradeType.EXACT_OUTPUT
        ? amount
        : route.output === NETWORK_CCY[route.chainId]
          ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[amounts.length - 1].raw)
          : amounts[amounts.length - 1]
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw
    )
    this.nextMidPrice = Price.fromRouteV4(new RouteV4(nextpools, stablePool.clone(), route.input))
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }

  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public minimumAmountOut(slippageTolerance: Percent): CurrencyAmount {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.raw).quotient
      return this.outputAmount instanceof TokenAmount
        ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
        : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountOut)
    }
  }

  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public maximumAmountIn(slippageTolerance: Percent): CurrencyAmount {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient
      return this.inputAmount instanceof TokenAmount
        ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
        : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountIn)
    }
  }

  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactInIteration(
    originalStablePool: StablePool,
    stablePool: StablePool,
    pools: Pool[],
    currencyAmountIn: CurrencyAmount,
    currencyOut: Currency,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptionsV4 = {},
    // used in recursion.
    currentpools: Pool[] = [],
    originalAmountIn: CurrencyAmount = currencyAmountIn,
    bestTrades: TradeV4[] = []
  ): TradeV4[] {
    invariant(pools.length > 0, 'PAIRS')
    invariant(maxHops > 0, 'MAX_HOPS')
    invariant(originalAmountIn === currencyAmountIn || currentpools.length > 0, 'INVALID_RECURSION')
    const chainId: ChainId | undefined =
      currencyAmountIn instanceof TokenAmount
        ? currencyAmountIn.token.chainId
        : currencyOut instanceof Token
          ? currencyOut.chainId
          : undefined
    invariant(chainId !== undefined, 'CHAIN_ID')
    // create copy of stablePool object no not change the original one
    // const stablePoolForIteration = stablePool.clone()

    const amountIn = wrappedAmount(currencyAmountIn, chainId)
    const tokenOut = wrappedCurrency(currencyOut, chainId)

    if ( // check if it can be only a single stable swap trade
      currencyAmountIn instanceof TokenAmount &&
      currencyOut instanceof Token &&
      Object.values(stablePool.tokens).includes(currencyAmountIn.token) &&
      Object.values(stablePool.tokens).includes(currencyOut)
    ) {
      const pool = StablePairWrapper.wrapSinglePairFromPool(
        stablePool,
        stablePool.indexFromToken(currencyAmountIn.token),
        stablePool.indexFromToken(currencyOut)
      )

      // write pricings into the pool
      pool.getOutputAmount(currencyAmountIn, stablePool)

      const stableTrade = new TradeV4(
        new RouteV4(
          [pool],
          originalStablePool,
          currencyAmountIn.token,
          currencyOut
        ),
        currencyAmountIn,
        TradeType.EXACT_INPUT
      )
      return [stableTrade]
    }

    for (let i = 0; i < pools.length; i++) {
      let pool = pools[i]

      if (!pool.token0.equals(amountIn.token) && !pool.token1.equals(amountIn.token)) continue
      if (pool.reserve0.equalTo(ZERO) || pool.reserve1.equalTo(ZERO)) continue

      let amountOut: TokenAmount
      // if( pool instanceof WeightedPair)  {console.log("out": pool.getInputAmount(amountOut) }
      try {
        if (pool.type === PoolType.Pair) {
          ;[amountOut] = (pool as Pair).getOutputAmount(amountIn)
        } else if (pool.type === PoolType.WeightedPair) {
          ;[amountOut] = (pool as WeightedPair).clone().getOutputAmount(amountIn)
          // ;[amountOut] = (pool as WeightedPair).getOutputAmount(amountIn)
          console.log("out weighted", amountOut.raw)
          // const [amountOut1,] = ((pool).clone() as any as Pair).getOutputAmount(amountIn)
          // console.log("out PAIR", amountOut1.raw)
        } else {
          [amountOut] = (pool as StablePairWrapper).getOutputAmount(amountIn, stablePool)
        }
        // ;[amountOut] = pool instanceof Pair || pool instanceof WeightedPair ? pool.getOutputAmount(amountIn) : pool.getOutputAmount(amountIn, stablePool)
      } catch (error) {
        // input too low
        if ((error as any).isInsufficientInputAmountError) {
          continue
        }
        throw error
      }
      // we have arrived at the output token, so this is the final trade of one of the paths
      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new TradeV4(
            new RouteV4([...currentpools, pool], originalStablePool, originalAmountIn.currency, currencyOut),
            originalAmountIn,
            TradeType.EXACT_INPUT
          ),
          maxNumResults,
          tradeComparatorV4
        )
      } else if (maxHops > 1 && pools.length > 1) {
        const poolsExcludingThispool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length))

        // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
        TradeV4.bestTradeExactInIteration(
          originalStablePool,
          stablePool,
          poolsExcludingThispool,
          amountOut,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1
          },
          [...currentpools, pool],
          originalAmountIn,
          bestTrades
        )
      }

    }
    return bestTrades
  }

  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param stablePool the stalePool used for the iteration - it will undergo changes
   * @param pools the pairs / wrapped pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentpools used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactOutIteration(
    originalStablePool: StablePool,
    stablePool: StablePool,
    pools: Pool[],
    currencyIn: Currency,
    currencyAmountOut: CurrencyAmount,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptionsV4 = {},
    // used in recursion.
    currentpools: Pool[] = [],
    originalAmountOut: CurrencyAmount = currencyAmountOut,
    bestTrades: TradeV4[] = []
  ): TradeV4[] {
    invariant(pools.length > 0, 'PAIRS')
    invariant(maxHops > 0, 'MAX_HOPS')
    invariant(originalAmountOut === currencyAmountOut || currentpools.length > 0, 'INVALID_RECURSION')
    const chainId: ChainId | undefined =
      currencyAmountOut instanceof TokenAmount
        ? currencyAmountOut.token.chainId
        : currencyIn instanceof Token
          ? currencyIn.chainId
          : undefined
    invariant(chainId !== undefined, 'CHAIN_ID')
    // create copy of stablePool object
    // const stablePoolForIteration = stablePool.clone()

    const amountOut = wrappedAmount(currencyAmountOut, chainId)
    const tokenIn = wrappedCurrency(currencyIn, chainId)

    if ( // check ifit can be only a single stable swap trade
      currencyAmountOut instanceof TokenAmount &&
      currencyIn instanceof Token &&
      Object.values(stablePool.tokens).includes(currencyAmountOut.token) &&
      Object.values(stablePool.tokens).includes(currencyIn)
    ) {
      const pool = StablePairWrapper.wrapSinglePairFromPool(
        stablePool,
        stablePool.indexFromToken(currencyAmountOut.token),
        stablePool.indexFromToken(currencyIn)
      )

      // return value does not matter, we just need the stablePool pricing to be stored in the pair
      pool.getInputAmount(amountOut, stablePool)

      const stableTrade = new TradeV4(
        new RouteV4(
          [pool],
          originalStablePool, currencyIn, currencyAmountOut.token),
        currencyAmountOut,
        TradeType.EXACT_OUTPUT
      )
      return [stableTrade]
    }

    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i]
      // pool irrelevant
      if (!pool.token0.equals(amountOut.token) && !pool.token1.equals(amountOut.token)) continue
      if (pool.reserve0.equalTo(ZERO) || pool.reserve1.equalTo(ZERO)) continue

      let amountIn: TokenAmount
      try {
        ;[amountIn] = pool instanceof Pair || pool instanceof WeightedPair ? pool.getInputAmount(amountOut) : pool.getInputAmount(amountOut, stablePool)
      } catch (error) {
        // not enough liquidity in this pool
        if ((error as any).isInsufficientReservesError) {
          continue
        }
        throw error
      }
      // we have arrived at the input token, so this is the first trade of one of the paths
      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          new TradeV4(
            new RouteV4([pool, ...currentpools], originalStablePool, currencyIn, originalAmountOut.currency),
            originalAmountOut,
            TradeType.EXACT_OUTPUT
          ),
          maxNumResults,
          tradeComparatorV4
        )
      } else if (maxHops > 1 && pools.length > 1) {
        const poolsExcludingThispool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length))

        // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
        TradeV4.bestTradeExactOutIteration(
          originalStablePool,
          stablePool,
          poolsExcludingThispool,
          currencyIn,
          amountIn,
          {
            maxNumResults,
            maxHops: maxHops - 1
          },
          [pool, ...currentpools],
          originalAmountOut,
          bestTrades
        )
      }
    }

    return bestTrades
  }


  public static bestTradeExactOut(
    stablePool: StablePool,
    pools: Pool[],
    currencyIn: Currency,
    currencyAmountOut: CurrencyAmount,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptionsV4 = {},
  ): TradeV4[] {

    return this.bestTradeExactOutIteration(
      stablePool,
      stablePool.clone(),
      pools,
      currencyIn,
      currencyAmountOut,
      { maxNumResults, maxHops },
      [],
      currencyAmountOut,
      [])

  }

  public static bestTradeExactIn(
    stablePool: StablePool,
    pools: Pool[],
    currencyAmountIn: CurrencyAmount,
    currencyOut: Currency,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptionsV4 = {},
  ): TradeV4[] {
    return this.bestTradeExactInIteration(
      stablePool,
      stablePool.clone(),
      pools,
      currencyAmountIn,
      currencyOut,
      { maxNumResults, maxHops },
      [],
      currencyAmountIn,
      [])
  }
}
