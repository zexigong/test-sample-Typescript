import type {CamelCasedProperties} from '../source/camel-cased-properties';
import type {Equal, Expect} from '@type-challenges/utils';

type Test = {
	foo_bar: string;
	bar_baz: {a: string; b: {c: string}};
};

type CamelCasedPropertiesTest = CamelCasedProperties<Test>;

type cases = [
	Expect<
		Equal<
			CamelCasedPropertiesTest,
			{
				fooBar: string;
				barBaz: {a: string; b: {c: string}};
			}
		>
	>,
	Expect<
		Equal<
			CamelCasedProperties<{fooBAR: string}, {preserveConsecutiveUppercase: false}>,
			{fooBar: string}
		>
	>,
];