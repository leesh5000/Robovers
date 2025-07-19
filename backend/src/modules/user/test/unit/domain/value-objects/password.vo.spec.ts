import { Password } from '../../../../domain/value-objects/password.vo';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const validPassword = 'Test123!@#';
    const password = Password.create(validPassword);
    
    expect(password.value).toBe(validPassword);
  });

  it('should throw error for password shorter than 8 characters', () => {
    expect(() => Password.create('Test1!')).toThrow('Password must be at least 8 characters long');
  });

  it('should throw error for password longer than 30 characters', () => {
    const longPassword = 'Test123!@#' + 'a'.repeat(21); // 31 characters
    expect(() => Password.create(longPassword)).toThrow('Password must be no more than 30 characters long');
  });

  it('should accept password exactly 30 characters long', () => {
    const maxLengthPassword = 'Test123!@#' + 'a'.repeat(20); // exactly 30 characters
    const password = Password.create(maxLengthPassword);
    expect(password.value).toBe(maxLengthPassword);
  });

  it('should throw error for password without uppercase letter', () => {
    expect(() => Password.create('test123!@#')).toThrow('Password must contain at least one uppercase letter');
  });

  it('should throw error for password without lowercase letter', () => {
    expect(() => Password.create('TEST123!@#')).toThrow('Password must contain at least one lowercase letter');
  });

  it('should throw error for password without number', () => {
    expect(() => Password.create('TestTest!@#')).toThrow('Password must contain at least one number');
  });

  it('should throw error for password without special character', () => {
    expect(() => Password.create('Test12345')).toThrow('Password must contain at least one special character');
  });

  it('should create password from hash', () => {
    const hashedPassword = '$2b$10$hashedpasswordstring';
    const password = Password.fromHash(hashedPassword);
    
    expect(password.value).toBe(hashedPassword);
    expect(password.isHashed()).toBe(true);
  });

  it('should identify plain text password', () => {
    const password = Password.create('Test123!@#');
    expect(password.isHashed()).toBe(false);
  });

  it('should not validate hashed password', () => {
    const hashedPassword = '$2b$10$hashedpasswordstring';
    const password = Password.fromHash(hashedPassword);
    
    // Should not throw error even though it doesn't meet password requirements
    expect(() => password).not.toThrow();
  });
});