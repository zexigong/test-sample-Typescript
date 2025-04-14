import {expectType} from 'tsd';
import type {EmptyObject, IsEmptyObject} from '../source/empty-object';

// Test for EmptyObject type
declare const emptyObject: EmptyObject;
expectType<EmptyObject>({});
// @ts-expect-error
expectType<EmptyObject>(42);
// @ts-expect-error
expectType<EmptyObject>([]);
// @ts-expect-error
expectType<EmptyObject>({a: 1});

// Test for IsEmptyObject type
expectType<IsEmptyObject<{}>>(true);
expectType<IsEmptyObject<[]>>(false);
expectType<IsEmptyObject<null>>(false);
expectType<IsEmptyObject<{a: 1}>>(false);
expectType<IsEmptyObject<EmptyObject>>(true);