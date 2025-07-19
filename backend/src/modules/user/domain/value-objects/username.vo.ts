export class Username {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 20;
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

  private constructor(private readonly username: string) {}

  static create(username: string): Username {
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < this.MIN_LENGTH || trimmedUsername.length > this.MAX_LENGTH) {
      throw new Error(`Username must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH} characters`);
    }

    if (!this.USERNAME_REGEX.test(trimmedUsername)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    return new Username(trimmedUsername);
  }

  get value(): string {
    return this.username;
  }

  equals(other: Username): boolean {
    return this.username === other.username;
  }

  toString(): string {
    return this.username;
  }
}