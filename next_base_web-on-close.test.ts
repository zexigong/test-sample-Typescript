import { trackBodyConsumed, trackStreamConsumed, CloseController } from './web-on-close';

describe('trackBodyConsumed', () => {
  it('should call onEnd after consuming a string body', async () => {
    const onEnd = jest.fn();
    const body = 'Hello, World!';
    
    const result = trackBodyConsumed(body, onEnd);
    
    const chunks = [];
    for await (const chunk of result as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    expect(new TextDecoder().decode(chunks[0])).toBe(body);
    expect(onEnd).toHaveBeenCalled();
  });

  it('should call onEnd after consuming a ReadableStream', async () => {
    const onEnd = jest.fn();
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('Hello, Stream!'));
        controller.close();
      }
    });

    const result = trackBodyConsumed(readableStream, onEnd);
    const reader = result.getReader();
    const chunks = [];

    let done, value;
    do {
      ({ done, value } = await reader.read());
      if (value) chunks.push(value);
    } while (!done);

    expect(new TextDecoder().decode(chunks[0])).toBe('Hello, Stream!');
    expect(onEnd).toHaveBeenCalled();
  });
});

describe('trackStreamConsumed', () => {
  it('should call onEnd after consuming a ReadableStream', async () => {
    const onEnd = jest.fn();
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('Stream Content'));
        controller.close();
      }
    });

    const result = trackStreamConsumed(readableStream, onEnd);
    const reader = result.getReader();
    const chunks = [];

    let done, value;
    do {
      ({ done, value } = await reader.read());
      if (value) chunks.push(value);
    } while (!done);

    expect(new TextDecoder().decode(chunks[0])).toBe('Stream Content');
    expect(onEnd).toHaveBeenCalled();
  });
});

describe('CloseController', () => {
  it('should allow subscribing and dispatching close event', () => {
    const controller = new CloseController();
    const onClose = jest.fn();

    controller.onClose(onClose);
    controller.dispatchClose();

    expect(onClose).toHaveBeenCalled();
    expect(controller.isClosed).toBe(true);
  });

  it('should throw error when subscribing after closed', () => {
    const controller = new CloseController();
    controller.dispatchClose();

    expect(() => controller.onClose(() => {})).toThrow(
      'Cannot subscribe to a closed CloseController'
    );
  });

  it('should throw error when dispatching close multiple times', () => {
    const controller = new CloseController();
    controller.dispatchClose();

    expect(() => controller.dispatchClose()).toThrow(
      'Cannot close a CloseController multiple times'
    );
  });
});