import { ByReferenceModuleOpaqueKeyFactory } from '../../../core/injector/opaque-key-factory/by-reference-module-opaque-key-factory';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { createHash } from 'crypto';

jest.mock('@nestjs/common/utils/random-string-generator.util', () => ({
  randomStringGenerator: jest.fn(() => 'random-string'),
}));

describe('ByReferenceModuleOpaqueKeyFactory', () => {
  let moduleOpaqueKeyFactory: ByReferenceModuleOpaqueKeyFactory;

  beforeEach(() => {
    moduleOpaqueKeyFactory = new ByReferenceModuleOpaqueKeyFactory();
  });

  describe('createForStatic', () => {
    it('should return the same key for the same module class', () => {
      class TestModule {}

      const key1 = moduleOpaqueKeyFactory.createForStatic(TestModule);
      const key2 = moduleOpaqueKeyFactory.createForStatic(TestModule);

      expect(key1).toEqual(key2);
      expect(key1).toBe(key2);
    });

    it('should return different keys for different module classes', () => {
      class TestModule1 {}
      class TestModule2 {}

      const key1 = moduleOpaqueKeyFactory.createForStatic(TestModule1);
      const key2 = moduleOpaqueKeyFactory.createForStatic(TestModule2);

      expect(key1).not.toBe(key2);
    });

    it('should return a random key', () => {
      class TestModule {}

      const key = moduleOpaqueKeyFactory.createForStatic(TestModule);

      expect(key).toEqual('random-string');
    });
  });

  describe('createForDynamic', () => {
    it('should return the same key for the same module class and metadata', () => {
      class TestModule {}

      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        imports: [],
        exports: [],
        providers: [],
      };

      const key1 = moduleOpaqueKeyFactory.createForDynamic(
        TestModule,
        dynamicMetadata,
        dynamicMetadata,
      );
      const key2 = moduleOpaqueKeyFactory.createForDynamic(
        TestModule,
        dynamicMetadata,
        dynamicMetadata,
      );

      expect(key1).toBe(key2);
    });

    it('should return different keys for different module classes', () => {
      class TestModule1 {}
      class TestModule2 {}

      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        imports: [],
        exports: [],
        providers: [],
      };

      const key1 = moduleOpaqueKeyFactory.createForDynamic(
        TestModule1,
        dynamicMetadata,
        dynamicMetadata,
      );
      const key2 = moduleOpaqueKeyFactory.createForDynamic(
        TestModule2,
        dynamicMetadata,
        dynamicMetadata,
      );

      expect(key1).not.toBe(key2);
    });

    it('should return a random key', () => {
      class TestModule {}

      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        imports: [],
        exports: [],
        providers: [],
      };

      const key = moduleOpaqueKeyFactory.createForDynamic(
        TestModule,
        dynamicMetadata,
        dynamicMetadata,
      );

      expect(key).toEqual('random-string');
    });

    it('should return a hashed key if keyGenerationStrategy is shallow', () => {
      class TestModule {}

      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        imports: [],
        exports: [],
        providers: [],
      };

      moduleOpaqueKeyFactory = new ByReferenceModuleOpaqueKeyFactory({
        keyGenerationStrategy: 'shallow',
      });

      const key = moduleOpaqueKeyFactory.createForDynamic(
        TestModule,
        dynamicMetadata,
        dynamicMetadata,
      );

      const hash = createHash('sha256')
        .update(TestModule.name + JSON.stringify(dynamicMetadata))
        .digest('hex');

      expect(key).toEqual(`random-string:${hash}`);
    });

    it('should return a hashed key if keyGenerationStrategy is shallow and dynamicMetadata is undefined', () => {
      class TestModule {}

      moduleOpaqueKeyFactory = new ByReferenceModuleOpaqueKeyFactory({
        keyGenerationStrategy: 'shallow',
      });

      const key = moduleOpaqueKeyFactory.createForDynamic(
        TestModule,
        undefined,
        {},
      );

      const hash = createHash('sha256')
        .update(TestModule.toString())
        .digest('hex');

      expect(key).toEqual(`random-string:${hash}`);
    });
  });
});