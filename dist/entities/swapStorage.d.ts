import { BigNumber } from "ethers";
export declare class SwapStorage {
    readonly tokenMultipliers: BigNumber[];
    readonly fee: BigNumber;
    readonly adminFee: BigNumber;
    readonly initialA: BigNumber;
    readonly futureA: BigNumber;
    readonly initialATime: BigNumber;
    readonly futureATime: BigNumber;
    readonly lpAddress: string;
    constructor(tokenMultipliers: BigNumber[], fee: BigNumber, adminFee: BigNumber, initialA: BigNumber, futureA: BigNumber, initialATime: BigNumber, futureATime: BigNumber, lpAddress: string);
    static mock(): SwapStorage;
}
