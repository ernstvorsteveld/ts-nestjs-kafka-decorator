import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyNames } from '../properties/property.names';
import { ConsulConfig } from './consul.config';

describe('ConsulConfig', () => {
  let service: ConsulConfig;

  // Mock implementation for ConfigService
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsulConfig,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ConsulConfig>(ConsulConfig);

    // Clear mocks between tests to reset call counters
    jest.clearAllMocks();
  });

  describe('host()', () => {
    it('should parse and return host from ConfigService', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('http://my-consul-server:9000');

      // Act
      const host = service.host();

      // Assert
      expect(host).toBe('my-consul-server:9000');
      expect(mockConfigService.get).toHaveBeenCalledWith(
        PropertyNames.CONSUL_URL,
      );
    });

    it('should use the default fallback when no config is provided', () => {
      // Arrange
      mockConfigService.get.mockReturnValue(undefined);
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      // Act
      const host = service.host();

      // Assert
      expect(host).toBe('localhost:8500');
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('No consul url configured'),
      );

      loggerSpy.mockRestore();
    });

    it('should memoize the URL and only call ConfigService once', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('http://memoized-host:1234');

      // Act
      service.host(); // First call triggers getHostInternal
      service.host();

      // Assert
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    });
  });
});
