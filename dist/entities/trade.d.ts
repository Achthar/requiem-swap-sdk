import { TradeType } from '../constants';
import { Currency } from './currency';
import { CurrencyAmount } from './fractions/currencyAmount';
import { Percent } from './fractions/percent';
import { Price } from './fractions/price';
import { InputOutput } from './fractions/tokenAmount';
import { Route } from './route';
import { PairData } from './pools/pairData';
import { Pool } from './pools/pool';
export declare function inputOutputComparator(a: InputOutput, b: InputOutput): number;
export declare function tradeComparator(a: Trade, b: Trade): number;
export interface BestTradeOptions {
    maxNumResults?: number;
    maxHops?: number;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export declare class Trade {
    /**
     * The route of the trade, i.e. which pairs the trade goes through.
     */
    readonly route: Route;
    /**
     * The type of the trade, either exact in or exact out.
     */
    readonly tradeType: TradeType;
    /**
     * The input amount for the trade assuming no slippage.
     */
    readonly inputAmount: CurrencyAmount;
    /**
     * The output amount for the trade assuming no slippage.
     */
    readonly outputAmount: CurrencyAmount;
    /**
     * The price expressed in terms of output amount/input amount.
     */
    readonly executionPrice: Price;
    /**
     * The percent difference between the mid price before the trade and the trade execution price.
     */
    readonly priceImpact: Percent;
    /**
     * Constructs an exact in trade with the given amount in and route
     * @param route route of the exact in trade
     * @param amountIn the amount being passed in
     */
    static exactIn(route: Route, amountIn: CurrencyAmount, poolDict: {
        [id: string]: Pool;
    }): Trade;
    /**
     * Constructs an exact out trade with the given amount out and route
     * @param route route of the exact out trade
     * @param amountOut the amount returned by the trade
     */
    static exactOut(route: Route, amountOut: CurrencyAmount, poolDict: {
        [id: string]: Pool;
    }): Trade;
    constructor(route: Route, amount: CurrencyAmount, tradeType: TradeType, poolDict: {
        [id: string]: Pool;
    });
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    minimumAmountOut(slippageTolerance: Percent): CurrencyAmount;
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    maximumAmountIn(slippageTolerance: Percent): CurrencyAmount;
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
    static bestTradeExactInIteration(pairData: PairData[], currencyAmountIn: CurrencyAmount, currencyOut: Currency, poolDict: {
        [id: string]: Pool;
    }, // pools used for pricing swap pairs
    { maxNumResults, maxHops }?: BestTradeOptions, currentpools?: PairData[], originalAmountIn?: CurrencyAmount, bestTrades?: Trade[]): Trade[];
    /**
     * similar to the above method but instead targets a fixed output amount
     * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
     * to an output token amount, making at most `maxHops` hops
     * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param currencyIn the currency to spend
     * @param currencyAmountOut the exact amount of currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentpools used in recursion; the current list of pairs
     * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactOutIteration(pairData: PairData[], currencyIn: Currency, currencyAmountOut: CurrencyAmount, poolDict: {
        [id: string]: Pool;
    }, // pools used for pricing swap pairs
    { maxNumResults, maxHops }?: BestTradeOptions, currentpools?: PairData[], originalAmountOut?: CurrencyAmount, bestTrades?: Trade[]): Trade[];
    /**
     *
     *
    */
    static bestTradeExactOut(pairData: PairData[], currencyIn: Currency, currencyAmountOut: CurrencyAmount, poolDict: {
        [id: string]: Pool;
    }, // pools used for pricing swap pairs
    { maxNumResults, maxHops }?: BestTradeOptions): Trade[];
    static bestTradeExactIn(pairData: PairData[], currencyAmountIn: CurrencyAmount, currencyOut: Currency, poolDict: {
        [id: string]: Pool;
    }, // pools used for pricing swap pairs
    { maxNumResults, maxHops }?: BestTradeOptions): Trade[];
}
