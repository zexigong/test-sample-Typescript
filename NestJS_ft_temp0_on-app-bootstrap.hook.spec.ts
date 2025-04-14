import { OnApplicationBootstrap } from '@nestjs/common';
import { callModuleBootstrapHook } from '../../hooks/on-app-bootstrap.hook';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';

describe('callModuleBootstrapHook', () => {
  let module: Module;
  let wrapper: InstanceWrapper;
  let instance: OnApplicationBootstrap;

  beforeEach(() => {
    instance = {
      onApplicationBootstrap: jest.fn(),
    };
    wrapper = new InstanceWrapper();
    wrapper.instance = instance;
    module = new Module();
    module.getNonAliasProviders = jest.fn(() => [
      ['key', wrapper],
      ['key', wrapper],
    ]);
    module.controllers = new Map();
    module.injectables = new Map();
    module.middlewares = new Map();
  });

  it('should call "onApplicationBootstrap" for each instance', async () => {
    await callModuleBootstrapHook(module);
    expect(instance.onApplicationBootstrap).toHaveBeenCalledTimes(2);
  });

  it('should not call "onApplicationBootstrap" if instance does not implement OnApplicationBootstrap', async () => {
    wrapper.instance = {};
    await callModuleBootstrapHook(module);
    expect(instance.onApplicationBootstrap).not.toHaveBeenCalled();
  });

  it('should not call "onApplicationBootstrap" if instance is transient', async () => {
    wrapper.isTransient = true;
    await callModuleBootstrapHook(module);
    expect(instance.onApplicationBootstrap).not.toHaveBeenCalled();
  });

  it('should not call "onApplicationBootstrap" if instance is not static', async () => {
    wrapper.isDependencyTreeStatic = jest.fn(() => false);
    await callModuleBootstrapHook(module);
    expect(instance.onApplicationBootstrap).not.toHaveBeenCalled();
  });
});