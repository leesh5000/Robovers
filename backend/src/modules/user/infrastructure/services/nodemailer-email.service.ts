import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailServiceInterface } from '../../application/services/email.service.interface';

@Injectable()
export class NodemailerEmailService implements EmailServiceInterface {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Robovers" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Robovers 이메일 인증',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #2563eb; margin: 0;">🤖 Robovers</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">이메일 인증</h2>
            <p style="color: #666; line-height: 1.6;">
              안녕하세요!<br><br>
              Robovers 회원가입을 위한 인증 코드입니다.
            </p>
            <div style="background-color: #f3f4f6; padding: 20px; margin: 30px 0; text-align: center; border-radius: 8px;">
              <h3 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h3>
            </div>
            <p style="color: #666; line-height: 1.6;">
              이 인증 코드는 10분간 유효합니다.<br>
              본인이 요청한 것이 아니라면 이 이메일을 무시하세요.
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #999;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Robovers. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: `"Robovers" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Robovers에 오신 것을 환영합니다!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #2563eb; margin: 0;">🤖 Robovers</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">환영합니다, ${username}님!</h2>
            <p style="color: #666; line-height: 1.6;">
              Robovers 회원이 되신 것을 축하합니다!<br><br>
              이제 휴머노이드 로봇의 최신 정보를 확인하고,<br>
              다른 회원들과 지식을 공유할 수 있습니다.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${this.configService.get<string>('FRONTEND_URL')}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Robovers 시작하기
              </a>
            </div>
            <p style="color: #666; line-height: 1.6;">
              궁금한 점이 있으시면 언제든지 문의해 주세요.
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #999;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Robovers. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Robovers" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Robovers 비밀번호 재설정',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #2563eb; margin: 0;">🤖 Robovers</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">비밀번호 재설정</h2>
            <p style="color: #666; line-height: 1.6;">
              비밀번호 재설정을 요청하셨습니다.<br><br>
              아래 버튼을 클릭하여 새로운 비밀번호를 설정하세요.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                비밀번호 재설정
              </a>
            </div>
            <p style="color: #666; line-height: 1.6;">
              이 링크는 1시간 동안 유효합니다.<br>
              본인이 요청한 것이 아니라면 이 이메일을 무시하세요.
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #999;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Robovers. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}