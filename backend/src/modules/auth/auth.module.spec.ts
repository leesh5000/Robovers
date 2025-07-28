import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';

describe('AuthModule', () => {
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
      }).compile();

      expect(moduleRef).toBeDefined();
      await moduleRef.close();
    });
  });
});
