import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducer } from './util/kafka/kafka.decorator';

@Injectable()
export class AppService {
  logger = new Logger('AppService');

  getHello(): string {
    const headers: Record<string, any> = {
      correlationId: '123-abc',
      source: 'web-api',
      timestamp: 1700000000,
      retryEnabled: true,
    };
    this.send(headers, 'my payload');

    return 'Hello World!';
  }

  @KafkaProducer('local-craft', 'topic-test')
  send<T>(headers: Record<string, any>, payload: T): void {
    this.logger.debug('Order processed locally.', headers, payload);
  }
}
