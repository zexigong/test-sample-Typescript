import { ByReferenceModuleOpaqueKeyFactory } from '../../../injector/opaque-key-factory/by-reference-module-opaque-key-factory';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { createHash } from 'crypto';

jest.mock('@nestjs/common/utils/random-string-generator.util');
jest.mock('crypto');

describe('ByReferenceModuleOpaqueKeyFactory', () => {
  let factory: ByReferenceModuleOpaqueKeyFactory;
  const mockRandomString = 'randomString';
  const mockHashString = 'hashedString';

  beforeEach(() => {
    (randomStringGenerator as jest.Mock).mockReturnValue(mockRandomString);
    (createHash as jest.Mock).mockImplementation(() => ({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockHashString),
    }));
  });

  describe('createForStatic', () => {
    it('should generate a random key when the strategy is random', () => {
      factory = new ByReferenceModuleOpaqueKeyFactory({ keyGenerationStrategy: 'random' });
      const moduleCls = class TestModule {};
      const key = factory.createForStatic(moduleCls);

      expect(key).toBe(mockRandomString);
    });

    it('should generate a shallow key when the strategy is shallow', () => {
      factory = new ByReferenceModuleOpaqueKeyFactory({ keyGenerationStrategy: 'shallow' });
      const moduleCls = class TestModule {};
      const key = factory.createForStatic(moduleCls);

      expect(key).toBe(`${mockRandomString}:${mockHashString}`);
    });
  });

  describe('createForDynamic', () => {
    it('should generate a random key for dynamic modules when the strategy is random', () => {
      factory = new ByReferenceModuleOpaqueKeyFactory({ keyGenerationStrategy: 'random' });
      const moduleCls = class TestModule {};
      const dynamicMetadata = { providers: [] };
      const key = factory.createForDynamic(moduleCls, dynamicMetadata, dynamicMetadata as any);

      expect(key).toBe(mockRandomString);
    });

    it('should generate a shallow key for dynamic modules when the strategy is shallow', () => {
      factory = new ByReferenceModuleOpaqueKeyFactory({ keyGenerationStrategy: 'shallow' });
      const moduleCls = class TestModule {};
      const dynamicMetadata = { providers: [] };
      const key = factory.createForDynamic(moduleCls, dynamicMetadata, dynamicMetadata as any);

      expect(key).toBe(`${mockRandomString}:${mockHashString}`);
    });
  });

  describe('getOrCreateModuleId', () => {
    it('should return existing moduleId if present', () => {
      factory = new ByReferenceModuleOpaqueKeyFactory();
      const moduleCls = class TestModule {};
      const originalRef: any = { [Symbol.for('K_MODULE_ID')]: 'existingId' };
      
      const key = factory['getOrCreateModuleId'](moduleCls, undefined, originalRef);

      expect(key).toBe('existingId');
    });
  });
});