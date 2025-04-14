import { expectType } from 'tsd';
import type { CamelCase } from '../source/camel-case';

// Simple cases
expectType<CamelCase<'foo-bar'>>('fooBar');
expectType<CamelCase<'foo-BAR-baz', { preserveConsecutiveUppercase: true }>>('fooBARBaz');
expectType<CamelCase<'foo_BAR_baz', { preserveConsecutiveUppercase: false }>>('fooBarBaz');

// Advanced cases
type CamelCasedProperties<T> = {
  [K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
  'dry-run': boolean;
  'full_family_name': string;
  foo: number;
  BAR: string;
  QUZ_QUX: number;
  'OTHER-FIELD': boolean;
}

const dbResult: CamelCasedProperties<RawOptions> = {
  dryRun: true,
  fullFamilyName: 'bar.js',
  foo: 123,
  bar: 'foo',
  quzQux: 6,
  otherField: false
};

expectType<boolean>(dbResult.dryRun);
expectType<string>(dbResult.fullFamilyName);
expectType<number>(dbResult.foo);
expectType<string>(dbResult.bar);
expectType<number>(dbResult.quzQux);
expectType<boolean>(dbResult.otherField);

// Test with edge cases
expectType<CamelCase<'ABCD-EFG', { preserveConsecutiveUppercase: true }>>('abcdEFG');
expectType<CamelCase<'ABCD-EFG', { preserveConsecutiveUppercase: false }>>('abcdEfg');
expectType<CamelCase<'123-abc', { preserveConsecutiveUppercase: false }>>('123Abc');