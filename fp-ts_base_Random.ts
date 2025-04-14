import { describe, it, expect } from 'vitest'
import { random, randomInt, randomRange, randomBool, randomElem } from '../src/Random'
import { ReadonlyNonEmptyArray } from '../src/ReadonlyNonEmptyArray'

describe('Random', () => {
  describe('random', () => {
    it('should return a number between 0 and 1', () => {
      const result = random()
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })
  })

  describe('randomInt', () => {
    it('should return an integer within the specified range', () => {
      const low = 5
      const high = 10
      const result = randomInt(low, high)()
      expect(Number.isInteger(result)).toBe(true)
      expect(result).toBeGreaterThanOrEqual(low)
      expect(result).toBeLessThanOrEqual(high)
    })

    it('should handle low equals high', () => {
      const low = 5
      const high = 5
      const result = randomInt(low, high)()
      expect(result).toBe(low)
    })
  })

  describe('randomRange', () => {
    it('should return a number within the specified range', () => {
      const min = 5
      const max = 10
      const result = randomRange(min, max)()
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThan(max)
    })
  })

  describe('randomBool', () => {
    it('should return a boolean', () => {
      const result = randomBool()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('randomElem', () => {
    it('should return a random element from a ReadonlyNonEmptyArray', () => {
      const array: ReadonlyNonEmptyArray<number> = [1, 2, 3, 4, 5]
      const result = randomElem(array)()
      expect(array.includes(result)).toBe(true)
    })
  })
})