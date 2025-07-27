import { Test, TestingModule } from '@nestjs/testing';
import { GmailEmailService } from './gmail-email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('GmailEmailService', () => {
  let service: GmailEmailService;
  let mockTransporter: any;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'gmail-message-id' }),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GmailEmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config: Record<string, string> = {
                GMAIL_USER: 'test@gmail.com',
                GMAIL_APP_PASSWORD: 'test-app-password',
                EMAIL_FROM: 'noreply@robovers.com',
                EMAIL_FROM_NAME: 'Robovers',
                FRONTEND_URL: 'https://robovers.com',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GmailEmailService>(GmailEmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('Gmail SMTP를 통해 이메일을 발송한다', async () => {
      // Given
      const emailData = {
        to: 'user@example.com',
        subject: '테스트 이메일',
        html: '<p>Gmail 테스트</p>',
      };

      // When
      const result = await service.sendEmail(emailData);

      // Then
      expect(result).toBe(true);
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: {
          user: 'test@gmail.com',
          pass: 'test-app-password',
        },
      });
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Robovers" <noreply@robovers.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });
    });

    it('이메일 발송 실패 시 false를 반환한다', async () => {
      // Given
      mockTransporter.sendMail.mockRejectedValue(new Error('Gmail 오류'));
      const emailData = {
        to: 'user@example.com',
        subject: '테스트 이메일',
        html: '<p>Gmail 테스트</p>',
      };

      // When
      const result = await service.sendEmail(emailData);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('sendVerificationEmail', () => {
    it('프로덕션 URL로 인증 이메일을 발송한다', async () => {
      // Given
      const email = 'newuser@example.com';
      const token = 'prod-verification-token';
      const expectedUrl =
        'https://robovers.com/auth/verify-email?token=' + token;

      // When
      const result = await service.sendVerificationEmail(email, token);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '이메일 인증 - Robovers',
          html: expect.stringContaining(expectedUrl),
        }),
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('프로덕션 URL로 비밀번호 재설정 이메일을 발송한다', async () => {
      // Given
      const email = 'user@example.com';
      const token = 'prod-reset-token';
      const expectedUrl =
        'https://robovers.com/auth/reset-password?token=' + token;

      // When
      const result = await service.sendPasswordResetEmail(email, token);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '비밀번호 재설정 - Robovers',
          html: expect.stringContaining(expectedUrl),
        }),
      );
    });
  });

  describe('sendWelcomeEmail', () => {
    it('환영 이메일을 발송한다', async () => {
      // Given
      const email = 'newuser@example.com';
      const nickname = '로봇매니아';

      // When
      const result = await service.sendWelcomeEmail(email, nickname);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: `${nickname}님, Robovers에 오신 것을 환영합니다!`,
          html: expect.stringContaining(nickname),
        }),
      );
    });
  });
});
