import { User } from '../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

let idCounter = 1;

export class FakeUserRepository implements UserRepositoryInterface {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();

  async save(user: User): Promise<User> {
    // Remove old indexes if updating
    const existingUser = this.users.get(user.id);
    if (existingUser) {
      this.emailIndex.delete(existingUser.email.value);
    }

    // Save user and update indexes
    this.users.set(user.id, user);
    this.emailIndex.set(user.email.value, user.id);
    
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const id = this.emailIndex.get(email);
    return id ? this.users.get(id) || null : null;
  }


  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
  }): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values());
    const total = users.length;

    // Apply ordering
    if (options?.orderBy) {
      const [field, direction] = Object.entries(options.orderBy)[0];
      users.sort((a, b) => {
        const aValue = this.getFieldValue(a, field);
        const bValue = this.getFieldValue(b, field);
        
        if (direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    // Apply pagination
    const skip = options?.skip || 0;
    const take = options?.take || users.length;
    users = users.slice(skip, skip + take);

    return { users, total };
  }

  async update(user: User): Promise<User> {
    return this.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      this.users.delete(id);
      this.emailIndex.delete(user.email.value);
    }
  }

  // Test helper methods
  clear(): void {
    this.users.clear();
    this.emailIndex.clear();
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }

  size(): number {
    return this.users.size;
  }

  private getFieldValue(user: User, field: string): any {
    switch (field) {
      case 'email':
        return user.email.value;
      case 'nickname':
        return user.nickname.getValue;
      case 'createdAt':
        return user.createdAt;
      case 'updatedAt':
        return user.updatedAt;
      default:
        return null;
    }
  }
}