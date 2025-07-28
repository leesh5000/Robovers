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
      const code = '123456';

      // When
      const result = await service.sendVerificationEmail(email, code);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '이메일 인증 코드 - Robovers',
          html: expect.any(String),
        }),
      );

      // HTML 내용 검증
      const sentHtml = mockTransporter.sendMail.mock.calls[0][0].html;
      expect(sentHtml).toContain('이메일 인증');
      expect(sentHtml).toContain('123456');
      expect(sentHtml).toContain('6자리 코드');
      expect(sentHtml).toContain('1시간 동안 유효');
      expect(sentHtml).not.toContain('?token='); // URL에 토큰이 포함되지 않음
    });

    it('XSS 공격 패턴을 안전하게 이스케이프한다', async () => {
      // Given
      const email = 'user@example.com';
      const maliciousCode = '<script>alert("xss")</script>';

      // When
      const result = await service.sendVerificationEmail(email, maliciousCode);

      // Then
      expect(result).toBe(true);
      const sentHtml = mockTransporter.sendMail.mock.calls[0][0].html;
      expect(sentHtml).toContain(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
      );
      expect(sentHtml).not.toContain('<script>');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('비밀번호 재설정 이메일을 발송한다', async () => {
      // Given
      const email = 'user@example.com';
      const token = 'reset-token';

      // When
      const result = await service.sendPasswordResetEmail(email, token);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '비밀번호 재설정 - Robovers',
          html: expect.any(String),
        }),
      );

      // HTML 내용 검증
      const sentHtml = mockTransporter.sendMail.mock.calls[0][0].html;
      expect(sentHtml).toContain('비밀번호 재설정');
      expect(sentHtml).toContain(
        'http:&#x2F;&#x2F;localhost:4000&#x2F;auth&#x2F;reset-password',
      );
      expect(sentHtml).toContain('reset-token');
      expect(sentHtml).not.toContain('?token='); // URL에 토큰이 포함되지 않음
    });
  });

  describe('sendWelcomeEmail', () => {
    it('환영 이메일을 발송한다', async () => {
      // Given
      const email = 'user@example.com';
      const name = 'John Doe';

      // When
      const result = await service.sendWelcomeEmail(email, name);

      // Then
      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining('Robovers에 오신 것을 환영합니다!'),
          html: expect.any(String),
        }),
      );

      // HTML 내용 검증
      const sentHtml = mockTransporter.sendMail.mock.calls[0][0].html;
      expect(sentHtml).toContain('John Doe');
      expect(sentHtml).toContain('환영합니다');
      expect(sentHtml).toContain(
        '휴머노이드 로봇 정보를 공유하고 소통하는 커뮤니티',
      );
    });

    it('이름에 XSS 공격 패턴이 포함된 경우 안전하게 처리한다', async () => {
      // Given
      const email = 'user@example.com';
      const maliciousName = '<img src=x onerror=alert("xss")>';

      // When
      const result = await service.sendWelcomeEmail(email, maliciousName);

      // Then
      expect(result).toBe(true);
      const sentHtml = mockTransporter.sendMail.mock.calls[0][0].html;
      expect(sentHtml).not.toContain('<img');
      // HTML 이스케이핑이 되어있는지만 확인
      expect(sentHtml).toContain('&lt;img');
    });
  });
});
