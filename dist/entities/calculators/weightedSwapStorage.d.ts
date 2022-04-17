import { BigNumber } from "ethers";
export declare class WeightedSwapStorage {
    readonly tokenMultipliers: BigNumber[];
    readonly normalizedWeights: BigNumber[];
    readonly balances: BigNumber[];
    readonly fee: BigNumber;
    readonly adminFee: BigNumber;
    constructor(tokenMultipliers: BigNumber[], normalizedWeights: BigNumber[], fee: BigNumber, adminFee: BigNumber);
    static mock(): WeightedSwapStorage;
}
