import fs from 'fs/promises';
import path from 'path';
import { recursiveReadDir, RecursiveReadDirOptions } from '../../packages/next/src/lib/recursive-readdir';

jest.mock('fs/promises');

describe('recursiveReadDir', () => {
  const mockReaddir = fs.readdir as jest.Mock;
  const mockStat = fs.stat as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const setupMockFs = (structure: Record<string, any>) => {
    mockReaddir.mockImplementation(async (directory: string) => {
      const dirContent = structure[directory];
      if (!dirContent) {
        const error: any = new Error('ENOENT');
        error.code = 'ENOENT';
        throw error;
      }

      return Object.keys(dirContent).map((name) => ({
        name,
        isDirectory: () => typeof dirContent[name] === 'object',
        isSymbolicLink: () => false,
      }));
    });

    mockStat.mockImplementation(async (pathname: string) => {
      for (const dir in structure) {
        if (pathname in structure[dir]) {
          return {
            isDirectory: () => typeof structure[dir][pathname] === 'object',
          };
        }
      }
      const error: any = new Error('ENOENT');
      error.code = 'ENOENT';
      throw error;
    });
  };

  it('should list all files in a directory recursively', async () => {
    const mockStructure = {
      '/root': {
        'file1.txt': 'content',
        'subdir': {
          'file2.txt': 'content',
        },
      },
    };
    setupMockFs(mockStructure);

    const result = await recursiveReadDir('/root');
    expect(result).toEqual(['/file1.txt', '/subdir/file2.txt']);
  });

  it('should apply pathname filter correctly', async () => {
    const mockStructure = {
      '/root': {
        'file1.txt': 'content',
        'subdir': {
          'file2.txt': 'content',
          'file3.log': 'content',
        },
      },
    };
    setupMockFs(mockStructure);

    const options: RecursiveReadDirOptions = {
      pathnameFilter: (pathname) => pathname.endsWith('.txt'),
    };

    const result = await recursiveReadDir('/root', options);
    expect(result).toEqual(['/file1.txt', '/subdir/file2.txt']);
  });

  it('should ignore directories and files based on ignoreFilter', async () => {
    const mockStructure = {
      '/root': {
        'file1.txt': 'content',
        'ignoreDir': {
          'file2.txt': 'content',
        },
        'file3.log': 'content',
      },
    };
    setupMockFs(mockStructure);

    const options: RecursiveReadDirOptions = {
      ignoreFilter: (pathname) => pathname.includes('ignoreDir'),
    };

    const result = await recursiveReadDir('/root', options);
    expect(result).toEqual(['/file1.txt', '/file3.log']);
  });

  it('should return absolute pathnames if relativePathnames is false', async () => {
    const mockStructure = {
      '/root': {
        'file1.txt': 'content',
        'subdir': {
          'file2.txt': 'content',
        },
      },
    };
    setupMockFs(mockStructure);

    const options: RecursiveReadDirOptions = {
      relativePathnames: false,
    };

    const result = await recursiveReadDir('/root', options);
    expect(result).toEqual(['/root/file1.txt', '/root/subdir/file2.txt']);
  });

  it('should handle symbolic links correctly', async () => {
    const mockStructure = {
      '/root': {
        'file1.txt': 'content',
        'link': {
          'file2.txt': 'content',
        },
      },
    };
    mockReaddir.mockImplementation(async (directory: string) => {
      if (directory === '/root') {
        return [
          { name: 'file1.txt', isDirectory: () => false, isSymbolicLink: () => false },
          { name: 'link', isDirectory: () => false, isSymbolicLink: () => true },
        ];
      }
      return [];
    });

    mockStat.mockImplementation(async (pathname: string) => {
      if (pathname === '/root/link') {
        return { isDirectory: () => true };
      }
      throw new Error('ENOENT');
    });

    const result = await recursiveReadDir('/root');
    expect(result).toEqual(['/file1.txt']);
  });

  it('should sort pathnames if sortPathnames is true', async () => {
    const mockStructure = {
      '/root': {
        'b.txt': 'content',
        'a.txt': 'content',
        'c.txt': 'content',
      },
    };
    setupMockFs(mockStructure);

    const options: RecursiveReadDirOptions = {
      sortPathnames: true,
    };

    const result = await recursiveReadDir('/root', options);
    expect(result).toEqual(['/a.txt', '/b.txt', '/c.txt']);
  });
});