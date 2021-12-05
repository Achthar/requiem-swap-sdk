import { TradeType } from './constants'
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from './utils'
import { CurrencyAmount, NETWORK_CCY, Percent } from './entities'
import { TradeV4 } from './entities/tradeV4'

/**
 * Options for producing the arguments to send call to the router.
 */
export interface TradeV4Options {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
  /**
   * How long the swap is valid until it expires, in seconds.
   * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
   * are generated.
   */
  ttl: number
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string

  /**
   * Whether any of the tokens in the path are fee on transfer tokens, which should be handled with special methods
   */
  feeOnTransfer?: boolean

  /**
   * Whether we swap through multiple routers / pair types
   */
  multiSwap?: boolean
}

export interface TradeV4OptionsDeadline extends Omit<TradeV4Options, 'ttl'> {
  /**
   * When the transaction expires.
   * This is an atlernate to specifying the ttl, for when you do not want to use local time.
   */
  deadline: number
}

/**
 * The parameters to use in the call to the Router to execute a trade.
 */
export interface SwapV4Parameters {
  /**
   * The method to call on the Router.
   */
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[] | string[][])[]
  /**
   * The amount of wei to send in hex.
   */
  value: string
}

function toHex(currencyAmount: CurrencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`
}

const ZERO_HEX = '0x0'

/**
 * Represents the Router, and has static methods for helping execute trades.
 */
export abstract class RouterV4 {
  /**
   * Cannot be constructed.
   */
  private constructor() { }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(trade: TradeV4, options: TradeV4Options | TradeV4OptionsDeadline): SwapV4Parameters {
    const etherIn = trade.inputAmount.currency === NETWORK_CCY[trade.route.chainId]
    const etherOut = trade.outputAmount.currency === NETWORK_CCY[trade.route.chainId]
    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
    invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

    const to: string = validateAndParseAddress(options.recipient)
    const amountIn: string = toHex(trade.maximumAmountIn(options.allowedSlippage))
    const amountOut: string = toHex(trade.minimumAmountOut(options.allowedSlippage))


    let methodName: string

    let args: (string | string[] | string[][])[] = []
    let value: string
    const deadline =
      'ttl' in options
        ? `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`
        : `0x${options.deadline.toString(16)}`

    if (!options.multiSwap) {
      const path: string[] = trade.route.path.map((token) => token.address)
      const useFeeOnTransfer = Boolean(options.feeOnTransfer)
      switch (trade.tradeType) {
        case TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'
            // (uint amountOutMin, address[] calldata path, address to, uint deadline)
            args = [amountOut, path, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'
            // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
            args = [amountIn, amountOut, path, to, deadline]
            value = ZERO_HEX
          } else {
            methodName = useFeeOnTransfer
              ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
              : 'swapExactTokensForTokens'
            // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
            args = [amountIn, amountOut, path, to, deadline]
            value = ZERO_HEX
          }
          break
        case TradeType.EXACT_OUTPUT:
          invariant(!useFeeOnTransfer, 'EXACT_OUT_FOT')
          if (etherIn) {
            methodName = 'swapETHForExactTokens'
            // (uint amountOut, address[] calldata path, address to, uint deadline)
            args = [amountOut, path, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'swapTokensForExactETH'
            // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
            args = [amountOut, amountIn, path, to, deadline]
            value = ZERO_HEX
          } else {
            methodName = 'swapTokensForExactTokens'
            // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
            args = [amountOut, amountIn, path, to, deadline]
            value = ZERO_HEX
          }
          break
      }
    } else {
      const path = trade.route.path.map(token =>token.address)
      const pools = trade.route.pools.map(pool=>pool.getAddressForRouter())
      
      switch (trade.tradeType) {
        case TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = 'onSwapExactETHForTokens'
            // function multiSwapExactETHForTokens( address[][] calldata path, uint256[] memory routerId,
            // uint256 amountOutMin, uint256 deadline )
            args = [pools, path, amountOut, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'onSwapExactTokensForETH'
            // multiSwapExactTokensForETH( address[][] calldata path, uint256[] memory pools, uint256 amountIn,
            // uint256 amountOutMin, uint256 deadline )
            args = [pools, path, amountIn, amountOut, deadline]
            value = ZERO_HEX
          } else {
            methodName = 'onSwapExactTokensForTokens'
            // function onSwapExactTokensForTokens(
            //   address[] memory pools,
            //   address[] memory tokens,
            //   uint256 amountIn,
            //   uint256 amountOutMin,
            //   address to,
            //   uint256 deadline
            args = [pools, path, amountIn, amountOut, to, deadline]
            value = ZERO_HEX
          }
          break
        case TradeType.EXACT_OUTPUT:
          if (etherIn) {
            methodName = 'onSwapETHForExactTokens'
            // multiSwapETHForExactTokens( address[][] calldata path, uint256[] memory pools, uint256 amountOut, uint256 deadline )
            args = [pools, path, amountOut, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'onSwapTokensForExactETH'
            // multiSwapTokensForExactETH( address[][] calldata path, uint256[] memory pools,
            // uint256 amountOut, uint256 amountInMax, uint256 deadline )
            args = [pools, path, amountOut, amountIn, to, deadline]
            value = ZERO_HEX
          } else {
            methodName = 'onSwapTokensForExactTokens'
            // multiSwapTokensForExactTokens( address[][] calldata path, uint256[] memory pools, 
            // uint256 amountOut, uint256 amountInMax,  uint256 deadline )
            args = [pools, path, amountOut, amountIn, to, deadline]
            value = ZERO_HEX
          }
          break
      }
    }
    return {
      methodName,
      args,
      value,
    }
  }
}
