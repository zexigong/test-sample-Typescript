import { Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module as NestModule } from '../../injector/module';
import { callBeforeAppShutdownHook } from '../../hooks/before-app-shutdown.hook';

describe('callBeforeAppShutdownHook', () => {
  @Injectable()
  class ServiceWithoutHook {}

  @Injectable()
  class ServiceWithHook implements BeforeApplicationShutdown {
    beforeApplicationShutdown = jest.fn();
  }

  @Injectable()
  class ServiceWithHookAndPromise implements BeforeApplicationShutdown {
    beforeApplicationShutdown = jest.fn(async () => 'test');
  }

  @Injectable()
  class ServiceWithHookAndPromiseWithTimeout
    implements BeforeApplicationShutdown
  {
    beforeApplicationShutdown = jest.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  }

  @Module({
    providers: [
      ServiceWithoutHook,
      ServiceWithHook,
      {
        provide: 'WITH_HOOK',
        useClass: ServiceWithHook,
      },
      {
        provide: 'WITHOUT_HOOK',
        useClass: ServiceWithoutHook,
      },
      {
        provide: 'WITH_HOOK_PROMISE',
        useClass: ServiceWithHookAndPromise,
      },
      {
        provide: 'WITH_HOOK_PROMISE_TIMEOUT',
        useClass: ServiceWithHookAndPromiseWithTimeout,
      },
    ],
  })
  class TestModule {}

  @Module({})
  class EmptyModule {}

  let testModule: NestModule;

  beforeEach(async () => {
    const builder = Test.createTestingModule({
      imports: [TestModule, EmptyModule],
    });
    const module = await builder.compile();

    testModule = module.get<NestModule>(TestModule);
  });

  it('should call beforeApplicationShutdown when the hook is implemented', async () => {
    const [serviceWithHook] = testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithHook.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).toHaveBeenCalled();
  });

  it('should not call beforeApplicationShutdown when the hook is not implemented', async () => {
    const [_, serviceWithoutHook] = testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithoutHook.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).not.toHaveBeenCalled();
  });

  it('should await the result of beforeApplicationShutdown', async () => {
    const [_, __, serviceWithHookAndPromise] = testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithHookAndPromise.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).toHaveBeenCalled();
  });

  it('should await the result of beforeApplicationShutdown with timeout', async () => {
    const [_, __, ___, serviceWithHookAndPromiseWithTimeout] =
      testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithHookAndPromiseWithTimeout.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).toHaveBeenCalled();
  });

  it('should call beforeApplicationShutdown when the hook is implemented (async)', async () => {
    const [serviceWithHook] = testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithHook.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).toHaveBeenCalled();
  });

  it('should not call beforeApplicationShutdown when the hook is not implemented (async)', async () => {
    const [_, serviceWithoutHook] = testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithoutHook.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).not.toHaveBeenCalled();
  });

  it('should await the result of beforeApplicationShutdown (async)', async () => {
    const [_, __, serviceWithHookAndPromise] = testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithHookAndPromise.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).toHaveBeenCalled();
  });

  it('should await the result of beforeApplicationShutdown with timeout (async)', async () => {
    const [_, __, ___, serviceWithHookAndPromiseWithTimeout] =
      testModule.providers.values();
    const beforeApplicationShutdown = jest.spyOn(
      serviceWithHookAndPromiseWithTimeout.instance,
      'beforeApplicationShutdown',
    );

    await callBeforeAppShutdownHook(testModule);

    expect(beforeApplicationShutdown).toHaveBeenCalled();
  });
});