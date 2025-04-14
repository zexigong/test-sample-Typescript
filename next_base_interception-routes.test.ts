import { normalizeAppPath, normalizeRscURL } from './app-paths';

describe('normalizeAppPath', () => {
  it('should normalize routes by removing group segments and "page"/"route" suffix', () => {
    expect(normalizeAppPath('/(dashboard)/user/[id]/page')).toBe('/user/[id]');
    expect(normalizeAppPath('/(dashboard)/account/page')).toBe('/account');
    expect(normalizeAppPath('/user/[id]/page')).toBe('/user/[id]');
    expect(normalizeAppPath('/account/page')).toBe('/account');
    expect(normalizeAppPath('/page')).toBe('/');
    expect(normalizeAppPath('/(dashboard)/user/[id]/route')).toBe('/user/[id]');
    expect(normalizeAppPath('/(dashboard)/account/route')).toBe('/account');
    expect(normalizeAppPath('/user/[id]/route')).toBe('/user/[id]');
    expect(normalizeAppPath('/account/route')).toBe('/account');
    expect(normalizeAppPath('/route')).toBe('/');
    expect(normalizeAppPath('/')).toBe('/');
  });

  it('should ignore empty segments and parallel segments', () => {
    expect(normalizeAppPath('//user//[id]//page')).toBe('/user/[id]');
    expect(normalizeAppPath('/@parallel/user/[id]/page')).toBe('/user/[id]');
  });

  it('should ensure the path starts with a leading slash', () => {
    expect(normalizeAppPath('user/[id]/page')).toBe('/user/[id]');
  });
});

describe('normalizeRscURL', () => {
  it('should remove the .rsc extension from URLs', () => {
    expect(normalizeRscURL('/path/to/resource.rsc')).toBe('/path/to/resource');
    expect(normalizeRscURL('/path/to/resource.rsc?query=123')).toBe('/path/to/resource?query=123');
  });

  it('should not alter URLs without the .rsc extension', () => {
    expect(normalizeRscURL('/path/to/resource')).toBe('/path/to/resource');
    expect(normalizeRscURL('/path/to/resource?query=123')).toBe('/path/to/resource?query=123');
  });
});