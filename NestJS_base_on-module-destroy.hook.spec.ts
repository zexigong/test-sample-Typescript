import { InstanceWrapper } from '../../injector/instance-wrapper';
import { callModuleDestroyHook } from '../../hooks/on-module-destroy.hook';
import { Module } from '../../injector/module';

describe('callModuleDestroyHook', () => {
  let mockModule: Module;
  let mockInstanceWrapper: InstanceWrapper;
  let mockOnModuleDestroy: jest.Mock;

  beforeEach(() => {
    mockOnModuleDestroy = jest.fn();

    mockInstanceWrapper = new InstanceWrapper({
      instance: { onModuleDestroy: mockOnModuleDestroy },
      isResolved: true,
    });

    mockModule = {
      controllers: [],
      injectables: [],
      middlewares: [],
      getNonAliasProviders: jest.fn().mockReturnValue([
        ['token', mockInstanceWrapper],
      ]),
    } as unknown as Module;
  });

  it('should call onModuleDestroy on non-transient instances', async () => {
    await callModuleDestroyHook(mockModule);

    expect(mockOnModuleDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onModuleDestroy on transient instances', async () => {
    mockInstanceWrapper.isTransient = true;
    await callModuleDestroyHook(mockModule);

    expect(mockOnModuleDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onModuleDestroy on module instance if it implements OnModuleDestroy', async () => {
    const moduleInstance = { onModuleDestroy: mockOnModuleDestroy };
    mockModule.getNonAliasProviders = jest.fn().mockReturnValue([
      ['token', { instance: moduleInstance, isDependencyTreeStatic: () => true }],
    ]);

    await callModuleDestroyHook(mockModule);

    expect(mockOnModuleDestroy).toHaveBeenCalledTimes(1);
  });

  it('should not call onModuleDestroy on module instance if it does not implement OnModuleDestroy', async () => {
    const moduleInstance = {};
    mockModule.getNonAliasProviders = jest.fn().mockReturnValue([
      ['token', { instance: moduleInstance, isDependencyTreeStatic: () => true }],
    ]);

    await callModuleDestroyHook(mockModule);

    expect(mockOnModuleDestroy).not.toHaveBeenCalled();
  });
});