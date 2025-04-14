import type {IsNull} from '../source/is-null';
import {expectType} from 'tsd';

declare const isNull: IsNull<null>;
expectType<true>(isNull);

declare const isNotNull: IsNull<number>;
expectType<false>(isNotNull);