import { OnApplicationShutdown } from '@nestjs/common';
import { Module } from '../../injector/module';
import { callAppShutdownHook } from '../../hooks/on-app-shutdown.hook';
import { InstanceWrapper } from '../../injector/instance-wrapper';

describe('callAppShutdownHook', () => {
  const moduleRef = new Module(null, null);

  it('should call onAppShutdownHook when instance is not transient', async () => {
    const wrapper = new InstanceWrapper();
    const onApplicationShutdownHook = jest.fn();
    wrapper.instance = {
      onApplicationShutdown: onApplicationShutdownHook,
    };
    jest
      .spyOn(moduleRef, 'getNonAliasProviders')
      .mockImplementation(() => [[null, wrapper]] as any);

    await callAppShutdownHook(moduleRef);
    expect(onApplicationShutdownHook).toHaveBeenCalled();
  });

  it('should call onAppShutdownHook when instance is transient', async () => {
    const wrapper = new InstanceWrapper();
    const onApplicationShutdownHook = jest.fn();
    wrapper.instance = {
      onApplicationShutdown: onApplicationShutdownHook,
    };
    jest
      .spyOn(moduleRef, 'getNonAliasProviders')
      .mockImplementation(() => [[null, wrapper]] as any);

    await callAppShutdownHook(moduleRef);
    expect(onApplicationShutdownHook).toHaveBeenCalled();
  });

  it('should not call onAppShutdownHook when instance does not implement OnApplicationShutdown', async () => {
    const wrapper = new InstanceWrapper();
    wrapper.instance = {};
    jest
      .spyOn(moduleRef, 'getNonAliasProviders')
      .mockImplementation(() => [[null, wrapper]] as any);

    await callAppShutdownHook(moduleRef);
    expect(wrapper.instance.onApplicationShutdown).toBeUndefined();
  });

  it('should pass "signal" param to onApplicationShutdown hook', async () => {
    const wrapper = new InstanceWrapper();
    const onApplicationShutdownHook = jest.fn();
    wrapper.instance = {
      onApplicationShutdown: onApplicationShutdownHook,
    };
    jest
      .spyOn(moduleRef, 'getNonAliasProviders')
      .mockImplementation(() => [[null, wrapper]] as any);

    const signal = 'SIGTERM';
    await callAppShutdownHook(moduleRef, signal);
    expect(onApplicationShutdownHook).toHaveBeenCalledWith(signal);
  });
});