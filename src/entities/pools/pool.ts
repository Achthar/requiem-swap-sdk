import invariant from 'tiny-invariant'
import { BigNumber } from 'ethers'
import { Token } from '../token'
import { Price, TokenAmount } from '../fractions'

// const ZERO = BigNumber.from(0)

/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */
export abstract class Pool {

    // the index-token map 
    public abstract readonly tokens: Token[]
    public abstract tokenBalances: BigNumber[]
    public abstract readonly address: string


    // public constructor(
    //     tokens: Token[],
    //     tokenBalances: BigNumber[]
    // ) {

    //     this.tokens = tokens
    //     this.tokenBalances = tokenBalances
    // }

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

    // calculates the swap output amount without
    // pinging the blockchain for data
    public abstract calculateSwapGivenIn(
        tokenIn: Token,
        tokenOut: Token,
        inAmount: BigNumber): BigNumber;


    // calculates the swap output amount without
    // pinging the blockchain for data
    public abstract calculateSwapGivenOut(
        tokenIn: Token,
        tokenOut: Token,
        outAmount: BigNumber): BigNumber;

    // public getOutputAmount(inputAmount: TokenAmount, tokenOut: Token): TokenAmount {
    //     const swap = this.calculateSwapGivenIn(inputAmount.token, tokenOut, inputAmount.raw)
    //     return new TokenAmount(tokenOut, swap.toBigInt())
    // }

    // public getInputAmount(outputAmount: TokenAmount, tokenIn: Token): TokenAmount {
    //     const swap = this.calculateSwapGivenOut(tokenIn, outputAmount.token, outputAmount.toBigNumber())
    //     return new TokenAmount(tokenIn, swap.toBigInt())
    // }
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


    // public getLiquidityValue(outIndex: number, userBalances: BigNumber[]): TokenAmount {
    //     let amount = BigNumber.from(0)
    //     for (let i = 0; i < userBalances.length; i++) {
    //         if (i !== outIndex)
    //             amount = amount.add(this.calculateSwapGivenIn(this.tokens[i], this.tokens[outIndex], userBalances[i]))
    //     }
    //     amount = amount.add(userBalances[outIndex])
    //     return new TokenAmount(this.tokens[outIndex], amount.toBigInt())
    // }

    public setBalanceValueByIndex(index: number, newBalance: BigNumber) {
        this.tokenBalances[index] = newBalance
    }

    public getTokenBalances(): TokenAmount[] {
        return this.tokens.map((t, i) => new TokenAmount(t, this.tokenBalances[i]))
    }


    public setTokenBalances(tokenBalances: BigNumber[]) {
        this.tokenBalances = tokenBalances
    }

    public subtractBalanceValue(tokenAmount: TokenAmount) {
        let newBalances = [] // safe way for replacement
        for (let i = 0; i < this.tokenBalances.length; i++) {
            newBalances.push(this.indexFromToken(tokenAmount.token) === i ? this.tokenBalances[i].sub(tokenAmount.toBigNumber()) : this.tokenBalances[i])
        }
        this.setTokenBalances(newBalances)
    }

    public abstract poolPrice(tokenIn: Token, tokenOut: Token): Price;

    public abstract poolPriceBases(tokenIn: Token, tokenOut: Token): {
        priceBaseIn: BigNumber
        priceBaseOut: BigNumber

    };

}


export enum PoolType {
    Pair = 'Pair',
    StablePairWrapper = 'StablePairWrapper',
    AmplifiedWeightedPair = 'AmplifiedWeightedPair',
    PoolPairWrapper = 'PoolPairWrapper',
}

export type PoolDictionary = { [id: string]: Pool }

export type PoolHops = {
    [tokenAddress: string]: Set<Token>; // the set of pool ids
}