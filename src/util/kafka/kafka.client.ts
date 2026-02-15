import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IHeaders, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });

    this.producer = this.kafka.producer();
    this.onModuleInit();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(
    topic: string,
    headers: Record<string, any>,
    payload: any,
  ): Promise<void> {
    await this.producer.send({
      topic: topic,
      messages: [
        {
          key: 'payload',
          value: JSON.stringify(payload),
          headers: this.jsonToKafkaHeaders(headers),
        },
      ],
    });
  }

  private jsonToKafkaHeaders(json: Record<string, any>): IHeaders {
    const headers: IHeaders = {};

    for (const [key, value] of Object.entries(json)) {
      if (value === null || value === undefined) continue;

      headers[key] =
        typeof value === 'object' ? JSON.stringify(value) : String(value);
    }

    return headers;
  }
}
