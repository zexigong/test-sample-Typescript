import type {Expect, Equal} from '@type-challenges/utils';
import type {ReadonlyKeysOf} from '../source/readonly-keys-of';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

declare const test: {
	readonly a: number;
	readonly b: string;
	readonly c: string;
	d: boolean;
	e: boolean;
	f: boolean;
};

declare const writableTest: {
	a: number;
	b: string;
	c: string;
	d: boolean;
	e: boolean;
	f: boolean;
};

declare const readonlyTest: {
	readonly a: number;
	readonly b: string;
	readonly c: string;
	readonly d: boolean;
	readonly e: boolean;
	readonly f: boolean;
};

type cases = [
	Expect<Equal<ReadonlyKeysOf<User>, 'id'>>,

	Expect<Equal<ReadonlyKeysOf<typeof test>, 'a' | 'b' | 'c'>>,
	Expect<Equal<ReadonlyKeysOf<typeof writableTest>, never>>,
	Expect<Equal<ReadonlyKeysOf<typeof readonlyTest>, 'a' | 'b' | 'c' | 'd' | 'e' | 'f'>>
];