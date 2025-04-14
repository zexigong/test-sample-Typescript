import { OnModuleInit } from '@nestjs/common';
import { callModuleInitHook } from '../../hooks/on-module-init.hook';
import { Module } from '../../injector/module';

describe('callModuleInitHook', () => {
  let module: Module;

  beforeEach(() => {
    module = new Module(class TestModule {}, {} as any);
  });

  it('should call onModuleInit when it is defined', async () => {
    const onModuleInit = jest.fn();
    const instance = { onModuleInit };
    module.addProvider({ provide: 'test', useValue: instance });

    await callModuleInitHook(module);
    expect(onModuleInit).toHaveBeenCalled();
  });

  it('should not call onModuleInit when it is not defined', async () => {
    const onModuleInit = jest.fn();
    const instance = {};
    module.addProvider({ provide: 'test', useValue: instance });

    await callModuleInitHook(module);
    expect(onModuleInit).not.toHaveBeenCalled();
  });

  it('should call onModuleInit when it is defined in a transient provider', async () => {
    const onModuleInit = jest.fn();
    const instance = { onModuleInit };
    module.addProvider({ provide: 'test', useValue: instance, scope: 1 });

    await callModuleInitHook(module);
    expect(onModuleInit).toHaveBeenCalled();
  });

  it('should not call onModuleInit when it is not defined in a transient provider', async () => {
    const onModuleInit = jest.fn();
    const instance = {};
    module.addProvider({ provide: 'test', useValue: instance, scope: 1 });

    await callModuleInitHook(module);
    expect(onModuleInit).not.toHaveBeenCalled();
  });

  it('should call onModuleInit when it is defined in a controller', async () => {
    const onModuleInit = jest.fn();
    const instance = { onModuleInit };
    module.addController(class TestController {});
    module.controllers.get(TestController).instance = instance;

    await callModuleInitHook(module);
    expect(onModuleInit).toHaveBeenCalled();
  });

  it('should not call onModuleInit when it is not defined in a controller', async () => {
    const onModuleInit = jest.fn();
    const instance = {};
    module.addController(class TestController {});
    module.controllers.get(TestController).instance = instance;

    await callModuleInitHook(module);
    expect(onModuleInit).not.toHaveBeenCalled();
  });

  it('should call onModuleInit when it is defined in a middleware', async () => {
    const onModuleInit = jest.fn();
    const instance = { onModuleInit };
    module.addInjectable(class TestMiddleware {}, 'middleware');
    module.middlewares.get(TestMiddleware).instance = instance;

    await callModuleInitHook(module);
    expect(onModuleInit).toHaveBeenCalled();
  });

  it('should not call onModuleInit when it is not defined in a middleware', async () => {
    const onModuleInit = jest.fn();
    const instance = {};
    module.addInjectable(class TestMiddleware {}, 'middleware');
    module.middlewares.get(TestMiddleware).instance = instance;

    await callModuleInitHook(module);
    expect(onModuleInit).not.toHaveBeenCalled();
  });

  it('should call onModuleInit when it is defined in an injectable', async () => {
    const onModuleInit = jest.fn();
    const instance = { onModuleInit };
    module.addInjectable(class TestInjectable {}, 'injectable');
    module.injectables.get(TestInjectable).instance = instance;

    await callModuleInitHook(module);
    expect(onModuleInit).toHaveBeenCalled();
  });

  it('should not call onModuleInit when it is not defined in an injectable', async () => {
    const onModuleInit = jest.fn();
    const instance = {};
    module.addInjectable(class TestInjectable {}, 'injectable');
    module.injectables.get(TestInjectable).instance = instance;

    await callModuleInitHook(module);
    expect(onModuleInit).not.toHaveBeenCalled();
  });
});