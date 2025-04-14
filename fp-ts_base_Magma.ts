import { describe, it, expect } from 'vitest'
import { Magma } from '../src/Magma'
import { reverse, filterFirst, filterSecond, endo, concatAll } from '../src/Magma'

// A simple numeric Magma for testing
const numericMagma: Magma<number> = {
  concat: (x, y) => x + y
}

describe('Magma', () => {
  describe('reverse', () => {
    it('should reverse the arguments of concat', () => {
      const reversedMagma = reverse(numericMagma)
      expect(reversedMagma.concat(1, 2)).toBe(3) // 2 + 1
    })
  })

  describe('filterFirst', () => {
    it('should apply concat only if the first argument satisfies the predicate', () => {
      const isEven = (n: number) => n % 2 === 0
      const filteredMagma = filterFirst(isEven)(numericMagma)

      expect(filteredMagma.concat(2, 3)).toBe(5) // 2 + 3
      expect(filteredMagma.concat(1, 3)).toBe(3) // 1 doesn't satisfy, return second
    })
  })

  describe('filterSecond', () => {
    it('should apply concat only if the second argument satisfies the predicate', () => {
      const isEven = (n: number) => n % 2 === 0
      const filteredMagma = filterSecond(isEven)(numericMagma)

      expect(filteredMagma.concat(3, 2)).toBe(5) // 3 + 2
      expect(filteredMagma.concat(3, 1)).toBe(3) // 1 doesn't satisfy, return first
    })
  })

  describe('endo', () => {
    it('should apply an endomorphism before concatenation', () => {
      const addOne = (n: number) => n + 1
      const endoMagma = endo(addOne)(numericMagma)

      expect(endoMagma.concat(1, 2)).toBe(5) // (1 + 1) + (2 + 1) = 5
    })
  })

  describe('concatAll', () => {
    it('should concatenate all elements in the array starting with the initial value', () => {
      const sumAll = concatAll(numericMagma)(0)
      expect(sumAll([1, 2, 3, 4])).toBe(10)
    })

    it('should return the initial value for an empty array', () => {
      const sumAll = concatAll(numericMagma)(0)
      expect(sumAll([])).toBe(0)
    })
  })
})