import { splitCookiesString } from 'next/dist/server/web/utils'

describe('splitCookiesString', () => {
  it('should handle a single cookie', () => {
    const cookie = 'cookie1=value1; Path=/; Domain=example.com'
    expect(splitCookiesString(cookie)).toEqual([cookie])
  })

  it('should handle multiple cookies', () => {
    const cookies =
      'cookie1=value1; Path=/; Domain=example.com, cookie2=value2; Path=/; Domain=example.com'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=value1; Path=/; Domain=example.com',
      'cookie2=value2; Path=/; Domain=example.com',
    ])
  })

  it('should handle cookies with commas inside', () => {
    const cookies =
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC, cookie2=value2; Path=/; Domain=example.com'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
      'cookie2=value2; Path=/; Domain=example.com',
    ])
  })

  it('should handle cookies with equals inside', () => {
    const cookies =
      'cookie1=val=ue1; Path=/; Domain=example.com, cookie2=value2; Path=/; Domain=example.com'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=val=ue1; Path=/; Domain=example.com',
      'cookie2=value2; Path=/; Domain=example.com',
    ])
  })

  it('should handle cookies with multiple commas inside', () => {
    const cookies =
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC, cookie2=value2; Expires=Thu, 18 Dec 2013 12:00:00 UTC'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
      'cookie2=value2; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
    ])
  })

  it('should handle empty cookies', () => {
    const cookies = ', cookie1=value1; Path=/; Domain=example.com'
    expect(splitCookiesString(cookies)).toEqual([
      '',
      'cookie1=value1; Path=/; Domain=example.com',
    ])
  })

  it('should handle multiple cookies with commas inside', () => {
    const cookies =
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC, cookie2=value2; Expires=Thu, 18 Dec 2013 12:00:00 UTC, cookie3=value3; Expires=Thu, 18 Dec 2013 12:00:00 UTC, cookie4=value4; Expires=Thu, 18 Dec 2013 12:00:00 UTC'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
      'cookie2=value2; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
      'cookie3=value3; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
      'cookie4=value4; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
    ])
  })

  it('should handle cookies with equals signs inside', () => {
    const cookies =
      'cookie1=val=ue1; Path=/; Domain=example.com, cookie2=value2; Path=/; Domain=example.com'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=val=ue1; Path=/; Domain=example.com',
      'cookie2=value2; Path=/; Domain=example.com',
    ])
  })

  it('should handle cookies with commas inside and equals signs inside', () => {
    const cookies =
      'cookie1=val=ue1; Expires=Thu, 18 Dec 2013 12:00:00 UTC, cookie2=value2; Expires=Thu, 18 Dec 2013 12:00:00 UTC'
    expect(splitCookiesString(cookies)).toEqual([
      'cookie1=val=ue1; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
      'cookie2=value2; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
    ])
  })

  it('should handle empty cookies and cookies with commas inside', () => {
    const cookies = ', cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC'
    expect(splitCookiesString(cookies)).toEqual([
      '',
      'cookie1=value1; Expires=Thu, 18 Dec 2013 12:00:00 UTC',
    ])
  })
})