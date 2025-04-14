// test/unit/split-cookies-string.test.ts

import { splitCookiesString, fromNodeOutgoingHttpHeaders, toNodeOutgoingHttpHeaders, validateURL, normalizeNextQueryParam } from '../../packages/next/src/server/web/utils';

describe('splitCookiesString', () => {
  test('should split cookies string correctly', () => {
    const input = 'cookie1=value1, cookie2=value2; Path=/, cookie3=value3; Expires=Wed, 21 Oct 2025 07:28:00 GMT';
    const expectedOutput = [
      'cookie1=value1',
      'cookie2=value2; Path=/',
      'cookie3=value3; Expires=Wed, 21 Oct 2025 07:28:00 GMT'
    ];
    expect(splitCookiesString(input)).toEqual(expectedOutput);
  });

  test('should handle empty input', () => {
    const input = '';
    const expectedOutput: string[] = [];
    expect(splitCookiesString(input)).toEqual(expectedOutput);
  });

  test('should handle single cookie', () => {
    const input = 'cookie1=value1';
    const expectedOutput = ['cookie1=value1'];
    expect(splitCookiesString(input)).toEqual(expectedOutput);
  });
});

describe('fromNodeOutgoingHttpHeaders', () => {
  test('should convert Node.js headers to Headers object', () => {
    const input = {
      'content-type': 'application/json',
      'set-cookie': ['cookie1=value1', 'cookie2=value2']
    };
    const headers = fromNodeOutgoingHttpHeaders(input);
    expect(headers.get('content-type')).toBe('application/json');
    expect(headers.get('set-cookie')).toBe('cookie1=value1, cookie2=value2');
  });

  test('should ignore undefined header values', () => {
    const input = {
      'content-type': undefined,
      'content-length': 123
    };
    const headers = fromNodeOutgoingHttpHeaders(input);
    expect(headers.get('content-type')).toBeNull();
    expect(headers.get('content-length')).toBe('123');
  });
});

describe('toNodeOutgoingHttpHeaders', () => {
  test('should convert Headers object to Node.js headers', () => {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('set-cookie', 'cookie1=value1, cookie2=value2');
    const output = toNodeOutgoingHttpHeaders(headers);
    expect(output['content-type']).toBe('application/json');
    expect(output['set-cookie']).toEqual(['cookie1=value1', 'cookie2=value2']);
  });

  test('should handle empty Headers object', () => {
    const headers = new Headers();
    const output = toNodeOutgoingHttpHeaders(headers);
    expect(output).toEqual({});
  });
});

describe('validateURL', () => {
  test('should validate a correct URL', () => {
    const url = 'https://example.com';
    expect(validateURL(url)).toBe(url);
  });

  test('should throw error for malformed URL', () => {
    const url = 'htp://example.com';
    expect(() => validateURL(url)).toThrow('URL is malformed "htp://example.com". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls');
  });
});

describe('normalizeNextQueryParam', () => {
  test('should normalize a query param with prefix', () => {
    expect(normalizeNextQueryParam('nxtPtest')).toBe('test');
    expect(normalizeNextQueryParam('nxtIexample')).toBe('example');
  });

  test('should return null for non-prefixed keys', () => {
    expect(normalizeNextQueryParam('test')).toBeNull();
    expect(normalizeNextQueryParam('nxt')).toBeNull();
  });
});