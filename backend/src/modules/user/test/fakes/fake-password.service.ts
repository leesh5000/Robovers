export class FakePasswordService {
  private hashPrefix = 'hashed_';

  async hash(password: string): Promise<string> {
    return `${this.hashPrefix}${password}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === `${this.hashPrefix}${password}`;
  }
}