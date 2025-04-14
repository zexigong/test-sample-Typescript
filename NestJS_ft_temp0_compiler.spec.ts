import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ModuleCompiler } from '../../injector/compiler';
import { ModuleOpaqueKeyFactory } from '../../injector/opaque-key-factory/interfaces/module-opaque-key-factory.interface';

describe('ModuleCompiler', () => {
  let moduleCompiler: ModuleCompiler;
  let moduleOpaqueKeyFactory: ModuleOpaqueKeyFactory;

  beforeEach(() => {
    moduleOpaqueKeyFactory = {
      createForStatic: jest.fn(),
      createForDynamic: jest.fn(),
    };
    moduleCompiler = new ModuleCompiler(moduleOpaqueKeyFactory);
  });

  describe('compile', () => {
    it('should compile a static module', async () => {
      class TestModule {}

      const token = 'static-token';
      jest
        .spyOn(moduleOpaqueKeyFactory, 'createForStatic')
        .mockReturnValue(token);

      const result = await moduleCompiler.compile(TestModule);

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: undefined,
        token,
      });
      expect(moduleOpaqueKeyFactory.createForStatic).toHaveBeenCalledWith(
        TestModule,
        TestModule,
      );
    });

    it('should compile a dynamic module', async () => {
      class TestModule {}

      const dynamicModule: DynamicModule = {
        module: TestModule,
        providers: [],
      };

      const token = 'dynamic-token';
      jest
        .spyOn(moduleOpaqueKeyFactory, 'createForDynamic')
        .mockReturnValue(token);

      const result = await moduleCompiler.compile(dynamicModule);

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: { providers: [] },
        token,
      });
      expect(moduleOpaqueKeyFactory.createForDynamic).toHaveBeenCalledWith(
        TestModule,
        { providers: [] },
        dynamicModule,
      );
    });

    it('should compile a forward reference', async () => {
      class TestModule {}

      const forwardReference: ForwardReference = {
        forwardRef: () => TestModule,
      };

      const token = 'forward-ref-token';
      jest
        .spyOn(moduleOpaqueKeyFactory, 'createForStatic')
        .mockReturnValue(token);

      const result = await moduleCompiler.compile(forwardReference);

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: undefined,
        token,
      });
      expect(moduleOpaqueKeyFactory.createForStatic).toHaveBeenCalledWith(
        TestModule,
        forwardReference,
      );
    });

    it('should compile a promise of a dynamic module', async () => {
      class TestModule {}

      const dynamicModule: DynamicModule = {
        module: TestModule,
        providers: [],
      };

      const token = 'dynamic-token';
      jest
        .spyOn(moduleOpaqueKeyFactory, 'createForDynamic')
        .mockReturnValue(token);

      const result = await moduleCompiler.compile(Promise.resolve(dynamicModule));

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: { providers: [] },
        token,
      });
      expect(moduleOpaqueKeyFactory.createForDynamic).toHaveBeenCalledWith(
        TestModule,
        { providers: [] },
        dynamicModule,
      );
    });
  });

  describe('extractMetadata', () => {
    it('should extract metadata from a static module', () => {
      class TestModule {}

      const result = moduleCompiler.extractMetadata(TestModule);

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: undefined,
      });
    });

    it('should extract metadata from a dynamic module', () => {
      class TestModule {}

      const dynamicModule: DynamicModule = {
        module: TestModule,
        providers: [],
      };

      const result = moduleCompiler.extractMetadata(dynamicModule);

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: { providers: [] },
      });
    });

    it('should extract metadata from a forward reference', () => {
      class TestModule {}

      const forwardReference: ForwardReference = {
        forwardRef: () => TestModule,
      };

      const result = moduleCompiler.extractMetadata(forwardReference);

      expect(result).toEqual({
        type: TestModule,
        dynamicMetadata: undefined,
      });
    });
  });

  describe('isDynamicModule', () => {
    it('should return true for a dynamic module', () => {
      class TestModule {}

      const dynamicModule: DynamicModule = {
        module: TestModule,
        providers: [],
      };

      const result = moduleCompiler.isDynamicModule(dynamicModule);

      expect(result).toBe(true);
    });

    it('should return false for a static module', () => {
      class TestModule {}

      const result = moduleCompiler.isDynamicModule(TestModule);

      expect(result).toBe(false);
    });

    it('should return false for a forward reference', () => {
      class TestModule {}

      const forwardReference: ForwardReference = {
        forwardRef: () => TestModule,
      };

      const result = moduleCompiler.isDynamicModule(forwardReference);

      expect(result).toBe(false);
    });
  });
});