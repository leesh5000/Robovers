export class FakeSnowflakeIdService {
  private counter = 1;

  generateId(): string {
    return String(this.counter++);
  }

  reset(): void {
    this.counter = 1;
  }
}