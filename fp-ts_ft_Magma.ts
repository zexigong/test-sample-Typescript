import * as assert from 'assert'
import * as _ from '../src/Magma'
import { Predicate } from '../src/Predicate'

//-------------------------------------------------------------------------------------
// combinators
//-------------------------------------------------------------------------------------

describe.concurrent('Magma', () => {
  it('reverse', () => {
    const M: _.Magma<number> = { concat: (first, second) => first - second }
    const reverseM = _.reverse(M)
    assert.deepStrictEqual(M.concat(1, 2), -1)
    assert.deepStrictEqual(reverseM.concat(1, 2), 1)
  })

  it('filterFirst', () => {
    const M: _.Magma<number> = { concat: (first, second) => first + second }
    const isPositive: Predicate<number> = (n) => n > 0
    const filterFirstM = _.filterFirst(isPositive)(M)
    assert.deepStrictEqual(filterFirstM.concat(1, 2), 3)
    assert.deepStrictEqual(filterFirstM.concat(-1, 2), 2)
  })

  it('filterSecond', () => {
    const M: _.Magma<number> = { concat: (first, second) => first + second }
    const isPositive: Predicate<number> = (n) => n > 0
    const filterSecondM = _.filterSecond(isPositive)(M)
    assert.deepStrictEqual(filterSecondM.concat(1, 2), 3)
    assert.deepStrictEqual(filterSecondM.concat(1, -2), 1)
  })

  it('endo', () => {
    const M: _.Magma<number> = { concat: (first, second) => first + second }
    const endoM = _.endo((n: number) => n * 2)(M)
    assert.deepStrictEqual(endoM.concat(1, 2), 6)
  })

  it('concatAll', () => {
    const M: _.Magma<number> = { concat: (first, second) => first + second }
    const concatAllM = _.concatAll(M)(0)
    assert.deepStrictEqual(concatAllM([1, 2, 3]), 6)
    assert.deepStrictEqual(concatAllM([]), 0)
  })
})