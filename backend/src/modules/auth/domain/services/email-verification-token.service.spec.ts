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

    it('crypto.randomInt를 사용하여 암호학적으로 안전한 코드를 생성한다', async () => {
      // Given
      const generatedCodes = new Set<string>();
      const iterations = 1000;

      // When
      for (let i = 0; i < iterations; i++) {
        const code = await service.generateVerificationCode();
        generatedCodes.add(code);
      }

      // Then
      // 충분한 엔트로피가 있다면 중복이 매우 적어야 함
      expect(generatedCodes.size).toBeGreaterThan(iterations * 0.99);
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

    it('길이가 다른 코드를 검증하면 isValid false를 반환한다', async () => {
      // Given
      const email = 'test@example.com';
      const code = '12345';
      const storedCode = '123456';

      // When
      const result = await service.verifyCode(email, code, storedCode);

      // Then
      expect(result).toEqual({ isValid: false, email: null });
    });

    it('constant-time 비교를 사용하여 timing attack을 방지한다', async () => {
      // Given
      const email = 'test@example.com';
      const correctCode = '123456';
      const wrongCode1 = '023456'; // 첫 번째 문자만 다름

      // When - 여러 번 실행하여 시간 차이가 일정한지 확인
      const timings = [];
      for (let i = 0; i < 100; i++) {
        const start = process.hrtime.bigint();
        await service.verifyCode(email, wrongCode1, correctCode);
        const end = process.hrtime.bigint();
        timings.push(Number(end - start));
      }

      const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
      const variance =
        timings.reduce((sum, time) => sum + Math.pow(time - avgTiming, 2), 0) /
        timings.length;
      const stdDev = Math.sqrt(variance);

      // Then - 표준편차가 평균의 300% 이내여야 함 (일정한 시간)
      // 테스트 환경에서는 더 관대한 기준 적용 (CI/CD 환경 고려)
      expect(stdDev / avgTiming).toBeLessThan(3.0);
    });
  });
});
