import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { DeepHashedModuleOpaqueKeyFactory } from '../../../../core/injector/opaque-key-factory/deep-hashed-module-opaque-key-factory';

describe('DeepHashedModuleOpaqueKeyFactory', () => {
  let factory: DeepHashedModuleOpaqueKeyFactory;

  beforeEach(() => {
    factory = new DeepHashedModuleOpaqueKeyFactory();
  });

  describe('createForStatic', () => {
    it('should return a unique opaque key for a static module', () => {
      class TestModule {}
      const key = factory.createForStatic(TestModule);
      expect(key).toBeDefined();
    });

    it('should return the same key for the same static module', () => {
      class TestModule {}
      const key1 = factory.createForStatic(TestModule);
      const key2 = factory.createForStatic(TestModule);
      expect(key1).toEqual(key2);
    });

    it('should return different keys for different static modules', () => {
      class TestModule1 {}
      class TestModule2 {}
      const key1 = factory.createForStatic(TestModule1);
      const key2 = factory.createForStatic(TestModule2);
      expect(key1).not.toEqual(key2);
    });
  });

  describe('createForDynamic', () => {
    it('should return a unique opaque key for a dynamic module', () => {
      class TestModule {}
      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        providers: [],
      };
      const key = factory.createForDynamic(TestModule, dynamicMetadata);
      expect(key).toBeDefined();
    });

    it('should return the same key for the same dynamic module with the same metadata', () => {
      class TestModule {}
      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        providers: [],
      };
      const key1 = factory.createForDynamic(TestModule, dynamicMetadata);
      const key2 = factory.createForDynamic(TestModule, dynamicMetadata);
      expect(key1).toEqual(key2);
    });

    it('should return different keys for the same dynamic module with different metadata', () => {
      class TestModule {}
      const dynamicMetadata1: Omit<DynamicModule, 'module'> = {
        providers: [],
      };
      const dynamicMetadata2: Omit<DynamicModule, 'module'> = {
        providers: [{ provide: 'TOKEN', useValue: 'value' }],
      };
      const key1 = factory.createForDynamic(TestModule, dynamicMetadata1);
      const key2 = factory.createForDynamic(TestModule, dynamicMetadata2);
      expect(key1).not.toEqual(key2);
    });

    it('should return different keys for different dynamic modules', () => {
      class TestModule1 {}
      class TestModule2 {}
      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        providers: [],
      };
      const key1 = factory.createForDynamic(TestModule1, dynamicMetadata);
      const key2 = factory.createForDynamic(TestModule2, dynamicMetadata);
      expect(key1).not.toEqual(key2);
    });
  });

  describe('getStringifiedOpaqueToken', () => {
    it('should return a stringified opaque token', () => {
      const opaqueToken = { id: '123', module: 'TestModule' };
      const stringifiedToken = factory.getStringifiedOpaqueToken(opaqueToken);
      expect(stringifiedToken).toBeDefined();
    });

    it('should return an empty string for undefined opaque token', () => {
      const stringifiedToken = factory.getStringifiedOpaqueToken(undefined);
      expect(stringifiedToken).toEqual('');
    });
  });

  describe('getModuleId', () => {
    it('should return a unique module ID', () => {
      class TestModule {}
      const moduleId = factory.getModuleId(TestModule);
      expect(moduleId).toBeDefined();
    });

    it('should return the same module ID for the same module', () => {
      class TestModule {}
      const moduleId1 = factory.getModuleId(TestModule);
      const moduleId2 = factory.getModuleId(TestModule);
      expect(moduleId1).toEqual(moduleId2);
    });

    it('should return different module IDs for different modules', () => {
      class TestModule1 {}
      class TestModule2 {}
      const moduleId1 = factory.getModuleId(TestModule1);
      const moduleId2 = factory.getModuleId(TestModule2);
      expect(moduleId1).not.toEqual(moduleId2);
    });
  });

  describe('getModuleName', () => {
    it('should return the module name', () => {
      class TestModule {}
      const moduleName = factory.getModuleName(TestModule);
      expect(moduleName).toEqual('TestModule');
    });
  });
});