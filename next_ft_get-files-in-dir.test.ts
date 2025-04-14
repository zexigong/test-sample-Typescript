import { join } from 'path'
import fs from 'fs/promises'
import { getFilesInDir } from 'next/dist/lib/get-files-in-dir'

jest.mock('fs/promises', () => ({
  opendir: jest.fn(),
  stat: jest.fn(),
}))

describe('getFilesInDir', () => {
  it('should return a set of files in a directory', async () => {
    const dirContent = [
      { name: 'file1.js', isFile: () => true, isSymbolicLink: () => false },
      { name: 'file2.js', isFile: () => true, isSymbolicLink: () => false },
      { name: 'file3.js', isFile: () => true, isSymbolicLink: () => true },
    ]
    const statResult = { isFile: () => true }

    ;(fs.opendir as jest.Mock).mockImplementation(() => ({
      [Symbol.asyncIterator]: function* () {
        for (const item of dirContent) {
          yield item
        }
      },
    }))

    ;(fs.stat as jest.Mock).mockReturnValue(statResult)

    const files = await getFilesInDir('/mock-path')
    expect(files).toEqual(new Set(['file1.js', 'file2.js', 'file3.js']))

    expect(fs.opendir).toHaveBeenCalledWith('/mock-path')
    expect(fs.stat).toHaveBeenCalledWith(join('/mock-path', 'file3.js'))
  })

  it('should return an empty set if no files are present in directory', async () => {
    ;(fs.opendir as jest.Mock).mockImplementation(() => ({
      [Symbol.asyncIterator]: function* () {},
    }))

    const files = await getFilesInDir('/mock-empty-path')
    expect(files).toEqual(new Set([]))
    expect(fs.opendir).toHaveBeenCalledWith('/mock-empty-path')
  })
})