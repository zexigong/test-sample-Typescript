import * as _ from '../src/Random'
import * as fc from 'fast-check'
import { pipe } from '../src/function'

describe('Random', () => {
  it('random', () => {
    fc.assert(fc.property(fc.integer(), () => _.random() >= 0 && _.random() < 1))
  })

  it('randomBool', () => {
    fc.assert(fc.property(fc.integer(), () => typeof _.randomBool() === 'boolean'))
  })

  it('randomInt', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const low = Math.min(a, b)
        const high = Math.max(a, b)
        const x = pipe(_.randomInt(low, high), (i) => i())
        return x >= low && x <= high
      })
    )
  })

  it('randomRange', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const min = Math.min(a, b)
        const max = Math.max(a, b)
        const x = pipe(_.randomRange(min, max), (i) => i())
        return x >= min && x < max
      })
    )
  })

  it('randomElem', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (as) => {
        const x = pipe(_.randomElem(as), (i) => i())
        return as.indexOf(x) !== -1
      })
    )
  })
})