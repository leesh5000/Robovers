import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Config
import authConfig from './infrastructure/config/auth.config';

// Domain
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository.interface';
import { UserFactory } from './domain/factories/user.factory';
import { USER_FACTORY_TOKEN } from './domain/factories/user.factory.interface';
import { EMAIL_VERIFICATION_REPOSITORY_TOKEN } from './domain/repositories/email-verification.repository.interface';
import { EmailVerificationFactory } from './domain/factories/email-verification.factory';
import { EMAIL_VERIFICATION_FACTORY_TOKEN } from './domain/factories/email-verification.factory';

// Application
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { SendVerificationEmailUseCase } from './application/use-cases/send-verification-email.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { PASSWORD_SERVICE_TOKEN } from './application/services/password.service.interface';
import { AUTH_SERVICE_TOKEN } from './application/services/auth.service.interface';
import { EMAIL_SERVICE_TOKEN } from './application/services/email.service.interface';

// Infrastructure
import { UserRepository } from './infrastructure/persistence/prisma/user.repository';
import { UserMapper } from './infrastructure/persistence/mappers/user.mapper';
import { EmailVerificationRepository } from './infrastructure/persistence/prisma/email-verification.repository';
import { EmailVerificationMapper } from './infrastructure/persistence/mappers/email-verification.mapper';
import { BcryptPasswordService } from './infrastructure/services/bcrypt-password.service';
import { JwtAuthService } from './infrastructure/services/jwt-auth.service';
import { NodemailerEmailService } from './infrastructure/services/nodemailer-email.service';
import { MockEmailService } from './infrastructure/services/mock-email.service';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from './infrastructure/auth/roles.guard';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';

// Common
import { PrismaModule } from '@/common/prisma/prisma.module';
import { SnowflakeModule } from '@/common/snowflake/snowflake.module';

@Module({
  imports: [
    PrismaModule,
    SnowflakeModule,
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
    // Domain
    UserFactory,
    {
      provide: USER_FACTORY_TOKEN,
      useClass: UserFactory,
    },
    EmailVerificationFactory,
    {
      provide: EMAIL_VERIFICATION_FACTORY_TOKEN,
      useClass: EmailVerificationFactory,
    },
    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    SendVerificationEmailUseCase,
    VerifyEmailUseCase,
    // Services
    {
      provide: PASSWORD_SERVICE_TOKEN,
      useClass: BcryptPasswordService,
    },
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: JwtAuthService,
    },
    {
      provide: EMAIL_SERVICE_TOKEN,
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const hasSmtpConfig = !!(
          configService.get('SMTP_HOST') &&
          configService.get('SMTP_USER') &&
          configService.get('SMTP_PASS')
        );
        
        if (isProduction && hasSmtpConfig) {
          console.log('📧 Using NodemailerEmailService for production');
          return new NodemailerEmailService(configService);
        } else {
          console.log('🎭 Using MockEmailService for development');
          return new MockEmailService();
        }
      },
      inject: [ConfigService],
    },
    // Infrastructure
    UserMapper,
    EmailVerificationMapper,
    // Repositories
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: EMAIL_VERIFICATION_REPOSITORY_TOKEN,
      useClass: EmailVerificationRepository,
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