import { OnApplicationShutdown } from '@nestjs/common';
import { iterate } from 'iterare';
import { callAppShutdownHook } from '../../hooks/on-app-shutdown.hook';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';

describe('OnAppShutdown', () => {
  let module: Module;
  let testInstance: OnApplicationShutdown;
  let testTransientInstance: OnApplicationShutdown;
  let testModuleInstance: OnApplicationShutdown;
  let testModuleTransientInstance: OnApplicationShutdown;

  beforeEach(() => {
    testInstance = {
      onApplicationShutdown: jest.fn(),
    };
    testTransientInstance = {
      onApplicationShutdown: jest.fn(),
    };
    testModuleInstance = {
      onApplicationShutdown: jest.fn(),
    };
    testModuleTransientInstance = {
      onApplicationShutdown: jest.fn(),
    };

    const instanceWrapper = new InstanceWrapper();
    instanceWrapper.instance = testInstance;
    const transientInstanceWrapper = new InstanceWrapper();
    transientInstanceWrapper.instance = testTransientInstance;
    transientInstanceWrapper.scope = 2;
    const moduleInstanceWrapper = new InstanceWrapper();
    moduleInstanceWrapper.instance = testModuleInstance;
    const moduleTransientInstanceWrapper = new InstanceWrapper();
    moduleTransientInstanceWrapper.instance = testModuleTransientInstance;
    moduleTransientInstanceWrapper.scope = 2;

    module = {
      providers: new Map([
        ['test', instanceWrapper],
        ['testTransient', transientInstanceWrapper],
        ['module', moduleInstanceWrapper],
        ['moduleTransient', moduleTransientInstanceWrapper],
      ]),
      controllers: new Map(),
      injectables: new Map(),
      middlewares: new Map(),
      getNonAliasProviders: () => {
        return iterate(module.providers.entries())
          .filter(([key, { isAlias }]) => !isAlias)
          .toArray();
      },
    } as any;
  });

  it('should call onApplicationShutdown when the given instance has the hook', async () => {
    await callAppShutdownHook(module, 'signal');
    expect(testInstance.onApplicationShutdown).toHaveBeenCalledWith('signal');
    expect(testTransientInstance.onApplicationShutdown).toHaveBeenCalledWith(
      'signal',
    );
    expect(testModuleInstance.onApplicationShutdown).toHaveBeenCalledWith(
      'signal',
    );
    expect(
      testModuleTransientInstance.onApplicationShutdown,
    ).toHaveBeenCalledWith('signal');
  });

  it('should not call onApplicationShutdown when the given instance does not have the hook', async () => {
    const instanceWrapper = new InstanceWrapper();
    instanceWrapper.instance = {};
    const transientInstanceWrapper = new InstanceWrapper();
    transientInstanceWrapper.instance = {};
    transientInstanceWrapper.scope = 2;
    const moduleInstanceWrapper = new InstanceWrapper();
    moduleInstanceWrapper.instance = {};
    const moduleTransientInstanceWrapper = new InstanceWrapper();
    moduleTransientInstanceWrapper.instance = {};
    moduleTransientInstanceWrapper.scope = 2;

    module = {
      providers: new Map([
        ['test', instanceWrapper],
        ['testTransient', transientInstanceWrapper],
        ['module', moduleInstanceWrapper],
        ['moduleTransient', moduleTransientInstanceWrapper],
      ]),
      controllers: new Map(),
      injectables: new Map(),
      middlewares: new Map(),
      getNonAliasProviders: () => {
        return iterate(module.providers.entries())
          .filter(([key, { isAlias }]) => !isAlias)
          .toArray();
      },
    } as any;

    await callAppShutdownHook(module, 'signal');
    expect(testInstance.onApplicationShutdown).not.toHaveBeenCalled();
    expect(testTransientInstance.onApplicationShutdown).not.toHaveBeenCalled();
    expect(testModuleInstance.onApplicationShutdown).not.toHaveBeenCalled();
    expect(
      testModuleTransientInstance.onApplicationShutdown,
    ).not.toHaveBeenCalled();
  });
});