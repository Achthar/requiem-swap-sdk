import invariant from 'tiny-invariant'
import { BigNumber } from 'ethers'
import {
  _getAPrecise,
  calculateSwapGivenIn,
  _calculateRemoveLiquidity,
  _calculateRemoveLiquidityOneToken,
  _calculateTokenAmount,
  calculateSwapGivenOut
} from '../../calculators/stableCalc'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { StableSwapStorage } from '../../calculators/stableSwapStorage'
import {
  BigintIsh,
  STABLE_POOL_ADDRESS
} from '../../../constants'
import StableSwap from '../../../abis/RequiemStableSwap.json'
import { Token } from '../../token'
import { TokenAmount } from '../../fractions/tokenAmount'
import { Pool } from '../pool'
import { Price } from '../../fractions'

// const ZERO = BigNumber.from(0)

/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export class StablePool extends Pool {
  public readonly address: string
  // the only LP token
  public readonly liquidityToken: Token
  // the index-token map 
  public readonly tokens: Token[]
  public tokenBalances: BigNumber[]
  public _A: BigNumber
  public swapStorage: StableSwapStorage
  // public readonly rates: BigNumber[]
  public blockTimestamp: BigNumber

  public lpTotalSupply: BigNumber
  public currentWithdrawFee: BigNumber
  public _name: string

  public constructor(
    tokens: Token[],
    tokenBalances: BigNumber[],
    _A: BigNumber,
    swapStorage: StableSwapStorage,
    blockTimestamp: number,
    lpTotalSupply: BigNumber,
    currentWithdrawFee: BigNumber,
    poolAddress: string,
    lpAddress?: string
  ) {
    super()
    this.tokens = tokens
    this.currentWithdrawFee = currentWithdrawFee
    this.lpTotalSupply = lpTotalSupply
    this.swapStorage = swapStorage
    this.blockTimestamp = BigNumber.from(blockTimestamp)
    this.tokenBalances = tokenBalances
    this._A = _A
    this.liquidityToken = new Token(
      tokens[0].chainId,
      lpAddress ?? '0x0000000000000000000000000000000000000001',
      18,
      'RequiemStable-LP',
      'Requiem StableSwap LPs'
    )
    this.address = ethers.utils.getAddress(poolAddress)

    for (let i = 0; i < Object.values(this.tokens).length; i++) {
      invariant(tokens[i].address != ethers.constants.AddressZero, "invalidTokenAddress");
      invariant(tokens[i].decimals <= 18, "invalidDecimals");
      invariant(tokens[i].chainId === tokens[0].chainId, 'INVALID TOKENS')
    }

    this._name = 'Stable Pool'
  }

  public static mock() {
    const dummy = BigNumber.from(0)
    return new StablePool([new Token(1, '0x0000000000000000000000000000000000000001', 6, 'Mock USDC', 'MUSDC')], [dummy], dummy, StableSwapStorage.mock(), 0, dummy, dummy, '0x0000000000000000000000000000000000000001')
  }

  public getAddressForRouter(): string {
    return STABLE_POOL_ADDRESS[this.tokens[0].chainId]
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

  public set setCurrentWithdrawFee(feeToSet: BigNumber) {
    this.currentWithdrawFee = feeToSet
  }

  // maps the index to the token in the stablePool
  public tokenFromIndex(index: number): Token {
    return this.tokens[index]
  }

  public indexFromToken(token: Token): number {
    for (let index = 0; index < Object.keys(this.tokens).length; index++) {
      if (token.equals(this.tokens[index])) {
        return index
      }
    }
    throw new Error('token not in pool');
  }

  public getBalances(): BigNumber[] {
    return Object.keys(this.tokens).map((_, index) => (this.tokenBalances[index]))
  }

  // calculates the output amount usingn the input for the swableSwap
  // requires the view on a contract as manual calculation on the frontend would
  // be inefficient
  public async calculateSwapViaPing(
    inToken: Token,
    outToken: Token,
    inAmount: BigNumber | BigintIsh,
    provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh> {

    const outAmount: BigintIsh = await new Contract(this.address, new ethers.utils.Interface(StableSwap), provider).calculateSwap(inToken.address, outToken.address, inAmount)

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwapGivenIn(
    tokenIn: Token,
    tokenOut: Token,
    inAmount: BigNumber): BigNumber {

    // if (this.getBalances()[inIndex].lte(inAmount)) // || inAmount.eq(ZERO))
    //   return ZERO

    const outAmount: BigNumber = calculateSwapGivenIn(
      this.indexFromToken(tokenIn),
      this.indexFromToken(tokenOut),
      inAmount,
      this.tokenBalances,
      this.blockTimestamp,
      this.swapStorage)

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwapGivenOut(
    tokenIn: Token,
    tokenOut: Token,
    outAmount: BigNumber): BigNumber {

    // if (this.getBalances()[outIndex].lte(outAmount)) // || outAmount.eq(ZERO))
    //   return ZERO

    const inAmount: BigNumber = calculateSwapGivenOut(
      this.indexFromToken(tokenIn),
      this.indexFromToken(tokenOut),
      outAmount,
      this.tokenBalances,
      this.blockTimestamp,
      this.swapStorage)

    return inAmount
  }

  public getOutputAmount(inputAmount: TokenAmount, tokenOut: Token): TokenAmount {
    const swap = this.calculateSwapGivenIn(inputAmount.token, tokenOut, inputAmount.toBigNumber())
    return new TokenAmount(tokenOut, swap.toBigInt())
  }

  public getInputAmount(outputAmount: TokenAmount, tokenIn: Token): TokenAmount {
    const swap = this.calculateSwapGivenOut(tokenIn, outputAmount.token, outputAmount.toBigNumber())
    return new TokenAmount(tokenIn, swap)
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
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
    return _calculateRemoveLiquidity(
      amountLp,
      this.swapStorage,
      this.lpTotalSupply,
      this.currentWithdrawFee,
      this.getBalances()
    )
  }

  public calculateRemoveLiquidityOneToken(amount: BigNumber, index: number): { [returnVal: string]: BigNumber } {
    return _calculateRemoveLiquidityOneToken(
      this.swapStorage,
      amount,
      index,
      this.blockTimestamp,
      this.getBalances(),
      this.lpTotalSupply,
      this.currentWithdrawFee
    )
  }

  public getLiquidityAmount(amounts: BigNumber[], deposit: boolean) {
    return _calculateTokenAmount(
      this.swapStorage,
      amounts,
      deposit,
      this.getBalances(),
      this.blockTimestamp,
      this.lpTotalSupply
    )
  }

  public getLiquidityValue(outIndex: number, userBalances: BigNumber[]): TokenAmount {
    let amount = BigNumber.from(0)
    for (let i = 0; i < userBalances.length; i++) {
      if (i !== outIndex)
        amount = amount.add(this.calculateSwapGivenIn(this.tokens[i], this.tokens[outIndex], userBalances[i]))
    }
    amount = amount.add(userBalances[outIndex])
    return new TokenAmount(this.tokens[outIndex], amount.toBigInt())
  }

  public setSwapStorage(swapStorage: StableSwapStorage) {
    this.swapStorage = swapStorage
  }

  public setTokenBalances(tokenBalances: BigNumber[]) {
    this.tokenBalances = tokenBalances
  }

  public setBlockTimestamp(blockTimestamp: BigNumber) {
    this.blockTimestamp = blockTimestamp
  }

  public setLpTotalSupply(totalSupply: BigNumber) {
    this.lpTotalSupply = totalSupply
  }

  public setBalanceValueByIndex(index: number, newBalance: BigNumber) {
    this.tokenBalances[index] = newBalance
  }

  public setBalanceValue(tokenAmount: TokenAmount) {
    let newBalances = [] // safe way for replacement
    for (let i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? tokenAmount.toBigNumber() : this.tokenBalances[i])
    }
    this.setTokenBalances(newBalances)
  }

  public addBalanceValue(tokenAmount: TokenAmount) {
    let newBalances = [] // safe way for replacement
    for (let i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? this.tokenBalances[i].add(tokenAmount.toBigNumber()) : this.tokenBalances[i])
    }
    this.setTokenBalances(newBalances)
  }

  public subtractBalanceValue(tokenAmount: TokenAmount) {
    let newBalances = [] // safe way for replacement
    for (let i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? this.tokenBalances[i].sub(tokenAmount.toBigNumber()) : this.tokenBalances[i])
    }
    this.setTokenBalances(newBalances)
  }

  public clone(): StablePool {
    return new StablePool(
      this.tokens, this.tokenBalances, this._A, this.swapStorage, this.blockTimestamp.toNumber(), this.lpTotalSupply, this.currentWithdrawFee, this.address
    )
  }

  public poolPrice(tokenIn: Token, tokenOut: Token): Price {
    const virtualIn = BigNumber.from(this.tokenBalances[this.indexFromToken(tokenIn)]).div(10000)
    return new Price(tokenIn, tokenOut, virtualIn, this.calculateSwapGivenIn(tokenIn, tokenOut, virtualIn))
  }


  public poolPriceBases(tokenIn: Token, tokenOut: Token): { priceBaseIn: BigNumber; priceBaseOut: BigNumber; } {
    const virtualIn = this.tokenBalances[this.indexFromToken(tokenIn)].div(10000)
    return {
      priceBaseIn: virtualIn,
      priceBaseOut: this.calculateSwapGivenIn(tokenIn, tokenOut, virtualIn)
    }
  }

  public adjustForSwap(amountIn: TokenAmount, amountOut: TokenAmount) {
    this.tokenBalances[this.indexFromToken(amountIn.token)] = this.tokenBalances[this.indexFromToken(amountIn.token)].add(amountIn.raw)
    this.tokenBalances[this.indexFromToken(amountOut.token)] = this.tokenBalances[this.indexFromToken(amountOut.token)].sub(amountOut.raw)
  };

  public getName(): string {
    return this._name;
  }
} 
