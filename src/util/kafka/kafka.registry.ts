import { KafkaProducerService } from './kafka.client';

export class KafkaRegistry {
  private static readonly instances = new Map<string, KafkaProducerService>();

  static register(
    cluster: string,
    name: string,
    instance: KafkaProducerService,
  ) {
    this.instances.set(KafkaRegistry.getName(cluster, name), instance);
  }

  static get(cluster: string, name: string): KafkaProducerService {
    const instance = this.instances.get(KafkaRegistry.getName(cluster, name));
    if (!instance) {
      throw new Error(
        `Kafka instance for cluster "${cluster}" and name "${name}" not found in registry.`,
      );
    }
    return instance;
  }

  private static getName(cluster: string, name: string): string {
    return cluster + '::' + name;
  }
}
