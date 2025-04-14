import { describe, it, vi, expect } from 'vitest'
import { log, warn, error, info } from '../src/Console'

describe('Console', () => {
  it('log should call console.log with the correct argument', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const message = 'Test log message'

    log(message)()

    expect(consoleLogSpy).toHaveBeenCalledWith(message)

    consoleLogSpy.mockRestore()
  })

  it('warn should call console.warn with the correct argument', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const message = 'Test warn message'

    warn(message)()

    expect(consoleWarnSpy).toHaveBeenCalledWith(message)

    consoleWarnSpy.mockRestore()
  })

  it('error should call console.error with the correct argument', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const message = 'Test error message'

    error(message)()

    expect(consoleErrorSpy).toHaveBeenCalledWith(message)

    consoleErrorSpy.mockRestore()
  })

  it('info should call console.info with the correct argument', () => {
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const message = 'Test info message'

    info(message)()

    expect(consoleInfoSpy).toHaveBeenCalledWith(message)

    consoleInfoSpy.mockRestore()
  })
})