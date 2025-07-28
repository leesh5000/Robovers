import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EmailService } from '../../../user/domain/services/email.service.interface';

@Injectable()
export class MailHogEmailService implements EmailService {
  private readonly logger = new Logger(MailHogEmailService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return text.replace(/[&<>"'\/]/g, (char) => htmlEntities[char]);
  }

  private initializeTransporter(): void {
    const host = this.configService.get<string>('MAILHOG_HOST', 'localhost');
    const port = this.configService.get<number>('MAILHOG_PORT', 1025);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    try {
      const from = `"${this.configService.get<string>('EMAIL_FROM_NAME', 'Robovers')}" <${this.configService.get<string>('EMAIL_FROM', 'noreply@robovers.com')}>`;

      await this.transporter.sendMail({
        from,
        to: data.to,
        subject: data.subject,
        html: data.html,
      });

      this.logger.log(`Email sent to ${data.to} via MailHog`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}:`, error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">이메일 인증</h2>
        <p>안녕하세요!</p>
        <p>Robovers 회원가입을 환영합니다. 아래 6자리 인증 코드를 입력하여 이메일을 인증해주세요.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; 
                      padding: 20px; display: inline-block; font-size: 32px; font-weight: bold; 
                      color: #007bff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${this.escapeHtml(code)}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          위 6자리 코드를 회원가입 인증 페이지에 입력해주세요.
        </p>
        <p style="color: #666; font-size: 14px;">
          이 인증 코드는 1시간 동안 유효합니다.
        </p>
        <p style="color: #999; font-size: 13px;">
          만약 회원가입을 요청하지 않으셨다면, 이 이메일을 무시해주세요.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '이메일 인증 코드 - Robovers',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetPageUrl = 'http://localhost:4000/auth/reset-password';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">비밀번호 재설정</h2>
        <p>안녕하세요!</p>
        <p>비밀번호 재설정을 요청하셨습니다. 아래 재설정 코드를 사용하여 새로운 비밀번호를 설정해주세요.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; border: 2px solid #28a745; border-radius: 8px; 
                      padding: 20px; display: inline-block; font-size: 32px; font-weight: bold; 
                      color: #28a745; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${this.escapeHtml(token)}
          </div>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.escapeHtml(resetPageUrl)}" 
             style="background-color: #28a745; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            재설정 페이지로 이동
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          이 재설정 코드는 1시간 동안 유효합니다.
        </p>
        <p style="color: #999; font-size: 13px;">
          만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시해주세요.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '비밀번호 재설정 - Robovers',
      html,
    });
  }

  async sendWelcomeEmail(email: string, nickname: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">환영합니다, ${this.escapeHtml(nickname)}님!</h2>
        <p>Robovers 회원이 되신 것을 진심으로 환영합니다.</p>
        <p>Robovers는 휴머노이드 로봇 정보를 공유하고 소통하는 커뮤니티입니다.</p>
        <ul style="line-height: 1.8;">
          <li>최신 로봇 기술 정보 확인</li>
          <li>커뮤니티에서 다른 회원들과 소통</li>
          <li>로봇 관련 뉴스 및 업데이트</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:4000" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Robovers 방문하기
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          궁금한 점이 있으시면 언제든지 문의해주세요.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `${this.escapeHtml(nickname)}님, Robovers에 오신 것을 환영합니다!`,
      html,
    });
  }
}
