import { User } from '../entities/user.entity';

export interface UserRepositoryInterface {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
  }): Promise<{ users: User[]; total: number }>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY_TOKEN = Symbol('UserRepositoryInterface');