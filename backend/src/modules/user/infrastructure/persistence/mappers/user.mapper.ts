import { User as PrismaUser } from '@prisma/client';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Username } from '../../../domain/value-objects/username.vo';
import { Password } from '../../../domain/value-objects/password.vo';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      username: Username.create(prismaUser.username),
      password: Password.fromHash(prismaUser.password),
      firstName: prismaUser.firstName || undefined,
      lastName: prismaUser.lastName || undefined,
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
      username: user.username.value,
      password: user.password.value,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      bio: user.bio || null,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  }
}