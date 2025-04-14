import {expectType} from 'tsd';
import type {FindGlobalType, FindGlobalInstanceType} from '../source/find-global-type.d.ts';

declare global {
	var bar: string; // var works
	interface Bar {}
	var Bar: new () => Bar; // Interface + constructor style works
}

// Test FindGlobalType
expectType<FindGlobalType<'bar'>>(String);
expectType<FindGlobalType<'foo'>>(never);
expectType<FindGlobalType<'other'>>(never);

// Test FindGlobalInstanceType
expectType<FindGlobalInstanceType<'Bar'>>(Bar);
expectType<FindGlobalInstanceType<'Foo'>>(never);