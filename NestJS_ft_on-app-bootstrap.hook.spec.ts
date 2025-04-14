import { OnApplicationBootstrap, Scope } from '@nestjs/common';
import { iterate } from 'iterare';
import { callModuleBootstrapHook } from '../../hooks/on-app-bootstrap.hook';
import { NestContainer } from '../../injector/container';
import { InstanceWrapper } from '../../injector/instance-wrapper';
import { Module } from '../../injector/module';
import { ModuleRef } from '../../injector/module-ref';

describe('callModuleBootstrapHook', () => {
  let container: NestContainer;
  let moduleRef: Module;
  let testModuleRef: Module;

  beforeEach(() => {
    container = new NestContainer();
    moduleRef = new Module(TestModule, container);
    testModuleRef = new Module(TestTestModule, container);
  });

  describe('when module does not implement OnModuleInit', () => {
    it('should skip', async () => {
      const instance = { test: 'test' };
      const wrapper = new InstanceWrapper({
        instance,
        metatype: instance as any,
        name: instance.constructor.name,
      });
      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
    });
  });

  describe('when module implements OnApplicationBootstrap', () => {
    class Test implements OnApplicationBootstrap {
      onApplicationBootstrap() {}
    }

    it('should call onApplicationBootstrap when it is a static tree', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
      });
      wrapper.isDependencyTreeStatic = () => true;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
      expect(instance.onApplicationBootstrap).toBeCalled();
    });

    it('should not call onApplicationBootstrap when it is not a static tree', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
      });
      wrapper.isDependencyTreeStatic = () => false;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
      expect(instance.onApplicationBootstrap).not.toBeCalled();
    });
  });

  describe('when module implements OnApplicationBootstrap async', () => {
    class Test implements OnApplicationBootstrap {
      async onApplicationBootstrap() {
        await Promise.resolve();
      }
    }

    it('should await the call', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
      });
      wrapper.isDependencyTreeStatic = () => true;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
    });
  });

  describe('when module implements OnApplicationBootstrap in the children', () => {
    class Test implements OnApplicationBootstrap {
      onApplicationBootstrap() {}
    }

    it('should call onApplicationBootstrap when it is a static tree', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
      });
      wrapper.isDependencyTreeStatic = () => true;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
      expect(instance.onApplicationBootstrap).toBeCalled();
    });

    it('should not call onApplicationBootstrap when it is not a static tree', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
      });
      wrapper.isDependencyTreeStatic = () => false;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
      expect(instance.onApplicationBootstrap).not.toBeCalled();
    });
  });

  describe('when module implements OnApplicationBootstrap in the children async', () => {
    class Test implements OnApplicationBootstrap {
      async onApplicationBootstrap() {
        await Promise.resolve();
      }
    }

    it('should await the call', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
      });
      wrapper.isDependencyTreeStatic = () => true;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
    });
  });

  describe('when module implements OnApplicationBootstrap in transient providers', () => {
    class Test implements OnApplicationBootstrap {
      onApplicationBootstrap() {}
    }

    it('should call onApplicationBootstrap when it is a static tree', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
        scope: Scope.TRANSIENT,
      });
      wrapper.isDependencyTreeStatic = () => true;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
      expect(instance.onApplicationBootstrap).toBeCalled();
    });

    it('should not call onApplicationBootstrap when it is not a static tree', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
        scope: Scope.TRANSIENT,
      });
      wrapper.isDependencyTreeStatic = () => false;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
      expect(instance.onApplicationBootstrap).not.toBeCalled();
    });
  });

  describe('when module implements OnApplicationBootstrap in transient providers async', () => {
    class Test implements OnApplicationBootstrap {
      async onApplicationBootstrap() {
        await Promise.resolve();
      }
    }

    it('should await the call', async () => {
      const instance = new Test();
      const wrapper = new InstanceWrapper({
        instance,
        metatype: Test,
        name: Test.name,
        scope: Scope.TRANSIENT,
      });
      wrapper.isDependencyTreeStatic = () => true;

      const providers = new Map();
      providers.set('key', wrapper);
      moduleRef.providers = providers;

      const result = await callModuleBootstrapHook(moduleRef);
      expect(result).toBeUndefined();
    });
  });
});

class TestModule {}
class TestTestModule {}