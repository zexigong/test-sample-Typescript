import { Batcher } from './batcher'

describe('Batcher', () => {
  it('should batch calls with the same key', async () => {
    const batcher = Batcher.create<string, number>()
    const fn = jest.fn(async (key: string, resolve: (value: number) => void) => {
      resolve(42)
      return 42
    })

    const result1 = batcher.batch('key', fn)
    const result2 = batcher.batch('key', fn)

    expect(await result1).toBe(42)
    expect(await result2).toBe(42)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not batch calls with different keys', async () => {
    const batcher = Batcher.create<string, number>()
    const fn = jest.fn(async (key: string, resolve: (value: number) => void) => {
      resolve(42)
      return 42
    })

    const result1 = batcher.batch('key1', fn)
    const result2 = batcher.batch('key2', fn)

    expect(await result1).toBe(42)
    expect(await result2).toBe(42)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle errors correctly', async () => {
    const batcher = Batcher.create<string, number>()
    const error = new Error('Test error')
    const fn = jest.fn(async (key: string, resolve: (value: number) => void) => {
      throw error
    })

    await expect(batcher.batch('key', fn)).rejects.toThrow(error)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should use cacheKeyFn if provided', async () => {
    const cacheKeyFn = jest.fn((key: { id: string }) => key.id)
    const batcher = Batcher.create<{ id: string }, number>({
      cacheKeyFn,
    })
    const fn = jest.fn(async (key: string, resolve: (value: number) => void) => {
      resolve(42)
      return 42
    })

    const result1 = batcher.batch({ id: 'key' }, fn)
    const result2 = batcher.batch({ id: 'key' }, fn)

    expect(await result1).toBe(42)
    expect(await result2).toBe(42)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(cacheKeyFn).toHaveBeenCalledTimes(2)
  })

  it('should use schedulerFn if provided', async () => {
    const schedulerFn = jest.fn((cb: () => void) => cb())
    const batcher = Batcher.create<string, number>({
      schedulerFn,
    })
    const fn = jest.fn(async (key: string, resolve: (value: number) => void) => {
      resolve(42)
      return 42
    })

    const result = batcher.batch('key', fn)

    expect(await result).toBe(42)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(schedulerFn).toHaveBeenCalledTimes(1)
  })
})