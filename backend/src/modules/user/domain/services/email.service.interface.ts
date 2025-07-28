export interface EmailService {
  sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean>;
  sendVerificationEmail(
    email: string,
    verificationToken: string,
  ): Promise<boolean>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
  sendWelcomeEmail(email: string, nickname: string): Promise<boolean>;
}
