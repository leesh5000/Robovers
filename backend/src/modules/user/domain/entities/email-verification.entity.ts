import { Email } from '../value-objects/email.vo';
import { EmailVerificationCode } from '../value-objects/email-verification-code.vo';

interface EmailVerificationProps {
  id: string;
  email: Email;
  code: EmailVerificationCode;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

export class EmailVerification {
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly EXPIRATION_MINUTES = 10;

  private _id: string;
  private _email: Email;
  private _code: EmailVerificationCode;
  private _expiresAt: Date;
  private _attempts: number;
  private _createdAt: Date;

  private constructor(props: EmailVerificationProps) {
    this._id = props.id;
    this._email = props.email;
    this._code = props.code;
    this._expiresAt = props.expiresAt;
    this._attempts = props.attempts;
    this._createdAt = props.createdAt;
  }

  static create(props: {
    id: string;
    email: Email;
  }): EmailVerification {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.EXPIRATION_MINUTES * 60 * 1000);

    return new EmailVerification({
      id: props.id,
      email: props.email,
      code: EmailVerificationCode.generate(),
      expiresAt,
      attempts: 0,
      createdAt: now,
    });
  }

  static reconstitute(props: EmailVerificationProps): EmailVerification {
    return new EmailVerification(props);
  }

  verify(code: string): boolean {
    if (this.isExpired()) {
      throw new Error('Verification code has expired');
    }

    if (this.hasExceededMaxAttempts()) {
      throw new Error('Maximum verification attempts exceeded');
    }

    this._attempts++;

    const verificationCode = EmailVerificationCode.create(code);
    return this._code.equals(verificationCode);
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  hasExceededMaxAttempts(): boolean {
    return this._attempts >= EmailVerification.MAX_ATTEMPTS;
  }

  // Getters
  get id(): string { return this._id; }
  get email(): Email { return this._email; }
  get code(): EmailVerificationCode { return this._code; }
  get expiresAt(): Date { return this._expiresAt; }
  get attempts(): number { return this._attempts; }
  get createdAt(): Date { return this._createdAt; }
}