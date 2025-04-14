import {expectType, expectAssignable} from 'tsd';
import {AsyncReturnType} from '../source/async-return-type';

declare function asyncFunction(): Promise<number>;
expectType<AsyncReturnType<typeof asyncFunction>>(1);

declare function asyncFunctionOrNot(): Promise<number> | number;
expectType<AsyncReturnType<typeof asyncFunctionOrNot>>(1);

const asyncFunction2 = async () => '🦄';
expectType<AsyncReturnType<typeof asyncFunction2>>('🦄');

const asyncFunction3 = async () => Promise.resolve(false);
expectType<AsyncReturnType<typeof asyncFunction3>>(false);

declare function asyncFunction4(): Promise<Promise<number>>;
expectType<AsyncReturnType<typeof asyncFunction4>>(1);

declare function asyncFunction5(): Promise<number[]> | number[];
expectType<AsyncReturnType<typeof asyncFunction5>>([1, 2, 3]);

declare function asyncFunction6(): Promise<1 | 2 | 3> | 1 | 2 | 3;
expectType<AsyncReturnType<typeof asyncFunction6>>(1);

declare function asyncFunction7(): Promise<never>;
expectType<AsyncReturnType<typeof asyncFunction7>>(undefined);

async function asyncFunction8() {
	return {x: 1, y: '2', z: true};
}

expectType<AsyncReturnType<typeof asyncFunction8>>({
	x: 1,
	y: '2',
	z: true,
});

async function asyncFunction9() {
	return {x: 1, y: '2', z: true} as const;
}

expectAssignable<AsyncReturnType<typeof asyncFunction9>>({
	x: 1,
	y: '2',
	z: true,
});

type AsyncFunction = () => Promise<number>;

declare const someAsyncFunction: AsyncFunction;
expectType<AsyncReturnType<typeof someAsyncFunction>>(1);