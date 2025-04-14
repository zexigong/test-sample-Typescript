import { flatMap, map } from '../src/IO'
import { newIORef } from '../src/IORef'
import * as U from './util'
import * as fc from 'fast-check'

describe.concurrent('IORef', () => {
  it('read', () => {
    return fc.assert(
      fc.property(fc.integer(), (a) => {
        const ref = newIORef(a)()
        U.deepStrictEqual(ref.read(), a)
      })
    )
  })

  it('write', () => {
    return fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const ref = newIORef(a)()
        ref.write(b)()
        U.deepStrictEqual(ref.read(), b)
      })
    )
  })

  it('modify', () => {
    return fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const ref = newIORef(a)()
        ref.modify(U.always(b))()
        U.deepStrictEqual(ref.read(), b)
      })
    )
  })

  it('example', () => {
    U.deepStrictEqual(
      flatMap(newIORef(1), (ref) =>
        flatMap(ref.write(2), () => ref.read)
      )(),
      2
    )
  })

  it('IORef is not an instance of Functor', () => {
    // $ExpectError
    map((n: number) => n * 2)(newIORef(1)())
  })
})