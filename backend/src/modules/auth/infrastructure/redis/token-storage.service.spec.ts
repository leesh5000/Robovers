import { Test, TestingModule } from '@nestjs/testing';
import { TokenStorageService } from './token-storage.service';
import { Redis } from 'ioredis';

describe('TokenStorageService', () => {
  let service: TokenStorageService;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(async () => {
    mockRedis = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenStorageService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<TokenStorageService>(TokenStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveEmailVerificationToken', () => {
    it('이메일 인증 토큰을 Redis에 저장한다', async () => {
      // Given
      const email = 'test@example.com';
      const token = 'verification-token';
      const ttl = 3600; // 1시간

      mockRedis.set.mockResolvedValue('OK');

      // When
      await service.saveEmailVerificationToken(email, token, ttl);

      // Then
      expect(mockRedis.set).toHaveBeenCalledWith(
        `email_verification:${email}`,
        token,
        'EX',
        ttl,
      );
    });
  });

  describe('getEmailVerificationToken', () => {
    it('저장된 이메일 인증 토큰을 조회한다', async () => {
      // Given
      const email = 'test@example.com';
      const expectedToken = 'stored-token';

      mockRedis.get.mockResolvedValue(expectedToken);

      // When
      const token = await service.getEmailVerificationToken(email);

      // Then
      expect(token).toBe(expectedToken);
      expect(mockRedis.get).toHaveBeenCalledWith(`email_verification:${email}`);
    });

    it('토큰이 없으면 null을 반환한다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.get.mockResolvedValue(null);

      // When
      const token = await service.getEmailVerificationToken(email);

      // Then
      expect(token).toBeNull();
    });
  });

  describe('deleteEmailVerificationToken', () => {
    it('이메일 인증 토큰을 삭제한다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.del.mockResolvedValue(1);

      // When
      await service.deleteEmailVerificationToken(email);

      // Then
      expect(mockRedis.del).toHaveBeenCalledWith(`email_verification:${email}`);
    });
  });

  describe('savePasswordResetToken', () => {
    it('비밀번호 재설정 토큰을 Redis에 저장한다', async () => {
      // Given
      const email = 'test@example.com';
      const token = 'reset-token';
      const ttl = 3600;

      mockRedis.set.mockResolvedValue('OK');

      // When
      await service.savePasswordResetToken(email, token, ttl);

      // Then
      expect(mockRedis.set).toHaveBeenCalledWith(
        `password_reset:${email}`,
        token,
        'EX',
        ttl,
      );
    });
  });

  describe('getPasswordResetToken', () => {
    it('저장된 비밀번호 재설정 토큰을 조회한다', async () => {
      // Given
      const email = 'test@example.com';
      const expectedToken = 'reset-token';

      mockRedis.get.mockResolvedValue(expectedToken);

      // When
      const token = await service.getPasswordResetToken(email);

      // Then
      expect(token).toBe(expectedToken);
      expect(mockRedis.get).toHaveBeenCalledWith(`password_reset:${email}`);
    });
  });

  describe('deletePasswordResetToken', () => {
    it('비밀번호 재설정 토큰을 삭제한다', async () => {
      // Given
      const email = 'test@example.com';
      mockRedis.del.mockResolvedValue(1);

      // When
      await service.deletePasswordResetToken(email);

      // Then
      expect(mockRedis.del).toHaveBeenCalledWith(`password_reset:${email}`);
    });
  });

  describe('checkTokenExists', () => {
    it('토큰 존재 여부를 확인한다', async () => {
      // Given
      const key = 'email_verification:test@example.com';
      mockRedis.exists.mockResolvedValue(1);

      // When
      const exists = await service.checkTokenExists(
        'email_verification',
        'test@example.com',
      );

      // Then
      expect(exists).toBe(true);
      expect(mockRedis.exists).toHaveBeenCalledWith(key);
    });

    it('토큰이 없으면 false를 반환한다', async () => {
      // Given
      mockRedis.exists.mockResolvedValue(0);

      // When
      const exists = await service.checkTokenExists(
        'email_verification',
        'test@example.com',
      );

      // Then
      expect(exists).toBe(false);
    });
  });
});
