import type {FindGlobalType, FindGlobalInstanceType} from '../source/find-global-type';
import {expectType} from 'tsd';

declare global {
	interface GlobalInterface {}
	var GlobalInterface: new () => GlobalInterface;
}

expectType<FindGlobalType<'GlobalInterface'>>(GlobalInterface);

class Point {
	constructor(public x: number, public y: number) {}
}

expectType<FindGlobalInstanceType<'Point'>>(Point);