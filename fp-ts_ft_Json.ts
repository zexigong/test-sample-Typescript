import * as _ from '../src/Json'
import * as E from '../src/Either'
import * as U from './util'
import { pipe } from '../src/function'

describe('Json', () => {
  describe('parse', () => {
    it('should parse valid JSON', () => {
      U.deepStrictEqual(pipe('{"a":1}', _.parse), E.right({ a: 1 }))
    })

    it('should return a parse error on invalid JSON', () => {
      U.deepStrictEqual(
        pipe('{"a":}', _.parse),
        E.left(new SyntaxError(`Unexpected token '}', "{"a":}" is not valid JSON`))
      )
    })
  })

  describe('stringify', () => {
    it('should stringify valid JSON', () => {
      U.deepStrictEqual(_.stringify({ a: 1 }), E.right('{"a":1}'))
    })

    it('should return a stringify error on unsupported structure', () => {
      const circular: any = { ref: null }
      circular.ref = circular
      U.deepStrictEqual(
        pipe(
          _.stringify(circular),
          E.mapLeft((e) => e instanceof Error && e.message.includes('Converting circular structure to JSON'))
        ),
        E.left(true)
      )
    })
  })
})