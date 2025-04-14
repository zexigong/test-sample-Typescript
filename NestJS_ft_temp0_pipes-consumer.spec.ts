import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { PipesConsumer } from '../../../core/pipes/pipes-consumer';

describe('PipesConsumer', () => {
  let consumer: PipesConsumer;
  let transformFn: jest.Mock;
  let pipe: PipeTransform;
  let value: any;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    consumer = new PipesConsumer();
    transformFn = jest.fn();
    pipe = { transform: transformFn };
    value = {};
    metadata = {
      metatype: null,
      type: RouteParamtypes.BODY,
      data: null,
    };
  });

  describe('apply', () => {
    it('should call "exchangeEnumForString" with expected params', async () => {
      const exchangeEnumForStringSpy = jest.spyOn(
        (consumer as any).paramsTokenFactory,
        'exchangeEnumForString',
      );
      await consumer.apply(value, metadata, [pipe]);
      expect(exchangeEnumForStringSpy).toHaveBeenCalledWith(
        RouteParamtypes.BODY,
      );
    });

    it('should call "applyPipes" with expected params', async () => {
      const applyPipesSpy = jest.spyOn(consumer, 'applyPipes');
      await consumer.apply(value, metadata, [pipe]);
      expect(applyPipesSpy).toHaveBeenCalledWith(
        value,
        {
          metatype: metadata.metatype,
          type: 'body',
          data: metadata.data,
        },
        [pipe],
      );
    });
  });

  describe('applyPipes', () => {
    it('should call "transform" with expected params', async () => {
      await consumer.applyPipes(value, metadata, [pipe]);
      expect(transformFn).toHaveBeenCalledWith(value, metadata);
    });

    it('should call "transform" with expected params (when more than one pipe)', async () => {
      const transformFn2 = jest.fn();
      const pipe2 = { transform: transformFn2 };
      await consumer.applyPipes(value, metadata, [pipe, pipe2]);
      expect(transformFn).toHaveBeenCalledWith(value, metadata);
      expect(transformFn2).toHaveBeenCalledWith(value, metadata);
    });

    it('should call "transform" with expected params (when more than one pipe and first pipe returns value)', async () => {
      const newValue = {};
      transformFn.mockReturnValue(newValue);
      const transformFn2 = jest.fn();
      const pipe2 = { transform: transformFn2 };
      await consumer.applyPipes(value, metadata, [pipe, pipe2]);
      expect(transformFn).toHaveBeenCalledWith(value, metadata);
      expect(transformFn2).toHaveBeenCalledWith(newValue, metadata);
    });

    it('should return transformed value', async () => {
      const newValue = {};
      transformFn.mockReturnValue(newValue);
      const result = await consumer.applyPipes(value, metadata, [pipe]);
      expect(result).toBe(newValue);
    });

    it('should return transformed value (when more than one pipe)', async () => {
      const newValue = {};
      transformFn.mockReturnValue(newValue);
      const transformFn2 = jest.fn();
      const pipe2 = { transform: transformFn2 };
      const result = await consumer.applyPipes(value, metadata, [pipe, pipe2]);
      expect(result).toBe(newValue);
    });

    it('should return transformed value (when more than one pipe and first pipe returns value)', async () => {
      const newValue = {};
      const newValue2 = {};
      transformFn.mockReturnValue(newValue);
      const transformFn2 = jest.fn().mockReturnValue(newValue2);
      const pipe2 = { transform: transformFn2 };
      const result = await consumer.applyPipes(value, metadata, [pipe, pipe2]);
      expect(result).toBe(newValue2);
    });
  });
});