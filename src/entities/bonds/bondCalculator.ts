import { BigNumber } from 'ethers'
import JSBI from 'jsbi';
import { Token, WeightedPair } from '..';

const ONE = BigNumber.from(1)
const TEN = JSBI.BigInt(10)
const TWO = BigNumber.from(2)
const SQRT2x100 = BigNumber.from('141421356237309504880');
const ONE_E18 = BigNumber.from('1000000000000000000')


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

export function getTotalValue(pair: WeightedPair, payoutToken: Token): BigNumber {
    const reserve0 = pair.reserve0
    const reserve1 = pair.reserve1

    const [reservesOther, weightPayoutToken, weightOther] = payoutToken.equals(pair.token0)
        ? [reserve1, pair.weight0, pair.weight1]
        : [reserve0, pair.weight1, pair.weight0]

    return SQRT2x100.mul(reservesOther.toBigNumber()).div(
        sqrrt(BigNumber.from(JSBI.add(JSBI.multiply(weightOther, weightOther), JSBI.multiply(weightPayoutToken, weightPayoutToken)).toString())
        )).div(ONE_E18)
}

/**
* - calculates the value in payoutToken of the input LP amount provided
* @param _pair general pair that has the RequiemSwap interface implemented
* @param amount_ the amount of LP to price in REQT
*  - is consistent with the uniswapV2-type case 
*/
export function valuation(pair: WeightedPair, totalSupply: BigNumber, amount: BigNumber, payoutToken: Token) {
    const totalValue = getTotalValue(pair, payoutToken);
    return totalValue.mul(amount).div(totalSupply);
}



// markdown function for bond valuation
export function markdown(pair: WeightedPair, payoutToken: Token): BigNumber {
    const [reservesOther, weightOther, weightPayoutToken] = payoutToken.equals(pair.token0)
        ? [pair.reserve1.toBigNumber(), BigNumber.from(pair.weight1.toString()), BigNumber.from(pair.weight0.toString())]
        : [pair.reserve0.toBigNumber(), BigNumber.from(pair.weight0.toString()), BigNumber.from(pair.weight1.toString())];

    // adjusted markdown scaling up the reserve as the trading mechnism allows
    // higher or lower valuation for payoutToken reserve
    return reservesOther.add(
        weightOther.mul(reservesOther).div(weightPayoutToken)).mul(
            BigNumber.from(JSBI.exponentiate(TEN, JSBI.BigInt(payoutToken.decimals))).div(
                getTotalValue(pair, payoutToken)
            )
        )
}