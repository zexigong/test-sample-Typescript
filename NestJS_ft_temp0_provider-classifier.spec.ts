import { isClassProvider, isFactoryProvider, isValueProvider } from '../../../../core/injector/helpers/provider-classifier';
import { ClassProvider, FactoryProvider, ValueProvider } from '@nestjs/common';

describe('Provider Classifier', () => {
  describe('isClassProvider', () => {
    it('should return true if provider is a ClassProvider', () => {
      const provider: ClassProvider = { provide: 'test', useClass: class {} };
      expect(isClassProvider(provider)).toBe(true);
    });

    it('should return false if provider is not a ClassProvider', () => {
      const provider = { provide: 'test', useValue: 'value' };
      expect(isClassProvider(provider)).toBe(false);
    });
  });

  describe('isValueProvider', () => {
    it('should return true if provider is a ValueProvider', () => {
      const provider: ValueProvider = { provide: 'test', useValue: 'value' };
      expect(isValueProvider(provider)).toBe(true);
    });

    it('should return false if provider is not a ValueProvider', () => {
      const provider = { provide: 'test', useClass: class {} };
      expect(isValueProvider(provider)).toBe(false);
    });
  });

  describe('isFactoryProvider', () => {
    it('should return true if provider is a FactoryProvider', () => {
      const provider: FactoryProvider = { provide: 'test', useFactory: () => 'value' };
      expect(isFactoryProvider(provider)).toBe(true);
    });

    it('should return false if provider is not a FactoryProvider', () => {
      const provider = { provide: 'test', useValue: 'value' };
      expect(isFactoryProvider(provider)).toBe(false);
    });
  });
});