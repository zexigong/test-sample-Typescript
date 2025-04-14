import { describe, it, expect } from 'vitest'
import { clamp, reverse, boundedNumber, Bounded } from '../src/Bounded'
import * as Ord from '../src/Ord'

describe('Bounded', () => {
  describe('clamp', () => {
    it('should clamp a value within bounds', () => {
      const bounded: Bounded<number> = {
        ...Ord.ordNumber,
        top: 10,
        bottom: 1
      }
      const clampValue = clamp(bounded)
      expect(clampValue(0)).toBe(1)
      expect(clampValue(5)).toBe(5)
      expect(clampValue(11)).toBe(10)
    })
  })

  describe('reverse', () => {
    it('should reverse the order and swap top and bottom', () => {
      const bounded: Bounded<number> = {
        ...Ord.ordNumber,
        top: 10,
        bottom: 1
      }
      const reversed = reverse(bounded)
      expect(reversed.top).toBe(1)
      expect(reversed.bottom).toBe(10)
      expect(reversed.compare(1, 2)).toBe(1)
      expect(reversed.compare(2, 1)).toBe(-1)
      expect(reversed.compare(2, 2)).toBe(0)
    })
  })

  describe('boundedNumber', () => {
    it('should have correct properties for boundedNumber', () => {
      expect(boundedNumber.top).toBe(Infinity)
      expect(boundedNumber.bottom).toBe(-Infinity)
      expect(boundedNumber.compare(1, 2)).toBe(-1)
      expect(boundedNumber.compare(2, 1)).toBe(1)
      expect(boundedNumber.compare(2, 2)).toBe(0)
    })
  })
})