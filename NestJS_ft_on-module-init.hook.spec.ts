import { Injectable, OnModuleInit } from '@nestjs/common';
import { iterate } from 'iterare';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';
import * as transientHelpers from '../../injector/helpers/transient-instances';
import { callModuleInitHook } from '../../hooks/on-module-init.hook';

describe('onModuleInit', () => {
  let moduleInitHook: jest.SpyInstance;

  class TestModule {
    onModuleInit() {}
  }
  @Injectable()
  class TestProvider implements OnModuleInit {
    onModuleInit() {}
  }
  @Injectable()
  class TestInjectable implements OnModuleInit {
    onModuleInit() {}
  }
  @Injectable()
  class TestService implements OnModuleInit {
    onModuleInit() {}
  }

  beforeEach(() => {
    moduleInitHook = jest.spyOn(TestModule.prototype, 'onModuleInit');
  });

  it('should call onModuleInit when it is provided', async () => {
    const providers = new Map<any, InstanceWrapper<TestProvider>>();
    const controllers = new Map();
    const injectables = new Map();
    const middlewares = new Map();

    const testProvider = new TestProvider();
    const providerWrapper = new InstanceWrapper({
      instance: testProvider,
      metatype: TestProvider,
    });
    providers.set(TestProvider, providerWrapper);

    const testInjectable = new TestInjectable();
    const injectableWrapper = new InstanceWrapper({
      instance: testInjectable,
      metatype: TestInjectable,
    });
    injectables.set(TestInjectable, injectableWrapper);

    const testController = new TestService();
    const controllerWrapper = new InstanceWrapper({
      instance: testController,
      metatype: TestService,
    });
    controllers.set(TestService, controllerWrapper);

    const testMiddleware = new TestInjectable();
    const middlewareWrapper = new InstanceWrapper({
      instance: testMiddleware,
      metatype: TestInjectable,
    });
    middlewares.set(TestInjectable, middlewareWrapper);

    const module = new Module(TestModule as any, null);
    module.controllers = controllers;
    module.providers = providers;
    module.injectables = injectables;
    module.middlewares = middlewares;

    const callTransientInstances = jest.spyOn(
      transientHelpers,
      'getTransientInstances',
    );
    const callNonTransientInstances = jest.spyOn(
      transientHelpers,
      'getNonTransientInstances',
    );

    await callModuleInitHook(module);

    expect(moduleInitHook).toHaveBeenCalled();
    expect(callTransientInstances).toHaveBeenCalled();
    expect(callNonTransientInstances).toHaveBeenCalled();
  });

  it('should not call onModuleInit when it is not provided', async () => {
    class Test {
      onModuleInit() {}
    }
    const module = new Module(Test as any, null);

    const providers = new Map<any, InstanceWrapper<TestProvider>>();
    const controllers = new Map();
    const injectables = new Map();
    const middlewares = new Map();

    const testProvider = new TestProvider();
    const providerWrapper = new InstanceWrapper({
      instance: testProvider,
      metatype: TestProvider,
    });
    providers.set(TestProvider, providerWrapper);

    const testInjectable = new TestInjectable();
    const injectableWrapper = new InstanceWrapper({
      instance: testInjectable,
      metatype: TestInjectable,
    });
    injectables.set(TestInjectable, injectableWrapper);

    const testController = new TestService();
    const controllerWrapper = new InstanceWrapper({
      instance: testController,
      metatype: TestService,
    });
    controllers.set(TestService, controllerWrapper);

    const testMiddleware = new TestInjectable();
    const middlewareWrapper = new InstanceWrapper({
      instance: testMiddleware,
      metatype: TestInjectable,
    });
    middlewares.set(TestInjectable, middlewareWrapper);

    module.controllers = controllers;
    module.providers = providers;
    module.injectables = injectables;
    module.middlewares = middlewares;

    await callModuleInitHook(module);

    expect(moduleInitHook).not.toHaveBeenCalled();
  });

  it('should call onModuleInit in the order of the providers', async () => {
    const providers = new Map<any, InstanceWrapper<TestProvider>>();
    const controllers = new Map();
    const injectables = new Map();
    const middlewares = new Map();

    let isCalled = false;
    const testProvider = new TestProvider();
    testProvider.onModuleInit = () => {
      isCalled = true;
    };

    const providerWrapper = new InstanceWrapper({
      instance: testProvider,
      metatype: TestProvider,
    });
    providers.set(TestProvider, providerWrapper);

    let testInjectable = new TestInjectable();
    testInjectable.onModuleInit = () => {
      expect(isCalled).toBeTruthy();
    };
    const injectableWrapper = new InstanceWrapper({
      instance: testInjectable,
      metatype: TestInjectable,
    });
    injectables.set(TestInjectable, injectableWrapper);

    const module = new Module(TestModule as any, null);
    module.controllers = controllers;
    module.providers = providers;
    module.injectables = injectables;
    module.middlewares = middlewares;

    await callModuleInitHook(module);
  });
});