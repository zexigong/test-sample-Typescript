import { OnModuleInit } from '@nestjs/common';
import { callModuleInitHook } from '../../hooks/on-module-init.hook';
import { Module } from '../../injector/module';
import { InstanceWrapper } from '../../injector/instance-wrapper';

describe('callModuleInitHook', () => {
  let module: Module;
  let mockInstanceWrapper: InstanceWrapper;
  let mockOnModuleInit: jest.Mock;

  beforeEach(() => {
    mockOnModuleInit = jest.fn();
    mockInstanceWrapper = {
      instance: { onModuleInit: mockOnModuleInit },
      isDependencyTreeStatic: jest.fn(() => true),
    } as any;

    module = {
      getNonAliasProviders: jest.fn(() => [
        ['token', mockInstanceWrapper],
      ]),
      controllers: [],
      injectables: [],
      middlewares: [],
    } as any as Module;
  });

  it('should call onModuleInit on module class instance if it exists and is static', async () => {
    await callModuleInitHook(module);
    expect(mockOnModuleInit).toHaveBeenCalled();
  });

  it('should not call onModuleInit if the instance is not static', async () => {
    mockInstanceWrapper.isDependencyTreeStatic = jest.fn(() => false);
    await callModuleInitHook(module);
    expect(mockOnModuleInit).not.toHaveBeenCalled();
  });

  it('should handle cases where no onModuleInit method exists gracefully', async () => {
    delete mockInstanceWrapper.instance.onModuleInit;
    await expect(callModuleInitHook(module)).resolves.not.toThrow();
  });
});