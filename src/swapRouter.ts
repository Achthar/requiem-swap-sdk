
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from './helperUtils'
import { CurrencyAmount, Percent, Swap, SwapType } from './entities'

/**
 * Options for producing the arguments to send call to the router.
 */
export interface SwapOptions {
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

  /**
   * Checks whether the networkccy is used in in- or output: helps us to avoid checks in route calculations
   */
  etherIn: boolean
  etherOut: boolean
}

export interface SwapOptionsDeadline extends Omit<SwapOptions, 'ttl'> {
  /**
   * When the transaction expires.
   * This is an atlernate to specifying the ttl, for when you do not want to use local time.
   */
  deadline: number
}

/**
 * The parameters to use in the call to the Router to execute a trade.
 */
export interface SwapParameters {
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
  return currencyAmount.raw.toHexString()
}

const ZERO_HEX = '0x0'

/**
 * Represents the Router, and has static methods for helping execute trades.
 */
export abstract class SwapRouter {
  /**
   * Cannot be constructed.
   */
  private constructor() { }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(trade: Swap, options: SwapOptions | SwapOptionsDeadline): SwapParameters {
    const etherIn = options.etherIn
    const etherOut = options.etherOut
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
        case SwapType.EXACT_INPUT:
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
        case SwapType.EXACT_OUTPUT:
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
      const path = trade.route.path.map(token => token.address)
      const pairData = trade.route.swapData.map(p => p.poolRef)

      switch (trade.tradeType) {
        case SwapType.EXACT_INPUT:
          if (etherIn) {
            methodName = 'onSwapExactETHForTokens'
            // function multiSwapExactETHForTokens( address[][] calldata path, uint256[] memory routerId,
            // uint256 amountOutMin, uint256 deadline )
            args = [pairData, path, amountOut, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'onSwapExactTokensForETH'
            // multiSwapExactTokensForETH( address[][] calldata path, uint256[] memory pools, uint256 amountIn,
            // uint256 amountOutMin, uint256 deadline )
            args = [pairData, path, amountIn, amountOut, to, deadline]
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
            args = [pairData, path, amountIn, amountOut, to, deadline]
            value = ZERO_HEX
          }
          break
        case SwapType.EXACT_OUTPUT:
          if (etherIn) {
            methodName = 'onSwapETHForExactTokens'
            // multiSwapETHForExactTokens( address[][] calldata path, uint256[] memory pools, uint256 amountOut, uint256 deadline )
            args = [pairData, path, amountOut, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'onSwapTokensForExactETH'
            // multiSwapTokensForExactETH( address[][] calldata path, uint256[] memory pools,
            // uint256 amountOut, uint256 amountInMax, uint256 deadline )
            args = [pairData, path, amountOut, amountIn, to, deadline]
            value = ZERO_HEX
          } else {
            methodName = 'onSwapTokensForExactTokens'
            // multiSwapTokensForExactTokens( address[][] calldata path, uint256[] memory pools, 
            // uint256 amountOut, uint256 amountInMax,  uint256 deadline )
            args = [pairData, path, amountOut, amountIn, to, deadline]
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
