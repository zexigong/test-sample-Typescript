import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { PipesConsumer } from '../../pipes/pipes-consumer';

class TestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return `transformed-${value}`;
  }
}

describe('PipesConsumer', () => {
  let pipesConsumer: PipesConsumer;

  beforeEach(() => {
    pipesConsumer = new PipesConsumer();
  });

  describe('apply', () => {
    it('should apply pipes and transform the value', async () => {
      const testValue = 'test-value';
      const metadata: ArgumentMetadata = {
        metatype: String,
        type: RouteParamtypes.BODY,
        data: null,
      };
      const pipes: PipeTransform[] = [new TestPipe()];

      const result = await pipesConsumer.apply(testValue, metadata, pipes);

      expect(result).toBe('transformed-test-value');
    });
  });

  describe('applyPipes', () => {
    it('should apply pipes sequentially', async () => {
      const testValue = 'initial-value';
      const metadata = {
        metatype: String,
        type: 'body',
        data: null,
      };
      const pipes: PipeTransform[] = [
        new TestPipe(),
        {
          transform(value: any) {
            return `${value}-pipe2`;
          },
        },
        {
          transform(value: any) {
            return `${value}-pipe3`;
          },
        },
      ];

      const result = await pipesConsumer.applyPipes(testValue, metadata, pipes);

      expect(result).toBe('transformed-initial-value-pipe2-pipe3');
    });

    it('should return the initial value if no pipes are provided', async () => {
      const testValue = 'no-pipes';
      const metadata = {
        metatype: String,
        type: 'body',
        data: null,
      };
      const pipes: PipeTransform[] = [];

      const result = await pipesConsumer.applyPipes(testValue, metadata, pipes);

      expect(result).toBe('no-pipes');
    });
  });
});