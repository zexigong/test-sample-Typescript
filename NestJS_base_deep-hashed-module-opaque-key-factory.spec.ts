import { DeepHashedModuleOpaqueKeyFactory } from '../../../../core/injector/opaque-key-factory/deep-hashed-module-opaque-key-factory';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Type } from '@nestjs/common/interfaces/type.interface';

jest.mock('@nestjs/common/services/logger.service');
jest.mock('@nestjs/common/utils/random-string-generator.util');

describe('DeepHashedModuleOpaqueKeyFactory', () => {
  let factory: DeepHashedModuleOpaqueKeyFactory;

  beforeEach(() => {
    factory = new DeepHashedModuleOpaqueKeyFactory();
    (randomStringGenerator as jest.Mock).mockReturnValue('random-id');
  });

  describe('createForStatic', () => {
    it('should return the same hash for identical static modules', () => {
      class TestModule {}
      const key1 = factory.createForStatic(TestModule);
      const key2 = factory.createForStatic(TestModule);

      expect(key1).toBe(key2);
    });

    it('should return different hashes for different static modules', () => {
      class TestModule1 {}
      class TestModule2 {}

      const key1 = factory.createForStatic(TestModule1);
      const key2 = factory.createForStatic(TestModule2);

      expect(key1).not.toBe(key2);
    });
  });

  describe('createForDynamic', () => {
    it('should return a hash for a dynamic module with metadata', () => {
      class TestModule {}
      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        imports: [],
        providers: [],
      };

      const hash = factory.createForDynamic(TestModule, dynamicMetadata);
      expect(typeof hash).toBe('string');
    });

    it('should log a warning if serialization takes too long', () => {
      jest.spyOn(global, 'performance', 'get').mockReturnValue({
        now: jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(20),
      });

      class TestModule {}
      const dynamicMetadata: Omit<DynamicModule, 'module'> = {
        imports: [],
        providers: [],
      };

      factory.createForDynamic(TestModule, dynamicMetadata);

      expect(factory['logger'].warn).toHaveBeenCalledWith(
        expect.stringContaining('is taking 20.00ms to serialize')
      );
    });
  });

  describe('getStringifiedOpaqueToken', () => {
    it('should stringify an opaque token correctly', () => {
      const opaqueToken = { key: 'value' };
      const result = factory.getStringifiedOpaqueToken(opaqueToken);

      expect(result).toBe('{"key":"value"}');
    });

    it('should return an empty string for undefined tokens', () => {
      const result = factory.getStringifiedOpaqueToken(undefined);

      expect(result).toBe('');
    });
  });

  describe('getModuleId', () => {
    it('should return a consistent module ID for the same module', () => {
      class TestModule {}

      const id1 = factory.getModuleId(TestModule);
      const id2 = factory.getModuleId(TestModule);

      expect(id1).toBe(id2);
    });

    it('should generate a new module ID for a new module', () => {
      class TestModule1 {}
      class TestModule2 {}

      const id1 = factory.getModuleId(TestModule1);
      const id2 = factory.getModuleId(TestModule2);

      expect(id1).not.toBe(id2);
    });
  });

  describe('getModuleName', () => {
    it('should return the name of the module', () => {
      class TestModule {}

      const name = factory.getModuleName(TestModule);
      expect(name).toBe('TestModule');
    });
  });
});