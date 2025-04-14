import {expectType} from 'tsd';
import type {AsyncReturnType} from '../index';

declare function asyncFunction(): Promise<string>;
declare function asyncFunctionWithUnion(): Promise<string | number>;
declare function asyncFunctionWithVoid(): Promise<void>;
declare function asyncFunctionWithUndefined(): Promise<undefined>;
declare function asyncFunctionWithNull(): Promise<null>;
declare function asyncFunctionWithNever(): Promise<never>;
declare function asyncFunctionWithUnknown(): Promise<unknown>;
declare function asyncFunctionWithAny(): Promise<any>;

expectType<AsyncReturnType<typeof asyncFunction>>(await asyncFunction());
expectType<AsyncReturnType<typeof asyncFunctionWithUnion>>(await asyncFunctionWithUnion());
expectType<AsyncReturnType<typeof asyncFunctionWithVoid>>(await asyncFunctionWithVoid());
expectType<AsyncReturnType<typeof asyncFunctionWithUndefined>>(await asyncFunctionWithUndefined());
expectType<AsyncReturnType<typeof asyncFunctionWithNull>>(await asyncFunctionWithNull());
expectType<AsyncReturnType<typeof asyncFunctionWithNever>>(await asyncFunctionWithNever());
expectType<AsyncReturnType<typeof asyncFunctionWithUnknown>>(await asyncFunctionWithUnknown());
expectType<AsyncReturnType<typeof asyncFunctionWithAny>>(await asyncFunctionWithAny());