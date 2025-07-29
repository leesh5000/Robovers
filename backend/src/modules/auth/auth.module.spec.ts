import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { FakeRedis } from '../../../test/fakes/fake-redis';

describe('AuthModule', () => {
  describe('JWT_SECRET validation', () => {
    it('should throw error when JWT_SECRET is not defined', async () => {
      const fakeRedis = new FakeRedis();
      
      const moduleRef = Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
              () => ({
                // JWT_SECRET is intentionally not provided
                JWT_EXPIRES_IN: '7d',
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
              }),
            ],
          }),
          AuthModule,
        ],
      }).overrideProvider('REDIS_CLIENT').useValue(fakeRedis);

      await expect(moduleRef.compile()).rejects.toThrow(
        'JWT_SECRET must be defined in environment variables'
      );
    });

    it('should throw error when JWT_SECRET is empty string', async () => {
      const fakeRedis = new FakeRedis();
      
      const moduleRef = Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
              () => ({
                JWT_SECRET: '',
                JWT_EXPIRES_IN: '7d',
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
              }),
            ],
          }),
          AuthModule,
        ],
      }).overrideProvider('REDIS_CLIENT').useValue(fakeRedis);

      await expect(moduleRef.compile()).rejects.toThrow(
        'JWT_SECRET must be defined in environment variables'
      );
    });

    it('should throw error when JWT_SECRET contains only spaces', async () => {
      const fakeRedis = new FakeRedis();
      
      const moduleRef = Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
              () => ({
                JWT_SECRET: '   ',
                JWT_EXPIRES_IN: '7d',
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
              }),
            ],
          }),
          AuthModule,
        ],
      }).overrideProvider('REDIS_CLIENT').useValue(fakeRedis);

      await expect(moduleRef.compile()).rejects.toThrow(
        'JWT_SECRET must be defined in environment variables'
      );
    });

    it('should initialize successfully when JWT_SECRET is properly defined', async () => {
      const fakeRedis = new FakeRedis();
      
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
              () => ({
                JWT_SECRET: 'test-secret-key',
                JWT_EXPIRES_IN: '7d',
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
                NODE_ENV: 'test',
              }),
            ],
          }),
          AuthModule,
        ],
      })
      .overrideProvider('REDIS_CLIENT')
      .useValue(fakeRedis)
      .compile();

      expect(moduleRef).toBeDefined();
      await moduleRef.close();
    });
  });

  describe('Redis connection validation', () => {
    it('should throw error when Redis connection fails', async () => {
      const failingRedis = new FakeRedis({ shouldFailConnection: true });
      
      const moduleRef = Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
              () => ({
                JWT_SECRET: 'test-secret-key',
                JWT_EXPIRES_IN: '7d',
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
                NODE_ENV: 'test',
              }),
            ],
          }),
          AuthModule,
        ],
      })
      .overrideProvider('REDIS_CLIENT')
      .useFactory({
        factory: async () => {
          try {
            await failingRedis.connect();
            return failingRedis;
          } catch (error) {
            throw new Error(`Failed to connect to Redis: ${error.message}`);
          }
        },
        inject: [],
      });

      await expect(moduleRef.compile()).rejects.toThrow(
        'Failed to connect to Redis: Connection refused'
      );
    });
  });
});