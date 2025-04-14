import { describe, it, expect } from 'vitest'
import { IORef, newIORef } from '../src/IORef'
import { flatMap } from '../src/IO'

// Utility function to run IO monad
const runIO = <A>(io: () => A): A => io()

describe('IORef', () => {
  it('should create a new IORef with the initial value', () => {
    const refIO = newIORef(10)
    const ref = runIO(refIO)
    expect(runIO(ref.read)).toBe(10)
  })

  it('should write a new value to IORef', () => {
    const refIO = newIORef(10)
    const ref = runIO(refIO)
    runIO(ref.write(20))
    expect(runIO(ref.read)).toBe(20)
  })

  it('should modify the value using a function', () => {
    const refIO = newIORef(10)
    const ref = runIO(refIO)
    runIO(ref.modify((n) => n + 5))
    expect(runIO(ref.read)).toBe(15)
  })

  it('should chain operations using flatMap', () => {
    const result = flatMap(newIORef(1), (ref) =>
      flatMap(ref.write(2), () => ref.read)
    )()
    expect(result).toBe(2)
  })
})