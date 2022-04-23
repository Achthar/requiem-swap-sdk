/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export declare class Currency {
    readonly decimals: number;
    readonly chainId: number;
    readonly symbol?: string;
    readonly name?: string;
    /**
     * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    constructor(chainId: number, decimals: number, symbol?: string, name?: string);
}
export declare enum ChainId {
    BSC_MAINNET = 56,
    BSC_TESTNET = 97,
    AVAX_MAINNET = 43114,
    AVAX_TESTNET = 43113,
    ARBITRUM_MAINNET = 42161,
    ARBITRUM_TETSNET_RINKEBY = 421611,
    MATIC_MAINNET = 137,
    MATIC_TESTNET = 80001,
    OASIS_TESTNET = 42261,
    OASIS_MAINNET = 42262,
    QUARKCHAIN_DEV_S0 = 110001
}
export declare const NETWORK_CCY: {
    [chainId: number]: Currency;
};
