import {expectType} from 'tsd';
import type {DistributedOmit} from '../source/distributed-omit';

type A = {
	discriminant: 'A';
	foo: string;
	a: number;
};

type B = {
	discriminant: 'B';
	foo: string;
	bar: string;
	b: string;
};

type C = {
	discriminant: 'C';
	bar: string;
	c: boolean;
};

type Union = A | B | C;

type OmittedUnionFooBar = DistributedOmit<Union, 'foo' | 'bar'>;

declare const omittedUnionFooBar: OmittedUnionFooBar;

if (omittedUnionFooBar.discriminant === 'A') {
	expectType<{ discriminant: 'A'; a: number }>(omittedUnionFooBar);

	// These should error, as 'foo' and 'bar' are omitted
	// omittedUnionFooBar.foo;
	// omittedUnionFooBar.bar;
}

if (omittedUnionFooBar.discriminant === 'B') {
	expectType<{ discriminant: 'B'; b: string }>(omittedUnionFooBar);

	// These should error, as 'foo' and 'bar' are omitted
	// omittedUnionFooBar.foo;
	// omittedUnionFooBar.bar;
}

if (omittedUnionFooBar.discriminant === 'C') {
	expectType<{ discriminant: 'C'; c: boolean }>(omittedUnionFooBar);

	// This should error, as 'bar' is omitted
	// omittedUnionFooBar.bar;
}

type OmittedUnionFoo = DistributedOmit<Union, 'foo'>;

declare const omittedUnionFoo: OmittedUnionFoo;

if (omittedUnionFoo.discriminant === 'A') {
	expectType<{ discriminant: 'A'; a: number }>(omittedUnionFoo);

	// This should error, as 'foo' is omitted
	// omittedUnionFoo.foo;
}

if (omittedUnionFoo.discriminant === 'B') {
	expectType<{ discriminant: 'B'; bar: string; b: string }>(omittedUnionFoo);

	// This should error, as 'foo' is omitted
	// omittedUnionFoo.foo;
}

if (omittedUnionFoo.discriminant === 'C') {
	expectType<{ discriminant: 'C'; bar: string; c: boolean }>(omittedUnionFoo);
}