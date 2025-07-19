import { EmailVerification } from '../../../../domain/entities/email-verification.entity';
import { Email } from '../../../../domain/value-objects/email.vo';
import { EmailVerificationCode } from '../../../../domain/value-objects/email-verification-code.vo';

describe('EmailVerification Entity', () => {
  const createEmailVerification = () => {
    return EmailVerification.create({
      id: '1',
      email: Email.create('test@example.com'),
    });
  };

  describe('create', () => {
    it('should create an email verification with generated code', () => {
      const verification = createEmailVerification();

      expect(verification.id).toBe('1');
      expect(verification.email.value).toBe('test@example.com');
      expect(verification.code.value).toMatch(/^\d{6}$/);
      expect(verification.attempts).toBe(0);
      expect(verification.expiresAt).toBeInstanceOf(Date);
      expect(verification.createdAt).toBeInstanceOf(Date);
    });

    it('should set expiration time to 10 minutes from creation', () => {
      const verification = createEmailVerification();
      const now = new Date();
      const expirationDiff = verification.expiresAt.getTime() - now.getTime();
      
      // Should be approximately 10 minutes (600000 ms), allowing for small execution time
      expect(expirationDiff).toBeGreaterThan(599000);
      expect(expirationDiff).toBeLessThan(601000);
    });
  });

  describe('verify', () => {
    it('should return true for correct code', () => {
      const verification = createEmailVerification();
      const correctCode = verification.code.value;

      expect(verification.verify(correctCode)).toBe(true);
      expect(verification.attempts).toBe(1);
    });

    it('should return false for incorrect code', () => {
      const verification = createEmailVerification();
      const incorrectCode = verification.code.value === '123456' ? '654321' : '123456';

      expect(verification.verify(incorrectCode)).toBe(false);
      expect(verification.attempts).toBe(1);
    });

    it('should increment attempts on each verification', () => {
      const verification = createEmailVerification();

      verification.verify('000000');
      expect(verification.attempts).toBe(1);

      verification.verify('111111');
      expect(verification.attempts).toBe(2);

      verification.verify('222222');
      expect(verification.attempts).toBe(3);
    });

    it('should throw error when expired', () => {
      const expiredDate = new Date(Date.now() - 60000); // 1 minute ago
      const verification = EmailVerification.reconstitute({
        id: '1',
        email: Email.create('test@example.com'),
        code: EmailVerificationCode.create('123456'),
        expiresAt: expiredDate,
        attempts: 0,
        createdAt: new Date(Date.now() - 120000), // 2 minutes ago
      });

      expect(() => verification.verify('123456')).toThrow('Verification code has expired');
    });

    it('should throw error when max attempts exceeded', () => {
      const verification = EmailVerification.reconstitute({
        id: '1',
        email: Email.create('test@example.com'),
        code: EmailVerificationCode.create('123456'),
        expiresAt: new Date(Date.now() + 60000), // 1 minute from now
        attempts: 5, // Already at max attempts
        createdAt: new Date(),
      });

      expect(() => verification.verify('123456')).toThrow('Maximum verification attempts exceeded');
    });
  });

  describe('isExpired', () => {
    it('should return false when not expired', () => {
      const verification = createEmailVerification();
      expect(verification.isExpired()).toBe(false);
    });

    it('should return true when expired', () => {
      const expiredDate = new Date(Date.now() - 60000); // 1 minute ago
      const verification = EmailVerification.reconstitute({
        id: '1',
        email: Email.create('test@example.com'),
        code: EmailVerificationCode.create('123456'),
        expiresAt: expiredDate,
        attempts: 0,
        createdAt: new Date(Date.now() - 120000),
      });

      expect(verification.isExpired()).toBe(true);
    });
  });

  describe('hasExceededMaxAttempts', () => {
    it('should return false when under max attempts', () => {
      const verification = EmailVerification.reconstitute({
        id: '1',
        email: Email.create('test@example.com'),
        code: EmailVerificationCode.create('123456'),
        expiresAt: new Date(Date.now() + 60000),
        attempts: 4,
        createdAt: new Date(),
      });

      expect(verification.hasExceededMaxAttempts()).toBe(false);
    });

    it('should return true when at or over max attempts', () => {
      const verification = EmailVerification.reconstitute({
        id: '1',
        email: Email.create('test@example.com'),
        code: EmailVerificationCode.create('123456'),
        expiresAt: new Date(Date.now() + 60000),
        attempts: 5,
        createdAt: new Date(),
      });

      expect(verification.hasExceededMaxAttempts()).toBe(true);
    });
  });
});