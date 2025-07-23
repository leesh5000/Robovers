# Docker 구성 가이드

이 프로젝트는 Docker와 Docker Compose를 사용하여 전체 애플리케이션 스택을 컨테이너화합니다.

## 구성 요소

### 1. 인프라 서비스 (docker-compose.infra.yml)
- **PostgreSQL**: 메인 데이터베이스 (포트 5432)
- **Redis**: 캐싱 및 세션 저장소 (포트 6379)  
- **pgAdmin**: 데이터베이스 관리 도구 (포트 8080)

### 2. 애플리케이션 서비스 (docker-compose.yml)
- **Frontend**: Next.js 애플리케이션 (포트 3000)
- **Backend**: NestJS API 서버 (포트 4010)
- **Nginx**: 리버스 프록시 (포트 80/443) - production 프로파일

## 빠른 시작

### 사전 요구사항
- Docker 20.10+
- Docker Compose 2.0+
- PNPM (로컬 개발시)

### 실행 방법

편의를 위해 `docker-start.sh` 스크립트를 제공합니다:

```bash
# 실행 권한 부여 (최초 1회)
chmod +x docker-start.sh

# 인프라만 실행 (로컬 개발시)
./docker-start.sh infra

# 전체 개발 환경 실행
./docker-start.sh dev

# 프로덕션 환경 실행
./docker-start.sh prod

# 서비스 상태 확인
./docker-start.sh status

# 로그 확인
./docker-start.sh logs [service-name]

# 모든 서비스 중지
./docker-start.sh stop
```

### 수동 실행

```bash
# 인프라만 실행
docker-compose -f docker-compose.infra.yml up -d

# 전체 스택 실행
docker-compose up -d --build

# 특정 서비스만 재시작
docker-compose restart backend

# 로그 확인
docker-compose logs -f [service-name]
```

## 개발 워크플로

### 1. 로컬 개발 (권장)
```bash
# 1. 인프라 서비스 시작
./docker-start.sh infra

# 2. 데이터베이스 마이그레이션
cd backend && pnpm prisma:migrate:dev

# 3. 개발 서버 실행
pnpm dev
```

### 2. 전체 Docker 개발
```bash
# 개발 환경 실행
docker-compose -f docker-compose.yml up -d

# 코드 변경시 서비스 재시작
docker-compose restart backend
```

### 3. 프로덕션 배포
```bash
# 환경 변수 설정
cp .env.docker .env
# .env 파일을 프로덕션 값으로 수정

# 프로덕션 빌드 및 실행
./docker-start.sh prod
```

## 환경 변수

`.env.docker` 파일에서 환경 변수를 관리합니다:

- `DATABASE_URL`: PostgreSQL 연결 문자열
- `REDIS_URL`: Redis 연결 문자열
- `JWT_SECRET`: JWT 시크릿 키 (프로덕션에서 반드시 변경)
- `NEXT_PUBLIC_API_URL`: 프론트엔드에서 사용할 API URL

## 데이터베이스 관리

### pgAdmin 접속
- URL: http://localhost:8080
- Email: admin@robovers.com
- Password: admin123

### 데이터베이스 마이그레이션
```bash
# 개발 환경
docker-compose exec backend pnpm prisma:migrate:dev

# 프로덕션 환경
docker-compose exec backend pnpm prisma:migrate:deploy
```

## 트러블슈팅

### 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :4000
lsof -i :4010
lsof -i :5432

# 프로세스 종료
kill -9 [PID]
```

### 볼륨 초기화
```bash
# 모든 볼륨 삭제 (주의: 데이터 손실)
docker-compose down -v
```

### 이미지 재빌드
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache
```

## 프로덕션 고려사항

1. **환경 변수**: 모든 시크릿 값을 안전한 값으로 변경
2. **SSL 인증서**: Nginx SSL 설정을 위한 인증서 준비
3. **백업**: PostgreSQL 데이터 정기 백업 설정
4. **모니터링**: 컨테이너 상태 모니터링 도구 설정
5. **로깅**: 중앙화된 로깅 시스템 구성

## 성능 최적화

1. **멀티 스테이지 빌드**: Dockerfile에서 프로덕션 이미지 크기 최소화
2. **헬스체크**: 각 서비스의 상태를 모니터링
3. **리소스 제한**: docker-compose.yml에서 CPU/메모리 제한 설정 가능
4. **캐싱**: Nginx와 Redis를 활용한 캐싱 전략

## 보안

1. **비 root 사용자**: 컨테이너 내부에서 비 root 사용자로 실행
2. **네트워크 격리**: 서비스간 통신은 내부 네트워크만 사용
3. **환경 변수**: 민감한 정보는 환경 변수로 관리
4. **HTTPS**: 프로덕션에서는 반드시 SSL/TLS 설정