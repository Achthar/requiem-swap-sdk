import invariant from 'tiny-invariant'
import { BigNumber } from 'ethers'

import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { WeightedSwapStorage } from './calculators/weightedSwapStorage'
import {
  BigintIsh,
  ChainId,
  STABLE_POOL_ADDRESS,
  STABLE_POOL_LP_ADDRESS
} from '../constants'
import weightedPoolABI from '../abis/WeightedPool.json'
import { Token } from './token'
import { TokenAmount } from './fractions/tokenAmount'
import { ZERO } from './calculators/LogExpMath'
import { calculateRemoveLiquidityExactIn, calculateRemoveLiquidityOneTokenExactIn, calculateSwapGivenIn, calculateSwapGivenOut, calculateTokenAmount } from './calculators/WeightedPoolLib'

// const ZERO = BigNumber.from(0)

/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export class WeightedPool {
  public readonly poolAddress: string
  // the only LP token
  public readonly liquidityToken: Token
  // the index-token map 
  public readonly tokens: { [index: number]: Token }
  public tokenBalances: BigNumber[]
  public swapStorage: WeightedSwapStorage
  // public readonly rates: BigNumber[]
  public blockTimestamp: BigNumber

  public lpTotalSupply: BigNumber
  public static getRouterAddress(chainId: number): string {
    return STABLE_POOL_ADDRESS[chainId]
  }

  public static getLpAddress(chainId: number): string {
    return STABLE_POOL_LP_ADDRESS[chainId]
  }

  public constructor(
    poolAddress: string,
    tokens: { [index: number]: Token },
    tokenBalances: BigNumber[],
    swapStorage: WeightedSwapStorage,
    blockTimestamp: number,
    lpTotalSupply: BigNumber
  ) {
    this.poolAddress = poolAddress
    this.lpTotalSupply = lpTotalSupply
    this.swapStorage = swapStorage
    this.blockTimestamp = BigNumber.from(blockTimestamp)
    this.tokens = tokens
    this.tokenBalances = tokenBalances
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
    return new WeightedPool('', { 0: new Token(1, '0x0000000000000000000000000000000000000001', 6, 'Mock USDC', 'MUSDC') }, [ZERO], WeightedSwapStorage.mock(), 0, ZERO)
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
    // chainId: number,
    provider: ethers.Signer | ethers.providers.Provider): Promise<BigintIsh> {

    const outAmount: BigintIsh = await new Contract(
      '0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E',
      new ethers.utils.Interface(weightedPoolABI.abi),
      provider
    ).calculateSwapGivenIn(this.tokens[inIndex].address, this.tokens[outIndex].address, inAmount)

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwapGivenIn(
    inIndex: number,
    outIndex: number,
    inAmount: BigNumber): BigNumber {

    // if (this.getBalances()[inIndex].lte(inAmount)) // || inAmount.eq(ZERO))
    //   return ZERO

    const outAmount: BigNumber = calculateSwapGivenIn(
      this.swapStorage,
      inIndex,
      outIndex,
      inAmount,
      this.getBalances()
    )

    return outAmount
  }


  // calculates the swap output amount without
  // pinging the blockchain for data
  public calculateSwapGivenOut(
    inIndex: number,
    outIndex: number,
    outAmount: BigNumber): BigNumber {

    // if (this.getBalances()[outIndex].lte(outAmount)) // || outAmount.eq(ZERO))
    //   return ZERO

    const inAmount: BigNumber = calculateSwapGivenOut(
      this.swapStorage,
      inIndex,
      outIndex,
      outAmount,
      this.getBalances(),
    )

    return inAmount
  }

  public getOutputAmount(inputAmount: TokenAmount, outIndex: number): TokenAmount {
    const swap = this.calculateSwapGivenIn(this.indexFromToken(inputAmount.token), outIndex, inputAmount.toBigNumber())
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
    return calculateRemoveLiquidityExactIn(
      this.swapStorage,
      amountLp,
      this.lpTotalSupply,
      this.getBalances()
    )
  }

  public calculateRemoveLiquidityOneToken(amount: BigNumber, index: number): { [returnVal: string]: BigNumber } {
    return calculateRemoveLiquidityOneTokenExactIn(
      this.swapStorage,
      index,
      amount,
      this.lpTotalSupply,
      this.swapStorage.balances
    )
  }

  public getLiquidityAmount(amounts: BigNumber[], deposit: boolean) {
    return calculateTokenAmount(
      this.swapStorage,
      amounts,
      this.lpTotalSupply,
      deposit,
      this.getBalances(),
    )
  }

  public getLiquidityValue(outIndex: number, userBalances: BigNumber[]): TokenAmount {
    let amount = BigNumber.from(0)
    for (let i = 0; i < userBalances.length; i++) {
      if (i !== outIndex)
        amount = amount.add(this.calculateSwapGivenIn(i, outIndex, userBalances[i]))
    }
    amount = amount.add(userBalances[outIndex])
    return new TokenAmount(this.tokens[outIndex], amount.toBigInt())
  }

  public setSwapStorage(swapStorage: WeightedSwapStorage) {
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

  public clone(): WeightedPool {
    return new WeightedPool(
      this.poolAddress,
      this.tokens,
      this.tokenBalances,
      this.swapStorage,
      this.blockTimestamp.toNumber(),
      this.lpTotalSupply
    )
  }
}