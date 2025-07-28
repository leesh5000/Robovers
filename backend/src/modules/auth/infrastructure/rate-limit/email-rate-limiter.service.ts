import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number; // seconds until next retry
}

@Injectable()
export class EmailRateLimiterService {
  private readonly limits = {
    verification: { maxAttempts: 3, windowSeconds: 3600 }, // 3 attempts per hour
    password_reset: { maxAttempts: 5, windowSeconds: 3600 }, // 5 attempts per hour
  };

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async checkRateLimit(
    email: string,
    type: 'verification' | 'password_reset',
  ): Promise<RateLimitResult> {
    const key = `rate_limit:${type}:${email}`;
    const limit = this.limits[type];

    // Increment counter
    const attempts = await this.redis.incr(key);

    // Set expiry on first attempt
    if (attempts === 1) {
      await this.redis.expire(key, limit.windowSeconds);
    }

    // Check if limit exceeded
    if (attempts > limit.maxAttempts) {
      const ttl = await this.redis.ttl(key);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfter: ttl > 0 ? ttl : limit.windowSeconds,
      };
    }

    return {
      allowed: true,
      remainingAttempts: limit.maxAttempts - attempts,
    };
  }

  async getRemainingAttempts(
    email: string,
    type: 'verification' | 'password_reset',
  ): Promise<number> {
    const key = `rate_limit:${type}:${email}`;
    const limit = this.limits[type];

    const attempts = await this.redis.get(key);
    if (!attempts) {
      return limit.maxAttempts;
    }

    const attemptsCount = parseInt(attempts, 10);
    return Math.max(0, limit.maxAttempts - attemptsCount);
  }

  async resetRateLimit(
    email: string,
    type: 'verification' | 'password_reset',
  ): Promise<void> {
    const key = `rate_limit:${type}:${email}`;
    await this.redis.del(key);
  }
}
