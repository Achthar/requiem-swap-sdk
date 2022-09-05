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
    public abstract readonly liquidityToken: Token
    public abstract tokenBalances: BigNumber[]
    public abstract readonly address: string
    public abstract _name: string

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

    public set name(value: string) {
        this._name = value
    }

    public get name(): string {
        return this._name
    }


    public setBalanceValueByIndex(index: number, newBalance: BigNumber) {
        this.tokenBalances[index] = newBalance
    }

    public getTokenAmounts(): TokenAmount[] {
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

    // function that adjusts pool for swap  amounts if routed through more than once
    public abstract adjustForSwap(amountIn: TokenAmount, amountOut: TokenAmount): void;

    // function that adjusts pool for swap  amounts if routed through more than once
    public abstract clone(): Pool;

    public abstract getName(): string;
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