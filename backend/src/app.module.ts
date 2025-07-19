import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { SnowflakeModule } from './common/snowflake/snowflake.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    SnowflakeModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}