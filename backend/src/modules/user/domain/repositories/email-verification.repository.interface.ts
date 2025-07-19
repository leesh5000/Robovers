import { EmailVerification } from '../entities/email-verification.entity';

export interface EmailVerificationRepositoryInterface {
  save(verification: EmailVerification): Promise<EmailVerification>;
  findByEmail(email: string): Promise<EmailVerification | null>;
  deleteByEmail(email: string): Promise<void>;
  deleteExpired(): Promise<number>;
}

export const EMAIL_VERIFICATION_REPOSITORY_TOKEN = Symbol('EmailVerificationRepository');