import { isDynamicRoute } from './is-dynamic'
import { extractInterceptionRouteInformation } from './interception-routes'

jest.mock('./interception-routes', () => {
  const originalModule = jest.requireActual('./interception-routes')
  return {
    ...originalModule,
    extractInterceptionRouteInformation: jest.fn(),
  }
})

describe('isDynamicRoute', () => {
  describe('strict mode', () => {
    it('should detect route with dynamic segment', () => {
      expect(isDynamicRoute('/apples/[id]')).toBe(true)
    })

    it('should not detect route with no dynamic segment', () => {
      expect(isDynamicRoute('/apples')).toBe(false)
    })

    it('should not detect route with optional dynamic segment', () => {
      expect(isDynamicRoute('/apples/[[...id]]')).toBe(false)
    })

    it('should not detect route with dynamic segment with prefix', () => {
      expect(isDynamicRoute('/apples/photo-[id]')).toBe(false)
    })

    it('should not detect route with dynamic segment with suffix', () => {
      expect(isDynamicRoute('/apples/[id]-photo')).toBe(false)
    })
  })

  describe('non-strict mode', () => {
    it('should detect route with dynamic segment', () => {
      expect(isDynamicRoute('/apples/[id]', false)).toBe(true)
    })

    it('should not detect route with no dynamic segment', () => {
      expect(isDynamicRoute('/apples', false)).toBe(false)
    })

    it('should not detect route with optional dynamic segment', () => {
      expect(isDynamicRoute('/apples/[[...id]]', false)).toBe(false)
    })

    it('should detect route with dynamic segment with prefix', () => {
      expect(isDynamicRoute('/apples/photo-[id]', false)).toBe(true)
    })

    it('should detect route with dynamic segment with suffix', () => {
      expect(isDynamicRoute('/apples/[id]-photo', false)).toBe(true)
    })

    it('should detect route with dynamic segment with prefix and suffix', () => {
      expect(isDynamicRoute('/apples/photo-[id]-photo', false)).toBe(true)
    })
  })

  describe('interception route', () => {
    const interceptedRoute = '/apples/[id]'
    beforeEach(() => {
      ;(
        extractInterceptionRouteInformation as jest.MockedFunction<
          typeof extractInterceptionRouteInformation
        >
      ).mockReturnValue({
        interceptedRoute,
        interceptingRoute: '/apples/(.)',
      })
    })
    it('should detect interception route', () => {
      expect(isDynamicRoute('/apples/(.)/(..)/[id]')).toBe(true)
      expect(extractInterceptionRouteInformation).toHaveBeenCalledWith(
        '/apples/(.)/(..)/[id]'
      )
    })
  })
})