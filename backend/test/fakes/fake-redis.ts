export class FakeRedis {
  private store = new Map<string, string>();
  private ttlStore = new Map<string, number>();
  private shouldFailConnection: boolean;
  private connected = false;
  private eventHandlers = new Map<string, Function[]>();

  constructor(options?: { shouldFailConnection?: boolean }) {
    this.shouldFailConnection = options?.shouldFailConnection || false;
  }

  async connect(): Promise<void> {
    if (this.shouldFailConnection) {
      throw new Error('Connection refused');
    }
    this.connected = true;
  }

  async get(key: string): Promise<string | null> {
    const ttl = this.ttlStore.get(key);
    if (ttl && Date.now() > ttl) {
      this.store.delete(key);
      this.ttlStore.delete(key);
      return null;
    }
    return this.store.get(key) || null;
  }

  async set(key: string, value: string, mode?: string, ttl?: number): Promise<'OK'> {
    this.store.set(key, value);
    if (mode === 'EX' && ttl) {
      this.ttlStore.set(key, Date.now() + ttl * 1000);
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    this.ttlStore.delete(key);
    return existed ? 1 : 0;
  }

  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async quit(): Promise<void> {
    this.connected = false;
  }

  async flushdb(): Promise<'OK'> {
    this.store.clear();
    this.ttlStore.clear();
    return 'OK';
  }
}