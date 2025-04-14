import { describe, it, expect } from 'vitest'
import * as J from '../src/Json'
import * as E from '../src/Either'
import { pipe } from '../src/function'

describe('Json', () => {
  describe('parse', () => {
    it('should parse a valid JSON string', () => {
      const jsonString = '{"a": 1}'
      const result = J.parse(jsonString)
      expect(result).toEqual(E.right({ a: 1 }))
    })

    it('should return an error for an invalid JSON string', () => {
      const jsonString = '{"a": }'
      const result = J.parse(jsonString)
      expect(E.isLeft(result)).toBe(true)
      expect(result).toEqual(E.left(new SyntaxError('Unexpected token } in JSON at position 5')))
    })
  })

  describe('stringify', () => {
    it('should stringify a valid JSON object', () => {
      const jsonObject = { a: 1 }
      const result = J.stringify(jsonObject)
      expect(result).toEqual(E.right('{"a":1}'))
    })

    it('should return an error for circular references', () => {
      const circular: any = { ref: null }
      circular.ref = circular
      const result = J.stringify(circular)
      expect(E.isLeft(result)).toBe(true)
      expect(E.match(
        (e) => e instanceof Error && e.message.includes('Converting circular structure to JSON'),
        () => false
      )(result)).toBe(true)
    })
  })
})