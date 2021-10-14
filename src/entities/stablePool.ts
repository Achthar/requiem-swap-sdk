import invariant from 'tiny-invariant'
import { BigNumber } from 'ethers'
import { _getAPrecise, calculateSwap, _calculateRemoveLiquidity, _calculateRemoveLiquidityOneToken } from './stableCalc'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { SwapStorage } from './swapStorage'
import {
  BigintIsh,
  ChainId,
  STABLE_POOL_ADDRESS
} from '../constants'
import StableSwap from '../abis/RequiemStableSwap.json'
import { Token } from './token'


/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export class StablePool {
  // the only LP token
  public readonly liquidityToken: Token
  // the index-token map 
  public readonly tokens: { [index: number]: Token }
  public readonly tokenBalances: BigNumber[]
  public readonly _A: BigNumber
  public readonly swapStorage: SwapStorage
  // public readonly rates: BigNumber[]
  public readonly blockTimestamp: BigNumber

  public readonly lpTotalSupply: BigNumber
  public readonly currentWithdrawFee: BigNumber

  public static getAddress(chainId: number): string {
    return STABLE_POOL_ADDRESS[chainId]
  }

  public constructor(
    tokens: { [index: number]: Token },
    tokenBalances: BigNumber[],
    _A: BigNumber,
    swapStorage: SwapStorage,
    blockTimestamp: number,
    lpTotalSupply: BigNumber,
    currentWithdrawFee: BigNumber
  ) {
    this.currentWithdrawFee = currentWithdrawFee
    this.lpTotalSupply = lpTotalSupply
    this.swapStorage = swapStorage
    this.blockTimestamp = BigNumber.from(blockTimestamp)
    this.tokens = tokens
    this.tokenBalances = tokenBalances
    this._A = _A
    this.liquidityToken = new Token(
      tokens[0].chainId,
      StablePool.getAddress(tokens[0].chainId),
      18,
      'RequiemStable-LP',
      'Requiem StableSwap LPs'
    )

    for (let i = 0; i < Object.values(this.tokens).length; i++) {
      invariant(tokens[i].address != ethers.constants.AddressZero, "invalidTokenAddress");
      invariant(tokens[i].decimals <= 18, "invalidDecimals");
      invariant(tokens[i].chainId === tokens[0].chainId, 'INVALID TOKENS')
    }
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    let res = false
    for (let i = 0; i < Object.keys(this.tokens).length; i++) {
      res || token.equals(this.tokens[i])
    }

    return res
  }

  // maps the index to the token in the stablePool
  public currencyFromIndex(index: number): Token {
    return this.tokens[index]
  }

  public getBalances(): BigNumber[] {
    return Object.keys(this.tokens).map((_, index) => (this.tokenBalances[index]))
  }

  // calculates the output amount usingn the input for the swableSwap
  // requires the view on a contract as manual calculation on the frontend would
  // be inefficient
  public async calculateSwapViaPing(
    inIndex: number,
    outIndex: number,
    inAmount: BigintIsh,
    provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh> {

    const outAmount: BigintIsh = await new Contract(this.liquidityToken.address, new ethers.utils.Interface(StableSwap), provider).calculateSwap(inIndex, outIndex, inAmount)

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwap(
    inIndex: number,
    outIndex: number,
    inAmount: BigNumber): BigNumber {

    const outAmount: BigNumber = calculateSwap(
      inIndex,
      outIndex,
      inAmount,
      this.getBalances(),
      this.blockTimestamp,
      this.swapStorage)

    return outAmount
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): ChainId {
    return this.tokens[0].chainId
  }

  public token(index: number): Token {
    return this.tokens[index]
  }

  public reserveOf(token: Token): BigNumber {
    invariant(this.involvesToken(token), 'TOKEN')
    for (let i = 0; i < Object.keys(this.tokens).length; i++) {
      if (token.equals(this.tokens[i]))
        return this.tokenBalances[i]
    }
    return BigNumber.from(0)
  }

  public calculateRemoveLiquidity(amountLp: BigNumber): BigNumber[] {
    return _calculateRemoveLiquidity(amountLp, this.swapStorage, this.lpTotalSupply, this.currentWithdrawFee, this.getBalances())
  }

  public calculateRemoveLiquidityOneToken(amount: BigNumber, index: number): { [returnVal: string]: BigNumber } {
    return _calculateRemoveLiquidityOneToken(this.swapStorage,
      amount,
      index,
      this.blockTimestamp,
      this.getBalances(),
      this.lpTotalSupply,
      this.currentWithdrawFee)
  }
  /*
    public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, StablePool] {
      invariant(this.involvesToken(inputAmount.token), 'TOKEN')
      if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
        throw new InsufficientReservesError()
      }
      const inputReserve = this.reserveOf(inputAmount.token)
      const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)
      const inputAmountWithFee = JSBI.multiply(inputAmount.raw, FEES_NUMERATOR)
      const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw)
      const denominator = JSBI.add(JSBI.multiply(inputReserve.raw, FEES_DENOMINATOR), inputAmountWithFee)
      const outputAmount = new TokenAmount(
        inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
        JSBI.divide(numerator, denominator)
      )
      if (JSBI.equal(outputAmount.raw, ZERO)) {
        throw new InsufficientInputAmountError()
      }
      return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
    }
  
    public getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair] {
      invariant(this.involvesToken(outputAmount.token), 'TOKEN')
      if (
        JSBI.equal(this.reserve0.raw, ZERO) ||
        JSBI.equal(this.reserve1.raw, ZERO) ||
        JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)
      ) {
        throw new InsufficientReservesError()
      }
  
      const outputReserve = this.reserveOf(outputAmount.token)
      const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)
      const numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), FEES_DENOMINATOR)
      const denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), FEES_NUMERATOR)
      const inputAmount = new TokenAmount(
        outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
        JSBI.add(JSBI.divide(numerator, denominator), ONE)
      )
      return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
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
    } */
}
