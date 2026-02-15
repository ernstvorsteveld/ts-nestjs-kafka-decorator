import { Logger } from '@nestjs/common';
import { KafkaRegistry } from './kafka.registry';

export function KafkaProducer(cluster: string, topic: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod: unknown = descriptor.value;
    const logger = new Logger('KafkaProducer');

    logger.error('hi');

    descriptor.value = async function (...args: any[]) {
      try {
        const headers: Record<string, any> = args[0] as Record<string, any>;
        const payload: unknown = args[1];

        logger.debug(
          `[KafkaProducer] Cluster: ${cluster}, Topic: ${topic}`,
          headers,
          payload,
        );
        const producer = KafkaRegistry.INSTANCE.get(cluster, topic);
        await producer.send(topic, headers, payload);
      } catch (error) {
        console.error(
          `[KafkaProducer Error] Cluster: ${cluster}, Topic: ${topic}`,
          error,
        );
      }

      if (typeof originalMethod !== 'function') {
        return;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
