import {expectType} from 'tsd';
import type {Includes} from '../source/includes';

type TestArray1 = ['red', 'green', 'blue'];
type TestArray2 = [1, 2, 3, 4];
type TestArray3 = ['apple', 'banana', 'orange'];
type TestArray4 = [true, false, true];
type TestArray5 = ['hello', 'world', 42];

// Test case: Item is included in the array
expectType<Includes<TestArray1, 'red'>>(true);
expectType<Includes<TestArray2, 1>>(true);
expectType<Includes<TestArray3, 'banana'>>(true);
expectType<Includes<TestArray4, false>>(true);

// Test case: Item is not included in the array
expectType<Includes<TestArray1, 'yellow'>>(false);
expectType<Includes<TestArray2, 5>>(false);
expectType<Includes<TestArray3, 'grape'>>(false);
expectType<Includes<TestArray5, true>>(false);

// Test case: Mixed types in the array
expectType<Includes<TestArray5, 42>>(true);
expectType<Includes<TestArray5, 'hello'>>(true);
expectType<Includes<TestArray5, 'world'>>(true);
expectType<Includes<TestArray5, 'not-in-array'>>(false);