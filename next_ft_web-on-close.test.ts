import { trackBodyConsumed, trackStreamConsumed, CloseController } from './web-on-close'

describe('trackBodyConsumed', () => {
  it('should call onEnd after consuming the body when body is a string', async () => {
    const onEndMock = jest.fn()
    const body = 'Hello, world!'

    const result = trackBodyConsumed(body, onEndMock)

    const chunks: Uint8Array[] = []
    for await (const chunk of result as AsyncIterable<Uint8Array>) {
      chunks.push(chunk)
    }

    expect(onEndMock).toHaveBeenCalledTimes(1)
    expect(chunks).toEqual([new TextEncoder().encode(body)])
  })

  it('should call onEnd after consuming the body when body is a stream', async () => {
    const onEndMock = jest.fn()
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue('Hello, world!')
        controller.close()
      }
    })

    const result = trackBodyConsumed(body, onEndMock)

    const reader = (result as ReadableStream).getReader()
    const readResult = await reader.read()
    expect(readResult.done).toBe(false)
    expect(readResult.value).toEqual('Hello, world!')
    const finalReadResult = await reader.read()
    expect(finalReadResult.done).toBe(true)

    expect(onEndMock).toHaveBeenCalledTimes(1)
  })
})

describe('trackStreamConsumed', () => {
  it('should call onEnd after consuming the stream', async () => {
    const onEndMock = jest.fn()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('Hello, world!')
        controller.close()
      }
    })

    const result = trackStreamConsumed(stream, onEndMock)

    const reader = result.getReader()
    const readResult = await reader.read()
    expect(readResult.done).toBe(false)
    expect(readResult.value).toEqual('Hello, world!')
    const finalReadResult = await reader.read()
    expect(finalReadResult.done).toBe(true)

    expect(onEndMock).toHaveBeenCalledTimes(1)
  })
})

describe('CloseController', () => {
  let controller: CloseController

  beforeEach(() => {
    controller = new CloseController()
  })

  it('should allow subscribing to close event', () => {
    const callback = jest.fn()
    controller.onClose(callback)
    expect(controller.listeners).toBe(1)
  })

  it('should dispatch close event', () => {
    const callback = jest.fn()
    controller.onClose(callback)

    controller.dispatchClose()

    expect(callback).toHaveBeenCalled()
    expect(controller.isClosed).toBe(true)
  })

  it('should throw error if subscribing after close', () => {
    controller.dispatchClose()
    expect(() => controller.onClose(() => {})).toThrowError(
      'Cannot subscribe to a closed CloseController'
    )
  })

  it('should throw error if dispatching close multiple times', () => {
    controller.dispatchClose()
    expect(() => controller.dispatchClose()).toThrowError(
      'Cannot close a CloseController multiple times'
    )
  })
})