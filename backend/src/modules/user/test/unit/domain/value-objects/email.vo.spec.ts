import { Email } from '../../../../domain/value-objects/email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const validEmail = 'test@example.com';
    const email = Email.create(validEmail);
    
    expect(email.value).toBe(validEmail);
  });

  it('should throw error for invalid email format', () => {
    const invalidEmails = [
      '',
      'invalid',
      'invalid@',
      '@invalid.com',
      'invalid@.com',
      'invalid..email@example.com',
      'invalid@example',
    ];

    invalidEmails.forEach((invalidEmail) => {
      expect(() => Email.create(invalidEmail)).toThrow('Invalid email format');
    });
  });

  it('should normalize email to lowercase', () => {
    const email = Email.create('Test@EXAMPLE.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should trim whitespace', () => {
    const email = Email.create('  test@example.com  ');
    expect(email.value).toBe('test@example.com');
  });

  it('should implement equals method correctly', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('test@example.com');
    const email3 = Email.create('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});