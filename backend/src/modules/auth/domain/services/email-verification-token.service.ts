import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailVerificationTokenService {
  constructor() {}

  async generateVerificationCode(): Promise<string> {
    // 6자리 랜덤 숫자 코드 생성
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async verifyCode(
    email: string,
    code: string,
    storedCode: string,
  ): Promise<{ isValid: boolean; email: string | null }> {
    // 코드 일치 여부 확인
    if (code === storedCode) {
      return { isValid: true, email };
    }

    return { isValid: false, email: null };
  }
}
