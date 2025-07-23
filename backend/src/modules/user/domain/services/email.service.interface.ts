export interface EmailService {
  sendVerificationEmail(email: string, verificationToken: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
  sendWelcomeEmail(email: string, nickname: string): Promise<void>;
}