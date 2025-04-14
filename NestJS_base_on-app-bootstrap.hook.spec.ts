import { OnApplicationBootstrap } from '@nestjs/common';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';
import { callModuleBootstrapHook } from '../../hooks/on-app-bootstrap.hook';

describe('callModuleBootstrapHook', () => {
  let mockModule: Module;
  let mockInstanceWrapper: InstanceWrapper;

  beforeEach(() => {
    mockInstanceWrapper = {
      instance: {
        onApplicationBootstrap: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as any;

    mockModule = {
      getNonAliasProviders: jest.fn().mockReturnValue([
        ['token', mockInstanceWrapper]
      ]),
      controllers: new Map(),
      injectables: new Map(),
      middlewares: new Map(),
    } as any;
  });

  it('should call onApplicationBootstrap on module class instance', async () => {
    await callModuleBootstrapHook(mockModule);

    expect(mockInstanceWrapper.instance.onApplicationBootstrap).toHaveBeenCalled();
  });

  it('should not call onApplicationBootstrap if not a function', async () => {
    mockInstanceWrapper.instance.onApplicationBootstrap = undefined;

    await callModuleBootstrapHook(mockModule);

    expect(mockInstanceWrapper.instance.onApplicationBootstrap).toBeUndefined();
  });

  it('should not call onApplicationBootstrap if instance is transient', async () => {
    mockInstanceWrapper.isDependencyTreeStatic = jest.fn().mockReturnValue(false);

    await callModuleBootstrapHook(mockModule);

    expect(mockInstanceWrapper.instance.onApplicationBootstrap).not.toHaveBeenCalled();
  });

  it('should call onApplicationBootstrap on providers', async () => {
    const providerInstanceWrapper = {
      instance: {
        onApplicationBootstrap: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as any;

    mockModule.getNonAliasProviders = jest.fn().mockReturnValue([
      ['token', providerInstanceWrapper]
    ]);

    await callModuleBootstrapHook(mockModule);

    expect(providerInstanceWrapper.instance.onApplicationBootstrap).toHaveBeenCalled();
  });

  it('should call onApplicationBootstrap on controllers', async () => {
    const controllerInstanceWrapper = {
      instance: {
        onApplicationBootstrap: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as any;

    mockModule.controllers.set('controllerToken', controllerInstanceWrapper);

    await callModuleBootstrapHook(mockModule);

    expect(controllerInstanceWrapper.instance.onApplicationBootstrap).toHaveBeenCalled();
  });

  it('should call onApplicationBootstrap on injectables', async () => {
    const injectableInstanceWrapper = {
      instance: {
        onApplicationBootstrap: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as any;

    mockModule.injectables.set('injectableToken', injectableInstanceWrapper);

    await callModuleBootstrapHook(mockModule);

    expect(injectableInstanceWrapper.instance.onApplicationBootstrap).toHaveBeenCalled();
  });

  it('should call onApplicationBootstrap on middlewares', async () => {
    const middlewareInstanceWrapper = {
      instance: {
        onApplicationBootstrap: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as any;

    mockModule.middlewares.set('middlewareToken', middlewareInstanceWrapper);

    await callModuleBootstrapHook(mockModule);

    expect(middlewareInstanceWrapper.instance.onApplicationBootstrap).toHaveBeenCalled();
  });
});