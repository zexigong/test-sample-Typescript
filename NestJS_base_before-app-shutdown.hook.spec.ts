import { Module } from '../../injector/module';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { callBeforeAppShutdownHook } from '../../hooks/before-app-shutdown.hook';

describe('callBeforeAppShutdownHook', () => {
  let mockModule: Module;
  let mockInstanceWrapper: InstanceWrapper<any>;

  beforeEach(() => {
    mockInstanceWrapper = {
      instance: {
        beforeApplicationShutdown: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as unknown as InstanceWrapper<any>;

    mockModule = {
      controllers: [],
      injectables: [],
      middlewares: [],
      getNonAliasProviders: jest.fn().mockReturnValue([
        ['mockProvider', mockInstanceWrapper],
      ]),
    } as unknown as Module;
  });

  it('should call beforeApplicationShutdown on non-transient instances', async () => {
    await callBeforeAppShutdownHook(mockModule, 'SIGINT');

    expect(mockInstanceWrapper.instance.beforeApplicationShutdown).toHaveBeenCalledWith('SIGINT');
  });

  it('should call beforeApplicationShutdown on transient instances', async () => {
    const transientInstanceWrapper = {
      instance: {
        beforeApplicationShutdown: jest.fn(),
      },
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
      isTransient: true,
      getStaticTransientInstances: jest.fn().mockReturnValue([{
        instance: {
          beforeApplicationShutdown: jest.fn(),
        },
      }]),
    } as unknown as InstanceWrapper<any>;

    mockModule.controllers.push(transientInstanceWrapper);

    await callBeforeAppShutdownHook(mockModule, 'SIGINT');

    expect(transientInstanceWrapper.getStaticTransientInstances()[0].instance.beforeApplicationShutdown).toHaveBeenCalledWith('SIGINT');
  });

  it('should not call beforeApplicationShutdown if isDependencyTreeStatic returns false', async () => {
    mockInstanceWrapper.isDependencyTreeStatic.mockReturnValue(false);

    await callBeforeAppShutdownHook(mockModule, 'SIGINT');

    expect(mockInstanceWrapper.instance.beforeApplicationShutdown).not.toHaveBeenCalled();
  });

  it('should handle absence of beforeApplicationShutdown gracefully', async () => {
    const instanceWithoutHook = {
      instance: {},
      isDependencyTreeStatic: jest.fn().mockReturnValue(true),
    } as unknown as InstanceWrapper<any>;

    mockModule.controllers.push(instanceWithoutHook);

    await callBeforeAppShutdownHook(mockModule, 'SIGINT');

    // No exception should be thrown
    expect(instanceWithoutHook.instance.beforeApplicationShutdown).toBeUndefined();
  });
});