import JSBI from 'jsbi';
import { Token } from './entities';
export declare type BigintIsh = JSBI | bigint | string;
export declare enum ChainId {
    BSC_MAINNET = 56,
    BSC_TESTNET = 97,
    AVAX_MAINNET = 43114,
    AVAX_TESTNET = 43113,
    ARBITRUM_MAINNET = 42161,
    ARBITRUM_TETSNET_RINKEBY = 421611,
    MATIC_MAINNET = 137,
    MATIC_TESTNET = 80001
}
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const FACTORY_ADDRESS: {
    [chainId: number]: string;
};
export declare const INIT_CODE_HASH: {
    [chainId: number]: string;
};
export declare const STABLE_POOL_ADDRESS: {
    [chainId: number]: string;
};
export declare const STABLECOINS: {
    [chainId: number]: Token[];
};
export declare const STABLES_INDEX_MAP: {
    [chainId: number]: {
        [index: number]: Token;
    };
};
export declare const MINIMUM_LIQUIDITY: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const TWO: JSBI;
export declare const THREE: JSBI;
export declare const FIVE: JSBI;
export declare const TEN: JSBI;
export declare const _100: JSBI;
export declare const FEES_NUMERATOR: JSBI;
export declare const FEES_DENOMINATOR: JSBI;
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};
