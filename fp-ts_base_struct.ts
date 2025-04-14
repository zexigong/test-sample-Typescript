import { describe, it, expect } from 'vitest'
import { getAssignSemigroup, evolve } from '../src/struct'
import { Semigroup } from '../src/Semigroup'

describe('struct module', () => {
  describe('getAssignSemigroup', () => {
    interface Person {
      readonly name: string
      readonly age: number
    }

    const S: Semigroup<Person> = getAssignSemigroup<Person>()

    it('should concatenate two objects, with the second object overriding the first', () => {
      const person1 = { name: 'Alice', age: 30 }
      const person2 = { name: 'Bob', age: 25 }
      const result = S.concat(person1, person2)
      expect(result).toEqual({ name: 'Bob', age: 25 })
    })

    it('should return the same object if concatenated with an empty object', () => {
      const person = { name: 'Alice', age: 30 }
      const result = S.concat(person, {})
      expect(result).toEqual(person)
    })
  })

  describe('evolve', () => {
    it('should transform an object according to the provided transformations', () => {
      const obj = { a: 'hello', b: 2 }
      const transformations = {
        a: (a: string) => a.length,
        b: (b: number) => b * 10
      }
      const result = evolve(transformations)(obj)
      expect(result).toEqual({ a: 5, b: 20 })
    })

    it('should return an empty object if the input object is empty', () => {
      const obj = {}
      const transformations = {
        a: (a: any) => a,
        b: (b: any) => b
      }
      const result = evolve(transformations)(obj as any)
      expect(result).toEqual({})
    })

    it('should not transform properties not present in the transformations', () => {
      const obj = { a: 'hello', b: 2 }
      const transformations = {
        a: (a: string) => a.length
      }
      const result = evolve(transformations)(obj)
      expect(result).toEqual({ a: 5, b: 2 })
    })
  })
})