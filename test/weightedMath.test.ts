import { BigNumber } from 'ethers'
import { _getAPrecise, _xp, _distance, _getD, _sumOf, _getY } from '../src/entities/calculators/stableCalc'


import { pow, exp, ln, _ln_36, _ln, ONE_18 } from '../src'
describe('Math', () => {
    jest.setTimeout(30000);
    let p: BigNumber
    describe('test exp, ln and pow', () => {
        it('calculus test', async () => {
            let x = BigNumber.from('32103214321210321')
            let y = BigNumber.from('32132113232')
            let e = exp(y)
            let l = ln(y)
            let _l = _ln(y)
            let l_36 = _ln_36(y)
            console.log("EXP", e.toString())
            expect(e.toString()).toEqual('1000000032132113748')
            // expected 1000000032132113748

            console.log("LN", l.toString())
            expect(l.toString()).toEqual('-17253409894677404263')
            // expected -17253409894677404263

            console.log("_LN", _l.toString())
            expect(_l.toString()).toEqual('-17253409894677404263')
            // expected -17253409894677404263

            console.log("LN_36", l_36.toString())
            expect(l_36.toString()).toEqual('-4043599815373484489794481730896987840')
            // expected 0

            p = pow(x, y)
            console.log("POWER", p.toString())
            expect(p.toString()).toEqual('999999889504123424')
            // expected: 999999889504123424

            x = BigNumber.from('32103214321210321')

            y = BigNumber.from('32345678911234567')

            e = exp(y)
            l = ln(y)
            console.log("EXP", e.toString())
            expect(e.toString()).toEqual('1032874486529068580')

            e = exp(l.mul(x).div(ONE_18))
            console.log("EXP", e.toString(), l.mul(x).div(ONE_18).toString())
            expect(e.toString()).toEqual('895695335131913996')

            console.log("LN", l.toString())
            expect(l.toString()).toEqual('-3431274840025387511')
            _l = _ln(y)
            console.log("_LN", _l.toString())
            expect(_l.toString()).toEqual('-3431274840025387511')


            p = pow(x, y)
            console.log("POWER", p.toString())
            expect(p.toString()).toEqual('894732675288791033')

            x = BigNumber.from('32103214321210321')

            y = BigNumber.from('932345678911234567')

            p = pow(x, y)
            console.log("POWER", p.toString())
            expect(p.toString()).toEqual('40512305987936668')

            // y = BigNumber.from('-100000000')

            // l = _ln(y)
            // console.log("_LN", l.toString())

        }
        )

    })
})
