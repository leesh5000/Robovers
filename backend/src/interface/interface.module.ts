import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { HealthController } from './rest/controllers/health.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [HealthController],
  providers: [],
})
export class InterfaceModule {}