import { DynamicModule, ForwardReference, Type } from '@nestjs/common/interfaces';
import { ModuleOpaqueKeyFactory } from '../../../interfaces/module-opaque-key-factory.interface';
import { ModuleCompiler, ModuleFactory } from '../../../compiler';

class ModuleOpaqueKeyFactoryMock implements ModuleOpaqueKeyFactory {
  createForStatic(moduleCls: Type, originalRef: Type | ForwardReference): string {
    return moduleCls.name;
  }
  createForDynamic(
    moduleCls: Type<unknown>,
    dynamicMetadata: Omit<DynamicModule, 'module'>,
    originalRef: DynamicModule | ForwardReference,
  ): string {
    return moduleCls.name;
  }
}

describe('ModuleCompiler', () => {
  let moduleCompiler: ModuleCompiler;
  let moduleOpaqueKeyFactory: ModuleOpaqueKeyFactoryMock;

  beforeEach(() => {
    moduleOpaqueKeyFactory = new ModuleOpaqueKeyFactoryMock();
    moduleCompiler = new ModuleCompiler(moduleOpaqueKeyFactory);
  });

  describe('compile', () => {
    class TestModule {}
    class TestModule2 {}

    it('should compile static module', async () => {
      const moduleCls = TestModule;

      const result = await moduleCompiler.compile(moduleCls);
      const expectedResult: ModuleFactory = {
        type: moduleCls,
        token: moduleCls.name,
      };
      expect(result).toEqual(expectedResult);
    });

    it('should compile dynamic module', async () => {
      const moduleCls = TestModule2;
      const dynamicModule: DynamicModule = {
        module: moduleCls,
        controllers: ['Test'],
      };

      const result = await moduleCompiler.compile(dynamicModule);
      const expectedResult: ModuleFactory = {
        type: moduleCls,
        token: moduleCls.name,
        dynamicMetadata: dynamicModule,
      };
      expect(result).toEqual(expectedResult);
    });

    it('should compile dynamic module (promise)', async () => {
      const moduleCls = TestModule2;
      const dynamicModule: DynamicModule = {
        module: moduleCls,
        controllers: ['Test'],
      };

      const result = await moduleCompiler.compile(Promise.resolve(dynamicModule));
      const expectedResult: ModuleFactory = {
        type: moduleCls,
        token: moduleCls.name,
        dynamicMetadata: dynamicModule,
      };
      expect(result).toEqual(expectedResult);
    });

    it('should compile forward reference', async () => {
      const forwardReference: ForwardReference = () => TestModule;

      const result = await moduleCompiler.compile(forwardReference);
      const expectedResult: ModuleFactory = {
        type: TestModule,
        token: TestModule.name,
      };
      expect(result).toEqual(expectedResult);
    });

    it('should compile dynamic module', async () => {
      const moduleCls = TestModule2;
      const dynamicModule: DynamicModule = {
        module: moduleCls,
        controllers: ['Test'],
      };

      const result = await moduleCompiler.compile(dynamicModule);
      const expectedResult: ModuleFactory = {
        type: moduleCls,
        token: moduleCls.name,
        dynamicMetadata: dynamicModule,
      };
      expect(result).toEqual(expectedResult);
    });
  });
});