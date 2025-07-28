import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EmailService } from '../../../user/domain/services/email.service.interface';

@Injectable()
export class GmailEmailService implements EmailService {
  private readonly logger = new Logger(GmailEmailService.name);
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

  private validateUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      const allowedOrigins = [
        this.configService.get<string>('FRONTEND_URL'),
        'https://robovers.com',
      ].filter(Boolean);

      if (!allowedOrigins.includes(urlObj.origin)) {
        throw new Error(`Invalid URL origin: ${urlObj.origin}`);
      }
    } catch (error) {
      throw new Error(`Invalid URL: ${error.message}`);
    }
  }

  private initializeTransporter(): void {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass = this.configService.get<string>('GMAIL_APP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
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

      this.logger.log(`Email sent to ${data.to} via Gmail`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}:`, error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'https://robovers.com',
    );
    const verificationPageUrl = `${frontendUrl}/auth/verify-email`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">이메일 인증</h2>
        <p>안녕하세요!</p>
        <p>Robovers 회원가입을 환영합니다. 아래 인증 코드를 사용하여 이메일을 인증해주세요.</p>
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #007bff;">
            ${this.escapeHtml(token)}
          </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.escapeHtml(verificationPageUrl)}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            인증 페이지로 이동
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          이 인증 코드는 1시간 동안 유효합니다.
        </p>
        <p style="color: #999; font-size: 12px;">
          본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '이메일 인증 - Robovers',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'https://robovers.com',
    );
    const resetPageUrl = `${frontendUrl}/auth/reset-password`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">비밀번호 재설정</h2>
        <p>안녕하세요!</p>
        <p>비밀번호 재설정을 요청하셨습니다. 아래 재설정 코드를 사용하여 새로운 비밀번호를 설정해주세요.</p>
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #28a745;">
            ${this.escapeHtml(token)}
          </p>
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
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'https://robovers.com',
    );

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
          <a href="${this.escapeHtml(frontendUrl)}" 
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
