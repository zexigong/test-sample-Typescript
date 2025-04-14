import * as _ from '../src/BooleanAlgebra'
import * as B from '../src/boolean'
import * as N from '../src/number'
import * as S from '../src/string'
import { pipe } from '../src/function'
import * as U from './util'

describe('BooleanAlgebra', () => {
  it('reverse', () => {
    const B1 = _.reverse(B.BooleanAlgebra)
    U.deepStrictEqual(B1.implies(true, true), true)
    U.deepStrictEqual(B1.implies(true, false), false)
    U.deepStrictEqual(B1.implies(false, true), true)
    U.deepStrictEqual(B1.implies(false, false), true)
    U.deepStrictEqual(B1.not(true), false)
    U.deepStrictEqual(B1.not(false), true)
    U.deepStrictEqual(B1.join(true, true), true)
    U.deepStrictEqual(B1.join(true, false), false)
    U.deepStrictEqual(B1.join(false, true), false)
    U.deepStrictEqual(B1.join(false, false), false)
    U.deepStrictEqual(B1.meet(true, true), true)
    U.deepStrictEqual(B1.meet(true, false), true)
    U.deepStrictEqual(B1.meet(false, true), true)
    U.deepStrictEqual(B1.meet(false, false), false)
    U.deepStrictEqual(B1.zero, true)
    U.deepStrictEqual(B1.one, false)

    const B2 = _.reverse(B1)
    U.deepStrictEqual(B2, B.BooleanAlgebra)
  })

  it('getFunctionBooleanAlgebra', () => {
    const B1 = pipe(N.BooleanAlgebra, _.getFunctionBooleanAlgebra<boolean>())
    U.deepStrictEqual(B1.implies(() => 1, () => 2)(true), 0)
    U.deepStrictEqual(B1.implies(() => 1, () => 2)(false), 1)
    U.deepStrictEqual(B1.not(() => 1)(true), 0)
    U.deepStrictEqual(B1.not(() => 1)(false), 0)
    U.deepStrictEqual(B1.join(() => 1, () => 2)(true), 1)
    U.deepStrictEqual(B1.join(() => 1, () => 2)(false), 2)
    U.deepStrictEqual(B1.meet(() => 1, () => 2)(true), 2)
    U.deepStrictEqual(B1.meet(() => 1, () => 2)(false), 1)
    U.deepStrictEqual(B1.zero(true), 0)
    U.deepStrictEqual(B1.zero(false), 0)
    U.deepStrictEqual(B1.one(true), 1)
    U.deepStrictEqual(B1.one(false), 1)

    const B2 = pipe(S.BooleanAlgebra, _.getFunctionBooleanAlgebra<number>())
    U.deepStrictEqual(B2.implies(() => 'a', () => 'b')(1), 'b')
    U.deepStrictEqual(B2.implies(() => 'a', () => 'b')(2), 'a')
    U.deepStrictEqual(B2.not(() => 'a')(1), '')
    U.deepStrictEqual(B2.not(() => 'a')(2), '')
    U.deepStrictEqual(B2.join(() => 'a', () => 'b')(1), 'b')
    U.deepStrictEqual(B2.join(() => 'a', () => 'b')(2), 'a')
    U.deepStrictEqual(B2.meet(() => 'a', () => 'b')(1), 'a')
    U.deepStrictEqual(B2.meet(() => 'a', () => 'b')(2), 'b')
    U.deepStrictEqual(B2.zero(1), '')
    U.deepStrictEqual(B2.zero(2), '')
    U.deepStrictEqual(B2.one(1), 'a')
    U.deepStrictEqual(B2.one(2), 'a')
  })

  it('getDualBooleanAlgebra', () => {
    U.deepStrictEqual(_.getDualBooleanAlgebra, _.reverse)
  })
})