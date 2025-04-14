import {expectType} from 'tsd';
import type {MergeExclusive} from '../source/merge-exclusive';

interface ExclusiveVariation1 {
	exclusive1: boolean;
}

interface ExclusiveVariation2 {
	exclusive2: string;
}

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

// Valid cases
expectType<ExclusiveOptions>({exclusive1: true});
expectType<ExclusiveOptions>({exclusive2: 'hi'});

// Invalid cases
// @ts-expect-error
expectType<ExclusiveOptions>({exclusive1: true, exclusive2: 'hi'});

// Additional test cases
interface VariantA {
	a: number;
}

interface VariantB {
	b: number;
}

type TestOptions = MergeExclusive<VariantA, VariantB>;

// Valid cases
expectType<TestOptions>({a: 42});
expectType<TestOptions>({b: 24});

// Invalid cases
// @ts-expect-error
expectType<TestOptions>({a: 42, b: 24});

// Test with empty objects
interface EmptyA {}
interface NonEmptyB {
	key: string;
}

type EmptyTestOptions = MergeExclusive<EmptyA, NonEmptyB>;

// Valid cases
expectType<EmptyTestOptions>({key: 'value'});

// Invalid cases
// @ts-expect-error
expectType<EmptyTestOptions>({});