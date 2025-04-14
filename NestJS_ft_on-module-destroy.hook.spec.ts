import { OnModuleDestroy } from '@nestjs/common';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';
import { callModuleDestroyHook } from '../../hooks/on-module-destroy.hook';

describe('callModuleDestroyHook', () => {
  class TestModule implements OnModuleDestroy {
    onModuleDestroy = jest.fn();
  }
  const module = new Module(TestModule as any, <any>{});

  it('should call onModuleDestroy when it is implemented', async () => {
    const instanceWrapper = new InstanceWrapper();
    instanceWrapper.instance = {
      onModuleDestroy: () => null,
    };
    jest.spyOn(instanceWrapper.instance, 'onModuleDestroy');

    jest
      .spyOn(module, 'getNonAliasProviders')
      .mockImplementation(() => [null, instanceWrapper]);

    await callModuleDestroyHook(module);
    expect(instanceWrapper.instance.onModuleDestroy).toHaveBeenCalled();
  });

  it('should not call onModuleDestroy when it is not implemented', async () => {
    const instanceWrapper = new InstanceWrapper();
    instanceWrapper.instance = {
      onModuleDestroy: null,
    };
    jest.spyOn(instanceWrapper.instance, 'onModuleDestroy');

    jest
      .spyOn(module, 'getNonAliasProviders')
      .mockImplementation(() => [null, instanceWrapper]);

    await callModuleDestroyHook(module);
    expect(instanceWrapper.instance.onModuleDestroy).not.toHaveBeenCalled();
  });
});