import { EmailVerificationCode } from '../../../../domain/value-objects/email-verification-code.vo';

describe('EmailVerificationCode Value Object', () => {
  describe('generate', () => {
    it('should generate a 6-digit code', () => {
      const code = EmailVerificationCode.generate();
      expect(code.value).toMatch(/^\d{6}$/);
    });

    it('should generate different codes', () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(EmailVerificationCode.generate().value);
      }
      // Should have generated multiple different codes
      expect(codes.size).toBeGreaterThan(50);
    });
  });

  describe('create', () => {
    it('should create a valid 6-digit code', () => {
      const code = EmailVerificationCode.create('123456');
      expect(code.value).toBe('123456');
    });

    it('should throw error for code with wrong length', () => {
      expect(() => EmailVerificationCode.create('12345')).toThrow(
        'Verification code must be exactly 6 digits'
      );
      expect(() => EmailVerificationCode.create('1234567')).toThrow(
        'Verification code must be exactly 6 digits'
      );
    });

    it('should throw error for empty code', () => {
      expect(() => EmailVerificationCode.create('')).toThrow(
        'Verification code must be exactly 6 digits'
      );
    });

    it('should throw error for code with non-digits', () => {
      expect(() => EmailVerificationCode.create('12345a')).toThrow(
        'Verification code must contain only digits'
      );
      expect(() => EmailVerificationCode.create('abcdef')).toThrow(
        'Verification code must contain only digits'
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal codes', () => {
      const code1 = EmailVerificationCode.create('123456');
      const code2 = EmailVerificationCode.create('123456');
      expect(code1.equals(code2)).toBe(true);
    });

    it('should return false for different codes', () => {
      const code1 = EmailVerificationCode.create('123456');
      const code2 = EmailVerificationCode.create('654321');
      expect(code1.equals(code2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the code as string', () => {
      const code = EmailVerificationCode.create('123456');
      expect(code.toString()).toBe('123456');
    });
  });
});