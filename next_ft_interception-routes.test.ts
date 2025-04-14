import { addInterceptionRouteMarkers, extractInterceptionRouteInformation } from './interception-routes'

describe('addInterceptionRouteMarkers', () => {
  it('should add interception route markers correctly', () => {
    expect(addInterceptionRouteMarkers('/users/:id')).toBe('/users/:id')
    expect(addInterceptionRouteMarkers('(/users/:id)').toEqual('(/users/:id)')
  })
})

describe('extractInterceptionRouteInformation', () => {
  it('should extract interception route information correctly', () => {
    expect(
      extractInterceptionRouteInformation('/users/:id', '/users/:id')
    ).toEqual({
      currentRoute: '/users/:id',
      interceptingRoute: '/users/:id',
      relativeRoute: '',
    })
  })
})