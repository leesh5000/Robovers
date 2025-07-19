import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    
    const savedUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    });

    return UserMapper.toDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
  }): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map(UserMapper.toDomain),
      total,
    };
  }

  async update(user: User): Promise<User> {
    return this.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}