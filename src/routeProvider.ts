

// import { SwapData } from "entities/pools/SwapData";
// import { BigNumber } from "ethers";
// import { Pool, PoolDictionary, PoolHops, Token, ZERO } from ".";

import { PairData } from "./entities/pools/pairData"
import { SwapData } from "./entities/pools/swapData"
import { SwapRoute } from "./entities/swapRoute"
import invariant from "tiny-invariant"
import { ChainId, Currency, NETWORK_CCY, Token, WRAPPED_NETWORK_TOKENS } from "./entities"


export function wrappedCurrency(currency: Currency, chainId: ChainId): Token {
    if (currency instanceof Token) return currency
    if (currency === NETWORK_CCY[chainId]) return WRAPPED_NETWORK_TOKENS[chainId]
    invariant(false, 'CURRENCY')
  }

export class RouteProvider {

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
   public static getRouteIteration(
    pairData: PairData[],
    tokenIn: Token,
    tokenOut: Token,
    maxHops = 3,
    // used in recursion.
    lastPool:string='',
    currentpools: SwapData[] = [],
    originalCurrencyIn: Token = tokenIn,
    bestRoutes: SwapRoute[] = []
  ): SwapRoute[] {
    invariant(pairData.length > 0, 'PAIRS')
    invariant(maxHops > 0, 'MAX_HOPS')
    invariant(originalCurrencyIn === tokenIn || currentpools.length > 0, 'INVALID_RECURSION')
const relevantPairs = pairData.filter(p=>p.poolRef !== lastPool)
    for (let i = 0; i < relevantPairs.length; i++) {
      let pair = relevantPairs[i]
      // filters for valid connection
      const inIs0 = pair.token0.equals(tokenIn)
      if (!inIs0 && !pair.token1.equals(tokenIn)) continue;
      
      const tokenOutNew: Token = inIs0 ? pair.token1 : pair.token0
      
      let swap:SwapData
      // const lastSwap:SwapData = currentpools[currentpools.length -1]

      // if(lastSwap?.poolRef === pair.poolRef)
      // {
        // swap =  new SwapData(lastSwap.tokenIn, tokenOutNew, pair.poolRef)
      //   currentpools.splice(currentpools.length -1,1)
      // } else
      // {
        swap = new SwapData(tokenIn, tokenOutNew, pair.poolRef)
      // }
      // we have arrived at the output token, so this is the final trade of one of the paths
      if (tokenOutNew.equals(tokenOut)) {
        bestRoutes.push(new SwapRoute([...currentpools, swap]))
      } else if (maxHops > 1 && relevantPairs.length > 1) {
        // const poolsExcludingThispool = pairData.slice(0, i).concat(pairData.slice(i + 1, pairData.length)) // pairData.filter(data => data.poolRef !== pair.poolRef)

        // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
        RouteProvider.getRouteIteration(
          // poolsExcludingThispool,
          pairData,
          tokenOutNew,
          tokenOut,
          maxHops - 1,
          pair.poolRef,
          [...currentpools, swap],
          originalCurrencyIn,
          bestRoutes
        )
      }

    }
    return bestRoutes
  }

  public static getRoutes(
    pairData: PairData[],
    currencyIn: Token,
    currencyOut: Token,
    maxHops = 3
  ): SwapRoute[] {
    return this.getRouteIteration(
      pairData,
      currencyIn,
      currencyOut,
      maxHops,
      '',
      [],
      currencyIn,
      []
    )
  }
}


// export enum SwapTypes {
//     SwapExactIn,
//     SwapExactOut,
// }

// export interface SwapOptions {
//     gasPrice: BigNumber;
//     swapGas: BigNumber;
//     timestamp: number;
//     maxPools: number;
//     poolTypeFilter: PoolFilter;
//     forceRefresh: boolean;
// }


// export enum PoolFilter {
//     All = 'All',
//     Weighted = 'Weighted',
//     Stable = 'Stable',
//     MetaStable = 'MetaStable',
//     LBP = 'LiquidityBootstrapping',
//     Investment = 'Investment',
//     Element = 'Element',
//     AaveLinear = 'AaveLinear',
//     StablePhantom = 'StablePhantom',
//     ERC4626Linear = 'ERC4626Linear',
// }


// /*
// The purpose of this function is to build dictionaries of direct pools 
// and plausible hop pools.
// */
// export function filterPoolsOfInterest(
//     allPools: PoolDictionary,
//     tokenIn: Token,
//     tokenOut: Token,
//     maxPools: number
// ): [PoolDictionary, PoolHops, PoolHops] {
//     const directPools: PoolDictionary = {};
//     const hopsIn: PoolHops = {};
//     const hopsOut: PoolHops = {};

//     Object.keys(allPools).forEach((id) => {
//         const pool = allPools[id];
//         const tokenListSet = new Set(pool.tokens);
//         const containsTokenIn = tokenListSet.has(tokenIn);
//         const containsTokenOut = tokenListSet.has(tokenOut);

//         // This is a direct pool as has both tokenIn and tokenOut
//         if (containsTokenIn && containsTokenOut) {
//             directPools[pool.address] = pool;
//             return;
//         }

//         if (maxPools > 1) {
//             if (containsTokenIn && !containsTokenOut) {
//                 for (const hopToken of tokenListSet) {
//                     if (!hopsIn[hopToken.address]) hopsIn[hopToken.address] = new Set([]);
//                     hopsIn[hopToken.address].add(pool.address);
//                 }
//             } else if (!containsTokenIn && containsTokenOut) {
//                 for (const hopToken of [...tokenListSet]) {
//                     if (!hopsOut[hopToken.address]) hopsOut[hopToken.address] = new Set([]);
//                     hopsOut[hopToken.address].add(pool.address);
//                 }
//             }
//         }
//     });
//     return [directPools, hopsIn, hopsOut];
// }



// export function searchConnectionsTo(
//     token: Token,
//     poolsDict: { [id: string]: Pool },
//     toToken: Token
//   ): Path[] {
//     // this assumes that every pool in poolsDict contains toToken
//     const connections: Path[] = [];
//     for (const id in poolsDict) {
//       const pool = poolsDict[id];
//       if (pool.involvesToken(token)) {
//         const connection = createPath([token, toToken], [pool]);
//         connections.push(connection);
//       }
//     }
//     return connections;
//   }
  
//   export interface Path {
//     id: string; // pool address if direct path, contactenation of pool addresses if multihop
//     swaps: Swap[];
//   }
  
//   export interface Swap {
//     pool: string;
//     tokenIn: Token;
//     tokenOut: Token;
//     swapAmount?: BigNumber;
//   }
  
//   // Creates a path with pools.length hops
//   // i.e. tokens[0]>[Pool0]>tokens[1]>[Pool1]>tokens[2]>[Pool2]>tokens[3]
//   export function createPath(tokens: Token[], pools: Pool[]): Path {
//     let tI: Token, tO: Token;
//     const swaps: Swap[] = [];
//     // const poolPairData: PairData[] = [];
//     let id = '';
  
//     for (let i = 0; i < pools.length; i++) {
//       tI = tokens[i];
//       tO = tokens[i + 1];
//       // const poolPair = pools[i].parsePoolPairData(tI, tO);
//       // poolPairData.push(poolPair);
  
//       const swap: Swap = {
//         pool: pools[i].address,
//         tokenIn: tI,
//         tokenOut: tO,
//       };
  
//       swaps.push(swap);
//     }
  
//     const path: Path = {
//       id,
//       swaps,
//     };
  
//     return path;
//   }
  
  
  


// export function producePaths(
//     tokenIn: Token,
//     tokenOut: Token,
//     directPools: PoolDictionary,
//     hopsIn: PoolHops,
//     hopsOut: PoolHops,
//     pools: PoolDictionary
// ): Path[] {
//     const paths: Path[] = [];

//     // Create direct paths
//     for (const id in directPools) {
//         const path = createPath([tokenIn, tokenOut], [pools[id]]);
//         paths.push(path);
//     }

//     for (const hopToken in hopsIn) {
//         if (hopsOut[hopToken]) {
//             let highestNormalizedLiquidityFirst = ZERO; // Aux variable to find pool with most liquidity for pair (tokenIn -> hopToken)
//             let highestNormalizedLiquidityFirstPoolId: string | undefined; // Aux variable to find pool with most liquidity for pair (tokenIn -> hopToken)
//             let highestNormalizedLiquiditySecond = ZERO; // Aux variable to find pool with most liquidity for pair (hopToken -> tokenOut)
//             let highestNormalizedLiquiditySecondPoolId: string | undefined; // Aux variable to find pool with most liquidity for pair (hopToken -> tokenOut)
//             for (const poolInId of [...hopsIn[hopToken]]) {
//                 const poolIn = pools[poolInId.address];
//                 const poolPairData = SwapData.singleDataFromPool(
//                     tokenIn,
//                     hopToken,
//                     poolIn
//                 );
     
//                 // Cannot be strictly greater otherwise highestNormalizedLiquidityPoolId = 0 if hopTokens[i] balance is 0 in this pool.
//                 if (
//                     normalizedLiquidity.isGreaterThanOrEqualTo(
//                         highestNormalizedLiquidityFirst
//                     )
//                 ) {
//                     highestNormalizedLiquidityFirst = normalizedLiquidity;
//                     highestNormalizedLiquidityFirstPoolId = poolIn.id;
//                 }
//             }
//             for (const poolOutId of [...hopsOut[hopToken]]) {
//                 const poolOut = pools[poolOutId.address];
//                 const poolPairData = poolOut.parsePoolPairData(
//                     hopToken,
//                     tokenOut
//                 );
//                 const normalizedLiquidity =
//                     poolOut.getNormalizedLiquidity(poolPairData);
//                 // Cannot be strictly greater otherwise highestNormalizedLiquidityPoolId = 0 if hopTokens[i] balance is 0 in this pool.
//                 if (
//                     normalizedLiquidity.isGreaterThanOrEqualTo(
//                         highestNormalizedLiquiditySecond
//                     )
//                 ) {
//                     highestNormalizedLiquiditySecond = normalizedLiquidity;
//                     highestNormalizedLiquiditySecondPoolId = poolOut.address;
//                 }
//             }
//             if (
//                 highestNormalizedLiquidityFirstPoolId &&
//                 highestNormalizedLiquiditySecondPoolId
//             ) {
//                 const path = createPath(
//                     [tokenIn, hopToken, tokenOut],
//                     [
//                         pools[highestNormalizedLiquidityFirstPoolId],
//                         pools[highestNormalizedLiquiditySecondPoolId],
//                     ]
//                 );
//                 paths.push(path);
//             }
//         }
//     }
//     return paths;
// }


// export class RouteProvider {
//     cache: Record<string, { paths: Path[] }> = {};

//     // constructor(private readonly config: SorConfig) {}

//     /**
//      * Given a list of pools and a desired input/output, returns a set of possible paths to route through
//      */
//     getCandidatePaths(
//         tokenIn: Token,
//         tokenOut: Token,
//         swapType: SwapTypes,
//         poolsAllDict: PoolDictionary,
//         swapOptions: SwapOptions
//     ): Path[] {
//         if (!poolsAllDict) return [];

//         // If token pair has been processed before that info can be reused to speed up execution
//         const cache =
//             this.cache[
//             `${tokenIn.address}${tokenOut.address}${swapType}${swapOptions.timestamp}`
//             ];

//         // forceRefresh can be set to force fresh processing of paths/prices
//         if (!swapOptions.forceRefresh && !!cache) {
//             // Using pre-processed data from cache
//             return cache.paths;
//         }

//         const [directPools, hopsIn, hopsOut] = filterPoolsOfInterest(
//             poolsAllDict,
//             tokenIn,
//             tokenOut,
//             swapOptions.maxPools
//         );

//         const pathData = producePaths(
//             tokenIn,
//             tokenOut,
//             directPools,
//             hopsIn,
//             hopsOut,
//             poolsAllDict
//         );

//         const boostedPaths = getBoostedPaths(
//             tokenIn,
//             tokenOut,
//             poolsAllDict,
//             this.config
//         );

//         const pathsUsingStaBal = getPathsUsingStaBalPool(
//             tokenIn,
//             tokenOut,
//             poolsAllDict,
//             poolsAllDict,
//             this.config
//         );

//         const combinedPathData = pathData
//             .concat(...boostedPaths)
//             .concat(...pathsUsingStaBal);
//         const [paths] = calculatePathLimits(combinedPathData, swapType);

//         this.cache[`${tokenIn}${tokenOut}${swapType}${swapOptions.timestamp}`] =
//         {
//             paths: paths,
//         };

//         return paths;
//     }

//     /**
//      * Given a pool dictionary and a desired input/output, returns a set of possible paths to route through.
//      * @param {string} tokenIn - Address of tokenIn
//      * @param {string} tokenOut - Address of tokenOut
//      * @param {SwapTypes} swapType - SwapExactIn where the amount of tokens in (sent to the Pool) is known or SwapExactOut where the amount of tokens out (received from the Pool) is known.
//      * @param {PoolDictionary} poolsAllDict - Dictionary of pools.
//      * @param {number }maxPools - Maximum number of pools to hop through.
//      * @returns {NewPath[]} Array of possible paths sorted by liquidity.
//      */
//     getCandidatePathsFromDict(
//         tokenIn: string,
//         tokenOut: string,
//         swapType: SwapTypes,
//         poolsAllDict: PoolDictionary,
//         maxPools: number
//     ): NewPath[] {
//         if (Object.keys(poolsAllDict).length === 0) return [];

//         const [directPools, hopsIn, hopsOut] = filterPoolsOfInterest(
//             poolsAllDict,
//             tokenIn,
//             tokenOut,
//             maxPools
//         );

//         const pathData = producePaths(
//             tokenIn,
//             tokenOut,
//             directPools,
//             hopsIn,
//             hopsOut,
//             poolsAllDict
//         );

//         const boostedPaths = getBoostedPaths(
//             tokenIn,
//             tokenOut,
//             poolsAllDict,
//             this.config
//         );

//         const combinedPathData = pathData.concat(...boostedPaths);
//         const [paths] = calculatePathLimits(combinedPathData, swapType);
//         return paths;
//     }
// }
