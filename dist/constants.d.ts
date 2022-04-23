import { BigNumber } from 'ethers';
export declare type BigintIsh = BigNumber | bigint | string | number;
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare const FACTORY_ADDRESS: {
    [chainId: number]: string;
};
export declare const WEIGHTED_FACTORY_ADDRESS: {
    [chainId: number]: string;
};
export declare const INIT_CODE_HASH: {
    [chainId: number]: string;
};
export declare const INIT_CODE_HASH_WEIGHTED: {
    [chainId: number]: string;
};
export declare const STABLE_POOL_ADDRESS: {
    [chainId: number]: string;
};
export declare const STABLE_POOL_LP_ADDRESS: {
    [chainId: number]: string;
};
export declare const MINIMUM_LIQUIDITY: BigNumber;
export declare const ZERO: BigNumber;
export declare const ONE: BigNumber;
export declare const TWO: BigNumber;
export declare const THREE: BigNumber;
export declare const FIVE: BigNumber;
export declare const TEN: BigNumber;
export declare const TENK: BigNumber;
export declare const _100: BigNumber;
export declare const FEES_NUMERATOR: BigNumber;
export declare const FEES_DENOMINATOR: BigNumber;
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: BigNumber;
    uint256: BigNumber;
};
