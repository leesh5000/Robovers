import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Config
import authConfig from './infrastructure/config/auth.config';

// Domain
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository.interface';

// Application
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { PASSWORD_SERVICE_TOKEN } from './application/services/password.service.interface';
import { AUTH_SERVICE_TOKEN } from './application/services/auth.service.interface';

// Infrastructure
import { UserRepository } from './infrastructure/persistence/prisma/user.repository';
import { BcryptPasswordService } from './infrastructure/services/bcrypt-password.service';
import { JwtAuthService } from './infrastructure/services/jwt-auth.service';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from './infrastructure/auth/roles.guard';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';

// Common
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get('auth.jwt.accessTokenExpiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    // Services
    {
      provide: PASSWORD_SERVICE_TOKEN,
      useClass: BcryptPasswordService,
    },
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: JwtAuthService,
    },
    // Repositories
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    // Auth
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    USER_REPOSITORY_TOKEN,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class UserModule {}