import { EmailService } from '@/modules/user/domain/services/email.service.interface';

export interface EmailRecord {
  to: string;
  subject: string;
  html: string;
  timestamp: Date;
}

export class FakeEmailService implements EmailService {
  private sentEmails: EmailRecord[] = [];
  private shouldFailSend: boolean;
  private failureMessage?: string;

  constructor(options?: { shouldFailSend?: boolean; failureMessage?: string }) {
    this.shouldFailSend = options?.shouldFailSend || false;
    this.failureMessage = options?.failureMessage;
  }

  setShouldFailSend(shouldFail: boolean, message?: string): void {
    this.shouldFailSend = shouldFail;
    this.failureMessage = message;
  }

  getSentEmails(): EmailRecord[] {
    return [...this.sentEmails];
  }

  getLastSentEmail(): EmailRecord | undefined {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  getEmailsSentTo(email: string): EmailRecord[] {
    return this.sentEmails.filter(record => record.to === email);
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (this.shouldFailSend) {
      if (this.failureMessage) {
        throw new Error(this.failureMessage);
      }
      return false;
    }

    this.sentEmails.push({
      ...data,
      timestamp: new Date(),
    });

    return true;
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '이메일 인증 코드 - Robovers',
      html: `<div>인증 코드: ${code}</div>`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '비밀번호 재설정 - Robovers',
      html: `<div>재설정 토큰: ${token}</div>`,
    });
  }

  async sendWelcomeEmail(email: string, nickname: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `${nickname}님, Robovers에 오신 것을 환영합니다!`,
      html: `<div>환영합니다, ${nickname}님!</div>`,
    });
  }

  // 테스트용 유틸리티 메서드
  hasEmailBeenSentTo(email: string): boolean {
    return this.sentEmails.some(record => record.to === email);
  }

  getVerificationCodeFromEmail(email: string): string | null {
    const verificationEmail = this.sentEmails.find(
      record => record.to === email && record.subject.includes('인증 코드')
    );
    
    if (!verificationEmail) return null;
    
    // HTML에서 코드 추출 (간단한 구현)
    const match = verificationEmail.html.match(/인증 코드: (\d{6})/);
    return match ? match[1] : null;
  }

  getPasswordResetTokenFromEmail(email: string): string | null {
    const resetEmail = this.sentEmails.find(
      record => record.to === email && record.subject.includes('비밀번호 재설정')
    );
    
    if (!resetEmail) return null;
    
    // HTML에서 토큰 추출 (간단한 구현)
    const match = resetEmail.html.match(/재설정 토큰: ([A-Za-z0-9]+)/);
    return match ? match[1] : null;
  }
}