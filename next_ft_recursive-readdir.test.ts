```javascript
// test/unit/recursive-readdir.test.ts

import fs from 'fs/promises'
import path from 'path'
import { recursiveReadDir } from 'next/src/lib/recursive-readdir'

jest.mock('fs/promises')

describe('recursiveReadDir', () => {
  const mockFs: jest.Mocked<typeof fs> = fs as any

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should read all files in a directory recursively', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'file2.txt', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory)

    expect(result).toEqual(files.map((file) => path.join('/root', file)))
  })

  it('should apply ignorePartFilter correctly', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'file2.txt', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      ignorePartFilter: (name) => name === 'file2.txt',
    })

    expect(result).toEqual([path.join('/root', 'file1.txt'), path.join('/root', 'file3.txt')])
  })

  it('should apply ignoreFilter correctly', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'file2.txt', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      ignoreFilter: (pathname) => pathname.includes('file2.txt'),
    })

    expect(result).toEqual([path.join('/root', 'file1.txt'), path.join('/root', 'file3.txt')])
  })

  it('should apply pathnameFilter correctly', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'file2.txt', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      pathnameFilter: (pathname) => pathname.includes('file2.txt'),
    })

    expect(result).toEqual([path.join('/root', 'file2.txt')])
  })

  it('should return relative pathnames if relativePathnames is true', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'file2.txt', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      relativePathnames: true,
    })

    expect(result).toEqual(files)
  })

  it('should return absolute pathnames if relativePathnames is false', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'file2.txt', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      relativePathnames: false,
    })

    expect(result).toEqual(files.map((file) => path.join('/root', file)))
  })

  it('should sort the results if sortPathnames is true', async () => {
    const rootDirectory = '/root'
    const files = ['file2.txt', 'file3.txt', 'file1.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      sortPathnames: true,
    })

    expect(result).toEqual(files.sort().map((file) => path.join('/root', file)))
  })

  it('should not sort the results if sortPathnames is false', async () => {
    const rootDirectory = '/root'
    const files = ['file2.txt', 'file3.txt', 'file1.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) => ({ name: file, isDirectory: () => false }))
    )

    const result = await recursiveReadDir(rootDirectory, {
      sortPathnames: false,
    })

    expect(result).toEqual(files.map((file) => path.join('/root', file)))
  })

  it('should handle symbolic links correctly', async () => {
    const rootDirectory = '/root'
    const files = ['file1.txt', 'link', 'file3.txt']

    mockFs.readdir.mockResolvedValueOnce(
      files.map((file) =>
        file === 'link'
          ? { name: file, isDirectory: () => false, isSymbolicLink: () => true }
          : { name: file, isDirectory: () => false }
      )
    )

    mockFs.stat.mockResolvedValueOnce({ isDirectory: () => false })

    const result = await recursiveReadDir(rootDirectory)

    expect(result).toEqual(files.map((file) => path.join('/root', file)))
  })

  it('should throw an error if the root directory is removed', async () => {
    const rootDirectory = '/root'

    mockFs.readdir.mockRejectedValueOnce({ code: 'ENOENT' })

    await expect(recursiveReadDir(rootDirectory)).rejects.toThrow()
  })
})