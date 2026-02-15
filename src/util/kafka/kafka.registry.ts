import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaProducerService } from './kafka.client';
import { ClusterTopic, ReadProperties } from './kafka.read.properties';

export class KafkaRegistry implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    this.instances.forEach((instance) => {
      instance.onModuleInit();
    });
  }

  onModuleDestroy() {
    this.instances.forEach((instance) => {
      instance.onModuleDestroy();
    });
  }
  public static INSTANCE: KafkaRegistry = new KafkaRegistry();

  private readonly instances = new Map<string, KafkaProducerService>();

  register(cluster: string, name: string, instance: KafkaProducerService) {
    this.instances.set(this.getName(cluster, name), instance);
  }

  get(cluster: string, name: string): KafkaProducerService {
    const instance = this.instances.get(this.getName(cluster, name));
    if (!instance) {
      throw new Error(
        `Kafka instance for cluster "${cluster}" and name "${name}" not found in registry.`,
      );
    }
    return instance;
  }

  getName(cluster: string, name: string): string {
    return cluster + '::' + name;
  }
}

export class KafkaRegistryBuilder {
  private readonly kafkaRegistry = KafkaRegistry.INSTANCE;
  private clusterTopics: ClusterTopic[] = [];

  constructor(private file: string) {
    const readProperties: ReadProperties = new ReadProperties(file);
    this.clusterTopics = readProperties.fromProperties();
    return this;
  }

  build(): KafkaRegistry {
    this.clusterTopics.forEach((clusterTopic) => {
      const cluster = clusterTopic.getCluster();
      const brokers: string[] = clusterTopic.getBrokers();
      const topic = clusterTopic.getTopic();

      const producer = new KafkaProducerService(topic, brokers);
      this.kafkaRegistry.register(cluster, topic, producer);
    });
    return this.kafkaRegistry;
  }
}
