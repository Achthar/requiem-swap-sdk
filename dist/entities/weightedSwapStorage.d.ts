import { BigNumber } from "ethers";
export declare class WeightedSwapStorage {
    readonly tokenMultipliers: BigNumber[];
    readonly normalizedWeights: BigNumber[];
    readonly fee: BigNumber;
    readonly adminFee: BigNumber;
    readonly lpAddress: string;
    constructor(tokenMultipliers: BigNumber[], normalizedWeights: BigNumber[], fee: BigNumber, adminFee: BigNumber, lpAddress: string);
    static mock(): WeightedSwapStorage;
}
