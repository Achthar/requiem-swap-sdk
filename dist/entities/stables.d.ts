import { Token } from './token';
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
