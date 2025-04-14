import { getFilesInDir } from 'next/dist/lib/get-files-in-dir'
import { join } from 'path'
import fs from 'fs/promises'

jest.mock('fs/promises', () => ({
  opendir: jest.fn(),
  stat: jest.fn(),
}))

describe('getFilesInDir', () => {
  it('should return an empty set if the directory is empty', async () => {
    const mockDir = {
      [Symbol.asyncIterator]: function* () {
        yield* []
      },
    }
    ;(fs.opendir as jest.Mock).mockResolvedValue(mockDir)

    const result = await getFilesInDir('/empty-dir')
    expect(result).toEqual(new Set())
  })

  it('should return a set of file names in the directory', async () => {
    const mockDir = {
      [Symbol.asyncIterator]: function* () {
        yield { name: 'file1.txt', isFile: () => true, isSymbolicLink: () => false }
        yield { name: 'file2.txt', isFile: () => true, isSymbolicLink: () => false }
        yield { name: 'file3.txt', isFile: () => true, isSymbolicLink: () => false }
      },
    }
    ;(fs.opendir as jest.Mock).mockResolvedValue(mockDir)

    const result = await getFilesInDir('/dir-with-files')
    expect(result).toEqual(new Set(['file1.txt', 'file2.txt', 'file3.txt']))
  })

  it('should resolve symbolic links and return file names', async () => {
    const mockDir = {
      [Symbol.asyncIterator]: function* () {
        yield { name: 'link1', isFile: () => false, isSymbolicLink: () => true }
        yield { name: 'link2', isFile: () => false, isSymbolicLink: () => true }
      },
    }
    ;(fs.opendir as jest.Mock).mockResolvedValue(mockDir)
    ;(fs.stat as jest.Mock).mockImplementation((path) => {
      if (path === join('/dir-with-links', 'link1')) {
        return { isFile: () => true }
      }
      if (path === join('/dir-with-links', 'link2')) {
        return { isFile: () => false }
      }
    })

    const result = await getFilesInDir('/dir-with-links')
    expect(result).toEqual(new Set(['link1']))
  })
})