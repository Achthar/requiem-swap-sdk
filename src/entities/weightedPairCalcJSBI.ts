import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import {
    ONE,
    // TWO,
    TENK,
    ZERO
} from '../constants'

const _256 = JSBI.BigInt('256')
const _128 = JSBI.BigInt('128')
const MIN_PRECISION = 32;
const MAX_PRECISION = 127;

//   const FIXED_1 = BigNumber.from('0x080000000000000000000000000000000')
//   const FIXED_2 = BigNumber.from('0x100000000000000000000000000000000')
//   const MAX_NUM = BigNumber.from('0x200000000000000000000000000000000')

//   const LN2_NUMERATOR = BigNumber.from('0x3f80fe03f80fe03f80fe03f80fe03f8')
//   const LN2_DENOMINATOR = BigNumber.from('0x5b9de1d10bf4103d647b0955897ba80')

//   const OPT_LOG_MAX_VAL = BigNumber.from('0x15bf0a8b1457695355fb8ac404e7a79e3')
//   const OPT_EXP_MAX_VAL = BigNumber.from('0x800000000000000000000000000000000')

//   const LAMBERT_CONV_RADIUS = BigNumber.from('0x002f16ac6c59de6f8d5d6f63c1482a7c86')
//   const LAMBERT_POS2_SAMPLE = BigNumber.from('0x0003060c183060c183060c183060c18306')
//   const LAMBERT_POS2_MAXVAL = BigNumber.from('0x01af16ac6c59de6f8d5d6f63c1482a7c80')
//   const LAMBERT_POS3_MAXVAL = BigNumber.from('0x6b22d43e72c326539cceeef8bb48f255ff')

//   const MAX_UNF_WEIGHT = BigNumber.from('0x10c6f7a0b5ed8d36b4c7f34938583621fafc8b0079a2834d26fa3fcc9ea9')

const FIXED_1 = JSBI.BigInt('170141183460469231731687303715884105728')
const FIXED_2 = JSBI.BigInt('340282366920938463463374607431768211456')
const MAX_NUM = JSBI.BigInt('680564733841876926926749214863536422912')
const LN2_NUMERATOR = JSBI.BigInt('5275695611177340518812009417546793976')
const LN2_DENOMINATOR = JSBI.BigInt('7611219895485218073587121647846406784')
const OPT_LOG_MAX_VAL = JSBI.BigInt('462491687273110168575455517921668397539')
const OPT_EXP_MAX_VAL = JSBI.BigInt('2722258935367507707706996859454145691648')
// const LAMBERT_CONV_RADIUS = JSBI.BigInt('62591443491685266058625363149075414150')
// const LAMBERT_POS2_SAMPLE = JSBI.BigInt('4019083073869351930669778827934270214')
// const LAMBERT_POS2_MAXVAL = JSBI.BigInt('573014993873092961253687274296727731328')
// const LAMBERT_POS3_MAXVAL = JSBI.BigInt('36456509045932913977692090597752865707519')
// const MAX_UNF_WEIGHT = JSBI.BigInt('115792089237316195423570985008687907853269984665640564039457584007913129')

const maxExpArray = new Array<JSBI>(128)
maxExpArray[32] = JSBI.BigInt('9599678685041259184274752310158947254271')
maxExpArray[33] = JSBI.BigInt('9204759687141885226475603015507577405439')
maxExpArray[34] = JSBI.BigInt('8826087172077985712041017634911355404287')
maxExpArray[35] = JSBI.BigInt('8462992779488582574159642900919291478015')
maxExpArray[36] = JSBI.BigInt('8114835644520100661580084966409403105279')
maxExpArray[37] = JSBI.BigInt('7781001266736647064069662172832600162303')
maxExpArray[38] = JSBI.BigInt('7460900425488323202194551465008353509375')
maxExpArray[39] = JSBI.BigInt('7153968139937914349310206877837545177087')
maxExpArray[40] = JSBI.BigInt('6859662671868001546166128217910528704511')
maxExpArray[41] = JSBI.BigInt('6577464569506365633454696454958677491711')
maxExpArray[42] = JSBI.BigInt('6306875750689218484600399768107450630143')
maxExpArray[43] = JSBI.BigInt('6047418623741353042663269283551730728959')
maxExpArray[44] = JSBI.BigInt('5798635244522972732941736303310812479487')
maxExpArray[45] = JSBI.BigInt('5560086508154074440893281558760167309311')
maxExpArray[46] = JSBI.BigInt('5331351373990447379730864460340651884543')
maxExpArray[47] = JSBI.BigInt('5112026122483163422598731111238626967551')
maxExpArray[48] = JSBI.BigInt('4901723642609993464238960471454494228479')
maxExpArray[49] = JSBI.BigInt('4700072748620998500994433661760029327359')
maxExpArray[50] = JSBI.BigInt('4506717524892375150236886652795301658623')
maxExpArray[51] = JSBI.BigInt('4321316697732212547034601541953113817087')
maxExpArray[52] = JSBI.BigInt('4143543033029384782309349805264440655871')
maxExpArray[53] = JSBI.BigInt('3973082758682431363936722477132055314431')
maxExpArray[54] = JSBI.BigInt('3809635010789003168527049097368437784575')
maxExpArray[55] = JSBI.BigInt('3652911302618395401280222488042819026943')
maxExpArray[56] = JSBI.BigInt('3502635015429898674229017626613836152831')
maxExpArray[57] = JSBI.BigInt('3358540910238258030536300376569398951935')
maxExpArray[58] = JSBI.BigInt('3220374659664501751807634855053158776831')
maxExpArray[59] = JSBI.BigInt('3087892399045852422628542596524428754943')
maxExpArray[60] = JSBI.BigInt('2960860296012425255212778080756987592703')
maxExpArray[61] = JSBI.BigInt('2839054137771012724926516325250418868223')
maxExpArray[62] = JSBI.BigInt('2722258935367507707706996859454145691647')
maxExpArray[63] = JSBI.BigInt('2610268544229484780765045556213696167935')
maxExpArray[64] = JSBI.BigInt('2502885300319193958571922333378000453631')
maxExpArray[65] = JSBI.BigInt('2399919671254773659805118819743970623487')
maxExpArray[66] = JSBI.BigInt('2301189921783908737703717501630802821119')
maxExpArray[67] = JSBI.BigInt('2206521793019491601704439134261549727743')
maxExpArray[68] = JSBI.BigInt('2115748194871134515168564783402692116479')
maxExpArray[69] = JSBI.BigInt('2028708911129671949307566740521183346687')
maxExpArray[70] = JSBI.BigInt('1945250316684124513375052119057996185599')
maxExpArray[71] = JSBI.BigInt('1865225106372009884014199587421481336831')
maxExpArray[72] = JSBI.BigInt('1788492034984419117666073304513300660223')
maxExpArray[73] = JSBI.BigInt('1714915667966964990208967912165996494847')
maxExpArray[74] = JSBI.BigInt('1644366142376587317378242124992063995903')
maxExpArray[75] = JSBI.BigInt('1576718937672301888428671268411708276735')
maxExpArray[76] = JSBI.BigInt('1511854655935336643558907106913628979199')
maxExpArray[77] = JSBI.BigInt('1449658811130741678082357454851673161727')
maxExpArray[78] = JSBI.BigInt('1390021627038517938156314751863424548863')
maxExpArray[79] = JSBI.BigInt('1332837843497611250583009129150422188031')
maxExpArray[80] = JSBI.BigInt('1278006530620790610545644364558728429567')
maxExpArray[81] = JSBI.BigInt('1225430910652498332846748256431392161791')
maxExpArray[82] = JSBI.BigInt('1175018187155249585623915264673694351359')
maxExpArray[83] = JSBI.BigInt('1126679381223093780446468558216906145791')
maxExpArray[84] = JSBI.BigInt('1080329174433053119456411494679599644671')
maxExpArray[85] = JSBI.BigInt('1035885758257346189907937735244580388863')
maxExpArray[86] = JSBI.BigInt('993270689670607839608468400662101622783')
maxExpArray[87] = JSBI.BigInt('952408752697250790372885759853747765247')
maxExpArray[88] = JSBI.BigInt('913227825654598849673391073164504596479')
maxExpArray[89] = JSBI.BigInt('875658753857474668265023456619450597375')
maxExpArray[90] = JSBI.BigInt('839635227559564507480479102760887779327')
maxExpArray[91] = JSBI.BigInt('805093664916125437948904238798044397567')
maxExpArray[92] = JSBI.BigInt('771973099761463105605096142810743046143')
maxExpArray[93] = JSBI.BigInt('740215074003106313787373698556008333311')
maxExpArray[94] = JSBI.BigInt('709763534442753181219281418466841591807')
maxExpArray[95] = JSBI.BigInt('680564733841876926926749214863536422911')
maxExpArray[96] = JSBI.BigInt('652567136057371195186997586203332575231')
maxExpArray[97] = JSBI.BigInt('625721325079798489641586010116704960511')
maxExpArray[98] = JSBI.BigInt('599979917813693414950432886451725139967')
maxExpArray[99] = JSBI.BigInt('575297480445977184425850753341355720703')
maxExpArray[100] = JSBI.BigInt('551630448254872900425972804456347074559')
maxExpArray[101] = JSBI.BigInt('528937048717783628792119060092411707391')
maxExpArray[102] = JSBI.BigInt('507177227782417987326846600868857380863')
maxExpArray[103] = JSBI.BigInt('486312579171031128343732298613950251007')
maxExpArray[104] = JSBI.BigInt('466306276593002471003532891264408092671')
maxExpArray[105] = JSBI.BigInt('447123008746104779416515886102660251647')
maxExpArray[106] = JSBI.BigInt('428728916991741247552240490495652921343')
maxExpArray[107] = JSBI.BigInt('411091535594146829344560212836376117247')
maxExpArray[108] = JSBI.BigInt('394179734418075472107167272299635146751')
maxExpArray[109] = JSBI.BigInt('377963663983834160889726215582593318911')
maxExpArray[110] = JSBI.BigInt('362414702782685419520589203652335239167')
maxExpArray[111] = JSBI.BigInt('347505406759629484539078662328460836863')
maxExpArray[112] = JSBI.BigInt('333209460874402812645752271223906598911')
maxExpArray[113] = JSBI.BigInt('319501632655197652636411056021540225023')
maxExpArray[114] = JSBI.BigInt('306357727663124583211687061200571318271')
maxExpArray[115] = JSBI.BigInt('293754546788812396405978813098581970943')
maxExpArray[116] = JSBI.BigInt('281669845305773445111617137421885345791')
maxExpArray[117] = JSBI.BigInt('270082293608263279864102872957453496319')
maxExpArray[118] = JSBI.BigInt('258971439564336547476984432763364437503')
maxExpArray[119] = JSBI.BigInt('248317672417651959902117100034610719743')
maxExpArray[120] = JSBI.BigInt('238102188174312697593221439720218478079')
maxExpArray[121] = JSBI.BigInt('228306956413649712418347768277622232511')
maxExpArray[122] = JSBI.BigInt('218914688464368667066255864092044292831')
maxExpArray[123] = JSBI.BigInt('209908806889891126870119775672831054607')
maxExpArray[124] = JSBI.BigInt('201273416229031359487226059686877220919')
maxExpArray[125] = JSBI.BigInt('192993274940365776401274035698589299391')
maxExpArray[126] = JSBI.BigInt('185053768500776578446843424638883162041')
maxExpArray[127] = JSBI.BigInt('177440883610688295304820354615089591270')


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
    _baseN: JSBI,
    _baseD: JSBI,
    _expN: JSBI,
    _expD: JSBI
): [JSBI, number] {
    invariant(JSBI.greaterThanOrEqual(_baseN, _baseD), "not support _baseN < _baseD");
    invariant(JSBI.LT(_baseN, MAX_NUM))

    let baseLog;
    let base = JSBI.divide(JSBI.multiply(_baseN, FIXED_1), _baseD);
    if (JSBI.LT(base, OPT_LOG_MAX_VAL)) {
        baseLog = optimalLog(base);
    } else {
        baseLog = generalLog(base);
    }

    let baseLogTimesExp = JSBI.divide(JSBI.multiply(baseLog, _expN), _expD);
    if (JSBI.LT(baseLogTimesExp, OPT_EXP_MAX_VAL)) {
        return [optimalExp(baseLogTimesExp), MAX_PRECISION]
    } else {
        let precision = findPositionInMaxExpArray(baseLogTimesExp);
        return [generalExp(JSBI.signedRightShift(baseLogTimesExp, JSBI.BigInt(MAX_PRECISION - precision)), precision), precision]
    }
}

/**
 * @dev computes the largest integer smaller than or equal to the binary logarithm of the input.
 */
function floorLog2(_n: JSBI): JSBI {
    let res = ZERO;
    let _m = _n
    if (JSBI.LT(_m, _256)) {
        // At most 8 iterations
        while (JSBI.GT(_m, ONE)) {
            _m = JSBI.signedRightShift(_m, ONE);
            res = JSBI.add(res, ONE);
        }
    } else {
        // Exactly 8 iterations
        for (let s = _128; JSBI.GT(s, ZERO); s = JSBI.signedRightShift(s, ONE)) {
            if (JSBI.greaterThanOrEqual(_m, JSBI.leftShift(ONE, s))) {
                _m = JSBI.signedRightShift(_m, s)
                res = JSBI.bitwiseOr(res, s);
            }
        }
    }
    console.log(res.toString)
    return res;
}

/**
 * @dev computes log(x / FIXED_1) * FIXED_1.
 * This functions assumes that "x >= FIXED_1", because the output would be negative otherwise.
 */
export function generalLog(x: JSBI): JSBI {
    let res = ZERO;
    let y = x
    // If x >= 2, then we compute the integer part of log2(x), which is larger than 0.
    if (JSBI.greaterThanOrEqual(x, FIXED_2)) {
        let count = floorLog2(JSBI.divide(x, FIXED_1));
        y = JSBI.signedRightShift(y, count);
        // now y < 2
        res = JSBI.multiply(count, FIXED_1);
    }

    // If y > 1, then we compute the fraction part of log2(y), which is larger than 0.
    if (JSBI.GT(y, FIXED_1)) {
        for (let i = MAX_PRECISION; i > 0; --i) {
            y = JSBI.divide(JSBI.multiply(y, y), FIXED_1);
            // now 1 < y < 4
            if (JSBI.greaterThanOrEqual(y, FIXED_2)) {
                y = JSBI.signedRightShift(y, ONE);
                // now 1 < x < 2
                res = JSBI.add(res, JSBI.leftShift(ONE, JSBI.BigInt(i - 1)));
            }
        }
    }

    return JSBI.divide(JSBI.multiply(res, LN2_NUMERATOR), LN2_DENOMINATOR)
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
export function optimalLog(_x: JSBI): JSBI {
    let res = ZERO;
    let x = _x;

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('280515388193368458015406427511040113880'))) {
        res = JSBI.add(res, JSBI.BigInt('85070591730234615865843651857942052864'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('280515388193368458015406427511040113880'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('218465603988574474844591417643679820199'))) {
        res = JSBI.add(res, JSBI.BigInt('42535295865117307932921825928971026432'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('218465603988574474844591417643679820199'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('192795218841189805222451540510555621025'))) {
        res = JSBI.add(res, JSBI.BigInt('21267647932558653966460912964485513216'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('192795218841189805222451540510555621025'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('181114347027396448854165353426875372712'))) {
        res = JSBI.add(res, JSBI.BigInt('10633823966279326983230456482242756608'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('181114347027396448854165353426875372712'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('175542044379434494067323265867529472979'))) {
        res = JSBI.add(res, JSBI.BigInt('5316911983139663491615228241121378304'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('175542044379434494067323265867529472979'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('172820517236198538127967385733353125282'))) {
        res = JSBI.add(res, JSBI.BigInt('2658455991569831745807614120560689152'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('172820517236198538127967385733353125282'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('171475617301169790829459146906809945753'))) {
        res = JSBI.add(res, JSBI.BigInt('1329227995784915872903807060280344576'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('171475617301169790829459146906809945753'))
    }

    if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('170807097224429000759274174605493073715'))) {
        res = JSBI.add(res, JSBI.BigInt('664613997892457936451903530140172288'))
        x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('170807097224429000759274174605493073715'))
    }

    let z = JSBI.subtract(x, FIXED_1)
    const y = z
    const w = JSBI.divide(JSBI.multiply(y, y), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('340282366920938463463374607431768211456'), y)), JSBI.BigInt('340282366920938463463374607431768211456'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('226854911280625642308916404954512140970'), y)), JSBI.BigInt('680564733841876926926749214863536422912'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('204169420152563078078024764459060926873'), y)), JSBI.BigInt('1020847100762815390390123822295304634368'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('194447066811964836264785489961010406546'), y)), JSBI.BigInt('1361129467683753853853498429727072845824'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('189045759400521368590763670795426784142'), y)), JSBI.BigInt('1701411834604692317316873037158841057280'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('185608563775057343707295240417328115339'), y)), JSBI.BigInt('2041694201525630780780247644590609268736'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('183228966803582249557201711694029036937'), y)), JSBI.BigInt('2381976568446569244243622252022377480192'))

    z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)

    res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('181483929024500513847133123963609712776'), y)), JSBI.BigInt('2722258935367507707706996859454145691648'))

    return res;
}

export function optimalExp(x: JSBI): JSBI {
    let res = ZERO;

    const y = JSBI.remainder(x, JSBI.BigInt('21267647932558653966460912964485513216'))
    let z = y

    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('1216451004088320000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('405483668029440000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('101370917007360000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('20274183401472000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('3379030566912000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('482718652416000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('60339831552000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('6704425728000')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('670442572800')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('60949324800')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('5079110400')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('390700800')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('27907200')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('1860480')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('116280')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('6840')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('380')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)
    res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('20')))
    z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)

    res = JSBI.add(res, JSBI.multiply(z, ONE))
    res = JSBI.add(JSBI.add(JSBI.divide(res, JSBI.BigInt('2432902008176640000')), y), FIXED_1)

    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('21267647932558653966460912964485513216')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('600596269623765960634066700837880239609')), JSBI.BigInt('530024347646835984032474664511850276726'))
    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('42535295865117307932921825928971026432')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('530024347646835984032474664511850276728')), JSBI.BigInt('412783376994266390547521411024565284564'))
    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('85070591730234615865843651857942052864')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('412783376994266390547521411024565284565')), JSBI.BigInt('250365773966741064234501452596301656607'))
    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('170141183460469231731687303715884105728')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('250365773966741064234501452596301656606')), JSBI.BigInt('92104421015340344839251721785254237641'))
    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('340282366920938463463374607431768211456')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('92104421015340344839251721785254237637')), JSBI.BigInt('12464977905455307901915658421775307242'))
    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('680564733841876926926749214863536422912')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('12464977905455307901915658421775307223')), JSBI.BigInt('228304034072369565894155946646425149'))
    if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('1361129467683753853853498429727072845824')), ZERO))
        res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('228304034072369565894155946646422279')), JSBI.BigInt('76587471230661696290698490699025'))

    return res
}

/**
   * @dev this function can be auto-generated by the script "PrintFunctionGeneralExp.py".
   * it approximates "e ^ x" via maclaurin summation: "(x^0)/0! + (x^1)/1! + ... + (x^n)/n!".
   * it returns "e ^ (x / 2 ^ precision) * 2 ^ precision", that is, the result is upshifted for accuracy.
   * the global "maxExpArray" maps each "precision" to "((maximumExponent + 1) << (MAX_PRECISION - precision)) - 1".
   * the maximum permitted value for "x" is therefore given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
   */
export function generalExp(_x: JSBI, _precision: number) {
    let xi = _x;
    let res = ZERO;

    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('4341658809405943247759097200640000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('1447219603135314415919699066880000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('361804900783828603979924766720000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('72360980156765720795984953344000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('12060163359460953465997492224000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('1722880479922993352285356032000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('215360059990374169035669504000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('23928895554486018781741056000000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('2392889555448601878174105600000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('217535414131691079834009600000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('18127951177640923319500800000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('1394457782895455639961600000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('99604127349675402854400000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('6640275156645026856960000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('415017197290314178560000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('24412776311194951680000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('1356265350621941760000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('71382386874839040000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('3569119343741952000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('169958063987712000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('7725366544896000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('335885501952000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('13995229248000')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('559809169920')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('21531121920')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('797448960')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('28480320')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('982080')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('32736')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('1056')))
    res = JSBI.multiply(res, JSBI.multiply(xi, JSBI.BigInt('33')))
    res = JSBI.multiply(res, xi)

    return JSBI.add(JSBI.add(JSBI.divide(res, JSBI.BigInt('8683317618811886495518194401280000000')), _x), JSBI.leftShift(ONE, JSBI.BigInt(_precision)))
    // divide by 33! and then add x^1 / 1! + x^0 / 0!
}

/**
    * @dev the global "maxExpArray" is sorted in descending order, and therefore the following statements are equivalent:
    * - This function finds the position of [the smallest value in "maxExpArray" larger than or equal to "x"]
    * - This function finds the highest position of [a value in "maxExpArray" larger than or equal to "x"]
    */
export function findPositionInMaxExpArray(_x: JSBI): number {
    let lo = MIN_PRECISION;
    let hi = MAX_PRECISION;

    while (lo + 1 < hi) {
        let mid = (lo + hi) / 2;
        if (JSBI.greaterThanOrEqual(maxExpArray[mid], _x)) lo = mid;
        else hi = mid;
    }

    if (JSBI.greaterThanOrEqual(maxExpArray[hi], _x)) return hi;
    if (JSBI.greaterThanOrEqual(maxExpArray[lo], _x)) return lo;

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
    amountIn: JSBI,
    reserveIn: JSBI,
    reserveOut: JSBI,
    tokenWeightIn: JSBI,
    tokenWeightOut: JSBI,
    swapFee: JSBI
): JSBI {
    // validate input
    invariant(JSBI.GT(amountIn, ZERO), "RequiemFormula: INSUFFICIENT_INPUT_AMOUNT");
    invariant(JSBI.GT(reserveIn, ZERO) && JSBI.GT(reserveOut, ZERO), "RequiemFormula: INSUFFICIENT_LIQUIDITY");
    const amountInWithFee = JSBI.multiply(amountIn, JSBI.subtract(TENK, swapFee))
    // special case for equal weights
    if (JSBI.EQ(tokenWeightIn, tokenWeightOut)) {
        return JSBI.divide(JSBI.multiply(reserveOut, amountInWithFee), JSBI.add(JSBI.multiply(reserveIn, TENK), amountInWithFee));
    }

    // let result;
    // let precision: number;
    const baseN: JSBI = JSBI.add(JSBI.multiply(reserveIn, TENK), amountInWithFee)
    console.log("BN", baseN.toString())
    const [result, precision] = power(baseN, JSBI.multiply(reserveIn, TENK), tokenWeightIn, tokenWeightOut);
    console.log("result", result.toString(),"preciosion", precision)
    console.log("comps", JSBI.divide(baseN, JSBI.multiply(reserveIn, TENK)).toString(), JSBI.divide(tokenWeightIn, tokenWeightOut).toString())
    console.log("alt", JSBI.exponentiate(JSBI.divide(baseN, JSBI.multiply(reserveIn, TENK)), JSBI.divide(tokenWeightIn, tokenWeightOut)).toString())
    const temp1 = JSBI.multiply(reserveOut, result);
    const temp2 = JSBI.leftShift(reserveOut, JSBI.BigInt(precision));
    //const temp2 = JSBI.multiply(reserveOut, JSBI.exponentiate(TWO,JSBI.BigInt(precision)));
    console.log("temps", temp1.toString(), temp2.toString())
    return JSBI.divide(JSBI.subtract(temp1, temp2), result)
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
export function getAmountOutRaw(
    amountIn: JSBI,
    reserveIn: JSBI,
    reserveOut: JSBI,
    tokenWeightIn: JSBI,
    tokenWeightOut: JSBI,
    swapFee: JSBI
) {
    // validate input
    invariant(JSBI.GT(amountIn, 0), "RequiemFormula: INSUFFICIENT_INPUT_AMOUNT");
    invariant(JSBI.GT(reserveIn, 0) && JSBI.GT(reserveOut, 0), "RequiemFormula: INSUFFICIENT_LIQUIDITY");

    const amountInWithFee = JSBI.multiply(amountIn, JSBI.subtract(TENK, swapFee));
    console.log(tokenWeightIn.toString(), tokenWeightOut.toString(), tokenWeightIn == tokenWeightOut)
    // // special case for equal weights
    if (JSBI.EQ(tokenWeightIn, tokenWeightOut)) {
        return JSBI.divide(JSBI.multiply(reserveOut, amountInWithFee), JSBI.add(JSBI.multiply(reserveIn, TENK), amountInWithFee));
    }
    console.log("EXP", JSBI.exponentiate(
        JSBI.subtract(
            ONE,
            JSBI.divide(
                JSBI.multiply(
                    reserveIn,
                    TENK
                ),
                JSBI.add(
                    JSBI.multiply(
                        reserveIn,
                        TENK
                    ),
                    amountInWithFee
                )
            )
        ),
        JSBI.divide(tokenWeightIn, tokenWeightOut)
    ).toString())
    console.log("RO", reserveOut.toString())
    // return = reserveOut * (1 - (reserveIn * 10000 / (reserveIn * 10000 + amountIn * (10000 - swapFee))) ^ (tokenWeightIn / tokenWeightOut))
    return JSBI.multiply(
        reserveOut,
        JSBI.exponentiate(
            JSBI.subtract(
                ONE,
                JSBI.divide(
                    JSBI.multiply(
                        reserveIn,
                        TENK
                    ),
                    JSBI.add(
                        JSBI.multiply(
                            reserveIn,
                            TENK
                        ),
                        amountInWithFee
                    )
                )
            ),
            JSBI.divide(tokenWeightIn, tokenWeightOut)
        )
    )
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
    amountOut: JSBI,
    reserveIn: JSBI,
    reserveOut: JSBI,
    tokenWeightIn: JSBI,
    tokenWeightOut: JSBI,
    swapFee: JSBI
) {
    // validate input
    invariant(JSBI.GT(amountOut, 0), "RequiemFormula: INSUFFICIENT_OUTPUT_AMOUNT");
    invariant(JSBI.GT(reserveIn, 0) && JSBI.GT(reserveOut, 0), "RequiemFormula: INSUFFICIENT_LIQUIDITY");
    // special case for equal weights
    if (JSBI.EQ(tokenWeightIn, tokenWeightOut)) {
        const numerator = JSBI.multiply(JSBI.multiply(reserveIn, amountOut), TENK);
        const denominator = JSBI.multiply(JSBI.multiply(reserveOut, amountOut), JSBI.subtract(TENK, swapFee));
        return JSBI.add(JSBI.divide(numerator, denominator), ONE);
    }
    // return = reserveIn * ( (reserveOut / (reserveOut - amountOut)) ^ (tokenWeightOut / tokenWeightIn) - 1) * (10000/ (10000 - swapFee)
    return JSBI.multiply(
        JSBI.multiply(
            reserveIn,
            JSBI.subtract(
                JSBI.exponentiate(
                    JSBI.divide(
                        reserveOut,
                        JSBI.subtract(
                            reserveOut,
                            amountOut
                        )
                    ),
                    JSBI.divide(
                        tokenWeightOut,
                        tokenWeightIn
                    )
                ),
                ONE
            )
        ),
        JSBI.divide(
            TENK,
            JSBI.subtract(
                TENK,
                swapFee
            )
        )
    )
}

