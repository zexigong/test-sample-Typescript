import type { SchedulerFn } from './scheduler'

import { Batcher } from './batcher'

describe('Batcher', () => {
  it('can create a batcher', () => {
    expect(Batcher.create()).toBeInstanceOf(Batcher)
  })

  it('can create a batcher with a cache key function', () => {
    const cacheKeyFn = jest.fn((key) => key.toString())
    const batcher = Batcher.create({
      cacheKeyFn,
    })

    expect(batcher).toBeInstanceOf(Batcher)
    expect(batcher.batch('1', () => Promise.resolve('1'))).resolves.toBe('1')
    expect(cacheKeyFn).toHaveBeenCalledWith('1')
  })

  it('can create a batcher with a scheduler function', () => {
    const schedulerFn = jest.fn((fn) => fn())
    const batcher = Batcher.create({
      schedulerFn,
    })

    expect(batcher).toBeInstanceOf(Batcher)
    expect(batcher.batch('1', () => Promise.resolve('1'))).resolves.toBe('1')
    expect(schedulerFn).toHaveBeenCalled()
  })

  it('can batch a function', async () => {
    const batcher = Batcher.create<string, string>()

    const fn = jest.fn(async (key: string) => key)

    const result = await batcher.batch('1', fn)

    expect(result).toBe('1')
    expect(fn).toHaveBeenCalledWith('1', expect.any(Function))
  })

  it('can batch a function with a cache key', async () => {
    const batcher = Batcher.create({
      cacheKeyFn: (key: string) => key.toString(),
    })

    const fn = jest.fn(async (key: string) => key)

    const result = await batcher.batch('1', fn)

    expect(result).toBe('1')
    expect(fn).toHaveBeenCalledWith('1', expect.any(Function))
  })

  it('can batch a function with a scheduler function', async () => {
    const schedulerFn = jest.fn((fn) => fn())
    const batcher = Batcher.create({
      schedulerFn,
    })

    const fn = jest.fn(async (key: string) => key)

    const result = await batcher.batch('1', fn)

    expect(result).toBe('1')
    expect(fn).toHaveBeenCalledWith('1', expect.any(Function))
    expect(schedulerFn).toHaveBeenCalled()
  })

  it('can batch a function with a cache key and a scheduler function', async () => {
    const schedulerFn = jest.fn((fn) => fn())
    const batcher = Batcher.create({
      cacheKeyFn: (key: string) => key.toString(),
      schedulerFn,
    })

    const fn = jest.fn(async (key: string) => key)

    const result = await batcher.batch('1', fn)

    expect(result).toBe('1')
    expect(fn).toHaveBeenCalledWith('1', expect.any(Function))
    expect(schedulerFn).toHaveBeenCalled()
  })

  it('can batch a function with a null cache key', async () => {
    const batcher = Batcher.create({
      cacheKeyFn: () => Promise.resolve(null),
    })

    const fn = jest.fn(async (key: string) => key)

    const result = await batcher.batch('1', fn)

    expect(result).toBe('1')
    expect(fn).toHaveBeenCalledWith(null, expect.any(Function))
  })

  it('throws an error when the cache key function throws an error', async () => {
    const batcher = Batcher.create({
      cacheKeyFn: () => {
        throw new Error('test')
      },
    })

    const fn = jest.fn(async (key: string) => key)

    await expect(batcher.batch('1', fn)).rejects.toThrow('test')
    expect(fn).not.toHaveBeenCalled()
  })

  it('throws an error when the cache key function returns a rejected promise', async () => {
    const batcher = Batcher.create({
      cacheKeyFn: () => Promise.reject(new Error('test')),
    })

    const fn = jest.fn(async (key: string) => key)

    await expect(batcher.batch('1', fn)).rejects.toThrow('test')
    expect(fn).not.toHaveBeenCalled()
  })

  it('throws an error when the function throws an error', async () => {
    const batcher = Batcher.create<string, string>()

    const fn = jest.fn(async () => {
      throw new Error('test')
    })

    await expect(batcher.batch('1', fn)).rejects.toThrow('test')
    expect(fn).toHaveBeenCalledWith('1', expect.any(Function))
  })
})