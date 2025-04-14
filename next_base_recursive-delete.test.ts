import { promises } from 'fs'
import { join } from 'path'
import { recursiveDelete } from '../../packages/next/src/lib/recursive-delete'

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    rmdir: jest.fn(),
    unlink: jest.fn(),
    readlink: jest.fn(),
    stat: jest.fn(),
  },
}))

jest.mock('../../packages/next/src/lib/wait', () => ({
  wait: jest.fn(() => Promise.resolve()),
}))

describe('recursiveDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle non-existent directory', async () => {
    (promises.readdir as jest.Mock).mockRejectedValue({ code: 'ENOENT' })
    await expect(recursiveDelete('/non-existent-dir')).resolves.toBeUndefined()
  })

  it('should delete files in a directory', async () => {
    const dirents = [
      { name: 'file1.txt', isDirectory: () => false, isSymbolicLink: () => false },
      { name: 'file2.txt', isDirectory: () => false, isSymbolicLink: () => false },
    ]
    (promises.readdir as jest.Mock).mockResolvedValue(dirents)
    await recursiveDelete('/some-dir')

    expect(promises.unlink).toHaveBeenCalledWith(join('/some-dir', 'file1.txt'))
    expect(promises.unlink).toHaveBeenCalledWith(join('/some-dir', 'file2.txt'))
  })

  it('should delete subdirectories recursively', async () => {
    const dirents = [
      { name: 'subdir', isDirectory: () => true, isSymbolicLink: () => false },
    ]
    (promises.readdir as jest.Mock).mockResolvedValueOnce(dirents)
    (promises.readdir as jest.Mock).mockResolvedValueOnce([]) // No contents in the subdir

    await recursiveDelete('/some-dir')

    expect(promises.rmdir).toHaveBeenCalledWith(join('/some-dir', 'subdir'))
  })

  it('should handle symbolic links', async () => {
    const dirents = [
      { name: 'symlink', isDirectory: () => false, isSymbolicLink: () => true },
    ]
    (promises.readdir as jest.Mock).mockResolvedValue(dirents)
    (promises.readlink as jest.Mock).mockResolvedValue('/real-path')
    (promises.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false })

    await recursiveDelete('/some-dir')

    expect(promises.unlink).toHaveBeenCalledWith(join('/some-dir', 'symlink'))
  })

  it('should exclude files based on exclude regex', async () => {
    const dirents = [
      { name: 'file1.txt', isDirectory: () => false, isSymbolicLink: () => false },
      { name: 'exclude.txt', isDirectory: () => false, isSymbolicLink: () => false },
    ]
    (promises.readdir as jest.Mock).mockResolvedValue(dirents)

    await recursiveDelete('/some-dir', /exclude\.txt/)

    expect(promises.unlink).toHaveBeenCalledWith(join('/some-dir', 'file1.txt'))
    expect(promises.unlink).not.toHaveBeenCalledWith(join('/some-dir', 'exclude.txt'))
  })
})