import { Batcher } from './batcher';
import { DetachedPromise } from './detached-promise';

describe('Batcher', () => {
  it('should create a Batcher instance without options', () => {
    const batcher = Batcher.create<string, number>();
    expect(batcher).toBeInstanceOf(Batcher);
  });

  it('should create a Batcher instance with cacheKeyFn', () => {
    const cacheKeyFn = jest.fn((key: string) => key.toUpperCase());
    const batcher = Batcher.create<string, number>({
      cacheKeyFn,
    });
    expect(batcher).toBeInstanceOf(Batcher);
  });

  it('should batch function calls with the same key', async () => {
    const batcher = Batcher.create<string, number>();
    const workFn = jest.fn((key: string, resolve: (value: number) => void) => {
      resolve(42);
      return Promise.resolve(42);
    });

    const result1 = await batcher.batch('key1', workFn);
    const result2 = await batcher.batch('key1', workFn);

    expect(result1).toBe(42);
    expect(result2).toBe(42);
    expect(workFn).toHaveBeenCalledTimes(1);
  });

  it('should handle different keys separately', async () => {
    const batcher = Batcher.create<string, number>();
    const workFn = jest.fn((key: string, resolve: (value: number) => void) => {
      resolve(42);
      return Promise.resolve(42);
    });

    const result1 = await batcher.batch('key1', workFn);
    const result2 = await batcher.batch('key2', workFn);

    expect(result1).toBe(42);
    expect(result2).toBe(42);
    expect(workFn).toHaveBeenCalledTimes(2);
  });

  it('should use cacheKeyFn if provided', async () => {
    const cacheKeyFn = jest.fn((key: string) => key.toUpperCase());
    const batcher = Batcher.create<string, number>({ cacheKeyFn });
    const workFn = jest.fn((key: string, resolve: (value: number) => void) => {
      resolve(42);
      return Promise.resolve(42);
    });

    const result1 = await batcher.batch('key1', workFn);
    const result2 = await batcher.batch('KEY1', workFn);

    expect(result1).toBe(42);
    expect(result2).toBe(42);
    expect(workFn).toHaveBeenCalledTimes(1);
  });

  it('should handle promise rejection', async () => {
    const batcher = Batcher.create<string, number>();
    const workFn = jest.fn((key: string, resolve, reject) => {
      return Promise.reject(new Error('failure'));
    });

    await expect(batcher.batch('key1', workFn)).rejects.toThrow('failure');
    expect(workFn).toHaveBeenCalledTimes(1);
  });
});