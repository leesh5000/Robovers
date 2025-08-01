import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// Domain Services
import { EmailVerificationTokenService } from './domain/services/email-verification-token.service';

// Infrastructure Services
import { MailHogEmailService } from './infrastructure/email/mailhog-email.service';
import { GmailEmailService } from './infrastructure/email/gmail-email.service';
import { TokenStorageService } from './infrastructure/redis/token-storage.service';
import { EmailRateLimiterService } from './infrastructure/rate-limit/email-rate-limiter.service';

// DI Tokens
export const EMAIL_SERVICE_TOKEN = 'EmailService';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret || jwtSecret.trim() === '') {
          throw new Error(
            'JWT_SECRET must be defined in environment variables',
          );
        }
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Redis Client
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          retryStrategy: (times) => Math.min(times * 50, 2000),
          lazyConnect: true,
        });

        try {
          await redis.connect();
          redis.on('error', (err) => {
            console.error('Redis connection error:', err);
          });
          return redis;
        } catch (error) {
          throw new Error(
            `Failed to connect to Redis: ${error.message || error}`,
          );
        }
      },
      inject: [ConfigService],
    },
    // Email Service - Environment-based selection
    {
      provide: EMAIL_SERVICE_TOKEN,
      useFactory: (configService: ConfigService) => {
        const environment = configService.get<string>(
          'NODE_ENV',
          'development',
        );
        if (environment === 'production') {
          return new GmailEmailService(configService);
        }
        return new MailHogEmailService(configService);
      },
      inject: [ConfigService],
    },
    // Domain Services
    EmailVerificationTokenService,
    // Infrastructure Services
    TokenStorageService,
    EmailRateLimiterService,
  ],
  exports: [
    EMAIL_SERVICE_TOKEN,
    EmailVerificationTokenService,
    TokenStorageService,
    EmailRateLimiterService,
    JwtModule,
  ],
})
export class AuthModule {}
