import {expectType} from 'tsd';
import type {CamelCase} from '../source/camel-case';
import type {Split} from '../source/split';

declare function camelCaseFromArray<Words extends readonly string[]>(
	words: Words,
	options?: {preserveConsecutiveUppercase?: boolean}
): CamelCase<Split<Words, ' '>>;

expectType<'fooBar'>(camelCaseFromArray(['foo', 'bar']));

expectType<'fooBARBaz'>(camelCaseFromArray(['foo', 'BAR', 'baz'], {preserveConsecutiveUppercase: true}));

expectType<'fooBarBaz'>(camelCaseFromArray(['foo', 'BAR', 'baz'], {preserveConsecutiveUppercase: false}));

expectType<'fooBar'>(camelCaseFromArray(['foo', 'bar'], {preserveConsecutiveUppercase: true}));

expectType<'fooBar'>(camelCaseFromArray(['foo', 'bar'], {preserveConsecutiveUppercase: false}));

expectType<'fooBar'>(camelCaseFromArray(['foo', 'bar'], {}));

expectType<'foo'>(camelCaseFromArray(['foo']));