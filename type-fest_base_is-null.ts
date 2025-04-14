import { expectType } from 'tsd';
import type { IsNull } from '../source/is-null';

// Test cases to verify that IsNull correctly identifies null types
expectType<IsNull<null>>(true);
expectType<IsNull<number>>(false);
expectType<IsNull<undefined>>(false);
expectType<IsNull<never>>(false);
expectType<IsNull<string | null>>(false);
expectType<IsNull<null | undefined>>(false);

// Additional test cases with complex types
expectType<IsNull<null | number>>(false);
expectType<IsNull<null | null>>(true);

// Edge cases
expectType<IsNull<any>>(false);
expectType<IsNull<unknown>>(false);