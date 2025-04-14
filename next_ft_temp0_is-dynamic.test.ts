import { isDynamicRoute } from './is-dynamic'

describe('isDynamicRoute', () => {
  it('should identify dynamic routes with strict mode', () => {
    expect(isDynamicRoute('/foo/[bar]')).toBe(true)
    expect(isDynamicRoute('/foo/[bar]/baz')).toBe(true)
    expect(isDynamicRoute('/foo/[bar]/baz/[qux]')).toBe(true)
    expect(isDynamicRoute('/foo/bar')).toBe(false)
    expect(isDynamicRoute('/foo/bar/baz')).toBe(false)
    expect(isDynamicRoute('/foo/bar/baz/qux')).toBe(false)
    expect(isDynamicRoute('/foo/[bar]baz')).toBe(false)
    expect(isDynamicRoute('/foo/bar[qux]')).toBe(false)
  })

  it('should identify dynamic routes without strict mode', () => {
    expect(isDynamicRoute('/foo/[bar]', false)).toBe(true)
    expect(isDynamicRoute('/foo/[bar]/baz', false)).toBe(true)
    expect(isDynamicRoute('/foo/[bar]/baz/[qux]', false)).toBe(true)
    expect(isDynamicRoute('/foo/bar', false)).toBe(false)
    expect(isDynamicRoute('/foo/bar/baz', false)).toBe(false)
    expect(isDynamicRoute('/foo/bar/baz/qux', false)).toBe(false)
    expect(isDynamicRoute('/foo/[bar]baz', false)).toBe(true)
    expect(isDynamicRoute('/foo/bar[qux]', false)).toBe(true)
  })

  it('should identify dynamic routes with interception routes', () => {
    expect(isDynamicRoute('/(blog)/(post)/[id]')).toBe(true)
    expect(isDynamicRoute('/(blog)/(post)/[id]/comments')).toBe(true)
    expect(isDynamicRoute('/(blog)/(post)/[id]/comments/[commentId]')).toBe(
      true
    )
    expect(isDynamicRoute('/(blog)/(post)/123')).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/123/comments')).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/123/comments/456')).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/[id]comments')).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/123[commentId]')).toBe(false)
  })

  it('should identify dynamic routes with interception routes without strict mode', () => {
    expect(isDynamicRoute('/(blog)/(post)/[id]', false)).toBe(true)
    expect(isDynamicRoute('/(blog)/(post)/[id]/comments', false)).toBe(true)
    expect(
      isDynamicRoute('/(blog)/(post)/[id]/comments/[commentId]', false)
    ).toBe(true)
    expect(isDynamicRoute('/(blog)/(post)/123', false)).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/123/comments', false)).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/123/comments/456', false)).toBe(false)
    expect(isDynamicRoute('/(blog)/(post)/[id]comments', false)).toBe(true)
    expect(isDynamicRoute('/(blog)/(post)/123[commentId]', false)).toBe(true)
  })
})