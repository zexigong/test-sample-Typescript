import { OnApplicationShutdown } from '@nestjs/common';
import { callAppShutdownHook } from '../../hooks/on-app-shutdown.hook';
import { Module } from '../../injector/module';
import { InstanceWrapper } from '../../injector/instance-wrapper';

describe('callAppShutdownHook', () => {
  let mockModule: Module;
  let mockInstanceWrapper: InstanceWrapper;
  let mockSignal: string;

  beforeEach(() => {
    mockSignal = 'SIGTERM';

    // Mocking the Module class
    mockModule = {
      getNonAliasProviders: jest.fn().mockReturnValue([
        ['SomeProvider', { instance: {}, isDependencyTreeStatic: jest.fn().mockReturnValue(true) }],
      ]),
      controllers: new Map(),
      injectables: new Map(),
      middlewares: new Map(),
    } as any;

    // Mocking InstanceWrapper class
    mockInstanceWrapper = {
      instance: {
        onApplicationShutdown: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as any;

    mockModule.controllers.set('Controller', mockInstanceWrapper);
    mockModule.injectables.set('Injectable', mockInstanceWrapper);
    mockModule.middlewares.set('Middleware', mockInstanceWrapper);
  });

  it('should call onApplicationShutdown on non-transient instances', async () => {
    await callAppShutdownHook(mockModule, mockSignal);

    expect(mockInstanceWrapper.instance.onApplicationShutdown).toHaveBeenCalledWith(mockSignal);
  });

  it('should not call onApplicationShutdown if the instance does not have the hook', async () => {
    mockInstanceWrapper.instance = {};
    await callAppShutdownHook(mockModule, mockSignal);

    expect(mockInstanceWrapper.instance.onApplicationShutdown).toBeUndefined();
  });

  it('should not call onApplicationShutdown on transient instances', async () => {
    mockInstanceWrapper.isDependencyTreeStatic = jest.fn().mockReturnValue(false);
    await callAppShutdownHook(mockModule, mockSignal);

    expect(mockInstanceWrapper.instance.onApplicationShutdown).not.toHaveBeenCalled();
  });

  it('should handle modules with empty providers', async () => {
    mockModule.getNonAliasProviders = jest.fn().mockReturnValue([]);
    await expect(callAppShutdownHook(mockModule, mockSignal)).resolves.not.toThrow();
  });

  it('should call onApplicationShutdown on the module class instance if it has the hook', async () => {
    const [_, moduleClassHost] = mockModule.getNonAliasProviders()[0];
    moduleClassHost.instance.onApplicationShutdown = jest.fn();

    await callAppShutdownHook(mockModule, mockSignal);

    expect(moduleClassHost.instance.onApplicationShutdown).toHaveBeenCalledWith(mockSignal);
  });

  it('should not call onApplicationShutdown on the module class instance if it does not have the hook', async () => {
    const [_, moduleClassHost] = mockModule.getNonAliasProviders()[0];
    moduleClassHost.instance.onApplicationShutdown = undefined;

    await callAppShutdownHook(mockModule, mockSignal);

    expect(moduleClassHost.instance.onApplicationShutdown).toBeUndefined();
  });
});