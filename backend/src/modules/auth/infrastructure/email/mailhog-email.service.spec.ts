import { Test, TestingModule } from '@nestjs/testing';
import { MailHogEmailService } from './mailhog-email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailHogEmailService', () => {
  let service: MailHogEmailService;
  let mockTransporter: any;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailHogEmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config: Record<string, string | number> = {
                MAILHOG_HOST: 'localhost',
                MAILHOG_PORT: 1025,
                EMAIL_FROM: 'noreply@robovers.com',
                EMAIL_FROM_NAME: 'Robovers',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailHogEmailService>(MailHogEmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('MailHog를 통해 이메일을 발송한다', async () => {
      // Given
      const emailData = {
        to: 'test@example.com',
        subject: '이메일 인증',
        html: '<p>테스트 이메일입니다</p>',
      };

      // When
      const result = await service.sendEmail(emailData);

      // Then
      expect(result).toBe(true);
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'localhost',
        port: 1025,
        secure: false,
        tls: {
          rejectUnauthorized: false,
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
      mockTransporter.sendMail.mockRejectedValue(new Error('발송 실패'));
      const emailData = {
        to: 'test@example.com',
        subject: '이메일 인증',
        html: '<p>테스트 이메일입니다</p>',
      };

      // When
      const result = await service.sendEmail(emailData);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('sendVerificationEmail', () => {
    it('인증 이메일을 발송한다', async () => {
      // Given
      const email = 'user@example.com';
      const token = 'verification-token';

      // When
      const result = await service.sendVerificationEmail(email, token);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '이메일 인증 코드 - Robovers',
          html: expect.stringContaining(token),
        }),
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('비밀번호 재설정 이메일을 발송한다', async () => {
      // Given
      const email = 'user@example.com';
      const token = 'reset-token';
      const resetUrl = `http://localhost:4000/auth/reset-password?token=${token}`;

      // When
      const result = await service.sendPasswordResetEmail(email, token);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '비밀번호 재설정 - Robovers',
          html: expect.stringContaining(resetUrl),
        }),
      );
    });
  });
});
