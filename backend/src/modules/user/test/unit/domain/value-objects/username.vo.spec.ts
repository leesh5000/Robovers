import { Username } from '../../../../domain/value-objects/username.vo';

describe('Username Value Object', () => {
  it('should create a valid username', () => {
    const validUsername = 'testuser123';
    const username = Username.create(validUsername);
    
    expect(username.value).toBe(validUsername);
  });

  it('should throw error for username shorter than 3 characters', () => {
    expect(() => Username.create('ab')).toThrow('Username must be between 3 and 20 characters');
  });

  it('should throw error for username longer than 20 characters', () => {
    expect(() => Username.create('a'.repeat(21))).toThrow('Username must be between 3 and 20 characters');
  });

  it('should throw error for username with invalid characters', () => {
    const invalidUsernames = [
      'test user',  // space
      'test@user',  // @
      'test!user',  // !
      'test#user',  // #
      'test$user',  // $
    ];

    invalidUsernames.forEach((invalidUsername) => {
      expect(() => Username.create(invalidUsername)).toThrow('Username can only contain letters, numbers, and underscores');
    });
  });

  it('should allow valid usernames', () => {
    const validUsernames = [
      'user',
      'user123',
      'user_123',
      '_user',
      'USER',
      'User_Name_123',
    ];

    validUsernames.forEach((validUsername) => {
      expect(() => Username.create(validUsername)).not.toThrow();
    });
  });

  it('should trim whitespace', () => {
    const username = Username.create('  testuser  ');
    expect(username.value).toBe('testuser');
  });

  it('should implement equals method correctly', () => {
    const username1 = Username.create('testuser');
    const username2 = Username.create('testuser');
    const username3 = Username.create('otheruser');

    expect(username1.equals(username2)).toBe(true);
    expect(username1.equals(username3)).toBe(false);
  });
});