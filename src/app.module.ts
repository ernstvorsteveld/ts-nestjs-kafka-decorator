import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestjsConsulKvRealtimeModule } from 'nestjs-consul-kv-realtime';
import { ConfigModule } from '@nestjs/config';
import { KafkaRegistryBuilder } from './util/kafka/kafka.registry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env/default',
    }),
    NestjsConsulKvRealtimeModule.forRootAsync({
      useFactory: async () => ({
        port: '8500',
        host: 'localhost',
        defaults: {
          token: process.env.CONSUL_HTTP_TOKEN,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'KAFKA_REGISTRY',
      useFactory: () => {
        return new KafkaRegistryBuilder('./.env/default').build();
      },
    },
  ],
})
export class AppModule {}
