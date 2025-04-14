import os from 'os'
import path from 'path'
import { promises as fs } from 'fs'
import { writeAppTypeDeclarations } from '../../packages/next/src/lib/typescript/writeAppTypeDeclarations'

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}))

describe('writeAppTypeDeclarations', () => {
  const baseDir = '/test/base/dir'
  const appTypeDeclarations = path.join(baseDir, 'next-env.d.ts')

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should write the correct declarations when file does not exist', async () => {
    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('File not found'))

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: true,
      hasPagesDir: true,
      hasAppDir: true,
    })

    const expectedContent = [
      '/// <reference types="next" />',
      '/// <reference types="next/image-types/global" />',
      '/// <reference types="next/navigation-types/compat/navigation" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.',
      ''
    ].join(os.EOL)

    expect(fs.writeFile).toHaveBeenCalledWith(appTypeDeclarations, expectedContent)
  })

  it('should preserve existing line endings if file exists', async () => {
    const currentContent = '/// <reference types="next" />\r\n'
    ;(fs.readFile as jest.Mock).mockResolvedValueOnce(currentContent)

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: false,
      hasPagesDir: false,
      hasAppDir: false,
    })

    const expectedContent = [
      '/// <reference types="next" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
      ''
    ].join('\r\n')

    expect(fs.writeFile).toHaveBeenCalledWith(appTypeDeclarations, expectedContent)
  })

  it('should not rewrite the file if content is unchanged', async () => {
    const currentContent = [
      '/// <reference types="next" />',
      '',
      '// NOTE: This file should not be edited',
      '// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.',
      ''
    ].join(os.EOL)

    ;(fs.readFile as jest.Mock).mockResolvedValueOnce(currentContent)

    await writeAppTypeDeclarations({
      baseDir,
      imageImportsEnabled: false,
      hasPagesDir: false,
      hasAppDir: false,
    })

    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})