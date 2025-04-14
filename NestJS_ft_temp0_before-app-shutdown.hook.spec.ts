import { BeforeApplicationShutdown } from '@nestjs/common';
import { callBeforeAppShutdownHook } from '../../hooks/before-app-shutdown.hook';
import { Module } from '../../injector/module';

describe('callBeforeAppShutdownHook', () => {
  let module: Module;
  let mockInstance: BeforeApplicationShutdown;

  beforeEach(() => {
    mockInstance = {
      beforeApplicationShutdown: jest.fn(),
    };
    module = {
      getNonAliasProviders: () => [
        ['key', { instance: mockInstance, isDependencyTreeStatic: () => true }],
      ],
      controllers: new Map(),
      injectables: new Map(),
      middlewares: new Map(),
    } as any;
  });

  it('should call beforeApplicationShutdown hook', async () => {
    await callBeforeAppShutdownHook(module);
    expect(mockInstance.beforeApplicationShutdown).toHaveBeenCalled();
  });

  it('should call beforeApplicationShutdown hook with signal', async () => {
    const signal = 'SIGTERM';
    await callBeforeAppShutdownHook(module, signal);
    expect(mockInstance.beforeApplicationShutdown).toHaveBeenCalledWith(signal);
  });

  it('should not call beforeApplicationShutdown hook if instance does not have it', async () => {
    const instanceWithoutHook = {};
    module.getNonAliasProviders = () => [
      ['key', { instance: instanceWithoutHook, isDependencyTreeStatic: () => true }],
    ];
    await callBeforeAppShutdownHook(module);
    expect(mockInstance.beforeApplicationShutdown).not.toHaveBeenCalled();
  });

  it('should handle transient instances', async () => {
    const transientInstance = {
      beforeApplicationShutdown: jest.fn(),
    };
    module.getNonAliasProviders = () => [
      ['key', { instance: mockInstance, isDependencyTreeStatic: () => true }],
      ['key', { instance: transientInstance, isDependencyTreeStatic: () => false }],
    ];
    await callBeforeAppShutdownHook(module);
    expect(mockInstance.beforeApplicationShutdown).toHaveBeenCalled();
    expect(transientInstance.beforeApplicationShutdown).toHaveBeenCalled();
  });
});