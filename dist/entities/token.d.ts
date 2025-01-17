import { Currency, ChainId } from './currency';
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export declare class Token extends Currency {
    readonly address: string;
    readonly projectLink?: string;
    constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string, projectLink?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Token): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
}
/**
 * Compares two currencies for equality
 */
export declare function currencyEquals(currencyA: Currency, currencyB: Currency): boolean;
export declare const WETH: {
    56: Token;
    97: Token;
    42161: Token;
    421611: Token;
    43114: Token;
    43113: Token;
    137: Token;
    80001: Token;
};
export declare const WRAPPED_NETWORK_TOKENS: {
    [chainId: number]: Token;
};
export declare const STABLECOINS: {
    [chainId: number]: Token[];
};
export declare const STABLES_INDEX_MAP: {
    [chainId: number]: {
        [index: number]: Token;
    };
};
export declare const STABLES_LP_TOKEN: {
    [chainId: number]: {
        [index: number]: Token;
    };
};
