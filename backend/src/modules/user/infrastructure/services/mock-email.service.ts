import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../../domain/services/email.service.interface';

@Injectable()
export class MockEmailService implements EmailService {
  private readonly logger = new Logger(MockEmailService.name);

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    this.logger.log(
      `[Mock] Sending verification email to ${email} with token: ${verificationToken}`,
    );
    // 실제 이메일 발송 대신 로그만 출력
    // TODO: 실제 이메일 서비스 구현 시 교체
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    this.logger.log(
      `[Mock] Sending password reset email to ${email} with token: ${resetToken}`,
    );
  }

  async sendWelcomeEmail(email: string, nickname: string): Promise<void> {
    this.logger.log(
      `[Mock] Sending welcome email to ${email} (nickname: ${nickname})`,
    );
  }
}