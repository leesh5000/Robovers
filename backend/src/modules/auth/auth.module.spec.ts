import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { AuthModule } from './auth.module';

describe('AuthModule', () => {
  let redisContainer: StartedTestContainer;

  beforeAll(async () => {
    // Redis 컨테이너 시작
    redisContainer = await new GenericContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();
  }, 30000); // 타임아웃 30초

  afterAll(async () => {
    // Redis 컨테이너 정리
    if (redisContainer) {
      await redisContainer.stop();
    }
  });
  describe('JWT_SECRET validation', () => {
    it('should throw error when JWT_SECRET is not defined', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              ignoreEnvFile: true,
              isGlobal: true,
              load: [
                () => ({
                  // JWT_SECRET is intentionally not provided
                  JWT_EXPIRES_IN: '7d',
                }),
              ],
            }),
            AuthModule,
          ],
        }).compile(),
      ).rejects.toThrow('JWT_SECRET must be defined in environment variables');
    });

    it('should throw error when JWT_SECRET is empty string', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              ignoreEnvFile: true,
              isGlobal: true,
              load: [
                () => ({
                  JWT_SECRET: '',
                  JWT_EXPIRES_IN: '7d',
                }),
              ],
            }),
            AuthModule,
          ],
        }).compile(),
      ).rejects.toThrow('JWT_SECRET must be defined in environment variables');
    });

    it('should throw error when JWT_SECRET contains only spaces', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              ignoreEnvFile: true,
              isGlobal: true,
              load: [
                () => ({
                  JWT_SECRET: '   ',
                  JWT_EXPIRES_IN: '7d',
                }),
              ],
            }),
            AuthModule,
          ],
        }).compile(),
      ).rejects.toThrow('JWT_SECRET must be defined in environment variables');
    });

    it('should initialize successfully when JWT_SECRET is properly defined', async () => {
      const redisHost = redisContainer.getHost();
      const redisPort = redisContainer.getMappedPort(6379);

      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
              () => ({
                JWT_SECRET: 'test-secret-key',
                JWT_EXPIRES_IN: '7d',
                REDIS_HOST: redisHost,
                REDIS_PORT: redisPort,
                NODE_ENV: 'test',
              }),
            ],
          }),
          AuthModule,
        ],
      }).compile();

      expect(moduleRef).toBeDefined();

      // Redis 연결 정리
      const redisClient = moduleRef.get('REDIS_CLIENT');
      if (redisClient && redisClient.disconnect) {
        await redisClient.disconnect();
      }

      await moduleRef.close();
    });
  });

  describe('Redis connection validation', () => {
    it('should throw error when Redis connection fails', async () => {
      // 잘못된 포트로 연결 시도하여 실패 유도
      await expect(
        Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              ignoreEnvFile: true,
              isGlobal: true,
              load: [
                () => ({
                  JWT_SECRET: 'test-secret-key',
                  JWT_EXPIRES_IN: '7d',
                  REDIS_HOST: 'localhost',
                  REDIS_PORT: 9999, // 잘못된 포트
                  NODE_ENV: 'test',
                }),
              ],
            }),
            AuthModule,
          ],
        }).compile(),
      ).rejects.toThrow('Failed to connect to Redis');
    });
  });
});
