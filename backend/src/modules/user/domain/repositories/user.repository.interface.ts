import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByNickname(nickname: string): Promise<UserEntity | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByNickname(nickname: string): Promise<boolean>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
