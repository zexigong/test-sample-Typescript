import {expectType} from 'tsd';
import type {CamelCasedProperties} from '../source/camel-cased-properties';

interface User {
	UserId: number;
	UserName: string;
}

interface ApiResponse {
	'Response-Code': number;
	'Response-Message': string;
}

const camelCasedUser: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};

expectType<number>(camelCasedUser.userId);
expectType<string>(camelCasedUser.userName);

const camelCasedApiResponse: CamelCasedProperties<ApiResponse> = {
	responseCode: 200,
	responseMessage: 'Success',
};

expectType<number>(camelCasedApiResponse.responseCode);
expectType<string>(camelCasedApiResponse.responseMessage);

interface MixedCase {
	FOOBar: string;
	BazQUX: number;
}

const camelCasedMixed: CamelCasedProperties<MixedCase, {preserveConsecutiveUppercase: false}> = {
	fooBar: 'test',
	bazQux: 42,
};

expectType<string>(camelCasedMixed.fooBar);
expectType<number>(camelCasedMixed.bazQux);

interface FunctionProperties {
	doSomething: () => void;
}

const camelCasedFunction: CamelCasedProperties<FunctionProperties> = {
	doSomething: () => {},
};

expectType<() => void>(camelCasedFunction.doSomething);

const camelCasedArray: CamelCasedProperties<string[]> = ['hello', 'world'];
expectType<string[]>(camelCasedArray);