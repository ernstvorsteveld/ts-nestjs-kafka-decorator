import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducer } from './util/kafka/kafka.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const headers: Record<string, any> = {
      correlationId: '123-abc',
      source: 'web-api',
      timestamp: 1700000000,
      retryEnabled: true,
    };
    this.send(headers, 'my payload');
    return this.appService.getHello();
  }

  @KafkaProducer('local-craft', 'topic-test')
  send<T>(headers: Record<string, any>, payload: T): void {
    console.log('Order processed locally.');
  }
}
