import * as U from './util'
import * as _ from '../src/Bounded'
import * as O from '../src/Ord'
import * as N from '../src/number'

describe('Bounded', () => {
  it('clamp', () => {
    const clamp = _.clamp(N.Bounded)
    U.deepStrictEqual(clamp(-1), 0)
    U.deepStrictEqual(clamp(0), 0)
    U.deepStrictEqual(clamp(1), 1)
    U.deepStrictEqual(clamp(2), 1)
  })

  it('reverse', () => {
    const B = _.reverse(N.Bounded)
    U.deepStrictEqual(B.compare(0, 1), 1)
    U.deepStrictEqual(B.compare(1, 0), -1)
    U.deepStrictEqual(B.compare(1, 1), 0)
    U.deepStrictEqual(B.top, -Infinity)
    U.deepStrictEqual(B.bottom, Infinity)
  })

  it('boundedNumber', () => {
    U.deepStrictEqual(_.boundedNumber, {
      equals: O.ordNumber.equals,
      compare: O.ordNumber.compare,
      top: Infinity,
      bottom: -Infinity
    })
  })
})