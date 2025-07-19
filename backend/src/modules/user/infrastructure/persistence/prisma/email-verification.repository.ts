import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { EmailVerification } from '../../../domain/entities/email-verification.entity';
import { EmailVerificationRepositoryInterface } from '../../../domain/repositories/email-verification.repository.interface';
import { EmailVerificationMapper } from '../mappers/email-verification.mapper';

@Injectable()
export class EmailVerificationRepository implements EmailVerificationRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: EmailVerificationMapper,
  ) {}

  async save(verification: EmailVerification): Promise<EmailVerification> {
    const data = EmailVerificationMapper.toPersistence(verification);
    
    const savedVerification = await this.prisma.emailVerification.upsert({
      where: { email: data.email },
      update: data,
      create: data,
    });

    return this.mapper.toDomain(savedVerification);
  }

  async findByEmail(email: string): Promise<EmailVerification | null> {
    const verification = await this.prisma.emailVerification.findUnique({
      where: { email },
    });

    return verification ? this.mapper.toDomain(verification) : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.prisma.emailVerification.delete({
      where: { email },
    }).catch(() => {
      // Ignore if not found
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.emailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}