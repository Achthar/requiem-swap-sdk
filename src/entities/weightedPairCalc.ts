import invariant from 'tiny-invariant'
import { BigNumber } from '@ethersproject/bignumber'

const ZERO = BigNumber.from(0)
const ONE = BigNumber.from(1)
const TWO = BigNumber.from(2)
const TENK = BigNumber.from(10000)
const _256 = BigNumber.from('256')
const _128 = BigNumber.from('128')
const MIN_PRECISION = 32;
const MAX_PRECISION = 127;

const FIXED_1 = BigNumber.from('0x080000000000000000000000000000000')
const FIXED_2 = BigNumber.from('0x100000000000000000000000000000000')
const MAX_NUM = BigNumber.from('0x200000000000000000000000000000000')

const LN2_NUMERATOR = BigNumber.from('0x3f80fe03f80fe03f80fe03f80fe03f8')
const LN2_DENOMINATOR = BigNumber.from('0x5b9de1d10bf4103d647b0955897ba80')

const OPT_LOG_MAX_VAL = BigNumber.from('0x15bf0a8b1457695355fb8ac404e7a79e3')
const OPT_EXP_MAX_VAL = BigNumber.from('0x800000000000000000000000000000000')

// const LAMBERT_CONV_RADIUS = BigNumber.from('0x002f16ac6c59de6f8d5d6f63c1482a7c86')
// const LAMBERT_POS2_SAMPLE = BigNumber.from('0x0003060c183060c183060c183060c18306')
// const LAMBERT_POS2_MAXVAL = BigNumber.from('0x01af16ac6c59de6f8d5d6f63c1482a7c80')
// const LAMBERT_POS3_MAXVAL = BigNumber.from('0x6b22d43e72c326539cceeef8bb48f255ff')

// const MAX_UNF_WEIGHT = BigNumber.from('0x10c6f7a0b5ed8d36b4c7f34938583621fafc8b0079a2834d26fa3fcc9ea9')

const maxExpArray = new Array<BigNumber>(128)
maxExpArray[32] = BigNumber.from('0x1c35fedd14ffffffffffffffffffffffff')
maxExpArray[33] = BigNumber.from('0x1b0ce43b323fffffffffffffffffffffff')
maxExpArray[34] = BigNumber.from('0x19f0028ec1ffffffffffffffffffffffff')
maxExpArray[35] = BigNumber.from('0x18ded91f0e7fffffffffffffffffffffff')
maxExpArray[36] = BigNumber.from('0x17d8ec7f0417ffffffffffffffffffffff')
maxExpArray[37] = BigNumber.from('0x16ddc6556cdbffffffffffffffffffffff')
maxExpArray[38] = BigNumber.from('0x15ecf52776a1ffffffffffffffffffffff')
maxExpArray[39] = BigNumber.from('0x15060c256cb2ffffffffffffffffffffff')
maxExpArray[40] = BigNumber.from('0x1428a2f98d72ffffffffffffffffffffff')
maxExpArray[41] = BigNumber.from('0x13545598e5c23fffffffffffffffffffff')
maxExpArray[42] = BigNumber.from('0x1288c4161ce1dfffffffffffffffffffff')
maxExpArray[43] = BigNumber.from('0x11c592761c666fffffffffffffffffffff')
maxExpArray[44] = BigNumber.from('0x110a688680a757ffffffffffffffffffff')
maxExpArray[45] = BigNumber.from('0x1056f1b5bedf77ffffffffffffffffffff')
maxExpArray[46] = BigNumber.from('0x0faadceceeff8bffffffffffffffffffff')
maxExpArray[47] = BigNumber.from('0x0f05dc6b27edadffffffffffffffffffff')
maxExpArray[48] = BigNumber.from('0x0e67a5a25da4107fffffffffffffffffff')
maxExpArray[49] = BigNumber.from('0x0dcff115b14eedffffffffffffffffffff')
maxExpArray[50] = BigNumber.from('0x0d3e7a392431239fffffffffffffffffff')
maxExpArray[51] = BigNumber.from('0x0cb2ff529eb71e4fffffffffffffffffff')
maxExpArray[52] = BigNumber.from('0x0c2d415c3db974afffffffffffffffffff')
maxExpArray[53] = BigNumber.from('0x0bad03e7d883f69bffffffffffffffffff')
maxExpArray[54] = BigNumber.from('0x0b320d03b2c343d5ffffffffffffffffff')
maxExpArray[55] = BigNumber.from('0x0abc25204e02828dffffffffffffffffff')
maxExpArray[56] = BigNumber.from('0x0a4b16f74ee4bb207fffffffffffffffff')
maxExpArray[57] = BigNumber.from('0x09deaf736ac1f569ffffffffffffffffff')
maxExpArray[58] = BigNumber.from('0x0976bd9952c7aa957fffffffffffffffff')
maxExpArray[59] = BigNumber.from('0x09131271922eaa606fffffffffffffffff')
maxExpArray[60] = BigNumber.from('0x08b380f3558668c46fffffffffffffffff')
maxExpArray[61] = BigNumber.from('0x0857ddf0117efa215bffffffffffffffff')
maxExpArray[62] = BigNumber.from('0x07ffffffffffffffffffffffffffffffff')
maxExpArray[63] = BigNumber.from('0x07abbf6f6abb9d087fffffffffffffffff')
maxExpArray[64] = BigNumber.from('0x075af62cbac95f7dfa7fffffffffffffff')
maxExpArray[65] = BigNumber.from('0x070d7fb7452e187ac13fffffffffffffff')
maxExpArray[66] = BigNumber.from('0x06c3390ecc8af379295fffffffffffffff')
maxExpArray[67] = BigNumber.from('0x067c00a3b07ffc01fd6fffffffffffffff')
maxExpArray[68] = BigNumber.from('0x0637b647c39cbb9d3d27ffffffffffffff')
maxExpArray[69] = BigNumber.from('0x05f63b1fc104dbd39587ffffffffffffff')
maxExpArray[70] = BigNumber.from('0x05b771955b36e12f7235ffffffffffffff')
maxExpArray[71] = BigNumber.from('0x057b3d49dda84556d6f6ffffffffffffff')
maxExpArray[72] = BigNumber.from('0x054183095b2c8ececf30ffffffffffffff')
maxExpArray[73] = BigNumber.from('0x050a28be635ca2b888f77fffffffffffff')
maxExpArray[74] = BigNumber.from('0x04d5156639708c9db33c3fffffffffffff')
maxExpArray[75] = BigNumber.from('0x04a23105873875bd52dfdfffffffffffff')
maxExpArray[76] = BigNumber.from('0x0471649d87199aa990756fffffffffffff')
maxExpArray[77] = BigNumber.from('0x04429a21a029d4c1457cfbffffffffffff')
maxExpArray[78] = BigNumber.from('0x0415bc6d6fb7dd71af2cb3ffffffffffff')
maxExpArray[79] = BigNumber.from('0x03eab73b3bbfe282243ce1ffffffffffff')
maxExpArray[80] = BigNumber.from('0x03c1771ac9fb6b4c18e229ffffffffffff')
maxExpArray[81] = BigNumber.from('0x0399e96897690418f785257fffffffffff')
maxExpArray[82] = BigNumber.from('0x0373fc456c53bb779bf0ea9fffffffffff')
maxExpArray[83] = BigNumber.from('0x034f9e8e490c48e67e6ab8bfffffffffff')
maxExpArray[84] = BigNumber.from('0x032cbfd4a7adc790560b3337ffffffffff')
maxExpArray[85] = BigNumber.from('0x030b50570f6e5d2acca94613ffffffffff')
maxExpArray[86] = BigNumber.from('0x02eb40f9f620fda6b56c2861ffffffffff')
maxExpArray[87] = BigNumber.from('0x02cc8340ecb0d0f520a6af58ffffffffff')
maxExpArray[88] = BigNumber.from('0x02af09481380a0a35cf1ba02ffffffffff')
maxExpArray[89] = BigNumber.from('0x0292c5bdd3b92ec810287b1b3fffffffff')
maxExpArray[90] = BigNumber.from('0x0277abdcdab07d5a77ac6d6b9fffffffff')
maxExpArray[91] = BigNumber.from('0x025daf6654b1eaa55fd64df5efffffffff')
maxExpArray[92] = BigNumber.from('0x0244c49c648baa98192dce88b7ffffffff')
maxExpArray[93] = BigNumber.from('0x022ce03cd5619a311b2471268bffffffff')
maxExpArray[94] = BigNumber.from('0x0215f77c045fbe885654a44a0fffffffff')
maxExpArray[95] = BigNumber.from('0x01ffffffffffffffffffffffffffffffff')
maxExpArray[96] = BigNumber.from('0x01eaefdbdaaee7421fc4d3ede5ffffffff')
maxExpArray[97] = BigNumber.from('0x01d6bd8b2eb257df7e8ca57b09bfffffff')
maxExpArray[98] = BigNumber.from('0x01c35fedd14b861eb0443f7f133fffffff')
maxExpArray[99] = BigNumber.from('0x01b0ce43b322bcde4a56e8ada5afffffff')
maxExpArray[100] = BigNumber.from('0x019f0028ec1fff007f5a195a39dfffffff')
maxExpArray[101] = BigNumber.from('0x018ded91f0e72ee74f49b15ba527ffffff')
maxExpArray[102] = BigNumber.from('0x017d8ec7f04136f4e5615fd41a63ffffff')
maxExpArray[103] = BigNumber.from('0x016ddc6556cdb84bdc8d12d22e6fffffff')
maxExpArray[104] = BigNumber.from('0x015ecf52776a1155b5bd8395814f7fffff')
maxExpArray[105] = BigNumber.from('0x015060c256cb23b3b3cc3754cf40ffffff')
maxExpArray[106] = BigNumber.from('0x01428a2f98d728ae223ddab715be3fffff')
maxExpArray[107] = BigNumber.from('0x013545598e5c23276ccf0ede68034fffff')
maxExpArray[108] = BigNumber.from('0x01288c4161ce1d6f54b7f61081194fffff')
maxExpArray[109] = BigNumber.from('0x011c592761c666aa641d5a01a40f17ffff')
maxExpArray[110] = BigNumber.from('0x0110a688680a7530515f3e6e6cfdcdffff')
maxExpArray[111] = BigNumber.from('0x01056f1b5bedf75c6bcb2ce8aed428ffff')
maxExpArray[112] = BigNumber.from('0x00faadceceeff8a0890f3875f008277fff')
maxExpArray[113] = BigNumber.from('0x00f05dc6b27edad306388a600f6ba0bfff')
maxExpArray[114] = BigNumber.from('0x00e67a5a25da41063de1495d5b18cdbfff')
maxExpArray[115] = BigNumber.from('0x00dcff115b14eedde6fc3aa5353f2e4fff')
maxExpArray[116] = BigNumber.from('0x00d3e7a3924312399f9aae2e0f868f8fff')
maxExpArray[117] = BigNumber.from('0x00cb2ff529eb71e41582cccd5a1ee26fff')
maxExpArray[118] = BigNumber.from('0x00c2d415c3db974ab32a51840c0b67edff')
maxExpArray[119] = BigNumber.from('0x00bad03e7d883f69ad5b0a186184e06bff')
maxExpArray[120] = BigNumber.from('0x00b320d03b2c343d4829abd6075f0cc5ff')
maxExpArray[121] = BigNumber.from('0x00abc25204e02828d73c6e80bcdb1a95bf')
maxExpArray[122] = BigNumber.from('0x00a4b16f74ee4bb2040a1ec6c15fbbf2df')
maxExpArray[123] = BigNumber.from('0x009deaf736ac1f569deb1b5ae3f36c130f')
maxExpArray[124] = BigNumber.from('0x00976bd9952c7aa957f5937d790ef65037')
maxExpArray[125] = BigNumber.from('0x009131271922eaa6064b73a22d0bd4f2bf')
maxExpArray[126] = BigNumber.from('0x008b380f3558668c46c91c49a2f8e967b9')
maxExpArray[127] = BigNumber.from('0x00857ddf0117efa215952912839f6473e6')

function leftShift(num: BigNumber, shift: BigNumber) {
    return num.mul(TWO.pow(shift))
}

function signedRightShift(num: BigNumber, shift: BigNumber) {
    return num.div(TWO.pow(shift))
}

/**
     * @dev General Description:
     *     Determine a value of precision.
     *     Calculate an integer approximation of (_baseN / _baseD) ^ (_expN / _expD) * 2 ^ precision.
     *     Return the result along with the precision used.
     *
     * Detailed Description:
     *     Instead of calculating "base ^ exp", we calculate "e ^ (log(base) * exp)".
     *     The value of "log(base)" is represented with an integer slightly smaller than "log(base) * 2 ^ precision".
     *     The larger "precision" is, the more accurately this value represents the real value.
     *     However, the larger "precision" is, the more bits are required in order to store this value.
     *     And the exponentiation function, which takes "x" and calculates "e ^ x", is limited to a maximum exponent (maximum value of "x").
     *     This maximum exponent depends on the "precision" used, and it is given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
     *     Hence we need to determine the highest precision which can be used for the given input, before calling the exponentiation function.
     *     This allows us to compute "base ^ exp" with maximum accuracy and without exceeding 256 bits in any of the intermediate computations.
     *     This functions assumes that "_expN < 2 ^ 256 / log(MAX_NUM - 1)", otherwise the multiplication should be replaced with a "safeMul".
     *     Since we rely on unsigned-integer arithmetic and "base < 1" ==> "log(base) < 0", this function does not support "_baseN < _baseD".
     */
export function power(
    _baseN: BigNumber,
    _baseD: BigNumber,
    _expN: BigNumber,
    _expD: BigNumber
): [BigNumber, number] {
    invariant(_baseN.gt(_baseD), "not support _baseN < _baseD");
    invariant(_baseN.lt(MAX_NUM))

    let baseLog;
    let base = (_baseN.mul(FIXED_1)).div(_baseD);
    if (base.lt(OPT_LOG_MAX_VAL)) {
        baseLog = optimalLog(base);
    } else {
        baseLog = generalLog(base);
    }

    let baseLogTimesExp = (baseLog.mul(_expN)).div(_expD);
    if (baseLogTimesExp.lt(OPT_EXP_MAX_VAL)) {
        return [optimalExp(baseLogTimesExp), MAX_PRECISION]
    } else {
        let precision = findPositionInMaxExpArray(baseLogTimesExp);
        return [generalExp(signedRightShift(baseLogTimesExp, BigNumber.from(MAX_PRECISION - precision)), BigNumber.from(precision)), precision]
    }
}

/**
 * @dev computes the largest integer smaller than or equal to the binary logarithm of the input.
 */
function floorLog2(_n: BigNumber): BigNumber {
    let res = ZERO;
    if (_n.lt(_256)) {
        // At most 8 iterations
        while (_n.gt(ONE)) {
            _n = signedRightShift(_n, ONE);
            res = res.add(ONE);
        }
    } else {
        // Exactly 8 iterations
        for (let s = _128; s.gt(ZERO); s = signedRightShift(s, ONE)) {
            if (_n.gt(leftShift(ONE, s))) {
                _n = signedRightShift(_n, s)
                res = res.or(s);
            }
        }
    }
    
    return res;
}

/**
 * @dev computes log(x / FIXED_1) * FIXED_1.
 * This functions assumes that "x >= FIXED_1", because the output would be negative otherwise.
 */
export function generalLog(x: BigNumber): BigNumber {
    let res = ZERO;
    // If x >= 2, then we compute the integer part of log2(x), which is larger than 0.
    if (x.gte(FIXED_2)) {
        const count = floorLog2(x.div(FIXED_1));
        x = signedRightShift(x, count);
        // now x < 2
        res = count.mul(FIXED_1);
    }

    // If x > 1, then we compute the fraction part of log2(x), which is larger than 0.
    if (x.gt(FIXED_1)) {
        for (let i = MAX_PRECISION; i > 0; --i) {
            x = (x.mul(x)).div(FIXED_1);
            // now 1 < x < 4
            if (x.gte(FIXED_2)) {
                x = signedRightShift(x, ONE);
                // now 1 < x < 2
                res = res.add(leftShift(ONE, BigNumber.from(i - 1)));
            }
        }
    }

    return (res.mul(LN2_NUMERATOR)).div(LN2_DENOMINATOR)
}

/**
    * @dev computes log(x / FIXED_1) * FIXED_1
    * Input range: FIXED_1 <= x <= OPT_LOG_MAX_VAL - 1
    * Auto-generated via "PrintFunctionOptimalLog.py"
    * Detailed description:
    * - Rewrite the input as a product of natural exponents and a single residual r, such that 1 < r < 2
    * - The natural logarithm of each (pre-calculated) exponent is the degree of the exponent
    * - The natural logarithm of r is calculated via Taylor series for log(1 + x), where x = r - 1
    * - The natural logarithm of the input is calculated by summing up the intermediate results above
    * - For example: log(250) = log(e^4 * e^1 * e^0.5 * 1.021692859) = 4 + 1 + 0.5 + log(1 + 0.021692859)
    */
export function optimalLog(x: BigNumber): BigNumber {
    let res = ZERO;

    let y;
    let z;
    let w;

    if (x.gte('0xd3094c70f034de4b96ff7d5b6f99fcd8')) {
        res = res.add(BigNumber.from('0x40000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0xd3094c70f034de4b96ff7d5b6f99fcd8'));
    }
    // add 1 / 2^1
    if (x.gte('0xa45af1e1f40c333b3de1db4dd55f29a7')) {
        res = res.add(BigNumber.from('0x20000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0xa45af1e1f40c333b3de1db4dd55f29a7'));
    }
    // add 1 / 2^2
    if (x.gte('0x910b022db7ae67ce76b441c27035c6a1')) {
        res = res.add(BigNumber.from('0x10000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0x910b022db7ae67ce76b441c27035c6a1'));
    }
    // add 1 / 2^3
    if (x.gte('0x88415abbe9a76bead8d00cf112e4d4a8')) {
        res = res.add(BigNumber.from('0x08000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0x88415abbe9a76bead8d00cf112e4d4a8'));
    }
    // add 1 / 2^4
    if (x.gte('0x84102b00893f64c705e841d5d4064bd3')) {
        res = res.add(BigNumber.from('0x04000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0x84102b00893f64c705e841d5d4064bd3'));
    }
    // add 1 / 2^5
    if (x.gte('0x8204055aaef1c8bd5c3259f4822735a2')) {
        res = res.add(BigNumber.from('0x02000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0x8204055aaef1c8bd5c3259f4822735a2'));
    }
    // add 1 / 2^6
    if (x.gte('0x810100ab00222d861931c15e39b44e99')) {
        res = res.add(BigNumber.from('0x01000000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0x810100ab00222d861931c15e39b44e99'));
    }
    // add 1 / 2^7
    if (x.gte('0x808040155aabbbe9451521693554f733')) {
        res = res.add(BigNumber.from('0x00800000000000000000000000000000'));
        x = (x.mul(FIXED_1)).div(BigNumber.from('0x808040155aabbbe9451521693554f733'));
    }
    // add 1 / 2^8

    z = y = x.sub(FIXED_1);
    w = (y.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x100000000000000000000000000000000').sub(y)).div(BigNumber.from('0x100000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^01 / 01 - y^02 / 02
    res = res.add(z.mul(BigNumber.from('0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').sub(y)).div(BigNumber.from('0x200000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^03 / 03 - y^04 / 04
    res = res.add(z.mul(BigNumber.from('0x099999999999999999999999999999999').sub(y)).div(BigNumber.from('0x300000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^05 / 05 - y^06 / 06
    res = res.add(z.mul(BigNumber.from('0x092492492492492492492492492492492').sub(y)).div(BigNumber.from('0x400000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^07 / 07 - y^08 / 08
    res = res.add(z.mul(BigNumber.from('0x08e38e38e38e38e38e38e38e38e38e38e').sub(y)).div(BigNumber.from('0x500000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^09 / 09 - y^10 / 10
    res = res.add(z.mul(BigNumber.from('0x08ba2e8ba2e8ba2e8ba2e8ba2e8ba2e8b').sub(y)).div(BigNumber.from('0x600000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^11 / 11 - y^12 / 12
    res = res.add(z.mul(BigNumber.from('0x089d89d89d89d89d89d89d89d89d89d89').sub(y)).div(BigNumber.from('0x700000000000000000000000000000000')));
    z = (z.mul(w)).div(FIXED_1);
    // add y^13 / 13 - y^14 / 14
    res = res.add(z.mul(BigNumber.from('0x088888888888888888888888888888888').sub(y)).div(BigNumber.from('0x800000000000000000000000000000000')));
    // add y^15 / 15 - y^16 / 16

    return res;
}

export function optimalExp(x: BigNumber): BigNumber {
    let res = ZERO;

    let y;
    let z;

    z = y = x.mod(BigNumber.from('0x10000000000000000000000000000000'));
    // get the input modulo 2^(-3)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x10e1b3be415a0000')));
    // add y^02 * (20! / 02!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x05a0913f6b1e0000')));
    // add y^03 * (20! / 03!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0168244fdac78000')));
    // add y^04 * (20! / 04!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x004807432bc18000')));
    // add y^05 * (20! / 05!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x000c0135dca04000')));
    // add y^06 * (20! / 06!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0001b707b1cdc000')));
    // add y^07 * (20! / 07!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x000036e0f639b800')));
    // add y^08 * (20! / 08!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x00000618fee9f800')));
    // add y^09 * (20! / 09!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000009c197dcc00')));
    // add y^10 * (20! / 10!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000000e30dce400')));
    // add y^11 * (20! / 11!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x000000012ebd1300')));
    // add y^12 * (20! / 12!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000000017499f00')));
    // add y^13 * (20! / 13!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000000001a9d480')));
    // add y^14 * (20! / 14!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x00000000001c6380')));
    // add y^15 * (20! / 15!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x000000000001c638')));
    // add y^16 * (20! / 16!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000000000001ab8')));
    // add y^17 * (20! / 17!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x000000000000017c')));
    // add y^18 * (20! / 18!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000000000000014')));
    // add y^19 * (20! / 19!)
    z = (z.mul(y)).div(FIXED_1);
    res = res.add(z.mul(BigNumber.from('0x0000000000000001')));
    // add y^20 * (20! / 20!)
    res = res.div(BigNumber.from('0x21c3677c82b40000')).add(y).add(FIXED_1);
    // divide by 20! and then add y^1 / 1! + y^0 / 0!

    if (!(x.and(BigNumber.from('0x010000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x1c3d6a24ed82218787d624d3e5eba95f9'))).div(BigNumber.from('0x18ebef9eac820ae8682b9793ac6d1e776'));
    // multiply by e^2^(-3)
    if (!(x.and(BigNumber.from('0x020000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x18ebef9eac820ae8682b9793ac6d1e778'))).div(BigNumber.from('0x1368b2fc6f9609fe7aceb46aa619baed4'));
    // multiply by e^2^(-2)
    if (!(x.and(BigNumber.from('0x040000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x1368b2fc6f9609fe7aceb46aa619baed5'))).div(BigNumber.from('0x0bc5ab1b16779be3575bd8f0520a9f21f'));
    // multiply by e^2^(-1)
    if (!(x.and(BigNumber.from('0x080000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x0bc5ab1b16779be3575bd8f0520a9f21e'))).div(BigNumber.from('0x0454aaa8efe072e7f6ddbab84b40a55c9'));
    // multiply by e^2^(+0)
    if (!(x.and(BigNumber.from('0x100000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x0454aaa8efe072e7f6ddbab84b40a55c5'))).div(BigNumber.from('0x00960aadc109e7a3bf4578099615711ea'));
    // multiply by e^2^(+1)
    if (!(x.and(BigNumber.from('0x200000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x00960aadc109e7a3bf4578099615711d7'))).div(BigNumber.from('0x0002bf84208204f5977f9a8cf01fdce3d'));
    // multiply by e^2^(+2)
    if (!(x.and(BigNumber.from('0x400000000000000000000000000000000')).isZero())) res = (res.mul(BigNumber.from('0x0002bf84208204f5977f9a8cf01fdc307'))).div(BigNumber.from('0x0000003c6ab775dd0b95b4cbee7e65d11'));
    // multiply by e^2^(+3)
    
    return res;
}

/**
   * @dev this function can be auto-generated by the script "PrintFunctionGeneralExp.py".
   * it approximates "e ^ x" via maclaurin summation: "(x^0)/0! + (x^1)/1! + ... + (x^n)/n!".
   * it returns "e ^ (x / 2 ^ precision) * 2 ^ precision", that is, the result is upshifted for accuracy.
   * the global "maxExpArray" maps each "precision" to "((maximumExponent + 1) << (MAX_PRECISION - precision)) - 1".
   * the maximum permitted value for "x" is therefore given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
   */
export function generalExp(_x: BigNumber, _precision: BigNumber) {
    let xi = _x;
    let res = ZERO;

    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x3442c4e6074a82f1797f72ac0000000'));
    // add x^02 * (33! / 02!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x116b96f757c380fb287fd0e40000000'));
    // add x^03 * (33! / 03!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x045ae5bdd5f0e03eca1ff4390000000'));
    // add x^04 * (33! / 04!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00defabf91302cd95b9ffda50000000'));
    // add x^05 * (33! / 05!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x002529ca9832b22439efff9b8000000'));
    // add x^06 * (33! / 06!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00054f1cf12bd04e516b6da88000000'));
    // add x^07 * (33! / 07!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000a9e39e257a09ca2d6db51000000'));
    // add x^08 * (33! / 08!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000012e066e7b839fa050c309000000'));
    // add x^09 * (33! / 09!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000001e33d7d926c329a1ad1a800000'));
    // add x^10 * (33! / 10!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000002bee513bdb4a6b19b5f800000'));
    // add x^11 * (33! / 11!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000003a9316fa79b88eccf2a00000'));
    // add x^12 * (33! / 12!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000048177ebe1fa812375200000'));
    // add x^13 * (33! / 13!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000005263fe90242dcbacf00000'));
    // add x^14 * (33! / 14!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000000000057e22099c030d94100000'));
    // add x^15 * (33! / 15!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000057e22099c030d9410000'));
    // add x^16 * (33! / 16!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000052b6b54569976310000'));
    // add x^17 * (33! / 17!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000004985f67696bf748000'));
    // add x^18 * (33! / 18!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000000000000003dea12ea99e498000'));
    // add x^19 * (33! / 19!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000000031880f2214b6e000'));
    // add x^20 * (33! / 20!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000000000000000025bcff56eb36000'));
    // add x^21 * (33! / 21!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000000000000000001b722e10ab1000'));
    // add x^22 * (33! / 22!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000000000001317c70077000'));
    // add x^23 * (33! / 23!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000000000000cba84aafa00'));
    // add x^24 * (33! / 24!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000000000000082573a0a00'));
    // add x^25 * (33! / 25!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000000000000005035ad900'));
    // add x^26 * (33! / 26!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x000000000000000000000002f881b00'));
    // add x^27 * (33! / 27!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000000000000000001b29340'));
    // add x^28 * (33! / 28!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x00000000000000000000000000efc40'));
    // add x^29 * (33! / 29!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000000000000000000007fe0'));
    // add x^30 * (33! / 30!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000000000000000000000420'));
    // add x^31 * (33! / 31!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000000000000000000000021'));
    // add x^32 * (33! / 32!)
    xi = signedRightShift(xi.mul(_x), _precision);
    res = res.add(xi.mul('0x0000000000000000000000000000001'));
    // add x^33 * (33! / 33!)

    
    return (res.div(BigNumber.from('0x688589cc0e9505e2f2fee5580000000'))).add(_x).add(leftShift(ONE, _precision));
    // divide by 33! and then add x^1 / 1! + x^0 / 0!
}

/**
    * @dev the global "maxExpArray" is sorted in descending order, and therefore the following statements are equivalent:
    * - This function finds the position of [the smallest value in "maxExpArray" larger than or equal to "x"]
    * - This function finds the highest position of [a value in "maxExpArray" larger than or equal to "x"]
    */
export function findPositionInMaxExpArray(_x: BigNumber): number {
    let lo = MIN_PRECISION;
    let hi = MAX_PRECISION;

    while (lo + 1 < hi) {
        let mid = (lo + hi) / 2;
        if (maxExpArray[mid].gte(_x)) lo = mid;
        else hi = mid;
    }

    if (maxExpArray[hi].gte(_x)) return hi;
    if (maxExpArray[lo].gte(_x)) return lo;

    invariant(false);
}

/**
 * @dev given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset,
 *
 * Formula:
 * return = reserveOut * (1 - (reserveIn * 10000 / (reserveIn * 10000 + amountIn * (10000 - swapFee))) ^ (tokenWeightIn / tokenWeightOut))
 *
 * @param amountIn                  source reserve amount
 * @param reserveIn    source reserve balance
 * @param reserveOut    target reserve balance
 * @param tokenWeightIn     source reserve weight, represented in ppm (2-98)
 * @param tokenWeightOut     target reserve weight, represented in ppm (2-98)
 * @param swapFee                  swap fee of the conversion
 *
 * @return amountOut
 */
export function getAmountOut(
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
    tokenWeightIn: BigNumber,
    tokenWeightOut: BigNumber,
    swapFee: BigNumber
): BigNumber {
    // validate input
    invariant(amountIn.gt(ZERO), "RequiemFormula: INSUFFICIENT_INPUT_AMOUNT");
    invariant(reserveIn.gt(ZERO) && reserveOut.gt(ZERO), "RequiemFormula: INSUFFICIENT_LIQUIDITY");
    const amountInWithFee = amountIn.mul(TENK.sub(swapFee))
    // special case for equal weights
    if (tokenWeightIn.eq(tokenWeightOut)) {
        return (reserveOut.mul(amountInWithFee)).div(reserveIn.mul(TENK).add(amountInWithFee));
    }

    // let result;
    // let precision: number;
    const baseN = (reserveIn.mul(TENK)).add(amountInWithFee)
    const [result, precision] = power(baseN, reserveIn.mul(TENK), tokenWeightIn, tokenWeightOut);
    
    const temp1 = reserveOut.mul(result);
    const temp2 = leftShift(reserveOut, BigNumber.from(precision));
    
    return (temp1.sub(temp2)).div(result)
}

/**
 * @dev given an output amount of an asset and pair reserves, returns a required input amount of the other asset
 *
 * Formula:
 * return = reserveIn * ( (reserveOut / (reserveOut - amountOut)) ^ (tokenWeightOut / tokenWeightIn) - 1) * (10000/ (10000 - swapFee)
 *
 * @param amountOut     target reserve amount
 * @param reserveIn    source reserve balance
 * @param reserveOut    target reserve balance
 * @param tokenWeightIn     source reserve weight, represented in ppm (2-98)
 * @param tokenWeightOut     target reserve weight, represented in ppm (2-98)
 * @param swapFee                  swap fee of the conversion
 *
 * @return amountIn
 */
export function getAmountIn(
    amountOut: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
    tokenWeightIn: BigNumber,
    tokenWeightOut: BigNumber,
    swapFee: BigNumber
) {
    // validate input
    invariant(amountOut.gt(ZERO), "RequiemFormula: INSUFFICIENT_OUTPUT_AMOUNT");
    invariant(reserveIn.gt(ZERO) && reserveOut.gt(ZERO), "RequiemFormula: INSUFFICIENT_LIQUIDITY");
    // special case for equal weights
    if (tokenWeightIn.eq(tokenWeightOut)) {
        const numerator = reserveIn.mul(amountOut).mul(TENK);
        const denominator = reserveOut.sub(amountOut).mul(TENK.sub(swapFee));
        return (numerator.div(denominator)).add(1);
    }

    const baseD = reserveOut.sub(amountOut);
    const [result, precision] = power(reserveOut, baseD, tokenWeightOut, tokenWeightIn);
    const baseReserveIn = reserveIn.mul(TENK);
    const temp1 = baseReserveIn.mul(result);
    const temp2 = leftShift(baseReserveIn, BigNumber.from(precision));
    return (signedRightShift(temp1.sub(temp2), BigNumber.from(precision)).div(TENK.sub(swapFee))).add(1);
}

