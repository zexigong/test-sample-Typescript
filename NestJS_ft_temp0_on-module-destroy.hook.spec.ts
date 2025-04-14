import { OnModuleDestroy } from '@nestjs/common';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';
import { callModuleDestroyHook } from '../../hooks/on-module-destroy.hook';

describe('callModuleDestroyHook', () => {
  let module: Module;
  let wrapper: InstanceWrapper;
  let instance: OnModuleDestroy;

  beforeEach(() => {
    instance = {
      onModuleDestroy: jest.fn(),
    };
    wrapper = new InstanceWrapper();
    wrapper.instance = instance;
    module = new Module(class Test {}, null);
  });

  it('should call onModuleDestroy when it is a function', async () => {
    jest.spyOn(instance, 'onModuleDestroy');
    module.controllers.set('key', wrapper);

    await callModuleDestroyHook(module);
    expect(instance.onModuleDestroy).toHaveBeenCalled();
  });

  it('should not call onModuleDestroy when it is not a function', async () => {
    (instance as any).onModuleDestroy = null;
    jest.spyOn(instance, 'onModuleDestroy');
    module.controllers.set('key', wrapper);

    await callModuleDestroyHook(module);
    expect(instance.onModuleDestroy).not.toHaveBeenCalled();
  });

  it('should await onModuleDestroy when it returns a promise', async () => {
    const result = 'test';
    (instance as any).onModuleDestroy = async () => result;
    jest.spyOn(instance, 'onModuleDestroy');
    module.controllers.set('key', wrapper);

    await callModuleDestroyHook(module);
    expect(instance.onModuleDestroy).toHaveBeenCalled();
  });

  it('should call onModuleDestroy when it is a function (injectable)', async () => {
    jest.spyOn(instance, 'onModuleDestroy');
    module.injectables.set('key', wrapper);

    await callModuleDestroyHook(module);
    expect(instance.onModuleDestroy).toHaveBeenCalled();
  });

  it('should call onModuleDestroy when it is a function (provider)', async () => {
    jest.spyOn(instance, 'onModuleDestroy');
    module.providers.set('key', wrapper);

    await callModuleDestroyHook(module);
    expect(instance.onModuleDestroy).toHaveBeenCalled();
  });

  it('should call onModuleDestroy when it is a function (middleware)', async () => {
    jest.spyOn(instance, 'onModuleDestroy');
    module.middlewares.set('key', wrapper);

    await callModuleDestroyHook(module);
    expect(instance.onModuleDestroy).toHaveBeenCalled();
  });
});