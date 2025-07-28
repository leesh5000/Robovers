import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './interfaces/controllers/auth.controller';
import { UserController } from './interfaces/controllers/user.controller';

// Application Services
import { RegisterUserCommand } from './application/commands/register-user.command';
import { LoginCommand } from './application/commands/login.command';
import { UpdateUserProfileCommand } from './application/commands/update-user-profile.command';
import { VerifyEmailCommand } from './application/commands/verify-email.command';
import { ResendVerificationCommand } from './application/commands/resend-verification.command';
import { GetUserProfileQuery } from './application/queries/get-user-profile.query';

// Infrastructure Services
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { BcryptPasswordHashService } from './infrastructure/services/bcrypt-password-hash.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

// Modules
import { AuthModule } from '../auth/auth.module';

// DI Tokens
import {
  USER_REPOSITORY_TOKEN,
  PASSWORD_HASH_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
} from './infrastructure/di-tokens';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    forwardRef(() => AuthModule),
  ],
  controllers: [AuthController, UserController],
  providers: [
    // Application Layer
    RegisterUserCommand,
    LoginCommand,
    UpdateUserProfileCommand,
    VerifyEmailCommand,
    ResendVerificationCommand,
    GetUserProfileQuery,

    // Infrastructure Layer - Repository
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },

    // Infrastructure Layer - Services
    {
      provide: PASSWORD_HASH_SERVICE_TOKEN,
      useClass: BcryptPasswordHashService,
    },
    // EMAIL_SERVICE_TOKEN은 AuthModule에서 제공받음
    {
      provide: TOKEN_SERVICE_TOKEN,
      useClass: JwtTokenService,
    },

    // Strategies
    JwtStrategy,
  ],
  exports: [USER_REPOSITORY_TOKEN, TOKEN_SERVICE_TOKEN],
})
export class UserModule {}
