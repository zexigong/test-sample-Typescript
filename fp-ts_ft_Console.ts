import * as _ from '../src/Console'
import * as IO from '../src/IO'
import { pipe } from '../src/function'
import * as U from './util'

const assertConsole = (method: 'log' | 'warn' | 'error' | 'info') => (fa: IO.IO<void>, expected: unknown) => {
  const log = console[method]
  const logger: Array<unknown> = []
  console[method] = (a: unknown) => {
    logger.push(a)
  }
  fa()
  console[method] = log
  U.deepStrictEqual(logger, expected)
}

describe.concurrent('Console', () => {
  it('log', () => {
    assertConsole('log')(_.log('test'), ['test'])
  })

  it('warn', () => {
    assertConsole('warn')(_.warn('test'), ['test'])
  })

  it('error', () => {
    assertConsole('error')(_.error('test'), ['test'])
  })

  it('info', () => {
    assertConsole('info')(_.info('test'), ['test'])
  })

  it('log overload', () => {
    const fa = _.log('a')
    const fb = pipe(
      fa,
      IO.flatMap(() => _.log('b'))
    )
    assertConsole('log')(fb, ['a', 'b'])
  })
})