export interface EmailServiceInterface {
  sendVerificationEmail(email: string, code: string): Promise<void>;
  sendWelcomeEmail(email: string, username: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}

export const EMAIL_SERVICE_TOKEN = Symbol('EmailService');