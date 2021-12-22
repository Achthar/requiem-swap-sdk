import { BigNumber } from 'ethers'
import JSBI from 'jsbi';
import { Token, TokenAmount, WeightedPair } from '..';

const ONE = BigNumber.from(1)
const TWO = BigNumber.from(2)

export function sqrrt(a: BigNumber): BigNumber {
    let c = ONE
    if (a.gt(3)) {
        c = a;
        let b = a.div(TWO).add(ONE);
        while (b < c) {
            c = b;
            b = (a.div(b).add(b)).div(TWO);
        }
    } else if (!a.eq(0)) {
        c = ONE;
    }
    return c
}

export function getTotalValue(pair: WeightedPair, reqt: Token): BigNumber {
    const reserve0 = pair.reserve0
    const reserve1 = pair.reserve1

    const [otherToken, reservesOther] = reqt.equals(pair.token0)
        ? [pair.token1, reserve1]
        : [pair.token0, reserve0]

    const decimals = otherToken.decimals +
        reqt.decimals -
        pair.liquidityToken.decimals -
        4;

    const [syntReserveREQT,] = pair.clone().getOutputAmount(
        new TokenAmount(otherToken,
            JSBI.divide(reservesOther.raw, JSBI.BigInt(10000)))
    );

    return sqrrt(syntReserveREQT.toBigNumber().mul(reservesOther.toBigNumber()).div(BigNumber.from(10 ** decimals))).mul(TWO)
}

/**
* - calculates the value in reqt of the input LP amount provided
* @param _pair general pair that has the RequiemSwap interface implemented
* @param amount_ the amount of LP to price in REQT
*  - is consistent with the uniswapV2-type case 
*/
export function valuation(pair: WeightedPair, totalSupply: BigNumber, amount: BigNumber, reqt: Token) {
    const totalValue = getTotalValue(pair, reqt);

    return totalValue.mul(amount).div(totalSupply);
}