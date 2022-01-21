

import { BigNumber } from 'ethers'
import invariant from 'tiny-invariant';

const RESOLUTION = BigNumber.from(112);
const resPrec = BigNumber.from(2).pow(RESOLUTION)
const ZERO = BigNumber.from(0)
// const Q112 = BigNumber.from('0x10000000000000000000000000000');
// const Q224 = BigNumber.from('0x100000000000000000000000000000000000000000000000000000000');
// const LOWER_MASK = BigNumber.from('0xffffffffffffffffffffffffffff'); // decimal of UQ*x112 (lower 112 bits)

export function decode(x: BigNumber) {
    return x.div(RESOLUTION);
}

export function decode112with18(x: BigNumber) {
    return x.div(BigNumber.from('5192296858534827'))
}

export function fraction(numerator: BigNumber, denominator: BigNumber) {

    invariant(denominator.gt(ZERO), "FixedPoint::fraction: division by zero");
    if (numerator.isZero()) return ZERO;

    // if (numerator.lte(BigNumber.) <= type(uint144).max) {
    const result = (numerator.mul(resPrec)).div(denominator)
    //   require(result <= type(uint224).max, "FixedPoint::fraction: overflow");
    return result;
    // } else {
    //    return numerator.mul(Q112).div(denominator);
    // }
}