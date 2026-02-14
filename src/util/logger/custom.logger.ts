import { LoggerService } from '@nestjs/common';

export interface CustomLogger extends LoggerService {
  level(level: string): void;
  json(json: boolean): void;
}
