import { ClusterTopic, ReadProperties } from './kafka.read.properties';

describe('ReadProperties', () => {
  let reader: ReadProperties;

  beforeEach(() => {
    reader = new ReadProperties('./src/util/kafka/kafka.read.properties.test');
  });

  it('should filter properties based on the provided prefix', () => {
    // Arrange
    // readProperties is created.
    // Act
    const result = reader.getProperties('cloud.config.kafka');

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      {
        'cloud.config.kafka.cluster1.brokers': 'localhost:9092, localhost:9093',
      },
      { 'cloud.config.kafka.cluster1.api.key': 'secret' },
      { 'cloud.config.kafka.cluster1.topic1': 'topic.1' },
    ]);
    expect(result).not.toContainEqual({ 'some.other.key': 'value' });
  });

  it('should return an empty array if no keys match the prefix', () => {
    // Arrange

    // Act
    const result = reader.getProperties('NON_EXISTENT_');

    // Assert
    expect(result).toEqual([]);
  });

  it('should create objects of cluster related properties', () => {
    // Arrange

    // Act
    const result = reader.fromProperties();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      new ClusterTopic('cluster1', 'topic.1', 'localhost:9092, localhost:9093'),
      new ClusterTopic('cluster2', 'topic.2', 'localhost:9092, localhost:9093'),
    ]);
  });
});
