import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnowflakeIdService } from './snowflake-id.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SnowflakeIdService,
      useFactory: (configService: ConfigService) => {
        const datacenterId = configService.get<number>('SNOWFLAKE_DATACENTER_ID', 1);
        const workerId = configService.get<number>('SNOWFLAKE_WORKER_ID', 1);
        const epoch = configService.get<number>('SNOWFLAKE_EPOCH');
        
        return new SnowflakeIdService({
          datacenterId,
          workerId,
          epoch,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [SnowflakeIdService],
})
export class SnowflakeModule {}