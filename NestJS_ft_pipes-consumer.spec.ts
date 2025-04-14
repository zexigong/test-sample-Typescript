import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces';
import { ParamsTokenFactory } from '../../pipes/params-token-factory';
import { PipesConsumer } from '../../pipes/pipes-consumer';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

describe('PipesConsumer', () => {
  let consumer: PipesConsumer;
  let paramsTokenFactory: ParamsTokenFactory;

  beforeEach(() => {
    paramsTokenFactory = new ParamsTokenFactory();
    consumer = new PipesConsumer();
  });

  describe('apply', () => {
    it('should call "exchangeEnumForString" with expected arguments', async () => {
      const exchangeEnumForStringSpy = jest.spyOn(
        paramsTokenFactory,
        'exchangeEnumForString',
      );
      const type = 'custom';
      const data = 'test';
      const metatype = 'test';

      const pipes = [
        {
          transform: <T>(value: T) => value,
        },
      ];

      await consumer.apply('random', { metatype, type, data }, pipes as any);

      expect(exchangeEnumForStringSpy).toHaveBeenCalledWith(type);
    });

    it('should call "applyPipes" with expected arguments', async () => {
      const applyPipesSpy = jest.spyOn(consumer, 'applyPipes');
      const type = RouteParamtypes.BODY;
      const data = 'test';
      const metatype = 'test';

      const pipes = [
        {
          transform: <T>(value: T) => value,
        },
      ];

      await consumer.apply('random', { metatype, type, data }, pipes as any);

      expect(applyPipesSpy).toHaveBeenCalledWith('random', {
        metatype,
        type: 'body',
        data,
      });
    });
  });

  describe('applyPipes', () => {
    describe('when "transform" is async', () => {
      it('should await result and return the last result (promise)', async () => {
        const value = 'test';
        const transforms = [
          {
            transform: <T>(val: T) =>
              new Promise(resolve => resolve(val + '1')),
          },
          {
            transform: <T>(val: T) =>
              new Promise(resolve => resolve(val + '2')),
          },
        ];

        const result = await consumer.applyPipes(value, {}, transforms as any);

        expect(result).toBe(value + '1' + '2');
      });
    });

    describe('when "transform" is not async', () => {
      it('should return the last result', async () => {
        const value = 'test';
        const transforms = [
          {
            transform: <T>(val: T) => val + '1',
          },
          {
            transform: <T>(val: T) => val + '2',
          },
        ];

        const result = await consumer.applyPipes(value, {}, transforms as any);

        expect(result).toBe(value + '1' + '2');
      });
    });
  });
});