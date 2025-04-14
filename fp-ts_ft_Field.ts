import * as _ from '../src/Field'
import * as N from '../src/number'
import * as U from './util'
import * as E from '../src/Eq'
import * as R from '../src/Ring'

describe('Field', () => {
  it('gcd', () => {
    const gcd = _.gcd(N.Eq, N.Field)
    U.deepStrictEqual(gcd(0, 0), 0)
    U.deepStrictEqual(gcd(0, 1), 1)
    U.deepStrictEqual(gcd(1, 1), 1)
    U.deepStrictEqual(gcd(1, 2), 1)
    U.deepStrictEqual(gcd(2, 3), 1)
    U.deepStrictEqual(gcd(5, 10), 5)
    U.deepStrictEqual(gcd(10, 5), 5)
  })

  it('lcm', () => {
    const lcm = _.lcm(N.Eq, N.Field)
    U.deepStrictEqual(lcm(0, 0), 0)
    U.deepStrictEqual(lcm(1, 0), 0)
    U.deepStrictEqual(lcm(0, 1), 0)
    U.deepStrictEqual(lcm(1, 1), 1)
    U.deepStrictEqual(lcm(1, 2), 2)
    U.deepStrictEqual(lcm(2, 3), 6)
    U.deepStrictEqual(lcm(4, 6), 12)
  })

  it('fieldNumber', () => {
    const { degree, div, mod } = _.fieldNumber
    U.deepStrictEqual(degree(0), 1)
    U.deepStrictEqual(degree(1), 1)
    U.deepStrictEqual(div(1, 1), 1)
    U.deepStrictEqual(mod(1, 1), 0)
  })

  it('tuple', () => {
    const F = _.tuple(_.fieldNumber, _.fieldNumber)
    U.deepStrictEqual(F.add([1, 2], [3, 4]), [4, 6])
    U.deepStrictEqual(F.sub([1, 2], [3, 4]), [-2, -2])
    U.deepStrictEqual(F.mul([1, 2], [3, 4]), [3, 8])
    U.deepStrictEqual(F.div([1, 2], [3, 4]), [1 / 3, 2 / 4])
    U.deepStrictEqual(F.mod([1, 2], [3, 4]), [1 % 3, 2 % 4])
    U.deepStrictEqual(F.zero, [0, 0])
    U.deepStrictEqual(F.one, [1, 1])
    U.deepStrictEqual(F.degree([1, 1]), 1)
  })

  it('getTupleField', () => {
    const F = _.getTupleField(_.fieldNumber, _.fieldNumber)
    U.deepStrictEqual(F.add([1, 2], [3, 4]), [4, 6])
    U.deepStrictEqual(F.sub([1, 2], [3, 4]), [-2, -2])
    U.deepStrictEqual(F.mul([1, 2], [3, 4]), [3, 8])
    U.deepStrictEqual(F.div([1, 2], [3, 4]), [1 / 3, 2 / 4])
    U.deepStrictEqual(F.mod([1, 2], [3, 4]), [1 % 3, 2 % 4])
    U.deepStrictEqual(F.zero, [0, 0])
    U.deepStrictEqual(F.one, [1, 1])
    U.deepStrictEqual(F.degree([1, 1]), 1)
  })

  it('getFunctionField', () => {
    const F = _.getFunctionField<number, number>(_.fieldNumber)
    const f1 = (n: number): number => n + 1
    const f2 = (n: number): number => n * 2
    U.deepStrictEqual(F.add(f1, f2)(2), 7)
    U.deepStrictEqual(F.sub(f1, f2)(2), -3)
    U.deepStrictEqual(F.mul(f1, f2)(2), 6)
    U.deepStrictEqual(F.div(f1, f2)(2), 1.5)
    U.deepStrictEqual(F.mod(f1, f2)(2), 1)
    U.deepStrictEqual(F.zero(2), 0)
    U.deepStrictEqual(F.one(2), 1)
    U.deepStrictEqual(F.degree(f1)(1), 1)
  })
})