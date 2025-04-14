import type {Equal, Expect} from '@type-challenges/utils';
import type {DistributedOmit} from '../source/distributed-omit';
import type {KeysOfUnion} from '../source/keys-of-union';

declare const expect: <T>(value: T) => void;

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

type OmittedUnion = DistributedOmit<Union, 'foo' | 'bar'>;

declare const omittedUnion: OmittedUnion;

if (omittedUnion.discriminant === 'A') {
	expect(omittedUnion.a);

	expect(omittedUnion.foo);
	expect(omittedUnion.bar);
}

if (omittedUnion.discriminant === 'B') {
	expect(omittedUnion.b);

	expect(omittedUnion.foo);
	expect(omittedUnion.bar);
}

if (omittedUnion.discriminant === 'C') {
	expect(omittedUnion.c);

	expect(omittedUnion.foo);
	expect(omittedUnion.bar);
}

type tests = [
	Expect<Equal<KeysOfUnion<OmittedUnion>, 'discriminant' | 'a' | 'b' | 'c'>>,
];