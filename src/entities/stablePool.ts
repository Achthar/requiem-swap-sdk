import invariant from 'tiny-invariant'
import { BigNumber } from 'ethers'
import {
  _getAPrecise,
  calculateSwap,
  _calculateRemoveLiquidity,
  _calculateRemoveLiquidityOneToken,
  _calculateTokenAmount,
  calculateSwapGivenOut
} from './stableCalc'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { SwapStorage } from './swapStorage'
import {
  BigintIsh,
  ChainId,
  STABLE_POOL_ADDRESS,
  STABLE_POOL_LP_ADDRESS
} from '../constants'
import StableSwap from '../abis/RequiemStableSwap.json'
import { Token } from './token'
import { TokenAmount } from './fractions/tokenAmount'

const ZERO = BigNumber.from(0)

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
  public tokenBalances: BigNumber[]
  public _A: BigNumber
  public swapStorage: SwapStorage
  // public readonly rates: BigNumber[]
  public blockTimestamp: BigNumber

  public lpTotalSupply: BigNumber
  public currentWithdrawFee: BigNumber

  public static getRouterAddress(chainId: number): string {
    return STABLE_POOL_ADDRESS[chainId]
  }

  public static getLpAddress(chainId: number): string {
    return STABLE_POOL_LP_ADDRESS[chainId]
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
      STABLE_POOL_LP_ADDRESS[tokens[0].chainId] ?? '0x0000000000000000000000000000000000000001',
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

  public static mock() {
    const dummy = BigNumber.from(0)
    return new StablePool({ 0: new Token(1, '0x0000000000000000000000000000000000000001', 6, 'Mock USDC', 'MUSDC') }, [dummy], dummy, SwapStorage.mock(), 0, dummy, dummy)
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
    inIndex: number,
    outIndex: number,
    inAmount: BigNumber | BigintIsh,
    chainId: number,
    provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh> {

    const outAmount: BigintIsh = await new Contract(StablePool.getRouterAddress(chainId), new ethers.utils.Interface(StableSwap), provider).calculateSwap(inIndex, outIndex, inAmount)

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwap(
    inIndex: number,
    outIndex: number,
    inAmount: BigNumber): BigNumber {

    if (this.getBalances()[inIndex].lte(inAmount)) // || inAmount.eq(ZERO))
      return ZERO

    const outAmount: BigNumber = calculateSwap(
      inIndex,
      outIndex,
      inAmount,
      this.getBalances(),
      this.blockTimestamp,
      this.swapStorage)

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwapGivenOut(
    inIndex: number,
    outIndex: number,
    outAmount: BigNumber): BigNumber {

    if (this.getBalances()[outIndex].lte(outAmount)) // || outAmount.eq(ZERO))
      return ZERO

    const inAmount: BigNumber = calculateSwapGivenOut(
      inIndex,
      outIndex,
      outAmount,
      this.getBalances(),
      this.blockTimestamp,
      this.swapStorage)

    return inAmount
  }

  public getOutputAmount(inputAmount: TokenAmount, outIndex: number): TokenAmount {
    const swap = this.calculateSwap(this.indexFromToken(inputAmount.token), outIndex, inputAmount.toBigNumber())
    return new TokenAmount(this.tokenFromIndex(outIndex), swap.toBigInt())
  }

  public getInputAmount(outputAmount: TokenAmount, inIndex: number): TokenAmount {
    const swap = this.calculateSwapGivenOut(inIndex, this.indexFromToken(outputAmount.token), outputAmount.toBigNumber())
    return new TokenAmount(this.tokenFromIndex(inIndex), swap.toBigInt())
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
        amount = amount.add(this.calculateSwap(i, outIndex, userBalances[i]))
    }
    amount = amount.add(userBalances[outIndex])
    return new TokenAmount(this.tokens[outIndex], amount.toBigInt())
  }

  public setSwapStorage(swapStorage: SwapStorage) {
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
      this.tokens, this.tokenBalances, this._A, this.swapStorage, this.blockTimestamp.toNumber(), this.lpTotalSupply, this.currentWithdrawFee
    )
  }
}
