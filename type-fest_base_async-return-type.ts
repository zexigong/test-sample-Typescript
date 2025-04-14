import type {AsyncReturnType} from '../source/async-return-type';
import {expectType} from 'tsd';

// Sample async functions for testing
async function getString(): Promise<string> {
	return 'hello';
}

async function getNumber(): Promise<number> {
	return 42;
}

async function getBoolean(): Promise<boolean> {
	return true;
}

async function getObject(): Promise<{foo: string}> {
	return {foo: 'bar'};
}

async function getArray(): Promise<number[]> {
	return [1, 2, 3];
}

// Tests for AsyncReturnType
expectType<AsyncReturnType<typeof getString>>('hello');
expectType<AsyncReturnType<typeof getNumber>>(42);
expectType<AsyncReturnType<typeof getBoolean>>(true);
expectType<AsyncReturnType<typeof getObject>>({foo: 'bar'});
expectType<AsyncReturnType<typeof getArray>>([1, 2, 3]);

// Test with a function that returns a PromiseLike
function getPromiseLikeString(): PromiseLike<string> {
	return {
		then(onFulfilled) {
			onFulfilled('hello');
			return this;
		}
	};
}

expectType<AsyncReturnType<typeof getPromiseLikeString>>('hello');