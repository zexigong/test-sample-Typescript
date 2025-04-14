import {expectType} from 'tsd';
import type {ReadonlyKeysOf} from '../source/readonly-keys-of';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

interface Product {
	readonly name: string;
	price: number;
	readonly description: string;
}

type ReadonlyUserKeys = ReadonlyKeysOf<User>;
type ReadonlyProductKeys = ReadonlyKeysOf<Product>;

declare const readonlyUserKeys: ReadonlyUserKeys;
declare const readonlyProductKeys: ReadonlyProductKeys;

// Test case for User interface
expectType<'id'>(readonlyUserKeys);

// Test case for Product interface
expectType<'name' | 'description'>(readonlyProductKeys);