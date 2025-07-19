import { Injectable } from '@nestjs/common';
import { EmailVerification as PrismaEmailVerification } from '@prisma/client';
import { EmailVerification } from '../../../domain/entities/email-verification.entity';
import { EmailVerificationFactory } from '../../../domain/factories/email-verification.factory';

@Injectable()
export class EmailVerificationMapper {
  constructor(private readonly factory: EmailVerificationFactory) {}

  toDomain(prismaEmailVerification: PrismaEmailVerification): EmailVerification {
    return this.factory.reconstitute({
      id: prismaEmailVerification.id,
      email: prismaEmailVerification.email,
      code: prismaEmailVerification.code,
      expiresAt: prismaEmailVerification.expiresAt,
      attempts: prismaEmailVerification.attempts,
      createdAt: prismaEmailVerification.createdAt,
    });
  }

  static toPersistence(
    emailVerification: EmailVerification
  ): Omit<PrismaEmailVerification, 'createdAt'> {
    return {
      id: emailVerification.id,
      email: emailVerification.email.value,
      code: emailVerification.code.value,
      expiresAt: emailVerification.expiresAt,
      attempts: emailVerification.attempts,
    };
  }
}