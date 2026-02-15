import * as fs from 'fs';
import * as dotenv from 'dotenv';

export class ReadProperties {
  constructor(private file: string) {}

  getProperties(prefix: string): Record<string, string>[] {
    const buf = fs.readFileSync(this.file);
    const config = dotenv.parse(buf);

    const allKeys = Object.keys(config);
    console.log('Properties defined in .env:', allKeys);

    const recordsArray: Record<string, string>[] = Object.entries(config)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => ({ [key]: value }));

    return recordsArray;
  }

  fromProperties(): ClusterTopic[] {
    const reader = new ReadProperties('./.env/default');
    const clusters: string[] = reader
      .getProperties('cloud.config.kafka')
      .map((property) => {
        const key: string = Object.keys(property)[0];
        const parts: string[] = key.split('.');
        const clusterName = parts[3];
        return clusterName;
      });

    const clusterTopics = clusters.map((cluster) => {
      const topic = reader.getProperties(`cloud.config.kafka.${cluster}.topic`);
      const brokers = reader.getProperties(
        `cloud.config.kafka.${cluster}.brokers`,
      );
      return new ClusterTopic(
        cluster,
        Object.values(topic[0])[0],
        Object.values(brokers[0])[0],
      );
    });
    const uniqueClusterTopics = [
      ...new Map(
        clusterTopics.map((item) => [
          item.getCluster() + item.getTopic(),
          item,
        ]),
      ).values(),
    ];
    return uniqueClusterTopics;
  }
}

export class ClusterTopic {
  constructor(
    private cluster: string,
    private topic: string,
    private brokers: string,
  ) {}

  public getCluster(): string {
    return this.cluster;
  }

  public getTopic(): string {
    return this.topic;
  }

  public getBrokers(): string[] {
    if (this.brokers.indexOf(',') > 0) {
      return this.brokers.split(',');
    }
    return Array.of(this.brokers);
  }
}
