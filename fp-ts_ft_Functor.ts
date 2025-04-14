import * as assert from 'assert'
import { Functor, bindTo, flap, map } from '../src/Functor'
import { identity } from '../src/function'
import { IO, io } from '../src/IO'
import { monoidString } from '../src/Monoid'
import * as O from '../src/Option'
import * as RA from '../src/ReadonlyArray'
import * as R from '../src/Reader'
import { reader } from '../src/Reader'
import { semigroupString } from '../src/Semigroup'
import * as T from '../src/Task'
import * as E from '../src/Either'
import * as N from '../src/number'
import * as _ from '../src/State'
import { pipe } from '../src/function'
import * as I from '../src/IO'
import * as T from '../src/Task'
import * as M from '../src/Monoid'
import * as S from '../src/Semigroup'
import * as A from '../src/Array'
import * as B from '../src/boolean'
import * as O from '../src/Option'
import * as E from '../src/Either'
import * as N from '../src/number'
import * as S from '../src/string'
import * as R from '../src/Reader'

describe('Functor', () => {
  describe('getFunctorComposition', () => {
    it('map', () => {
      const F = getFunctorComposition(RA.Functor, O.Functor)
      const double = (n: number) => n * 2
      assert.deepStrictEqual(F.map([], double), [])
      assert.deepStrictEqual(F.map([O.none], double), [O.none])
      assert.deepStrictEqual(F.map([O.some(1)], double), [O.some(2)])
    })

    it('mapCurried', () => {
      const F = getFunctorComposition(RA.Functor, O.Functor)
      const double = (n: number) => n * 2
      assert.deepStrictEqual(pipe([], F.map(double)), [])
      assert.deepStrictEqual(pipe([O.none], F.map(double)), [O.none])
      assert.deepStrictEqual(pipe([O.some(1)], F.map(double)), [O.some(2)])
    })
  })

  it('flap', () => {
    const f = (n: number) => n * 2
    const f1 = (s: string) => s.length
    const F = flap(RA.Functor)(f)
    assert.deepStrictEqual(F([1, 2, 3]), [2, 4, 6])

    const F1 = flap(RA.Functor)(f1)
    assert.deepStrictEqual(F1(['a', 'bb', 'ccc']), [1, 2, 3])
  })

  it('let', () => {
    const let_ = _.let
    const f = pipe(
      _.Do,
      _.bind('x', () => 1),
      _.bind('y', () => 2),
      let_('z', ({ x, y }) => x + y)
    )
    assert.deepStrictEqual(f({}), [3, {}])
  })

  it('map', () => {
    const F = map(RA.Functor, O.Functor)
    const double = (n: number) => n * 2
    assert.deepStrictEqual(pipe([], F(double)), [])
    assert.deepStrictEqual(pipe([O.none], F(double)), [O.none])
    assert.deepStrictEqual(pipe([O.some(1)], F(double)), [O.some(2)])
  })

  it('bindTo', () => {
    const F = bindTo(io)
    const f = F('a')
    assert.deepStrictEqual(f(() => 1)(), { a: 1 })
  })
})

describe('function', () => {
  it('flip', () => {
    const f = (a: number, b: string): string => a - b.length
    const g = flip(f)
    assert.deepStrictEqual(g('aaa')(2), -1)
  })

  it('flow', () => {
    const len = (s: string): number => s.length
    const double = (n: number): number => n * 2
    const f = flow(len, double)
    assert.deepStrictEqual(f('aaa'), 6)
  })

  it('tuple', () => {
    assert.deepStrictEqual(tuple(1, 'a'), [1, 'a'])
  })

  it('increment', () => {
    assert.deepStrictEqual(increment(2), 3)
  })

  it('decrement', () => {
    assert.deepStrictEqual(decrement(2), 1)
  })

  it('absurd', () => {
    assert.throws(() => absurd<string>(null as any))
  })

  it('tupled', () => {
    const add = tupled((x: number, y: number): number => x + y)
    assert.deepStrictEqual(add([1, 2]), 3)
  })

  it('untupled', () => {
    const add = untupled((a: Readonly<[number, number]>) => a[0] + a[1])
    assert.deepStrictEqual(add(1, 2), 3)
  })

  it('pipe', () => {
    const len = (s: string): number => s.length
    const double = (n: number): number => n * 2
    assert.deepStrictEqual(pipe('aaa', len, double), 6)
  })

  it('hole', () => {
    assert.throws(() => hole<string>())
  })

  it('SK', () => {
    const sk = SK(1, 'a')
    assert.deepStrictEqual(sk, 'a')
  })
})