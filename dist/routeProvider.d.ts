import { PairData } from "./entities/pools/pairData";
import { SwapData } from "./entities/pools/swapData";
import { SwapRoute } from "./entities/swapRoute";
import { ChainId, Currency, Token } from ".";
export declare function wrappedCurrency(currency: Currency, chainId: ChainId): Token;
export declare class RouteProvider {
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
    static getRouteIteration(pairData: PairData[], tokenIn: Token, tokenOut: Token, maxHops?: number, lastPool?: string, currentpools?: SwapData[], originalCurrencyIn?: Token, bestRoutes?: SwapRoute[]): SwapRoute[];
    static getRoutes(pairData: PairData[], currencyIn: Token, currencyOut: Token, maxHops?: number): SwapRoute[];
}
