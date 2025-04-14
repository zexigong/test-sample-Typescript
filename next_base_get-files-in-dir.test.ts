import { getFilesInDir } from '../../packages/next/src/lib/get-files-in-dir';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

describe('getFilesInDir', () => {
  const mockDirent = (name: string, isFile: boolean, isSymbolicLink: boolean) => ({
    name,
    isFile: jest.fn(() => isFile),
    isSymbolicLink: jest.fn(() => isSymbolicLink),
  });

  const mockStats = (isFile: boolean) => ({
    isFile: jest.fn(() => isFile),
  });

  let opendirMock: jest.Mock;
  let statMock: jest.Mock;

  beforeEach(() => {
    opendirMock = fs.opendir as jest.Mock;
    statMock = fs.stat as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty set for an empty directory', async () => {
    opendirMock.mockResolvedValue({
      [Symbol.asyncIterator]: function* () {},
    });

    const result = await getFilesInDir('/empty-dir');
    expect(result).toEqual(new Set());
  });

  it('should return a set of file names for a directory with files', async () => {
    opendirMock.mockResolvedValue({
      [Symbol.asyncIterator]: function* () {
        yield mockDirent('file1.txt', true, false);
        yield mockDirent('file2.txt', true, false);
      },
    });

    const result = await getFilesInDir('/some-dir');
    expect(result).toEqual(new Set(['file1.txt', 'file2.txt']));
  });

  it('should resolve symbolic links and include the file if it is a file', async () => {
    opendirMock.mockResolvedValue({
      [Symbol.asyncIterator]: function* () {
        yield mockDirent('link-to-file.txt', false, true);
      },
    });

    statMock.mockResolvedValue(mockStats(true));

    const result = await getFilesInDir('/dir-with-symlink');
    expect(statMock).toHaveBeenCalledWith(path.join('/dir-with-symlink', 'link-to-file.txt'));
    expect(result).toEqual(new Set(['link-to-file.txt']));
  });

  it('should not include symbolic links that resolve to directories', async () => {
    opendirMock.mockResolvedValue({
      [Symbol.asyncIterator]: function* () {
        yield mockDirent('link-to-dir', false, true);
      },
    });

    statMock.mockResolvedValue(mockStats(false));

    const result = await getFilesInDir('/dir-with-symlink-to-dir');
    expect(statMock).toHaveBeenCalledWith(path.join('/dir-with-symlink-to-dir', 'link-to-dir'));
    expect(result).toEqual(new Set());
  });

  it('should handle a mix of files and symbolic links', async () => {
    opendirMock.mockResolvedValue({
      [Symbol.asyncIterator]: function* () {
        yield mockDirent('file1.txt', true, false);
        yield mockDirent('link-to-file2.txt', false, true);
      },
    });

    statMock.mockResolvedValue(mockStats(true));

    const result = await getFilesInDir('/mixed-dir');
    expect(result).toEqual(new Set(['file1.txt', 'link-to-file2.txt']));
  });
});