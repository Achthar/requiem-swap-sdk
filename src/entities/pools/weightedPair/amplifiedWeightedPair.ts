import { Price } from '../../fractions/price'
import { TokenAmount } from '../../fractions/tokenAmount'
import invariant from 'tiny-invariant'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import {
    BigintIsh,
    MINIMUM_LIQUIDITY,
    ZERO,
    // ONE,
    FIVE,
    // _100,
    // FEES_NUMERATOR,
    // FEES_DENOMINATOR,
    FACTORY_ADDRESS,
} from '../../../constants'
import { sqrt, parseBigintIsh } from '../../../helperUtils'
import {
    // InsufficientReservesError,
    InsufficientInputAmountError, InsufficientReservesError
} from '../../../errors'
import { Token } from '../../token'
import { getAmountOut, getAmountIn } from '../../calculators/weightedPairCalc'
import { PoolType, Pool } from '../pool'
// import { getAmountIn, getAmountOut } from 'entities/calculators/weightedPairCalc'
import { ethers } from 'ethers'
import { ChainId } from '../../currency'

const _100 = BigNumber.from(100)

let PAIR_ADDRESS_CACHE: {
    [token0Address: string]: {
        [token1Address: string]: {
            [weight0: string]: string
        }
    }
} = {}

const PAIR_HASH: { [chainId: number]: string } = {
    [ChainId.AVAX_TESTNET]: '0x9054fb12bf026c7ef2c6d1f68fbbead8f68cdbfa477faca7f9d8ec63173f87ff',
    [ChainId.BSC_MAINNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.AVAX_MAINNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.OASIS_MAINNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.OASIS_TESTNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.BSC_TESTNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.MATIC_MAINNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.MATIC_TESTNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.QUARKCHAIN_DEV_S0]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.ARBITRUM_TETSNET_RINKEBY]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84',
    [ChainId.ARBITRUM_MAINNET]: '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84'
}

export class AmplifiedWeightedPair extends Pool {
    public readonly address: string
    public readonly tokens: Token[]
    public tokenBalances: BigNumber[]
    public virtualReserves: BigNumber[]
    public readonly liquidityToken: Token
    private readonly weights: BigNumber[]
    private readonly fee: BigNumber
    private readonly ampBPS: BigNumber
    public readonly type: PoolType

    public static getAddress(tokenA: Token, tokenB: Token, weightA: BigNumber): string {
        const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
        const weights = tokenA.sortsBefore(tokenB) ? [weightA.toString(), _100.sub(weightA).toString()] : [_100.sub(weightA).toString(), weightA.toString()] // does safety checks
        if (PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address]?.[`${weights[0]}`] === undefined) {
            PAIR_ADDRESS_CACHE = {
                ...PAIR_ADDRESS_CACHE,
                [tokens[0].address]: {
                    ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
                    [tokens[1].address]: {
                        ...PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address],
                        [`${weights[0]}`]: getCreate2Address(
                            FACTORY_ADDRESS[tokens[0].chainId],
                            keccak256(
                                ['bytes'],
                                [pack(
                                    ['address', 'address', 'uint32'],
                                    [tokens[0].address, tokens[1].address, weights[0]]
                                )]
                            ),
                            PAIR_HASH[tokens[0].chainId]
                        )
                    },
                },
            }
        }

        return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address][`${weights[0]}`]
    }

    public constructor(tokens: Token[], tokenBalances: BigNumber[], virtualReserves: BigNumber[], weightA: BigNumber, fee: BigNumber, amp: BigNumber, address?: string) {
        super()

        this.tokenBalances = tokens[0].sortsBefore(tokens[1]) // does safety checks
            ? tokenBalances
            : [tokenBalances[1], tokenBalances[0]]
        this.tokens = tokens[0].sortsBefore(tokens[1]) // does safety checks
            ? tokens
            : [tokens[1], tokens[0]]

        this.ampBPS = amp
        this.weights = tokens[0].sortsBefore(tokens[1]) // does safety checks
            ? [weightA, _100.sub(weightA)]
            : [_100.sub(weightA), weightA]

        this.virtualReserves = tokens[0].sortsBefore(tokens[1]) // does safety checks
            ? virtualReserves
            : [virtualReserves[1], virtualReserves[0]]


        this.fee = fee
        this.liquidityToken = new Token(
            tokens[0].chainId,
            address ? ethers.utils.getAddress(address) : AmplifiedWeightedPair.getAddress(this.tokens[0], this.tokens[1], this.weights[0]),
            18,
            'Requiem-LP',
            'Requiem LPs'
        )
        this.type = PoolType.AmplifiedWeightedPair
        this.address = !address ? AmplifiedWeightedPair.getAddress(this.token0, this.token1, this.weight0) : address
    }

    public static fromBigIntish(tokens: Token[], tokenBalances: BigintIsh[], virtualReserves: BigintIsh[], weightA: BigintIsh, fee: BigintIsh, amp: BigintIsh, address?: string): AmplifiedWeightedPair {
        return new AmplifiedWeightedPair(
            tokens,
            tokenBalances.map(b => BigNumber.from(b)),
            virtualReserves.map(b => BigNumber.from(b)),
            BigNumber.from(weightA),
            BigNumber.from(fee),
            BigNumber.from(amp),
            address
        )
    }

    public getAddressForRouter(): string {
        return this.liquidityToken.address
    }

    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    public involvesToken(token: Token): boolean {
        return token.equals(this.token0) || token.equals(this.token1)
    }

    public get amp(): BigNumber {
        return this.ampBPS
    }

    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */
    public get token0Price(): Price {
        return new Price(
            this.token0,
            this.token1,
            this.tokenBalances[0].mul(this.weights[1]),
            this.tokenBalances[1].mul(this.weights[0])
        )
    }

    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    public get token1Price(): Price {
        return new Price(
            this.token1,
            this.token0,
            this.tokenBalances[1].mul(this.weights[0]),
            this.tokenBalances[0].mul(this.weights[1])
        )
    }

    public poolPrice(tokenIn: Token, _: Token): Price {
        return tokenIn.equals(this.token0) ? this.token0Price : this.token1Price
    }

    public get fee0(): BigNumber {
        return this.fee
    }

    public poolPriceBases(tokenIn: Token, _: Token): { priceBaseIn: BigNumber; priceBaseOut: BigNumber; } {
        if (tokenIn.equals(this.token0)) {
            return {
                priceBaseIn: this.tokenBalances[0].mul(this.weights[1]),
                priceBaseOut: this.tokenBalances[1].mul(this.weights[0])
            }
        } else {
            return {
                priceBaseIn: this.tokenBalances[1].mul(this.weights[0]),
                priceBaseOut: this.tokenBalances[0].mul(this.weights[1])
            }
        }
    }

    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    public priceOf(token: Token): Price {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.token0Price : this.token1Price
    }

    /**
     * Returns the chain ID of the tokens in the pair.
     */
    public get chainId(): ChainId {
        return this.token0.chainId
    }

    public get token0(): Token {
        return this.tokens[0]
    }

    public get token1(): Token {
        return this.tokens[1]
    }

    public get reserve0(): TokenAmount {
        return new TokenAmount(this.tokens[0], this.tokenBalances[0])
    }

    public get reserve1(): TokenAmount {
        return new TokenAmount(this.tokens[1], this.tokenBalances[1])
    }

    public get virtualReserve0(): TokenAmount {
        return new TokenAmount(this.tokens[0], this.virtualReserves[0])
    }

    public get virtualReserve1(): TokenAmount {
        return new TokenAmount(this.tokens[1], this.virtualReserves[1])
    }

    public get weight0(): BigNumber {
        return this.weights[0]
    }

    public get weight1(): BigNumber {
        return this.weights[1]
    }


    public reserveOf(token: Token): BigNumber {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.reserve0.raw : this.reserve1.raw
    }


    public virtualReserveOf(token: Token): BigNumber {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.virtualReserve0.raw : this.virtualReserve1.raw
    }

    public weightOf(token: Token): BigNumber {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.weight0 : this.weight1
    }


    public getLiquidityMinted(
        totalSupply: TokenAmount,
        tokenAmountA: TokenAmount,
        tokenAmountB: TokenAmount
    ): TokenAmount {
        invariant(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY')
        const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
            ? [tokenAmountA, tokenAmountB]
            : [tokenAmountB, tokenAmountA]
        invariant(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1), 'TOKEN')

        let liquidity: BigNumber
        if (totalSupply.raw.eq(ZERO)) {
            liquidity = sqrt(tokenAmounts[0].raw.mul(tokenAmounts[1].raw)).sub(MINIMUM_LIQUIDITY)
        } else {
            const amount0 = tokenAmounts[0].raw.mul(totalSupply.raw).div(this.reserve0.raw)
            const amount1 = tokenAmounts[1].raw.mul(totalSupply.raw).div(this.reserve1.raw)
            liquidity = amount0.lte(amount1) ? amount0 : amount1
        }
        if (!liquidity.gt(ZERO)) {
            throw new InsufficientInputAmountError()
        }
        return new TokenAmount(this.liquidityToken, liquidity)
    }

    public getLiquidityValue(
        token: Token,
        totalSupply: TokenAmount,
        liquidity: TokenAmount,
        feeOn: boolean = false,
        kLast?: BigintIsh
    ): TokenAmount {
        invariant(this.involvesToken(token), 'TOKEN')
        invariant(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY')
        invariant(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY')
        invariant(liquidity.raw.lte(totalSupply.raw), 'LIQUIDITY')

        let totalSupplyAdjusted: TokenAmount
        if (!feeOn) {
            totalSupplyAdjusted = totalSupply
        } else {
            invariant(!!kLast, 'K_LAST')
            const kLastParsed = parseBigintIsh(kLast)
            if (!kLastParsed.eq(ZERO)) {
                const rootK = sqrt(this.reserve0.raw.mul(this.reserve1.raw))
                const rootKLast = sqrt(kLastParsed)
                if (rootK.gt(rootKLast)) {
                    const numerator = totalSupply.raw.mul(rootK.sub(rootKLast))
                    const denominator = rootK.mul(FIVE).add(rootKLast)
                    const feeLiquidity = numerator.div(denominator)
                    totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity))
                } else {
                    totalSupplyAdjusted = totalSupply
                }
            } else {
                totalSupplyAdjusted = totalSupply
            }
        }

        return new TokenAmount(
            token,
            liquidity.raw.mul(this.reserveOf(token)).div(totalSupplyAdjusted.raw)
        )
    }

    public clone(): AmplifiedWeightedPair {
        return new AmplifiedWeightedPair(this.tokens, this.tokenBalances, this.virtualReserves, this.weight0, this.fee, this.ampBPS)
    }

    // these are only supposed to be used for liquidity calculations
    /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
    public get token0PriceRaw(): Price {
        return new Price(this.token0, this.token1, this.tokenBalances[0], this.tokenBalances[1])
    }

    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    public get token1PriceRaw(): Price {
        return new Price(this.token1, this.token0, this.tokenBalances[1], this.tokenBalances[0])
    }

    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    public priceRatioOf(token: Token): Price {
        invariant(this.involvesToken(token), 'TOKEN')
        return token.equals(this.token0) ? this.token0PriceRaw : this.token1PriceRaw
    }


    // calculates the swap output amount without
    // pinging the blockchain for data
    public calculateSwapGivenIn(
        tokenIn: Token,
        tokenOut: Token,
        inAmount: BigNumber): BigNumber {
        const inputReserve = this.virtualReserveOf(tokenIn)
        const outputReserve = this.virtualReserveOf(tokenOut)

        const inputWeight = this.weightOf(tokenIn)
        const outputWeight = this.weightOf(tokenOut)

        return getAmountOut(
            inAmount,
            inputReserve,
            outputReserve,
            inputWeight,
            outputWeight,
            this.fee
        )
    }


    // calculates the swap output amount without
    // pinging the blockchain for data
    public calculateSwapGivenOut(
        tokenIn: Token,
        tokenOut: Token,
        outAmount: BigNumber): BigNumber {
        if (
            this.reserve0.raw.eq(ZERO) ||
            this.reserve1.raw.eq(ZERO) ||
            outAmount.gte(this.reserveOf(tokenOut))
        ) {
            throw new InsufficientReservesError()
        }

        const outputReserve = this.virtualReserveOf(tokenOut)
        const inputReserve = this.virtualReserveOf(tokenIn)

        const outputWeight = this.weightOf(tokenOut)
        const inputWeight = this.weightOf(tokenIn)


        return getAmountIn(
            outAmount,
            inputReserve,
            outputReserve,
            inputWeight,
            outputWeight,
            this.fee
        )

    }

    public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pool] {
        invariant(this.involvesToken(inputAmount.token), 'TOKEN')
        if (this.reserve0.raw.eq(ZERO) || this.reserve1.raw.eq(ZERO)) {
            throw new InsufficientReservesError()
        }
        const inputReserve = this.virtualReserveOf(inputAmount.token)
        const outputReserve = this.virtualReserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)

        const inputWeight = this.weightOf(inputAmount.token)
        const outputWeight = this.weightOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)


        const outputAmount = new TokenAmount(
            inputAmount.token.equals(this.token0) ? this.token1 : this.token0,

            getAmountOut(
                inputAmount.toBigNumber(),
                inputReserve,
                outputReserve,
                inputWeight,
                outputWeight,
                this.fee
            )
        )
        // console.log("OA", outputAmount.raw.toString())
        if (outputAmount.raw.eq(ZERO)) {
            throw new InsufficientInputAmountError()
        }

        return [
            outputAmount,
            new AmplifiedWeightedPair(
                [inputAmount.token, inputAmount.token.equals(this.token0) ? this.token1 : this.token0], // tokens
                [this.reserveOf(inputAmount.token).add(inputAmount.raw), this.reserveOf(outputAmount.token).sub(outputAmount.raw)], // reserves
                [inputReserve.add(inputAmount.raw), outputReserve.sub(outputAmount.raw)], // virtual reserves
                inputWeight,
                this.ampBPS,
                this.fee
            )
        ]
    }

    public getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pool] {
        invariant(this.involvesToken(outputAmount.token), 'TOKEN')
        console.log("-- this 0", this.reserve0.raw, "1", this.reserve1.raw, "out", outputAmount.raw)
        if (
            this.reserve0.raw.eq(ZERO) ||
            this.reserve1.raw.eq(ZERO) ||
            outputAmount.raw.gte(this.reserveOf(outputAmount.token))
        ) {
            throw new Error("insufficcient reserves")
        }

        const outputReserve = this.virtualReserveOf(outputAmount.token)
        const inputReserve = this.virtualReserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)

        const outputWeight = this.weightOf(outputAmount.token)
        const inputWeight = this.weightOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)

        const inputAmount = new TokenAmount(
            outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
            getAmountIn(
                outputAmount.toBigNumber(),
                inputReserve,
                outputReserve,
                inputWeight,
                outputWeight,
                this.fee
            )
        )

        return [
            inputAmount,
            new AmplifiedWeightedPair(
                [inputAmount.token, outputAmount.token],
                [this.reserveOf(inputAmount.token).add(inputAmount.raw), this.reserveOf(outputAmount.token).sub(outputAmount.raw)],
                [inputReserve.add(inputAmount.raw), outputReserve.sub(outputAmount.raw)],
                inputWeight,
                this.ampBPS,
                this.fee
            )
        ]
    }

}


