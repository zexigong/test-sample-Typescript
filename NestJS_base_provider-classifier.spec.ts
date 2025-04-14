import {
  ClassProvider,
  FactoryProvider,
  ValueProvider,
  Provider,
} from '@nestjs/common';
import {
  isClassProvider,
  isValueProvider,
  isFactoryProvider,
} from '../../../../injector/helpers/provider-classifier';

describe('Provider Classifier Helpers', () => {
  describe('isClassProvider', () => {
    it('should return true if provider is a ClassProvider', () => {
      const classProvider: ClassProvider = { provide: 'test', useClass: class {} };
      expect(isClassProvider(classProvider)).toBe(true);
    });

    it('should return false if provider is not a ClassProvider', () => {
      const valueProvider: ValueProvider = { provide: 'test', useValue: 'value' };
      expect(isClassProvider(valueProvider)).toBe(false);
    });
  });

  describe('isValueProvider', () => {
    it('should return true if provider is a ValueProvider', () => {
      const valueProvider: ValueProvider = { provide: 'test', useValue: 'value' };
      expect(isValueProvider(valueProvider)).toBe(true);
    });

    it('should return false if provider is not a ValueProvider', () => {
      const factoryProvider: FactoryProvider = { provide: 'test', useFactory: () => 'value' };
      expect(isValueProvider(factoryProvider)).toBe(false);
    });

    it('should return false if useValue is undefined', () => {
      const provider: ValueProvider = { provide: 'test', useValue: undefined };
      expect(isValueProvider(provider)).toBe(false);
    });
  });

  describe('isFactoryProvider', () => {
    it('should return true if provider is a FactoryProvider', () => {
      const factoryProvider: FactoryProvider = { provide: 'test', useFactory: () => 'value' };
      expect(isFactoryProvider(factoryProvider)).toBe(true);
    });

    it('should return false if provider is not a FactoryProvider', () => {
      const classProvider: ClassProvider = { provide: 'test', useClass: class {} };
      expect(isFactoryProvider(classProvider)).toBe(false);
    });
  });
});