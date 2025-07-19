export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 30;
  private static readonly BCRYPT_REGEX = /^\$2[aby]?\$\d{1,2}\$/;
  
  private constructor(
    private readonly password: string,
    private readonly hashed: boolean = false
  ) {}

  static create(password: string): Password {
    if (password.length < this.MIN_LENGTH) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (password.length > this.MAX_LENGTH) {
      throw new Error('Password must be no more than 30 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new Error('Password must contain at least one special character');
    }

    return new Password(password, false);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  get value(): string {
    return this.password;
  }

  isHashed(): boolean {
    return this.hashed;
  }

  toString(): string {
    return this.password;
  }
}