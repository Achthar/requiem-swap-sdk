import { BigNumber } from "ethers"
import { ZERO } from "./LogExpMath"

export class WeightedSwapStorage {
    public readonly tokenMultipliers: BigNumber[]
    public readonly normalizedWeights: BigNumber[]
    public readonly fee: BigNumber
    public readonly adminFee: BigNumber
    constructor(
        tokenMultipliers: BigNumber[],
        normalizedWeights: BigNumber[],
        fee: BigNumber,
        adminFee: BigNumber,
    ) {
        this.tokenMultipliers = tokenMultipliers
        this.normalizedWeights = normalizedWeights
        this.fee = fee
        this.adminFee = adminFee

    }

    public static mock(): WeightedSwapStorage {
        return new WeightedSwapStorage([ZERO], [ZERO], ZERO, ZERO)
    }

}