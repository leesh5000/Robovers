import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get port(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get username(): string {
    return this.configService.get<string>('DB_USERNAME', 'robovers');
  }

  get password(): string {
    return this.configService.get<string>('DB_PASSWORD', 'robovers123');
  }

  get database(): string {
    return this.configService.get<string>('DB_DATABASE', 'robovers_db');
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}