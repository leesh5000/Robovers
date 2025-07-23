import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const data = this.toPersistence(user);
    const savedUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        profileImageUrl: data.profileImageUrl,
        role: data.role,
        isActive: data.isActive,
        emailVerified: data.emailVerified,
        emailVerifiedAt: data.emailVerifiedAt,
        lastLoginAt: data.lastLoginAt,
      },
    });
    return this.toDomain(savedUser);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.toDomain(user) : null;
  }

  async findByNickname(nickname: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });
    return user ? this.toDomain(user) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByNickname(nickname: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { nickname },
    });
    return count > 0;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const data = this.toPersistence(user);
    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        profileImageUrl: data.profileImageUrl,
        role: data.role,
        isActive: data.isActive,
        emailVerified: data.emailVerified,
        emailVerifiedAt: data.emailVerifiedAt,
        lastLoginAt: data.lastLoginAt,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private toDomain(prismaUser: PrismaUser): UserEntity {
    return UserEntity.reconstitute({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      nickname: prismaUser.nickname,
      profileImageUrl: prismaUser.profileImageUrl,
      role: prismaUser.role,
      isActive: prismaUser.isActive,
      emailVerified: prismaUser.emailVerified,
      emailVerifiedAt: prismaUser.emailVerifiedAt,
      lastLoginAt: prismaUser.lastLoginAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  private toPersistence(user: UserEntity): any {
    return {
      id: user.getId() || undefined,
      email: user.getEmail(),
      password: user.getPassword(),
      nickname: user.getNickname(),
      profileImageUrl: user.getProfileImageUrl(),
      role: user.getRole(),
      isActive: user.isActiveUser(),
      emailVerified: user.isEmailVerified(),
      emailVerifiedAt: user.getEmailVerifiedAt(),
      lastLoginAt: user.getLastLoginAt(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}