import { BigNumber } from "ethers"

export class StableSwapStorage {
    public readonly tokenMultipliers: BigNumber[]
    public readonly fee: BigNumber
    public readonly adminFee: BigNumber
    public readonly initialA: BigNumber
    public readonly futureA: BigNumber
    public readonly initialATime: BigNumber
    public readonly futureATime: BigNumber
    public readonly lpAddress: string

    constructor(tokenMultipliers: BigNumber[],
        fee: BigNumber,
        adminFee: BigNumber,
        initialA: BigNumber,
        futureA: BigNumber,
        initialATime: BigNumber,
        futureATime: BigNumber,
        lpAddress: string) {
        this.lpAddress = lpAddress
        this.tokenMultipliers = tokenMultipliers
        this.fee = fee
        this.adminFee = adminFee
        this.initialA = initialA
        this.futureA = futureA
        this.initialATime = initialATime
        this.futureATime = futureATime
    }

    public static mock(): StableSwapStorage {
        const dummy = BigNumber.from(0)
        return new StableSwapStorage([dummy], dummy, dummy, dummy, dummy, dummy, dummy, '')
    }

}