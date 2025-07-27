import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationTokenService } from './email-verification-token.service';

describe('EmailVerificationTokenService', () => {
  let service: EmailVerificationTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerificationTokenService],
    }).compile();

    service = module.get<EmailVerificationTokenService>(
      EmailVerificationTokenService,
    );
  });

  describe('generateVerificationCode', () => {
    it('6자리 인증 코드를 생성한다', async () => {
      // When
      const code = await service.generateVerificationCode();

      // Then
      expect(code).toMatch(/^\d{6}$/);
      expect(code.length).toBe(6);
    });

    it('100000 이상 999999 이하의 숫자를 생성한다', async () => {
      // When
      const codes = await Promise.all(
        Array.from({ length: 100 }, () => service.generateVerificationCode()),
      );

      // Then
      codes.forEach((code) => {
        const numCode = parseInt(code, 10);
        expect(numCode).toBeGreaterThanOrEqual(100000);
        expect(numCode).toBeLessThanOrEqual(999999);
      });
    });
  });

  describe('verifyCode', () => {
    it('올바른 코드를 검증하면 isValid true를 반환한다', async () => {
      // Given
      const email = 'test@example.com';
      const code = '123456';
      const storedCode = '123456';

      // When
      const result = await service.verifyCode(email, code, storedCode);

      // Then
      expect(result).toEqual({ isValid: true, email });
    });

    it('잘못된 코드를 검증하면 isValid false를 반환한다', async () => {
      // Given
      const email = 'test@example.com';
      const code = '123456';
      const storedCode = '654321';

      // When
      const result = await service.verifyCode(email, code, storedCode);

      // Then
      expect(result).toEqual({ isValid: false, email: null });
    });
  });
});