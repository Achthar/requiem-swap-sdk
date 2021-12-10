import { Price } from './fractions/price'
import { TokenAmount } from './fractions/tokenAmount'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import {
  BigintIsh,
  WEIGHTED_FACTORY_ADDRESS,
  INIT_CODE_HASH_WEIGHTED,
  MINIMUM_LIQUIDITY,
  ZERO,
  // ONE,
  FIVE,
  _100,
  // FEES_NUMERATOR,
  // FEES_DENOMINATOR,
  ChainId,
} from '../constants'
import { sqrt, parseBigintIsh } from '../utils'
import { InsufficientReservesError, InsufficientInputAmountError } from '../errors'
import { Token } from './token'
import { getAmountOut, getAmountIn } from './weightedPairCalc'
import { PoolType } from './pool'

let PAIR_ADDRESS_CACHE: {
  [token0Address: string]: {
    [token1Address: string]: {
      [weight0_fee: string]: string
    }
  }
} = {}

export class WeightedPair {
  public readonly liquidityToken: Token
  private readonly tokenAmounts: [TokenAmount, TokenAmount]
  // the tokenAmount for calculating the price
  // these cannot be derived from the tokenAmounts since
  // they follow the stableSwap logic for pricing
  public pricingBasesIn: TokenAmount[]
  public pricingBasesOut: TokenAmount[]
  private readonly weights: [JSBI, JSBI]
  private readonly fee: JSBI
  public readonly type: PoolType

  public static getAddress(tokenA: Token, tokenB: Token, weightA: JSBI, fee: JSBI): string {
    const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
    const weights = tokenA.sortsBefore(tokenB) ? [weightA.toString(), JSBI.subtract(_100, weightA).toString()] : [JSBI.subtract(_100, weightA).toString(), weightA.toString()] // does safety checks
    if (PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address]?.[`${weights[0]}-${fee.toString()}`] === undefined) {
      PAIR_ADDRESS_CACHE = {
        ...PAIR_ADDRESS_CACHE,
        [tokens[0].address]: {
          ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
          [tokens[1].address]: {
            ...PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address],
            [`${weights[0]}-${fee.toString()}`]: getCreate2Address(
              WEIGHTED_FACTORY_ADDRESS[tokens[0].chainId],
              keccak256(
                ['bytes'],
                [pack(
                  ['address', 'address', 'uint32', 'uint32'],
                  [tokens[0].address, tokens[1].address, weights[0], fee.toString()]
                )]
              ),
              INIT_CODE_HASH_WEIGHTED[tokens[0].chainId]
            )
          },
        },
      }
    }

    return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address][`${weights[0]}-${fee.toString()}`]
  }

  public constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount, weightA: JSBI, fee: JSBI) {

    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    this.weights = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [weightA, JSBI.subtract(_100, weightA)]
      : [JSBI.subtract(_100, weightA), weightA]
    this.fee = fee
    this.liquidityToken = new Token(
      tokenAmounts[0].token.chainId,
      WeightedPair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token, weightA, fee),
      18,
      'Requiem-LP',
      'Requiem LPs'
    )
    this.type = PoolType.WeightedPair

    // assign pricing bases
    this.pricingBasesIn = tokenAmounts
    this.pricingBasesOut = tokenAmounts

    this.tokenAmounts = tokenAmounts as [TokenAmount, TokenAmount]
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

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price {
    return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price {
    return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw)
  }

  public get fee0(): JSBI {
    return this.fee
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
    return this.tokenAmounts[0].token
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token
  }

  public get reserve0(): TokenAmount {
    return this.tokenAmounts[0]
  }

  public get reserve1(): TokenAmount {
    return this.tokenAmounts[1]
  }

  public get weight0(): JSBI {
    return this.weights[0]
  }

  public get weight1(): JSBI {
    return this.weights[1]
  }


  public reserveOf(token: Token): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }
  public weightOf(token: Token): JSBI {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.weight0 : this.weight1
  }

  public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, WeightedPair] {
    invariant(this.involvesToken(inputAmount.token), 'TOKEN')
    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.token)
    const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)

    const inputWeight = this.weightOf(inputAmount.token)
    const outputWeight = this.weightOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)


    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      // getAmountOut(inputAmount.raw, inputReserve.raw, outputReserve.raw, inputWeight, outputWeight, this.fee)
      JSBI.BigInt(
        getAmountOut(
          inputAmount.toBigNumber(),
          inputReserve.toBigNumber(),
          outputReserve.toBigNumber(),
          BigNumber.from(inputWeight.toString()),
          BigNumber.from(outputWeight.toString()),
          BigNumber.from(this.fee.toString())
        ).toString()
      )
    )
    // console.log("OA", outputAmount.raw.toString())
    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError()
    }

    // here we save the pricing results if it is called
    const inIndex = inputAmount.token.equals(this.token0) ? 0 : 1
    const outIndex = outputAmount.token.equals(this.token0) ? 0 : 1
    this.pricingBasesIn[inIndex] = inputAmount
    this.pricingBasesOut[outIndex] = outputAmount

    return [outputAmount, new WeightedPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), inputWeight, this.fee)]
  }

  public getInputAmount(outputAmount: TokenAmount): [TokenAmount, WeightedPair] {
    invariant(this.involvesToken(outputAmount.token), 'TOKEN')
    console.log("-- this 0", this.reserve0.raw, "1", this.reserve1.raw, "out", outputAmount.raw)
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.token)
    const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)

    const outputWeight = this.weightOf(outputAmount.token)
    const inputWeight = this.weightOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)

    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      // getAmountIn(outputAmount.raw, inputReserve.raw, outputReserve.raw, inputWeight, outputWeight, this.fee)
      JSBI.BigInt(
        getAmountIn(
          outputAmount.toBigNumber(),
          inputReserve.toBigNumber(),
          outputReserve.toBigNumber(),
          BigNumber.from(inputWeight.toString()),
          BigNumber.from(outputWeight.toString()),
          BigNumber.from(this.fee.toString())
        ).toString()
      )
    )
    // here we save the pricing results if it is called
    const inIndex = inputAmount.token.equals(this.token0) ? 0 : 1
    const outIndex = outputAmount.token.equals(this.token0) ? 0 : 1
    this.pricingBasesIn[inIndex] = inputAmount
    this.pricingBasesOut[outIndex] = outputAmount

    return [inputAmount, new WeightedPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), inputWeight, this.fee)]
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

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY)
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
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
    invariant(JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY')

    let totalSupplyAdjusted: TokenAmount
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = parseBigintIsh(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
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
      JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw)
    )
  }

  public clone(): WeightedPair {
    return new WeightedPair(this.tokenAmounts[0], this.tokenAmounts[1], this.weight0, this.fee)
  }
}
