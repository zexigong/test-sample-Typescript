import { describe, it, expect } from 'vitest'
import { reverse, booleanAlgebraVoid, booleanAlgebraBoolean, getFunctionBooleanAlgebra } from '../src/BooleanAlgebra'

// Helper function to create a test BooleanAlgebra instance
const testBooleanAlgebra = {
  meet: (x: boolean, y: boolean) => x && y,
  join: (x: boolean, y: boolean) => x || y,
  zero: false,
  one: true,
  implies: (x: boolean, y: boolean) => !x || y,
  not: (x: boolean) => !x
}

describe('BooleanAlgebra', () => {
  describe('reverse', () => {
    it('should reverse the operations', () => {
      const reversed = reverse(testBooleanAlgebra)
      expect(reversed.meet(true, false)).toBe(true) // join in original
      expect(reversed.join(true, false)).toBe(false) // meet in original
      expect(reversed.zero).toBe(true) // one in original
      expect(reversed.one).toBe(false) // zero in original
      expect(reversed.implies(true, false)).toBe(false) // join(not(x), y) in original
      expect(reversed.not(true)).toBe(false)
    })
  })

  describe('booleanAlgebraVoid', () => {
    it('should return undefined for all operations', () => {
      expect(booleanAlgebraVoid.meet()).toBeUndefined()
      expect(booleanAlgebraVoid.join()).toBeUndefined()
      expect(booleanAlgebraVoid.zero).toBeUndefined()
      expect(booleanAlgebraVoid.one).toBeUndefined()
      expect(booleanAlgebraVoid.implies()).toBeUndefined()
      expect(booleanAlgebraVoid.not()).toBeUndefined()
    })
  })

  describe('booleanAlgebraBoolean', () => {
    it('should perform boolean operations correctly', () => {
      expect(booleanAlgebraBoolean.meet(true, false)).toBe(false)
      expect(booleanAlgebraBoolean.join(true, false)).toBe(true)
      expect(booleanAlgebraBoolean.zero).toBe(false)
      expect(booleanAlgebraBoolean.one).toBe(true)
      expect(booleanAlgebraBoolean.implies(true, false)).toBe(false)
      expect(booleanAlgebraBoolean.not(true)).toBe(false)
    })
  })

  describe('getFunctionBooleanAlgebra', () => {
    it('should create a BooleanAlgebra for functions', () => {
      const booleanAlgebraFunction = getFunctionBooleanAlgebra(testBooleanAlgebra)<number>()
      const f1 = (n: number) => n > 0
      const f2 = (n: number) => n < 10

      expect(booleanAlgebraFunction.meet(f1, f2)(5)).toBe(true)
      expect(booleanAlgebraFunction.join(f1, f2)(5)).toBe(true)
      expect(booleanAlgebraFunction.zero()).toBe(false)
      expect(booleanAlgebraFunction.one()).toBe(true)
      expect(booleanAlgebraFunction.implies(f1, f2)(5)).toBe(true)
      expect(booleanAlgebraFunction.not(f1)(5)).toBe(false)
    })
  })
})