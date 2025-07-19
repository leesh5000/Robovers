export class EmailVerificationCode {
  private static readonly CODE_LENGTH = 6;
  
  private constructor(private readonly code: string) {}

  static generate(): EmailVerificationCode {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return new EmailVerificationCode(code);
  }

  static create(code: string): EmailVerificationCode {
    if (!code || code.length !== this.CODE_LENGTH) {
      throw new Error('Verification code must be exactly 6 digits');
    }

    if (!/^\d{6}$/.test(code)) {
      throw new Error('Verification code must contain only digits');
    }

    return new EmailVerificationCode(code);
  }

  get value(): string {
    return this.code;
  }

  equals(other: EmailVerificationCode): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}