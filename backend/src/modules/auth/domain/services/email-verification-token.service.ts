import { Injectable } from '@nestjs/common';
import { randomInt, timingSafeEqual } from 'crypto';

@Injectable()
export class EmailVerificationTokenService {
  constructor() {}

  async generateVerificationCode(): Promise<string> {
    // 6자리 암호학적으로 안전한 랜덤 숫자 코드 생성
    const code = randomInt(100000, 1000000);
    return code.toString();
  }

  async verifyCode(
    email: string,
    code: string,
    storedCode: string,
  ): Promise<{ isValid: boolean; email: string | null }> {
    // Timing attack 방지를 위한 constant-time 비교
    const codeBuffer = Buffer.from(code);
    const storedCodeBuffer = Buffer.from(storedCode);

    // 길이가 다르면 즉시 false 반환 (이는 안전함)
    if (codeBuffer.length !== storedCodeBuffer.length) {
      return { isValid: false, email: null };
    }

    // timingSafeEqual을 사용한 안전한 비교
    const isValid = timingSafeEqual(codeBuffer, storedCodeBuffer);

    return { isValid, email: isValid ? email : null };
  }
}
