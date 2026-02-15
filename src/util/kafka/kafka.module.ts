import { OnModuleInit } from '@nestjs/common';
// import Module from 'module';
// import { KafkaProducerService } from './kafka.client';

// @Module({})
export class KafkaModule implements OnModuleInit {
  onModuleInit() {
    // Cluster A setup
    // const clusterA = new KafkaProducerService(
    //   this.configService.get('KAFKA_A_ID'),
    //   this.configService.get('KAFKA_A_BROKERS'),
    // );
    // KafkaRegistry.register('ClusterA', clusterA);
    // // Cluster B setup
    // const clusterB = new KafkaProducerService(
    //   this.configService.get('KAFKA_B_ID'),
    //   this.configService.get('KAFKA_B_BROKERS'),
    // );
    // KafkaRegistry.register('ClusterB', clusterB);
  }
}
