import { writeAppTypeDeclarations } from 'next/dist/lib/typescript/writeAppTypeDeclarations';
import fs from 'fs-extra';
import path from 'path';

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  readFile: jest.fn(async () => {
    throw new Error('File not found');
  }),
  writeFile: jest.fn(async () => {}),
}));

describe('writeAppTypeDeclarations', () => {
  const baseDir = '/test/dir';
  const appTypeDeclarations = path.join(baseDir, 'next-env.d.ts');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write the correct content when no existing file', async () => {
    const expectedContent = [
      '/// <reference types="next" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
    ].join('\n') + '\n';

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: false,
      hasPagesDir: true,
      hasAppDir: false,
    });

    expect(fs.writeFile).toHaveBeenCalledWith(appTypeDeclarations, expectedContent);
  });

  it('should write the correct content when image imports are enabled', async () => {
    const expectedContent = [
      '/// <reference types="next" />',
      '/// <reference types="next/image-types/global" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
    ].join('\n') + '\n';

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: true,
      hasPagesDir: true,
      hasAppDir: false,
    });

    expect(fs.writeFile).toHaveBeenCalledWith(appTypeDeclarations, expectedContent);
  });

  it('should write the correct content when both app and pages directories exist', async () => {
    const expectedContent = [
      '/// <reference types="next" />',
      '/// <reference types="next/navigation-types/compat/navigation" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.',
    ].join('\n') + '\n';

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: false,
      hasPagesDir: true,
      hasAppDir: true,
    });

    expect(fs.writeFile).toHaveBeenCalledWith(appTypeDeclarations, expectedContent);
  });

  it('should not write if the content is the same', async () => {
    const content = [
      '/// <reference types="next" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
    ].join('\n') + '\n';

    (fs.readFile as jest.Mock).mockImplementation(async () => content);

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: false,
      hasPagesDir: true,
      hasAppDir: false,
    });

    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should preserve existing line endings', async () => {
    const content = [
      '/// <reference types="next" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
    ].join('\r\n') + '\r\n';

    (fs.readFile as jest.Mock).mockImplementation(async () => content);

    const expectedContent = [
      '/// <reference types="next" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
    ].join('\r\n') + '\r\n';

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: false,
      hasPagesDir: true,
      hasAppDir: false,
    });

    expect(fs.writeFile).toHaveBeenCalledWith(appTypeDeclarations, expectedContent);
  });
});