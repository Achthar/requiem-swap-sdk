import { ChainId } from '..';
/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export declare class Currency {
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    /**
     * The only instance of the base class `Currency`.
     */
    static readonly ETHER: Currency;
    static readonly NETWORK_CCY: {
        [chainId in ChainId]: Currency;
    };
    /**
     * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    protected constructor(decimals: number, symbol?: string, name?: string);
}
declare const NETWORK_CCY: {
    56: Currency;
    97: Currency;
    43114: Currency;
    43113: Currency;
    42161: Currency;
    421611: Currency;
    137: Currency;
    80001: Currency;
};
declare const ETHER: Currency;
export { ETHER, NETWORK_CCY };
