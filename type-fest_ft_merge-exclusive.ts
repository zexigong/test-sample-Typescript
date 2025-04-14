import {expectType} from 'tsd';
import {MergeExclusive} from '../source/merge-exclusive';

interface ExclusiveVariation1 {
	exclusive1: boolean;
}

interface ExclusiveVariation2 {
	exclusive2: string;
}

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

let exclusiveOptions: ExclusiveOptions;

expectType<ExclusiveOptions>(exclusiveOptions);

exclusiveOptions = {exclusive1: true};
exclusiveOptions = {exclusive2: 'hi'};
// @ts-expect-error
exclusiveOptions = {exclusive1: true, exclusive2: 'hi'};

declare const exclusiveOptions2: ExclusiveOptions;
if ('exclusive1' in exclusiveOptions2) {
	expectType<boolean>(exclusiveOptions2.exclusive1);
} else {
	expectType<string>(exclusiveOptions2.exclusive2);
}

type NonObject = MergeExclusive<boolean, string>;
expectType<boolean | string>(false as NonObject);