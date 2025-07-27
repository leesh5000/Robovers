# 백엔드 서버 실행 가이드

## 백엔드 서버 시작하기

1. **새 터미널 열기**

2. **백엔드 디렉토리로 이동**
   ```bash
   cd backend
   ```

3. **환경 변수 파일 확인**
   - `.env` 파일이 없다면 `.env.example`을 복사하여 생성
   ```bash
   copy .env.example .env
   ```

4. **Prisma 클라이언트 생성**
   ```bash
   npm run prisma:generate
   ```

5. **개발 서버 시작**
   ```bash
   npm run start:dev
   ```

## 서버가 정상적으로 실행되었는지 확인

서버가 실행되면 다음 메시지가 표시됩니다:
- `Application is running on: http://localhost:4010/api`
- `Swagger docs available at: http://localhost:4010/api/docs`

## 헬스체크

브라우저에서 다음 URL로 접속:
- http://localhost:4010/api/health

정상 응답:
```json
{
  "status": "ok",
  "timestamp": "2025-07-27T00:00:00.000Z"
}
```

## 문제 해결

### Docker 서비스 확인
```bash
docker-compose ps
```

모든 서비스가 실행 중인지 확인:
- robovers-postgres
- robovers-redis
- robovers-mailhog

### 서비스가 실행되지 않는 경우
```bash
docker-compose up -d
```

## 회원가입 테스트

백엔드 서버가 실행 중일 때:
1. http://localhost:4000/signup 접속
2. 회원가입 폼 작성
3. MailHog에서 이메일 확인: http://localhost:8025