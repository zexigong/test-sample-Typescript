import { isDynamicRoute } from './is-dynamic';
import { extractInterceptionRouteInformation, isInterceptionRouteAppPath } from './interception-routes';

jest.mock('./interception-routes', () => ({
  extractInterceptionRouteInformation: jest.fn(),
  isInterceptionRouteAppPath: jest.fn(),
}));

describe('isDynamicRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for dynamic route with strict mode', () => {
    const route = '/user/[id]';
    expect(isDynamicRoute(route)).toBe(true);
  });

  it('should return false for non-dynamic route with strict mode', () => {
    const route = '/user/id';
    expect(isDynamicRoute(route)).toBe(false);
  });

  it('should return true for dynamic route without strict mode', () => {
    const route = '/user/[id]/details';
    expect(isDynamicRoute(route, false)).toBe(true);
  });

  it('should return false for non-dynamic route without strict mode', () => {
    const route = '/user/id/details';
    expect(isDynamicRoute(route, false)).toBe(false);
  });

  it('should extract interception route information when route is an interception route', () => {
    const route = '/blog/(..)/post/[id]';
    const interceptedRoute = '/post/[id]';
    (isInterceptionRouteAppPath as jest.Mock).mockReturnValue(true);
    (extractInterceptionRouteInformation as jest.Mock).mockReturnValue({
      interceptedRoute,
    });

    expect(isDynamicRoute(route)).toBe(true);
    expect(isInterceptionRouteAppPath).toHaveBeenCalledWith(route);
    expect(extractInterceptionRouteInformation).toHaveBeenCalledWith(route);
  });

  it('should handle non-interception route correctly', () => {
    const route = '/blog/post/[id]';
    (isInterceptionRouteAppPath as jest.Mock).mockReturnValue(false);

    expect(isDynamicRoute(route)).toBe(true);
    expect(isInterceptionRouteAppPath).toHaveBeenCalledWith(route);
    expect(extractInterceptionRouteInformation).not.toHaveBeenCalled();
  });

  it('should return false for interception route that becomes non-dynamic after extraction', () => {
    const route = '/blog/(..)/post/id';
    const interceptedRoute = '/post/id';
    (isInterceptionRouteAppPath as jest.Mock).mockReturnValue(true);
    (extractInterceptionRouteInformation as jest.Mock).mockReturnValue({
      interceptedRoute,
    });

    expect(isDynamicRoute(route)).toBe(false);
  });
});