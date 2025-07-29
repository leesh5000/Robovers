import { validateEmail, validatePassword, validateUsername } from './validation';

describe('Validation Functions', () => {
  // TDD: Red phase - 테스트를 먼저 작성합니다
  
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      // Arrange & Act & Assert
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.kr')).toBe(true);
      expect(validateEmail('admin+tag@company.org')).toBe(true);
      expect(validateEmail('123@456.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('user@ex ample.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail(null as unknown as string)).toBe(false);
      expect(validateEmail(undefined as unknown as string)).toBe(false);
      expect(validateEmail(123 as unknown as string)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      // 8자 이상, 대문자, 소문자, 숫자, 특수문자 포함
      expect(validatePassword('Password1!').isValid).toBe(true);
      expect(validatePassword('Admin1234!').isValid).toBe(true);
      expect(validatePassword('Test@2024').isValid).toBe(true);
      expect(validatePassword('SecureP@ss1').isValid).toBe(true);
    });

    it('should return false for passwords missing requirements', () => {
      // 길이 부족
      expect(validatePassword('Pass1!').isValid).toBe(false);
      
      // 대문자 없음
      expect(validatePassword('password1!').isValid).toBe(false);
      
      // 소문자 없음
      expect(validatePassword('PASSWORD1!').isValid).toBe(false);
      
      // 숫자 없음
      expect(validatePassword('Password!').isValid).toBe(false);
      
      // 특수문자 없음
      expect(validatePassword('Password1').isValid).toBe(false);
      
      // 빈 문자열
      expect(validatePassword('').isValid).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validatePassword(null as unknown as string).isValid).toBe(false);
      expect(validatePassword(undefined as unknown as string).isValid).toBe(false);
      expect(validatePassword(123456 as unknown as string).isValid).toBe(false);
    });
    
    it('should return appropriate error messages', () => {
      const shortPassword = validatePassword('Pass1!');
      expect(shortPassword.errors).toContain('비밀번호는 8자 이상이어야 합니다');
      
      const noLowercase = validatePassword('PASSWORD1!');
      expect(noLowercase.errors).toContain('소문자를 포함해야 합니다');
      
      const noUppercase = validatePassword('password1!');
      expect(noUppercase.errors).toContain('대문자를 포함해야 합니다');
      
      const noNumber = validatePassword('Password!');
      expect(noNumber.errors).toContain('숫자를 포함해야 합니다');
      
      const noSpecial = validatePassword('Password1');
      expect(noSpecial.errors).toContain('특수문자를 포함해야 합니다');
    });
  });

  describe('validateUsername', () => {
    it('should return true for valid usernames', () => {
      // 3-20자, 영문자, 숫자, 언더스코어만 허용
      expect(validateUsername('user123').isValid).toBe(true);
      expect(validateUsername('test_user').isValid).toBe(true);
      expect(validateUsername('Admin').isValid).toBe(true);
      expect(validateUsername('user_123_test').isValid).toBe(true);
    });

    it('should return false for invalid usernames', () => {
      // 너무 짧음
      expect(validateUsername('ab').isValid).toBe(false);
      
      // 너무 김
      expect(validateUsername('this_username_is_way_too_long').isValid).toBe(false);
      
      // 특수문자 포함
      expect(validateUsername('user@123').isValid).toBe(false);
      expect(validateUsername('user.name').isValid).toBe(false);
      expect(validateUsername('user-name').isValid).toBe(false);
      
      // 공백 포함
      expect(validateUsername('user name').isValid).toBe(false);
      
      // 빈 문자열
      expect(validateUsername('').isValid).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateUsername(null as unknown as string).isValid).toBe(false);
      expect(validateUsername(undefined as unknown as string).isValid).toBe(false);
      expect(validateUsername(12345 as unknown as string).isValid).toBe(false);
    });
    
    it('should return appropriate error messages', () => {
      const tooShort = validateUsername('ab');
      expect(tooShort.error).toBe('사용자명은 3자 이상이어야 합니다');
      
      const tooLong = validateUsername('this_username_is_way_too_long');
      expect(tooLong.error).toBe('사용자명은 20자 이하여야 합니다');
      
      const invalidChars = validateUsername('user@123');
      expect(invalidChars.error).toBe('사용자명은 영문자, 숫자, 밑줄(_)만 사용 가능합니다');
    });
  });
});