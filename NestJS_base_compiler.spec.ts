import { ModuleCompiler } from '../../injector/compiler';
import { ModuleOpaqueKeyFactory } from '../../injector/opaque-key-factory/interfaces/module-opaque-key-factory.interface';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common/interfaces';

class MockModuleOpaqueKeyFactory implements ModuleOpaqueKeyFactory {
  createForStatic(moduleCls: Type, originalRef: Type | ForwardReference): string {
    return `static-${moduleCls.name}`;
  }
  
  createForDynamic(
    moduleCls: Type<unknown>,
    dynamicMetadata: Omit<DynamicModule, 'module'>,
    originalRef: DynamicModule | ForwardReference
  ): string {
    return `dynamic-${moduleCls.name}`;
  }
}

describe('ModuleCompiler', () => {
  let moduleCompiler: ModuleCompiler;
  let moduleOpaqueKeyFactory: ModuleOpaqueKeyFactory;

  beforeEach(() => {
    moduleOpaqueKeyFactory = new MockModuleOpaqueKeyFactory();
    moduleCompiler = new ModuleCompiler(moduleOpaqueKeyFactory);
  });

  describe('compile', () => {
    it('should compile a static module', async () => {
      class TestModule {}

      const result = await moduleCompiler.compile(TestModule);

      expect(result.type).toBe(TestModule);
      expect(result.dynamicMetadata).toBeUndefined();
      expect(result.token).toBe('static-TestModule');
    });

    it('should compile a dynamic module', async () => {
      const dynamicModule: DynamicModule = {
        module: class TestDynamicModule {},
        imports: [],
      };

      const result = await moduleCompiler.compile(dynamicModule);

      expect(result.type).toBe(dynamicModule.module);
      expect(result.dynamicMetadata).toEqual({ imports: [] });
      expect(result.token).toBe('dynamic-TestDynamicModule');
    });

    it('should compile a forward reference', async () => {
      const forwardRef: ForwardReference = {
        forwardRef: () => class TestForwardModule {}
      };

      const result = await moduleCompiler.compile(forwardRef);

      expect(result.type).toBe(forwardRef.forwardRef());
      expect(result.dynamicMetadata).toBeUndefined();
      expect(result.token).toBe('static-TestForwardModule');
    });

    it('should compile a dynamic module promise', async () => {
      const dynamicModule: DynamicModule = {
        module: class TestAsyncDynamicModule {},
        providers: [],
      };

      const result = await moduleCompiler.compile(Promise.resolve(dynamicModule));

      expect(result.type).toBe(dynamicModule.module);
      expect(result.dynamicMetadata).toEqual({ providers: [] });
      expect(result.token).toBe('dynamic-TestAsyncDynamicModule');
    });
  });

  describe('extractMetadata', () => {
    it('should extract metadata from static module', () => {
      class TestModule {}

      const result = moduleCompiler.extractMetadata(TestModule);

      expect(result.type).toBe(TestModule);
      expect(result.dynamicMetadata).toBeUndefined();
    });

    it('should extract metadata from dynamic module', () => {
      const dynamicModule: DynamicModule = {
        module: class TestDynamicModule {},
        controllers: [],
      };

      const result = moduleCompiler.extractMetadata(dynamicModule);

      expect(result.type).toBe(dynamicModule.module);
      expect(result.dynamicMetadata).toEqual({ controllers: [] });
    });
  });

  describe('isDynamicModule', () => {
    it('should return true for dynamic module', () => {
      const dynamicModule: DynamicModule = {
        module: class TestDynamicModule {},
      };

      const result = moduleCompiler.isDynamicModule(dynamicModule);

      expect(result).toBe(true);
    });

    it('should return false for static module', () => {
      class TestModule {}

      const result = moduleCompiler.isDynamicModule(TestModule);

      expect(result).toBe(false);
    });

    it('should return false for forward reference', () => {
      const forwardRef: ForwardReference = {
        forwardRef: () => class TestForwardModule {}
      };

      const result = moduleCompiler.isDynamicModule(forwardRef);

      expect(result).toBe(false);
    });
  });
});