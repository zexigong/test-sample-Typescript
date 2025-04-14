import { Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { performance } from 'perf_hooks';
import { DeepHashedModuleOpaqueKeyFactory } from '../../../../core/injector/opaque-key-factory/deep-hashed-module-opaque-key-factory';
import { randomStringGenerator } from '../../../../common/utils/random-string-generator.util';

describe('DeepHashedModuleOpaqueKeyFactory', () => {
  let factory: DeepHashedModuleOpaqueKeyFactory;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger(DeepHashedModuleOpaqueKeyFactory.name, {
      timestamp: true,
    });
    factory = new DeepHashedModuleOpaqueKeyFactory();
    factory['logger'] = logger;
  });

  describe('createForStatic', () => {
    it('should return a hashed string for a static module', () => {
      class StaticModule {}
      const moduleName = StaticModule.name;
      const moduleId = randomStringGenerator();
      factory['moduleIdsCache'].set(StaticModule, moduleId);

      const key = `${moduleId}_${moduleName}`;
      const expectedHash = createHash('sha256').update(key).digest('hex');

      expect(factory.createForStatic(StaticModule)).toBe(expectedHash);
    });

    it('should return cached hash for a static module', () => {
      class StaticModule {}
      const moduleName = StaticModule.name;
      const moduleId = randomStringGenerator();
      factory['moduleIdsCache'].set(StaticModule, moduleId);

      const key = `${moduleId}_${moduleName}`;
      const expectedHash = createHash('sha256').update(key).digest('hex');
      factory['moduleTokenCache'].set(key, expectedHash);

      expect(factory.createForStatic(StaticModule)).toBe(expectedHash);
    });
  });

  describe('createForDynamic', () => {
    it('should return a hashed string for a dynamic module', () => {
      class DynamicModule {}
      const moduleId = randomStringGenerator();
      factory['moduleIdsCache'].set(DynamicModule, moduleId);

      const moduleName = DynamicModule.name;
      const dynamicMetadata = { providers: [] };
      const opaqueToken = {
        id: moduleId,
        module: moduleName,
        dynamic: dynamicMetadata,
      };
      const opaqueTokenString = factory.getStringifiedOpaqueToken(opaqueToken);
      const expectedHash = createHash('sha256').update(opaqueTokenString).digest('hex');

      expect(factory.createForDynamic(DynamicModule, dynamicMetadata)).toBe(expectedHash);
    });

    it('should log a warning if serialization time exceeds threshold', () => {
      class DynamicModule {}
      const moduleId = randomStringGenerator();
      factory['moduleIdsCache'].set(DynamicModule, moduleId);

      const moduleName = DynamicModule.name;
      const dynamicMetadata = { providers: [] };
      const opaqueToken = {
        id: moduleId,
        module: moduleName,
        dynamic: dynamicMetadata,
      };

      jest.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(15);
      const loggerSpy = jest.spyOn(logger, 'warn');

      factory.createForDynamic(DynamicModule, dynamicMetadata);

      expect(loggerSpy).toHaveBeenCalledWith(
        `The module "${moduleName}" is taking 15.00ms to serialize, this may be caused by larger objects statically assigned to the module. Consider changing the "moduleIdGeneratorAlgorithm" option to "reference" to improve the performance.`,
      );
    });
  });

  describe('getStringifiedOpaqueToken', () => {
    it('should return a JSON string of the opaque token', () => {
      const opaqueToken = { test: 'test' };
      const expectedString = JSON.stringify(opaqueToken);

      expect(factory.getStringifiedOpaqueToken(opaqueToken)).toBe(expectedString);
    });

    it('should return an empty string if opaque token is undefined', () => {
      expect(factory.getStringifiedOpaqueToken(undefined)).toBe('');
    });
  });

  describe('getModuleId', () => {
    it('should return a cached module ID if it exists', () => {
      class Module {}
      const moduleId = randomStringGenerator();
      factory['moduleIdsCache'].set(Module, moduleId);

      expect(factory.getModuleId(Module)).toBe(moduleId);
    });

    it('should generate a new module ID if none exists', () => {
      class Module {}
      const moduleId = randomStringGenerator();
      jest.spyOn(factory, 'getModuleId').mockReturnValue(moduleId);

      expect(factory.getModuleId(Module)).toBe(moduleId);
    });
  });

  describe('getModuleName', () => {
    it('should return the name of the module', () => {
      class Module {}
      expect(factory.getModuleName(Module)).toBe(Module.name);
    });
  });
});