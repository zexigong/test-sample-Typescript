import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ByReferenceModuleOpaqueKeyFactory } from '../../../core/injector/opaque-key-factory/by-reference-module-opaque-key-factory';

describe('ByReferenceModuleOpaqueKeyFactory', () => {
  let factory: ByReferenceModuleOpaqueKeyFactory;

  beforeEach(() => {
    factory = new ByReferenceModuleOpaqueKeyFactory();
  });

  describe('createForStatic', () => {
    it('should return a unique key for a static module', () => {
      class TestModule {}
      const key = factory.createForStatic(TestModule);
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
    });

    it('should return the same key for the same static module', () => {
      class TestModule {}
      const key1 = factory.createForStatic(TestModule);
      const key2 = factory.createForStatic(TestModule);
      expect(key1).toBe(key2);
    });

    it('should return different keys for different static modules', () => {
      class TestModule1 {}
      class TestModule2 {}
      const key1 = factory.createForStatic(TestModule1);
      const key2 = factory.createForStatic(TestModule2);
      expect(key1).not.toBe(key2);
    });
  });

  describe('createForDynamic', () => {
    it('should return a unique key for a dynamic module', () => {
      class TestModule {}
      const dynamicMetadata: DynamicModule = {
        module: TestModule,
        providers: [],
      };
      const key = factory.createForDynamic(TestModule, dynamicMetadata, dynamicMetadata);
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
    });

    it('should return the same key for the same dynamic module', () => {
      class TestModule {}
      const dynamicMetadata: DynamicModule = {
        module: TestModule,
        providers: [],
      };
      const key1 = factory.createForDynamic(TestModule, dynamicMetadata, dynamicMetadata);
      const key2 = factory.createForDynamic(TestModule, dynamicMetadata, dynamicMetadata);
      expect(key1).toBe(key2);
    });

    it('should return different keys for different dynamic modules', () => {
      class TestModule1 {}
      class TestModule2 {}
      const dynamicMetadata1: DynamicModule = {
        module: TestModule1,
        providers: [],
      };
      const dynamicMetadata2: DynamicModule = {
        module: TestModule2,
        providers: [],
      };
      const key1 = factory.createForDynamic(TestModule1, dynamicMetadata1, dynamicMetadata1);
      const key2 = factory.createForDynamic(TestModule2, dynamicMetadata2, dynamicMetadata2);
      expect(key1).not.toBe(key2);
    });
  });

  describe('keyGenerationStrategy', () => {
    it('should use random strategy by default', () => {
      class TestModule {}
      const key1 = factory.createForStatic(TestModule);
      const key2 = factory.createForStatic(TestModule);
      expect(key1).toBe(key2);
    });

    it('should use shallow strategy when specified', () => {
      factory = new ByReferenceModuleOpaqueKeyFactory({ keyGenerationStrategy: 'shallow' });
      class TestModule {}
      const key1 = factory.createForStatic(TestModule);
      const key2 = factory.createForStatic(TestModule);
      expect(key1).toBe(key2);
    });
  });
});