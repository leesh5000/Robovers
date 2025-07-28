import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class TokenStorageService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async saveEmailVerificationToken(
    email: string,
    token: string,
    ttl: number,
  ): Promise<void> {
    await this.redis.set(`email_verification:${email}`, token, 'EX', ttl);
  }

  async getEmailVerificationToken(email: string): Promise<string | null> {
    return await this.redis.get(`email_verification:${email}`);
  }

  async deleteEmailVerificationToken(email: string): Promise<void> {
    await this.redis.del(`email_verification:${email}`);
  }

  async savePasswordResetToken(
    email: string,
    token: string,
    ttl: number,
  ): Promise<void> {
    await this.redis.set(`password_reset:${email}`, token, 'EX', ttl);
  }

  async getPasswordResetToken(email: string): Promise<string | null> {
    return await this.redis.get(`password_reset:${email}`);
  }

  async deletePasswordResetToken(email: string): Promise<void> {
    await this.redis.del(`password_reset:${email}`);
  }

  async checkTokenExists(
    type: 'email_verification' | 'password_reset',
    email: string,
  ): Promise<boolean> {
    const exists = await this.redis.exists(`${type}:${email}`);
    return exists === 1;
  }
}
