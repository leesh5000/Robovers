import { Test, TestingModule } from '@nestjs/testing';
import { EmailRateLimiterService } from './email-rate-limiter.service';
import { Redis } from 'ioredis';

describe('EmailRateLimiterService', () => {
  let service: EmailRateLimiterService;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(async () => {
    mockRedis = {
      incr: jest.fn(),
      expire: jest.fn(),
      ttl: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailRateLimiterService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<EmailRateLimiterService>(EmailRateLimiterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRateLimit', () => {
    it('첫 요청은 허용된다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      // When
      const result = await service.checkRateLimit(email, 'verification');

      // Then
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(2); // 3번 중 1번 사용, 2번 남음
      expect(mockRedis.incr).toHaveBeenCalledWith(
        'rate_limit:verification:test@example.com',
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'rate_limit:verification:test@example.com',
        3600,
      );
    });

    it('제한 내의 요청은 허용된다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.incr.mockResolvedValue(2);

      // When
      const result = await service.checkRateLimit(email, 'verification');

      // Then
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(1);
    });

    it('제한을 초과한 요청은 거부된다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.incr.mockResolvedValue(4); // 4번째 요청
      mockRedis.ttl.mockResolvedValue(1800); // 30분 남음

      // When
      const result = await service.checkRateLimit(email, 'verification');

      // Then
      expect(result.allowed).toBe(false);
      expect(result.remainingAttempts).toBe(0);
      expect(result.retryAfter).toBe(1800);
    });
  });

  describe('getRemainingAttempts', () => {
    it('남은 시도 횟수를 반환한다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.get.mockResolvedValue('2');

      // When
      const remaining = await service.getRemainingAttempts(
        email,
        'verification',
      );

      // Then
      expect(remaining).toBe(1); // 3번 중 2번 사용, 1번 남음
      expect(mockRedis.get).toHaveBeenCalledWith(
        'rate_limit:verification:test@example.com',
      );
    });

    it('키가 없으면 최대 시도 횟수를 반환한다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.get.mockResolvedValue(null);

      // When
      const remaining = await service.getRemainingAttempts(
        email,
        'verification',
      );

      // Then
      expect(remaining).toBe(3);
    });
  });

  describe('resetRateLimit', () => {
    it('rate limit을 초기화한다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.del.mockResolvedValue(1);

      // When
      await service.resetRateLimit(email, 'verification');

      // Then
      expect(mockRedis.del).toHaveBeenCalledWith(
        'rate_limit:verification:test@example.com',
      );
    });
  });

  describe('비밀번호 재설정 rate limit', () => {
    it('비밀번호 재설정은 다른 제한을 가진다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      // When
      const result = await service.checkRateLimit(email, 'password_reset');

      // Then
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(4); // 5번 중 1번 사용, 4번 남음
      expect(mockRedis.incr).toHaveBeenCalledWith(
        'rate_limit:password_reset:test@example.com',
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'rate_limit:password_reset:test@example.com',
        3600,
      );
    });
  });
});
