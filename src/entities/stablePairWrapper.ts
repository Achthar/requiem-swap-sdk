import { StablePool } from "./stablePool";
import { Token, } from "./token";
import { Price } from "./fractions/price";
import { TokenAmount } from "./fractions/tokenAmount";
import invariant from "tiny-invariant";
import { BigNumber } from "@ethersproject/bignumber";
import { Source } from './source';
import { ChainId, STABLE_POOL_LP_ADDRESS } from "./../constants";

// A class that wraps a stablePool to a pair-like structure
export class StablePairWrapper implements Source {

    // the tokenAmounts are the reference Balances that we keep track of in the stablePool
    // whenever we make changes to these, we need to update the stablePool reference Balance to calculate the correct 
    public readonly tokenAmounts: TokenAmount[]
    public readonly stableIndexes: number[]

    // the tokenAmount for calculating the price
    // these cannot be derived from the tokenAmounts since
    // they follow the stableSwap logic for pricing
    public pricingBasesIn: TokenAmount[]
    public pricingBasesOut: TokenAmount[]
    public readonly type: string
    public readonly referenceMidPrices: Price[]
    public readonly liquidityToken: Token

    // public readonly inputReserve: TokenAmount
    // public readonly outputReserve: TokenAmount

    constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount, indexA: number, indexB: number) {

        invariant(tokenAmountA.token.chainId === tokenAmountB.token.chainId, 'CHAIN_IDS')

        this.liquidityToken = new Token(
            tokenAmountA.token.chainId,
            STABLE_POOL_LP_ADDRESS[tokenAmountA.token.chainId] ?? '0x0000000000000000000000000000000000000001',
            18,
            'RequiemStable-LP',
            'Requiem StableSwap LPs'
        )

        this.tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA]
        this.stableIndexes = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [indexA, indexB] : [indexB, indexA]

        this.pricingBasesIn = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA]
        this.pricingBasesOut = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA]

        this.referenceMidPrices = []
        this.type = 'StablePairWrapper'
    }

    /**
     * Returns the chain ID of the tokens in the pair.
     */
    public get chainId(): ChainId {
        return this.token0.chainId
    }

    public get token0(): Token {
        return this.tokenAmounts[0].token
    }

    public get token1(): Token {
        return this.tokenAmounts[1].token
    }

    // reserves cannot be this.tokenAmounts because
    // these are directly used for prices
    public get reserve0(): TokenAmount {
        return this.tokenAmounts[0]
    }

    public get reserve1(): TokenAmount {
        return this.tokenAmounts[1]
    }

    // this gets the reserve of the respectve (stable) token
    public reserveOf(token: Token): TokenAmount {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.reserve0 : this.reserve1
    }

    public involvesToken(token: Token): boolean {
        return token.equals(this.token0) || token.equals(this.token1)
    }


    public priceOf(token: Token, stablePool: StablePool, volume: BigNumber) {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.token0Price(stablePool, volume) : this.token1Price(stablePool, volume)
    }

    /**
 * Returns the current price at given volume of the pair in terms of token0, i.e. the ratio calculated by the stableSwap
 */
    public token0Price(stablePool: StablePool, volume: BigNumber): Price {
        const outToken1 = stablePool.calculateSwap(this.stableIndexes[0], this.stableIndexes[1], volume)
        return new Price(this.token0, this.token1, outToken1.toBigInt(), volume.toBigInt())
    }

    /**
 * Returns the current mid price of the pair in terms of token1, i.e. the ratio calculated by the stableSwap
 */
    public token1Price(stablePool: StablePool, volume: BigNumber): Price {
        const outToken0 = stablePool.calculateSwap(this.stableIndexes[1], this.stableIndexes[0], volume)
        return new Price(this.token1, this.token0, outToken0.toBigInt(), volume.toBigInt())
    }

    public priceFromReserve(outToken: Token) {
        const outIndex = outToken.equals(this.token0) ? 0 : 1
        const inIndex = outToken.equals(this.token1) ? 0 : 1
        return new Price(
            this.pricingBasesIn[inIndex].token,
            this.pricingBasesOut[outIndex].token,
            this.pricingBasesIn[inIndex].raw,
            this.pricingBasesOut[outIndex].raw
        )
    }

    // function that wraps the output calculation based on a stablePool
    public getOutputAmount(inputAmount: TokenAmount, stablePool: StablePool): [TokenAmount, StablePairWrapper] {
        invariant(this.involvesToken(inputAmount.token), 'TOKEN')
        const inputReserve = this.reserveOf(inputAmount.token)
        const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)


        // set the balance values to the expected valuses
        stablePool.setBalanceValue(this.tokenAmounts[0])
        stablePool.setBalanceValue(this.tokenAmounts[1])

        const output = stablePool.getOutputAmount(
            inputAmount,
            this.token0.equals(inputAmount.token) ? this.stableIndexes[1] : this.stableIndexes[0])

        // adjust the values based on the supposdly executed trade
        stablePool.setBalanceValue(inputReserve.add(inputAmount))
        stablePool.setBalanceValue(outputReserve.subtract(output))

        // here we save the pricing results if it is called
        const inIndex = inputAmount.token.equals(this.token0) ? 0 : 1
        const outIndex = output.token.equals(this.token0) ? 0 : 1
        this.pricingBasesIn[inIndex] = inputAmount
        this.pricingBasesOut[outIndex] = output

        return [
            output,
            new StablePairWrapper(
                inputReserve.add(inputAmount),
                outputReserve.subtract(output), stablePool.indexFromToken(inputReserve.token), stablePool.indexFromToken(outputReserve.token))
        ]
    }

    // function that wraps the input calculation based on a stablePool
    public getInputAmount(outputAmount: TokenAmount, stablePool: StablePool): [TokenAmount, StablePairWrapper] {
        invariant(this.involvesToken(outputAmount.token), 'TOKEN')

        const outputReserve = this.reserveOf(outputAmount.token)
        const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)

        stablePool.setBalanceValue(this.tokenAmounts[0])
        stablePool.setBalanceValue(this.tokenAmounts[1])

        const input = stablePool.getInputAmount(
            outputAmount,
            this.token0.equals(outputAmount.token) ? this.stableIndexes[1] : this.stableIndexes[0])

        // here we save the pricing results if it is called
        const inIndex = input.token.equals(this.token0) ? 0 : 1
        const outIndex = outputAmount.token.equals(this.token0) ? 0 : 1
        this.pricingBasesIn[inIndex] = input
        this.pricingBasesOut[outIndex] = outputAmount

        stablePool.setBalanceValue(inputReserve.add(input))
        stablePool.setBalanceValue(outputReserve.subtract(outputAmount))

        return [input,
            new StablePairWrapper(
                inputReserve.add(input),
                outputReserve.subtract(outputAmount), stablePool.indexFromToken(inputReserve.token), stablePool.indexFromToken(outputReserve.token))]
    }

    // generates the n^2-n combinations for wrappedStablePairs
    public static wrapPairsFromPool(stablePool: StablePool): StablePairWrapper[] {

        let wrapperList = []

        for (let i = 0; i < stablePool.tokenBalances.length; i++) {
            for (let j = 0; j < i; j++) {
                wrapperList.push(new StablePairWrapper(
                    new TokenAmount(stablePool.tokens[i], stablePool.tokenBalances[i].toBigInt()),
                    new TokenAmount(stablePool.tokens[j], stablePool.tokenBalances[j].toBigInt()),
                    i,
                    j
                ))
            }
        }
        return wrapperList
    }
}