import { promises } from 'fs'
import { join } from 'path'
import { recursiveDelete } from '../../../packages/next/src/lib/recursive-delete'

jest.mock('fs', () => ({
  promises: {
    rmdir: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
    readdir: jest.fn(() => Promise.resolve([])),
    readlink: jest.fn(() => Promise.resolve('')),
    stat: jest.fn(() => Promise.resolve({ isDirectory: () => false })),
  },
}))

describe('recursiveDelete', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should delete directory and its contents', async () => {
    const dir = '/path/to/dir'
    await recursiveDelete(dir)

    expect(promises.readdir).toHaveBeenCalledWith(dir, {
      withFileTypes: true,
    })
    expect(promises.rmdir).toHaveBeenCalledWith(dir)
  })

  it('should delete files in directory', async () => {
    const dir = '/path/to/dir'
    const files = [
      { name: 'file1.txt', isDirectory: () => false, isSymbolicLink: () => false },
      { name: 'file2.txt', isDirectory: () => false, isSymbolicLink: () => false },
    ]
    ;(promises.readdir as jest.Mock).mockResolvedValueOnce(files)

    await recursiveDelete(dir)

    expect(promises.unlink).toHaveBeenCalledWith(join(dir, 'file1.txt'))
    expect(promises.unlink).toHaveBeenCalledWith(join(dir, 'file2.txt'))
  })

  it('should delete directories in directory', async () => {
    const dir = '/path/to/dir'
    const dirs = [
      { name: 'subdir1', isDirectory: () => true, isSymbolicLink: () => false },
      { name: 'subdir2', isDirectory: () => true, isSymbolicLink: () => false },
    ]
    ;(promises.readdir as jest.Mock).mockResolvedValueOnce(dirs)

    await recursiveDelete(dir)

    expect(promises.rmdir).toHaveBeenCalledWith(join(dir, 'subdir1'))
    expect(promises.rmdir).toHaveBeenCalledWith(join(dir, 'subdir2'))
  })

  it('should handle symbolic links', async () => {
    const dir = '/path/to/dir'
    const symlink = [
      { name: 'link', isDirectory: () => false, isSymbolicLink: () => true },
    ]
    ;(promises.readdir as jest.Mock).mockResolvedValueOnce(symlink)

    await recursiveDelete(dir)

    expect(promises.readlink).toHaveBeenCalledWith(join(dir, 'link'))
  })

  it('should exclude paths matching exclude regex', async () => {
    const dir = '/path/to/dir'
    const files = [
      { name: 'file1.txt', isDirectory: () => false, isSymbolicLink: () => false },
      { name: 'file2.txt', isDirectory: () => false, isSymbolicLink: () => false },
    ]
    ;(promises.readdir as jest.Mock).mockResolvedValueOnce(files)

    await recursiveDelete(dir, /file2\.txt/)

    expect(promises.unlink).toHaveBeenCalledWith(join(dir, 'file1.txt'))
    expect(promises.unlink).not.toHaveBeenCalledWith(join(dir, 'file2.txt'))
  })

  it('should handle ENOENT error gracefully', async () => {
    const dir = '/path/to/dir'
    ;(promises.readdir as jest.Mock).mockRejectedValueOnce({
      code: 'ENOENT',
    })

    await expect(recursiveDelete(dir)).resolves.toBeUndefined()
  })
})