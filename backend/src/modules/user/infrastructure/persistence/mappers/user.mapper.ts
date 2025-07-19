import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { UserFactory } from '../../../domain/factories/user.factory';

@Injectable()
export class UserMapper {
  constructor(private readonly userFactory: UserFactory) {}

  toDomain(prismaUser: PrismaUser): User {
    return this.userFactory.reconstitute({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      nickname: prismaUser.nickname,
      profileImageUrl: prismaUser.profileImageUrl || undefined,
      bio: prismaUser.bio || undefined,
      role: prismaUser.role as UserRole,
      isActive: prismaUser.isActive,
      emailVerified: prismaUser.emailVerified,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  static toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      email: user.email.value,
      password: user.password.value,
      nickname: user.nickname.getValue,
      profileImageUrl: user.profileImageUrl || null,
      bio: user.bio || null,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  }
}