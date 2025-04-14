import { describe, it, expect } from 'vitest';
import { Functor, Functor1, Functor2, Functor3, Functor4, map, flap, bindTo, let_ } from '../src/Functor';

// Mock Functor implementations
const arrayFunctor: Functor1<'Array'> = {
  URI: 'Array',
  map: (fa, f) => fa.map(f)
};

const optionFunctor: Functor2<'Option'> = {
  URI: 'Option',
  map: (fa, f) => (fa.type === 'Some' ? { type: 'Some', value: f(fa.value) } : fa)
};

describe('Functor', () => {
  describe('map', () => {
    it('should satisfy identity law', () => {
      const input = [1, 2, 3];
      const result = arrayFunctor.map(input, a => a);
      expect(result).toEqual(input);
    });

    it('should satisfy composition law', () => {
      const input = [1, 2, 3];
      const f = (a: number) => a + 1;
      const g = (a: number) => a * 2;
      const map1 = arrayFunctor.map(arrayFunctor.map(input, f), g);
      const map2 = arrayFunctor.map(input, a => g(f(a)));
      expect(map1).toEqual(map2);
    });
  });

  describe('map composition', () => {
    it('should compose functors', () => {
      const nestedArray = [[1, 2], [3, 4]];
      const composedMap = map(arrayFunctor, arrayFunctor);
      const result = composedMap((x: number) => x + 1)(nestedArray);
      expect(result).toEqual([[2, 3], [4, 5]]);
    });
  });

  describe('flap', () => {
    it('should apply a value to a function in a functor', () => {
      const fab = [(a: number) => a + 1];
      const flapArray = flap(arrayFunctor);
      const result = flapArray(5)(fab);
      expect(result).toEqual([6]);
    });
  });

  describe('bindTo', () => {
    it('should bind a value to an object with a given key', () => {
      const fa = [1, 2, 3];
      const binded = bindTo(arrayFunctor)('key')(fa);
      expect(binded).toEqual([{ key: 1 }, { key: 2 }, { key: 3 }]);
    });
  });

  describe('let_', () => {
    it('should let a value be added to the context', () => {
      const fa = [{ a: 1 }, { a: 2 }];
      const letFun = let_(arrayFunctor);
      const result = letFun('b', (x: { a: number }) => x.a + 1)(fa);
      expect(result).toEqual([{ a: 1, b: 2 }, { a: 2, b: 3 }]);
    });
  });
});