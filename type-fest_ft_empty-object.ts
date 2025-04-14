import {expectType} from 'tsd';
import type {EmptyObject, IsEmptyObject} from '../source/empty-object.js';

// EmptyObject

expectType<EmptyObject>({});
// @ts-expect-error
expectType<EmptyObject>([]);
// @ts-expect-error
expectType<EmptyObject>(42);
// @ts-expect-error
expectType<EmptyObject>({a: 1});

// IsEmptyObject

expectType<IsEmptyObject<{}>>(true);
expectType<IsEmptyObject<object>>(false);
expectType<IsEmptyObject<unknown>>(false);
expectType<IsEmptyObject<never>>(false);
expectType<IsEmptyObject<null>>(false);
expectType<IsEmptyObject<undefined>>(false);
expectType<IsEmptyObject<[]>>(false);
expectType<IsEmptyObject<{a: number}>>(false);