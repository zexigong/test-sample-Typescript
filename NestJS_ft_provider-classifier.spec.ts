import {
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
} from '../../../../core/injector/helpers/provider-classifier';
import {
  ClassProvider,
  FactoryProvider,
  ValueProvider,
} from '@nestjs/common';

describe('ProviderClassifier', () => {
  describe('isClassProvider', () => {
    it('should return true if provider is a class provider', () => {
      const provider: ClassProvider = { provide: 'test', useClass: class {} };
      expect(isClassProvider(provider)).toBe(true);
    });

    it('should return false if provider is not a class provider', () => {
      const provider: ValueProvider = { provide: 'test', useValue: 'value' };
      expect(isClassProvider(provider)).toBe(false);
    });

    it('should return false if provider is not a class provider but has a falsy "useClass" property', () => {
      const provider: ClassProvider = { provide: 'test', useClass: null };
      expect(isClassProvider(provider)).toBe(false);
    });

    it('should return false if provider is a factory provider', () => {
      const provider: FactoryProvider = { provide: 'test', useFactory: () => {} };
      expect(isClassProvider(provider)).toBe(false);
    });
  });

  describe('isValueProvider', () => {
    it('should return true if provider is a value provider', () => {
      const provider: ValueProvider = { provide: 'test', useValue: 'value' };
      expect(isValueProvider(provider)).toBe(true);
    });

    it('should return false if provider is not a value provider', () => {
      const provider: ClassProvider = { provide: 'test', useClass: class {} };
      expect(isValueProvider(provider)).toBe(false);
    });

    it('should return false if provider is not a value provider but has a falsy "useValue" property', () => {
      const provider: ValueProvider = { provide: 'test', useValue: undefined };
      expect(isValueProvider(provider)).toBe(false);
    });

    it('should return false if provider is a factory provider', () => {
      const provider: FactoryProvider = { provide: 'test', useFactory: () => {} };
      expect(isValueProvider(provider)).toBe(false);
    });
  });

  describe('isFactoryProvider', () => {
    it('should return true if provider is a factory provider', () => {
      const provider: FactoryProvider = { provide: 'test', useFactory: () => {} };
      expect(isFactoryProvider(provider)).toBe(true);
    });

    it('should return false if provider is not a factory provider', () => {
      const provider: ClassProvider = { provide: 'test', useClass: class {} };
      expect(isFactoryProvider(provider)).toBe(false);
    });

    it('should return false if provider is not a factory provider but has a falsy "useFactory" property', () => {
      const provider: FactoryProvider = { provide: 'test', useFactory: null };
      expect(isFactoryProvider(provider)).toBe(false);
    });

    it('should return false if provider is a value provider', () => {
      const provider: ValueProvider = { provide: 'test', useValue: 'value' };
      expect(isFactoryProvider(provider)).toBe(false);
    });
  });
});