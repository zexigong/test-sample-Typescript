import { getInterceptionRouteFromAssetPath } from './interception-routes'

describe('getInterceptionRouteFromAssetPath', () => {
  it('should return the correct interception route for a given asset path', () => {
    const assetPath = '/_next/static/chunks/pages/_interception_/user/%5Bid%5D/page.js'
    const expectedRoute = '/user/[id]'
    const result = getInterceptionRouteFromAssetPath(assetPath)
    expect(result).toBe(expectedRoute)
  })

  it('should return null for a non-interception asset path', () => {
    const assetPath = '/_next/static/chunks/pages/user/%5Bid%5D/page.js'
    const result = getInterceptionRouteFromAssetPath(assetPath)
    expect(result).toBeNull()
  })

  it('should return null for an invalid asset path', () => {
    const assetPath = '/_next/static/chunks/pages/_interception_/user/%5Bid%5D.js'
    const result = getInterceptionRouteFromAssetPath(assetPath)
    expect(result).toBeNull()
  })

  it('should return null for an empty asset path', () => {
    const assetPath = ''
    const result = getInterceptionRouteFromAssetPath(assetPath)
    expect(result).toBeNull()
  })

  it('should return null for a non-string asset path', () => {
    const assetPath = null
    const result = getInterceptionRouteFromAssetPath(assetPath)
    expect(result).toBeNull()
  })
})