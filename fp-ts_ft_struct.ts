import * as _ from '../src/struct'
import * as S from '../src/string'
import * as N from '../src/number'
import * as B from '../src/boolean'
import * as U from './util'
import { pipe } from '../src/function'
import * as O from '../src/Option'
import * as E from '../src/Either'

describe.concurrent('struct', () => {
  it('getAssignSemigroup', () => {
    type T = {
      readonly a: string
      readonly b: number
    }
    const S1 = _.getAssignSemigroup<T>()
    U.deepStrictEqual(S1.concat({ a: 'a', b: 1 }, { a: 'b', b: 2 }), { a: 'b', b: 2 })
    U.deepStrictEqual(S1.concat({ a: 'a', b: 1 }, { a: 'b' }), { a: 'b', b: 1 })
    U.deepStrictEqual(S1.concat({ a: 'a' }, { a: 'b', b: 2 }), { a: 'b', b: 2 })
  })

  it('evolve', () => {
    U.deepStrictEqual(
      pipe(
        { a: 'a', b: 1 },
        _.evolve({
          a: (a) => a.length,
          b: (b) => b * 2
        })
      ),
      { a: 1, b: 2 }
    )
  })
})