import { describe, it, expect } from 'vitest'
import { gcd, lcm, Field, fieldNumber } from '../src/Field'
import { Eq, fromEquals } from '../src/Eq'

// Sample Eq instance for numbers
const eqNumber: Eq<number> = fromEquals((x, y) => x === y)

describe('Field', () => {
  describe('gcd', () => {
    it('should return the greatest common divisor of two numbers', () => {
      const gcdNumber = gcd(eqNumber, fieldNumber)
      expect(gcdNumber(8, 12)).toBe(4)
      expect(gcdNumber(54, 24)).toBe(6)
      expect(gcdNumber(7, 5)).toBe(1)
    })

    it('should return the first number if the second is zero', () => {
      const gcdNumber = gcd(eqNumber, fieldNumber)
      expect(gcdNumber(8, 0)).toBe(8)
    })

    it('should return the second number if the first is zero', () => {
      const gcdNumber = gcd(eqNumber, fieldNumber)
      expect(gcdNumber(0, 12)).toBe(12)
    })
  })

  describe('lcm', () => {
    it('should return the least common multiple of two numbers', () => {
      const lcmNumber = lcm(eqNumber, fieldNumber)
      expect(lcmNumber(4, 5)).toBe(20)
      expect(lcmNumber(7, 3)).toBe(21)
      expect(lcmNumber(21, 6)).toBe(42)
    })

    it('should return zero if either number is zero', () => {
      const lcmNumber = lcm(eqNumber, fieldNumber)
      expect(lcmNumber(0, 5)).toBe(0)
      expect(lcmNumber(7, 0)).toBe(0)
    })
  })
})