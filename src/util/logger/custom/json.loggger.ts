import { Logger, LogLevel } from '@nestjs/common';
import { CustomLogger } from '../custom.logger';

export class JsonLogger extends Logger implements CustomLogger {
  level(level: string): void {
    throw new Error('Method not implemented.');
  }
  json(json: boolean): void {
    throw new Error('Method not implemented.');
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
