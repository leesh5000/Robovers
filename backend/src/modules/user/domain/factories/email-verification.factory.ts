import { Injectable } from '@nestjs/common';
import { SnowflakeIdService } from '@/common/snowflake/snowflake-id.service';
import { EmailVerification } from '../entities/email-verification.entity';
import { Email } from '../value-objects/email.vo';
import { EmailVerificationCode } from '../value-objects/email-verification-code.vo';

export interface EmailVerificationFactoryInterface {
  create(email: Email): EmailVerification;
  reconstitute(data: {
    id: string;
    email: string;
    code: string;
    expiresAt: Date;
    attempts: number;
    createdAt: Date;
  }): EmailVerification;
}

@Injectable()
export class EmailVerificationFactory implements EmailVerificationFactoryInterface {
  constructor(private readonly snowflakeIdService: SnowflakeIdService) {}

  create(email: Email): EmailVerification {
    const id = this.snowflakeIdService.generateId();
    return EmailVerification.create({ id, email });
  }

  reconstitute(data: {
    id: string;
    email: string;
    code: string;
    expiresAt: Date;
    attempts: number;
    createdAt: Date;
  }): EmailVerification {
    return EmailVerification.reconstitute({
      id: data.id,
      email: Email.create(data.email),
      code: EmailVerificationCode.create(data.code),
      expiresAt: data.expiresAt,
      attempts: data.attempts,
      createdAt: data.createdAt,
    });
  }
}

export const EMAIL_VERIFICATION_FACTORY_TOKEN = Symbol('EmailVerificationFactory');