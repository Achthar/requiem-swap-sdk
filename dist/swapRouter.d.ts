import { Percent, Swap } from './entities';
/**
 * Options for producing the arguments to send call to the router.
 */
export interface SwapOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    allowedSlippage: Percent;
    /**
     * How long the swap is valid until it expires, in seconds.
     * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
     * are generated.
     */
    ttl: number;
    /**
     * The account that should receive the output of the swap.
     */
    recipient: string;
    /**
     * Whether any of the tokens in the path are fee on transfer tokens, which should be handled with special methods
     */
    feeOnTransfer?: boolean;
    /**
     * Whether we swap through multiple routers / pair types
     */
    multiSwap?: boolean;
    /**
     * Checks whether the networkccy is used in in- or output: helps us to avoid checks in route calculations
     */
    etherIn: boolean;
    etherOut: boolean;
}
export interface SwapOptionsDeadline extends Omit<SwapOptions, 'ttl'> {
    /**
     * When the transaction expires.
     * This is an atlernate to specifying the ttl, for when you do not want to use local time.
     */
    deadline: number;
}
/**
 * The parameters to use in the call to the Router to execute a trade.
 */
export interface SwapParameters {
    /**
     * The method to call on the Router.
     */
    methodName: string;
    /**
     * The arguments to pass to the method, all hex encoded.
     */
    args: (string | string[] | string[][])[];
    /**
     * The amount of wei to send in hex.
     */
    value: string;
}
/**
 * Represents the Router, and has static methods for helping execute trades.
 */
export declare abstract class SwapRouter {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    static swapCallParameters(trade: Swap, options: SwapOptions | SwapOptionsDeadline): SwapParameters;
}
