import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PropertyNames } from '../properties/property.names';
import { ConfigurationValue } from '../properties/configuration.value';

@Injectable()
export class ConsulConfig {
  private readonly logger: Logger = new Logger(ConsulConfig.name);

  private hostUrl: ConfigurationValue<URL> = ConfigurationValue.empty();

  constructor(private configService: ConfigService) {}

  public host(): string {
    if (!this.hostUrl.isInitialized()) {
      this.hostUrl = this.getHostInternal();
    }
    return this.hostUrl.get().host;
  }

  private getHostInternal(): ConfigurationValue<URL> {
    let host = this.configService.get<string>(PropertyNames.CONSUL_URL);
    if (!host) {
      this.logger.error(
        'No consul url configured, using http://localhost:8500 as fallback',
      );
      host = 'http://localhost:8500';
    }
    return new ConfigurationValue<URL>(new URL(host));
  }
}
